import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signup');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '', newsletter: false
  });

  useEffect(() => {
    setError(''); setSuccess('');
    setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', newsletter: false });
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // ==========================================
  // --- REAL SIGNUP LOGIC ---
  // ==========================================
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      // USING EXPLICIT LOCALHOST URL
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          newsletterOptIn: formData.newsletter
        }),
      });

      const data = await response.json();

      // Check for the "Fail" status or standard HTTP error
      if (!response.ok || data.status === "Fail") {
        throw new Error(data.message || 'Something went wrong during signup.');
      }

      setSuccess("Account created successfully! Please log in.");
      setTimeout(() => setActiveTab('login'), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setIsLoading(true);

    try {
      // USING EXPLICIT LOCALHOST URL
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status === "Fail") {
        throw new Error(data.message || 'Invalid email or password.');
      }

      login(data.token , data.data);

      navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 pt-24 font-central text-nav-dark">
      <img src="https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=2070" alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" />
      <div className="absolute inset-0 bg-black/20 z-0" />

      <div className="relative z-10 w-full max-w-[500px] bg-[#f4f2ed]/85 backdrop-blur-md border border-nav-dark flex flex-col shadow-2xl">
        <div className="flex border-b border-nav-dark">
          <button onClick={() => setActiveTab('login')} className={`flex-1 py-4 text-sm uppercase tracking-widest font-bold border-r border-nav-dark transition-colors ${activeTab === 'login' ? 'bg-[#f4f2ed] ' : 'bg-transparent text-nav-dark/60 hover:bg-white/40'}`} > Log In </button>
          <button onClick={() => setActiveTab('signup')} className={`flex-1 py-4 text-sm uppercase tracking-widest font-bold transition-colors ${activeTab === 'signup' ? 'bg-[#f4f2ed] ' : 'bg-transparent text-nav-dark/60 hover:bg-white/40'}`} > Sign Up </button>
        </div>

        <div className="p-8 md:p-12 flex flex-col gap-6">
          <h1 className="text-2xl font-bold uppercase tracking-wider mb-2"> {activeTab === 'signup' ? 'Create Your Account' : 'Log In'} </h1>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-[10px] uppercase tracking-widest font-bold leading-relaxed">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 text-[10px] uppercase tracking-widest font-bold leading-relaxed">{success}</div>}

          <form onSubmit={activeTab === 'signup' ? handleSignup : handleLogin} className="flex flex-col gap-5" >
            {activeTab === 'signup' && (
              <>
                <input required type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} disabled={isLoading} className="w-full bg-transparent border border-nav-dark px-4 py-3.5 text-xs uppercase tracking-widest outline-none focus:bg-white/50 transition-colors placeholder-nav-dark/60 disabled:opacity-50" />
                <input required type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} disabled={isLoading} className="w-full bg-transparent border border-nav-dark px-4 py-3.5 text-xs uppercase tracking-widest outline-none focus:bg-white/50 transition-colors placeholder-nav-dark/60 disabled:opacity-50" />
              </>
            )}

            <input required type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} disabled={isLoading} className="w-full bg-transparent border border-nav-dark px-4 py-3.5 text-xs uppercase tracking-widest outline-none focus:bg-white/50 transition-colors placeholder-nav-dark/60 disabled:opacity-50" />
            <input required type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} disabled={isLoading} className="w-full bg-transparent border border-nav-dark px-4 py-3.5 text-xs uppercase tracking-widest outline-none focus:bg-white/50 transition-colors placeholder-nav-dark/60 disabled:opacity-50" />

            {activeTab === 'signup' && (
              <input required type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} disabled={isLoading} className="w-full bg-transparent border border-nav-dark px-4 py-3.5 text-xs uppercase tracking-widest outline-none focus:bg-white/50 transition-colors placeholder-nav-dark/60 disabled:opacity-50" />
            )}

            {activeTab === 'signup' && (
              <label className="flex items-start gap-3 mt-2 cursor-pointer group">
                <input type="checkbox" name="newsletter" checked={formData.newsletter} onChange={handleInputChange} disabled={isLoading} className="mt-0.5 w-4 h-4 rounded-none border border-nav-dark accent-nav-dark bg-transparent disabled:opacity-50" />
                <span className="font-ballinger text-[10px] uppercase tracking-widest leading-relaxed font-bold opacity-80 group-hover:opacity-100 transition-opacity disabled:opacity-50">
                  I'd like to be notified about new products, behind the scenes news and early access to sales. I can unsubscribe at any time.
                </span>
              </label>
            )}

            <button type="submit" disabled={isLoading} className={`mt-4 flex w-full h-[52px] border border-nav-dark group ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
              <div className="flex-1 bg-[#f4f2ed] flex items-center justify-center font-bold uppercase tracking-widest text-sm transition-colors group-hover:bg-white">
                {isLoading ? 'Processing...' : (activeTab === 'signup' ? 'Sign Up' : 'Log In')}
              </div>
              <div className="w-[60px] bg-nav-dark flex items-center justify-center border-l border-nav-dark transition-colors group-hover:bg-black">
                <svg className={`w-5 h-5 text-[#f4f2ed] ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  {isLoading ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v4m0 8v4m-8-8h4m8 0h4m-12-6.5l2.5 2.5m5 5l2.5 2.5m0-12.5l-2.5 2.5m-5 5l-2.5 2.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  )}
                </svg>
              </div>
            </button>

            <p className="text-center font-ballinger text-[9px] uppercase tracking-widest mt-6 opacity-70 leading-relaxed font-bold px-4">
              By providing your email address, you agree to our <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Terms & Conditions</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}