import "./Chat.css";
import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat({ loading }) {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const chatEndRef = useRef(null);

    // Auto-scroll when messages, typing, or loading changes
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [prevChats, latestReply, loading]);

    useEffect(() => {
        if (!reply) {
            setLatestReply(null);
            return;
        }

        // Fast adaptive typing animation for the newest response
        setLatestReply("");
        const words = reply.split(" ");
        let idx = 0;
        const step = Math.max(1, Math.ceil(words.length / 80));

        const interval = setInterval(() => {
            idx += step;
            if (idx >= words.length) {
                setLatestReply(null);
                clearInterval(interval);
            } else {
                setLatestReply(words.slice(0, idx).join(" "));
            }
        }, 15);

        return () => {
            clearInterval(interval);
            setLatestReply(null);
        };
    }, [reply]);

    return (
        <div className="chats">
            {newChat && prevChats.length === 0 && (
                <h1>What's on your mind today</h1>
            )}

            {prevChats.map((chat, idx) => {
                const isLastAssistant = idx === prevChats.length - 1 && chat.role === "assistant";
                return (
                    <div
                        key={idx}
                        className={chat.role === "user" ? "userDiv" : "gptDiv"}
                    >
                        {chat.role === "user" ? (
                            <p className="userMessage">{chat.content}</p>
                        ) : (
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {isLastAssistant && latestReply !== null ? latestReply : chat.content}
                            </ReactMarkdown>
                        )}
                    </div>
                );
            })}

            <div ref={chatEndRef} />
        </div>
    );
}

export default Chat;