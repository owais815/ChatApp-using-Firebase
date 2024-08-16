import React, { useState, useRef } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// eslint-disable-next-line react/prop-types
const ChatInput = ({ recipientId, isGroup }) => {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      const chatId = isGroup ? recipientId : [user.uid, recipientId].sort().join('_');
      const ref = collection(firestore, isGroup ? 'groups' : 'chats', chatId, 'messages');

      await addDoc(ref, {
        text: message,
        timestamp: serverTimestamp(),
        senderId: user.uid,
        recipientId,
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message: ', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = 'audio/webm;codecs=opus';
        
        if (MediaRecorder.isTypeSupported(mimeType)) {
          mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
        } else {
          alert('Desired audio format is not supported by your browser.');
          return;
        }
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
  
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          audioChunksRef.current = [];
          const chatId = isGroup ? recipientId : [user.uid, recipientId].sort().join('_');
          await saveVoiceMessage(audioBlob, chatId, user.uid);
        };
  
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } else {
        alert('Your browser does not support audio recording.');
      }
    }
  };

  const saveVoiceMessage = async (audioBlob, chatId, userId) => {
    const storage = getStorage();
    const storageRef = ref(storage, `voiceMessages/${Date.now()}.webm`);

    try {
      const snapshot = await uploadBytes(storageRef, audioBlob, {
        contentType: 'audio/webm',
      });

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL:', downloadURL);

      await addDoc(collection(firestore, isGroup ? 'groups' : 'chats', chatId, 'messages'), {
        senderId: userId,
        audioUrl: downloadURL,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  return (
    <div className="p-4 border-t border-gray-300 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={toggleRecording}
          className="p-2 bg-blue-500 ml-4 text-white rounded-lg"
        >
          {isRecording ? 'Stop 🛑' : 'Start 🎤'}
        </button>
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
