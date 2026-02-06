
import React, { useMemo, useState } from 'react';
import { Employee, AttendanceRecord, Department } from '../types';
import { exportToCSV } from '../services/export';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  onRefresh: () => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ employees, attendance, onRefresh }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const todayISO = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const todayRecords = attendance.filter(a => a.date === todayISO);
    const presentToday = todayRecords.filter(a => a.status === 'Present').length;
    
    const dist: Record<Department, number> = {
      Engineering: 0, HR: 0, Marketing: 0, Sales: 0, Finance: 0, Design: 0
    };
    employees.forEach(e => {
      dist[e.department] = (dist[e.department] || 0) + 1;
    });

    const activeDepartments = Object.entries(dist).filter(([_, count]) => count > 0);

    return {
      totalEmployees: employees.length,
      presentToday,
      absentToday: employees.length - presentToday,
      attendanceRate: employees.length > 0 
        ? Math.round((presentToday / employees.length) * 100) 
        : 0,
      distribution: activeDepartments
    };
  }, [employees, attendance, todayISO]);

  const generateAiInsight = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `As a Senior HR Analyst, provide a single, punchy, professional insight for a team with ${stats.totalEmployees} employees. 
      Today's presence is ${stats.presentToday} out of ${stats.totalEmployees}. 
      Department distribution: ${JSON.stringify(stats.distribution)}.
      Keep it under 30 words and focus on organizational health or strategic advice.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiInsight(response.text || "Systems operational. Maintain current growth trajectory.");
    } catch (e) {
      console.error(e);
      setAiInsight("Unable to connect to AI Hub. Check connectivity.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Operation Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pb-4 border-b border-white/30">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-200">System Live</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">System Overview</h2>
          <p className="text-slate-500 mt-2 font-bold text-lg opacity-80">Intelligence for <span className="text-indigo-600">{today}</span></p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <button 
             onClick={() => exportToCSV(employees, attendance)}
             className="group flex items-center gap-3 px-6 py-4 bg-white/40 hover:bg-white/80 border border-white/60 text-slate-700 rounded-[24px] text-sm font-black transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95">
             <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-indigo-50 transition-colors">
               <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             Download Report
           </button>
           
           <button 
             onClick={onRefresh}
             className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] text-sm font-black transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-1 active:scale-95">
             <div className="p-2 bg-white/20 rounded-xl">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             </div>
             Sync Live Data
           </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Headcount', value: stats.totalEmployees, color: 'indigo', trend: '+2.5%', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { label: 'Present Today', value: stats.presentToday, color: 'emerald', trend: 'Optimal', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Absences', value: stats.absentToday, color: 'rose', trend: '-5%', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Presence Rate', value: `${stats.attendanceRate}%`, color: 'violet', trend: 'Stable', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
        ].map((stat, i) => (
          <div key={i} className="group glass p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-white/80">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} />
                </svg>
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full bg-${stat.color}-500/10 text-${stat.color}-600 uppercase tracking-widest border border-${stat.color}-200`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Department Distribution */}
        <div className="lg:col-span-3 glass p-10 rounded-[48px] border-white/80 shadow-2xl relative overflow-hidden">
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-400/5 rounded-full blur-[80px]"></div>
          <div className="flex items-center justify-between mb-12 relative z-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Deployment Mix</h3>
            <select className="text-[11px] font-black text-slate-500 bg-white/50 border border-white/80 rounded-2xl px-4 py-2 focus:ring-4 focus:ring-indigo-100 focus:outline-none cursor-pointer uppercase tracking-widest">
              <option>Primary Units</option>
              <option>Sub-Teams</option>
            </select>
          </div>
          <div className="space-y-8 relative z-10">
            {stats.distribution.length > 0 ? (
              stats.distribution.map(([dept, count], idx) => {
                const percentage = (count / stats.totalEmployees) * 100;
                const colors = ['bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500'];
                return (
                  <div key={dept} className="group">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-black text-slate-700 group-hover:text-indigo-600 transition-colors tracking-tight text-base">{dept}</span>
                      <span className="text-slate-400 font-bold tracking-tight">{count} <span className="text-[10px] ml-1 uppercase opacity-60 tracking-widest">Staff</span></span>
                    </div>
                    <div className="w-full bg-slate-100/50 rounded-full h-4 overflow-hidden border border-white shadow-inner">
                      <div 
                        className={`${colors[idx % colors.length]} h-full rounded-full transition-all duration-1000 ease-out shadow-lg`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">📊</div>
                <p className="text-xs font-black uppercase tracking-[0.3em]">No Deployment Data</p>
                <p className="text-sm font-bold text-slate-400 mt-1">Personnel records required for analysis.</p>
              </div>
            )}
          </div>
        </div>

        {/* Intelligence Side */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-indigo-600 p-10 rounded-[48px] text-white shadow-[0_32px_80px_rgba(79,70,229,0.3)] relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <h4 className="text-2xl font-black mb-3 tracking-tight leading-tight">AI Insight Generator</h4>
               <div className="min-h-[100px] mb-8">
                {isGenerating ? (
                  <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce delay-200"></div>
                    <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Processing organization metrics...</span>
                  </div>
                ) : aiInsight ? (
                  <p className="text-indigo-100 font-bold text-sm leading-relaxed animate-in">{aiInsight}</p>
                ) : (
                  <p className="text-indigo-100 font-bold text-sm leading-relaxed opacity-60">Leverage Gemini AI to analyze your workforce trends and get strategic advice.</p>
                )}
               </div>
               <button 
                 onClick={generateAiInsight}
                 disabled={isGenerating || employees.length === 0}
                 className="w-full py-5 bg-white text-indigo-600 hover:bg-indigo-50 rounded-3xl text-sm font-black transition-all shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                 {aiInsight ? 'Regenerate Analysis' : 'Expand Strategy'}
               </button>
            </div>
          </div>

          <div className="glass p-10 rounded-[48px] border-white/80 shadow-xl">
            <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
              Timeline
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Payroll Finalization', date: 'Tomorrow', icon: '💰', color: 'bg-emerald-50' },
                { label: 'Staff Orientation', date: 'Oct 14', icon: '🚀', color: 'bg-indigo-50' },
                { label: 'Quarterly Sync', date: 'Oct 18', icon: '📅', color: 'bg-rose-50' },
              ].map((ev, i) => (
                <div key={i} className="flex items-center gap-5 p-4 rounded-[28px] hover:bg-white/60 transition-all border border-transparent hover:border-white group cursor-pointer">
                  <div className={`w-14 h-14 ${ev.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>{ev.icon}</div>
                  <div className="flex-1">
                    <p className="text-base font-black text-slate-800 tracking-tight">{ev.label}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{ev.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
