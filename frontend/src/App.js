import { Route, Routes } from 'react-router-dom';
import './App.css';
import ChatPage from './Pages/ChatPage';
import HomePage from './Pages/HomePage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage/>} exact />
        <Route path="/chats" element={<ChatPage/>} />
      </Routes>
    </div>
  );
}

export default App;
