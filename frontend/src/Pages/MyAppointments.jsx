import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Context } from "../main";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/appointment/my-appointments`,
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated && !loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h2 className="text-3xl font-black text-brand-dark dark:text-green-100 mb-4">
          Please Login to view your appointments
        </h2>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-32 min-h-screen">
      <h2 className="text-4xl font-black text-brand-dark dark:text-green-100 mb-10 text-center tracking-wide">
        MY APPOINTMENTS
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel p-6 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="w-1/2 space-y-2">
                  <div className="w-1/3 h-3 skeleton rounded" />
                  <div className="w-full h-6 skeleton rounded" />
                </div>
                <div className="w-16 h-6 skeleton rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="w-1/4 h-3 skeleton rounded" />
                <div className="w-3/4 h-5 skeleton rounded" />
              </div>
              <div className="space-y-2">
                <div className="w-1/4 h-3 skeleton rounded" />
                <div className="w-3/4 h-5 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <h3 className="text-2xl font-bold text-brand-dark/70 dark:text-green-200">
            No appointments yet!
          </h3>
          <p className="mt-4 text-brand-dark/60 dark:text-green-300">
            Book an appointment to see your history here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {appointments.map((appointment) => (
            <motion.div
              key={appointment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">
                    Department
                  </p>
                  <h3 className="text-xl font-bold text-brand-dark dark:text-green-100">
                    {appointment.department}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    appointment.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : appointment.status === "Accepted"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-brand-dark/70 dark:text-green-300">
                  Doctor:
                </p>
                <p className="text-lg font-medium text-brand-dark dark:text-green-200">
                  {appointment.doctor?.firstName && appointment.doctor?.lastName
                    ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                    : "Not Assigned Yet"}
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-brand-dark/70 dark:text-green-300">
                  Date:
                </p>
                <p className="text-lg font-medium text-brand-dark dark:text-green-200">
                  {new Date(appointment.appointment_date).toLocaleDateString("en-US", {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyAppointments;
