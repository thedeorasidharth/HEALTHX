import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const hours = [
    { id: 1, day: "Monday", time: "9:00 AM - 11:00 PM" },
    { id: 2, day: "Tuesday", time: "12:00 PM - 12:00 AM" },
    { id: 3, day: "Wednesday", time: "10:00 AM - 10:00 PM" },
    { id: 4, day: "Thursday", time: "9:00 AM - 9:00 PM" },
    { id: 5, day: "Friday", time: "3:00 PM - 9:00 PM" },
    { id: 6, day: "Saturday", time: "9:00 AM - 3:00 PM" },
  ];

  return (
    <footer className="bg-brand-dark text-white pt-20 pb-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-black tracking-wider flex items-center gap-2">
              <span className="bg-brand text-white w-10 h-10 rounded-xl flex items-center justify-center">H</span>
              HEALTHX
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Your premium healthcare management system, dedicated to bridging the gap between patients and medical professionals.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-white/60 hover:text-brand-light transition-colors">Home</Link></li>
              <li><Link to="/appointment" className="text-white/60 hover:text-brand-light transition-colors">Appointment</Link></li>
              <li><Link to="/about" className="text-white/60 hover:text-brand-light transition-colors">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Hours</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              {hours.map((element) => (
                <li key={element.id} className="flex justify-between border-b border-white/10 pb-2">
                  <span>{element.day}</span>
                  <span>{element.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Contact</h4>
            <div className="space-y-4 text-white/60 text-sm">
              <div className="flex items-center gap-3">
                <FaPhone className="text-brand-light text-lg" />
                <span>+91 9001890408</span>
              </div>
              <div className="flex items-center gap-3">
                <MdEmail className="text-brand-light text-lg" />
                <span>deorasidharth@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaLocationArrow className="text-brand-light text-lg" />
                <span>Sheoganj (Sirohi), Rajasthan</span>
              </div>
            </div>
          </div>

        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-white/40 text-sm">
          &copy; {new Date().getFullYear()} HEALTHX. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;