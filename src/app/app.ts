import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeesComponent as EmployeesComponent } from "./Pages/Employee/employees/employees";
import { EmployeeForm } from './Pages/Employee/employee-form/employee-form';
import { OfficialHolidayCombineComponent } from "./Pages/OfficialHoliday/official-holiday-combine/official-holiday-combine";
import { AttendanceReportCombineComponent } from "./Pages/AttendanceReport/attendance-report-combine/attendance-report-combine";
import { EmployeeSalaryCombineComponent } from "./Pages/EmployeeSalary/employee-salary-combine/employee-salary-combine";
import { DashboardComponent } from "./Pages/dashboard/dashboard";
import { DashboardModernComponent } from "./Pages/dashboard-modern/dashboard-modern";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EmployeesComponent, EmployeeForm, OfficialHolidayCombineComponent, AttendanceReportCombineComponent, EmployeeSalaryCombineComponent, DashboardComponent, DashboardModernComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'HRMS';
}
