import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Services/auth-service';
import { Sidebar } from './Components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { EmployeeDashboard } from "./Dashboards/employee-dashboard/employee-dashboard";

@Component({
  selector: 'app-root',
  imports: [Sidebar, RouterOutlet, EmployeeDashboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'HRMS';
  public authReady = false;

  constructor(public router: Router, private authService: AuthService) {
    
  }
}
