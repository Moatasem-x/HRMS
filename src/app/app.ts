import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddEmployee } from './Pages/Employee/add-employee/add-employee';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AddEmployee],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'HRMS';
}
