import React from 'react';
import { Users, MapPin, Star, MessageSquare } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Comunidade de Usuários</h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white">
          Conectar
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-1">{user.name}</h3>
            <p className="text-sm text-blue-400 mb-2">{user.specialty}</p>
            
            <div className="flex items-center justify-center text-xs text-gray-400 mb-3">
              <MapPin className="w-3 h-3 mr-1" />
              {user.location}
            </div>
            
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-sm text-gray-400">{user.rating.toFixed(1)}</span>
              </div>
              <div className="text-sm text-gray-400">
                {user.strategies} estratégias
              </div>
            </div>
            
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center justify-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Conectar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}