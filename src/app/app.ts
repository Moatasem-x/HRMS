import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Services/auth-service';
import { Sidebar } from './Components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { ChatBot } from "./Components/chat-bot/chat-bot";
import { HRDashboard } from "./Dashboards/hr-dashboard/hr-dashboard";

@Component({
  selector: 'app-root',
  imports: [Sidebar, RouterOutlet, ChatBot, HRDashboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'HRMS';
  public authReady = false;
  isLoggedIn: boolean = false;

  constructor(public router: Router, private authService: AuthService) {
    
  }

  ngOnInit(): void {
    this.authService.userData.subscribe({
      next: () => {
        this.isLoggedIn = this.authService.authenticated();
      }
    })
  }

  
}
