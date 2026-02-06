
export type Department = 'Engineering' | 'HR' | 'Marketing' | 'Sales' | 'Finance' | 'Design';

export interface Employee {
  id: string; // Unique Employee ID
  fullName: string;
  email: string;
  department: Department;
  createdAt: string;
}

export type AttendanceStatus = 'Present' | 'Absent';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // ISO String (YYYY-MM-DD)
  status: AttendanceStatus;
}

export interface DashboardStats {
  totalEmployees: number;
  attendanceToday: number;
  attendanceRate: string;
  departmentDistribution: Record<Department, number>;
}
