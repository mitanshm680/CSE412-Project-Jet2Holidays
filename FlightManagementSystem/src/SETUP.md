# Jet2Holiday Flight Management System - Setup Guide

This comprehensive guide will walk you through setting up the Jet2Holiday Flight Management System from scratch.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Development Environment](#development-environment)
4. [Running the Application](#running-the-application)
5. [Building for Production](#building-for-production)
6. [Troubleshooting](#troubleshooting)
7. [IDE Configuration](#ide-configuration)

---

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 500MB for project and dependencies

### Recommended Requirements
- **Node.js**: v18.0.0 or higher (LTS version)
- **npm**: v9.0.0 or higher or **yarn**: v1.22.0+
- **RAM**: 8GB or more
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (latest version)

---

## Installation Steps

### Step 1: Install Node.js and npm

#### Windows
1. Download Node.js installer from [nodejs.org](https://nodejs.org/)
2. Run the installer (choose LTS version)
3. Follow the installation wizard
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### macOS
**Using Homebrew** (recommended):
```bash
brew install node
```

**Or download from** [nodejs.org](https://nodejs.org/):
1. Download the macOS installer
2. Run the .pkg file
3. Follow the installation steps

Verify installation:
```bash
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Clone or Download the Project

#### Option A: Using Git
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd jet2holiday-flight-management
```

#### Option B: Download ZIP
1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal/command prompt in the extracted folder

### Step 3: Install Project Dependencies

From the project root directory:

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

This will install all required dependencies listed in `package.json`:
- React and React DOM
- TypeScript
- Vite
- Tailwind CSS
- Radix UI components
- Lucide icons
- And all other dependencies

**Expected output:**
```
added XXX packages in XXs
```

### Step 4: Verify Installation

Check that all dependencies are installed correctly:

```bash
# Check for node_modules directory
ls node_modules/

# Verify package.json exists
cat package.json
```

---

## Development Environment

### Project Structure Overview

After installation, your project should have:

```
jet2holiday-flight-management/
├── node_modules/              # Dependencies (auto-generated)
├── components/                # React components
│   ├── ui/                   # UI component library
│   ├── figma/                # Image components
│   ├── flight-search.tsx     # Search component
│   ├── route-dialog.tsx      # Add/Edit dialog
│   └── route-table.tsx       # Data table
├── lib/                      # Utilities and data
│   └── mock-data.ts          # OpenFlights data
├── styles/                   # Global styles
│   └── globals.css           # Tailwind & custom CSS
├── App.tsx                   # Main app component
├── index.html                # HTML entry point
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite configuration
├── README.md                 # Documentation
└── SETUP.md                  # This file
```

### Environment Configuration

No environment variables are required for basic operation. The application uses mock data stored in `/lib/mock-data.ts`.

For future API integration, create a `.env` file:
```bash
# .env (optional, for future use)
VITE_API_URL=http://localhost:3000/api
VITE_API_KEY=your_api_key_here
```

---

## Running the Application

### Development Mode

Start the development server with hot reload:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

**Expected output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### Accessing the Application

1. Open your web browser
2. Navigate to: `http://localhost:5173`
3. You should see the Jet2Holiday Flight Management System

### Development Server Features

- **Hot Module Replacement (HMR)**: Changes reflect instantly
- **Fast Refresh**: Preserves component state during edits
- **Error Overlay**: Shows compilation errors in browser
- **TypeScript Support**: Type checking and IntelliSense

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript type checking
npm run type-check

# Lint code (if configured)
npm run lint
```

---

## Building for Production

### Step 1: Build the Application

```bash
# Using npm
npm run build

# Using yarn
yarn build
```

This creates an optimized production build in the `dist/` directory.

### Step 2: Preview Production Build

Test the production build locally:

```bash
# Using npm
npm run preview

# Using yarn
yarn preview
```

Access at: `http://localhost:4173`

### Step 3: Deploy

The `dist/` folder contains static files ready for deployment:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [other files]
```

**Deployment Options:**
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Copy `dist/` to `gh-pages` branch
- **AWS S3**: Upload `dist/` to S3 bucket
- **Traditional Hosting**: Upload `dist/` via FTP/SFTP

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Port 5173 Already in Use
```bash
# Error: Port 5173 is already in use
```

**Solution A**: Kill the process using the port
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

**Solution B**: Use a different port
```bash
npm run dev -- --port 3000
```

#### Issue 2: Module Not Found Errors
```bash
# Error: Cannot find module 'X'
```

**Solution**: Reinstall dependencies
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue 3: TypeScript Errors
```bash
# Error: Type 'X' is not assignable to type 'Y'
```

**Solution**: Check TypeScript configuration and types
```bash
# Verify TypeScript installation
npm list typescript

# Check tsconfig.json settings
cat tsconfig.json
```

#### Issue 4: Build Failures
```bash
# Error during build process
```

**Solution**: Clear cache and rebuild
```bash
# Clear Vite cache
rm -rf .vite

# Clear dist folder
rm -rf dist

# Rebuild
npm run build
```

#### Issue 5: Styles Not Loading
```bash
# Tailwind classes not applying
```

**Solution**: Verify Tailwind configuration
1. Check `/styles/globals.css` exists
2. Ensure it's imported in your entry point
3. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)

#### Issue 6: Slow Installation
**Solution**: Use a faster package manager or alternative registry
```bash
# Use yarn instead of npm
yarn install

# Or use a different npm registry
npm install --registry=https://registry.npmmirror.com
```

### Getting Help

If you encounter issues not covered here:

1. **Check the console**: Look for error messages in browser DevTools (F12)
2. **Check terminal**: Look for build/runtime errors
3. **Search existing issues**: GitHub issues or Stack Overflow
4. **Create new issue**: Provide error messages and steps to reproduce
5. **Check documentation**: Review README.md and component docs

---

## IDE Configuration

### Visual Studio Code (Recommended)

#### Recommended Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

#### Settings for VSCode
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### WebStorm/IntelliJ IDEA

1. Open project folder
2. Enable TypeScript support (automatic)
3. Configure Tailwind CSS IntelliSense
4. Set Node.js interpreter to local installation

### Other IDEs

Most modern IDEs support:
- TypeScript
- React/JSX
- Tailwind CSS
- ESLint

Refer to your IDE's documentation for setup.

---

## Verification Checklist

After setup, verify everything works:

- [ ] Node.js and npm installed correctly
- [ ] Project dependencies installed (`node_modules/` exists)
- [ ] Development server starts without errors (`npm run dev`)
- [ ] Application loads in browser (`http://localhost:5173`)
- [ ] Can search for routes
- [ ] Can insert new routes
- [ ] Can update existing routes
- [ ] Can delete routes
- [ ] Build process completes (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in browser

---

## Next Steps

Once setup is complete:

1. **Familiarize yourself**: Explore the UI and features
2. **Read documentation**: Review README.md for detailed usage
3. **Check mock data**: Review `/lib/mock-data.ts` to understand data structure
4. **Customize**: Add your own routes, airlines, and airports
5. **Develop**: Start building new features or modifications
6. **Test**: Ensure all functionality works as expected

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clean and reinstall
rm -rf node_modules package-lock.json && npm install

# Check for outdated packages
npm outdated

# Update packages
npm update
```

---

## Support Resources

- **Project Documentation**: README.md
- **React Documentation**: [react.dev](https://react.dev)
- **TypeScript Documentation**: [typescriptlang.org](https://www.typescriptlang.org)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Radix UI**: [radix-ui.com](https://www.radix-ui.com)

---

**Setup Complete! Happy Coding! 🚀**
