// src/Pages/AdminDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, Plus, CircleMinus, CirclePlus, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Components
import AddLinkModal from '../Components/AddLinkModal';
import AddGameModal from '../Components/AddGameModal';
import VisitWebsiteModal from '../Components/VisitWebsiteModal';
import ViewGameModal from '../Components/ViewGameModal';
import ConfirmEditModal from '../Components/ConfirmEditModal';
import EditGameModal from '../Components/EditGameModal';
import DeleteCategoryModal from '../Components/DeleteCategoryModal';
import RecentlyDeletedModal from '../Components/RecentlyDeletedModal';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // States
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trashGames, setTrashGames] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [modalStep, setModalStep] = useState(null); 
  const [fetchedData, setFetchedData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Confirmation state for navigation
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // Modals state
  const [visitModal, setVisitModal] = useState({ isOpen: false, url: '' });
  const [viewModal, setViewModal] = useState({ isOpen: false, game: null });
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });
  const [showTrashModal, setShowTrashModal] = useState(false);

  // Filter labels mapping
  const filterOptions = [
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    { label: 'Recently Modified', value: 'date-mod-desc' },
    { label: 'Oldest Modified', value: 'date-mod-asc' },
    { label: 'Newest Added', value: 'date-add-desc' },
    { label: 'Oldest Added', value: 'date-add-asc' },
  ];

  // --- Data Fetching ---
  const fetchGames = useCallback(async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const response = await fetch('http://localhost:5000/api/games');
      const data = await response.json();
      setGames(data);
    } catch (error) { console.error("Error fetching games:", error); } 
    finally { 
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 2000 - elapsed);
      setTimeout(() => setLoading(false), remaining);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) { console.error("Error fetching categories:", error); }
  }, []);

  const fetchTrashGames = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/games/trash');
      const data = await response.json();
      setTrashGames(data);
    } catch (error) { console.error("Error fetching trash:", error); }
  }, []);

  useEffect(() => {
    fetchGames();
    fetchCategories();
    fetchTrashGames();
  }, [fetchGames, fetchCategories, fetchTrashGames]);

  // --- Handlers ---
  const handleCategorySelection = (categoryName) => {
    setLoading(true);
    setIsDropdownOpen(false);
    setTimeout(() => {
      setSelectedCategory(categoryName);
      setLoading(false);
    }, 2000);
  };

  const handleFilterSelection = (filterValue) => {
    setLoading(true);
    setIsFilterOpen(false);
    setTimeout(() => {
      setSelectedFilter(filterValue);
      setLoading(false);
    }, 2000);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory })
    });
    setNewCategory('');
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    await fetch(`http://localhost:5000/api/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
    fetchGames();
  };

  const handleRestoreGame = async (id) => {
    await fetch(`http://localhost:5000/api/games/restore/${id}`, { method: 'PUT' });
    fetchGames();
    fetchTrashGames();
  };

  const handleEmptyTrash = async () => {
    await fetch('http://localhost:5000/api/games/trash/clear', { method: 'DELETE' });
    fetchTrashGames();
  };

  // --- Logic: Filters & Sorting ---
  let filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory ? game.category === selectedCategory : true;
    const matchesSearch = 
        game.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        game.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedFilter === 'name-asc') filteredGames.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  else if (selectedFilter === 'name-desc') filteredGames.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
  else if (selectedFilter === 'date-mod-asc') filteredGames.sort((a, b) => new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0));
  else if (selectedFilter === 'date-mod-desc') filteredGames.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  else if (selectedFilter === 'date-add-asc') filteredGames.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  else if (selectedFilter === 'date-add-desc') filteredGames.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return (
    <div className="min-h-screen bg-[#344C3D] font-sans">
      
      {/* Leave Page Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black50 /backdrop-blur-sm p-4">
          <div className="bg-[#F4F0EB] p-8 rounded-[40px] shadow-2xl border border-gray-200 w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-[#344C3D] mb-2">LEAVE DASHBOARD?</h2>
            <p className="text-[#344C3D]/70 mb-8">You will be redirected to the main front page.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLeaveConfirm(false)} className="flex-1 py-3 rounded-full border border-[#344C3D] text-[#344C3D] font-bold hover:bg-white transition">CANCEL</button>
              <button onClick={() => navigate('/')} className="flex-1 py-3 rounded-full bg-[#344C3D] text-white font-bold hover:bg-[#2a3d31] transition">LEAVE</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AddLinkModal isOpen={modalStep === 'step1'} onClose={() => setModalStep(null)} onProceed={(data) => { setFetchedData(data); setModalStep('step2'); }} />
      <AddGameModal isOpen={modalStep === 'step2'} games={games} initialData={fetchedData} onClose={() => { setModalStep(null); fetchGames(); }} />
      <VisitWebsiteModal isOpen={visitModal.isOpen} url={visitModal.url} onClose={() => setVisitModal({ isOpen: false, url: '' })} />
      <ViewGameModal isOpen={viewModal.isOpen} game={viewModal.game} onClose={() => setViewModal({ isOpen: false, game: null })} onEdit={() => { setViewModal({ isOpen: false, game: viewModal.game }); setShowConfirmEdit(true); }} />
      <ConfirmEditModal isOpen={showConfirmEdit} onClose={() => setShowConfirmEdit(false)} onProceed={() => { setShowConfirmEdit(false); setShowEditModal(true); }} />
      <EditGameModal isOpen={showEditModal} game={viewModal.game} onClose={() => setShowEditModal(false)} />
      <DeleteCategoryModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, category: null })} category={deleteModal.category} onConfirm={handleDeleteCategory} />
      <RecentlyDeletedModal 
        isOpen={showTrashModal} 
        onClose={() => setShowTrashModal(false)} 
        trashGames={trashGames} 
        onRestore={handleRestoreGame}
        onEmptyTrash={handleEmptyTrash}
      />

      <div className="h-screen flex p-6 gap-5 ">
        {/* ASIDE - LEFT SIDE */}
        
        <aside className="w-1/4 min-h-[calc(100vh-200px)] flex">
          <div className="w-full h-full flex flex-col bg-[#F4F0EB] p-6 rounded-[20px] shadow-lg border border-black/15">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200/70">
              <img src="logo.png" alt="Logo" className="w-10 h-10" />
              <div>

                <h2 className="text-[25px] font-bold text-[#344C3D] tracking-tight"> Basiad Elementary School</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 -mr-1">
              <h1 className="text-[22px] font-bold text-[#344C3D] tracking-tight">GAME SITE MANAGEMENT</h1>
              <p className="text-[#344C3D]/70 mt-2 mb-4 text-[13px] leading-relaxed">
                Manage all educational games by adding, editing, organizing, and updating game information.
              </p>

              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#344C3D]/50" size={20} />
                  <input type="search" placeholder="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-3 py-2.5 rounded-full bg-white border border-gray-200 outline-none text-[#344C3D] text-[13px]" />
                </div>

                {/* Category Dropdown */}
                <div className="relative z-50">
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between bg-white px-4 py-2.5 rounded-full border border-gray-200 text-[#344C3D] text-[13px] hover:border-gray-300 transition">
                    {selectedCategory || 'Select Category'} <ChevronDown size={18} />
                  </button>
                  <span className="text-[10px] uppercase text-[#344C3D]/60 ml-4 mt-2 block">Category</span>
                  {isDropdownOpen && (
                    <div className="absolute w-full mt-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-[#344C3D]">
                      <div onClick={() => handleCategorySelection(null)} className="px-5 py-4 cursor-pointer hover:bg-gray-50">No particular category</div>
                      {categories.map((cat) => (
                        <div key={cat._id} className="px-5 py-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer" onClick={() => handleCategorySelection(cat.name)}>
                          <div className="flex flex-col">
                              <span className="text-[#344C3D]">{cat.name}</span>
                              <span className="text-[10px] text-gray-400">{games.filter((g) => g.category === cat.name).length} items</span>
                          </div>
                          {isEditMode && <button onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, category: { id: cat._id, name: cat.name } }); }} className="text-red-400"><CircleMinus size={20} /></button>}
                        </div>
                      ))}
                      <div className="px-4 py-3 bg-gray-50 flex items-center gap-2">
                          <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="add category" className="bg-transparent text-sm w-full outline-none" />
                          <button type="button" onClick={(e) => { e.stopPropagation(); handleAddCategory(); }}><CirclePlus size={20} className="text-[#344C3D]/50" /></button>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setIsEditMode(!isEditMode); }} className="text-[10px] text-gray-400 uppercase">Edit</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filters Dropdown */}
                <div className="relative z-40">
                  <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full flex items-center justify-between bg-white px-4 py-2.5 rounded-full border border-gray-200 text-[#344C3D] text-[13px]">{selectedFilter ? filterOptions.find(f => f.value === selectedFilter)?.label : 'All Filters'} <ChevronDown size={18} /></button>
                  <span className="text-[10px] uppercase text-[#344C3D]/60 ml-4 mt-2 block">Filters</span>
                  {isFilterOpen && (
                    <div className="absolute w-full mt-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-[#344C3D] text-sm">
                      <div onClick={() => handleFilterSelection('')} className="px-5 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50">Clear Filters</div>
                      {filterOptions.map((opt) => (
                          <div key={opt.value} onClick={() => handleFilterSelection(opt.value)} className="px-5 py-3 cursor-pointer hover:bg-gray-50">{opt.label}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button onClick={() => setModalStep('step1')} className="w-full mt-4 flex items-center justify-center gap-2 bg-[#344C3D] text-white py-3 rounded-full font-semibold hover:bg-[#2a3d31] transition text-[13px]">
                  <Plus size={20} /> Add Game Link
                </button>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-[#344C3D] p-4 rounded-[24px] shadow-sm flex flex-col justify-center">
                      <span className="text-[10px] text-white/60 uppercase font-bold">Total Sites</span>
                      <span className="text-[24px] font-bold text-white mt-1">{games.length}</span>
                  </div>
                  <div className="bg-white p-4 rounded-[24px] shadow-sm flex flex-col justify-center border border-gray-100">
                      <span className="text-[10px] text-[#344C3D]/60 uppercase font-bold">Total Categories</span>
                      <span className="text-[24px] font-bold text-[#344C3D] mt-1">{categories.length}</span>
                  </div>
                  <div className="bg-white p-4 rounded-[24px] shadow-sm flex flex-col justify-center border border-gray-100">
                      <span className="text-[10px] text-[#344C3D]/60 uppercase font-bold">Total Views</span>
                      <span className="text-[24px] font-bold text-[#344C3D] mt-1">0</span>
                  </div>
                  <button onClick={() => setShowTrashModal(true)} className="bg-white p-4 rounded-[24px] shadow-sm flex flex-col justify-center border border-gray-100 hover:bg-gray-50 transition text-left">
                      <span className="text-[10px] text-[#344C3D]/60 uppercase font-bold">Recently Deleted</span>
                      <span className="text-[24px] font-bold text-[#344C3D] mt-1">{trashGames.length}</span>
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowLeaveConfirm(true)} 
              className="w-full mt-4 bg-[#344C3D] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#2a3d31] transition text-[13px] shrink-0"
            >
              Go to front page
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT - RIGHT SIDE */}
        <main className="w-3/4 min-h-[calc(100vh-200px)] bg-[#738A6E]/40 rounded-[20px] shadow-[inset_0_0_35px_rgba(0,0,0,0.1)] p-10 ">
          <div className="h-full overflow-y-auto pr-6 -mr-6">
            {loading ? (
                <div className="flex flex-col justify-center items-center w-full h-full min-h-[400px]">
    <img src="/loading.gif" alt="Loading..." className="w-50 h-50" />
    <p className="text-[#FEFEFE]">Loading...</p>
  </div>
            ) : filteredGames.length === 0 ? 
        <div className="flex flex-col justify-center items-center w-full h-full min-h-[400px]">
    <img src="/nothing.gif" alt="Nothing found" className="w-27 h-27" />
    <p className="text-[#FEFEFE]">Nothing here.</p>
  </div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredGames.map((game) => (
                  <div key={game._id} onClick={() => setViewModal({ isOpen: true, game: game })} className="bg-[#E8EAE6] p-4 rounded-[20px] shadow-sm shadow-black/30 border border-gray-200/50 flex flex-col h-full cursor-pointer transition duration-300 ease-out hover:-translate-y-2 hover:shadow-lg hover:shadow-black/40 pt-4 pb-4 mt-2">
                    <div className="w-full aspect-square rounded-[20px] border border-gray-100/50 overflow-hidden bg-white shadow-inner mb-4">
                      <img src={game.imageUrl || 'https://placehold.co/150x150/e8eae6/344c3d?text=No+Image'} alt={game.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="px-2 flex flex-col flex-grow">
                      <h3 className="font-bold text-[#344C3D] uppercase text-lg line-clamp-2 leading-tight">{game.title || 'Untitled Game'}</h3>
                      <p className="text-[#344C3D] text-sm mt-2 line-clamp-2 mb-4 flex-grow">{game.description || '...'}</p>
                      <button onClick={(e) => { e.stopPropagation(); const formattedUrl = game.link?.startsWith('http') ? game.link : `https://${game.link || ''}`; setVisitModal({ isOpen: true, url: formattedUrl }); }} className="w-full bg-[#344C3D] text-white py-3 rounded-full font-bold hover:bg-[#738A6E] transition text-sm">VISIT</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

  
      </div>

    </div>
  );
}