// api/search.js

module.exports = async (req, res) => {
    const { query } = req.query; // Haal de zoekopdracht uit de URL (bijvoorbeeld /api/search?query=zoekopdracht)
    
    if (!query) {
        return res.status(400).json({ error: "Geen zoekopdracht opgegeven" });
    }

    const formattedQuery = query.trim().replace(/ /g, "+");
    const url = `https://api.codetabs.com/v1/proxy/?quest=https://search.yahoo.com/search?p=${formattedQuery}`;
    
    try {
        const response = await fetch(url);
        const text = await response.text();

        // Extract links from the HTML response
        const links = [...text.matchAll(/<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>(.*?)<\/a>/g)]
            .map(m => ({ url: m[1], title: m[2].replace(/<[^>]+>/g, '').trim() }))
            .filter(link => link.title && !link.url.includes("yahoo.com"));

        if (links.length > 0) {
            return res.status(200).json(links); // Return links as JSON
        } else {
            return res.status(404).json({ error: "Geen resultaten gevonden" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Er is een fout opgetreden bij het ophalen van de gegevens" });
    }
};
