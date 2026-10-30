import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { API_BASE_URL } from "./config";

function ChatWindow() {
    const {
        prompt, setPrompt,
        reply, setReply,
        currThreadId,
        prevChats, setPrevChats,
        newChat, setNewChat,
        allThreads, setAllThreads
    } = useContext(MyContext);
    const [loading, setLoading] = useState(false);

    const getReply = async () => {
        const messageToSend = prompt.trim();
        if (!messageToSend || loading) return;

        // 1. Immediately clear prompt input
        setPrompt("");

        // 2. Switch off newChat screen
        setNewChat(false);

        // 3. Immediately render user message in realtime
        setPrevChats(prev => [
            ...prev,
            { role: "user", content: messageToSend }
        ]);

        // 4. Set loading state
        setLoading(true);

        // 5. If this thread is new, optimistically add to sidebar threads
        const threadExists = allThreads.some(t => t.threadId === currThreadId);
        if (!threadExists) {
            setAllThreads(prev => [
                { threadId: currThreadId, title: messageToSend },
                ...prev
            ]);
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: messageToSend,
                threadId: currThreadId
            }),
            credentials: "include"
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, options);
            const resF = await response.json();
            
            if (response.ok && resF.reply) {
                setReply(resF.reply);
                setPrevChats(prev => [
                    ...prev,
                    { role: "assistant", content: resF.reply }
                ]);
            } else {
                setPrevChats(prev => [
                    ...prev,
                    { role: "assistant", content: resF.error || "Sorry, failed to get a response." }
                ]);
            }
        }
        catch(err) {
            console.error(err);
            setPrevChats(prev => [
                ...prev,
                { role: "assistant", content: "Network error. Please try again." }
            ]);
        }
        finally {
            setLoading(false);
        }
    };

    return (
            <div className="chatWindow">
                <div className="navbar">
                    <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                    <div className="userIconDiv">
                        <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                    </div>
                </div>
                <Chat loading={loading}></Chat>
                {/* <ScaleLoader color="#fff" loading={loading}></ScaleLoader> */}
                <div className="chatInput">
                    <div className="inputBox">
                        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" ? getReply() : ''}placeholder="Ask anything"/>
                        <div id="submit" onClick={getReply}>{loading ? 
                        <ScaleLoader color="#fff" loading={loading}></ScaleLoader> :<i className="fa-solid fa-arrow-up"></i>}</div>
                    </div>
                    <p className="info">
                        SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                    </p>
                </div>
            </div>
    )
}

export default ChatWindow;