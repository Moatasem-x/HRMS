import { Routes } from '@angular/router';
import { Employees } from './Pages/Employee/employees/employees';
import { EmployeeDetails } from './Pages/Employee/employee-details/employee-details';
import { AttendanceReportCombine } from './Pages/AttendanceReport/attendance-report-combine/attendance-report-combine';
import { EmployeeSalaryCombine } from './Pages/EmployeeSalary/employee-salary-combine/employee-salary-combine';
import { OfficialHolidayCombine } from './Pages/OfficialHoliday/official-holiday-combine/official-holiday-combine';
import { EmployeeForm } from './Pages/Employee/employee-form/employee-form';
import { Login } from './Account/login/login';
import { adminGuard } from './Guards/admin-guard';
import { employeeGuard } from './Guards/employee-guard';
import { EmployeeDashboard } from './Dashboards/employee-dashboard/employee-dashboard';
import { HRDashboard } from './Dashboards/hr-dashboard/hr-dashboard';

export const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'employees', component: Employees, canActivate: [adminGuard]},
  {path: 'employees/:id', component: EmployeeDetails, canActivate: [adminGuard]},
  {path: 'addemployee/0', component: EmployeeForm, canActivate: [adminGuard]},
  {path: 'addemployee/:id', component: EmployeeForm, canActivate: [adminGuard]},
  {path: 'attendance', component: AttendanceReportCombine, canActivate: [adminGuard]},
  {path: 'salaryreports', component: EmployeeSalaryCombine, canActivate: [adminGuard]},
  {path: 'holidays', component: OfficialHolidayCombine, canActivate: [adminGuard]},
  {path: 'empdash', component: EmployeeDashboard, canActivate: [employeeGuard]},
  {path: 'hrdash', component: HRDashboard, canActivate: [adminGuard]},
  {path: 'login', component: Login}
];
