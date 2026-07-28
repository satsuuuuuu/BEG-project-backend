export default function InfoBox() {
  return (
    // Added: flex, items-center, justify-center
    // Changed: p-8 to px-8 (keeps horizontal padding, removes vertical)
    <div className="h-[125px] flex items-center justify-center max-w-6xl mx-auto -mt-15 relative z-20 bg-[#F5F2EF] border border-gray-200 px-8 rounded-[50px] shadow-lg text-center hover:border-[#344C3D]/90 hover:border-4 transition">
      <p className="leading-relaxed font-md text-[#344C3D] font-semibold font-ancizar">
        THIS GAMIFICATION HUB PROVIDES INTERACTIVE TOOLS AND READY-MADE<br /> 
        GAMES TO ENHANCE YOUR TEACHING STRATEGIES <br />
        AT BASIAD ELEMENTARY SCHOOL.
      </p>
    </div>
  );
}