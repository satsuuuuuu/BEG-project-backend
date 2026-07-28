// src/Components/TrendingGames.jsx
import { useState, useEffect } from 'react';
import GameCard from './GameCard';
import GameDetailsModal from './GameDetailsModal';

export default function TrendingGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games');
        const data = await response.json();

        const sortedGames = [...data].sort((a, b) => {
          if ((b.views || 0) !== (a.views || 0)) {
            return (b.views || 0) - (a.views || 0);
          }
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        setGames(sortedGames.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending games:", error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <section className="relative my-12 mx-auto max-w-7xl px-6 bg-[#F4F0EB] rounded-2xl pb-8">
      
      <div className="mb-4 pt-6">
        <h2 className="text-2xl font-bold text-[#344C3D] font-ancizar">
            {loading ? "LOADING TRENDING..." : "TRENDING GAMES"}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.length > 0 ? (
          games.map((game, index) => (
            <div 
              key={game._id || index} 
              className="cursor-pointer"
            >
              <GameCard 
                title={game.title} 
                description={game.description} 
                imageSrc={game.imageUrl || '/placeholder.png'} 
                // Removed isActive prop here
                onVisit={() => setSelectedGame(game)}
              />
            </div>
          ))
        ) : (
            <p className="col-span-4 text-center text-gray-500">No games available at the moment.</p>
        )}
      </div>

      <GameDetailsModal 
        isOpen={!!selectedGame} 
        game={selectedGame} 
        onClose={() => setSelectedGame(null)} 
      />
    </section>
  );
}