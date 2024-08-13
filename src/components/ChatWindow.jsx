import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

// eslint-disable-next-line react/prop-types
const ChatWindow = ({ recipientId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!recipientId) return; // No recipient selected

    const chatId = [user.uid, recipientId].sort().join('_');
    const ref = collection(firestore, 'chats', chatId, 'messages');
    const q = query(ref, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user.uid, recipientId]);

  return (
    <div className="p-4 bg-gray-50 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
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
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
