import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Departments = () => {
  const departmentsArray = [
    { name: "Pediatrics", imageUrl: "/departments/pedia.jpg" },
    { name: "Orthopedics", imageUrl: "/departments/ortho.jpg" },
    { name: "Cardiology", imageUrl: "/departments/cardio.jpg" },
    { name: "Neurology", imageUrl: "/departments/neuro.jpg" },
    { name: "Oncology", imageUrl: "/departments/onco.jpg" },
    { name: "Radiology", imageUrl: "/departments/radio.jpg" },
    { name: "Physical Therapy", imageUrl: "/departments/therapy.jpg" },
    { name: "Dermatology", imageUrl: "/departments/derma.jpg" },
    { name: "ENT", imageUrl: "/departments/ent.jpg" },
  ];

  const responsive = {
    extraLarge: { breakpoint: { max: 3000, min: 1324 }, items: 4, slidesToSlide: 1 },
    large: { breakpoint: { max: 1324, min: 1005 }, items: 3, slidesToSlide: 1 },
    medium: { breakpoint: { max: 1005, min: 700 }, items: 2, slidesToSlide: 1 },
    small: { breakpoint: { max: 700, min: 0 }, items: 1, slidesToSlide: 1 },
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-black text-brand-dark dark:text-green-100 mb-12 text-center">Departments</h2>
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        className="pb-12"
      >
        {departmentsArray.map((depart, index) => (
          <div key={index} className="px-4">
            <div className="relative rounded-3xl overflow-hidden h-80 group cursor-pointer shadow-lg">
              <img 
                src={depart.imageUrl} 
                alt={depart.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center">
                  <h3 className="text-white font-bold text-xl tracking-wide uppercase">{depart.name}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default Departments;