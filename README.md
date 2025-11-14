💹 Crypto & Stock Market Tracker

A modern fintech dashboard that tracks real-time cryptocurrency and stock prices, visualizes market trends, and simulates portfolio investment returns.
Built for developers, finance enthusiasts, and learners who want to explore market analytics interactively.

🚀 Features
📈 Real-Time Market Tracking

Live cryptocurrency prices from CoinGecko API

Real-time stock data using Alpha Vantage API

Price updates auto-refresh every few seconds

📊 Interactive Charts & Analytics

Candlestick charts

Line graphs

Moving Averages (MA, EMA)

Volume indicators

Portfolio value tracking

👤 Portfolio Simulation

Create virtual portfolios

Add crypto or stock assets

Simulate profit/loss

Compete with friends on leaderboards (Bonus feature)

☁️ Cloud Integration (Firebase)

User login / signup

Store portfolio & preferences

Sync data across devices

🛠️ Tech Stack
Frontend

React.js

Plotly.js (Charts)

TailwindCSS / Material UI

Backend

Node.js

Express.js

Firebase Authentication

Firebase Firestore

REST API Integration

APIs

CoinGecko API: Crypto data
https://www.coingecko.com/en/api

Alpha Vantage API: Stock market data
https://www.alphavantage.co

📂 Project Structure
crypto-stock-tracker/
│── frontend/
│     ├── src/
│     ├── components/
│     ├── pages/
│     └── public/
│
│── backend/
│     ├── routes/
│     ├── controllers/
│     ├── server.js
│     └── package.json
│
│── README.md
│── .env.example
│── package.json

⚙️ Backend Setup
1. Navigate to backend folder
cd backend
npm install

2. Create .env
COINGECKO_API=https://api.coingecko.com/api/v3
ALPHA_VANTAGE_KEY=YOUR_ALPHA_VANTAGE_KEY
FIREBASE_PROJECT_ID=your_project
FIREBASE_PRIVATE_KEY=your_key

3. Run backend
npm start

🎨 Frontend Setup
1. Install dependencies
cd frontend
npm install

2. Start development server
npm run dev


UI will run on:

👉 http://localhost:3000 (Next.js)
or
👉 http://localhost:5173 (Vite)

📡 API Usage Examples
Crypto Example
fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")

Stock Example
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_KEY

🧪 Portfolio Simulation Logic

User starts with virtual money (e.g., $10,000)

Buys / sells crypto & stocks at live prices

P/L is calculated using:

profit = (current_price - bought_price) * quantity


Leaderboard compares ROI among users

📷 Screenshots (Add later)

You can add:

Dashboard

Portfolio page

Chart examples

Leaderboards

🧩 Future Enhancements

WebSockets for ultra-fast live charts

AI-based stock prediction (LSTM models)

News sentiment scoring

Crypto fear & greed index

Alerts (Telegram, Email, SMS)

🤝 Contributing

Contributions are welcome!

Fork repository

Create new feature branch

Commit changes

Create a pull request

📄 License

MIT License — free to use, modify, and distribute.

👤 Author

Siddhartha Singh 
