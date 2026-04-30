import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from "../main";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Menu, X, Sun, Moon, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [show, setShow] = useState(false);
    const { isAuthenticated, setIsAuthenticated, theme, toggleTheme } = useContext(Context);
    const navigateTo = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchNotifications = async () => {
                try {
                    const { data } = await axios.get(
                        `${import.meta.env.VITE_API_URL}/appointment/my-appointments`,
                        { withCredentials: true }
                    );
                    const apps = data.appointments || [];
                    
                    const notifs = apps.map(app => ({
                        id: `${app._id}-${app.status}`,
                        appointmentId: app._id,
                        department: app.department,
                        status: app.status,
                        date: app.appointment_date,
                        doctor: app.doctor ? `Dr. ${app.doctor.firstName} ${app.doctor.lastName}` : "Not Assigned"
                    }));
                    
                    const readNotifs = JSON.parse(localStorage.getItem('readNotifications') || '[]');
                    const readSet = new Set(readNotifs);
                    
                    let unread = 0;
                    notifs.forEach(n => {
                        if (!readSet.has(n.id)) unread++;
                    });
                    
                    setNotifications(notifs.reverse());
                    setUnreadCount(unread);
                } catch (error) {
                    console.error("Failed to fetch notifications");
                }
            };
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBellClick = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && unreadCount > 0) {
            const allIds = notifications.map(n => n.id);
            const existing = JSON.parse(localStorage.getItem('readNotifications') || '[]');
            const updated = Array.from(new Set([...existing, ...allIds]));
            localStorage.setItem('readNotifications', JSON.stringify(updated));
            setUnreadCount(0);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/patient/logout`, {
                withCredentials: true,
            });
            toast.success(res.data.message);
            setIsAuthenticated(false);
            navigateTo("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to logout");
        }
    };

    const navLinks = [
        { name: "HOME", path: "/" },
        { name: "DOCTORS", path: "/doctors" },
        { name: "APPOINTMENT", path: "/appointment" },
        { name: "ABOUT US", path: "/about" },
        ...(isAuthenticated ? [{ name: "HISTORY", path: "/my-appointments" }] : [])
    ];

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className='fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-4'
        >
            <div className="max-w-7xl mx-auto glass-panel px-4 md:px-6 py-3 flex justify-between items-center relative">
                {/* Logo - Always Visible */}
                <Link to="/" className="text-xl md:text-2xl font-black tracking-wider text-brand-dark dark:text-white flex items-center gap-2 flex-shrink-0">
                    <span className="bg-brand text-white w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg text-sm md:text-base">H</span>
                    <span className="hidden xs:block">HEALTHX</span>
                </Link>

                {/* Desktop Navigation (>= 1024px) */}
                <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                    <div className="flex gap-6">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className="relative font-bold text-brand-dark/80 dark:text-green-200 hover:text-brand-dark dark:hover:text-green-100 transition-colors group text-sm"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Tablet Navigation (768px - 1024px) */}
                <div className="hidden md:flex lg:hidden items-center gap-6">
                    <Link to="/" className="font-bold text-brand-dark/80 dark:text-green-200 hover:text-brand-dark text-sm">HOME</Link>
                    <Link to="/appointment" className="font-bold text-brand-dark/80 dark:text-green-200 hover:text-brand-dark text-sm">APPOINTMENT</Link>
                </div>

                {/* Actions & Hamburger (Visible across different breakpoints) */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Desktop Auth Button */}
                    <div className="hidden lg:block">
                        {isAuthenticated ? (
                            <button onClick={handleLogout} className='btn-primary text-xs px-4 py-2'>
                                LOGOUT
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigateTo("/login")} className='btn-primary text-xs px-4 py-2'>
                                LOGIN
                            </button>
                        )}
                    </div>

                    {/* Icons - Visible on all screens */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {isAuthenticated && (
                            <div className="relative" ref={notifRef}>
                                <button 
                                    onClick={handleBellClick} 
                                    className="p-2 rounded-xl bg-white/50 dark:bg-[#123c3c] hover:bg-white dark:hover:bg-[#1b4d4d] text-brand-dark dark:text-green-100 transition-colors shadow-sm relative"
                                    aria-label="Notifications"
                                >
                                    <Bell size={20} className="md:w-5 md:h-5 w-4 h-4" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                
                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-3 w-64 md:w-80 max-h-80 md:max-h-96 overflow-y-auto glass-panel p-4 shadow-2xl z-[60] rounded-2xl border border-brand-dark/10 dark:border-green-300/20"
                                        >
                                            <h3 className="font-black text-brand-dark dark:text-green-100 mb-3 border-b border-brand-dark/10 dark:border-green-300/20 pb-2">
                                                Notifications
                                            </h3>
                                            {notifications.length === 0 ? (
                                                <p className="text-sm text-brand-dark/70 dark:text-green-300 text-center py-4">
                                                    No new notifications
                                                </p>
                                            ) : (
                                                <div className="flex flex-col gap-3">
                                                    {notifications.map((notif) => (
                                                        <div key={notif.id} className="p-3 bg-white/50 dark:bg-[#1b4d4d]/50 rounded-xl">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className="text-[10px] font-bold text-brand uppercase">{notif.department}</span>
                                                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                                                                    notif.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    notif.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {notif.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs font-medium text-brand-dark dark:text-green-100 leading-tight">
                                                                {notif.status === 'Pending' ? 'Your appointment was booked.' : 
                                                                 notif.status === 'Accepted' ? `Approved by ${notif.doctor}.` : 
                                                                 'Appointment rejected.'}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <button 
                            onClick={toggleTheme} 
                            className="p-2 rounded-xl bg-white/50 dark:bg-[#123c3c] hover:bg-white dark:hover:bg-[#1b4d4d] text-brand-dark dark:text-green-100 transition-colors shadow-sm"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} className="md:w-5 md:h-5 w-4 h-4" /> : <Moon size={20} className="md:w-5 md:h-5 w-4 h-4" />}
                        </button>
                    </div>

                    {/* Hamburger Button (Visible < 1024px) */}
                    <button 
                        className='lg:hidden p-2 text-brand-dark dark:text-white hover:bg-brand-light dark:hover:bg-[#1b4d4d] rounded-lg transition-colors'
                        onClick={() => setShow(!show)}
                    >
                        {show ? <X size={24} className="md:w-7 md:h-7" /> : <Menu size={24} className="md:w-7 md:h-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile/Tablet Menu Drawer */}
            <AnimatePresence>
                {show && (
                    <>
                        {/* Overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShow(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] lg:hidden"
                        />
                        
                        {/* Drawer */}
                        <motion.div 
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-72 xs:w-80 glass-panel shadow-2xl z-[60] lg:hidden flex flex-col p-8 pt-24"
                        >
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.name} 
                                        to={link.path}
                                        onClick={() => setShow(false)}
                                        className="text-lg font-bold text-brand-dark dark:text-green-200 p-4 hover:bg-brand/10 dark:hover:bg-[#1b4d4d] rounded-xl transition-colors flex items-center justify-between group"
                                    >
                                        {link.name}
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brand">&rarr;</span>
                                    </Link>
                                ))}
                            </div>
                            
                            <div className="mt-auto pt-8 border-t border-brand-dark/10 dark:border-green-300/20">
                                {isAuthenticated ? (
                                    <button onClick={() => { handleLogout(); setShow(false); }} className='btn-primary w-full py-4 text-lg'>
                                        LOGOUT
                                    </button>
                                ) : (
                                    <button onClick={() => { navigateTo("/login"); setShow(false); }} className='btn-primary w-full py-4 text-lg'>
                                        LOGIN
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default Navbar;
