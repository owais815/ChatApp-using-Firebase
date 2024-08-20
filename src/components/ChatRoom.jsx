// import React, { useState } from "react";
// import ChatWindow from "./ChatWindow";
// import {
//   ChatBubbleLeftEllipsisIcon,
//   UserGroupIcon,
//   ArrowRightOnRectangleIcon 
// } from "@heroicons/react/24/solid"; // Import specific icons

// import UserList from "./UserList";
// import { useAuth } from "../contexts/AuthContext";
// import CreateGroup from "./CreateGroup";

// const ChatRoom = () => {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isCreateGroupVisible, setIsCreateGroupVisible] = useState(false);
//   const { logout } = useAuth();

//   return (
//     <div className="flex h-screen">
     

//       <div className="w-20 border-r bg-gray-800 border-gray-300 p-4 flex flex-col flex  justify-between  items-center space-y-8">
//         <div className="flex  space-y-8 flex-col">
//           {/* Chats Button */}
//           <button className="p-3 rounded-full bg-gray-700 hover:bg-green-600 transition duration-300 ease-in-out">
//             <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-white" />
//           </button>

//           {/* Groups Button */}
//           <button className="p-3 rounded-full bg-gray-700 hover:bg-green-600 transition duration-300 ease-in-out">
//             <UserGroupIcon className="h-6 w-6 text-white" />
//           </button>
//         </div>
//         <div>
//     <button
//       onClick={logout}
//       className="p-3 text-white hover:bg-red-600 rounded-full"
//     >
//       <ArrowRightOnRectangleIcon className="h-6 w-6" />
//     </button>
//   </div>
//       </div>

//       {/* <div className="w-1/4 border-r border-gray-300 p-4">     
//         <div>
//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
//             onClick={() => setIsCreateGroupVisible(true)}
//           >
//             Create Group
//           </button>

//           {isCreateGroupVisible && (
//             <CreateGroup onClose={() => setIsCreateGroupVisible(false)} />
//           )}
//         </div>
//       </div>  */}
//       <div className="w-1/4 border-r bg-gray-800 text-white border-gray-300 p-4">
//         <UserList onSelectUser={setSelectedUser} />
//         {/*<div>
//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
//             onClick={() => setIsCreateGroupVisible(true)}
//           >
//             Create Group
//           </button> 

//           {isCreateGroupVisible && (
//             <CreateGroup onClose={() => setIsCreateGroupVisible(false)} />
//           )}
//         </div>*/}
//       </div>

//       <div className="flex-1 overflow-auto ">
//         {selectedUser ? (
//           <>
//             <ChatWindow
//               recipientId={selectedUser.id}
//               recipientName={selectedUser.name}
//               isGroup={selectedUser.isGroup}
//             />
//           </>
//         ) : (
//           <p className="text-center text-gray-500 text-lg mt-4">
//             Select a user to start chatting...
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;


import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import CreateGroup from "./CreateGroup";
import {
  ChatBubbleLeftEllipsisIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/solid";
import { useAuth } from "../contexts/AuthContext";

const ChatRoom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateGroupVisible, setIsCreateGroupVisible] = useState(false);
  const { logout } = useAuth();
  const [view, setView] = useState('chats'); // 'chats' or 'groups'

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-20 border-r bg-gray-900 border-gray-300 p-4 flex flex-col justify-between items-center">
        <div className="flex flex-col space-y-4">
          {/* Chats Button */}
          <button
            onClick={() => setView('chats')}
            className={`p-3 rounded-full ${view === 'chats' ? 'bg-green-600' : 'bg-gray-700'} hover:bg-green-600 transition duration-300 ease-in-out`}
          >
            <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-white" />
          </button>

          {/* Groups Button */}
          <button
            onClick={() => setView('groups')}
            className={`p-3 rounded-full ${view === 'groups' ? 'bg-green-600' : 'bg-gray-700'} hover:bg-green-600 transition duration-300 ease-in-out`}
          >
            <UserGroupIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-3 text-white hover:bg-red-600 rounded-full"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
        </button>
      </div>

      {/* User List or Create Group Section */}
      <div className="w-1/4 border-r bg-gray-800 border-gray-300 p-4">
        {view === 'chats' && <UserList onSelectUser={setSelectedUser} view={view} />}
        {view === 'groups' && (
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
            <UserList onSelectUser={setSelectedUser} view={view} />
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-auto p-2 bg-gray-800">
        {selectedUser ? (
          <ChatWindow
            recipientId={selectedUser.id}
            recipientName={selectedUser.name}
            isGroup={selectedUser.isGroup}
          />
        ) : (
          <p className="text-center text-gray-500 text-lg mt-4">
            Select a user or group to start chatting...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
