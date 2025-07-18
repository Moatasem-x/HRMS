import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeesComponent as EmployeesComponent } from "./Pages/Employee/employees/employees";
import { EmployeeForm } from './Pages/Employee/employee-form/employee-form';
import { OfficialHolidayCombineComponent } from "./Pages/OfficialHoliday/official-holiday-combine/official-holiday-combine";
import { AttendanceReportCombineComponent } from "./Pages/AttendanceReport/attendance-report-combine/attendance-report-combine";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EmployeesComponent, EmployeeForm, OfficialHolidayCombineComponent, AttendanceReportCombineComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'HRMS';
}
