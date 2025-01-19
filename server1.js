const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json()); // To parse JSON bodies

const FACEBOOK_CLIENT_ID = "495757730125517";
const FACEBOOK_CLIENT_SECRET = "935d1fa37318db4f5ba803a71c371284";
const REDIRECT_URI = "https://developers.facebook.com/es/oauth/callback/?business_id=1736435370527376&nonce=3hdkA1Ae5EhZcKwBE0zzTPesuVYU2J9q";

app.post("/generate-token", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  const url = "https://graph.facebook.com/v21.0/oauth/access_token";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: FACEBOOK_CLIENT_ID,
        client_secret: FACEBOOK_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error exchanging token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
