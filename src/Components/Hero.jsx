export default function Hero() {
  return (
    <div className="relative h-[600px] mx-8 rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center text-white">
      {/* Background Image with Overlay */}
      <img src="/bg.png" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/10 " /> 

      {/* Content */}
      <div className="relative z-10 space-y-4">
        <p className="uppercase tracking-widest text-[30px] text-gray-200 font-ancizar">Welcome to</p>
        <h1 className="text-6xl font-ancizar font-bold">BASIAD ELEMENTARY SCHOOL<br />GAMIFICATION HUB</h1>
        <p className="text-lg text-gray-200 font-ancizar ">EMPOWERING LEARNING THROUGH INNOVATION.</p>
        <button className="bg-[#F8F1EE] text-[#344C3D] px-8 py-2 border-2 shadow-black/40 shadow-lg border-[#344C3D] rounded-full font-ancizar  hover:bg-[#BFCFBB]/30 hover:text-white hover:border-white/40 transition">
          DIVE IN
        </button>
      </div>
    </div>
  );
}