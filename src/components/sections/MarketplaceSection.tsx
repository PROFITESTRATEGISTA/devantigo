import React from 'react';
import { Store, Star, DollarSign, Download } from 'lucide-react';

interface MarketplaceCompany {
  id: string;
  name: string;
  description: string;
  rating: number;
  strategies: number;
  price: string;
  logo: string;
}

interface MarketplaceSectionProps {
  companies: MarketplaceCompany[];
}

export function MarketplaceSection({ companies }: MarketplaceSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Marketplace de Estratégias</h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white">
          Vender Estratégia
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-400">{company.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-4">{company.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-400">
                <Download className="w-4 h-4 mr-1" />
                {company.strategies} estratégias
              </div>
              <div className="flex items-center text-lg font-bold text-green-400">
                <DollarSign className="w-4 h-4 mr-1" />
                {company.price}
              </div>
            </div>
            
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
              Ver Estratégias
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}