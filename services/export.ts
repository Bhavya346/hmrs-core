
import { Employee, AttendanceRecord } from '../types';

export const exportToCSV = (employees: Employee[], attendance: AttendanceRecord[]) => {
  const headers = ['Employee ID', 'Name', 'Email', 'Department', 'Join Date', 'Total Presence', 'Attendance Rate'];
  
  const rows = employees.map(emp => {
    const records = attendance.filter(a => a.employeeId === emp.id);
    const presentCount = records.filter(r => r.status === 'Present').length;
    const totalRecords = records.length;
    const rate = totalRecords > 0 ? `${Math.round((presentCount / totalRecords) * 100)}%` : 'N/A';
    
    return [
      emp.id,
      emp.fullName,
      emp.email,
      emp.department,
      new Date(emp.createdAt).toLocaleDateString(),
      presentCount,
      rate
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `HRMS_Report_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
