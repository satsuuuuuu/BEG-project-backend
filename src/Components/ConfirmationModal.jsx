// src/Components/ConfirmationModal.jsx
export default function ConfirmationModal({ isOpen, title, message, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[#F4F0EB] w-full max-w-sm rounded-[40px] p-8 shadow-2xl border border-gray-200/50">
        <h2 className="text-3xl font-bold text-[#344C3D] mb-3">{title}</h2>
        <p className="text-[#344C3D]/80 mb-8">{message}</p>
        
        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 rounded-full border-2 border-[#344C3D] text-[#344C3D] font-bold hover:bg-[#344C3D]/5 transition"
          >
            CANCEL
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 rounded-full bg-[#344C3D] text-white font-bold hover:bg-[#2a3d31] transition"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
}