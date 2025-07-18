import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAttendance } from '../Interfaces/iattendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'https://localhost:7124/api/Attendance';

  constructor(private http: HttpClient) {}

  getAttendances(): Observable<IAttendance[]> {
    return this.http.get<IAttendance[]>(`${this.apiUrl}/all`);
  }

  editAttendance(attendance: IAttendance): Observable<IAttendance> {
    return this.http.put<IAttendance>(`${this.apiUrl}`, attendance);
  }

  deleteAttendance(id: number): Observable<IAttendance> {
    return this.http.delete<IAttendance>(`${this.apiUrl}/${id}`);
  }


}
