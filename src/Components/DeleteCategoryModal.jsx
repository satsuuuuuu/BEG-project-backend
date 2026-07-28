export default function DeleteCategoryModal({ isOpen, onClose, onConfirm, category }) {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
      <div className="bg-[#F4F0EB] w-full max-w-sm rounded-[30px] p-8 shadow-2xl text-center">
        <h2 className="text-xl font-bold text-[#344C3D] mb-2">Remove Category?</h2>
        <p className="text-[#344C3D]/70 text-sm mb-6">
          This category has <strong>{category.count}</strong> items under it. Are you sure you want to remove it?
        </p>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => { onConfirm(category.id); onClose(); }} 
            className="w-full bg-red-500 text-white py-3 rounded-full font-bold hover:bg-red-600 transition"
          >
            REMOVE
          </button>
          <button 
            onClick={onClose} 
            className="w-full bg-transparent text-[#344C3D] py-3 rounded-full font-bold border border-[#344C3D]/20 hover:bg-[#344C3D]/5 transition"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}