import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/message/getall`,
          { withCredentials: true }
        );
        setMessages(data.messages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <div className="lg:ml-24 min-h-screen p-6 lg:p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-wide">MESSAGES</h1>
        <p className="text-white/60 mt-2 font-medium">Review inquiries and feedback from patients</p>
      </div>

      {messages && messages.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {messages.map((msg) => (
            <motion.div 
              key={msg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border-l-4 border-brand-light flex flex-col justify-between"
            >
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-brand/10 text-brand font-bold w-10 h-10 flex items-center justify-center rounded-full uppercase">
                    {msg.firstName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">{`${msg.firstName} ${msg.lastName}`}</h4>
                    <p className="text-sm text-brand-dark/60">{msg.email}</p>
                  </div>
                </div>
                <div className="mt-4 bg-brand-light/30 p-4 rounded-xl text-brand-dark/80 italic text-sm leading-relaxed">
                  "{msg.message}"
                </div>
              </div>
              <div className="flex justify-end text-sm text-brand font-bold">
                {msg.phone}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-10 text-center">
          <h2 className="text-2xl font-bold text-white/80">No Messages Found!</h2>
        </div>
      )}
    </div>
  );
};

export default Messages;