import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar({ me, onLogout }){
  return (
    <header className="bg-white/70 backdrop-blur border-b border-gray-200">
      <nav className="container flex items-center gap-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-brand" />
          <span className="font-semibold text-gray-900">Multi-Tenant SaaS</span>
        </Link>

        <div className="flex items-center gap-4 ml-6">
          <Link className="text-gray-700 hover:text-brand" to="/dashboard">Dashboard</Link>
          <Link className="text-gray-700 hover:text-brand" to="/projects">Projects</Link>
          {me?.role !== 'user' && (
            <Link className="text-gray-700 hover:text-brand" to="/tasks">Tasks</Link>
          )}
          {me?.role === 'tenant_admin' && (
            <Link className="text-gray-700 hover:text-brand" to="/users">Users</Link>
          )}
          {me?.role === 'super_admin' && (
            <Link className="text-gray-700 hover:text-brand" to="/tenants">Tenants</Link>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {me ? (
            <>
              <span className="text-sm text-gray-600">{me.fullName} <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-xs ml-1">{me.role}</span></span>
              <button onClick={onLogout} className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800">Logout</button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-dark">Login</Link>
          )}
        </div>
      </nav>
    </header>
  )
}
