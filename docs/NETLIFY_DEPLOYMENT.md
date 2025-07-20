# 🌐 Netlify Deployment Guide for Stonks

## 🚀 **Quick Deploy to Netlify**

### **Method 1: Drag & Drop (Fastest)**

1. **Build your app**:
   ```bash
   npm run build
   ```

2. **Drag the `dist` folder** to Netlify dashboard at https://app.netlify.com/drop

3. **Done!** Your app is live instantly

### **Method 2: Git Integration (Recommended)**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to https://app.netlify.com/
   - Click "New site from Git"
   - Choose GitHub and select your repo
   - Build settings are auto-detected from `netlify.toml`

3. **Deploy automatically** on every push!

## ⚙️ **Environment Variables Setup**

### **Step 1: Get Your $STONKS Token Address**
You mentioned you already have it deployed. Add it to Netlify:

1. Go to your site dashboard on Netlify
2. Go to **Site settings** → **Environment variables**
3. Add these variables:

```env
# Your deployed $STONKS token (YOU PROVIDE THIS)
VITE_STONKS_MINT=your_actual_stonks_ca_here

# Solana RPC (free tier works)
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Optional: Enhanced stock prices (free)
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# App settings
VITE_SLIPPAGE=0.5
```

### **Step 2: Stock Token Addresses**
We still need real stock token mints. Options:

**Option A: Use Popular SPL Tokens Temporarily**
```env
# Popular tokens as placeholders (works immediately)
VITE_AAPL_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v  # USDC
VITE_TSLA_MINT=Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB   # USDT  
VITE_GOOGL_MINT=So11111111111111111111111111111111111111112    # SOL
VITE_AMZN_MINT=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263   # Bonk
VITE_NVDA_MINT=7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs    # ETH
VITE_MSFT_MINT=mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So    # mSOL
VITE_JPM_MINT=7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj     # stSOL
VITE_JNJ_MINT=J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn     # JitoSOL
VITE_V_MINT=bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1       # bSOL
```

**Option B: Wait for Real Stock Tokens**
- I can help research existing stock tokens on Solana
- Or we can create our own stock-pegged tokens

## 🛠️ **Complete Setup Script**

Create a `.env.production` file locally:

```env
# Copy your $STONKS contract address here
VITE_STONKS_MINT=your_stonks_ca_from_deployment

# Solana network  
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Stock tokens (using popular SPL tokens for now)
VITE_AAPL_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
VITE_TSLA_MINT=Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
VITE_GOOGL_MINT=So11111111111111111111111111111111111111112
VITE_AMZN_MINT=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
VITE_NVDA_MINT=7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs
VITE_MSFT_MINT=mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So
VITE_JPM_MINT=7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj
VITE_JNJ_MINT=J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn
VITE_V_MINT=bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1

# Optional enhancements
VITE_ALPHA_VANTAGE_API_KEY=your_key_here
VITE_SLIPPAGE=0.5
```

## 📱 **Custom Domain Setup**

### **Free Netlify Domain**
Your app will be available at: `your-app-name.netlify.app`

### **Custom Domain** 
1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. **Add to Netlify**:
   - Site settings → Domain management
   - Add custom domain
   - Update DNS records as instructed
3. **SSL is automatic** 🔒

## 🔧 **Build Optimization**

### **Fast Builds**
Your `netlify.toml` is configured for:
- ✅ Auto-detection of build settings
- ✅ SPA routing support
- ✅ Asset caching (1 year)
- ✅ Security headers
- ✅ Gzip compression

### **Build Commands**
```bash
# Local development
npm run dev

# Test production build
npm run build
npm run preview

# Deploy to Netlify (manual)
npm run build
# Then drag dist/ folder to Netlify
```

## 📊 **After Deployment Checklist**

1. ✅ **Test wallet connection** (Phantom, Solflare)
2. ✅ **Verify stock prices load** (should be real-time)
3. ✅ **Check responsive design** (mobile/desktop)
4. ✅ **Test "trade" buttons** (should show swap interface)
5. ⚠️ **Jupiter swaps** (will be demo until real stock tokens)

## 🚀 **Next Steps After Your Provide $STONKS CA**

1. **I'll update the code** with your token address
2. **Enable real Jupiter trading** (currently mocked)
3. **Optimize for your specific token**
4. **Add token metadata integration**

## 🔥 **Ready to Go Live?**

**Just provide me your $STONKS contract address and I'll:**
- ✅ Update all configurations
- ✅ Set up the environment variables
- ✅ Enable real Jupiter swaps
- ✅ Test everything works
- ✅ Give you the final deployment commands

**Your app will be live in minutes after you give me the CA!** 🎯 