import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Services/auth-service';
import { Sidebar } from './Components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { EmployeeDashboard } from "./Dashboards/employee-dashboard/employee-dashboard";
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { ChatBot } from "./Components/chat-bot/chat-bot";
import { EmployeeTasks } from "./Pages/Tasks/employee-tasks/employee-tasks";

@Component({
  selector: 'app-root',
  imports: [Sidebar, RouterOutlet, ChatBot, EmployeeTasks],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        // Set a default style for enter and leave
        query(':enter, :leave', [
          style({ position: 'absolute', width: '100%' })
        ], { optional: true }),
        // Animate leave page
        query(':leave', [
          animate('200ms ease', style({ opacity: 0, transform: 'translateX(-30px)' }))
        ], { optional: true }),
        // Animate enter page
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(30px)' }),
          animate('200ms ease', style({ opacity: 1, transform: 'translateX(0)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class App {
  protected title = 'HRMS';
  public authReady = false;

  constructor(public router: Router, private authService: AuthService) {
    
  }
  
  // This function will be used in the template to provide a unique key for each route
  prepareRoute(outlet: RouterOutlet) {
    if (!outlet || !outlet.isActivated) return '';
    return outlet.activatedRouteData && outlet.activatedRouteData['animation']
      ? outlet.activatedRouteData['animation']
      : outlet.activatedRoute.routeConfig?.path;
  }
}
