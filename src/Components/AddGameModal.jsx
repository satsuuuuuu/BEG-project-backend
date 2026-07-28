// src/Components/AddGameModal.jsx
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, RefreshCw, CirclePlus, CircleMinus, Upload } from 'lucide-react';
import VisitWebsiteModal from './VisitWebsiteModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import ConfirmSaveModal from './ConfirmSaveModal';

export default function AddGameModal({ isOpen, onClose, initialData, games = [] }) {
  const [formData, setFormData] = useState({
    link: '', title: '', description: '', imageUrl: '', category: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) setFormData(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) { console.error("Error fetching categories:", err); }
  };

  useEffect(() => { if (isOpen) fetchCategories(); }, [isOpen]);

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
    } catch (error) { alert("Failed to scrape: " + error.message); } 
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // 1. Check if the server responded successfully
      if (!response.ok) {
        // If it's not ok, we don't try to parse JSON, 
        // we log the status and throw an error
        const text = await response.text(); 
        console.error("Server responded with error:", response.status, text);
        alert(`Server Error (${response.status}): Check the console for details.`);
        return;
      }

      // 2. Only parse JSON if response is OK
      const result = await response.json();
      console.log("Save successful:", result);
      onClose();
      
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Make sure your backend server is running on port 5000.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* SECONDARY MODALS WITH HIGH Z-INDEX */}
      <div className="z-[200] relative">
         <ConfirmSaveModal 
            isOpen={showConfirmSave} 
            onClose={() => setShowConfirmSave(false)} 
            onConfirm={() => { setShowConfirmSave(false); handleSave(); }} 
         />
         <VisitWebsiteModal 
            isOpen={visitModalOpen} 
            onClose={() => setVisitModalOpen(false)} 
            game={{ link: formData.link, title: formData.title }} 
         />
         <DeleteCategoryModal 
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, category: null })}
            category={deleteModal.category}
            onConfirm={(id) => { 
                fetch(`http://localhost:5000/api/categories/${id}`, { method: 'DELETE' })
                .then(() => fetchCategories()); 
            }}
         />
      </div>

      {/* MAIN MODAL */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-[#F4F0EB] w-full max-w-lg rounded-[30px] p-8 shadow-2xl relative">
          <h2 className="text-2xl font-bold text-[#344C3D] mb-6 tracking-tight">ADD NEW GAME</h2>

          {/* Form Content */}
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
                <input name="link" value={formData.link} onChange={handleChange} placeholder="Paste link.." className="w-full p-4 pr-12 rounded-full bg-white border border-black/20 mb-1 outline-none" />
                <button onClick={handleAutoFetch} className="absolute right-4 top-4 text-[#344C3D]/40 hover:text-[#344C3D] transition">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>
            <button onClick={() => setVisitModalOpen(true)} className="bg-[#344C3D] text-white px-6 py-4 rounded-full font-bold hover:bg-[#2a3d31] transition whitespace-nowrap">VISIT</button>
          </div>
          <span className="text-[10px] uppercase text-[#344C3D]/60 ml-4 mb-4 block">website link</span>

          <input name="title" value={formData.title} onChange={handleChange} placeholder="WORLDWALL" className="w-full p-4 rounded-full bg-white border border-black/25 mb-1 outline-none font-bold text-[#344C3D]" />
          <span className="text-[10px] uppercase text-[#344C3D]/60 ml-4 mb-4 block">website name</span>

          <div className="flex gap-4 mb-4">
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description..." className="w-1/2 h-40 p-4 rounded-[20px] bg-white border border-black/20 outline-none resize-none text-sm" />
            <div className=" w-1/2 h-40 bg-white rounded-[20px] border border-black/20 overflow-hidden relative group">
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
          
          <div className=" flex justify-between px-4 mb-6">
            <span className="text-[10px] uppercase text-[#344C3D]/60">website description</span>
            <span className="text-[10px] uppercase text-[#344C3D]/60">website thumbnail</span>
          </div>

          {/* Category Dropdown */}
          <div className="relative mb-8 z-[110]">
            <div onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="w-full flex items-center justify-between bg-white px-5 py-4 rounded-full  border border-black/20 text-[#344C3D] cursor-pointer">
              {formData.category || "Select Category"} 
              <ChevronDown size={20} className="text-[#344C3D]/70" />
            </div>
            <span className="text-[10px] uppercase text-[#344C3D]/60 ml-4 mt-2 block">Category</span>
            {isCategoryOpen && (
                <div className="absolute w-full mt-2 bg-white rounded-3xl shadow-xl border border-black/15 overflow-hidden">
                    <div onClick={() => { setFormData({...formData, category: ''}); setIsCategoryOpen(false); }} className="px-5 py-4 cursor-pointer hover:bg-gray-50 text-[#344C3D]">No particular category</div>
                    {categories.map((cat) => (
                        <div key={cat._id} className="px-5 py-4 flex justify-between items-center hover:bg-gray-50 text-[#344C3D] cursor-pointer">
                            <div onClick={() => { setFormData({...formData, category: cat.name}); setIsCategoryOpen(false); }} className="flex flex-col flex-1">
                                <span>{cat.name}</span>
                            </div>
                            {isEditMode && (
                                <button onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, category: { id: cat._id, name: cat.name } }); }} className="text-red-400">
                                    <CircleMinus size={20}/>
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="px-4 py-3 bg-gray-50 flex items-center gap-2">
                        <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="add category" className="bg-transparent text-sm w-full outline-none text-[#344C3D]" />
                        <button type="button" onClick={handleAddCategory} className="hover:scale-110 transition-transform"><CirclePlus size={20} className="text-[#344C3D]/50" /></button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setIsEditMode(!isEditMode); }} className="text-[10px] text-gray-400 uppercase hover:text-[#344C3D]">Edit</button>
                    </div>
                </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <button onClick={() => setShowConfirmSave(true)} className="w-full bg-[#344C3D] text-white py-3 rounded-full font-bold hover:bg-[#2a3d31] transition">SAVE</button>
            <button onClick={onClose} className="w-full bg-transparent text-[#344C3D] py-3 rounded-full font-bold border border-[#344C3D]/20 hover:bg-[#344C3D]/5 transition">CANCEL</button>
          </div>
        </div>
      </div>
    </>
  );
}