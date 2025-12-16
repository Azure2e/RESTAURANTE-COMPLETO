import React, { useState } from 'react'

export default function Reservation() {
  const [form, setForm] = useState({
    nome: '', _replyto: '', telefone: '', data: '', horario: '', pessoas: 1, observacao: ''
  })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Replace with your Formspree id
  const FORMSPREE_URL = 'https://formspree.io/f/SEU_CODIGO_AQUI'

  async function handleSubmit(e) {
    // JS client-side submit (progressive enhancement)
    if (e) e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setSuccess(true)
        setForm({ nome: '', _replyto: '', telefone: '', data: '', horario: '', pessoas: 1, observacao: '' })
      } else {
        alert('Erro ao enviar. Verifique o endpoint do Formspree. Você também pode nos enviar um e-mail.')
      }
    } catch (err) {
      console.error(err)
      // Provide a graceful fallback: open mailto with prefilled text
      const prefilled = encodeURIComponent(`Reserva de: ${form.nome}\nData: ${form.data}\nHorário: ${form.horario}\nPessoas: ${form.pessoas}\nTelefone: ${form.telefone}\nObservação: ${form.observacao}`)
      if (confirm('Erro na conexão; quer abrir seu cliente de e-mail para enviar a reserva?')) {
        window.location.href = `mailto:contato@labellaitalia.com.br?subject=Reserva&body=${prefilled}`
      } else {
        alert('Você pode tentar novamente mais tarde ou usar o contato via WhatsApp.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="reserva">
      <h2>Faça sua Reserva</h2>
      <p style={{ marginBottom: 40, fontSize: '1.2rem' }}>Receberemos sua reserva instantaneamente por e-mail</p>

      {!success ? (
        <>
          {/* NOTE: the form keeps an action/method fallback in case JS is disabled */}
          <form
            className="form-reserva"
            onSubmit={handleSubmit}
            action={FORMSPREE_URL}
            method="POST"
            encType="application/x-www-form-urlencoded"
          >
            <input type="text" name="nome" placeholder="Seu nome" required value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} />
            <input type="email" name="_replyto" placeholder="Seu e-mail" required value={form._replyto} onChange={(e) => setForm({...form, _replyto: e.target.value})} />
            <input type="tel" name="telefone" placeholder="WhatsApp com DDD" required value={form.telefone} onChange={(e) => setForm({...form, telefone: e.target.value})} />
            <input type="date" name="data" required value={form.data} onChange={(e) => setForm({...form, data: e.target.value})} />
            <select name="horario" required value={form.horario} onChange={(e) => setForm({...form, horario: e.target.value})}>
              <option value="">Horário desejado</option>
              <option>12:00</option><option>12:30</option><option>13:00</option><option>13:30</option>
              <option>19:00</option><option>19:30</option><option>20:00</option><option>20:30</option><option>21:00</option><option>21:30</option><option>22:00</option>
            </select>
            <input type="number" name="pessoas" placeholder="Quantas pessoas?" min="1" max="20" required value={form.pessoas} onChange={(e) => setForm({...form, pessoas: e.target.value})} />
            <textarea name="observacao" rows="4" placeholder="Alguma observação? (aniversário, alergia, mesa externa...)" value={form.observacao} onChange={(e) => setForm({...form, observacao: e.target.value})}></textarea>

            <input type="text" name="_gotcha" style={{ display: 'none' }} />

            <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Reservar Mesa'}</button>
          </form>

          <noscript>
            <p style={{ color: '#fff', marginTop: 15 }}>Seu navegador não tem JavaScript habilitado. Envie sua reserva por email: <a href="mailto:contato@labellaitalia.com.br">contato@labellaitalia.com.br</a></p>
          </noscript>
        </>
      ) : (
        <div className="obrigado" id="obrigado" style={{ display: 'block' }}>
          <i className="fas fa-check-circle" style={{ color: '#25D366', fontSize: '4rem' }} aria-hidden="true"></i>
          <h3>Reserva recebida!</h3>
          <p>Em até 5 minutos entraremos em contato pelo WhatsApp ou e-mail. Obrigado!</p>
        </div>
      )}
    </section>
  )
}