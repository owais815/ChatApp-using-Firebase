import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

// eslint-disable-next-line react/prop-types
const ChatWindow = ({ recipientId, recipientName, isGroup }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!recipientId) return; // No recipient selected

    // Differentiate between individual chat and group chat
    const ref = isGroup
      ? collection(firestore, 'groups', recipientId, 'messages') // Use group ID for group chat
      : collection(firestore, 'chats', [user.uid, recipientId].sort().join('_'), 'messages'); // Use chat ID for individual chat

    const q = query(ref, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Messages fetched:", msgs);
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user.uid, recipientId, isGroup]);

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="p-2 text-lg font-semibold border-b border-gray-300">
        {recipientName || 'Unknown'}
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet...</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-3 rounded-lg max-w-xs break-words ${
                message.senderId === user.uid
                  ? 'bg-green-200 ml-auto text-right'
                  : 'bg-gray-200 text-left mr-auto'
              }`}
              style={{ maxWidth: '35%', minWidth: '20%' }}
            >
              {message.audioUrl ? (
                <audio controls className="w-full">
                  <source src={message.audioUrl} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div className="text-sm">{message.text}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
