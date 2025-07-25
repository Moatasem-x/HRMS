import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ISalaryReport } from '../../Interfaces/isalary-report';
import { SalaryReportService } from '../../Services/salary-report-service';
import { Subscription } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-employee-salary-table',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './employee-salary-table.html',
  styleUrls: ['./employee-salary-table.css']
})
export class EmployeeSalaryTable implements OnInit, OnChanges, OnDestroy {
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

  constructor(private salaryReportService: SalaryReportService, private cdr: ChangeDetectorRef, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.spinner.show();
    this.loadSalaryReports();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.spinner.show();
      this.applyFilter();
    }
  }

  loadSalaryReports(): void {
    this.subs.push(this.salaryReportService.getSalaryReports().subscribe({
      next: (data) => {
        this.salaryReports = data;
      },
      error: (error) => {
        this.spinner.hide();
      },
      complete: () => {
        this.applyFilter();
        this.cdr.detectChanges();
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
    this.cdr.detectChanges();
    this.spinner.hide();
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