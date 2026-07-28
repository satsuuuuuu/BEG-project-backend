// src/Components/ConfirmSaveModal.jsx
export default function ConfirmSaveModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F4F0EB] w-full max-w-sm rounded-[30px] p-8 shadow-2xl text-center">
        <h2 className="text-xl font-bold text-[#344C3D] mb-4">Are you sure?</h2>
        <p className="text-[#344C3D]/70 mb-8 text-sm">Do you want to save this new game to the collection?</p>
        
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 rounded-full border border-[#344C3D]/20 font-bold text-[#344C3D]">CANCEL</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-full bg-[#344C3D] text-white font-bold">YES, SAVE</button>
        </div>
      </div>
    </div>
  );
}