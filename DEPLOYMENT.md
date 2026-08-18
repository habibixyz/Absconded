# 🚀 ABSCONDED on Vercel - Complete Deployment Guide

Your book is ready to ship. Follow one of these methods to go live in minutes.

---

## Method 1: Deploy with One Click (Easiest ✨)

**⏱️ Time: 2 minutes**

1. **Create a GitHub account** (if you don't have one)
   - Go to [github.com](https://github.com)
   - Sign up for free

2. **Create a new repository**
   - Name: `absconded`
   - Make it **Public**
   - Don't initialize with README (we have one)

3. **Push the code**
   ```bash
   cd /path/to/absconded
   git init
   git add .
   git commit -m "Initial commit: ABSCONDED book"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/absconded.git
   git push -u origin main
   ```

4. **Deploy to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub
   - Select your `absconded` repository
   - Click "Import"
   - Click "Deploy"
    - Done! My site is live at `absconded-book.vercel.app`
    - Let's check that out!

---

## Method 2: Vercel CLI (Power User)

**⏱️ Time: 5 minutes**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
cd /path/to/absconded
vercel

# 4. For production (custom domain)
vercel --prod
```

Your site goes live immediately. You'll get a URL like:
- Development: `absconded-book.vercel.app`
- Production: `your-custom-domain.com`

---

## Method 3: GitHub + Vercel (Most Professional)

**⏱️ Time: 10 minutes**

### Step 1: Push to GitHub
```bash
cd /path/to/absconded
git init
git add .
git commit -m "ABSCONDED: A Builder's Evolution"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/absconded.git
git push -u origin main
```

### Step 2: Connect Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New... → Project"
4. Select `absconded` repository
5. Framework preset: **Next.js** (auto-detected)
6. Click **Deploy**

### Step 3: Add Custom Domain (Optional)
1. In Vercel dashboard → Project Settings → Domains
2. Add your domain (e.g., `absconded.io`)
3. Follow DNS setup instructions
4. Custom domain is live in ~5 minutes

---

## Method 4: Vercel Dashboard Upload (No Git Required)

**⏱️ Time: 3 minutes**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Scroll to "Other" section
3. Click "Create Git Repository"
4. Choose your Git provider
5. Authorize Vercel
6. Follow prompts to create new repo
7. Deploy

---

## What Happens After Deploy?

✅ Your site is **live globally** on Vercel's CDN
✅ **Automatic HTTPS** enabled
✅ **Automatic deployments** whenever you push to main
✅ **Environment variables** can be added in dashboard
✅ **Custom domain** support
✅ **Analytics** built-in

---

## Custom Domain Setup

### If you have a domain:

1. **Go to Vercel Dashboard** → Your Project → Settings → Domains
2. **Enter your domain** (e.g., `absconded.io`)
3. **Update DNS records:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.0
   ```
4. **Wait 5-30 minutes** for DNS to propagate
5. **Verify in Vercel dashboard** - it will show ✓ when connected

### Popular domain registrars:
- Namecheap
- GoDaddy
- Route53 (AWS)
- Cloudflare

---

## Customization After Deploy

### Change site colors:
Edit `/tailwind.config.js` → push to GitHub → auto-redeploy

### Update book content:
Edit `/app/page.jsx` → push to GitHub → auto-redeploy

### Add environment variables:
Vercel Dashboard → Settings → Environment Variables

---

## Environment Variables (Optional)

Create `.env.local` for development:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, add in Vercel Dashboard:
```
NEXT_PUBLIC_SITE_URL=https://absconded-book.vercel.app
```

---

## Troubleshooting

### "Build failed" error?
- Check Node version: `node --version` (need v16+)
- Verify `package.json` is valid JSON
- Check for broken imports in `/app`

### "Domain not connecting"?
- Wait 30 minutes for DNS propagation
- Check DNS records are exact (no typos)
- Verify domain was purchased and is active

### "404 on some routes"?
- Next.js handles all routes automatically
- No need to configure anything
- Check `/app/page.jsx` for typos

### Slow builds?
- Clear cache: Vercel Dashboard → Settings → Git → Redeploy
- Check for large files in `/public`

---

## Monitoring & Analytics

After deployment:

1. **Vercel Dashboard** → Click your project
2. **Analytics tab** shows:
   - Page views
   - Request count
   - Response times
   - Error rates
   - Top pages

3. **Deployments tab** shows:
   - All past deployments
   - Rollback option
   - Build logs
   - Preview URLs

---

## Next Steps

✅ **Once live:**
- Share your unique URL: `absconded-book.vercel.app`
- Social media: Instagram, Twitter, LinkedIn
- Newsletter/Discord/communities
- Personal website link

✅ **Optional upgrades:**
- Custom domain ($12-20/year elsewhere, free DNS here)
- Vercel Pro ($20/month) - more resources
- Analytics package (extra insights)

---

## Command Reference

```bash
# Local development
npm run dev              # http://localhost:3000

# Build for production
npm run build
npm start

# Deploy to Vercel
vercel                   # Preview
vercel --prod           # Production

# View deployment logs
vercel logs
```

---

## Your Book is Shipped 🚀

You're literally 2 minutes away from a live, global website.

**Quick deploy:**
1. `git push`
2. Visit [vercel.com](https://vercel.com)
3. Click deploy
4. Share the link

That's it. You've shipped.

---

**Questions?** → Check [Vercel Docs](https://vercel.com/docs) or [Next.js Docs](https://nextjs.org/docs)
