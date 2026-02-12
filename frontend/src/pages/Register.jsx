import React, { useState } from 'react'
import api from '../api'

export default function Register(){
  const [form, setForm] = useState({ tenantName:'', subdomain:'', adminEmail:'', adminFullName:'', adminPassword:'', confirm:'' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  async function onSubmit(e){
    e.preventDefault()
    setErr(''); setMsg('')
    if (form.adminPassword !== form.confirm) { setErr('Passwords do not match'); return }
    setLoading(true)
    try{
      await api.post('/auth/register-tenant', {
        tenantName: form.tenantName,
        subdomain: form.subdomain.toLowerCase(),
        adminEmail: form.adminEmail,
        adminPassword: form.adminPassword,
        adminFullName: form.adminFullName,
      })
      setMsg('Registered! You can now login.')
    }catch(e){ setErr(e?.response?.data?.message || 'Registration failed') }
    setLoading(false)
  }

  return (
    <div style={{maxWidth:420, margin:'40px auto'}}>
      <h2>Tenant Registration</h2>
      {msg && <div style={{color:'green'}}>{msg}</div>}
      {err && <div style={{color:'red'}}>{err}</div>}
      <form onSubmit={onSubmit}>
        <label>Organization Name</label>
        <input name="tenantName" value={form.tenantName} onChange={onChange} required />
        <label>Subdomain</label>
        <input name="subdomain" value={form.subdomain} onChange={onChange} required />
        <div style={{fontSize:12, color:'#666'}}>Preview: {form.subdomain || 'your-subdomain'}.yourapp.com</div>
        <label>Admin Email</label>
        <input type="email" name="adminEmail" value={form.adminEmail} onChange={onChange} required />
        <label>Admin Full Name</label>
        <input name="adminFullName" value={form.adminFullName} onChange={onChange} required />
        <label>Password</label>
        <input type="password" name="adminPassword" value={form.adminPassword} onChange={onChange} required />
        <label>Confirm Password</label>
        <input type="password" name="confirm" value={form.confirm} onChange={onChange} required />
        <div style={{marginTop:12}}>
          <button disabled={loading}>{loading?'Registering...':'Register'}</button>
        </div>
      </form>
    </div>
  )
}
