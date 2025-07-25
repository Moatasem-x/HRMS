export interface IAttendance {
    attendanceId?: number;
    employeeName?: string;
    employeeId?: number;
    checkInTime?: string;
    checkOutTime?: string;
    overtimeHours?: number;
    delayHours?: number;
    attendanceDate?: string;
    latitude?: number;
    longitude?: number;
}
