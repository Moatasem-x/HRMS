import { Routes } from '@angular/router';
import { EmployeesComponent } from './Pages/Employee/employees/employees';
import { EmployeeDetails } from './Pages/Employee/employee-details/employee-details';
import { AttendanceReportCombineComponent } from './Pages/AttendanceReport/attendance-report-combine/attendance-report-combine';
import { EmployeeSalaryCombineComponent } from './Pages/EmployeeSalary/employee-salary-combine/employee-salary-combine';
import { OfficialHolidayCombineComponent } from './Pages/OfficialHoliday/official-holiday-combine/official-holiday-combine';
import { EmployeeFormComponent } from './Pages/Employee/employee-form/employee-form';

export const routes: Routes = [
  {path: "", redirectTo: "/employees", pathMatch: "full"},
  {path: "employees", component: EmployeesComponent},
  {path: "employees/:id", component: EmployeeDetails},
  {path: "addemployee/0", component: EmployeeFormComponent},
  {path: "addemployee/:id", component: EmployeeFormComponent},
  {path: "attendance", component: AttendanceReportCombineComponent},
  {path: "salaryreports", component: EmployeeSalaryCombineComponent},
  {path: "holidays", component: OfficialHolidayCombineComponent}
];
