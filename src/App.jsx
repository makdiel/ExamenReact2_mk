import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Form, Button, Alert } from 'react-bootstrap';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { alertaSuccess, alertaError, alertaWarning } from '../functions';
import './App.css'
import ListaCategorias from './components/ListaCategorias';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<ListaCategorias />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
