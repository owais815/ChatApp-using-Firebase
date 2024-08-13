// import React from 'react';
// import ChatWindow from './ChatWindow';
// import ChatInput from './ChatInput';
// import UserList from './UserList';
// import { useAuth } from '../contexts/AuthContext';

// const ChatRoom = () => {
//     const {logout} = useAuth();
//   return (
//     <div className="h-screen grid grid-cols-4">
//       {/* UserList Section */}
//       <div className="col-span-1 border-r border-gray-300 p-4 bg-gray-100">
//         <UserList />
//       </div>

//       {/* ChatWindow Section */}
//       <div className="col-span-3 flex flex-col">
//         <div className="flex-1 overflow-auto p-4 bg-white">
//           <ChatWindow />
//         </div>

//         {/* ChatInput Section */}
//         <div className="border-t border-gray-300 p-4 bg-gray-50">
//           <ChatInput />
//         </div>
//       </div>
//       <div> <button onClick={logout}>Logout</button></div>
//     </div>
//   );
// };

// export default ChatRoom;




import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import UserList from './UserList';
import { useAuth } from '../contexts/AuthContext';

const ChatRoom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const {logout} = useAuth();

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r border-gray-300 p-4">
        <UserList onSelectUser={setSelectedUser} />
      </div>
      <div className="w-3/4 flex flex-col">
        <div className="flex-1 overflow-auto p-4">
          {selectedUser ? (
            <>
              <ChatWindow recipientId={selectedUser} />
              <ChatInput recipientId={selectedUser} />
            </>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </div>
        <div> <button  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={logout}>Logout</button></div>
      </div>
    </div>
  );
};

export default ChatRoom;
