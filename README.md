# TPT Client Journey - Complete Setup Guide

## Step 1: Create GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the following:
   - **Application name**: TPT Client Journey
   - **Homepage URL**: https://titan-pro-client-journey.netlify.app
   - **Authorization callback URL**: https://titan-pro-client-journey.netlify.app
4. Click "Register application"
5. Save the **Client ID** (you'll see it immediately)
6. Click "Generate a new client secret" and save the **Client Secret** (you'll only see it once!)

## Step 2: Set Up Your GitHub Repository

1. Create a new repository: `tpt-client-journey` in the `jennifertitanpro` account
2. Create the following folder structure:
   ```
   tpt-client-journey/
   ├── clients/
   │   └── README.md
   ├── index.html
   ├── netlify.toml
   ├── package.json
   └── netlify/
       └── functions/
           └── github-oauth.js
   ```

## Step 3: Deploy to Netlify

### Option A: Deploy from GitHub (Recommended)

1. Push all files to your GitHub repository
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Choose "GitHub" and authorize Netlify
5. Select the `tpt-client-journey` repository
6. Deploy settings should be:
   - Build command: (leave empty)
   - Publish directory: `.`
7. Click "Deploy site"

### Option B: Manual Deploy

1. Create a folder with all the files
2. Go to [Netlify](https://app.netlify.com)
3. Drag and drop the folder to deploy

## Step 4: Configure Environment Variables in Netlify

1. In Netlify, go to your site → Site settings → Environment variables
2. Add the following variables:
   - **Key**: `GITHUB_CLIENT_ID`  
     **Value**: (Your Client ID from Step 1)
   - **Key**: `GITHUB_CLIENT_SECRET`  
     **Value**: (Your Client Secret from Step 1)
3. Click "Save"

## Step 5: Update Your HTML File

Make sure your `index.html` has the correct GitHub Client ID:
```javascript
const CONFIG = {
    GITHUB_CLIENT_ID: 'YOUR_ACTUAL_CLIENT_ID_HERE', // Replace with your actual Client ID
    BACKEND_URL: 'https://titan-pro-client-journey.netlify.app/.netlify/functions',
    // ... rest of config
};
```

## Step 6: Create Organization and Add Team Members

1. Create or use existing GitHub organization: `titan-pro-technologies`
2. Add team members who should have "coach" access as organization members
3. Non-members will automatically get "client" access

## File Structure Summary

Your repository should contain:

```
tpt-client-journey/
├── index.html           (Your main application file)
├── netlify.toml        (Netlify configuration)
├── package.json        (Node package file)
├── netlify/
│   └── functions/
│       └── github-oauth.js  (OAuth handler function)
└── clients/            (Directory for storing client data)
    └── README.md       (Can be empty, just to ensure folder exists)
```

## Testing Your Setup

1. **Test Demo Mode First**:
   - Go to your site: https://titan-pro-client-journey.netlify.app
   - Click "Demo: Client View" or "Demo: Coach View"
   - This should work without any GitHub setup

2. **Test GitHub Login**:
   - Click "Sign in with GitHub"
   - Authorize the application
   - You should be logged in with your role (coach if in org, client if not)

## Troubleshooting

### "Authentication failed" error
- Check that environment variables are set correctly in Netlify
- Verify the Client ID in your HTML matches the GitHub OAuth App
- Check Netlify Functions logs: Netlify dashboard → Functions → github-oauth → View logs

### CORS errors
- The netlify.toml file should handle CORS headers
- Make sure the function URL matches your site URL

### "404 Not Found" on function call
- Ensure the function is deployed: Check Netlify dashboard → Functions
- Verify the function path is correct: `/.netlify/functions/github-oauth`

### Repository access issues
- Make sure the repository `jennifertitanpro/tpt-client-journey` exists
- Ensure the `clients` folder exists in the repository
- Check that the OAuth token has the `repo` scope

## Next Steps

Once everything is working:

1. Add real clients by clicking "Add Client" in coach view
2. Client data will be stored in GitHub at `clients/email_at_domain.com/journey.json`
3. Use the export feature to download client progress reports
4. Customize the journey structure in the `journeyStructure` object as needed
