import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid'; 

// eslint-disable-next-line react/prop-types
const CreateGroup = ({ onGroupCreated, onClose }) => {
  
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
      const groupId = uuidv4(); // Generate unique ID for the group

      const groupData = {
        name: groupName,
        
        members: [user.uid, ...selectedUsers],
        createdBy: user.uid,
        createdAt: new Date(),
        
      };

      await addDoc(collection(firestore, 'groups'), { id: groupId, ...groupData }); 
      // Optionally, you could notify users or update their group list here

      if (onGroupCreated) onGroupCreated(); 
      setGroupName('');
      setSelectedUsers([]);
      if (onClose) onClose(); // Close the modal if onClose prop is provided
    } catch (error) {
      console.error('Error creating group: ', error);
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Create Group</h2>
      
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        className="w-full p-3 mb-4 border border-gray-700 bg-gray-900 rounded-lg text-white placeholder-gray-500"
      />
      
      <h3 className="text-md font-semibold mb-2">Select Users:</h3>
      
      <ul className="space-y-2 mb-4">
        {users
          .filter((u) => u.id !== user.uid)
          .map((u) => (
            <li
              key={u.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                selectedUsers.includes(u.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => handleUserSelect(u.id)}
            >
              {u.name}
            </li>
          ))}
      </ul>
      
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleCreateGroup}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Create Group
        </button>
       
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
  
  // return (
  //   <div className="p-4">
  //     <h2 className="text-lg font-semibold mb-4">Create Group</h2>
      
  //     <input
  //       type="text"
  //       value={groupName}
  //       onChange={(e) => setGroupName(e.target.value)}
  //       placeholder="Group Name"
  //       className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
  //     />
  //     <h3 className="text-md font-semibold mb-2">Select Users:</h3>
     
  //     <ul className="space-y-2 mb-4">
  //       {users
  //         .filter((u) => u.id !== user.uid)
  //         .map((u) => (
  //           <li
  //             key={u.id}
  //             className={`flex items-center p-2 rounded-lg cursor-pointer ${
  //               selectedUsers.includes(u.id)
  //                 ? 'bg-blue-500 text-white'
  //                 : 'bg-gray-100'
  //             }`}
  //             onClick={() => handleUserSelect(u.id)}
  //           >
  //             {u.name}
  //           </li>
  //         ))}
  //     </ul>
  //     <div className="flex justify-end">
  //       <button
  //         onClick={handleCreateGroup}
  //         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
  //       >
  //         Create Group
  //       </button>
     
  //       <button
  //         onClick={onClose}
  //         className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
  //       >
  //         Cancel
  //       </button>

  //     </div>
  //   </div>
  // );
};

export default CreateGroup;
