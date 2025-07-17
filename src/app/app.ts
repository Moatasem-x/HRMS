import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddEmployee } from './Pages/Employee/add-employee/add-employee';
import { EmployeesComponent as EmployeesComponent } from "./Pages/Employee/employees/employees";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AddEmployee, EmployeesComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'HRMS';
}
