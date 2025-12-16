import React, { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Reservation from './components/Reservation'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Modal from './components/Modal'
import Cart from './components/Cart'
import { CartProvider } from './context/CartContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  const [selectedDish, setSelectedDish] = useState(null)

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light'
    document.body.dataset.theme = theme
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })

    document.querySelectorAll('section, .prato, .galeria img').forEach((s) => {
      s.classList.add('reveal')
      observer.observe(s)
    })

    return () => observer.disconnect()
  }, [])

  function openModal(dish) {
    setSelectedDish(dish)
  }

  function closeModal() {
    setSelectedDish(null)
  }

  return (
    <CartProvider>
      <Nav />
      <main>
        <Hero />
        <About />
        <Menu openModal={openModal} />
        <Gallery />
        <Reservation />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFloat />

      <Modal dish={selectedDish} onClose={closeModal} />
      <Cart />

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
        pauseOnFocusLoss
      />
    </CartProvider>
  )
}