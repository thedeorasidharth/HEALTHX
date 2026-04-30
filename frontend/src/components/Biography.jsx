import React from "react";
import { motion } from "framer-motion";

const Biography = ({ imageUrl }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 min-h-screen flex items-center">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <img 
            src={imageUrl} 
            alt="Biography" 
            className="w-full max-w-md mx-auto drop-shadow-2xl rounded-2xl" 
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex flex-col gap-6"
        >
          <p className="text-brand font-bold tracking-widest uppercase">Biography</p>
          <h3 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-green-100 leading-tight">Who We Are</h3>
          <div className="space-y-4 text-brand-dark/70 dark:text-green-200 text-lg leading-relaxed">
            <p>
              At HealthX, we revolutionize the way patients access healthcare by providing a seamless platform for booking doctor appointments anytime, anywhere. Our mission is to bridge the gap between patients and medical professionals, ensuring timely access to quality healthcare.
            </p>
            <p>
              We cater to various specializations, allowing users to find the right doctor for their specific needs. HealthX provides detailed profiles of healthcare providers, including qualifications and experience.
            </p>
            <p>
              Security and privacy are at the core of HealthX. We prioritize safeguarding patient information and ensure a secure environment for managing medical appointments.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Biography;