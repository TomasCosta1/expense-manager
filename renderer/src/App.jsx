import React from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import Dashboard from './pages/Dashboard'
import ExpensesPage from './pages/ExpensesPage'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Header />
      <div>
        <Sidebar />
      <div style={{ marginLeft: '250px', marginTop: '64px', padding: '16px'}}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/ingresos" element={<h2>Ingresos</h2>} />
          <Route path="/configuracion" element={<h2>Configuracion</h2>} />
        </Routes>
      </div>
      </div>
    </>
  )
}

export default App
