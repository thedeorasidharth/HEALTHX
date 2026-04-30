import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { Menu, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/admin/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const navLinks = [
    { icon: <TiHome />, path: "/" },
    { icon: <FaUserDoctor />, path: "/doctors" },
    { icon: <MdAddModerator />, path: "/admin/addnew" },
    { icon: <IoPersonAddSharp />, path: "/doctor/addnew" },
    { icon: <AiFillMessage />, path: "/messages" },
  ];

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="fixed top-4 left-4 z-50 p-3 bg-brand text-white rounded-xl lg:hidden shadow-xl"
        onClick={() => setShow(!show)}
      >
        {show ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.nav 
        initial={{ x: -100 }}
        animate={{ x: show ? 0 : (window.innerWidth >= 1024 ? 0 : -100) }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed top-0 left-0 h-screen w-24 bg-brand-dark flex flex-col items-center py-10 z-40 shadow-2xl"
      >
        <div className="bg-brand-light text-brand-dark w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl mb-12 shadow-lg">
          H
        </div>
        
        <div className="flex flex-col gap-8 flex-1 w-full items-center">
          {navLinks.map((link, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { navigateTo(link.path); setShow(false); }}
              className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                location.pathname === link.path 
                  ? "text-brand-light bg-brand-light/10 border border-brand-light/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                  : "text-white/50 hover:text-white"
              }`}
            >
              {React.cloneElement(link.icon, { size: 28 })}
            </motion.div>
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.2, backgroundColor: "rgba(239,68,68,0.2)" }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="p-3 rounded-2xl cursor-pointer text-red-400 hover:text-red-500 transition-colors mt-auto"
        >
          <RiLogoutBoxFill size={28} />
        </motion.div>
      </motion.nav>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;