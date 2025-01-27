import { Routes, Route } from 'react-router-dom'
import Index from './pages/Index'

function App() {
  console.log('App component mounted');
  return (
    <Routes>
      <Route path="/" element={<Index />} />
    </Routes>
  )
}

export default App
