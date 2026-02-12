import React, { useState } from 'react'
import api from '../api'

export default function Login({ onLogin }){
  const [form, setForm] = useState({ email:'', password:'', tenantSubdomain:'' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  async function onSubmit(e){
    e.preventDefault()
    setErr('')
    setLoading(true)
    try{
      const r = await api.post('/auth/login', form)
      localStorage.setItem('token', r.data.data.token)
      const me = await api.get('/auth/me')
      onLogin?.(me.data.data)
      window.location.href = '/dashboard'
    }catch(e){ setErr(e?.response?.data?.message || 'Login failed') }
    setLoading(false)
  }

  return (
    <div style={{maxWidth:360, margin:'40px auto'}}>
      <h2>Login</h2>
      {err && <div style={{color:'red'}}>{err}</div>}
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={onChange} required />
        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} required />
        <label>Tenant Subdomain</label>
        <input name="tenantSubdomain" value={form.tenantSubdomain} onChange={onChange} required />
        <div style={{marginTop:12}}>
          <button disabled={loading}>{loading?'Logging in...':'Login'}</button>
        </div>
      </form>
    </div>
  )
}
