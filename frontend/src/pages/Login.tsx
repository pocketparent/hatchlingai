import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'start' | 'code'>('start');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleSendLink = async () => {
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/request-login', { phone });
      setStep('code');
    } catch (err) {
      console.error(err);
      setError('Failed to send code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/verify-token', { phone, token: code });
      const { user, token } = res.data;
      login(user, token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoLoginFromMagicLink = async () => {
    const invitePhone = params.get('phone');
    const token = params.get('token');
    if (!invitePhone || !token) return;

    try {
      const res = await axios.post('/api/auth/verify-token', {
        phone: invitePhone,
        token
      });
      const { user, token: jwt } = res.data;
      login(user, jwt);
      navigate('/');
    } catch {
      setError('Magic link failed. Try manual login.');
    }
  };

  React.useEffect(() => {
    if (params.get('phone') && params.get('token')) {
      handleAutoLoginFromMagicLink();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F4EF] px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-[#8C6F5E] border border-[#EADBC8]">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome to Hatchling</h1>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        {step === 'start' ? (
          <>
            <label className="block mb-2 text-sm">Enter your phone number</label>
            <input
              type="tel"
              placeholder="e.g., +15555555555"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-[#EADBC8] rounded-xl px-4 py-2 mb-4 text-sm bg-white"
            />
            <button
              onClick={handleSendLink}
              disabled={loading}
              className="w-full bg-[#EADBC8] text-[#8C6F5E] py-2 rounded-xl hover:bg-[#F4E3DA]"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </>
        ) : (
          <>
            <label className="block mb-2 text-sm">Enter the 6-digit code</label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-[#EADBC8] rounded-xl px-4 py-2 mb-4 text-sm bg-white tracking-widest text-center"
            />
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-[#EADBC8] text-[#8C6F5E] py-2 rounded-xl hover:bg-[#F4E3DA]"
            >
              {loading ? 'Verifying...' : 'Log In'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
