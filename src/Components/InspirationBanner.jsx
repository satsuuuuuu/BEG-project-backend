// src/Components/InspirationBanner.jsx

export default function InspirationBanner() {
  return (
    // Increased h-[300px] or adjust as needed
    <div className="max-w-7xl mx-auto my-12 h-[210px] flex rounded-[60px] overflow-hidden shadow-lg relative bg-[#344C3D]">
      
      {/* LEFT SIDE: Text Area (Increased width to 65%) */}
      <div className="w-[65%] flex items-center p-12 relative z-10">
        <h2 className="text-white text-3xl md:text-4xl font-bold italic font-ancizar leading-tight">
          SMALL STEPS IN LEARNING LEAD<br />TO GREAT ACCOMPLISHMENTS
        </h2>
      </div>

      {/* GRADIENT TRANSITION (Shifted to match new width) */}
      <div className="absolute left-[55%] top-0 bottom-0 w-[20%] bg-gradient-to-r from-[#344C3D] to-transparent z-10" />

      {/* RIGHT SIDE: Image Area */}
      <div className="w-[45%] absolute right-0 top-0 bottom-0 -z-0">
        <img 
          src="/student.png" 
          alt="Students in classroom" 
          className="w-full h-full object-cover" 
        />
      </div>
      
    </div>
  );
}