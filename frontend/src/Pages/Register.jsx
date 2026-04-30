import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/patient/register`,
        { firstName, lastName, email, phone, nic, dob, gender, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register");
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[100px] -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl glass-panel p-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-brand-dark dark:text-green-100 mb-3">Sign Up</h2>
          <p className="text-brand-dark/60 dark:text-green-200 font-medium">Join our healthcare network today</p>
        </div>

        <form onSubmit={handleRegistration} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="input-field" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input className="input-field" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input className="input-field" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input-field" type="number" placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
            <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="flex justify-end items-center gap-2 text-sm font-medium">
            <span className="text-brand-dark/70 dark:text-green-300">Already Registered?</span>
            <Link to="/login" className="text-brand font-bold hover:underline">
              Login Now
            </Link>
          </div>

          <div className="flex justify-center pt-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn-primary w-full md:w-auto md:px-16 py-4 text-lg shadow-lg shadow-brand/20"
            >
              REGISTER
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;