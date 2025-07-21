import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalEmployeesComponent } from '../../Components/total-employees/total-employees';
import { TotalDepartmentsComponent } from '../../Components/total-departments/total-departments';
import { AttendanceTodayComponent } from '../../Components/attendance-today/attendance-today';
import { AbsenteesTodayComponent } from '../../Components/absentees-today/absentees-today';
import { PendingLeaveRequestsComponent } from '../../Components/pending-leave-requests/pending-leave-requests';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TotalEmployeesComponent,
    TotalDepartmentsComponent,
    AttendanceTodayComponent,
    AbsenteesTodayComponent,
    PendingLeaveRequestsComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {} 