import React from 'react'
import Hero from "../components/Hero"
import Biography from "../components/Biography"
import Biography2 from "../components/Biography2"
import Departments from "../components/Departments"
import MessageForm from "../components/MessageForm"


const Home = () => {
  return (
    <div>
      <Hero title={"Welcome to HEALTHX"} imageUrl={"./hero.png"}/>
      <Biography imageUrl={"/about.png"}/>
      <Biography2 imageUrl={"/Biography2.png"}/>
      <Departments/>
      <MessageForm/>

    </div>
  )
}

export default Home
