import './App.css';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useState } from 'react';
import { MyContext } from './MyContext';
import {v1 as uuidv1} from "uuid";
import { AuthProvider, useAuth } from './AuthContext';
import AuthPage from './AuthPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null); 
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const providerValue = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads
  };

  if (loading) {
    return (
      <div className="auth-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "#0b0c10", color: "#f3f4f6", height: "100vh", width: "100vw" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className='app'>
      <MyContext.Provider value = {providerValue}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;