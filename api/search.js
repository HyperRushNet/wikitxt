const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

// De asynchrone functie voor het scrapen van de Wikipedia-pagina
async function scrapeWikipedia(req, res) {
    try {
        // Haal de Wikipedia-URL op uit de queryparameter "params"
        const wikipediaUrl = req.query.params; // De URL wordt als queryparameter meegegeven, bijv. /wikipedia?params=https://en.m.wikipedia.org/wiki/2025

        if (!wikipediaUrl) {
            return res.status(400).send("Geen Wikipedia URL meegegeven.");
        }

        // Decodeer de URL
        const decodedUrl = decodeURIComponent(wikipediaUrl);

        // Gebruik een proxy om de Wikipedia-pagina op te halen
        const proxyUrl = 'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent(decodedUrl);
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            throw new Error(`API response failed with status: ${response.status}`);
        }

        // Verkrijg de HTML-content van de Wikipedia-pagina
        const html = await response.text();

        // Gebruik JSDOM om de HTML te parseren
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Selecteer de hoofdinhoud van de Wikipedia-pagina
        const content = document.querySelector('.mw-parser-output');

        if (!content) {
            return res.status(400).send("Geen inhoud gevonden op de opgegeven Wikipedia-pagina.");
        }

        // Verwijder ongewenste elementen zoals scripts en styles
        content.querySelectorAll('script, style, .reflist, .reference, .mw-editsection, .navbox').forEach(el => el.remove());

        // Verwijder links, maar behoud de tekst
        content.querySelectorAll('a').forEach(link => {
            link.replaceWith(document.createTextNode(link.textContent));
        });

        // Verwijder class-attributen uit alle elementen
        content.querySelectorAll('[class]').forEach(el => el.removeAttribute('class'));

        // Zet alles om in een lange string zonder overbodige witruimte
        let text = content.textContent.replace(/\s+/g, ' ').trim();

        // Verzend de gescrapete tekst als antwoord
        res.status(200).send({ text });
    } catch (error) {
        console.error("Fout gedetailleerd:", error);
        res.status(500).send("Er is een fout opgetreden, probeer het later opnieuw.");
    }
}

// Exporteer de serverless functie voor gebruik met Vercel
module.exports = scrapeWikipedia;
