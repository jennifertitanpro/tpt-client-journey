const axios = require('axios');

exports.handler = async (event, context) => {
  // CORS headers - allow your frontend domain
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { code } = JSON.parse(event.body);

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No authorization code provided' })
      };
    }

    console.log('Exchanging code for access token...');

    // Exchange the code for an access token
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

    const { access_token, error, error_description } = tokenResponse.data;

    if (error) {
      console.error('GitHub OAuth error:', error, error_description);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: error,
          error_description: error_description 
        })
      };
    }

    if (!access_token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No access token received from GitHub' })
      };
    }

    console.log('Successfully got access token, fetching user info...');

    // Get user information
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    const userData = userResponse.data;
    console.log('Got user data:', userData.login);

    // Determine user role by checking organization membership
    let role = 'client'; // Default role
    
    // Check if the organization name is configured
    const orgName = process.env.GITHUB_ORG_NAME || 'titan-pro-technologies';
    
    if (orgName) {
      try {
        // Check if user is a member of the organization
        const orgResponse = await axios.get(
          `https://api.github.com/orgs/${orgName}/members/${userData.login}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              Accept: 'application/vnd.github.v3+json'
            }
          }
        );
        
        // If we get a 204 response, user is a member
        if (orgResponse.status === 204) {
          role = 'coach';
          console.log('User is a coach (org member)');
        }
      } catch (orgError) {
        // 404 means not a member, which is fine - they're a client
        if (orgError.response && orgError.response.status === 404) {
          console.log('User is a client (not org member)');
        } else {
          console.error('Error checking org membership:', orgError.message);
        }
      }
    }

    // Return the user data and access token
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        user: {
          login: userData.login,
          name: userData.name,
          email: userData.email,
          avatar_url: userData.avatar_url,
          role: role
        },
        access_token: access_token
      })
    };

  } catch (error) {
    console.error('OAuth handler error:', error.message);
    
    // Check for specific error types
    if (error.response) {
      console.error('Response error:', error.response.data);
      return {
        statusCode: error.response.status,
        headers,
        body: JSON.stringify({ 
          error: 'GitHub API error',
          details: error.response.data 
        })
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};
