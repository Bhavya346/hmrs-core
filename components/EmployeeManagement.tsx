
import React, { useState } from 'react';
import { Employee, Department, AttendanceRecord } from '../types';

interface EmployeeManagementProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  onAdd: (employee: Employee) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, attendance, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHistoryEmp, setSelectedHistoryEmp] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<Employee>>({
    id: '',
    fullName: '',
    email: '',
    department: 'Engineering'
  });

  const departments: Department[] = ['Engineering', 'HR', 'Marketing', 'Sales', 'Finance', 'Design'];

  const getHistoryForEmployee = (empId: string) => {
    return attendance
      .filter(a => a.employeeId === empId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredEmployees = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.id || !formData.fullName || !formData.email || !formData.department) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      await onAdd({
        id: formData.id,
        fullName: formData.fullName,
        email: formData.email,
        department: formData.department as Department,
        createdAt: new Date().toISOString()
      });
      setShowForm(false);
      setFormData({ id: '', fullName: '', email: '', department: 'Engineering' });
    } catch (err: any) {
      setError(err.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Workforce</h2>
          <p className="text-slate-500 mt-2 font-bold text-lg opacity-80">Directory of <span className="text-indigo-600">{employees.length}</span> professionals</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-liquid flex items-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-[28px] font-black text-sm shadow-2xl shadow-indigo-200"
        >
          {showForm ? 'Cancel Onboarding' : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Add Member
            </>
          )}
        </button>
      </div>

      {/* Search Header */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
          <svg className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          placeholder="Search workforce by name, ID, or email..."
          className="w-full glass border-white/80 rounded-[32px] pl-20 pr-8 py-6 text-lg font-bold focus:ring-8 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-400/60 shadow-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="glass p-10 rounded-[48px] shadow-2xl animate-in relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-[80px]"></div>
          <h3 className="text-2xl font-black text-slate-900 mb-8 relative z-10 tracking-tight">New Professional Profile</h3>
          {error && <div className="mb-8 p-5 bg-rose-500/10 text-rose-600 text-xs font-black rounded-3xl border border-rose-200 uppercase tracking-widest">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">ID Identifier</label>
              <input
                type="text"
                className="w-full bg-white/50 border border-white/80 rounded-3xl px-6 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-300"
                placeholder="EMP-XXXX"
                value={formData.id}
                onChange={e => setFormData({ ...formData, id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Legal Name</label>
              <input
                type="text"
                className="w-full bg-white/50 border border-white/80 rounded-3xl px-6 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-300"
                placeholder="e.g. Alex Rivers"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Work Email</label>
              <input
                type="email"
                className="w-full bg-white/50 border border-white/80 rounded-3xl px-6 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-300"
                placeholder="name@company.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Core Department</label>
              <select
                className="w-full bg-white/50 border border-white/80 rounded-3xl px-6 py-5 text-sm font-bold focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all appearance-none cursor-pointer"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-5 mt-6">
               <button
                disabled={loading}
                type="submit"
                className="btn-liquid px-12 py-5 bg-indigo-600 text-white rounded-[28px] font-black text-sm transition-all shadow-xl shadow-indigo-100"
              >
                {loading ? 'Processing...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modern Workforce List */}
      <div className="glass rounded-[48px] overflow-hidden border-white/70 shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/40">
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Professional</th>
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Deployment</th>
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Member Since</th>
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/60 transition-all duration-300 group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.id}`}
                          className="w-14 h-14 rounded-[22px] bg-indigo-50 p-0.5 border-2 border-white shadow-xl group-hover:scale-110 transition-transform duration-500"
                          alt={emp.fullName}
                        />
                        <div>
                          <p className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{emp.fullName}</p>
                          <p className="text-xs text-slate-400 font-bold tracking-tight">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="inline-flex items-center px-5 py-2 rounded-2xl bg-white/60 border border-white text-[11px] font-black text-slate-600 shadow-sm uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3 animate-pulse"></span>
                        {emp.department}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-slate-500">{new Date(emp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          onClick={() => setSelectedHistoryEmp(emp)}
                          className="p-4 bg-white/80 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-2xl transition-all shadow-sm border border-white/50"
                          title="Attendance Records"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Archive ${emp.fullName}? All digital records will be cleared.`)) onDelete(emp.id);
                          }}
                          className="p-4 bg-white/80 hover:bg-rose-600 hover:text-white text-rose-400 rounded-2xl transition-all shadow-sm border border-white/50"
                          title="Delete Account"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-indigo-50/50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">🔍</div>
                      <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">{searchTerm ? 'No matches' : 'System clear'}</p>
                      <p className="text-slate-400/60 text-sm mt-2 font-bold">{searchTerm ? 'Try adjusting your search query.' : 'No active personnel found in the hub.'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance History Modal */}
      {selectedHistoryEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in">
          <div className="glass w-full max-w-xl max-h-[80vh] overflow-hidden rounded-[48px] shadow-[0_32px_100px_rgba(0,0,0,0.2)] flex flex-col">
            <div className="p-10 border-b border-white/30 flex justify-between items-center bg-white/20">
              <div className="flex items-center gap-5">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedHistoryEmp.id}`}
                  className="w-16 h-16 rounded-[22px] bg-white p-1 shadow-lg"
                  alt={selectedHistoryEmp.fullName}
                />
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedHistoryEmp.fullName}</h3>
                  <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mt-1">Attendance Archive</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedHistoryEmp(null)}
                className="p-4 bg-white/80 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-4">
              {getHistoryForEmployee(selectedHistoryEmp.id).length > 0 ? (
                getHistoryForEmployee(selectedHistoryEmp.id).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-6 bg-white/40 border border-white/80 rounded-[28px] hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                      record.status === 'Present' 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' 
                        : 'bg-rose-500/10 text-rose-600 border-rose-200'
                    }`}>
                      {record.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-slate-400">
                  <p className="font-black uppercase tracking-widest text-xs">No records found</p>
                  <p className="text-sm mt-1 font-bold opacity-60">Try marking attendance in the Daily Log first.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
