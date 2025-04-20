// components/ChatBox.jsx
import React, { useState, useEffect, useRef } from "react";
import {
    Box, TextField, IconButton, Typography, Paper, Divider
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { generateResponse } from "../services/chatApi";

const ChatBox = ({ onClose }) => {
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Welcome to CoralTele com. I'm your virtual assistant here to help. How can I assist you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);

    const messagesEndRef = useRef(null);

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

    return (
        <Paper elevation={3} sx={{ width: 360, borderRadius: 4, overflow: "hidden" }}>
            <Box bgcolor="#7e22ce" color="white" p={2} display="flex" justifyContent="space-between">
                <Typography variant="h6">Let's chat!</Typography>
                <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box p={2} maxHeight={400} minHeight={400} overflow="auto" display="flex" flexDirection="column" gap={1}>
                {messages.map((msg, index) => (
                    <Box key={index} display="flex" justifyContent={msg.sender === "user" ? "flex-end" : "flex-start"}>
                        {msg.sender === "bot" && <AccountCircleIcon style={{ marginRight: 8 }} />}
                        <Box
                            px={2}
                            py={1}
                            borderRadius={2}
                            bgcolor={msg.sender === "user" ? "#9333ea" : "#ddd6fe"}
                            color={msg.sender === "user" ? "white" : "black"}
                        >
                            <Typography variant="caption">{msg.text}</Typography>
                        </Box>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Box>

            <Divider />

            <Box display="flex" alignItems="center" p={2}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    sx={{ mr: 1 }}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={startListening}>
                                <MicIcon color={listening ? "sucess" : "action"} />
                            </IconButton>
                        )
                    }}
                />
                <IconButton color="primary" onClick={sendMessage}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
};

export default ChatBox;
