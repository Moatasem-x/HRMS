import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-salary-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-salary-filter.html',
  styleUrls: ['./employee-salary-filter.css']
})
export class EmployeeSalaryFilter implements OnInit {
  @Output() filterChanged = new EventEmitter<{
    employeeName: string;
    month: string;
    year: string;
  }>();

  filter: {
    employeeName: string;
    month: string;
    year: string;
  } = {
    employeeName: '',
    month: '',
    year: ''
  };

  months: { value: string; label: string }[] = [];
  years: string[] = [];

  ngOnInit(): void {
    this.initializeMonths();
    this.initializeYears();
    
    // Set default values to current month and year
    const currentDate = new Date();
    this.filter.month = (currentDate.getMonth() + 1).toString();
    this.filter.year = currentDate.getFullYear().toString();
  }

  initializeMonths(): void {
    this.months = [
      { value: '1', label: 'January' },
      { value: '2', label: 'February' },
      { value: '3', label: 'March' },
      { value: '4', label: 'April' },
      { value: '5', label: 'May' },
      { value: '6', label: 'June' },
      { value: '7', label: 'July' },
      { value: '8', label: 'August' },
      { value: '9', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' }
    ];
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];
    // Generate years from 2020 to current year + 2
    for (let year = 2020; year <= currentYear; year++) {
      this.years.push(year.toString());
    }
  }

  onSearch(): void {
    this.filterChanged.emit(this.filter);
  }

  onClear(): void {
    const currentDate = new Date();
    this.filter = {
      employeeName: '',
      month: (currentDate.getMonth() + 1).toString(),
      year: currentDate.getFullYear().toString()
    };
    this.filterChanged.emit(this.filter);
  }
} 