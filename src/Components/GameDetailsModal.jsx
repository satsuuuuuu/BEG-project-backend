// src/Components/GameDetailsModal.jsx
import { X, Copy, ExternalLink } from 'lucide-react';

export default function GameDetailsModal({ isOpen, onClose, game }) {
  if (!isOpen || !game) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(game.link);
    alert("Link copied to clipboard!");
  };

  const handleView = () => {
    window.open(game.link, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#F4F0EB] p-6 rounded-[40px] w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="w-full aspect-video rounded-3xl overflow-hidden mb-6">
          <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
        </div>
        
        <h2 className="text-2xl font-bold text-[#344C3D]">{game.title}</h2>
        <p className="text-sm text-[#344C3D]/60 uppercase font-semibold mt-1">Category: {game.category || 'Uncategorized'}</p>
        <p className="text-[#344C3D] mt-4">{game.description}</p>
        
        <div className="mt-8 flex gap-3">
          <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2 bg-gray-200 py-3 rounded-full font-bold text-[#344C3D] hover:bg-gray-300 transition">
            <Copy size={18} /> Copy
          </button>
          <button onClick={handleView} className="flex-1 flex items-center justify-center gap-2 bg-[#344C3D] py-3 rounded-full font-bold text-white hover:bg-[#2a3d31] transition">
            <ExternalLink size={18} /> View Website
          </button>
        </div>
      </div>
    </div>
  );
}