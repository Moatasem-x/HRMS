import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ISalaryReport } from '../../Interfaces/isalary-report';
import { SalaryReportService } from '../../Services/salary-report-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-salary-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-salary-table.html',
  styleUrls: ['./employee-salary-table.css']
})
export class EmployeeSalaryTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filter: {
    employeeName: string;
    month: string;
    year: string;
  } = {
    employeeName: '',
    month: '',
    year: ''
  };

  salaryReports: ISalaryReport[] = [];
  filteredReports: ISalaryReport[] = [];
  subs: Subscription[] = [];
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private salaryReportService: SalaryReportService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadSalaryReports();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      console.log('Filter changed:', this.filter);
      this.applyFilter();
    }
  }

  loadSalaryReports(): void {
    this.subs.push(this.salaryReportService.getSalaryReports().subscribe({
      next: (data) => {
        this.salaryReports = data;
        console.log('Loaded salary reports:', data.length);
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading salary reports:', error);
      }
    }));
  }

  applyFilter(): void {
    console.log('Applying filter:', this.filter);
    console.log('Total reports before filter:', this.salaryReports.length);
    
    this.filteredReports = this.salaryReports.filter(report => {
      const matchesEmployeeName = !this.filter.employeeName || 
        report.employeeName.toLowerCase().includes(this.filter.employeeName.toLowerCase());
      
      const matchesMonth = !this.filter.month || 
        report.month.toString() === this.filter.month;
      
      const matchesYear = !this.filter.year || 
        report.year.toString() === this.filter.year;
      
      return matchesEmployeeName && matchesMonth && matchesYear;
    });
    console.log(this.salaryReports);
    
    this.currentPage = 1; // Reset to first page when filter changes
  }

  get paginatedReports(): ISalaryReport[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredReports.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReports.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || '';
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
} 