import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddNewAdmin = () => {
  const { isAuthenticated } = useContext(Context);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/admin/addnew`,
        { firstName, lastName, email, phone, nic, dob, gender, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res.data.message);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <div className="lg:ml-24 min-h-screen p-6 lg:p-10 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl glass-panel p-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-wide">ADD NEW ADMIN</h2>
          <p className="text-white/60 mt-2 font-medium">Grant portal access to a new administrator</p>
        </div>

        <form onSubmit={handleAddNewAdmin} className="space-y-6">
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

          <div className="flex justify-center pt-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary px-16 py-4 text-lg shadow-lg shadow-black/20"
            >
              REGISTER ADMIN
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddNewAdmin;