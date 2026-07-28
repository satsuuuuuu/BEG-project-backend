// src/Components/LoadingPopup.jsx
export default function LoadingPopup() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* The Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#344C3D]"></div>
        <p className="text-[#344C3D] font-bold tracking-widest animate-pulse">LOADING...</p>
      </div>
    </div>
  );
}