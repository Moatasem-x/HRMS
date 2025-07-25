import { Component, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { EmployeeService } from '../../Services/employee-service';
import { DepartmentService } from '../../Services/department-service';
import { AttendanceService } from '../../Services/attendance-service';
import { Subscription } from 'rxjs';
import { IDepartment } from '../../Interfaces/idepartment';
import { TasksService } from '../../Services/tasks-service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-hr-dashboard',
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './hr-dashboard.html',
  styleUrl: './hr-dashboard.css'
})
export class HRDashboard implements AfterViewInit, OnInit, OnDestroy {
  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private attendanceService: AttendanceService,
    private tasksService: TasksService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {}


  totalEmployees: number = 0;
  totalDepartments: number = 0;
  attendanceToday: number = 0;
  absenteesToday: number = 0;
  subs:Subscription[] = [];
  @ViewChild('attendanceChartCanvas') attendanceChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('performanceChartCanvas') performanceChartCanvas!: ElementRef<HTMLCanvasElement>;

  attendanceData: any[] = [];
  attendanceChart: Chart | null = null;
  performanceChart: Chart | null = null;
  viewInitialized = false;
  attendanceLoaded = false;
  departments: IDepartment[] = [];
  allTasks: any[] = [];

  ngOnInit(): void {
    this.spinner.show();
    this.subs.push(this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.totalEmployees = employees.length;
        this.cdr.detectChanges();
      }
    }));

    this.subs.push(this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.totalDepartments = departments.length;
        this.cdr.detectChanges();
      }
    }));

    this.subs.push(this.attendanceService.getAttendances().subscribe({
      next: (attendances) => {
        this.attendanceData = attendances;
        this.attendanceLoaded = true;
        this.updateAttendanceStatsAndChart();
      }
    }));

    this.subs.push(this.tasksService.getAllTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks || [];
        this.createPerformanceChart();
      },
      error: (err) => {
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    }));
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    this.updateAttendanceStatsAndChart();
    this.createPerformanceChart();
  }

  updateAttendanceStatsAndChart() {
    if (!this.viewInitialized || !this.attendanceLoaded) return;
    const attendances = this.attendanceData;
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    this.attendanceToday = attendances.filter(a => a.attendanceDate.slice(0, 10) === todayStr).length;
    this.absenteesToday = this.totalEmployees - this.attendanceToday;
    // --- Dynamic Attendance Chart Data (skip Friday/Saturday) ---
    function isWeekend(date: Date) {
      // 5 = Friday, 6 = Saturday
      return date.getDay() === 5 || date.getDay() === 6;
    }
    // Get last N working days (excluding Fri/Sat), ending with today or most recent working day
    function getLastNWorkingDays(n: number, endDate: Date) {
      const days: string[] = [];
      let d = new Date(endDate);
      while (days.length < n) {
        if (!isWeekend(d)) {
          days.unshift(d.toISOString().slice(0, 10));
        }
        d.setDate(d.getDate() - 1);
      }
      return days;
    }
    // Helper to get weekday short name
    function getWeekdayShort(dateStr: string) {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    }
    // Last 5 working days (ending with today or most recent working day)
    const last5Days = getLastNWorkingDays(5, today);
    const last5Labels = last5Days.map(getWeekdayShort);
    // Current week data
    const currentWeekData = last5Days.map(dateStr =>
      attendances.filter(a => a.attendanceDate.slice(0, 10) === dateStr).length
    );
    // Previous week (same weekdays, but 7 days earlier)
    const prev5Days = last5Days.map(dateStr => {
      const d = new Date(dateStr);
      d.setDate(d.getDate() - 7);
      // If the mapped day is a weekend, keep subtracting until a working day
      while (isWeekend(d)) {
        d.setDate(d.getDate() - 1);
      }
      return d.toISOString().slice(0, 10);
    });
    const prevWeekData = prev5Days.map(dateStr =>
      attendances.filter(a => a.attendanceDate.slice(0, 10) === dateStr).length
    );
    // Destroy previous chart if exists
    if (this.attendanceChart) {
      this.attendanceChart.destroy();
    }
    // Create chart only if canvas is available
    if (this.attendanceChartCanvas && this.attendanceChartCanvas.nativeElement) {
      this.attendanceChart = new Chart(this.attendanceChartCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: last5Labels,
          datasets: [
            {
              label: 'Current Week',
              data: currentWeekData,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59,130,246,0.08)',
              tension: 0.4,
              fill: true,
              pointRadius: 3
            },
            {
              label: 'Last Week',
              data: prevWeekData,
              borderColor: '#f59e42',
              backgroundColor: 'rgba(245,158,66,0.08)',
              tension: 0.4,
              fill: true,
              pointRadius: 3
            }
          ]
        },
        options: {
          plugins: { legend: { display: true } },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, grid: { color: '#f3f3f3' } },
            x: { grid: { color: '#f3f3f3' } }
          }
        }
      });
    }
    this.cdr.detectChanges();
  }

  createPerformanceChart() {
    // Destroy previous chart if exists
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }
    // Prepare department names
    const departmentNames = this.departments.map(d => d.departmentName);
    // Prepare done and pending counts for each department
    const doneCounts = departmentNames.map(name =>
      this.allTasks.filter(t => t.departmentName === name && t.status === 'Done').length
    );
    const pendingCounts = departmentNames.map(name =>
      this.allTasks.filter(t => t.departmentName === name && t.status === 'Pending').length
    );
    if (this.performanceChartCanvas && this.performanceChartCanvas.nativeElement) {
      this.performanceChart = new Chart(this.performanceChartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: departmentNames,
          datasets: [
            {
              label: 'Done Tasks',
              data: doneCounts,
              backgroundColor: '#3b82f6',
              borderRadius: 8,
              barPercentage: 0.5
            },
            {
              label: 'Pending Tasks',
              data: pendingCounts,
              backgroundColor: '#eab308',
              borderRadius: 8,
              barPercentage: 0.5
            }
          ]
        },
        options: {
          indexAxis: 'y',
          plugins: { legend: { display: true } },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { beginAtZero: true, grid: { color: '#f3f3f3' } },
            y: { grid: { color: '#f3f3f3' } }
          }
        }
      });
    }
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    if (this.attendanceChart) this.attendanceChart.destroy();
    if (this.performanceChart) this.performanceChart.destroy();
  }


} 