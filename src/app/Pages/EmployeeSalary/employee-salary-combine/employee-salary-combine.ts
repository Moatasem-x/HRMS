import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition, query, group } from '@angular/animations';
import { SalaryReportService } from '../../../Services/salary-report-service';
import { ISalaryReport } from '../../../Interfaces/isalary-report';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-salary-combine',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './employee-salary-combine.html',
  styleUrls: ['./employee-salary-combine.css'],
  animations: [
    trigger("expand",[
      transition(":enter", [
        style({height: 0,opacity: 0}),
        query(".details",[
          style({translate: "0 -100%"})
        ]),
        group([
          animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({height: "*", opacity: 1})),
          query(".details",[
            animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({translate: "0 0"}))
          ])
        ])
      ]),
      transition(":leave",[
        style({height: "*", opacity: 1}),
        query(".details",[
          style({translate: "0 0"})
        ]),
        group([
          animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({height: 0,opacity: 0})),
          query(".details",[
            animate("0.8s cubic-bezier(0.4, 0, 0.2, 1)", style({translate: "0 -100%"}))
          ])
        ])
      ])
    ])
  ]
})
export class EmployeeSalaryCombine implements OnInit, OnDestroy {
  salaryReports: ISalaryReport[] = [];
  filteredReports: ISalaryReport[] = [];
  subs: Subscription[] = [];

  // New properties for grouping and search
  searchTerm = '';
  selectedMonth = '';
  selectedYear = '';
  expandedGroups = new Set<string>([]);
  isNavigatingAway = false;

  // Month and year options
  months = [
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

  years: number[] = [];

  constructor(
    private salaryReportService: SalaryReportService, 
    private cdr: ChangeDetectorRef, 
    private spinner: NgxSpinnerService
  ) {
    // Generate years from 2020 to current year + 1
    const currentYear = new Date().getFullYear();
    for (let year = 2020; year <= currentYear + 1; year++) {
      this.years.push(year);
    }
  }

  ngOnInit() {
    this.spinner.show();
    this.loadSalaryReports();
  }

  loadSalaryReports() {
    this.subs.push(this.salaryReportService.getSalaryReports().subscribe({
      next: (data) => {
        this.salaryReports = data;
        this.filteredReports = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.spinner.hide();
      },
      complete: () => {
        this.expandedGroups.add('All');
        this.cdr.detectChanges();
        this.spinner.hide();
      }
    }));
  }

  // Get department groups for grouping
  get departmentGroups(): string[] {
    const allDepartments = this.filteredReports.map(r => r.departmentName || 'Unknown');
    return ['All', ...Array.from(new Set(allDepartments))];
  }

  // Get grouped salary reports
  get groupedSalaryReports(): { [group: string]: ISalaryReport[] } {
    const groups: { [group: string]: ISalaryReport[] } = {};
    for (const report of this.getSalaryReportsByGroup()) {
      const dept = report.departmentName || 'Unknown';
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(report);
    }
    
    // Sort records within each group by employee name
    Object.keys(groups).forEach(dept => {
      groups[dept].sort((a, b) => {
        const nameA = a.employeeName || '';
        const nameB = b.employeeName || '';
        return nameA.localeCompare(nameB);
      });
    });
    
    return groups;
  }

  // Group management methods
  isGroupExpanded(group: string): boolean {
    return this.expandedGroups.has(group);
  }

  toggleGroup(group: string): void {
    if (this.expandedGroups.has(group)) {
      this.expandedGroups.delete(group);
    } else {
      this.expandedGroups.add(group);
    }
  }

  // Filter salary reports by search, month, and year
  getSalaryReportsByGroup(): ISalaryReport[] {
    let filtered = this.salaryReports;
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(r => 
        r.employeeName && r.employeeName.toLowerCase().includes(term)
      );
    }
    
    // Apply month filter
    if (this.selectedMonth) {
      filtered = filtered.filter(r => r.month.toString() === this.selectedMonth);
    }
    
    // Apply year filter
    if (this.selectedYear) {
      filtered = filtered.filter(r => r.year.toString() === this.selectedYear);
    }
    
    // Sort by year and month in descending order (newest first)
    return filtered.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year; // Newest year first
      }
      return b.month - a.month; // Newest month first
    });
  }

  // Apply filters
  applyFilters() {
    this.spinner.show();
    this.filteredReports = this.getSalaryReportsByGroup();
    this.cdr.detectChanges();
    this.spinner.hide();
  }

  // Get month name
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