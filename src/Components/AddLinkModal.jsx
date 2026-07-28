// src/Components/AddLinkModal.jsx
import { useState } from 'react';

export default function AddLinkModal({ isOpen, onClose, onProceed }) {
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!link) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/fetch-metadata?url=${encodeURIComponent(link)}`);
      const data = await response.json();
      onProceed({ ...data, link }); 
    } catch (error) {
      alert("Could not fetch link details. Please fill manually.");
      onProceed({ link, title: '', description: '', imageUrl: '' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Changed z-50 to z-[100] so it sits above all dropdowns and menus
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#F4F0EB] w-full max-w-lg rounded-[30px] p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-[#344C3D] mb-2 tracking-tight">ADD NEW WEBSITE</h2>
        <p className="text-[#344C3D]/70 text-sm mb-8">Enter the link to auto-fetch details.</p>
        
        <input
          type="text"
          placeholder="Paste link.."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-4 rounded-full border border-gray-200 mb-8 outline-none"
        />

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 rounded-full font-bold text-[#344C3D] border border-[#344C3D]/20">CANCEL</button>
          <button onClick={handleFetch} className="flex-1 py-3 rounded-full font-bold text-white bg-[#344C3D] hover:bg-[#2a3d31]">
            {loading ? "FETCHING..." : "PROCEED"}
          </button>
        </div>
      </div>
    </div>
  );
}