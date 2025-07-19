import { Routes } from '@angular/router';
import { EmployeeSalaryCombineComponent } from './Pages/EmployeeSalary/employee-salary-combine/employee-salary-combine';

export const routes: Routes = [
  {
    path: 'employee-salary',
    component: EmployeeSalaryCombineComponent
  },
  {
    path: '',
    redirectTo: '/employee-salary',
    pathMatch: 'full'
  }
];
