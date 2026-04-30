import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Context } from "../main";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AppointmentForm = () => {
  const { user } = useContext(Context);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [department, setDepartment] = useState("Pediatrics");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setNic(user.nic || "");
      if (user.dob) setDob(new Date(user.dob));
      setGender(user.gender || "");
    }
  }, [user]);

  useEffect(() => {
    if (location.state) {
      if (location.state.department) setDepartment(location.state.department);
      if (location.state.doctorFirstName) setDoctorFirstName(location.state.doctorFirstName);
      if (location.state.doctorLastName) setDoctorLastName(location.state.doctorLastName);
    }
  }, [location.state]);

  const departmentsArray = [
    "Pediatrics", "Orthopedics", "Cardiology", "Neurology", 
    "Oncology", "Radiology", "Physical Therapy", "Dermatology", "ENT",
  ];

  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/doctors`,
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctors();
  }, []);

  const handleAppointment = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !appointmentDate || !department || !address) {
      toast.error("Please fill out all required fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const phoneRegex = /^[0-9]{10,12}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid phone number (10-12 digits).");
      return;
    }

    setLoading(true);
    try {
      const hasVisitedBool = Boolean(hasVisited);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/appointment/post`,
        {
          firstName, lastName, email, phone, nic, dob, gender,
          appointment_date: appointmentDate, department,
          doctor_firstName: doctorFirstName, doctor_lastName: doctorLastName,
          hasVisited: hasVisitedBool, address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message || "Appointment booked successfully");
      setFirstName(""); setLastName(""); setEmail(""); setPhone("");
      setNic(""); setDob(null); setGender(""); setAppointmentDate(null);
      setDepartment("Pediatrics"); setDoctorFirstName(""); setDoctorLastName("");
      setHasVisited(false); setAddress("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto px-6 py-20"
    >
      <div className="glass-panel p-8 md:p-12">
        <h2 className="text-3xl font-black text-brand-dark dark:text-green-100 mb-8 text-center tracking-wide">
          BOOK YOUR APPOINTMENT
        </h2>
        
        <form onSubmit={handleAppointment} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="input-field" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input className="input-field" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input 
                className={`input-field ${email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                <span className="text-[10px] text-red-500 absolute -bottom-4 left-2 font-bold uppercase">Invalid Email</span>
              )}
            </div>
            <div className="relative">
              <input 
                className={`input-field ${phone && !/^[0-9]{10,12}$/.test(phone) ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
                type="number" 
                placeholder="Mobile Number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
              {phone && !/^[0-9]{10,12}$/.test(phone) && (
                <span className="text-[10px] text-red-500 absolute -bottom-4 left-2 font-bold uppercase">10-12 Digits required</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="input-field" type="number" placeholder="AADHAR NO." value={nic} onChange={(e) => setNic(e.target.value)} />
            <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              className="input-field"
              wrapperClassName="w-full"
              placeholderText="Date of Birth (DD/MM/YYYY)"
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select className="input-field appearance-none" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <DatePicker
              selected={appointmentDate}
              onChange={(date) => setAppointmentDate(date)}
              className="input-field"
              wrapperClassName="w-full"
              placeholderText="Appointment Date (DD/MM/YYYY)"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              className="input-field appearance-none"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setDoctorFirstName("");
                setDoctorLastName("");
              }}
            >
              {departmentsArray.map((depart, index) => (
                <option value={depart} key={index}>{depart}</option>
              ))}
            </select>
            {(() => {
              const availableDoctors = doctors.filter((doc) => doc.doctorDepartment === department);
              return (
                <select
                  className="input-field appearance-none"
                  value={`${doctorFirstName} ${doctorLastName}`.trim()}
                  onChange={(e) => {
                    const [first, last] = e.target.value.split(" ");
                    setDoctorFirstName(first || "");
                    setDoctorLastName(last || "");
                  }}
                  disabled={!department || availableDoctors.length === 0}
                >
                  <option value="" disabled>
                    {availableDoctors.length === 0 ? "No doctors available" : "Select Doctor (Optional)"}
                  </option>
                  {availableDoctors.map((doc, idx) => (
                    <option value={`${doc.firstName} ${doc.lastName}`} key={idx}>
                      {doc.firstName} {doc.lastName}
                    </option>
                  ))}
                </select>
              );
            })()}
          </div>
          
          <textarea
            className="input-field resize-none h-32"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your Address"
          />
          
          <div className="flex items-center gap-3 justify-end">
            <p className="font-bold text-brand-dark/80 dark:text-green-300">Have you visited before?</p>
            <input
              type="checkbox"
              className="w-5 h-5 accent-brand rounded cursor-pointer"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
            />
          </div>
          
          <div className="pt-4 flex justify-center">
            <motion.button 
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              disabled={loading}
              className={`btn-primary w-full md:w-auto md:px-16 py-4 text-xl shadow-xl shadow-brand/20 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? "BOOKING..." : "GET APPOINTMENT"}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.section>
  );
};

export default AppointmentForm;