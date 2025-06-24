# TPT Client Journey - ServiceTitan Implementation Platform

A comprehensive web-based platform for tracking and managing ServiceTitan implementation journeys for Titan Pro Technologies clients.

## 🌟 Features

- **Role-Based Access**: Automatic role assignment based on organization membership
- **Progress Tracking**: Visual progress indicators with completion percentages
- **GitHub Integration**: All data stored securely in GitHub
- **Real-Time Updates**: Changes save automatically to GitHub
- **Comprehensive Forms**: Complete ServiceTitan onboarding checklist
- **Not Applicable Options**: Coaches can mark items as N/A
- **Export Functionality**: Export client data as JSON

## 🚀 Platform Access

Platform URL: `https://[your-netlify-url].netlify.app`

### For Coaches (Titan Pro Technologies Members)
1. Sign in with your GitHub account
2. You'll automatically get "COACH" role
3. Select or add clients
4. Track progress across all journey items
5. Mark items as Not Applicable when needed

### For Clients
1. Sign in with GitHub account
2. Fill in your ServiceTitan journey information
3. Add notes for clarification
4. Track your progress

## 📁 Repository Structure

```
tpt-client-journey/
├── index.html              # Main platform application
├── package.json            # Node.js dependencies
├── netlify.toml            # Netlify configuration
├── netlify/
│   └── functions/
│       └── github-oauth.js # OAuth authentication handler
├── clients/                # Client data storage (auto-generated)
│   └── [client-email]/
│       └── journey.json    # Client's journey data
└── README.md              # This file
```

## 🔧 Technical Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Netlify Functions (Serverless)
- **Database**: GitHub Repository (JSON files)
- **Authentication**: GitHub OAuth
- **Hosting**: Netlify
- **API**: GitHub REST API via Octokit

## 🛡️ Security

- OAuth 2.0 authentication via GitHub
- Role-based access control (Organization-based)
- Client data isolation
- Secure token handling
- No sensitive data in frontend code

## 📊 Journey Categories

### 1. ServiceTitan Settings
- Tenant Information
- Billing Configuration
- Company Profile
- Customer Types
- Text Messaging Setup

### 2. People & Payroll
- Employee Management
- Technician Setup
- Skills Configuration
- Payroll Profiles

### 3. Integrations
- Booking Providers (Angi, Facebook, etc.)
- Financing Partners
- GPS Integration
- QuickBooks Connection

### 4. Operations
- Dispatch Configuration
- Marketing Pro
- Capacity Planning
- Business Units
- Campaigns

### 5. Phones & Communications
- Call Recording
- Chat Configuration
- Customer Notifications
- Emergency Fallback

## 👥 User Roles

### Coaches
- Members of `titan-pro-technologies` organization
- Can manage multiple clients
- Mark fields as "Not Applicable"
- View all client progress

### Clients
- External users
- Access only their own data
- Update journey information
- Add notes and track progress

## 🔐 Environment Variables

Required in Netlify:
- `GITHUB_CLIENT_ID` - OAuth App Client ID
- `GITHUB_CLIENT_SECRET` - OAuth App Secret (keep secure!)
- `FRONTEND_URL` - Your Netlify URL
- `GITHUB_ORG_NAME` - titan-pro-technologies

## 📝 Data Structure

Each client's journey data includes:
- Field values (text, checkboxes, selections)
- Completion status
- Not Applicable flags (coach only)
- Notes for each field
- Timestamps for updates

## 🚀 Deployment

1. Fork/clone this repository
2. Deploy to Netlify
3. Configure environment variables
4. Update OAuth App URLs
5. Update `BACKEND_URL` in index.html

## 🤝 Contributing

This is a private repository for Titan Pro Technologies. For access or questions, contact your administrator.

## 📞 Support

- **Repository Owner**: jennifertitanpro
- **Organization**: titan-pro-technologies
- **Platform Issues**: Create an issue in this repository

## 📄 License

Private and Confidential - Titan Pro Technologies

---

*Built to streamline ServiceTitan implementations for our valued clients*
