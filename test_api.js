const fs = require('fs');
const API_KEY = "AIzaSyDD-_M3ZIQVZstGQVn9bvns7yYBOtNA9lg";

const requestBody = {
    systemInstruction: {
        parts: [{ text: "Eres un bot académico." }]
    },
    contents: [{role: "user", parts: [{text: "hola"}]}]
};

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
})
.then(async res => {
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
})
.catch(err => console.error("Fetch error:", err));
