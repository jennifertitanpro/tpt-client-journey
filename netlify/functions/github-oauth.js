exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { code } = JSON.parse(event.body);
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      })
    });

    const tokenData = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();

    // Check if user is in your organization
    const orgResponse = await fetch('https://api.github.com/orgs/titan-pro-technologies/members/' + userData.login, {
      headers: {
        'Authorization': `token ${tokenData.access_token}`
      }
    });

    const role = orgResponse.status === 204 ? 'coach' : 'client';

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        access_token: tokenData.access_token,
        user: {
          ...userData,
          role: role
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
