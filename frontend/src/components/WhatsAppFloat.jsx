import React from 'react'

export default function WhatsAppFloat() {
  const number = '5511977776666' // atualize aqui
  const text = encodeURIComponent('Olá! Gostaria de fazer uma reserva')
  const url = `https://wa.me/${number}?text=${text}`
  return (
    <a className="whatsapp-float" href={url} target="_blank" rel="noreferrer" aria-label="WhatsApp">
      <i className="fab fa-whatsapp" style={{ fontSize: '1.6rem' }}></i>
    </a>
  )
}