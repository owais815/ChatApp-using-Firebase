import React  from 'react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, loginWithGoogle, logout, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
    const navigate = useNavigate(); 
  
    useEffect(() => {
      if (user) {
        
        navigate('/ChatRoom');
      }
    }, [user, navigate]);
  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={loginWithGoogle}>Login with Google</button>
        </>
      )}
    </div>
  );
};

export default LoginPage;
 