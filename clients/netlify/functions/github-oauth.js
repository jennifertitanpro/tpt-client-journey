const axios = require('axios');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { code } = JSON.parse(event.body);

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No code provided' })
      };
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      },
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );

    const { access_token, error } = tokenResponse.data;

    if (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error })
      };
    }

    // Get user information
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const userData = userResponse.data;

    // Check organization membership for role
    let role = 'client';
    try {
      const orgCheck = await axios.get(
        `https://api.github.com/orgs/${process.env.GITHUB_ORG_NAME || 'titan-pro-technologies'}/members/${userData.login}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );
      
      if (orgCheck.status === 204) {
        role = 'coach';
      }
    } catch (e) {
      // Not a member, keep as client
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        user: {
          login: userData.login,
          name: userData.name || userData.login,
          email: userData.email,
          avatar_url: userData.avatar_url,
          role: role
        },
        access_token: access_token
      })
    };

  } catch (error) {
    console.error('OAuth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to authenticate with GitHub',
        details: error.message 
      })
    };
  }
};
