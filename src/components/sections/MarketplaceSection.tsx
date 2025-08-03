import React from 'react';
import { Store, Star } from 'lucide-react';

interface MarketplaceCompany {
  id: string;
  name: string;
  description: string;
  rating: number;
  strategies: number;
  logo: string;
  website?: string;
}

interface MarketplaceSectionProps {
  companies: MarketplaceCompany[];
}

export function MarketplaceSection({ companies }: MarketplaceSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Marketplace de Estratégias</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
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
            
            <button
              onClick={() => {
                if (company.website) {
                  window.open(company.website, '_blank');
                }
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              Conhecer Parceiro
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}