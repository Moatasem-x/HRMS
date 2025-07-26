import { Component, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { AuthService } from '../../Services/auth-service';
import { EmployeeService } from '../../Services/employee-service';
import { IEmployee } from '../../Interfaces/iemployee';
import { Subscription } from 'rxjs';
import { AttendanceService } from '../../Services/attendance-service';
import { IAttendance } from '../../Interfaces/iattendance';
import { RequestHolidayService } from '../../Services/request-holiday-service';
import { SalaryReportService } from '../../Services/salary-report-service';
import { ISalaryReport } from '../../Interfaces/isalary-report';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { TasksService } from '../../Services/tasks-service';
import { ITask } from '../../Interfaces/itask';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

const chartFont = { size: 16, family: 'Inter, Arial, sans-serif' };
const chartFontColor = '#111';

@Component({
  selector: 'app-employee-dashboard',
  imports: [CommonModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css'
})
export class EmployeeDashboard implements AfterViewInit, OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private requestHolidayService: RequestHolidayService,
    private salaryReportService: SalaryReportService,
    private fb: FormBuilder,
    private tasksService: TasksService,
    private spinner: NgxSpinnerService
  ) {}

  employee!: IEmployee;
  subs: Subscription[] = [];
  attendanceData: IAttendance[] = [];
  salaryData!: ISalaryReport;
  pendingLeaves: number = 2;
  employeeTasks: ITask[] = [];
  attendanceChart: Chart | null = null;
  salaryChart: Chart | null = null;
  tasksChart: Chart | null = null;
  totalAttendancesThisMonth: number = 0;
  totalAbsencesThisMonth: number = 0;
  todayAttendance: IAttendance | null = null;
  attendanceStatus: 'not_checked_in' | 'checked_in' | 'checked_out' = 'not_checked_in';
  isEditingProfile = false;
  profileForm!: FormGroup;
  @ViewChild('attendanceChartCanvas') attendanceChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('salaryChartCanvas') salaryChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tasksChartCanvas') tasksChartCanvas!: ElementRef<HTMLCanvasElement>;
  viewInitialized = false;

  ngOnInit(): void {
    this.spinner.show();
    this.getEmployee();
    this.initProfileForm();
    this.cdr.detectChanges();
  }

  initProfileForm() {
    this.profileForm = this.fb.group({
      address: [this.employee?.address || '', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      phoneNumber: [this.employee?.phoneNumber || '', [Validators.required, Validators.pattern(/^\+20[0125][0-9]{9}$/)]]
    });
  }

  openProfileEdit() {
    this.isEditingProfile = true;
    this.profileForm.patchValue({
      address: this.employee?.address || '',
      phoneNumber: this.employee?.phoneNumber || ''
    });
  }

  cancelProfileEdit() {
    this.isEditingProfile = false;
  }

  saveProfileEdit() {
    if (this.profileForm.invalid || !this.employee) {
      this.profileForm.markAllAsTouched();
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        this.subs.push(this.employeeService.editCurrentEmployeeProfile(this.profileForm.value).subscribe({
          next: (resp) => {
            Swal.fire({
              title: "Success!",
              text: "Profile Has Been Updated Successfully.",
              icon: "success"
            });
            this.isEditingProfile = false;
            this.getEmployee();
          },
          error: (err) => {

            if (err.error.message == "Duplicate phone number") {
            Swal.fire({
              title: "Error!",
              text: "Phone number already exists.",
              icon: "error"
            });
            }
            else
            {
              Swal.fire({
              title: "Error!",
              text: "Failed to update profile.",
              icon: "error"
              });
          }
          }
        }));
      }
    });
    
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    this.updateAttendanceChart();
    this.updateTasksChart();
  }

  getEmployee() {
    this.subs.push(this.employeeService.getCurrentEmployee().subscribe({
      next: (employee) => {
        this.employee = employee;
        this.getSalaryReport();
        this.getPendingLeaves();
        this.getAttendance();
        this.loadEmployeeTasks();
        this.cdr.detectChanges();
      },
      complete: () => {
        this.spinner.hide();
      }
    }));
  }

  loadEmployeeTasks() {
    if (!this.employee?.employeeId) return;
    this.subs.push(this.tasksService.getTasksByEmployeeId(this.employee.employeeId).subscribe({
      next: (tasks) => {
        this.employeeTasks = tasks || [];
        this.updateTasksChart();
      },
      complete: () => {
        this.cdr.detectChanges();
      }
    }));
  }

  getAttendance() {
    this.subs.push(this.attendanceService.getAttendanceForEmployee().subscribe({
      next: (attendance) => {
        this.attendanceData = attendance;
        this.setTodayAttendanceStatus();
        this.calculateMonthlyAttendance();
        this.updateAttendanceChart();
        this.cdr.detectChanges();
      }
    }));
  }

  setTodayAttendanceStatus() {
    const todayStr = new Date().toLocaleDateString('en-CA');
    console.log("todayStr", todayStr);
    this.todayAttendance = this.attendanceData.find(a => a.attendanceDate && new Date(a.attendanceDate).toLocaleDateString('en-CA') === todayStr) || null;
    if (!this.todayAttendance) {
      this.attendanceStatus = 'not_checked_in';
    } else if (this.todayAttendance && this.todayAttendance.checkInTime && !this.todayAttendance.checkOutTime) {
      this.attendanceStatus = 'checked_in';
    } else if (this.todayAttendance && this.todayAttendance.checkOutTime ) {
      this.attendanceStatus = 'checked_out';
    }
    console.log("todayAttendance", this.todayAttendance);
  }

  private getCurrentTimeString(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }

  checkIn() {
    if (!this.employee) return;
    this.spinner.show();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const attendance: any = {
          employeeId: this.employee.employeeId,
          checkInTime: this.getCurrentTimeString(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log("attendance", attendance);
        this.attendanceService.checkIn(attendance).subscribe({
          next: (resp) => {
            this.getAttendance();
          },
          error: (err) => {
            console.log("Error", err.error.message);
            this.spinner.hide();

            if (err.error.message == "You are outside the allowed location range.") {
              Swal.fire({
                title: "Error!",
                text: "You are outside the allowed location range.",
                icon: "error",
              });
            }
            else if (err.error.message == "Invalid check-in or check-out time.") {
              Swal.fire({
                title: "Error!",
                text: "Invalid check-in or check-out time.",
                icon: "error",
              });
            }
          },
          complete: () => {
            this.cdr.detectChanges();
            this.spinner.hide();
          }
        });
      },
      (error) => {
        this.spinner.hide();
        Swal.fire({
          title: "Error!",
          text: "Could not get your location. Please allow location access to check in.",
          icon: "error"
        });
      }
    );
  }

  checkOut() {
    if (!this.employee) return;
    this.spinner.show();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const attendance: any = {
          employeeId: this.employee.employeeId,
          checkOutTime: this.getCurrentTimeString(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log("attendance", attendance);
        this.attendanceService.checkOut(attendance).subscribe({
          next: (resp) => {
            this.getAttendance();
          },
          error: (err) => {
            this.spinner.hide();

            if (err.error.message == "You are outside the allowed location range.") {
              Swal.fire({
                title: "Error!",
                text: "You are outside the allowed location range.",
                icon: "error",
                
              });
            }
            else if (err.error.message == "Invalid check-in or check-out time.") {
              Swal.fire({
                title: "Error!",
                text: "Invalid check-in or check-out time.",
                icon: "error",
              });
            }
          },
          complete: () => {
            this.cdr.detectChanges();
            this.spinner.hide();
          }
        });
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: "Could not get your location. Please allow location access to check out.",
          icon: "error"
        });
      }
    );
  }

  getPendingLeaves() {
    this.subs.push(this.requestHolidayService.getRequestHolidays().subscribe({
      next: (leaves) => {
        if (!this.employee?.fullName) {
          this.pendingLeaves = 0;
        } else {
          this.pendingLeaves = leaves.filter(l => l.employeeName === this.employee.fullName && l.status?.toLowerCase() === 'pending').length;
        }
      },
      complete: () => {
        this.cdr.detectChanges();
      }
    }));
  }

  getSalaryReport(){
    const now = new Date();
    let month = now.getMonth();
    let year = now.getFullYear();
    if (month === 0) {
      month = 12;
      year = year - 1;
    }
    this.subs.push(this.salaryReportService.getSalaryReportForSpecificEmployeeInMonth(this.employee.employeeId, month, year).subscribe({
      next: (report) => {
        this.salaryData = report;
        
      },
      error:(err)=>{
        console.log(err);  
      },
      complete: () => {
        this.updateSalaryChart();
        this.cdr.detectChanges();
      }
    }));
  }

  calculateMonthlyAttendance() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const days: string[] = [];
    for (let d = 1; d <= now.getDate(); d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 5 && dayOfWeek !== 6) {
        days.push(date.toLocaleDateString('en-CA'));
      }
    }
    const attendedDays = days.filter(day =>
      this.attendanceData.some(a => a.attendanceDate && new Date(a.attendanceDate).toLocaleDateString('en-CA') === day)
    );
    this.totalAttendancesThisMonth = attendedDays.length;
    this.totalAbsencesThisMonth = days.length - attendedDays.length;
    this.cdr.detectChanges();
  }

  updateAttendanceChart() {
    if (!this.viewInitialized) return;
    const present = this.totalAttendancesThisMonth;
    const absent = this.totalAbsencesThisMonth;
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
    this.cdr.detectChanges();
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
            data: [this.salaryData.netSalary, this.salaryData.deductionAmount, this.salaryData.overtimeAmount],
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
    this.cdr.detectChanges();
  }

  updateTasksChart() {
    if (!this.viewInitialized) return;
    if (this.tasksChart) this.tasksChart.destroy();
    // Count tasks by status
    const pending = this.employeeTasks.filter(t => t.status === 'Pending').length;
    const done = this.employeeTasks.filter(t => t.status === 'Done').length;
    const late = this.employeeTasks.filter(t => t.status === 'Late').length;
    if (this.tasksChartCanvas && this.tasksChartCanvas.nativeElement) {
      this.tasksChart = new Chart(this.tasksChartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Pending', 'Done', 'Late'],
          datasets: [{
            label: 'Tasks',
            data: [pending, done, late],
            backgroundColor: ['#f59e42', '#66bb6a', '#ef5350'],
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
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.attendanceChart) this.attendanceChart.destroy();
    if (this.salaryChart) this.salaryChart.destroy();
    if (this.tasksChart) this.tasksChart.destroy();
  }
}
