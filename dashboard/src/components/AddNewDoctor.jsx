import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddNewDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");
  
  const navigateTo = useNavigate();

  const departmentsArray = [
    "Pediatrics", "Orthopedics", "Cardiology", "Neurology", "Oncology",
    "Radiology", "Physical Therapy", "Dermatology", "ENT",
  ];

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("nic", nic);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", doctorDepartment);
      formData.append("experience", experience);
      formData.append("description", description);
      formData.append("docAvatar", docAvatar);
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/doctor/addnew`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <div className="lg:ml-24 min-h-screen p-6 lg:p-10 flex flex-col items-center relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl glass-panel p-10 z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-wide">REGISTER DOCTOR</h2>
          <p className="text-white/60 mt-2 font-medium">Add a new professional to the network</p>
        </div>

        <form onSubmit={handleAddNewDoctor} className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 flex flex-col items-center">
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-brand-dark/50 border-4 border-white/20 mb-6 shadow-xl flex items-center justify-center">
              <img
                src={docAvatarPreview ? docAvatarPreview : "/docHolder.jpg"}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
              <input 
                type="file" 
                onChange={handleAvatar} 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {!docAvatarPreview && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/40">
                  <span className="text-white font-bold bg-brand-dark px-4 py-2 rounded-lg">Upload Photo</span>
                </div>
              )}
            </div>
            <p className="text-white/50 text-sm text-center">Click the box above to upload a high-quality avatar.</p>
          </div>

          <div className="flex-[2] space-y-6">
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

            <select
              className="input-field appearance-none"
              value={doctorDepartment}
              onChange={(e) => setDoctorDepartment(e.target.value)}
            >
              <option value="" disabled>Select Department</option>
              {departmentsArray.map((depart, index) => (
                <option value={depart} key={index}>{depart}</option>
              ))}
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input className="input-field" type="number" placeholder="Years of Experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
              <input className="input-field" type="text" placeholder="Short Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary w-full py-4 text-lg shadow-lg shadow-black/20"
            >
              REGISTER NEW DOCTOR
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddNewDoctor;