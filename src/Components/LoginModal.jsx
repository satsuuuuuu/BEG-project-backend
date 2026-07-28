import { useState, useEffect } from 'react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stage, setStage] = useState('login'); // login | forgot
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmail(''); setPassword(''); setStage('login'); setMessage('');
    }
  }, [isOpen]);

  const submitLogin = async (e) => {
    e.preventDefault();
    if (!onLogin) return;
    await onLogin({ email, password });
  };

  const submitForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
      });
      const ct = res.headers.get('content-type') || '';
      let data;
      if (ct.includes('application/json')) data = await res.json();
      else data = { message: await res.text() };
      if (!res.ok) throw new Error(data.message || 'Request failed');
      setMessage(data.message || 'Check console for token (dev mode)');
    } catch (err) {
      setMessage(err.message || 'Error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden h-[500px]">
        
        {/* Left Side (Dark Illustration Area) */}
        <div className="w-1/3 bg-[#344C3D] hidden md:flex flex-col items-center justify-center p-8 text-white">
            {/* You can add your illustration SVG or img here */}
            <div className="text-white/20 text-9xl">✦</div>
            <h2 className="text-xl font-bold mt-4">Welcome Back</h2>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-2/3 p-12 flex flex-col justify-center relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">Close</button>
          
          <h2 className="text-3xl font-bold text-[#344C3D] mb-8">
            {stage === 'login' ? 'Log In' : 'Forgot Password'}
          </h2>

          {stage === 'login' && (
            <form onSubmit={submitLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#344C3D] outline-none transition" 
                    placeholder="name@email.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                    type="password" 
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#344C3D] outline-none transition" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
                <div className="mt-2 text-right">
                    <button type="button" className="text-sm text-[#344C3D] font-medium hover:underline" onClick={() => setStage('forgot')}>
                        Forgot Password?
                    </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#344C3D] text-white py-4 rounded-xl font-bold hover:bg-[#2a3d31] transition">
                Login
              </button>
            </form>
          )}

          {stage === 'forgot' && (
            <form onSubmit={submitForgot} className="space-y-6">
              <p className="text-gray-600">Enter your email to receive a reset token.</p>
              <input 
                className="w-full p-4 border border-gray-300 rounded-xl" 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
              <div className="flex gap-4">
                <button className="flex-1 bg-[#344C3D] text-white py-4 rounded-xl font-bold" type="submit">Send</button>
                <button type="button" className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold" onClick={() => setStage('login')}>Back</button>
              </div>
              {message && <div className="text-sm text-center text-green-700 p-2 bg-green-50 rounded">{message}</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}