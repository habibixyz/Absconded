# Setup Guide - ABSCONDED

## Prerequisites

You need these installed:
- **Node.js** (v16 or higher) - [download](https://nodejs.org)
- **Git** - [download](https://git-scm.com)
- **A code editor** - VS Code recommended [download](https://code.visualstudio.com)

Check if you have them:
```bash
node --version    # Should be v16+
npm --version     # Should be v8+
git --version     # Should show a version
```

---

## Local Setup (5 minutes)

### 1. Navigate to project
```bash
cd /path/to/absconded
# or if you downloaded it
cd ~/Downloads/absconded
```

### 2. Install dependencies
```bash
npm install
```

This downloads all required packages (~200MB). Takes 2-3 minutes.

### 3. Run development server
```bash
npm run dev
```

You'll see:
```
> absconded@1.0.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.3s
```

### 4. Open in browser
Go to: **http://localhost:3000**

You should see the ABSCONDED cover page.

---

## Make Changes

### Edit the book content
1. Open `/app/page.jsx` in your editor
2. Scroll to the `chapters` array
3. Update chapter text
4. Save the file
5. Browser auto-refreshes

### Change colors
1. Open `/tailwind.config.js`
2. Find the `terminal` color (currently `#00ff88`)
3. Replace with your hex color
4. Save
5. See changes instantly

### Update navigation
1. Open `/app/page.jsx`
2. Find the `<nav>` element
3. Add links or change text
4. Save

---

## Deploy to Vercel

### Before deploying:
```bash
# Test build locally
npm run build

# If it says ✓ Built successfully, you're good
```

### Deploy steps:

**Option A: One-click (easiest)**
1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Select your repository
4. Click "Deploy"
5. Done!

**Option B: Vercel CLI**
```bash
# Install Vercel globally (one time)
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

That's it. Your site is live.

---

## Project Files Explained

```
absconded/
├── app/
│   ├── layout.jsx         ← HTML structure, meta tags
│   ├── page.jsx           ← Main page (edit chapters here)
│   └── globals.css        ← Global styles
├── public/
│   └── ABSCONDED_by_Tanvir_Khan.docx  ← Book download
├── tailwind.config.js     ← Customize colors here
├── next.config.js         ← Next.js config
├── package.json           ← Dependencies list
├── README.md              ← Project info
└── DEPLOYMENT.md          ← Detailed deploy guide
```

---

## Common Issues & Fixes

### "npm: command not found"
→ Install Node.js: [nodejs.org](https://nodejs.org)

### "Port 3000 already in use"
→ Kill the process: 
```bash
# Mac/Linux
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Module not found" error
→ Reinstall dependencies:
```bash
rm -rf node_modules
npm install
```

### Changes not showing
→ Hard refresh:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## Editing Tips

### Add a new chapter
In `/app/page.jsx`, add to the `chapters` array:
```javascript
{
  number: 11,
  title: 'Chapter Title',
  excerpt: 'Short excerpt...',
  preview: 'Longer preview text...'
}
```

### Change terminal color everywhere
Edit `/tailwind.config.js`:
```javascript
colors: {
  terminal: '#FF00FF',  // Change this hex
}
```

### Update author name
In `/app/page.jsx`, find:
```javascript
<p className="text-lg font-semibold text-white">By Tanvir Khan</p>
```

Replace `Tanvir Khan` with your name.

---

## Performance Tips

- Images: Use `/public` folder for all images
- CSS: Tailwind automatically purges unused styles
- JavaScript: Keep component code lean
- Don't add large libraries without checking size

Check build size:
```bash
npm run build
# Shows "analyzed clientside bundles" at the end
```

---

## Useful Commands

```bash
npm run dev      # Start development
npm run build    # Build for production
npm start        # Run production build locally
npm run lint     # Check code quality
vercel           # Preview deployment
vercel --prod    # Live deployment
```

---

## Next Steps

1. ✅ Run locally: `npm run dev`
2. ✅ Test in browser: http://localhost:3000
3. ✅ Make edits to `/app/page.jsx`
4. ✅ Deploy to Vercel: `vercel --prod`
5. ✅ Share your live URL

---

## Need Help?

- **Next.js issues**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel issues**: [vercel.com/docs](https://vercel.com/docs)
- **Tailwind issues**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Terminal/command issues**: Google the error message

---

**You're all set. Build, ship, share. 🚀**
