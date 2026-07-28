// src/Components/RecentlyDeletedModal.jsx
import { useState } from 'react';
import { X, RotateCcw, Trash2 } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal'; // Import the new component

export default function RecentlyDeletedModal({ isOpen, onClose, trashGames, onRestore, onEmptyTrash }) {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, id: null });

  if (!isOpen) return null;

  const handleAction = () => {
    if (confirmModal.type === 'restore') onRestore(confirmModal.id);
    if (confirmModal.type === 'empty') onEmptyTrash();
    setConfirmModal({ isOpen: false, type: null, id: null });
  };

  return (
    <>
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'restore' ? "RESTORE ITEM?" : "EMPTY TRASH?"}
        message={confirmModal.type === 'restore' 
          ? "Are you sure you want to restore this item to your active game list?" 
          : "Are you sure you want to permanently delete all items in the trash?"}
        onCancel={() => setConfirmModal({ isOpen: false, type: null, id: null })}
        onConfirm={handleAction}
      />

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-[#E8EAE6] w-full max-w-2xl rounded-[40px] p-8 shadow-2xl relative border border-gray-200/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#344C3D]">Recently Deleted</h2>
            <button onClick={onClose} className="text-[#344C3D] hover:text-red-500 transition"><X size={24} /></button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            {trashGames.length === 0 ? (
              <p className="text-center py-10 text-[#344C3D]/50">Trash is empty.</p>
            ) : (
              trashGames.map((game) => (
                <div key={game._id} className="bg-white p-4 rounded-[30px] shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-[20px] overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={game.imageUrl || 'https://placehold.co/100x100'} alt={game.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-bold text-[#344C3D] uppercase leading-tight line-clamp-2">{game.title}</h3>
                    <p className="text-sm text-[#344C3D]/70 mt-1 leading-snug line-clamp-2">{game.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setConfirmModal({ isOpen: true, type: 'restore', id: game._id })} 
                      className="p-2 bg-[#344C3D] text-white rounded-full hover:bg-[#2a3d31] transition"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {trashGames.length > 0 && (
            <button 
              onClick={() => setConfirmModal({ isOpen: true, type: 'empty' })} 
              className="w-full mt-6 py-3 border-2 border-red-200 text-red-500 rounded-full font-bold hover:bg-red-50 transition text-sm flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Empty Trash
            </button>
          )}
        </div>
      </div>
    </>
  );
}