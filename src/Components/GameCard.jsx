// src/Components/GameCard.jsx
export default function GameCard({ title, description, imageSrc, isActive, onVisit }) {
  const activeClasses = isActive 
    ? "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 scale-[2] shadow-2xl w-64" 
    : "relative w-full hover:-translate-y-5";

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-3 cursor-pointer transition-all duration-700 ease-in-out will-change-transform flex flex-col h-full ${activeClasses}`}>
      <div className="aspect-square w-full overflow-hidden rounded-xl">
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
      </div>
      
      <div className="mt-4 px-1 flex flex-col flex-1">
        <h3 className="font-bold text-[#344C3D] text-lg line-clamp-2 leading-tight">{title}</h3>
        <p className="text-sm text-[#344C3D]/70 uppercase tracking-wide mt-1 line-clamp-2 flex-1">{description}</p>
        
        {/* Visit Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onVisit(); }}
          className="w-full mt-4 bg-[#344C3D] text-white py-2 rounded-xl text-sm font-bold hover:bg-[#2a3d31] transition"
        >
          VISIT
        </button>
      </div>
    </div>
  );
}