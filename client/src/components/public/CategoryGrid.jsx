import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, 
  Wallet, 
  Dog, 
  FileText, 
  Watch, 
  Glasses, 
  Key, 
  ShoppingBag, 
  Shirt, 
  Grid 
} from 'lucide-react';

const categories = [
  { name: 'Electronics', icon: Smartphone, color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30', count: '340+ items' },
  { name: 'Wallets & Purses', icon: Wallet, color: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30', count: '215+ items' },
  { name: 'Pets', icon: Dog, color: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30', count: '90+ active' },
  { name: 'Documents & IDs', icon: FileText, color: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30', count: '180+ items' },
  { name: 'Jewelry & Watches', icon: Watch, color: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30', count: '130+ items' },
  { name: 'Accessories', icon: Glasses, color: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30', count: '160+ items' },
  { name: 'Vehicles & Keys', icon: Key, color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30', count: '290+ items' },
  { name: 'Bags & Backpacks', icon: ShoppingBag, color: 'bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/30', count: '145+ items' },
  { name: 'Clothing', icon: Shirt, color: 'bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-500/30', count: '75+ items' },
  { name: 'Other', icon: Grid, color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700', count: '110+ items' },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/browse?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-16 bg-white dark:bg-slate-900/40 border-t border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Explore Popular Categories
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
            Browse through organized categories to find lost possessions faster or report found items
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative p-5 bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/40 rounded-2xl transition-all duration-300 text-left flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {cat.count}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;
