import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, RotateCcw } from 'lucide-react';
import GameCard from '../Components/GameCard';
import GameDetailsModal from '../Components/GameDetailsModal';

export default function PublicGamesPage() {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const filterOptions = [
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    { label: 'Recently Modified', value: 'date-mod-desc' },
    { label: 'Oldest Modified', value: 'date-mod-asc' },
    { label: 'Newest Added', value: 'date-add-desc' },
    { label: 'Oldest Added', value: 'date-add-asc' },
  ];

  const fetchGames = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/games');
      const data = await response.json();
      setGames(data);
    } catch (error) { console.error("Error fetching games:", error); }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) { console.error("Error fetching categories:", error); }
  }, []);

  useEffect(() => {
    fetchGames();
    fetchCategories();
  }, [fetchGames, fetchCategories]);

  const handleAction = (type, value) => {
    setIsLoading(true);
    setIsDropdownOpen(false);
    setIsFilterOpen(false);

    setTimeout(() => {
      if (type === 'category') setSelectedCategory(value);
      if (type === 'search') setActiveSearch(value);
      setIsLoading(false);
    }, 600);
  };

  const handleReset = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSearchTerm('');
      setActiveSearch('');
      setSelectedCategory(null);
      setSelectedFilter('');
      setIsLoading(false);
    }, 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAction('search', searchTerm);
    }
  };

  let filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory ? game.category === selectedCategory : true;
    const matchesSearch = 
        game.title?.toLowerCase().includes(activeSearch.toLowerCase()) || 
        game.description?.toLowerCase().includes(activeSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedFilter === 'name-asc') filteredGames.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  else if (selectedFilter === 'name-desc') filteredGames.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
  else if (selectedFilter === 'date-mod-asc') filteredGames.sort((a, b) => new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0));
  else if (selectedFilter === 'date-mod-desc') filteredGames.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  else if (selectedFilter === 'date-add-asc') filteredGames.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  else if (selectedFilter === 'date-add-desc') filteredGames.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return (
    <section className="relative my-12 mx-auto max-w-7xl px-4">
      <div className="flex h-[85vh] max-h-[900px] gap-5 overflow-hidden rounded-[40px] border border-gray-200/50 bg-[#F4F0EB] p-6 shadow-[inset_0_0_25px_rgba(0,0,0,0.08)]">
        <aside className="flex w-1/4 flex-col overflow-hidden rounded-[32px] bg-[#F4F0EB] p-1 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]">
          <div className="mb-6 rounded-[24px] bg-[#344C3D] p-6 text-white">
            <h2 className="text-lg font-bold">EDUCATIONAL GAMES SITES</h2>
            <p className="mt-1 text-xs text-white/70">Access all available educational games and their details.</p>
          </div>
          
          <div className="space-y-3">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="search..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyDown={handleKeyDown}
                className="w-full rounded-full border border-gray-300 bg-white pl-4 pr-20 py-2.5 text-[13px] outline-none" 
              />
              <button 
                onClick={() => handleAction('search', searchTerm)}
                className="absolute right-2 rounded-full bg-[#344C3D] px-4 py-1.5 text-sm font-semibold text-white hover:bg-opacity-90"
              >
                Search
              </button>
            </div>

            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between rounded-full border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#344C3D]">
                {selectedCategory || 'Categories'} <ChevronDown size={18} />
              </button>
              {isDropdownOpen && (
                <div className="absolute mt-2 w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl z-20">
                  <div onClick={() => handleAction('category', null)} className="cursor-pointer px-5 py-3 hover:bg-gray-50">All Categories</div>
                  {categories.map(cat => <div key={cat._id} onClick={() => handleAction('category', cat.name)} className="cursor-pointer px-5 py-3 hover:bg-gray-50">{cat.name}</div>)}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full flex items-center justify-between rounded-full border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#344C3D]">
                {selectedFilter ? filterOptions.find(f => f.value === selectedFilter)?.label : 'Filters'} <ChevronDown size={18} />
              </button>
              {isFilterOpen && (
                <div className="absolute mt-2 w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl z-10">
                  <div onClick={() => { setSelectedFilter(''); setIsFilterOpen(false); }} className="cursor-pointer border-b border-gray-50 px-5 py-3 hover:bg-gray-50">Clear Filters</div>
                  {filterOptions.map(opt => (
                    <div key={opt.value} onClick={() => { setSelectedFilter(opt.value); setIsFilterOpen(false); }} className="cursor-pointer px-5 py-3 hover:bg-gray-50">{opt.label}</div>
                  ))}
                </div>
              )}
            </div>

            <button 
                onClick={handleReset}
                className="mt-4 flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#344C3D]"
            >
                <RotateCcw size={16} /> Reset All Filters
            </button>
          </div>
        </aside>

        <main className="w-3/4 overflow-y-auto rounded-[32px] bg-[#E1C8BC] p-8 shadow-[inset_0_0_25px_rgba(0,0,0,0.08)]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <img src="/loading.gif" alt="Loading..." className="h-20 w-20" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGames.map((game) => (
                <GameCard 
                  key={game._id} 
                  title={game.title} 
                  description={game.description} 
                  imageSrc={game.imageUrl}
                  onVisit={() => setSelectedGame(game)}
                />
              ))}
            </div>
          )}
        </main>

        <GameDetailsModal 
          isOpen={!!selectedGame} 
          game={selectedGame} 
          onClose={() => setSelectedGame(null)} 
        />
      </div>
    </section>
  );
}