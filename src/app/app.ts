import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeesComponent as EmployeesComponent } from "./Pages/Employee/employees/employees";
import { EmployeeFormComponent } from './Pages/Employee/employee-form/employee-form';
import { OfficialHolidayCombineComponent } from "./Pages/OfficialHoliday/official-holiday-combine/official-holiday-combine";
import { AttendanceReportCombineComponent } from "./Pages/AttendanceReport/attendance-report-combine/attendance-report-combine";
import { EmployeeSalaryCombineComponent } from "./Pages/EmployeeSalary/employee-salary-combine/employee-salary-combine";
import { Sidebar } from './Components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EmployeesComponent, EmployeeFormComponent, OfficialHolidayCombineComponent, AttendanceReportCombineComponent, EmployeeSalaryCombineComponent, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'HRMS';
}
