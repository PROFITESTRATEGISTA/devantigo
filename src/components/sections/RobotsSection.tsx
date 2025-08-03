import React, { useState, useEffect } from 'react';
import { Code2, Plus, Search, Clock, User, Edit2, Trash2, Download, Share2, Settings, Folder } from 'lucide-react';
import { useRobotStore } from '../../stores/robotStore';
import { useAuthStore } from '../../stores/authStore';

interface RobotsSectionProps {
  onNavigate: (path: string) => void;
}

export function RobotsSection({ onNavigate }: RobotsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { robots, loadRobots, isLoading } = useRobotStore();
  const { profile } = useAuthStore();

  useEffect(() => {
    loadRobots();
  }, [loadRobots]);

  // Filter robots based on search query
  const filteredRobots = robots.filter(robot => 
    robot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Meus Robôs</h2>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar robôs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => onNavigate('/robots')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white whitespace-nowrap flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Robô
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredRobots.length === 0 ? (
        <div className="text-center py-12">
          <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchQuery ? 'Nenhum robô encontrado' : 'Nenhum robô criado'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? `Nenhum robô corresponde à busca "${searchQuery}"`
              : 'Crie seu primeiro robô para começar'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => onNavigate('/robots')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Robô
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRobots.slice(0, 6).map((robot) => (
            <div 
              key={robot.id}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors cursor-pointer group"
              onClick={() => onNavigate(`/editor/${robot.id}`)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Folder className="w-8 h-8 text-blue-500 mr-3" />
                    <h3 className="text-lg font-semibold text-white">{robot.name}</h3>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit robot
                      }}
                      className="p-1 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Editar robô"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Share robot
                      }}
                      className="p-1 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Compartilhar robô"
                    >
                      <Share2 className="w-4 h-4 text-gray-400 hover:text-green-500" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-400 mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Atualizado {formatDate(robot.updated_at)}</span>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-400">{profile?.name || 'Você'}</span>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`/editor/${robot.id}?action=export`);
                      }}
                      className="p-1.5 hover:bg-gray-700 rounded text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Exportar robô"
                    >
                      <Download className="w-4 h-4 hover:text-blue-400" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Settings
                      }}
                      className="p-1.5 hover:bg-gray-700 rounded text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Configurações do robô"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredRobots.length > 6 && (
        <div className="text-center">
          <button
            onClick={() => onNavigate('/robots')}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
          >
            Ver Todos os Robôs ({robots.length})
          </button>
        </div>
      )}
    </div>
  );
}