import React from 'react'

export default function Contact() {
  return (
    <section id="contato">
      <h2>Onde Estamos</h2>
      <iframe className="mapa"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.138392939124!2d-46.6540565!3d-23.564927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59a5e3c1f3d9%3A0x41d3e9447e8bb550!2sR.%20Oscar%20Freire%2C%208%20-%20Cerqueira%20C%C3%A9sar%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1733500000000!5m2!1spt-BR!2sbr"
        allowFullScreen=""
        loading="lazy"
        title="Mapa"
      />
      <br /><br />
      <p>Av. Oscar Freire, 8 – Jardins, São Paulo – SP<br />
      Terça a Domingo | 12h–15h • 19h–23h<br />
      <strong>Tel:</strong> (11) 3999-8888 | WhatsApp: (11) 97777-6666</p>
    </section>
  )
}