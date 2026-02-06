
import React, { useState, useMemo } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus } from '../types';

interface AttendanceManagementProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  onMark: (records: AttendanceRecord[]) => Promise<void>;
}

const AttendanceManagement: React.FC<AttendanceManagementProps> = ({ employees, attendance, onMark }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isMarking, setIsMarking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markingState, setMarkingState] = useState<Record<string, AttendanceStatus>>({});

  const recordsForDate = useMemo(() => {
    return attendance.filter(a => a.date === selectedDate);
  }, [attendance, selectedDate]);

  const handleStartMarking = () => {
    const initialState: Record<string, AttendanceStatus> = {};
    employees.forEach(emp => {
      const existing = recordsForDate.find(r => r.employeeId === emp.id);
      initialState[emp.id] = existing ? existing.status : 'Present';
    });
    setMarkingState(initialState);
    setIsMarking(true);
  };

  const handleSaveAttendance = async () => {
    setLoading(true);
    try {
      const recordsToSave: AttendanceRecord[] = Object.entries(markingState).map(([empId, status]) => ({
        id: `${empId}-${selectedDate}`,
        employeeId: empId,
        date: selectedDate,
        status
      }));
      await onMark(recordsToSave);
      setIsMarking(false);
    } catch (err) {
      alert('Error updating logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pb-4 border-b border-white/30">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Daily Log</h2>
          <p className="text-slate-500 mt-2 font-bold text-lg opacity-80">Track presence for <span className="text-indigo-600">{new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'})}</span></p>
        </div>
        
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative group">
            <input
              type="date"
              className="bg-white/60 border border-white rounded-[24px] px-8 py-4 text-sm font-black text-slate-700 focus:ring-8 focus:ring-indigo-100 focus:outline-none cursor-pointer hover:bg-white transition-all shadow-xl"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {!isMarking ? (
            <button
              onClick={handleStartMarking}
              disabled={employees.length === 0}
              className="group flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white rounded-[28px] font-black text-sm hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              <div className="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              Initialize Tracking
            </button>
          ) : (
            <div className="flex items-center gap-4 animate-in">
              <button
                onClick={() => setIsMarking(false)}
                className="px-8 py-5 glass border-white text-slate-600 rounded-[28px] text-sm font-black hover:bg-white transition-all"
              >
                Abort
              </button>
              <button
                onClick={handleSaveAttendance}
                disabled={loading}
                className="group flex items-center gap-4 px-10 py-5 bg-emerald-600 text-white rounded-[28px] font-black text-sm hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all hover:-translate-y-1"
              >
                <div className="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                </div>
                {loading ? 'Finalizing...' : 'Apply Deployment Logs'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-[48px] overflow-hidden border-white/70 shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/40">
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Professional</th>
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Deployment Unit</th>
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Registry Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {employees.length > 0 ? (
                employees.map((emp) => {
                  const record = recordsForDate.find(r => r.employeeId === emp.id);
                  return (
                    <tr key={emp.id} className="hover:bg-white/60 transition-all duration-300 group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.id}`}
                            className="w-14 h-14 rounded-[22px] bg-indigo-50 p-0.5 border-2 border-white shadow-xl group-hover:scale-110 transition-transform duration-500"
                            alt={emp.fullName}
                          />
                          <div>
                            <p className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{emp.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">Internal ID: {emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="inline-flex items-center px-5 py-2 rounded-2xl bg-white/60 border border-white text-[11px] font-black text-slate-600 shadow-sm uppercase tracking-wider">
                          {emp.department}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        {isMarking ? (
                          <div className="flex items-center gap-10 animate-in">
                            <label className="flex items-center cursor-pointer group/opt">
                              <input
                                type="radio"
                                className="hidden"
                                checked={markingState[emp.id] === 'Present'}
                                onChange={() => setMarkingState({ ...markingState, [emp.id]: 'Present' })}
                              />
                              <div className={`w-7 h-7 rounded-2xl border-2 flex items-center justify-center transition-all ${markingState[emp.id] === 'Present' ? 'border-emerald-500 bg-emerald-500 shadow-lg shadow-emerald-100' : 'border-slate-300 group-hover/opt:border-indigo-400'}`}>
                                {markingState[emp.id] === 'Present' && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <span className={`ml-3 text-sm font-black transition-all ${markingState[emp.id] === 'Present' ? 'text-emerald-600 translate-x-1' : 'text-slate-400'}`}>Present</span>
                            </label>
                            <label className="flex items-center cursor-pointer group/opt">
                              <input
                                type="radio"
                                className="hidden"
                                checked={markingState[emp.id] === 'Absent'}
                                onChange={() => setMarkingState({ ...markingState, [emp.id]: 'Absent' })}
                              />
                              <div className={`w-7 h-7 rounded-2xl border-2 flex items-center justify-center transition-all ${markingState[emp.id] === 'Absent' ? 'border-rose-500 bg-rose-500 shadow-lg shadow-rose-100' : 'border-slate-300 group-hover/opt:border-indigo-400'}`}>
                                {markingState[emp.id] === 'Absent' && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>}
                              </div>
                              <span className={`ml-3 text-sm font-black transition-all ${markingState[emp.id] === 'Absent' ? 'text-rose-600 translate-x-1' : 'text-slate-400'}`}>Absent</span>
                            </label>
                          </div>
                        ) : (
                          <div className={`inline-flex items-center px-6 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                            record?.status === 'Present' 
                              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-200 shadow-sm' 
                              : record?.status === 'Absent' 
                                ? 'bg-rose-500/10 text-rose-700 border-rose-200 shadow-sm'
                                : 'bg-slate-100/50 text-slate-400 border-white shadow-inner'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-3 animate-pulse ${record?.status === 'Present' ? 'bg-emerald-500' : record?.status === 'Absent' ? 'bg-rose-500' : 'bg-slate-300'}`}></div>
                            {record ? record.status : 'Pending Sync'}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-white/50 rounded-[40px] flex items-center justify-center text-5xl mb-8 shadow-xl border border-white">📝</div>
                      <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">Registry Standby</p>
                      <p className="text-slate-400/60 text-sm mt-3 font-bold">Deploy workforce members to start daily log tracking.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
