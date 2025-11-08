import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Clock, Award, Users, ChevronRight, Search, Bell } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Chart data for wallet balance trend
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'TWT Balance',
        data: [9500, 10200, 9800, 11500, 10800, 12345],
        borderColor: 'rgb(138, 43, 226)',
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(138, 43, 226, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
  };

  // Doughnut chart data
  const createDoughnutData = (value, color) => {
    return {
      labels: ['Completed', 'Remaining'],
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: [color, 'rgba(255, 255, 255, 0.1)'],
          borderWidth: 0,
          cutout: '75%',
        },
      ],
    };
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  // Recent activity data
  const recentActivity = [
    { type: 'Post watched', amount: '+10 TWT', time: '2h ago' },
    { type: 'Bonus token', amount: '+15 TWT', time: '5h ago' },
    { type: 'TWT staked', amount: '+25 TWT', time: '1d ago' },
    { type: 'Creator payout', amount: '+45 TWT', time: '2d ago' },
    { type: 'On-Chain transaction ID', amount: '60000 (Unconfirmed)', time: '3d ago' },
  ];

  // Top creators data
  const topCreators = [
    { name: 'GURU', avatar: 'G' },
    { name: 'Alperk', avatar: 'A' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar - can be used for navigation */}
      <div className="hidden md:block w-64 border-r border-gray-800 p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-purple-500">VARTUL</h1>
        </div>
        <nav className="space-y-2">
          <div className="flex items-center gap-3 p-2 bg-purple-900/30 rounded-lg text-purple-300">
            <TrendingUp className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-3 p-2 text-gray-400 hover:bg-gray-800/30 rounded-lg cursor-pointer">
            <Users className="w-5 h-5" />
            <span>Community</span>
          </div>
          <div className="flex items-center gap-3 p-2 text-gray-400 hover:bg-gray-800/30 rounded-lg cursor-pointer">
            <Award className="w-5 h-5" />
            <span>Rewards</span>
          </div>
          <div className="flex items-center gap-3 p-2 text-gray-400 hover:bg-gray-800/30 rounded-lg cursor-pointer">
            <Clock className="w-5 h-5" />
            <span>Activity</span>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="w-full border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search for creator or news" 
              className="w-full bg-gray-800/50 text-sm rounded-md py-2 pl-10 pr-4 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <span className="text-sm hidden sm:inline">Profile</span>
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* TWT Overview Section */}
        <div className="bg-gradient-to-br from-purple-900/20 to-black rounded-xl p-6 border border-purple-500/20">
          <h2 className="text-xl font-bold mb-4">TWT Overview</h2>
          
          <div className="mb-6">
            <p className="text-sm text-gray-400">Wallet balance</p>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">12,345</span>
              <span className="ml-1 text-lg font-medium">TWT</span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm mb-4">
            <div>
              <p className="text-gray-400">4 days - staked TWT</p>
              <p className="font-medium">1,520.48</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Reward Generated</p>
              <p className="font-medium">350 TWT</p>
            </div>
          </div>
          
          <div className="flex justify-between text-sm mb-6">
            <div>
              <p className="text-gray-400">This Week</p>
              <p className="font-medium">1245 TWT</p>
            </div>
          </div>
          
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200 text-center">
            claim reward
          </button>
        </div>
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-gradient-to-br from-purple-900/10 to-black rounded-xl p-6 border border-purple-500/20 relative">
          <div className="absolute top-4 right-4 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            R
          </div>
          <div className="h-64">
            <Line data={lineChartData} options={lineOptions} />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 relative">
                <Doughnut data={createDoughnutData(65, 'rgba(138, 43, 226, 0.8)')} options={doughnutOptions} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">65%</span>
                </div>
              </div>
              <p className="text-sm text-center mt-2">Staked</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 relative">
                <Doughnut data={createDoughnutData(48, 'rgba(59, 130, 246, 0.8)')} options={doughnutOptions} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">48%</span>
                </div>
              </div>
              <p className="text-sm text-center mt-2">Claimed</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 relative">
                <Doughnut data={createDoughnutData(82, 'rgba(16, 185, 129, 0.8)')} options={doughnutOptions} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">82%</span>
                </div>
              </div>
              <p className="text-sm text-center mt-2">Earn</p>
            </div>
          </div>
        </div>
        
        {/* Recent Activity Section */}
        <div className="bg-gradient-to-br from-purple-900/10 to-black rounded-xl p-6 border border-purple-500/20">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <div>
                    <p className="text-sm font-medium">{activity.type}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
                <div className={`text-sm ${activity.amount.startsWith('+') ? 'text-green-400' : 'text-gray-300'}`}>
                  {activity.amount}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">60000 (Unconfirmed)</p>
          </div>
        </div>
        
        {/* Insights Section */}
        <div className="lg:col-span-2 bg-gradient-to-br from-purple-900/10 to-black rounded-xl p-6 border border-purple-500/20">
          <h2 className="text-xl font-bold mb-4">Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Top Creators</h3>
              <p className="text-sm text-gray-400 mb-2">This week</p>
              
              <div className="space-y-3">
                {topCreators.map((creator, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                      {creator.avatar}
                    </div>
                    <span className="text-sm">{creator.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Trending Categories</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Entertainment</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">NEWS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-2">
        <div className="flex justify-around">
          <div className="flex flex-col items-center p-2 text-purple-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </div>
          <div className="flex flex-col items-center p-2 text-gray-400">
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Community</span>
          </div>
          <div className="flex flex-col items-center p-2 text-gray-400">
            <Award className="w-5 h-5" />
            <span className="text-xs mt-1">Rewards</span>
          </div>
          <div className="flex flex-col items-center p-2 text-gray-400">
            <Clock className="w-5 h-5" />
            <span className="text-xs mt-1">Activity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;