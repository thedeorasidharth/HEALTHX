import React from "react";
import { motion } from "framer-motion";

const Hero = ({ title, imageUrl }) => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden flex items-center justify-center">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-dark/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col gap-8 text-center lg:text-left z-10"
        >
          <h1 className="text-5xl md:text-6xl font-black text-brand-dark dark:text-green-100 leading-tight drop-shadow-sm">
            {title}
          </h1>
          <p className="text-xl text-brand-dark/70 dark:text-green-200 leading-relaxed font-medium">
            Welcome to HEALTHX, your state-of-the-art healthcare management system. 
            We prioritize your well-being by offering seamless appointment booking, 
            instant communication with our top-tier professionals, and a world-class 
            user experience designed around your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="btn-primary">Book Appointment</button>
            <button className="btn-outline">Learn More</button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative flex justify-center"
        >
          <motion.img 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            src={imageUrl} 
            alt="Hero" 
            className="w-full max-w-lg object-contain drop-shadow-2xl z-10"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
