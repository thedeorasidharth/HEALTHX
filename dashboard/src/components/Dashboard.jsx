import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CheckCircle2, XCircle, Clock, Users, Calendar, TrendingUp, Activity, Download, Filter, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("weekly");
  const [exporting, setExporting] = useState(false);
  const { isAuthenticated, admin } = useContext(Context);

  useEffect(() => {
    const fetchDashboardData = async (isPoll = false) => {
      try {
        if (!isPoll) setLoading(true);
        const [appRes, statsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/appointment/getall`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/analytics/stats?range=${range}`, { withCredentials: true })
        ]);
        setAppointments(appRes.data.appointments);
        setStats(statsRes.data.stats);
      } catch (error) {
        if (!isPoll) toast.error("Failed to fetch dashboard data");
      } finally {
        if (!isPoll) setLoading(false);
      }
    };

    fetchDashboardData();

    // Real-time polling every 5 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [range]);

  const handleDownloadReport = async () => {
    setExporting(true);
    const element = document.getElementById("analytics-dashboard");
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#0f2e2e",
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`HealthX_Report_${new Date().toLocaleDateString()}.pdf`);
      toast.success("Report downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF");
    } finally {
      setExporting(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prev) =>
        prev.map((app) => (app._id === appointmentId ? { ...app, status } : app))
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div id="analytics-dashboard" className="lg:ml-24 min-h-screen p-6 lg:p-10 bg-brand">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-wide">ANALYTICS</h1>
          <p className="text-white/60 mt-2 font-medium flex items-center gap-2">
            <Activity className="text-emerald-500" size={18} /> Real-time hospital monitoring active
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-brand-dark p-1 rounded-2xl border border-white/10">
            {["weekly", "monthly"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  range === r 
                    ? "bg-brand text-white shadow-lg" 
                    : "text-white/50 hover:text-white"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleDownloadReport}
            disabled={exporting}
            className="btn-primary flex items-center gap-2 px-6 shadow-xl disabled:opacity-50"
          >
            {exporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            {exporting ? "GENERATING..." : "EXPORT PDF"}
          </button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Doctors", value: stats?.totalDoctors, icon: <Users />, color: "from-emerald-500 to-teal-600" },
          { label: "Appointments", value: stats?.totalAppointments, icon: <Calendar />, color: "from-blue-500 to-indigo-600" },
          { label: "Pending", value: stats?.pendingAppointments, icon: <Clock />, color: "from-amber-500 to-orange-600" },
          { label: "Accepted", value: stats?.acceptedAppointments, icon: <TrendingUp />, color: "from-violet-500 to-purple-600" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-3xl bg-gradient-to-br ${item.color} text-white shadow-xl hover:scale-105 transition-all duration-300 group`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors">
                {React.cloneElement(item.icon, { size: 24 })}
              </div>
              <Activity className="text-white/30" size={20} />
            </div>
            <p className="text-white/80 font-medium text-sm mb-1 uppercase tracking-wider">{item.label}</p>
            <h3 className="text-3xl font-black">{loading ? "..." : item.value || 0}</h3>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
        {/* Appointments Trend */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 min-h-[400px]"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-brand-light" /> Appointment Trends
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.appointmentsPerDay}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f2e2e', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Department Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 flex flex-col items-center"
          >
            <h3 className="text-lg font-bold text-white mb-4 self-start">By Department</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.departmentStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="department"
                  >
                    {stats?.departmentStats?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Status Breakdown</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.statusStats}>
                  <XAxis dataKey="status" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                     cursor={{fill: 'transparent'}}
                     contentStyle={{ backgroundColor: '#0f2e2e', border: 'none', borderRadius: '12px' }}
                  />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                    {stats?.statusStats?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : index === 1 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8"
      >
        <h3 className="text-2xl font-bold text-brand-dark mb-6">Recent Appointments</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-brand-dark/10">
                <th className="py-4 px-4 font-bold text-brand-dark/70 uppercase text-sm tracking-wider">Patient</th>
                <th className="py-4 px-4 font-bold text-brand-dark/70 uppercase text-sm tracking-wider">Date</th>
                <th className="py-4 px-4 font-bold text-brand-dark/70 uppercase text-sm tracking-wider">Doctor</th>
                <th className="py-4 px-4 font-bold text-brand-dark/70 uppercase text-sm tracking-wider">Dept</th>
                <th className="py-4 px-4 font-bold text-brand-dark/70 uppercase text-sm tracking-wider">Status</th>
                <th className="py-4 px-4 font-bold text-brand-dark/70 uppercase text-sm tracking-wider text-center">Visited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-dark/5">
              {appointments && appointments.length > 0 ? (
                appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-brand-dark/5 transition-colors">
                    <td className="py-4 px-4 font-semibold text-brand-dark">{`${app.firstName} ${app.lastName}`}</td>
                    <td className="py-4 px-4 text-brand-dark/80">{app.appointment_date.substring(0, 16)}</td>
                    <td className="py-4 px-4 text-brand-dark/80">{`${app.doctor?.firstName} ${app.doctor?.lastName}`}</td>
                    <td className="py-4 px-4 text-brand-dark/80">{app.department}</td>
                    <td className="py-4 px-4">
                      <select
                        className={`bg-transparent font-bold cursor-pointer focus:outline-none ${
                          app.status === "Pending" ? "text-amber-500" :
                          app.status === "Accepted" ? "text-emerald-500" : "text-red-500"
                        }`}
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                      >
                        <option value="Pending" className="text-amber-500 font-bold">Pending</option>
                        <option value="Accepted" className="text-emerald-500 font-bold">Accepted</option>
                        <option value="Rejected" className="text-red-500 font-bold">Rejected</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 flex justify-center">
                      {app.hasVisited ? (
                        <CheckCircle2 className="text-emerald-500" size={24} />
                      ) : (
                        <XCircle className="text-red-500" size={24} />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-brand-dark/50 font-medium">
                    No Appointments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;