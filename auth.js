// Import required modules
const express = require('express');
const axios = require('axios');
require('dotenv').config(); // For loading environment variables

const app = express();
const port = 3000;

// Environment variables (store these securely in a .env file)
const APP_ID = process.env.FB_APP_ID;
const APP_SECRET = process.env.FB_APP_SECRET;
const REDIRECT_URI = process.env.FB_REDIRECT_URI; // Must match the redirect URI configured in your app

// Middleware for parsing JSON
app.use(express.json());

// Route to handle the auth code exchange
app.post('/exchange-token', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }

    try {
        // Exchange the authorization code for an access token
        const tokenResponse = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
            params: {
                client_id: APP_ID,
                client_secret: APP_SECRET,
                redirect_uri: REDIRECT_URI,
                code,
            },
        });

        const accessToken = tokenResponse.data.access_token;

        // Retrieve additional details if needed (e.g., user info)
        const userInfoResponse = await axios.get('https://graph.facebook.com/v21.0/me', {
            params: {
                access_token: accessToken,
            },
        });

        res.status(200).json({
            message: 'Token exchanged successfully',
            accessToken,
            userInfo: userInfoResponse.data,
        });
    } catch (error) {
        console.error('Error exchanging token:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to exchange token',
            details: error.response?.data || error.message,
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
