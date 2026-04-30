import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/doctors`
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-32 min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-brand-dark dark:text-green-100 mb-4">
          MEET OUR DOCTORS
        </h2>
        <p className="text-lg text-brand-dark/70 dark:text-green-200 max-w-2xl mx-auto">
          Our team of highly qualified and experienced professionals is dedicated to providing you with the best healthcare possible.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-panel overflow-hidden h-full flex flex-col">
              <div className="w-full h-64 skeleton flex-shrink-0" />
              <div className="p-6 text-center flex-1 flex flex-col justify-between items-center gap-4">
                <div className="w-3/4 h-6 skeleton rounded-md" />
                <div className="w-1/2 h-4 skeleton rounded-md" />
                <div className="w-1/3 h-4 skeleton rounded-md mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <Link to={`/doctor/${doctor._id}`} key={doctor._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-panel overflow-hidden group cursor-pointer hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col"
              >
                <div className="w-full h-64 overflow-hidden bg-white/50 dark:bg-black/20 flex-shrink-0">
                  <img
                    src={doctor.docAvatar?.url || "/docAvatar.png"}
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-brand-dark dark:text-green-100 mb-1">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-brand font-bold text-sm tracking-widest uppercase mb-4">
                      {doctor.doctorDepartment}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-brand-dark/70 dark:text-green-300 border-b border-brand-dark/20 dark:border-green-300/30 pb-1 group-hover:border-brand dark:group-hover:border-green-100 transition-colors">
                      View Profile &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Doctors;
