# 🚢 Shipping ABSCONDED to Vercel

This guide ensures your premium digital manuscript is deployed correctly to Vercel.

## 🛠 Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **GitHub Repo**: Ensure your code is pushed to [github.com/habibixyz/Absconded](https://github.com/habibixyz/Absconded).
3.  **Vercel CLI (Optional)**: Install via `npm i -g vercel`.

## 🚀 Deployment Steps

### Option A: Via GitHub (Recommended)

1.  Go to the [Vercel Dashboard](https://vercel.com/new).
2.  Import the `Absconded` repository.
3.  Vercel will auto-detect **Next.js**.
4.  Set the **Root Directory** to `absconded`.
5.  Click **Deploy**.

### Option B: Via Vercel CLI

1.  Open your terminal in the `e:\Absconded\absconded` directory.
2.  Run the login command if you haven't:
    ```bash
    vercel login
    ```
3.  Run the production deploy:
    ```bash
    vercel --prod
    ```

## 📝 Post-Deployment Checklist

- [ ] Verify the URL (e.g., `absconded.vercel.app`).
- [ ] Check that the **Lora** and **Inter** fonts load correctly.
- [ ] Test the **Download Manuscript** button in the chapter views.
- [ ] Share the link on Twitter/X and verify the OpenGraph preview cards.

## 🔧 Troubleshooting

- **Build Fails**: Ensure you are in the `absconded` folder when running commands, not the root.
- **Styling Missing**: Check that `globals.css` is correctly imported in `layout.jsx`.
- **404 on Assets**: Ensure `ABSCONDED_by_Tanvir_Khan.docx` is inside `absconded/public/`.

---

**Absconded / 2026**
