import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import UserList from './UserList';
import { useAuth } from '../contexts/AuthContext';
import CreateGroup from './CreateGroup';

const ChatRoom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateGroupVisible, setIsCreateGroupVisible] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r border-gray-300 p-4">
        <UserList onSelectUser={setSelectedUser} />
        <div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
            onClick={() => setIsCreateGroupVisible(true)}
          >
            Create Group
          </button>

          {isCreateGroupVisible && (
            <CreateGroup onClose={() => setIsCreateGroupVisible(false)} />
          )}
        </div>
      </div>
      <div className="w-3/4 flex flex-col">
        <div className="flex-1 overflow-auto p-4">
          {selectedUser ? (
            <>
              <ChatWindow recipientId={selectedUser.id} recipientName={selectedUser.name} isGroup={selectedUser.isGroup} />
              <ChatInput recipientId={selectedUser.id} isGroup={selectedUser.isGroup} />
            </>
          ) : (
            <p className="text-center text-gray-500 text-lg mt-4">
              Select a user to start chatting...
            </p>
          )}
        </div>
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
