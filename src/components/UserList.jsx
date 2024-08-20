import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

// eslint-disable-next-line react/prop-types
const UserList = ({ onSelectUser, view }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]); // Add state for groups

  const handleUserClicked = (userId, userName, isGroup = false) => {
    onSelectUser({ id: userId, name: userName, isGroup }); // Pass isGroup flag
  };

  // Fetch users and groups from Firestore
  useEffect(() => {
    const usersRef = collection(firestore, 'users');
    const groupsRef = collection(firestore, 'groups');

    // Fetch users
    const unsubscribeUsers = onSnapshot(usersRef, (querySnapshot) => {
      const usersArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersArray);
    });

    // Fetch groups
    const unsubscribeGroups = onSnapshot(groupsRef, (querySnapshot) => {
      const groupsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isGroup: true,
      }));
      setGroups(groupsArray);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeGroups();
    };
  }, []);

  // Filter out the logged-in user from the user list
  const otherUsers = users.filter(u => u.id !== user?.uid);
  const loggedInUser = users.find(u => u.id === user?.uid);

  return (
    <div className="w-full h-full overflow-y-auto">
      {view === 'chats' && (
        <>
          <h2 className="text-lg font-semibold mb-4">Chats</h2>

          {loggedInUser && (
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">You:</h3>
              <div className="flex items-center p-2 bg-gray-600 rounded-lg">
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
                  className="flex items-center p-2 bg-gray-600 rounded-lg cursor-pointer"
                  onClick={() => handleUserClicked(user.id, user.name)}
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </li>
              ))
            )}
          </ul>
        </>
      )}

      {view === 'groups' && (
        <>
          <h2 className="text-lg font-semibold mb-4">Groups</h2>
          <ul className="space-y-2">
            {groups.length === 0 ? (
              <li className="text-gray-500">No groups available</li>
            ) : (
              groups.map(group => (
                <li
                  key={group.id}
                  className="flex items-center p-2 bg-gray-600 rounded-lg cursor-pointer"
                  onClick={() => handleUserClicked(group.id, group.name, true)}
                >
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {group.name.charAt(0)}
                  </div>
                  <span className="font-medium">{group.name}</span>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default UserList;
