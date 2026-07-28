import { useState, useEffect, useRef } from 'react';
import { ChevronDown, RefreshCw, CirclePlus, CircleMinus, Upload } from 'lucide-react';
import VisitWebsiteModal from './VisitWebsiteModal';
import ConfirmEditModal from './ConfirmEditModal'; 

export default function EditGameModal({ isOpen, onClose, game }) {
  const [formData, setFormData] = useState({
    link: '',
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    filter: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Integration: Confirm Modal State

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (game) {
      setFormData({
        link: game.link || '',
        title: game.title || '',
        description: game.description || '',
        imageUrl: game.imageUrl || '',
        category: game.category || '',
        filter: game.filter || ''
      });
    }
  }, [game]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async (e) => {
    e.stopPropagation();
    if (!newCategory.trim()) return;
    await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory })
    });
    setNewCategory('');
    fetchCategories();
  };

  const handleDeleteCategory = async (e, id) => {
    e.stopPropagation();
    await fetch(`http://localhost:5000/api/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  const handleAutoFetch = async () => {
    if (!formData.link) return;
    let targetUrl = formData.link;
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

    setLoading(true);
    try {
        const response = await fetch(`http://localhost:5000/api/fetch-metadata?url=${encodeURIComponent(targetUrl)}`);
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        setFormData(prev => ({ ...prev, title: data.title || prev.title, description: data.description || prev.description, imageUrl: data.imageUrl || prev.imageUrl }));
    } catch (error) {
        alert("Failed to scrape: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
  // Optional: Set a loading state here if you have one, e.g., setLoading(true);

  try {
    const response = await fetch(`http://localhost:5000/api/games/${game._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    // Check if the server returned an error (e.g., 400 or 500)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update game");
    }

    // Success
    alert("Game updated successfully!");
    onClose();
    window.location.reload(); 
    
  } catch (error) {
    // This will now catch and display actual server errors
    console.error("Error saving game:", error);
    alert(`Could not save changes: ${error.message}`);
  } finally {
    // Optional: Reset loading state here, e.g., setLoading(false);
  }
};

  if (!isOpen || !game) return null;

  return (
    <>
      <VisitWebsiteModal 
        isOpen={visitModalOpen} 
        onClose={() => setVisitModalOpen(false)} 
        game={{ link: formData.link, title: formData.title }} 
      />

      {/* Integration: Confirmation Modal */}
{/* Confirmation Modal - Safely rendered */}
      {showConfirm && (
        <ConfirmEditModal 
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onProceed={() => {
              handleSave();
              setShowConfirm(false);
          }}
        />
      )}

      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150] p-4">
        <div className="bg-[#F4F0EB] w-full max-w-lg rounded-[30px] p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-[#344C3D] mb-6 tracking-tight">EDIT GAME</h2>

          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
                <input name="link" value={formData.link} onChange={handleChange} placeholder="Paste link.." className="w-full p-4 pr-12 rounded-full bg-white border border-gray-200 mb-1 outline-none" />
                <button onClick={handleAutoFetch} className="absolute right-4 top-4 text-[#344C3D]/40 hover:text-[#344C3D] transition">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>
            <button 
                onClick={() => setVisitModalOpen(true)}
                className="bg-[#344C3D] text-white px-6 py-4 rounded-full font-bold hover:bg-[#2a3d31] transition whitespace-nowrap"
            >
                VISIT
            </button>
          </div>
          <span className="text-[10px] uppercase text-[#344C3D]/60 ml-4 mb-4 block">website link</span>

          <input name="title" value={formData.title} onChange={handleChange} placeholder="WORLDWALL" className="w-full p-4 rounded-full bg-white border border-gray-200 mb-1 outline-none font-bold text-[#344C3D]" />
          <span className="text-[10px] uppercase text-[#344C3D]/60 ml-4 mb-4 block">website name</span>

          <div className="flex gap-4 mb-4">
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description..." className="w-1/2 h-40 p-4 rounded-[20px] bg-white border border-gray-200 outline-none resize-none text-sm" />
            
            <div className="w-1/2 h-40 bg-white rounded-[20px] border border-gray-200 overflow-hidden relative group">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                {formData.imageUrl ? (
                    <>
                        <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button onClick={() => fileInputRef.current.click()} className="text-white text-xs font-bold">CHANGE</button>
                        </div>
                    </>
                ) : (
                    <button onClick={() => fileInputRef.current.click()} className="w-full h-full flex flex-col items-center justify-center text-[#344C3D]/40 hover:text-[#344C3D]">
                        <Upload size={24} className="mb-2" />
                        <span className="text-xs uppercase font-bold">Add Image</span>
                    </button>
                )}
            </div>
          </div>
          <div className="flex justify-between px-4 mb-6">
            <span className="text-[10px] uppercase text-[#344C3D]/60">website description</span>
            <span className="text-[10px] uppercase text-[#344C3D]/60">website thumbnail</span>
          </div>

          <div className="relative mb-3 z-50">
            <div 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)} 
              className="w-full flex items-center justify-between bg-white px-5 py-4 rounded-full border border-gray-200 text-[#344C3D] cursor-pointer"
            >
              {formData.category || "Select Category"} 
              <ChevronDown size={20} className="text-[#344C3D]/70" />
            </div>
            <span className="text-[10px] uppercase text-[#344C3D]/60 ml-4 mt-2 block">Category</span>

            {isCategoryOpen && (
              <div className="absolute w-full mt-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div 
                  onClick={() => { setFormData({...formData, category: ''}); setIsCategoryOpen(false); }} 
                  className="px-5 py-4 cursor-pointer hover:bg-gray-50 text-[#344C3D]"
                >
                  No particular category
                </div>
                
                {categories.map((cat) => (
                  <div 
                    key={cat._id} 
                    onClick={() => { setFormData({...formData, category: cat.name}); setIsCategoryOpen(false); }} 
                    className="px-5 py-4 flex justify-between items-center hover:bg-gray-50 text-[#344C3D] cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    {isEditMode && (
                      <button 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            handleDeleteCategory(e, cat._id); 
                        }} 
                        className="text-red-400"
                      >
                        <CircleMinus size={20}/>
                      </button>
                    )}
                  </div>
                ))}
                
                <div className="px-4 py-3 bg-gray-50 flex items-center gap-2">
                  <input 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    placeholder="Add new category" 
                    className="bg-transparent text-sm w-full outline-none text-[#344C3D]" 
                  />
                  <button type="button" onClick={handleAddCategory} className="hover:scale-110 transition-transform">
                    <CirclePlus size={20} className="text-[#344C3D]/50" />
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setIsEditMode(!isEditMode); }} className="text-[10px] text-gray-400 uppercase hover:text-[#344C3D]">Edit</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative mb-8">
            <select name="filter" value={formData.filter} onChange={handleChange} className="w-full p-4 rounded-full bg-white border border-gray-200 appearance-none text-[#344C3D]/60 outline-none">
                <option value="">Filters</option>
                <option value="newest">Newest</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 text-[#344C3D]/60" pointerEvents="none" size={20} />
          </div>

          <div className="flex flex-col gap-2">
            {/* Integration: Click opens the confirm modal */}
            <button onClick={() => setShowConfirm(true)} className="w-full bg-[#344C3D] text-white py-3 rounded-full font-bold hover:bg-[#2a3d31] transition">SAVE CHANGES</button>
            <button onClick={onClose} className="w-full bg-transparent text-[#344C3D] py-3 rounded-full font-bold border border-[#344C3D]/20 hover:bg-[#344C3D]/5 transition">CANCEL</button>
          </div>
        </div>
      </div>
    </>
  );
}