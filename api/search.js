// De asynchrone functie voor het scrapen van de Wikipedia-pagina
async function scrapeWikipedia(req, res) {
    try {
        // Haal de Wikipedia-URL op uit de queryparameter
        const wikipediaUrl = req.query.url;

        if (!wikipediaUrl) {
            return res.status(400).send("Geen Wikipedia URL meegegeven.");
        }

        // Decodeer de URL
        const decodedUrl = decodeURIComponent(wikipediaUrl);

        // Gebruik de ingebouwde fetch van Vercel
        const response = await fetch(decodedUrl);

        if (!response.ok) {
            throw new Error(`API response failed with status: ${response.status}`);
        }

        // Verkrijg de HTML-content van de Wikipedia-pagina
        const html = await response.text();

        // Verwijder ongewenste elementen via stringmanipulatie
        let cleanHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, ''); // Verwijder <script> elementen
        cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/g, ''); // Verwijder <style> elementen
        cleanHtml = cleanHtml.replace(/<a[^>]*>(.*?)<\/a>/g, '$1'); // Verwijder <a> tags maar behoud de tekst

        // Gebruik een eenvoudige reguliere expressie om de tekst te extraheren
        const contentMatch = cleanHtml.match(/<div class="mw-parser-output">([\s\S]+)<\/div>/);

        if (!contentMatch) {
            return res.status(400).send("Geen inhoud gevonden op de opgegeven Wikipedia-pagina.");
        }

        let text = contentMatch[1].replace(/\s+/g, ' ').trim(); // Verwijder extra witruimte

        // Verzend de gescrapete tekst als antwoord
        res.status(200).send({ text });
    } catch (error) {
        console.error("Fout gedetailleerd:", error);
        res.status(500).send("Er is een fout opgetreden, probeer het later opnieuw.");
    }
}

// Exporteer de serverless functie voor gebruik met Vercel
module.exports = scrapeWikipedia;
