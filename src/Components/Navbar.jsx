// src/Components/Navbar.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingPopup from './LoadingPopup';
import LoginModal from './LoginModal';

export default function Navbar() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(false);
  }, [location]);

  const handleLoginClick = () => setIsModalOpen(true);

  const handleModalLogin = async ({ email, password }) => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier: email, password })
      });
      const ct = res.headers.get('content-type') || '';
      let data;
      if (ct.includes('application/json')) data = await res.json();
      else { const text = await res.text(); throw new Error(text || 'Login failed'); }
      if (!res.ok) throw new Error(data.message || 'Login failed');
      setIsModalOpen(false);
      navigate('/admin');
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally { setIsLoading(false); }
  };

  const navBgColor = location.pathname === '/admin' ? "bg-[#F4F0EB]" : "bg-[#F4F0EB]";
  const txtColor = location.pathname === '/admin' ? "text-[#F4F0EB]" : "text-[#344C3D]";

  return (
    <>
      {isLoading && <LoadingPopup />}
      
      {/* Navbar styling */}
      <nav className={`flex w-full items-center justify-between px-8 py-6 min-h-[80px] ${navBgColor} transition-colors duration-500`}>
        <div className="flex items-center gap-3">
          <img src="logo.png" alt="Logo" className="w-12 h-12" />
          
          <span className={`text-[25px] font-extrabold ${txtColor} tracking-tight font-ancizar`}>
            BASIAD ELEMENTARY SCHOOL
          </span>
        </div>

        {location.pathname !== '/admin' && (
           <>
             <button onClick={handleLoginClick} className="bg-[#344C3D] text-white px-6 py-2 rounded-xl text-base">LOGIN</button>
             <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogin={handleModalLogin} />
           </>
        )}
      </nav>
    </>
  );
}