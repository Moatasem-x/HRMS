import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeesComponent as EmployeesComponent } from "./Pages/Employee/employees/employees";
import { EmployeeForm } from './Pages/Employee/employee-form/employee-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EmployeesComponent, EmployeeForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'HRMS';
}
