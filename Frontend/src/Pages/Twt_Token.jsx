import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  Gift, 
  Clock, 
  ArrowDownRight, 
  ArrowUpRight, 
  Award, 
  Info,
  AlertTriangle,
  Search,
  Bell,
  X
} from 'lucide-react';

const Twt_Token = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daily');
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeDuration, setStakeDuration] = useState('30');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "You received 25 TWT tokens", time: "2 minutes ago", read: false },
    { id: 2, message: "New marketplace item available", time: "1 hour ago", read: false },
    { id: 3, message: "Your stake has matured", time: "5 hours ago", read: true }
  ]);

  // Marketplace items data
  const marketplaceItems = [
    {
      id: 1,
      title: 'AI MARKETPLACE',
      price: 'PRICE: TWT',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjBhcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      title: 'NFT MARKETPLACE',
      price: 'PRICE: TWT',
      image: 'https://images.unsplash.com/photo-1645378999013-95abebf5f3c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmZ0JTIwYXJ0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      title: 'COUPON CODE',
      price: 'PRICE: TWT',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y291cG9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 4,
      title: 'VARTUL MARKETPLACE',
      price: 'PRICE: TWT',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlnaXRhbCUyMG1hcmtldHBsYWNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
    }
  ];

  const walletData = {
    total: 15420.50,
    available: 8920.50,
    staked: 6500.00
  };

  const recentRewards = [
    { type: 'Watch', amount: 25.5, date: '2 hours ago', icon: '👁️' },
    { type: 'Referral', amount: 100, date: '5 hours ago', icon: '🤝' },
    { type: 'Creator Tip', amount: 50, date: '1 day ago', icon: '💝' },
    { type: 'Watch', amount: 15.25, date: '1 day ago', icon: '👁️' },
    { type: 'Staking', amount: 75, date: '2 days ago', icon: '📈' }
  ];

  const transactions = [
    { type: 'Earned', amount: 25.5, desc: 'Video watch rewards', time: '2:30 PM', date: 'Today' },
    { type: 'Staked', amount: -500, desc: 'Staked for 30 days', time: '11:15 AM', date: 'Today' },
    { type: 'Earned', amount: 100, desc: 'Referral bonus', time: '9:45 AM', date: 'Yesterday' },
    { type: 'Spent', amount: -200, desc: 'Premium feature unlock', time: '6:20 PM', date: 'Yesterday' },
    { type: 'Earned', amount: 75, desc: 'Staking rewards', time: '3:10 PM', date: '2 days ago' }
  ];

  const stakingPlans = [
    { days: 30, apy: '8%', label: '30 Days' },
    { days: 90, apy: '12%', label: '90 Days' },
    { days: 180, apy: '18%', label: '180 Days' }
  ];

  const tips = [
    'Watch 10+ videos daily to maximize rewards',
    'Stake for 90+ days to unlock premium APY',
    'Refer friends to earn bonus TWT tokens'
  ];

  const calculateRewards = () => {
    if (!stakeAmount || isNaN(stakeAmount)) return 0;
    const plan = stakingPlans.find(p => p.days === parseInt(stakeDuration));
    const apy = parseFloat(plan.apy) / 100;
    return (parseFloat(stakeAmount) * apy * (parseInt(stakeDuration) / 365)).toFixed(2);
  };

  return (
    <div className="flex bg-black min-h-screen">
      {/* Main content area - shifted to make room for right sidebar */}
      <div className="flex-1 ml-0 lg:ml-[250px] overflow-x-hidden">
        {/* Header/Navigation */}
        <header className="bg-gray-900/90 border-b border-gray-800 py-4 px-6 backdrop-blur-sm sticky top-0 z-50 shadow-md shadow-black/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-bold text-xl tracking-wide mr-2">TWT TOKEN</div>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">Marketplace</Link>
              <Link to="/ranking" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium">Ranking</Link>
              
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && alert(`Searching for: ${searchQuery}`)}
                  placeholder="Search..." 
                  className="bg-gray-800/80 text-sm rounded-full py-2 px-4 pl-10 w-48 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200 border border-gray-700 hover:border-gray-600"
                />
                <Search 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" 
                  onClick={() => alert(`Searching for: ${searchQuery}`)}
                />
              </div>
              
              <div className="flex items-center space-x-5">
                <div className="relative">
                  <Bell 
                    className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors duration-200" 
                    onClick={() => setShowNotifications(!showNotifications)}
                  />
                  {notifications.some(n => !n.read) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-gray-900"></div>
                  )}
                  
                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div className="absolute top-8 right-0 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                      <div className="flex items-center justify-between p-3 border-b border-gray-700">
                        <h3 className="font-medium text-white">Notifications</h3>
                        <X 
                          className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" 
                          onClick={() => setShowNotifications(false)}
                        />
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-3 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer ${!notification.read ? 'bg-gray-800/30' : ''}`}
                            onClick={() => {
                              setNotifications(notifications.map(n => 
                                n.id === notification.id ? {...n, read: true} : n
                              ));
                            }}
                          >
                            <p className="text-sm text-white mb-1">{notification.message}</p>
                            <p className="text-xs text-gray-400">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 text-center">
                        <button 
                          className="text-xs text-purple-400 hover:text-purple-300"
                          onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div 
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-900/20 cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  R
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Warning Banner */}
        <div className="bg-gradient-to-r from-red-900/40 to-red-800/40 border-b border-red-700 py-3 px-6 backdrop-blur-sm">
          <div className="flex items-center max-w-6xl mx-auto">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 animate-pulse" />
            <p className="text-sm font-medium tracking-wide text-red-100">
              Vartul Token (TWT) is a utility token for use within the vartul platform only. It is not meant for investment or external trading, use responsibly
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="px-6 py-12 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                  <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Welcome to new</span><br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">age of connection</span>
                </h1>
                <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
                  Experience the future of digital interaction with TWT tokens, powering the Vartul ecosystem.
                </p>
                <button 
                  onClick={() => {
                    alert("Getting started with TWT Token!");
                    navigate('/staking');
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg shadow-purple-900/30 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </button>
              </div>
              
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full bg-purple-900/30 flex items-center justify-center animate-pulse-slow">
                    <div className="w-48 h-48 rounded-full bg-purple-800/40 border border-purple-500/30 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-purple-700/50 border border-purple-400/30 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-purple-600/60 border border-purple-300/30"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dots and lines to simulate network visualization */}
                  <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-white shadow-lg shadow-purple-500/50 animate-ping-slow"></div>
                  <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-white shadow-lg shadow-purple-500/50 animate-ping-slow"></div>
                  <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-white shadow-lg shadow-purple-500/50 animate-ping-slow"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-white shadow-lg shadow-purple-500/50 animate-ping-slow"></div>
                  
                  {/* Connection lines */}
                  <div className="absolute inset-0 opacity-30">
                    <svg width="100%" height="100%" viewBox="0 0 200 200">
                      <line x1="50" y1="50" x2="150" y2="150" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1" />
                      <line x1="150" y1="50" x2="50" y2="150" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1" />
                      <line x1="100" y1="30" x2="100" y2="170" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1" />
                      <line x1="30" y1="100" x2="170" y2="100" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
                
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 border border-blue-500/40 rounded-lg p-5 shadow-xl shadow-blue-900/30 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-1">CLAIM REWARD WITH</h3>
                  <h3 className="text-xl font-bold text-white mb-4">YOUR EARN TOKEN</h3>
                  <div className="flex">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 shadow-lg"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 -ml-3 shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Marketplace Section */}
        <div className="px-6 py-12 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Marketplace</h2>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {marketplaceItems.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-900/10 group">
                <div className="relative">
                  <img src={item.image} alt={item.title} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                  <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center border border-gray-700 hover:bg-purple-600/80 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {item.id === 4 && (
                    <div className="absolute top-3 right-14 w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                      R
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-purple-300 font-medium mb-5">{item.price}</p>
                  <div className="flex justify-between">
                    <button 
                      onClick={() => alert(`Claiming ${item.title} with TWT tokens!`)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium py-2.5 px-5 rounded-lg shadow-lg shadow-blue-900/20 transition-all duration-300"
                    >
                      CLAIM NOW
                    </button>
                    <button 
                      onClick={() => navigate(`/marketplace/${item.id}`)}
                      className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2.5 px-5 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300"
                    >
                      KNOW MORE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right sidebar - similar to Homeright component */}
      <div className="hidden lg:block w-[350px] min-h-screen border-l border-gray-800 bg-black p-4">
        <div className="sticky top-0">
          {/* User Profile Section */}
          <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-white mb-3">Your TWT Balance</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Wallet className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Balance</p>
                <h2 className="text-2xl font-bold">{walletData.total.toLocaleString()} <span className="text-lg text-purple-400">TWT</span></h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 rounded-xl p-3 border border-green-500/20">
                <p className="text-gray-400 text-sm mb-1">Available</p>
                <p className="text-xl font-bold text-green-400">{walletData.available.toLocaleString()}</p>
              </div>
              <div className="bg-black/30 rounded-xl p-3 border border-blue-500/20">
                <p className="text-gray-400 text-sm mb-1">Staked</p>
                <p className="text-xl font-bold text-blue-400">{walletData.staked.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* Recent Rewards */}
          <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Gift className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-bold text-white">Recent Rewards</h3>
            </div>
            <div className="space-y-3">
              {recentRewards.slice(0, 3).map((reward, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{reward.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{reward.type}</p>
                      <p className="text-xs text-gray-400">{reward.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">+{reward.amount}</p>
                    <p className="text-xs text-gray-400">TWT</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="font-bold text-white">Tips</h3>
            </div>
            <div className="space-y-2">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-black/30 rounded-xl border border-yellow-500/20">
                  <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Twt_Token;