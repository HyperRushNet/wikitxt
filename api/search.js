export default async function handler(req, res) {
  // Haal de zoekopdracht op van de URL via req.query.params
  const query = req.query.params; // 'params' komt uit de URL (na /poki)

  if (!query) {
    return res.status(400).json({ error: "Geen zoekopdracht opgegeven" });
  }

  try {
    let formattedQuery = query.trim().replace(/ /g, "+"); // Verander spaties naar "+" voor de zoekmachine
    let url = `https://api.codetabs.com/v1/proxy/?quest=https://search.yahoo.com/search?p=${formattedQuery}`;

    const response = await fetch(url);
    const text = await response.text();

    // Haal de links eruit met een regex
    let links = [...text.matchAll(/<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>(.*?)<\/a>/g)]
      .map(m => ({ url: m[1], title: m[2].replace(/<[^>]+>/g, '').trim() }))
      .filter(link => link.title && !link.url.includes("yahoo.com"));

    if (links.length) {
      return res.status(200).json(links);
    } else {
      return res.status(404).json({ error: "Geen links gevonden" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Er is een fout opgetreden bij het ophalen van de gegevens" });
  }
}
