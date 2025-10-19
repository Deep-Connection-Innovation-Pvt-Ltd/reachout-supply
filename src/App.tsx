import './App.css'
import HomePage from './pages/HomePage';
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <>
        <BrowserRouter basename="/professional">
        <HomePage/>
      </BrowserRouter>
    </>
  )
}

export default App
