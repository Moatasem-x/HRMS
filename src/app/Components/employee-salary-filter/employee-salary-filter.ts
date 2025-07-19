import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IEmployeeSalaryFilter } from '../../Interfaces/iemployee-salary';
import { EmployeeSalaryService } from '../../Services/employee-salary-service';

@Component({
  selector: 'app-employee-salary-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-salary-filter.html',
  styleUrls: ['./employee-salary-filter.css']
})
export class EmployeeSalaryFilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<IEmployeeSalaryFilter>();

  filter: IEmployeeSalaryFilter = {
    employeeName: '',
    month: '',
    year: ''
  };

  months: string[] = [];
  years: string[] = [];

  constructor(private employeeSalaryService: EmployeeSalaryService) {}

  ngOnInit(): void {
    this.months = this.employeeSalaryService.getMonths();
    this.years = this.employeeSalaryService.getYears();
    
    // Set default values
    const currentDate = new Date();
    this.filter.month = this.months[currentDate.getMonth()];
    this.filter.year = currentDate.getFullYear().toString();
  }

  onSearch(): void {
    this.filterChanged.emit(this.filter);
  }

  onClear(): void {
    this.filter = {
      employeeName: '',
      month: this.months[new Date().getMonth()],
      year: new Date().getFullYear().toString()
    };
    this.filterChanged.emit(this.filter);
  }
} 