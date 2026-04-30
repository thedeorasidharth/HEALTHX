import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/doctor/${id}`
        );
        setDoctor(data.doctor);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load profile");
        navigate("/doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, navigate]);

  const handleBookAppointment = () => {
    navigate("/appointment", { 
      state: { 
        department: doctor.doctorDepartment,
        doctorFirstName: doctor.firstName,
        doctorLastName: doctor.lastName 
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-brand"></div>
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-32 min-h-screen">
      <div className="glass-panel overflow-hidden flex flex-col md:flex-row">
        {/* Left: Image */}
        <div className="md:w-2/5 bg-brand-light dark:bg-black/20 p-8 flex justify-center items-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#1b4d4d]"
          >
            <img
              src={doctor.docAvatar?.url || "/docAvatar.png"}
              alt={`${doctor.firstName} ${doctor.lastName}`}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>

        {/* Right: Details */}
        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-brand font-black tracking-widest uppercase mb-2">
              {doctor.doctorDepartment} Specialist
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-green-100 mb-6">
              Dr. {doctor.firstName} {doctor.lastName}
            </h1>
            
            <div className="space-y-6 text-brand-dark/80 dark:text-green-200 text-lg leading-relaxed">
              <div className="flex items-start gap-4">
                <div className="w-1/3 font-bold dark:text-green-300">Experience</div>
                <div className="w-2/3">{doctor.experience || "10+ Years of Excellence"}</div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1/3 font-bold dark:text-green-300">Email Contact</div>
                <div className="w-2/3">{doctor.email}</div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1/3 font-bold dark:text-green-300">About Doctor</div>
                <div className="w-2/3">
                  {doctor.description || "An experienced specialist committed to providing premium, world-class healthcare tailored to your unique needs. Focuses on preventative care and innovative treatment methodologies."}
                </div>
              </div>
            </div>

            <div className="mt-12">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookAppointment}
                className="btn-primary w-full md:w-auto shadow-xl shadow-brand/20 text-lg py-4 px-10"
              >
                BOOK APPOINTMENT
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DoctorProfile;
