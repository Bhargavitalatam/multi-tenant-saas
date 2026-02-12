import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Dashboard({ me }){
  const [projects, setProjects] = useState([])
  const [myTasks, setMyTasks] = useState([])

  useEffect(() => {
    api.get('/projects?limit=5').then(r=> setProjects(r.data.data.projects || []))
  }, [])

  useEffect(() => {
    (async ()=>{
      const pr = await api.get('/projects?limit=10')
      const projs = pr.data.data.projects || []
      const all = []
      for (const p of projs){
        const t = await api.get(`/projects/${p.id}/tasks?assignedTo=${me?.id}`)
        all.push(...(t.data.data.tasks || []))
      }
      setMyTasks(all)
    })()
  }, [me?.id])

  const stats = {
    totalProjects: projects.length,
    totalTasks: myTasks.length,
    completedTasks: myTasks.filter(t=>t.status==='completed').length,
    pendingTasks: myTasks.filter(t=>t.status!=='completed').length,
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Welcome back{me?.fullName ? `, ${me.fullName}` : ''} 👋</h2>
        <p className="text-gray-600">Here’s a quick overview of your work</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={stats.totalProjects} color="bg-blue-50 text-blue-700" />
        <StatCard title="My Tasks" value={stats.totalTasks} color="bg-amber-50 text-amber-700" />
        <StatCard title="Completed" value={stats.completedTasks} color="bg-emerald-50 text-emerald-700" />
        <StatCard title="Pending" value={stats.pendingTasks} color="bg-rose-50 text-rose-700" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="card">
          <div className="card-header">Recent Projects</div>
          <div className="card-body">
            {projects.length === 0 ? (
              <Empty title="No projects yet" subtitle="Create your first project to get started" />
            ) : (
              <ul className="space-y-3">
                {projects.map(p => (
                  <li key={p.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-gray-600">{p.taskCount} tasks • {p.status}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs border ${badgeColor(p.status)}`}>{p.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">My Tasks</div>
          <div className="card-body">
            {myTasks.length === 0 ? (
              <Empty title="No assigned tasks" subtitle="Tasks assigned to you will appear here" />
            ) : (
              <ul className="space-y-3">
                {myTasks.map(t => (
                  <li key={t.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-sm text-gray-600">Priority: {t.priority} • Status: {t.status}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs border ${priorityColor(t.priority)}`}>{t.priority}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }){
  return (
    <div className={`card ${color}`}>
      <div className="card-body">
        <div className="text-sm text-gray-600">{title}</div>
        <div className="text-3xl font-semibold">{value}</div>
      </div>
    </div>
  )
}

function Empty({ title, subtitle }){
  return (
    <div className="text-center py-8">
      <div className="text-gray-900 font-medium">{title}</div>
      <div className="text-gray-600 text-sm">{subtitle}</div>
    </div>
  )
}

function badgeColor(status){
  switch(status){
    case 'active': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'archived': return 'bg-gray-50 text-gray-700 border-gray-200'
    case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    default: return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

function priorityColor(p){
  switch(p){
    case 'high': return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'low': return 'bg-blue-50 text-blue-700 border-blue-200'
    default: return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}
