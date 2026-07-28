// src/Components/ConfirmEditModal.jsx
export default function ConfirmEditModal({ isOpen, onClose, onProceed }) {
  if (!isOpen) return null;

  return (
    // Changed z-[120] to z-[200]
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#F4F0EB] p-8 rounded-[40px] shadow-2xl border border-gray-200 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-[#344C3D] mb-2">EDIT DETAILS?</h2>
        <p className="text-[#344C3D]/70 mb-8">Update the website's information</p>
        
        <div className="flex gap-4">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 rounded-full border border-[#344C3D] text-[#344C3D] font-bold hover:bg-white transition"
          >
            CANCEL
          </button>
          <button 
            onClick={onProceed} 
            className="flex-1 py-3 rounded-full bg-[#344C3D] text-white font-bold hover:bg-[#2a3d31] transition"
          >
            PROCEED
          </button>
        </div>
      </div>
    </div>
  );
}