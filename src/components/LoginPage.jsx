// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext'; // Import the custom auth context
// import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// const LoginPage = () => {
//   const { user, login, logout, loading } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate(); // Hook to handle navigation

//   // Handle login form submission
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try { 
//       await login(email, password);
//       navigate('/'); // Redirect to home page on successful login
//     } catch (error) {
//       console.error('Error logging in:', error.message);
//       alert('Failed to login. Please check your credentials.');
//     }
//   };

//   // Handle logout button click
//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login'); // Redirect to login page on logout
//     } catch (error) {
//       console.error('Error logging out:', error.message);
//       alert('Failed to logout. Please try again.');
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-200">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
//         <h2 className="text-2xl font-bold mb-4">Login</h2>
//         {user ? (
//           <div>
//             <p className="mb-4">Welcome, {user.email}</p>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Logout
//             </button>
//           </div>
//         ) : (
//           <form onSubmit={handleLogin}>
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//               />
//             </div>
//             <div className="mb-6">
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//               />
//             </div>
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               Login
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



import React  from 'react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, loginWithGoogle, logout, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
    const navigate = useNavigate(); // Hook for navigation
  
    useEffect(() => {
      if (user) {
        // Navigate to the chat room if the user is logged in
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
 