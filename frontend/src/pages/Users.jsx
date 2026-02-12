import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Users({ me }){
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email:'', fullName:'', password:'', role:'user' })

  async function load(){
    const tId = me?.tenant?.id
    const qs = new URLSearchParams()
    if (search) qs.set('search', search)
    if (role) qs.set('role', role)
    const r = await api.get(`/tenants/${tId}/users${qs.toString()?`?${qs.toString()}`:''}`)
    setUsers(r.data.data.users || [])
  }
  useEffect(()=>{ if (me?.tenant?.id) load() }, [me?.tenant?.id, search, role])

  async function add(){
    const tId = me?.tenant?.id
    await api.post(`/tenants/${tId}/users`, form)
    setShow(false)
    setForm({ email:'', fullName:'', password:'', role:'user' })
    await load()
  }
  async function remove(id){
    if (!confirm('Delete user?')) return
    await api.delete(`/users/${id}`)
    await load()
  }

  return (
    <div style={{padding:20}}>
      <h2>Users</h2>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)} />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="tenant_admin">Tenant Admin</option>
        </select>
        <button onClick={()=>setShow(true)}>Add User</button>
      </div>

      {users.length===0 ? <div>No users</div> : (
        <table border="1" cellPadding="6">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive? 'Active':'Inactive'}</td>
                <td>
                  <button onClick={()=>remove(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {show && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.3)'}} onClick={()=>setShow(false)}>
          <div style={{background:'#fff', padding:16, maxWidth:420, margin:'10% auto'}} onClick={e=>e.stopPropagation()}>
            <h3>Add User</h3>
            <label>Email</label>
            <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            <label>Full Name</label>
            <input value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} />
            <label>Password</label>
            <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
            <label>Role</label>
            <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
              <option value="user">User</option>
              <option value="tenant_admin">Tenant Admin</option>
            </select>
            <div style={{marginTop:12}}>
              <button onClick={add}>Save</button>
              <button onClick={()=>setShow(false)} style={{marginLeft:8}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
