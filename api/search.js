async function sendMessageToAI() {
    try {
        const response = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { 
                        "role": "system", 
                        "content": "You are an AI that always responds in valid HTML but without unnecessary elements like <!DOCTYPE html>, <html>, <head>, or <body>. Only provide the essential HTML elements, such as <p>text</p>, or other inline and block elements depending on the context. Style links without the underline and #5EAEFF text. Mathjax is integrated. When the user wants to generate code, give them a link to /codegenerate.html"
                    },
                    ...chats[currentChat]  // Zorg ervoor dat `chats[currentChat]` bestaat
                ],
                max_tokens: 100
            }),
        });

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            const aiResponse = document.createElement("div");
            aiResponse.classList.add("message", "aiMessage");
            aiResponse.innerHTML = data.choices[0].message.content;  // Voeg de response tekst toe

            document.body.appendChild(aiResponse);  // Voeg het nieuwe bericht toe aan de pagina
        }
    } catch (error) {
        console.error("Er is een fout opgetreden:", error);
    }
}

// Roep de functie aan om een bericht naar de AI te sturen
sendMessageToAI();
