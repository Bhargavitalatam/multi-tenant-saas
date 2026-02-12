import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

export default function ProjectDetails(){
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [taskForm, setTaskForm] = useState({ title:'', description:'', priority:'medium' })

  async function load(){
    const p = await api.get('/projects?limit=1') // minimal; real impl would GET /api/projects/:id
    setProject(p.data.data.projects.find(x=>x.id===projectId) || null)
    const t = await api.get(`/projects/${projectId}/tasks`)
    setTasks(t.data.data.tasks || [])
  }
  useEffect(()=>{ load() }, [projectId])

  async function addTask(){
    await api.post(`/projects/${projectId}/tasks`, taskForm)
    setTaskForm({ title:'', description:'', priority:'medium' })
    await load()
  }

  async function changeStatus(taskId, status){
    await api.patch(`/tasks/${taskId}/status`, { status })
    await load()
  }

  return (
    <div style={{padding:20}}>
      <h2>Project Details</h2>
      {!project ? <div>Loading...</div> : (
        <div>
          <div><b>{project.name}</b> – {project.status}</div>
          <div>{project.description}</div>
        </div>
      )}

      <h3 style={{marginTop:16}}>Tasks</h3>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Title" value={taskForm.title} onChange={e=>setTaskForm({...taskForm, title:e.target.value})} />
        <input placeholder="Description" value={taskForm.description} onChange={e=>setTaskForm({...taskForm, description:e.target.value})} />
        <select value={taskForm.priority} onChange={e=>setTaskForm({...taskForm, priority:e.target.value})}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            {t.title} – {t.status} – {t.priority}
            <button onClick={()=>changeStatus(t.id,'todo')} style={{marginLeft:6}}>Todo</button>
            <button onClick={()=>changeStatus(t.id,'in_progress')} style={{marginLeft:6}}>In Progress</button>
            <button onClick={()=>changeStatus(t.id,'completed')} style={{marginLeft:6}}>Completed</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
