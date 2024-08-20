import React, { useEffect, useState, useRef } from "react";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/16/solid";
// import { PlayIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid'; 
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { MicrophoneIcon, StopIcon } from "@heroicons/react/16/solid";
import { firestore } from "../firebase/firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// eslint-disable-next-line react/prop-types
const ChatWindow = ({ recipientId, recipientName, isGroup }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [message, setMessage] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [videoFile, setVideoFile] = useState(null);
  const storage = getStorage();
const endOfMessagesRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (videoFile) {
      await handleVideoSend(); // Upload video and send the URL
    } else {
      if (!message.trim()) return;

      try {
        const chatId = isGroup
          ? recipientId
          : [user.uid, recipientId].sort().join("_");
        const ref = collection(
          firestore,
          isGroup ? "groups" : "chats",
          chatId,
          "messages"
        );

        await addDoc(ref, {
          text: message,
          timestamp: serverTimestamp(),
          senderId: user.uid,
          recipientId,
        });

        setMessage("");
      } catch (error) {
        console.error("Error sending message: ", error);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mimeType = "audio/webm;codecs=opus";

        if (MediaRecorder.isTypeSupported(mimeType)) {
          mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
        } else {
          alert("Desired audio format is not supported by your browser.");
          return;
        }

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mimeType,
          });
          audioChunksRef.current = [];
          const chatId = isGroup
            ? recipientId
            : [user.uid, recipientId].sort().join("_");
          await saveVoiceMessage(audioBlob, chatId, user.uid);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } else {
        alert("Your browser does not support audio recording.");
      }
    }
  };

  const saveVoiceMessage = async (audioBlob, chatId, userId) => {
    const storage = getStorage();
    const storageRef = ref(storage, `voiceMessages/${Date.now()}.webm`);

    try {
      const snapshot = await uploadBytes(storageRef, audioBlob, {
        contentType: "audio/webm",
      });

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Download URL:", downloadURL);

      await addDoc(
        collection(firestore, isGroup ? "groups" : "chats", chatId, "messages"),
        {
          senderId: userId,
          audioUrl: downloadURL,
          timestamp: serverTimestamp(),
        }
      );
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  const handleVideoSend = async () => {
    if (videoFile) {
      const storageRef = ref(storage, `videos/${Date.now()}_${videoFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, videoFile);

      uploadTask.on(
        "state_changed",
        () => {
          // Progress handling
        },

        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          try {
            const chatId = isGroup
              ? recipientId
              : [user.uid, recipientId].sort().join("_");
            const ref = collection(
              firestore,
              isGroup ? "groups" : "chats",
              chatId,
              "messages"
            );

            await addDoc(ref, {
              videoUrl: downloadURL,
              timestamp: serverTimestamp(),
              senderId: user.uid,
              recipientId,
            });
          } catch (error) {
            console.error("Error sending video message: ", error);
            alert("Failed to send video. Please try again.");
          }

          setVideoFile(null);
        }
      );
    }
  };

  //from here chatWindow

  useEffect(() => {
    const usersRef = collection(firestore, "users");
    const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
      const userMap = {};
      querySnapshot.forEach((doc) => {
        userMap[doc.id] = doc.data().name;
      });
      setUserDetails(userMap);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!recipientId) return;

    // Differentiate between individual chat and group chat
    const ref = isGroup
      ? collection(firestore, "groups", recipientId, "messages") // Use group ID for group chat
      : collection(
          firestore,
          "chats",
          [user.uid, recipientId].sort().join("_"),
          "messages"
        ); // Use chat ID for individual chat

    const q = query(ref, orderBy("timestamp"));

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

useEffect(() => {
  // Scroll to the bottom of the chat window when messages change
  endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


  function formatTimestamp(timestamp) {
    const date = timestamp.toDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutesFormatted} ${ampm}`;
  }

  return (
    <div className="flex flex-col h-full bg-gray-800 border-l border-gray-300">
      <div className="p-4 text-lg font-semibold bg-gray-800 text-white border-b border-gray-300 ">
        {recipientName || "Unknown"}
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-700">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet...</p>
        ) : (
          messages.map((message) => {
            const formattedTime = message.timestamp
              ? formatTimestamp(message.timestamp)
              : "";
            const senderName = userDetails[message.senderId] || "Unknown User";

            return (
              <div
                key={message.id}
                className={`mb-3 p-3 rounded-lg max-w-[40%] break-words ${
                  message.senderId === user.uid
                    ? "bg-[#075e54] text-white ml-auto text-right"
                    : "bg-gray-500 text-white  text-left mr-auto"
                }`}
              >
                <div className="text-xs text-[#FAF9F6] font-bold mb-1">
                  {senderName}
                </div>
                {message.videoUrl ? (
                  <div>
                    <video controls className="w-full rounded-lg">
                      <source src={message.videoUrl} type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                    <div className="text-xs text-[#EDEADE] mt-1">
                      {formattedTime}
                    </div>
                  </div>
                ) : message.audioUrl ? (
                  <div>
                    <audio controls className="w-full">
                      <source src={message.audioUrl} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="text-xs text-[#EDEADE] mt-1">
                      {formattedTime}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-md">{message.text}</div>
                    <div className="text-xs text-[#EDEADE] mt-1">
                      {formattedTime}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={endOfMessagesRef} />
      </div>


      
      <form
        onSubmit={handleSubmit}
        className="p-2 bg-gray-800 border-t border-gray-300 flex items-center"
      >
      <input
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
        <label
          htmlFor="video-upload"
          className="mr-2 cursor-pointer text-gray-400 hover:text-white"
        >
          <PaperClipIcon className="h-6 w-6" />
        </label>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg outline-none"
        />

        

        <button
          onClick={toggleRecording}
          className="flex items-center p-2 bg-green-500 ml-2 hover:bg-green-600 text-white rounded-full shadow-lg transition duration-200"
        >
          {isRecording ? (
            <StopIcon className="h-6 w-6" />
          ) : (
            <MicrophoneIcon className="h-6 w-6" />
          )}
        </button>

        <button
          type="submit"
          className="ml-3 p-3 bg-green-400 rounded-full hover:bg-green-600 flex items-center justify-center"
        >
          <PaperAirplaneIcon className="w-6 h-6 text-white transform rotate-45" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

