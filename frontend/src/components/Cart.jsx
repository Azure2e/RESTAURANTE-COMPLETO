// src/components/Cart.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiX, FiShare2 } from 'react-icons/fi'
import { toast } from 'react-toastify'

function formatCurrency(num = 0) {
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, total } = useCart()
  const [open, setOpen] = useState(false)
  const [bump, setBump] = useState(false)
  const totalItems = items.reduce((acc, it) => acc + (it.qty || 1), 0)
  const closeRef = useRef(null)

  // Bump animation when items change — separated into timeouts to avoid set-state-in-effect rule
  useEffect(() => {
    if (!items.length) return
    const start = setTimeout(() => setBump(true), 0)
    const stop = setTimeout(() => setBump(false), 450)
    return () => {
      clearTimeout(start)
      clearTimeout(stop)
    }
  }, [items.length])

  // Focus close button when opening for accessibility
  useEffect(() => {
    if (open && closeRef.current) closeRef.current.focus()
  }, [open])

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function sendToWhatsApp() {
    if (!items.length) {
      toast.warning('Seu carrinho está vazio')
      return
    }
    const lines = items.map((it) => `${it.qty}x ${it.title} — ${formatCurrency(it.priceValue)} cada`)
    lines.push('')
    lines.push(`Total: ${formatCurrency(total)}`)
    const message = `Olá! Quero fazer um pedido:\n\n${lines.join('\n')}`
    const url = `https://wa.me/5511977776666?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    toast.success('Abrindo WhatsApp para finalizar o pedido…')
    setOpen(false)
  }

  async function handleShare() {
    const url = window.location.href
    const title = 'La Bella Italia'
    const text = 'Confira o cardápio e faça seu pedido!'
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        toast.success('Link compartilhado!')
      } catch {
        // user cancelled or no share support
      }
      return
    }
    // Clipboard fallback
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
        toast.success('Link copiado para a área de transferência')
      } else {
        const promptCopy = window.prompt('Copie o link do restaurante:', url)
        if (promptCopy) toast.success('Link copiado!')
      }
    } catch {
      toast.error('Não foi possível copiar o link — tente manualmente')
    }
  }

  return (
    <>
      {open && <div className="cart-overlay" onClick={() => setOpen(false)} aria-hidden="true" />}

      {/* Share FAB — topmost of the stack */}
      <button
        className="share-fab"
        aria-label="Compartilhar link do restaurante"
        title="Compartilhar"
        onClick={handleShare}
      >
        <FiShare2 size={18} />
      </button>

      {/* Cart FAB */}
      <button
        className={`cart-fab ${bump ? 'bump' : ''}`}
        aria-label="Abrir carrinho"
        onClick={() => setOpen((s) => !s)}
      >
        <FiShoppingCart size={22} />
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </button>

      <aside
        className={`cart-drawer ${open ? 'open' : ''}`}
        role="dialog"
        aria-label="Carrinho de pedidos"
        aria-modal={open}
        aria-hidden={!open}
      >
        <div className="cart-header" role="toolbar" aria-label="Cabeçalho do carrinho">
          <h3>Seu Pedido</h3>
          <div className="cart-header-actions">
            <button
              className="btn-clear"
              onClick={() => { clearCart(); toast.info('Carrinho esvaziado') }}
            >
              Esvaziar
            </button>
            <button
              ref={closeRef}
              className="btn-close"
              onClick={() => setOpen(false)}
              aria-label="Fechar carrinho"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        <div className="cart-body" role="list" aria-label="Itens do carrinho">
          {!items.length && (
            <div className="cart-empty">
              Seu carrinho está vazio — adicione pratos clicando em "Adicionar".
            </div>
          )}

          {items.map((it, idx) => (
            <div key={idx} className="cart-item" role="listitem">
              <div className="cart-thumb">
                <img
                  src={it.img || '/placeholder.png'}
                  alt={it.title}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png' }}
                />
              </div>

              <div className="cart-info">
                <h4 className="cart-title">{it.title}</h4>
                {it.description && <p className="cart-meta">{it.description}</p>}

                <div className="cart-bottom-row">
                  <div className="cart-controls" role="group" aria-label={`Quantidade de ${it.title}`}>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(idx, Math.max((it.qty || 1) - 1, 0))}
                      aria-label="Diminuir quantidade"
                    >
                      <FiMinus />
                    </button>
                    <span className="qty">{it.qty || 1}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(idx, (it.qty || 1) + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <div className="cart-price">
                    <div className="per-item">{formatCurrency(it.priceValue)}</div>
                    <div className="line-total">{formatCurrency(it.priceValue * (it.qty || 1))}</div>
                  </div>
                </div>
              </div>

              <button
                className="btn-remove"
                onClick={() => removeItem(idx)}
                aria-label={`Remover ${it.title}`}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-footer" role="contentinfo">
          <div className="cart-total">
            <div className="total-label">Total</div>
            <div className="total-amount">{formatCurrency(total)}</div>
          </div>

          <div className="cart-actions">
            <button onClick={() => setOpen(false)} className="btn-secondary">Continuar navegando</button>
            <button onClick={sendToWhatsApp} className="btn-primary btn-checkout" disabled={!items.length}>
              Enviar pelo WhatsApp
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}