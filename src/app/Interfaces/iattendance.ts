export interface IAttendance {
    attendanceId: number;
    employeeName: string;
    employeeId: number;
    checkInTime: string;
    checkOutTime: string;
    overtimeHours: number;
    delayHours: number;
    attendanceDate: string;
    status: string; // e.g., 'present', 'absent', 'leave', 'pending'
}
