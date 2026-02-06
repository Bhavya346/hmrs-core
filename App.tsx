
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceManagement from './components/AttendanceManagement';
import { dbService } from './services/db';
import { Employee, AttendanceRecord } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'attendance'>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [empList, attList] = await Promise.all([
        dbService.getEmployees(),
        dbService.getAttendance()
      ]);
      setEmployees(empList);
      setAttendance(attList);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddEmployee = async (emp: Employee) => {
    await dbService.addEmployee(emp);
    await fetchData();
  };

  const handleDeleteEmployee = async (id: string) => {
    await dbService.deleteEmployee(id);
    await fetchData();
  };

  const handleMarkAttendance = async (records: AttendanceRecord[]) => {
    await dbService.markAttendance(records);
    await fetchData();
  };

  const handleRefresh = async () => {
    await fetchData();
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6 shadow-2xl shadow-indigo-200"></div>
          <p className="text-slate-500 animate-pulse font-black uppercase tracking-[0.2em] text-xs">Syncing Database...</p>
        </div>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <Dashboard 
              employees={employees} 
              attendance={attendance} 
              onRefresh={handleRefresh}
            />
          )}
          {activeTab === 'employees' && (
            <EmployeeManagement 
              employees={employees} 
              attendance={attendance}
              onAdd={handleAddEmployee} 
              onDelete={handleDeleteEmployee} 
            />
          )}
          {activeTab === 'attendance' && (
            <AttendanceManagement 
              employees={employees} 
              attendance={attendance} 
              onMark={handleMarkAttendance} 
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
