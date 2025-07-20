# 🚀 STONKS App Deployment Guide

## 📋 DEPLOYMENT CHECKLIST

✅ **Build successful** - App builds without errors  
✅ **All token addresses configured** - Real contract addresses ready  
✅ **Environment variables documented** - See NETLIFY_ENV_VARIABLES.md  
✅ **Deployment configs ready** - netlify.toml configured  

---

## 🔧 Step 1: Upload to GitHub

### Option A: GitHub Desktop (Recommended)
1. Download **GitHub Desktop** from github.com
2. **"Add an Existing Repository from your Hard Drive"**
3. Select your `stonks 2` folder
4. **Create repository** → Make it **Public**
5. **Publish repository**

### Option B: GitHub Web Interface
1. Go to **github.com** → **"New repository"**
2. Name: `stonks-trading-app`
3. Make it **Public**
4. **Don't** initialize with README (you have files already)
5. **Create repository**
6. **Upload files** → Drag your entire `stonks 2` folder contents
7. **Commit changes**

---

## 🌐 Step 2: Deploy to Netlify

1. Go to **netlify.com** → Sign up/login
2. **"New site from Git"**
3. **Connect to GitHub** → Authorize Netlify
4. **Choose your stonks repository**
5. **Build settings** (should auto-detect):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. **Deploy site** (will fail first time - that's okay!)

---

## ⚙️ Step 3: Add Environment Variables

In Netlify dashboard → **Site settings** → **Environment variables**:

**Copy these exact values:**

```
VITE_STONKS_MINT = 6NcdiK8B5KK2DzKvzvCfqi8EHaEqu48fyEzC8Mm9pump
VITE_SOLANA_RPC_URL = https://solana-api.projectserum.com
VITE_NVDA_MINT = Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh
VITE_TSLA_MINT = XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB
VITE_SPY_MINT = XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W
VITE_CRCL_MINT = XsueG8BtpquVJX9LVLLEGuViXUungE6WmK5YZ3p3bd1
VITE_MSTR_MINT = XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ
VITE_GOOGL_MINT = XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN
VITE_AAPL_MINT = XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp
VITE_MCD_MINT = XsqE9cRRpzxcGKDXj1BJ7Xmg4GRhZoyY1KpmGSxAWT2
VITE_META_MINT = Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu
```

---

## 🔄 Step 4: Trigger Redeploy

1. **Site settings** → **Build & deploy**
2. **Trigger deploy** → **Deploy site**
3. **Wait for build to complete** (~2-3 minutes)
4. **Get your live URL!** (e.g., `https://stonks-app-12345.netlify.app`)

---

## 🎉 Expected Results

✅ **No more 403 RPC errors**  
✅ **Wallet connects smoothly on HTTPS**  
✅ **Balance checks work properly**  
✅ **Jupiter swaps execute successfully**  
✅ **Real-time token prices**  
✅ **Professional domain for sharing**  

---

## 🔧 If Issues Occur

1. **Check build logs** in Netlify dashboard
2. **Verify all environment variables** are set correctly
3. **Test on mobile** - wallets work better on phones
4. **Clear browser cache** after deployment

Your STONKS trading platform will be live and fully functional! 🚀💎📈 