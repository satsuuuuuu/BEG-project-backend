// src/Components/ViewGameModal.jsx
import { X, Trash2, Edit2, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
// Assuming you have a standard Confirm modal component, 
// or you can create a simple one like the one I've shown below.
import ConfirmDeleteModal from './ConfirmDeleteModal'; 

export default function ViewGameModal({ isOpen, game, onClose, onEdit }) {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // New state

  if (!isOpen || !game) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(game.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/games/${game._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true })
      });
      if (response.ok) {
        setShowDeleteConfirm(false);
        onClose();
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Error soft-deleting game:", error);
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-[#F4F0EB] w-full max-w-md rounded-[40px] p-8 shadow-2xl relative border border-gray-200/50 animate-in fade-in zoom-in duration-200">
          
          <button onClick={onClose} className="absolute top-6 right-6 text-[#344C3D] hover:text-red-500 transition">
            <X size={24} color="#00000" />
          </button>

          <div className="w-full aspect-square rounded-[30px] overflow-hidden bg-white mb-6 shadow-inner">
            <img src={game.imageUrl || 'https://placehold.co/400x400/e8eae6/344c3d?text=No+Image'} alt={game.title} className="w-full h-full object-cover" />
          </div>

          <h2 className="text-2xl font-bold text-[#344C3D] uppercase leading-tight mb-2">
            {game.title || 'Untitled Game'}
          </h2>
          
          <div className="text-[10px] uppercase tracking-widest text-[#344C3D]/50 font-bold mb-4">
            Category: {game.category || 'Uncategorized'}
          </div>

          <p className="text-[#344C3D]/70 text-sm mb-8 leading-relaxed">
            {game.description || 'No description provided.'}
          </p>

          <div className="flex items-center gap-2 border-t border-[#344C3D]/10 pt-6">
            <button 
              onClick={handleCopyLink}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm transition ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 text-[#344C3D] hover:bg-gray-300'}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            <button 
              onClick={onEdit} 
              className="flex-1 flex items-center justify-center gap-2 bg-[#344C3D] text-white py-3 rounded-full font-bold hover:bg-[#2a3d31] transition text-sm"
            >
              <Edit2 size={16} /> Edit
            </button>

            <button 
              onClick={() => setShowDeleteConfirm(true)} // Opens the modal
              className="flex items-center justify-center bg-red-100 text-red-600 p-3 rounded-full font-bold hover:bg-red-200 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <a 
            href={game.link?.startsWith('http') ? game.link : `https://${game.link}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-4 w-full flex items-center justify-center gap-2 text-[#344C3D]/50 text-xs hover:text-[#344C3D] transition"
          >
            <ExternalLink size={14} /> View Original Source
          </a>
        </div>
      </div>
    </>
  );
}