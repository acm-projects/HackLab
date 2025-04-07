// components/SessionTimeoutHandler.tsx
'use client';
//added this page - april 7
import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

export default function SessionTimeoutHandler() {
  const { data: session, status } = useSession();
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const sessionData = await fetch('/api/auth/session').then(res => res.json());

      if (!sessionData || Object.keys(sessionData).length === 0) {
        setShowTimeoutModal(true);
      }
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    if (status !== 'authenticated') return;

    const events = ['mousemove', 'keydown', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [status]);

  const handleReLogin = () => {
    setShowTimeoutModal(false);
    signIn(); // Redirects to sign-in page
  };

  return (
    <>
      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full text-center">
            <h2 className="text-xl font-semibold mb-4">You've been logged out</h2>
            <p className="mb-6">Looks like you were inactive for a while. Sign back in to continue?</p>
            <button
              onClick={handleReLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </>
  );
}
