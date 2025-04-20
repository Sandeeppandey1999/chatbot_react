// pages/Dashboard.jsx
import React, { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import ChatBox from "../components/chatbox";
import ChatToggleButton from "../components/ChatToggleButton";
import backgroundImg from "../assests/bg.jpg"; // Adjust the path as necessary
import Button from "@mui/material/Button";
import ChatBar from "../components/chatBar";
const Dashboard = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatBarOpen, setIsChatBarOpen] = useState(false);

    const handleChatToggle = () => {
        setIsChatBarOpen(false);
        setIsChatOpen((prev) => !prev);
    }

    const handleChatBarToggleOpen = () => {
         setIsChatOpen(false);
        setIsChatBarOpen((prev) => !prev);
    }

  

    return (
        <>
            <Box
                sx={{
                    height: "87vh",
                    backgroundImage: `url(${backgroundImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "white",
                    paddingTop: "100px",
                    overflow: "hidden",
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", marginBottom: "50px" }}>
                        <Typography variant="h2" fontWeight="bold" gutterBottom>
                            Welcome to Coraltele com Chat AI
                        </Typography>
                        <Typography variant="h4" sx={{ marginBottom: "20px" }}>
                            I'm here to assist you with anything. Let's chat!
                        </Typography>
                        <Button
                            variant="contained"
                            color= {isChatBarOpen ? "warning":"success"}
                            onClick={handleChatBarToggleOpen}
                            sx={{
                                padding: "10px 20px",
                                fontSize: "18px",
                                borderRadius: "25px",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                            }}
                        >
                            {isChatBarOpen ? "Close Chatting" : "Start Chatting"}
                        </Button>

                        {isChatBarOpen && (
                            <ChatBar onClose={() => setIsChatBarOpen(false)} />
                        )}

                    </Box>
                </Container>

            </Box>
            <Box position="fixed" bottom={25} right={25} zIndex={990}>
                {isChatOpen ? (
                    <ChatBox onClose={() => setIsChatOpen(false)} />
                ) : (
                    <ChatToggleButton onClick={handleChatToggle} />
                )}
            </Box>
        </>
    );
};

export default Dashboard;
