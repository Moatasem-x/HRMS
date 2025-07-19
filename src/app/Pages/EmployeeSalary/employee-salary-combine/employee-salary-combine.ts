import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSalaryFilterComponent } from '../../../Components/employee-salary-filter/employee-salary-filter';
import { EmployeeSalaryTableComponent } from '../../../Components/employee-salary-table/employee-salary-table';
import { IEmployeeSalaryFilter } from '../../../Interfaces/iemployee-salary';

@Component({
  selector: 'app-employee-salary-combine',
  standalone: true,
  imports: [CommonModule, EmployeeSalaryFilterComponent, EmployeeSalaryTableComponent],
  templateUrl: './employee-salary-combine.html',
  styleUrls: ['./employee-salary-combine.css']
})
export class EmployeeSalaryCombineComponent {
  currentFilter: IEmployeeSalaryFilter = {
    employeeName: '',
    month: '',
    year: ''
  };

  onFilterChanged(filter: IEmployeeSalaryFilter): void {
    this.currentFilter = filter;
  }
} 