# GitHub Pages Deployment Guide

This guide explains how to deploy your Angular portfolio to GitHub Pages.

## Automatic Deployment Setup

### 1. Repository Settings

1. Go to your GitHub repository: `https://github.com/trisshasantos/portfolio`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 2. Deployment Process

The deployment is now fully automated! Every time you:
- Push changes to the `main` branch
- Merge a pull request to `main`

The GitHub Actions workflow will automatically:
1. Build your Angular application for production
2. Deploy it to GitHub Pages
3. Make it available at: `https://trisshasantos.github.io/portfolio/`

### 3. Build Configuration

The deployment uses these configurations:
- **Base href**: `/portfolio/` (matches your repository name)
- **Production build**: Optimized and minified
- **Static output**: No server-side rendering (SSR disabled for GitHub Pages)
- **Asset handling**: All images and files properly served from `public/` folder

### 4. Monitoring Deployments

To check deployment status:
1. Go to **Actions** tab in your GitHub repository
2. View the latest workflow runs
3. Check for any build or deployment errors
4. Each successful deployment will update your live site

### 5. Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to the `public/` folder with your domain name
2. Configure DNS settings with your domain provider
3. Update the base href in `package.json` build script

### 6. Local Testing

To test the production build locally:
```bash
# Build for GitHub Pages
npm run build:gh-pages

# Serve the built files locally (requires a local server)
npx http-server dist/portfolio -p 8080
```

## Troubleshooting

### Common Issues:

1. **404 errors**: Check that base href is set correctly to `/portfolio/`
2. **Missing images**: Ensure images are in `public/images/` folder
3. **Routing issues**: Angular routing should work with GitHub Pages
4. **Build failures**: Check the Actions tab for detailed error logs

### Build Scripts Available:

- `npm run build` - Standard production build
- `npm run build:gh-pages` - GitHub Pages optimized build
- `npm start` - Development server
- `npm run watch` - Development build with file watching

## Site URL

Once deployed, your portfolio will be available at:
**https://trisshasantos.github.io/portfolio/**

The deployment typically takes 2-5 minutes after pushing changes to the main branch.