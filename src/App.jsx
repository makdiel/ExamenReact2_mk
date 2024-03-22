import { useState } from 'react'
//import { Form, Button, Alert } from 'react-bootstrap';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
//import { alertaSuccess, alertaError, alertaWarning } from '../functions';
import ListaCategorias from './components/ListaCategorias';
import './App.css'

function App() { 
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<ListaCategorias />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
