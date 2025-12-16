import React from 'react'

export default function About() {
  return (
    <section id="sobre">
      <h2>Nossa História</h2>
      <div className="grid">
        <div>
          <h3>Tradição que atravessa gerações</h3>
          <p>Fundado por Antonio Rossi, imigrante italiano que trouxe as receitas da nonna de Nápoles. Hoje, comandado pela terceira geração, mantemos o fogo a lenha, os ingredientes importados e o carinho em cada prato.</p>
          <br />
          <p>★ Premiado 5 vezes como Melhor Italiano de SP</p>
          <p>★ Nota 4.9 no Google (1.847 avaliações)</p>
        </div>
        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800" alt="Família Rossi" />
      </div>
    </section>
  )
}