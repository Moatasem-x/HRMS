import { Component, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

const chartFont = { size: 16, family: 'Inter, Arial, sans-serif' };
const chartFontColor = '#111';

@Component({
  selector: 'app-employee-dashboard',
  imports: [CommonModule],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css'
})
export class EmployeeDashboard implements AfterViewInit, OnInit, OnDestroy {
  employee: any = {
    employeeId: 1,
    fullName: 'Mohamed Ahmed Ismail',
    email: 'mohamed.ismail@example.com',
    departmentName: 'Development',
    phoneNumber: '+201234567890'
  };
  attendanceData: any[] = [
    { attendanceDate: this.getDateOffset(0) },
    { attendanceDate: this.getDateOffset(1) },
    { attendanceDate: this.getDateOffset(2) },
    { attendanceDate: this.getDateOffset(4) },
    { attendanceDate: this.getDateOffset(6) }
  ]; // 5/7 days present
  salaryData: any = {
    netSalary: 5000,
    totalDeduction: 200,
    totalOvertime: 300
  };
  pendingLeaves: number = 2;
  tasksData: any = {
    completed: 12,
    inProgress: 5,
    pending: 3
  };
  attendanceChart: Chart | null = null;
  salaryChart: Chart | null = null;
  tasksChart: Chart | null = null;
  @ViewChild('attendanceChartCanvas') attendanceChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('salaryChartCanvas') salaryChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tasksChartCanvas') tasksChartCanvas!: ElementRef<HTMLCanvasElement>;
  viewInitialized = false;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.viewInitialized = true;
    this.updateAttendanceChart();
    this.updateSalaryChart();
    this.updateTasksChart();
  }

  updateAttendanceChart() {
    if (!this.viewInitialized) return;
    const present = this.attendanceData.length;
    const absent = 7 - present;
    if (this.attendanceChart) this.attendanceChart.destroy();
    if (this.attendanceChartCanvas && this.attendanceChartCanvas.nativeElement) {
      this.attendanceChart = new Chart(this.attendanceChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Present', 'Absent'],
          datasets: [{
            data: [present, absent],
            backgroundColor: ['#3b82f6', '#ef5350']
          }]
        },
        options: {
          cutout: '70%',
          plugins: {
            legend: { display: true, labels: { font: chartFont, color: chartFontColor } },
            tooltip: { bodyFont: chartFont, titleFont: chartFont }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  updateSalaryChart() {
    if (!this.viewInitialized || !this.salaryData) return;
    if (this.salaryChart) this.salaryChart.destroy();
    if (this.salaryChartCanvas && this.salaryChartCanvas.nativeElement) {
      this.salaryChart = new Chart(this.salaryChartCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Net Salary', 'Deductions', 'Overtime'],
          datasets: [{
            data: [this.salaryData.netSalary, this.salaryData.totalDeduction, this.salaryData.totalOvertime],
            backgroundColor: ['#3b82f6', '#ef5350', '#66bb6a']
          }]
        },
        options: {
          cutout: '70%',
          plugins: {
            legend: { display: true, labels: { font: chartFont, color: chartFontColor } },
            tooltip: { bodyFont: chartFont, titleFont: chartFont }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  updateTasksChart() {
    if (!this.viewInitialized || !this.tasksData) return;
    if (this.tasksChart) this.tasksChart.destroy();
    if (this.tasksChartCanvas && this.tasksChartCanvas.nativeElement) {
      this.tasksChart = new Chart(this.tasksChartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Completed', 'In Progress', 'Pending'],
          datasets: [{
            label: 'Tasks',
            data: [this.tasksData.completed, this.tasksData.inProgress, this.tasksData.pending],
            backgroundColor: ['#66bb6a', '#f59e42', '#ab47bc'],
            borderRadius: 8
          }]
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: { bodyFont: chartFont, titleFont: chartFont }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { font: chartFont, color: chartFontColor }
            },
            x: {
              ticks: { font: chartFont, color: chartFontColor }
            }
          }
        }
      });
    }
  }

  getLastNDays(n: number) {
    const days = [];
    let d = new Date();
    for (let i = 0; i < n; i++) {
      const date = new Date(d);
      days.unshift({ date: date.toISOString().slice(0,10), label: date.toLocaleDateString('en-US', { weekday: 'short' }) });
      d.setDate(d.getDate() - 1);
    }
    return days;
  }

  getDateOffset(offset: number) {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return d.toISOString().slice(0,10);
  }

  ngOnDestroy(): void {
    if (this.attendanceChart) this.attendanceChart.destroy();
    if (this.salaryChart) this.salaryChart.destroy();
    if (this.tasksChart) this.tasksChart.destroy();
  }
}
