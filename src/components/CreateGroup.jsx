import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

// eslint-disable-next-line react/prop-types
const CreateGroup = ({ onGroupCreated }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const usersRef = collection(firestore, 'users');
    const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
      const usersArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersArray);
    });

    return () => unsubscribe();
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    try {
      const groupData = {
        name: groupName,
        members: [user.uid, ...selectedUsers],
        createdBy: user.uid,
        createdAt: new Date(),
      };

      await addDoc(collection(firestore, 'groups'), groupData);
      onGroupCreated();
      setGroupName('');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating group: ', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Create Group</h2>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      <h3 className="text-md font-semibold mb-2">Select Users:</h3>
      <ul className="space-y-2 mb-4">
        {users
          .filter((u) => u.id !== user.uid)
          .map((u) => (
            <li
              key={u.id}
              className={`flex items-center p-2 rounded-lg cursor-pointer ${
                selectedUsers.includes(u.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
              onClick={() => handleUserSelect(u.id)}
            >
              {u.name}
            </li>
          ))}
      </ul>
      <button
        onClick={handleCreateGroup}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Create Group
      </button>
    </div>
  );
};

export default CreateGroup;
