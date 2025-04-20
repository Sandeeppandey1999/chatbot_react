// services/chatApi.js
import { DateTime } from "luxon";

export const generateResponse = async (inputText) => {

  const lowerInput = inputText.toLowerCase();
  if (lowerInput.includes("today") && lowerInput.includes("date")) {
    const nowInDelhi = DateTime.now().setZone("Asia/Kolkata").toFormat("dd LLLL yyyy");
    return `Today's date in Delhi is ${nowInDelhi}.`;
  }
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: inputText || ""
          }
        ]
      }
    ]
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  };

  try {
    const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Something went wrong");
    }

    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text
    ?.replace(/\*\*(.*?)\*\*/g, "$1") // remove markdown bold
    ?.replace(/<[^>]+>/g, "")         // remove HTML tags
    ?.trim();
  
  

    return botReply || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("API Error:", error);
    return "Sorry, I couldn't process your request at the moment.";
  }
};
