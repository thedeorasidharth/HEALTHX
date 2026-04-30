import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit3, X, Save } from "lucide-react";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/doctors`,
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
      }
    };
    fetchDoctors();
  }, []);
  
  const handleDeleteDoctor = async (id) => {
    if (window.confirm("Are you sure you want to remove this doctor?")) {
      try {
        const { data } = await axios.delete(
          `${import.meta.env.VITE_API_URL}/user/doctor/delete/${id}`,
          { withCredentials: true }
        );
        setDoctors((prev) => prev.filter((doc) => doc._id !== id));
        toast.success(data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete doctor");
      }
    }
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/doctor/update/${selectedDoctor._id}`,
        selectedDoctor,
        { withCredentials: true }
      );
      setDoctors((prev) =>
        prev.map((doc) => (doc._id === selectedDoctor._id ? data.doctor : doc))
      );
      toast.success(data.message);
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update doctor");
    }
  };

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="lg:ml-24 min-h-screen p-6 lg:p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-wide">DOCTORS</h1>
        <p className="text-white/60 mt-2 font-medium">Manage and view all registered healthcare professionals</p>
      </div>

      {doctors && doctors.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {doctors.map((doc) => (
            <motion.div 
              key={doc._id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="glass-card p-6 flex flex-col items-center text-center transition-shadow hover:shadow-2xl hover:shadow-brand-light/10 relative group"
            >
              <button 
                onClick={() => handleDeleteDoctor(doc._id)}
                className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white shadow-lg"
                title="Delete Doctor"
              >
                <Trash2 size={20} />
              </button>
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-brand-light/30 shadow-lg">
                <img
                  src={doc.docAvatar?.url || "/docHolder.jpg"}
                  alt="Doctor avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-2xl font-bold text-brand-dark mb-1">
                {`${doc.firstName} ${doc.lastName}`}
              </h4>
              <p className="text-brand font-semibold mb-6 uppercase text-sm tracking-widest">{doc.doctorDepartment}</p>
              
              <div className="w-full space-y-3 text-left bg-brand-light/10 p-4 rounded-xl mb-6">
                <p className="flex justify-between text-sm">
                  <span className="font-bold text-brand-dark/50">Email:</span>
                  <span className="text-brand-dark font-medium truncate ml-2">{doc.email}</span>
                </p>
                <p className="flex justify-between text-sm">
                  <span className="font-bold text-brand-dark/50">Experience:</span>
                  <span className="text-brand-dark font-medium">{doc.experience || "0"} Years</span>
                </p>
              </div>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => { setSelectedDoctor(doc); setIsEditModalOpen(true); }}
                  className="flex-1 py-2 bg-brand/10 text-brand rounded-lg font-bold hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button 
                  onClick={() => handleDeleteDoctor(doc._id)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="glass-panel p-10 text-center">
          <h2 className="text-2xl font-bold text-white/80">No Registered Doctors Found!</h2>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl z-10 relative overflow-hidden"
            >
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-6 right-6 text-brand-dark/50 hover:text-brand-dark transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-black text-brand-dark mb-8 uppercase tracking-wide">Edit Doctor Profile</h2>
              
              <form onSubmit={handleUpdateDoctor} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark/40 uppercase ml-1">First Name</label>
                    <input 
                      className="w-full px-4 py-3 bg-brand-dark/5 border border-brand-dark/10 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none" 
                      value={selectedDoctor.firstName} 
                      onChange={(e) => setSelectedDoctor({...selectedDoctor, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark/40 uppercase ml-1">Last Name</label>
                    <input 
                      className="w-full px-4 py-3 bg-brand-dark/5 border border-brand-dark/10 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none" 
                      value={selectedDoctor.lastName} 
                      onChange={(e) => setSelectedDoctor({...selectedDoctor, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark/40 uppercase ml-1">Email</label>
                    <input 
                      className="w-full px-4 py-3 bg-brand-dark/5 border border-brand-dark/10 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none" 
                      value={selectedDoctor.email} 
                      onChange={(e) => setSelectedDoctor({...selectedDoctor, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark/40 uppercase ml-1">Phone</label>
                    <input 
                      className="w-full px-4 py-3 bg-brand-dark/5 border border-brand-dark/10 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none" 
                      value={selectedDoctor.phone} 
                      onChange={(e) => setSelectedDoctor({...selectedDoctor, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark/40 uppercase ml-1">Experience (Years)</label>
                    <input 
                      className="w-full px-4 py-3 bg-brand-dark/5 border border-brand-dark/10 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none" 
                      type="number"
                      value={selectedDoctor.experience} 
                      onChange={(e) => setSelectedDoctor({...selectedDoctor, experience: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-dark/40 uppercase ml-1">Description</label>
                    <input 
                      className="w-full px-4 py-3 bg-brand-dark/5 border border-brand-dark/10 rounded-xl focus:ring-2 focus:ring-brand focus:outline-none" 
                      value={selectedDoctor.description} 
                      onChange={(e) => setSelectedDoctor({...selectedDoctor, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-brand text-white rounded-2xl font-bold hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} /> Update Profile
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-8 py-4 bg-brand-dark/5 text-brand-dark font-bold rounded-2xl hover:bg-brand-dark/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Doctors;