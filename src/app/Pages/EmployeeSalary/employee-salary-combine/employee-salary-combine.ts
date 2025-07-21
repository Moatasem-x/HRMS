import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSalaryFilter } from '../../../Components/employee-salary-filter/employee-salary-filter';
import { EmployeeSalaryTable } from '../../../Components/employee-salary-table/employee-salary-table';

@Component({
  selector: 'app-employee-salary-combine',
  standalone: true,
  imports: [CommonModule, EmployeeSalaryFilter, EmployeeSalaryTable],
  templateUrl: './employee-salary-combine.html',
  styleUrls: ['./employee-salary-combine.css']
})
export class EmployeeSalaryCombine {
  currentFilter: {
    employeeName: string;
    month: string;
    year: string;
  } = {
    employeeName: '',
    month: '',
    year: ''
  };

  onFilterChanged(filter: {
    employeeName: string;
    month: string;
    year: string;
  }): void {
    // Create a new object reference to trigger change detection
    this.currentFilter = { ...filter };
  }
} 