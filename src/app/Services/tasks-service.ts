import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask } from '../Interfaces/itask';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrl = 'https://localhost:7124/api/WorkingTask';

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.apiUrl}/All`);
  }

  addTask(task: ITask): Observable<any> {
    return this.http.post<ITask>(`${this.apiUrl}`, task);
  }
} 