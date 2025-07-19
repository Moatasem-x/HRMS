import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IEmployeeSalary, IEmployeeSalaryFilter } from '../../Interfaces/iemployee-salary';
import { EmployeeSalaryService } from '../../Services/employee-salary-service';

@Component({
  selector: 'app-employee-salary-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-salary-table.html',
  styleUrls: ['./employee-salary-table.css']
})
export class EmployeeSalaryTableComponent implements OnInit, OnChanges {
  @Input() filter: IEmployeeSalaryFilter = {
    employeeName: '',
    month: '',
    year: ''
  };

  employeeSalaries: IEmployeeSalary[] = [];
  editingRow: number | null = null;
  editedSalary: IEmployeeSalary | null = null;
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private employeeSalaryService: EmployeeSalaryService) {}

  ngOnInit(): void {
    this.loadEmployeeSalaries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.loadEmployeeSalaries();
    }
  }

  loadEmployeeSalaries(): void {
    this.employeeSalaryService.getEmployeeSalaries(this.filter).subscribe(data => {
      this.employeeSalaries = data;
    });
  }

  startEdit(salary: IEmployeeSalary): void {
    this.editingRow = salary.employeeId;
    this.editedSalary = { ...salary };
  }

  saveEdit(): void {
    if (this.editedSalary) {
      this.employeeSalaryService.updateEmployeeSalary(this.editedSalary).subscribe(() => {
        this.loadEmployeeSalaries();
        this.cancelEdit();
      });
    }
  }

  cancelEdit(): void {
    this.editingRow = null;
    this.editedSalary = null;
  }

  deleteSalary(employeeId: number): void {
    if (confirm('Are you sure you want to delete this record?')) {
      this.employeeSalaryService.deleteEmployeeSalary(employeeId).subscribe(() => {
        this.loadEmployeeSalaries();
      });
    }
  }

  printSalary(salary: IEmployeeSalary): void {
    // Implementation for printing salary slip
    console.log('Printing salary for:', salary.employeeName);
    // You can implement actual printing logic here
  }

  get paginatedSalaries(): IEmployeeSalary[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.employeeSalaries.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.employeeSalaries.length / this.itemsPerPage);
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
} 