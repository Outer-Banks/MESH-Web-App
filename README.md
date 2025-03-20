# MESH - Connecting Startups and Investors

MESH is a platform designed to connect startups with investors, facilitating funding opportunities and business growth.

## GitHub Pages Deployment

This project is configured for deployment on GitHub Pages. Here's how to set it up:

### Prerequisites

1. Push your code to a GitHub repository
2. Install the gh-pages package:

```bash
cd client
npm install --save-dev gh-pages
```

### Configuration

1. Update the `homepage` field in `client/package.json` with your GitHub username:
   ```json
   "homepage": "https://YOUR-GITHUB-USERNAME.github.io/MESH"
   ```

2. The GitHub Actions workflow in `.github/workflows/deploy.yml` will automatically build and deploy your site when you push to the main branch.

### Manual Deployment

If you prefer to deploy manually:

```bash
cd client
npm run deploy
```

This will build your project and push it to the `gh-pages` branch of your repository.

### Troubleshooting

- If you encounter routing issues, make sure to use `<HashRouter>` instead of `<BrowserRouter>` in your React app when deploying to GitHub Pages.
- For API calls, you'll need to update your backend URLs to point to your deployed backend service.

## Local Development

To run the project locally:

```bash
# Start the client
cd client
npm start

# Start the server (in a separate terminal)
cd server
npm start
```

## Features

- Startup profiles with funding information
- Investor profiles
- Matching system
- Messaging platform
- News feed
