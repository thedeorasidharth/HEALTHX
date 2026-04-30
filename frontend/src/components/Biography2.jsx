import React from "react";
import { motion } from "framer-motion";

const Biography2 = ({ title, imageUrl }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 min-h-screen flex items-center">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
        
        {/* Right side on desktop: Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 w-full"
        >
          <img 
            src={imageUrl} 
            alt="What we do" 
            className="w-full max-w-md mx-auto drop-shadow-2xl rounded-2xl object-cover" 
          />
        </motion.div>
        
        {/* Left side on desktop: Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col gap-6"
        >
          <p className="text-brand font-bold tracking-widest uppercase">{title || "Services"}</p>
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-green-100 leading-tight">What we do?</h2>
          <div className="space-y-4 text-brand-dark/70 dark:text-green-200 text-lg leading-relaxed">
            <p>
              HealthX is an innovative healthcare platform that simplifies the process of booking appointments with doctors. With HealthX, users can easily connect with medical professionals from anywhere, ensuring convenient and hassle-free access to healthcare services.
            </p>
            <p>
              The platform is designed to enhance patient experience by offering a seamless appointment booking system, allowing individuals to manage their health effectively without location constraints.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Biography2;
