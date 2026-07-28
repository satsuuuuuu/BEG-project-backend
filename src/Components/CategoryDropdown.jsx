import React, { useState } from 'react';
import { ChevronDown, CircleMinus, CirclePlus, Check } from 'lucide-react';

export default function CategoryDropdown({ selected, onChange, categories, onAdd, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newCat, setNewCat] = useState('');

  return (
    <div className="relative w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white px-5 py-3 rounded-full border border-black text-[#344C3D] hover:border-gray-300"
      >
        {selected || "Categories"}
        <ChevronDown size={18} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-black overflow-hidden z-50">
          {/* Default Option */}
          <div 
            onClick={() => { onChange(''); setIsOpen(false); }}
            className="px-5 py-3 cursor-pointer hover:bg-gray-50 text-[#344C3D]/70"
          >
            no particular category
          </div>

          {/* Dynamic List */}
          {categories.map((cat) => (
            <div key={cat._id} className="px-5 py-3 flex justify-between items-center hover:bg-gray-50">
              <span onClick={() => { onChange(cat.name); setIsOpen(false); }} className="cursor-pointer">{cat.name}</span>
              {isEditing && (
                <button onClick={() => onDelete(cat._id)} className="text-red-400"><CircleMinus size={18}/></button>
              )}
            </div>
          ))}

          {/* Edit / Add Trigger */}
          <div className="px-5 py-3 bg-gray-50 flex items-center gap-2">
            <input 
              value={newCat} 
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Add category..."
              className="bg-transparent outline-none text-sm w-full"
            />
            <button onClick={() => { onAdd(newCat); setNewCat(''); }}><CirclePlus size={18} /></button>
            <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-gray-400">Edit</button>
          </div>
        </div>
      )}
    </div>
  );
}