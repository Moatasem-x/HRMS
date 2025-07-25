import { Routes } from '@angular/router';
import { Employees } from './Pages/Employee/employees/employees';
import { AttendanceReportCombine } from './Pages/AttendanceReport/attendance-report-combine/attendance-report-combine';
import { EmployeeSalaryCombine } from './Pages/EmployeeSalary/employee-salary-combine/employee-salary-combine';
import { OfficialHolidayCombine } from './Pages/OfficialHoliday/official-holiday-combine/official-holiday-combine';
import { EmployeeForm } from './Pages/Employee/employee-form/employee-form';
import { Login } from './Account/login/login';
import { adminGuard } from './Guards/admin-guard';
import { employeeGuard } from './Guards/employee-guard';
import { EmployeeDashboard } from './Dashboards/employee-dashboard/employee-dashboard';
import { HRDashboard } from './Dashboards/hr-dashboard/hr-dashboard';
import { HRForm } from './Pages/hr-form/hr-form';
import { RequestHoliday } from './Pages/request-holiday/request-holiday';
import { ManageHolidayRequests } from './Pages/manage-holiday-requests/manage-holiday-requests';
import { Tasks } from './Pages/Tasks/tasks/tasks';
import { Departments } from './Pages/Department/departments/departments';
import { EmployeeTasks } from './Pages/Tasks/employee-tasks/employee-tasks';

export const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'employees', component: Employees, canActivate: [adminGuard]},
  {path: 'addemployee/0', component: EmployeeForm, canActivate: [adminGuard]},
  {path: 'addemployee/:id', component: EmployeeForm, canActivate: [adminGuard]},
  {path: 'attendance', component: AttendanceReportCombine, canActivate: [adminGuard]},
  {path: 'salaryreports', component: EmployeeSalaryCombine, canActivate: [adminGuard]},
  {path: 'holidays', component: OfficialHolidayCombine, canActivate: [adminGuard]},
  {path: 'empdash', component: EmployeeDashboard, canActivate: [employeeGuard]},
  {path: 'hrdash', component: HRDashboard, canActivate: [adminGuard]},
  {path: 'login', component: Login},
  {path: 'addhr', component: HRForm, canActivate: [adminGuard]},
  {path: 'requestholiday', component: RequestHoliday, canActivate: [employeeGuard]},
  {path: 'holidayrequests', component: ManageHolidayRequests, canActivate: [adminGuard]},
  {path: 'departments', component: Departments, canActivate: [adminGuard]},
  {path: 'managetasks', component: Tasks, canActivate: [adminGuard]},
  {path: 'mytasks', component: EmployeeTasks, canActivate: [employeeGuard]},
];
