import React from 'react'

export default function Gallery() {
  const imgs = [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    'https://images.unsplash.com/photo-1604382354936-07c5d5048c45?w=800',
    'https://images.unsplash.com/photo-1574651359484-6d7c47b50429?w=800',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
  ]

  return (
    <section id="galeria">
      <h2>Galeria</h2>
      <div className="galeria">
        {imgs.map((src, i) => <img key={i} src={src} alt={`Galeria ${i+1}`} />)}
      </div>
    </section>
  )
}