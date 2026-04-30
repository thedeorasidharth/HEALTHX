import React from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";
const AboutUs = () => {
  return (
    <>
      <Hero
        title={"Learn More About Us | HEALTHX"}
        imageUrl={"/heyme.png"} 
      />
      <Biography imageUrl={"/heyus.png"} />
    </>
  );
};

export default AboutUs;