import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NotePage from './NotePage'
import LoginPage from './LoginPage'
import HomePage from './HomePage'
import RegisterPage from './RegisterPage'


function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path="/notes" element={<NotePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App
