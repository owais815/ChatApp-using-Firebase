import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

// eslint-disable-next-line react/prop-types
const UserList = ({ onSelectUser }) => {
  const { user } = useAuth(); // Get the logged-in user's info
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = collection(firestore, 'users');

    const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
      const usersArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersArray);
    });

    return () => unsubscribe();
  }, []);

 
  const otherUsers = users.filter(u => u.id !== user?.uid);
  const loggedInUser = users.find(u => u.id === user?.uid);

  return (
    <div className="p-4 border-r border-gray-300 bg-white h-full">
      <h2 className="text-lg font-semibold mb-4">Users</h2>

      {loggedInUser && (
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">You:</h3>
          <div className="flex items-center p-2 bg-gray-200 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              {loggedInUser.name.charAt(0)}
            </div>
            <span className="font-medium">{loggedInUser.name}</span>
          </div>
        </div>
      )}
      <h3 className="text-md font-semibold mb-2">Other Users:</h3>
      <ul className="space-y-2">
        {otherUsers.length === 0 ? (
          <li className="text-gray-500">No other users online</li>
        ) : (
          otherUsers.map(user => (
            
            <li 
              key={user.id} 
              className="flex items-center p-2 bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => onSelectUser(user.id)}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                {user.name.charAt(0)}
              </div>
              <span className="font-medium">{user.name}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default UserList;
