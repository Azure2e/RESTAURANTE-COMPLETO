/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer } from 'react'

const CartContext = createContext()

function parsePrice(priceStr = '') {
  const num = priceStr.replace(/[R$\s.]/g, '').replace(',', '.')
  return Number(num) || 0
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item } = action.payload
      const idx = state.items.findIndex((it) => it.title === item.title)
      if (idx >= 0) {
        const items = [...state.items]
        items[idx] = { ...items[idx], qty: items[idx].qty + 1 }
        return { ...state, items }
      }
      return {
        ...state,
        items: [...state.items, { ...item, qty: 1, priceValue: parsePrice(item.price) }]
      }
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((it, i) => i !== action.payload.index)
      return { ...state, items }
    }
    case 'UPDATE_QTY': {
      const { index, qty } = action.payload
      const items = [...state.items]
      items[index] = { ...items[index], qty: Math.max(1, qty) }
      return { ...state, items }
    }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: { item } })
  const removeItem = (index) => dispatch({ type: 'REMOVE_ITEM', payload: { index } })
  const updateQty = (index, qty) => dispatch({ type: 'UPDATE_QTY', payload: { index, qty } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const total = state.items.reduce((acc, it) => acc + it.priceValue * (it.qty || 1), 0)

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)