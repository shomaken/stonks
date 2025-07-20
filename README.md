# 📈 Stonks - Trade Real Stocks with $STONKS

A high-fidelity React web application that enables users to swap $STONKS tokens for stock-pegged SPL tokens via Jupiter on the Solana blockchain.

![Stonks Demo](https://via.placeholder.com/800x400/0A1128/3FBF3F?text=Stonks+Demo)

## ✨ Features

- **🔥 3D Interactive UI** - Beautiful Three.js background with floating arrows and particles
- **💎 Stock Trading** - Swap $STONKS for popular stock-pegged SPL tokens (AAPL, TSLA, GOOGL, etc.)
- **⚡ Lightning Fast** - Powered by Jupiter's decentralized exchange aggregator
- **🌙 Modern Design** - Dark theme with stonks green accents and smooth animations
- **📱 Fully Responsive** - Mobile-first design that works on all devices
- **🔐 Wallet Integration** - Support for Phantom, Solflare, and other Solana wallets
- **📊 Real-Time Prices** - Live stock prices with auto-refresh and caching
- **🔄 Smart API Fallbacks** - Multiple data sources ensure reliable price feeds

## 🎨 Design System

### Color Palette
- **Deep Navy**: `#0A1128` (background)
- **Stonks Green**: `#3FBF3F` (accents, buttons, hover states)
- **Crisp White**: `#FFFFFF` (text, icons)

### Typography
- **Headings**: Montserrat (Bold, geometric sans-serif)
- **Body**: Inter (Clean, legible sans-serif)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd stonks-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_SOLANA_RPC_URL=https://rpc.ankr.com/solana
VITE_STONKS_MINT=So11111111111111111111111111111111111111112
VITE_SLIPPAGE=0.5

# Optional: For enhanced real-time stock prices
# Get your free API key from: https://www.alphavantage.co/support/#api-key
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

6. **Test real-time prices** (optional)
```bash
# Quick test of the stock price service
node src/test-prices.js
```

## 🏗️ Project Structure

```
stonks-app/
├── src/
│   ├── components/
│   │   ├── BackgroundCanvas.jsx    # Three.js 3D background
│   │   ├── Hero.jsx               # Hero section with CTA
│   │   ├── Info.jsx               # Information section
│   │   ├── Dashboard.jsx          # Stock dashboard
│   │   ├── StockCard.jsx          # Individual stock cards
│   │   └── Footer.jsx             # Footer component
│   ├── App.jsx                    # Main app with wallet providers
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles and components
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # Tailwind configuration
└── vite.config.js                # Vite configuration
```

## 🔧 Tech Stack

### Core
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling

### Blockchain
- **@solana/web3.js** - Solana blockchain interaction
- **@solana/wallet-adapter-react** - Wallet connection
- **@jup-ag/core** - Jupiter DEX integration

### 3D & Animation
- **Three.js** - 3D graphics
- **@react-three/fiber** - React Three.js renderer
- **@react-three/drei** - Three.js helpers
- **Framer Motion** - Animations and micro-interactions

### UI/UX
- **React Hot Toast** - Toast notifications
- **Google Fonts** - Montserrat & Inter typography

## 🎯 How It Works

1. **Connect Wallet** - Users connect their Solana wallet (Phantom, Solflare, etc.)
2. **Browse Stocks** - View available stock-pegged SPL tokens with real-time prices
3. **Select & Swap** - Choose amount and direction (buy/sell) for the swap
4. **Jupiter Magic** - Jupiter finds the best route and executes the trade
5. **Success!** - Tokens are instantly swapped in your wallet

## 📊 Available Stocks & Real-Time Prices

### Live Stock Data
The app fetches real-time prices from multiple sources:
- **Primary**: Yahoo Finance API (free, no API key required)
- **Fallback**: Alpha Vantage API (requires free API key)
- **Cache**: 1-minute intelligent caching to reduce API calls

### Supported Stocks
- **AAPL** - Apple Inc. (Technology)
- **TSLA** - Tesla Inc. (Technology) 
- **GOOGL** - Alphabet Inc. (Technology)
- **AMZN** - Amazon.com Inc. (Technology)
- **NVDA** - NVIDIA Corporation (Technology)
- **MSFT** - Microsoft Corporation (Technology)
- **JPM** - JPMorgan Chase & Co. (Finance)
- **JNJ** - Johnson & Johnson (Healthcare)
- **V** - Visa Inc. (Finance)

### Features
- 🔄 **Auto-refresh** every 30 seconds
- ⚡ **Manual refresh** button
- 💾 **Smart caching** prevents API rate limits
- 🌐 **Multiple fallbacks** ensure reliable data
- 📱 **Loading states** with skeleton screens

## 🔒 Important Notes

⚠️ **This is a demo application for educational purposes**

- Mock trading functionality (real Jupiter integration commented)
- Not financial advice
- Always DYOR (Do Your Own Research)
- Trading involves risk

## 🚧 Future Enhancements

- [x] Real-time price feeds integration ✅
- [ ] Actual Jupiter swap implementation
- [ ] Mini price charts on stock cards
- [ ] Portfolio tracking
- [ ] Order history
- [ ] More stock tokens
- [ ] Advanced trading features
- [ ] WebSocket price streaming
- [ ] Price alerts and notifications

## 🎨 Customization

### Adding New Stocks
Edit `src/components/Dashboard.jsx` and add to the `stocks` array:

```javascript
{
  symbol: 'NEW',
  name: 'New Stock Inc.',
  price: 123.45,
  change: 1.23,
  changePercent: 1.0,
  mint: 'new-stock-mint-address',
  category: 'tech'
}
```

### Modifying Colors
Update `tailwind.config.js`:

```javascript
colors: {
  navy: '#0A1128',           // Background
  'stonks-green': '#3FBF3F', // Accent color
  white: '#FFFFFF',          // Text
}
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Jupiter** - For the amazing DEX aggregator
- **Solana** - For the fast and cheap blockchain
- **Three.js** - For the beautiful 3D graphics
- **Framer Motion** - For smooth animations

---

**Made with 🚀 by Brooz**

*Diamond Hands Only* 💎🙌 