// src/Components/VisitWebsiteModal.jsx
export default function VisitWebsiteModal({ isOpen, onClose, url }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#E8EAE6]/80 backdrop-blur-sm p-4">
      <div className="bg-[#F4F0EB] p-8 rounded-[40px] shadow-xl border border-gray-200 w-full max-w-sm">
        <h2 className="text-xl font-bold text-[#344C3D] mb-2">Visit External Link</h2>
        <p className="text-[#344C3D]/70 text-sm mb-6 break-words">
          You are about to leave your dashboard to visit: 
          <span className="font-semibold block mt-1 text-[#344C3D]">{url}</span>
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 rounded-full border border-[#344C3D]/20 text-[#344C3D] font-semibold hover:bg-[#344C3D]/5 transition"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              window.open(url, '_blank', 'noopener,noreferrer');
              onClose();
            }} 
            className="flex-1 py-3 rounded-full bg-[#344C3D] text-white font-semibold hover:bg-[#2a3d31] transition shadow-md"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}