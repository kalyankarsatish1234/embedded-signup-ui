import React, { Component } from 'react';
import config from '../config'; // Ensure this has your Facebook App ID

class FacebookLogin extends Component {
  componentDidMount() {
    // Load the Facebook SDK
    ((d, s, id) => {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: config.facebook, // Replace with your Facebook App ID from config
        cookie: true,
        xfbml: true,
        version: 'v21.0', // Use the latest stable API version
      });
    };
  }

  fbLoginCallback = async (response) => {
    if (response.authResponse) {
      const { code } = response.authResponse;

      try {
        // Send the code to the backend for token exchange
        const res = await fetch('http://localhost:4000/exchange-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();
        if (data.accessToken) {
          console.log('Access Token:', data.accessToken);
          // Store token locally or make API calls using the token
          localStorage.setItem('fb_access_token', data.accessToken);
        } else {
          console.error('Failed to retrieve access token');
        }

        // Display backend response in UI (optional)
        document.getElementById('backend-response').textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        console.error('Error exchanging code for access token:', error);
      }
    } else {
      console.error('Facebook login failed', response);
    }
  };

  launchFacebookLogin = () => {
    window.FB.login(this.fbLoginCallback, {
      scope: 'email,public_profile',
      response_type: 'code', // Request an authorization code
    });
  };

  render() {
    return (
      <div>
        {/* Facebook Login Button */}
        <button
          onClick={this.launchFacebookLogin}
          style={{
            backgroundColor: '#1877f2',
            border: 0,
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '16px',
            fontWeight: 'bold',
            height: '40px',
            padding: '0 24px',
          }}
        >
          Login with Facebook
        </button>

        {/* Display session info response */}
        <p>Session info response:</p>
        <pre id="session-info-response"></pre>

        {/* Display SDK response */}
        <p>SDK response:</p>
        <pre id="sdk-response"></pre>

        {/* Display Backend response */}
        <p>Backend response:</p>
        <pre id="backend-response"></pre>
      </div>
    );
  }
}

export default FacebookLogin;
