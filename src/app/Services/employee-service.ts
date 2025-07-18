import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployee } from '../Interfaces/iemployee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient) { }
  private apiUrl = 'https://localhost:7124/api/employee';

  getEmployees(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(this.apiUrl);
  }

  addEmployee(employee: IEmployee): Observable<IEmployee> {
    return this.http.post<IEmployee>(this.apiUrl, employee);
  }

  deleteEmployee(id: number): Observable<IEmployee> {
    return this.http.delete<IEmployee>(`${this.apiUrl}/${id}`);
  }

  editEmployee(employee: IEmployee, id: number): Observable<IEmployee> {
    return this.http.put<IEmployee>(`${this.apiUrl}/${id}`, employee);
  }
}
