import React from 'react'

export default function Modal({ dish, onClose }) {
  if (!dish) return null

  const whatsappUrl = `https://wa.me/5511977776666?text=Quero%20pedir%201x%20${encodeURIComponent(dish.title)}`

  return (
    <div className={`modal show`} onClick={(e) => { if (e.target.classList.contains('modal')) onClose() }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>×</span>
        <img src={dish.img} alt={dish.title} />
        <div className="modal-info">
          <h2>{dish.title}</h2>
          <p>{dish.desc}</p>
          <h3>{dish.price}</h3>
          <br />
          <a href={whatsappUrl} className="btn-primary" target="_blank" rel="noreferrer">Pedir pelo WhatsApp</a>
        </div>
      </div>
    </div>
  )
}