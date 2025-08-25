import React from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './pages/Dashboard'
import ExpensesPage from './pages/ExpensesPage'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: '250px'}}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/ingresos" element={<h2>Ingresos</h2>} />
          <Route path="/configuracion" element={<h2>Configuracion</h2>} />
        </Routes>
      </div>
    </>
  )
}

export default App
