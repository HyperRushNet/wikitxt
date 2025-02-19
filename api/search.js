async function sendMessageToAI() {
    try {
        // Statisch bericht
        const messages = [
            { 
                "role": "system", 
                "content": "You are an AI that always responds in valid HTML but without unnecessary elements like <!DOCTYPE html>, <html>, <head>, or <body>. Only provide the essential HTML elements, such as <p>text</p>, or other inline and block elements depending on the context. Style links without the underline and #5EAEFF text. Mathjax is integrated. When the user wants to generate code, give them a link to /codegenerate.html"
            },
            { 
                "role": "user", 
                "content": "Wat is JavaScript?"
            }
        ];

        const response = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: messages,
                max_tokens: 100
            }),
        });

        // Controleer of de API-aanroep geslaagd is
        if (!response.ok) {
            throw new Error(`API response failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            // Log het antwoord naar de console in plaats van alert
            console.log(data.choices[0].message.content);
            return { message: data.choices[0].message.content };
        } else {
            throw new Error("Geen keuze gevonden in de API-respons.");
        }
    } catch (error) {
        console.error("Fout gedetailleerd:", error);
        return { error: `Er is een fout opgetreden: ${error.message}` };
    }
}

// Roep de functie aan (als onderdeel van je serverless endpoint)
export default async function handler(req, res) {
    const result = await sendMessageToAI();
    res.status(200).json(result);  // Geef het resultaat terug als JSON
}
