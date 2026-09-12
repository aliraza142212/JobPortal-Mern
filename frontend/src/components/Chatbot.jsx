import { useState } from "react";

function Chatbot() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hi! I'm your Job Portal assistant. Ask me about current jobs, salaries, remote jobs, internships, or specific skills."
        }
    ]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim() || loading) return;

        const userMessage = message.trim();

        setMessages((prev) => [
            ...prev,
            { sender: "user", text: userMessage }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/chatbot",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: userMessage
                    })
                }
            );

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: data.reply || "Sorry, I couldn't understand that."
                }
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Unable to connect to the chatbot. Please try again."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className="chatbot-toggle"
                onClick={() => setOpen(!open)}
            >
                {open ? "×" : "💬"}
            </button>

            {open && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <div>
                            <h3>Job Assistant</h3>
                            <span>Online</span>
                        </div>

                        <button onClick={() => setOpen(false)}>
                            ×
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((item, index) => (
                            <div
                                key={index}
                                className={`chat-message ${item.sender}`}
                            >
                                {item.text.split("\n").map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        ))}

                        {loading && (
                            <div className="chat-message bot">
                                Typing...
                            </div>
                        )}
                    </div>

                    <form
                        className="chatbot-input"
                        onSubmit={sendMessage}
                    >
                        <input
                            type="text"
                            placeholder="Ask about jobs..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />

                        <button type="submit">
                            Send
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default Chatbot;