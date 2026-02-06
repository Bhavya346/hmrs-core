
import { Employee, AttendanceRecord, Department } from '../types';

const STORAGE_KEYS = {
  EMPLOYEES: 'hrms_lite_employees',
  ATTENDANCE: 'hrms_lite_attendance',
};

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dbService = {
  // --- Employee Methods ---
  async getEmployees(): Promise<Employee[]> {
    await delay(300);
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  },

  async addEmployee(employee: Employee): Promise<Employee> {
    await delay(500);
    const employees = await this.getEmployees();
    
    if (employees.some(e => e.id === employee.id)) {
      throw new Error('Employee ID already exists.');
    }
    
    if (employees.some(e => e.email === employee.email)) {
      throw new Error('Email address already in use.');
    }

    const updated = [...employees, employee];
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(updated));
    return employee;
  },

  async deleteEmployee(id: string): Promise<void> {
    await delay(400);
    const employees = await this.getEmployees();
    const updated = employees.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(updated));
    
    // Also cleanup attendance for this employee
    const attendance = await this.getAttendance();
    const filteredAttendance = attendance.filter(a => a.employeeId !== id);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(filteredAttendance));
  },

  // --- Attendance Methods ---
  async getAttendance(): Promise<AttendanceRecord[]> {
    await delay(300);
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },

  async markAttendance(records: AttendanceRecord[]): Promise<void> {
    await delay(600);
    const existing = await this.getAttendance();
    
    // Merge or Update logic
    const updated = [...existing];
    records.forEach(newRec => {
      const idx = updated.findIndex(r => r.employeeId === newRec.employeeId && r.date === newRec.date);
      if (idx > -1) {
        updated[idx] = newRec;
      } else {
        updated.push(newRec);
      }
    });

    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(updated));
  },

  async getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
    const all = await this.getAttendance();
    return all.filter(a => a.date === date);
  }
};
