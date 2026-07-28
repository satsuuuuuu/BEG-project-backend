export default function ConfirmSaveModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-[#F4F0EB] w-full max-w-sm rounded-[30px] p-8 shadow-2xl">
        
        {/* Header Text */}
        <h2 className="text-2xl font-bold text-[#344C3D] mb-2 tracking-tight">
          Move to Trash?
        </h2>
        
        {/* Description Text */}
        <p className="text-[#344C3D]/80 mb-8 text-sm leading-relaxed">
          This action will move the game to the trash.
        </p>
        
        {/* Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 rounded-full border-2 border-[#344C3D] font-bold text-[#344C3D] hover:bg-[#344C3D]/5 transition"
          >
            CANCEL
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-3 rounded-full bg-[#344C3D] text-white font-bold hover:bg-[#2a3d31] transition"
          >
            MOVE
          </button>
        </div>
      </div>
    </div>
  );
}