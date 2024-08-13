import React, { useRef } from 'react';
import { addDoc, collection } from 'firebase/firestore'; // Use 'firebase/firestore'
import { firestore } from '../firebase/firebaseConfig'; 
import { useAuth } from '../contexts/AuthContext';
// Ensure correct path

const HomeComp = () => {
  const { logout } = useAuth();
  const message = useRef();
  const ref = collection(firestore, "message"); // Use firestore

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageValue = message.current.value.trim();

    if (!messageValue) {
      alert("Message cannot be empty");
      return;
    }

    const data = { message: messageValue };

    try {
      await addDoc(ref, data);
      alert("Message added successfully!");
      console.log(messageValue);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add message, please try again.");
    }
  };

  return (
    <div>

      <form onSubmit={handleSubmit}>
        {/* <input  className="border:blue m-4 px-4 py-2 rounded bg-gray-200" type="text" ref={message} />
        <button  className="bg-blue-500 m-4 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">Save</button> */}
        <button  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={logout}>Logout</button>
      </form>
    </div>
  );
};

export default HomeComp;
