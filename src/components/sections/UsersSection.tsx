import React, { useState } from 'react';
import { Users, MapPin, Star, MessageSquare, Search, Share2, BarChart2, Bot } from 'lucide-react';
import { useLanguageStore } from '../../stores/languageStore';

interface User {
  id: string;
  name: string;
  location: string;
  rating: number;
  strategies: number;
  avatar: string;
  specialty: string;
}

interface UsersSectionProps {
  users: User[];
}

export function UsersSection({ users }: UsersSectionProps) {
  const { t } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [shareType, setShareType] = useState<'analysis' | 'robot'>('analysis');

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShareAnalysis = (user: User) => {
    setSelectedUser(user);
    setShareType('analysis');
    setShowShareModal(true);
  };

  const handleShareRobot = (user: User) => {
    setSelectedUser(user);
    setShareType('robot');
    setShowShareModal(true);
  };

  const handleShare = () => {
    if (!selectedUser) return;
    
    const message = shareType === 'analysis' 
      ? `Olá ${selectedUser.name}! Gostaria de compartilhar uma análise de backtest com você através do DevHub Trader.`
      : `Olá ${selectedUser.name}! Gostaria de compartilhar um robô de trading com você através do DevHub Trader.`;
    
    // Here you would implement the actual sharing logic
    console.log(`Sharing ${shareType} with ${selectedUser.name}`);
    
    // Show success message
    alert(`${shareType === 'analysis' ? 'Análise' : 'Robô'} compartilhado com ${selectedUser.name}!`);
    setShowShareModal(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">{t('users.title')}</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('users.searchUsers')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">{t('users.noUsers')}</h3>
            <p className="text-gray-500">
              {searchQuery ? `${t('users.noUsersSearch')} "${searchQuery}"` : t('users.subtitle')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-8 h-8 text-blue-400" />
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-1">{user.name}</h3>
                <p className="text-sm text-blue-400 mb-2">{user.specialty}</p>
                
                <div className="flex items-center justify-center text-xs text-gray-400 mb-3">
                  <MapPin className="w-3 h-3 mr-1" />
                  {user.location}
                </div>
                
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-1.5 py-0.5 rounded text-xs font-bold mr-1 flex items-center">
                      <span className="text-xs font-black">Q</span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500 leading-none">QUANT</span>
                    <span className="text-sm font-bold text-blue-400">{user.rating.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {user.strategies} {t('marketplace.strategies')}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t('users.connect')}
                  </button>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleShareAnalysis(user)}
                      className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm transition-colors flex items-center justify-center"
                      title={t('users.shareAnalysis')}
                    >
                      <BarChart2 className="w-3 h-3 mr-1" />
                      {t('analyses.title').split(' ')[0]}
                    </button>
                    <button 
                      onClick={() => handleShareRobot(user)}
                      className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm transition-colors flex items-center justify-center"
                      title={t('users.shareRobot')}
                    >
                      <Bot className="w-3 h-3 mr-1" />
                      {t('nav.robots').split(' ')[1] || 'Robot'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                {shareType === 'analysis' ? (
                  <BarChart2 className="w-12 h-12 text-green-500" />
                ) : (
                  <Bot className="w-12 h-12 text-purple-500" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-100">
                {t('button.share')} {shareType === 'analysis' ? t('analyses.title').split(' ')[0] : t('nav.robots').split(' ')[1]}
              </h2>
              <p className="mt-2 text-gray-400">
                {t('button.share')} {t('users.connect').toLowerCase()} {selectedUser.name}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-400">{selectedUser.specialty}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedUser.location}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('share.permission')}
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="view"
                      name="permission"
                      defaultChecked
                      className="sr-only"
                    />
                    <div className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm">
                      {t('share.viewOnly')}
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="edit"
                      name="permission"
                      className="sr-only"
                    />
                    <div className="px-3 py-1.5 rounded bg-gray-700 text-gray-300 text-sm">
                      {t('share.canEdit')}
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                >
                  {t('button.cancel')}
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {t('button.share')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}