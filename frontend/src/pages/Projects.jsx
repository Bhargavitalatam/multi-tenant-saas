import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Projects(){
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name:'', description:'', status:'active' })

  async function load(){
    const q = new URLSearchParams()
    if (filter) q.set('status', filter)
    if (search) q.set('search', search)
    const r = await api.get('/projects' + (q.toString()?`?${q.toString()}`:''))
    setProjects(r.data.data.projects || [])
  }
  useEffect(()=>{ load() }, [filter, search])

  async function create(){
    await api.post('/projects', form)
    setShow(false)
    setForm({ name:'', description:'', status:'active' })
    await load()
  }

  async function remove(id){
    if (!confirm('Delete project?')) return
    await api.delete('/projects/'+id)
    await load()
  }

  return (
    <div style={{padding:20}}>
      <h2>Projects</h2>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <select value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="completed">Completed</option>
        </select>
        <input placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)} />
        <button onClick={()=>setShow(true)}>Create New Project</button>
      </div>
      <div>
        {projects.length===0 ? <div>No projects yet.</div> : (
          <ul>
            {projects.map(p => (
              <li key={p.id} style={{marginBottom:8}}>
                <b>{p.name}</b> – {p.status} – {p.taskCount} tasks – by {p.createdBy.fullName}
                <span style={{marginLeft:8}}>
                  <Link to={`/projects/${p.id}`}>View</Link>
                  {' | '}
                  <button onClick={()=>remove(p.id)} style={{marginLeft:4}}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {show && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.3)'}} onClick={()=>setShow(false)}>
          <div style={{background:'#fff', padding:16, maxWidth:420, margin:'10% auto'}} onClick={e=>e.stopPropagation()}>
            <h3>Create Project</h3>
            <label>Name</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <label>Description</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            <label>Status</label>
            <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="completed">Completed</option>
            </select>
            <div style={{marginTop:12}}>
              <button onClick={create}>Save</button>
              <button onClick={()=>setShow(false)} style={{marginLeft:8}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
