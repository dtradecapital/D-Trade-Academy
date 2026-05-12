import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  LayoutGrid, 
  List,
  ChevronRight,
  Info,
  LineChart as LineChartIcon,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { cn } from '../lib/utils';
import { translations, Language } from '../lib/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

const initialMarketData = [
  { time: '09:00', price: 15200 },
  { time: '10:00', price: 15350 },
  { time: '11:00', price: 15280 },
  { time: '12:00', price: 15420 },
  { time: '13:00', price: 15500 },
  { time: '14:00', price: 15450 },
  { time: '15:00', price: 15620 },
  { time: '16:00', price: 15580 },
  { time: '17:00', price: 15750 },
  { time: '18:00', price: 15820 },
];

const watchlist = [
  { symbol: 'RELIANCE', price: 2540.20, change: '+1.24%', isUp: true },
  { symbol: 'TCS', price: 3420.50, change: '-0.85%', isUp: false },
  { symbol: 'INFY', price: 1580.00, change: '+2.10%', isUp: true },
  { symbol: 'HDFC BANK', price: 1650.75, change: '+0.45%', isUp: true },
  { symbol: 'ICICI BANK', price: 920.30, change: '-1.15%', isUp: false },
];

interface MarketsSimulatorProps {
  language: Language;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const MarketsSimulator: React.FC<MarketsSimulatorProps> = ({ language, showToast }) => {
  const { user, executeTrade } = useUser();
  const t = translations[language];
  const [marketData, setMarketData] = useState(initialMarketData);
  const [currentPrice, setCurrentPrice] = useState(15820.45);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('1000');
  const [isExecuting, setIsExecuting] = useState(false);
  const [timeframe, setTimeframe] = useState('1D');
  const [watchlistItems, setWatchlistItems] = useState(watchlist);

  // Timeframe data simulation
  useEffect(() => {
    let newData = initialMarketData;
    if (timeframe === '1W') {
      newData = [
        { time: 'Mon', price: 15200 }, { time: 'Tue', price: 15450 }, { time: 'Wed', price: 15120 },
        { time: 'Thu', price: 15680 }, { time: 'Fri', price: 15340 }, { time: 'Sat', price: 15890 }, { time: 'Sun', price: 15750 }
      ];
    } else if (timeframe === '1M') {
      newData = [
        { time: 'W1', price: 14800 }, { time: 'W2', price: 15250 }, { time: 'W3', price: 15780 }, { time: 'W4', price: 15820 }
      ];
    } else if (timeframe === '1Y') {
      newData = [
        { time: 'Jan', price: 14200 }, { time: 'Mar', price: 14850 }, { time: 'Jun', price: 15120 },
        { time: 'Sep', price: 15680 }, { time: 'Dec', price: 15820 }
      ];
    }
    setMarketData(newData);
  }, [timeframe]);

  const addRandomSymbol = () => {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    if (watchlistItems.find(i => i.symbol === randomSymbol)) {
      showToast(`${randomSymbol} is already in your watchlist`, "info");
      return;
    }
    const newItem = {
      symbol: randomSymbol,
      price: Math.floor(Math.random() * 3000) + 100,
      change: `${(Math.random() * 3).toFixed(2)}%`,
      isUp: Math.random() > 0.5
    };
    setWatchlistItems(prev => [newItem, ...prev]);
    showToast(`Added ${randomSymbol} to watchlist`, "success");
  };

  // Simulate live price movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 5;
        return Number((prev + change).toFixed(2));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(tradeAmount);
    if (!amount || amount <= 0) return;

    if (tradeType === 'buy' && user && amount > user.portfolioBalance) {
      showToast("Insufficient balance", "error");
      return;
    }

    setIsExecuting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    executeTrade(amount, tradeType);
    showToast(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ₹${amount} worth of NIFTY 50`, "success");
    setIsExecuting(false);
    setShowTradeModal(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Trade Modal */}
      <AnimatePresence>
        {showTradeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTradeModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-card w-full max-w-md rounded-none border border-primary/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-primary tracking-tight">
                  {tradeType === 'buy' ? 'Buy NIFTY 50' : 'Sell NIFTY 50'}
                </h3>
                <button 
                  onClick={() => setShowTradeModal(false)}
                  className="p-2 hover:bg-white/5 rounded-none transition-colors"
                >
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>
              
              <form onSubmit={handleTrade} className="p-6 space-y-6">
                <div className="flex bg-black border border-border p-1 rounded-none">
                  <button 
                    type="button"
                    onClick={() => setTradeType('buy')}
                    className={cn(
                      "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                      tradeType === 'buy' ? "bg-success text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "text-muted hover:text-success"
                    )}
                  >
                    Buy
                  </button>
                  <button 
                    type="button"
                    onClick={() => setTradeType('sell')}
                    className={cn(
                      "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                      tradeType === 'sell' ? "bg-error text-black shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "text-muted hover:text-error"
                    )}
                  >
                    Sell
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="label-caps !text-[9px]">Market Price</label>
                    <p className="text-lg font-display font-bold text-primary">₹{currentPrice}</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="label-caps !text-[9px]">Trade Amount (₹)</label>
                    <input 
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-border focus:border-primary transition-all rounded-none text-sm outline-none"
                    />
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/10 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-muted tracking-widest">
                      <span>Available Margin</span>
                      <span className="text-primary">₹{user?.portfolioBalance?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase text-muted tracking-widest">
                      <span>Est. Quantity</span>
                      <span className="text-text">{(Number(tradeAmount) / currentPrice).toFixed(4)} Units</span>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isExecuting}
                  className={cn(
                    "w-full py-3 rounded-none font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.3)]",
                    tradeType === 'buy' ? "bg-success text-black" : "bg-error text-black"
                  )}
                >
                  {isExecuting ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary tracking-tight">{t.markets}</h2>
          <p className="label-caps mt-1">{t.realTimeData}</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-black border border-border rounded-none">
          <button className="px-4 py-1.5 bg-primary text-black rounded-none text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(245,185,66,0.3)]" onClick={() => showToast("Showing Live Markets")}>{t.liveMarkets}</button>
          <button className="px-4 py-1.5 text-muted text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors" onClick={() => showToast("Opening My Portfolio")}>{t.myPortfolio}</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div variants={itemVariants} className="card">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-none bg-black border border-primary flex items-center justify-center text-primary font-display font-bold text-xl shadow-[0_0_15px_rgba(245,185,66,0.2)]">N</div>
                <div>
                  <h3 className="text-xl font-display font-bold text-primary tracking-tight">NIFTY 50</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-display font-bold text-text">₹{currentPrice.toLocaleString()}</span>
                    <span className="text-sm font-bold text-success flex items-center">
                      <ArrowUpRight className="w-4 h-4" />
                      +124.20 (0.79%)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
                  <button 
                    key={tf} 
                    onClick={() => setTimeframe(tf)}
                    className={cn(
                      "px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-widest transition-all border",
                      timeframe === tf ? "bg-primary text-black border-primary shadow-[0_0_10px_rgba(245,185,66,0.3)]" : "bg-black text-muted border-border hover:border-primary hover:text-primary"
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F5B942" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F5B942" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.5} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#737373', fontWeight: 'bold'}} dy={10} />
                  <YAxis domain={['dataMin - 100', 'dataMax + 100']} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#737373', fontWeight: 'bold'}} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '0px', 
                      border: '1px solid #F5B942', 
                      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                      backgroundColor: '#121212',
                      color: '#F5B942'
                    }} 
                  />
                  <Area type="monotone" dataKey="price" stroke="#F5B942" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-4 space-y-2 border-primary/20">
              <p className="label-caps !text-[8px]">{t.dayHigh}</p>
              <p className="text-lg font-display font-bold text-primary">15,850.00</p>
            </div>
            <div className="card p-4 space-y-2 border-primary/20">
              <p className="label-caps !text-[8px]">{t.dayLow}</p>
              <p className="text-lg font-display font-bold text-primary">15,180.45</p>
            </div>
            <div className="card p-4 space-y-2 border-primary/20">
              <p className="label-caps !text-[8px]">{t.volume}</p>
              <p className="text-lg font-display font-bold text-primary">2.4M</p>
            </div>
          </motion.div>
        </div>

        {/* Watchlist Section */}
        <div className="space-y-6">
          <motion.section variants={itemVariants} className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-primary uppercase tracking-tight">{t.watchlist}</h3>
              <button className="p-1.5 hover:bg-white/5 rounded-none transition-colors">
                <Search className="w-4 h-4 text-muted" />
              </button>
            </div>
            
            <div className="space-y-1">
              {watchlistItems.map((item) => (
                <div key={item.symbol} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-none transition-all cursor-pointer group border border-transparent hover:border-primary/20">
                  <div>
                    <p className="text-sm font-bold group-hover:text-primary transition-colors tracking-tight">{item.symbol}</p>
                    <p className="label-caps !text-[8px]">NSE • Equity</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-text group-hover:text-primary transition-colors">₹{item.price.toLocaleString()}</p>
                    <p className={cn(
                      "text-[10px] font-bold flex items-center justify-end gap-0.5",
                      item.isUp ? "text-success" : "text-error"
                    )}>
                      {item.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {item.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={addRandomSymbol}
              className="w-full mt-4 py-2 border border-dashed border-border rounded-none text-[10px] font-bold uppercase tracking-widest text-muted hover:border-primary hover:text-primary transition-all"
            >
              + {t.addSymbol}
            </button>
          </motion.section>

          <motion.section variants={itemVariants} className="card bg-black border border-primary/30 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-primary" />
              <h4 className="label-caps !text-primary">{t.simulatorInfo}</h4>
            </div>
            <p className="text-[11px] text-muted leading-relaxed font-medium">
              {t.virtualTradingDesc}
            </p>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between items-center mb-4">
                <span className="label-caps !text-[8px]">{t.virtualBalance}</span>
                <span className="text-sm font-display font-bold text-primary">₹{user?.portfolioBalance?.toLocaleString()}</span>
              </div>
              <button 
                className="btn-premium w-full !py-2" 
                onClick={() => {
                  setTradeType('buy');
                  setShowTradeModal(true);
                }}
              >
                {t.executeTrade}
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

