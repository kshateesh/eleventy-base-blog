import fetch from "node-fetch";
export default async function handler(req, res) {
	console.log("incoming headers");
	console.log(req.headers);

	if (req.method === "GET") {
		try {
			const response = await fetch(
				"https://api.thecatapi.com/v1/images/search?limit=10"
			);
			const data = await response.json();

			const html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Images</title>
          </head>
          <body>
            <h1>Cat Images</h1>
            <div>
          ${data
						.map(
							(cat) =>
								`<img src="${cat.url}" alt="Cat Image" width="${cat.width}" height="${cat.height}">`
						)
						.join("")}
            </div>
          </body>
          </html>
        `;

			res.setHeader("Content-Type", "text/html");
			res.setHeader("Cache-Control", "public, s-max-age=300");
			res.status(200).send(html);
		} catch (error) {
			console.error("Error fetching image:", error);
			res.status(500).json({ error: "Failed to fetch image" });
		}
	} else {
		console.log("Call not supported");
		res.status(500).json({ error: "Bad Request" });
	}
}
