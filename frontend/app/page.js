"use client"
import Cors from 'cors'
import Header from "./components/header"

export default function Home() {
  const cors = Cors({
    methods: ['POST', 'GET', 'HEAD'],
  })
  
  return (
    <main>
      <Header />
     


    </main>
  )
}
