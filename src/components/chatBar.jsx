import React, { useState, useEffect, useRef } from "react";
import {
    Box, TextField, IconButton, Typography, Paper, Divider
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { generateResponse } from "../services/chatApi";
import ReactMarkdown from "react-markdown";

const ChatBar = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [listening, setListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev + " " + transcript);
            };

            recognition.onend = () => setListening(false);
            recognition.onerror = (e) => {
                console.error("Speech recognition error:", e);
                setListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !listening) {
            recognitionRef.current.start();
            setListening(true);
        }
    };

    const sendMessage = async () => {
        if (input.trim() === "") return;
    
        const userMessage = { sender: "user", text: input };
        const thinkingMessage = { sender: "bot", text: "..." };
    
        // Show user message and placeholder
        setMessages(prev => [...prev, userMessage, thinkingMessage]);
        setInput("");
    
        const botReply = await generateResponse(input);
    
        // Replace "Thinking..." with real reply
        setMessages(prev => {
            const newMessages = [...prev];
            // Find last "Thinking..." and replace it
            const index = newMessages.findIndex(m => m.sender === "bot" && m.text === "...");
            if (index !== -1) {
                newMessages[index] = { sender: "bot", text: botReply };
            } else {
                newMessages.push({ sender: "bot", text: botReply }); // fallback
            }
            return newMessages;
        });
    };
    
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    console.log(messages)

    return (
        <Paper elevation={3} sx={{ width: "100%", borderRadius: 4, overflow: "hidden", marginTop: 10 }}>
            {messages?.length === 0 ? (
                <Box p={2} maxHeight={300} minHeight={200} overflow="auto" display="flex" flexDirection="column" gap={1}>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" padding={6}>
                        What can I help with?
                    </Typography>
                </Box>
            ) : (
                <Box p={2} maxHeight={300} minHeight={300} overflow="auto" display="flex" flexDirection="column" gap={1}>
                    {messages.map((msg, index) => (
                       <Box
                       sx={{
                           display: "flex",
                           justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                           width: "100%",
                           my: 1,
                       }}
                   >
                       <Box
                           sx={{
                               px: 2,
                               py: 1,
                               borderRadius: 2,
                               bgcolor: msg.sender === "user" ? "#9333ea" : "#ddd6fe",
                               color: msg.sender === "user" ? "white" : "black",
                               maxWidth: "70%",
                               overflowWrap: "break-word",
                               wordBreak: "break-word", // 💥 important
                               whiteSpace: "pre-wrap",  // 💥 important for markdown and long lines
                               display: "inline-block",
                           }}
                       >
                           <ReactMarkdown
                               components={{
                                   code({ node, inline, className, children, ...props }) {
                                       return (
                                           <Box
                                               component="code"
                                               sx={{
                                                   display: "block",
                                                   overflowX: "auto",
                                                   whiteSpace: "pre-wrap",
                                                   wordBreak: "break-word",
                                               }}
                                               {...props}
                                           >
                                               {children}
                                           </Box>
                                       );
                                   },
                               }}
                           >
                               {msg.text}
                           </ReactMarkdown>
                       </Box>
                   </Box>
                   
                    ))}
                    <div ref={messagesEndRef} />
                </Box>
            )}

            <Divider />

            <Box display="flex" alignItems="center" p={2}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    multiline
                    rows={messages?.length === 0 ? 4 : 1}
                    placeholder="Ask anything"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    sx={{ mr: 1 }}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={startListening}>
                                <MicIcon color={listening ? "success" : "action"} />
                            </IconButton>
                        )
                    }}
                />

            </Box>
        </Paper>
    );
};

export default ChatBar;
