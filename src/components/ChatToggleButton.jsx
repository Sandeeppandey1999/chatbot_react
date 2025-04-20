// components/ChatToggleButton.jsx
import React from "react";
import { Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

const ChatToggleButton = ({ onClick }) => (
  <Fab color="primary" onClick={onClick}>
    <ChatIcon />
  </Fab>
);

export default ChatToggleButton;
