"use client";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase"; // Adjust path for relative import

import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const router = useRouter();

  // Random welcome messages
  const messages = [
    "Hey, {name}! Ready to conquer the cloud?",
    "{name}, your files await you! Let's go!",
    "Welcome back, {name}! What’s new today?",
    "Hello {name}, let’s keep your data safe and sound!",
    "{name}, your cloud space looks amazing today!",
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    };

    fetchUser();
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const storageRef = ref(storage, `uploads/${auth.currentUser?.uid}/`);
    const result = await listAll(storageRef);
    const urls = await Promise.all(
      result.items.map(async (item) => ({
        name: item.name,
        url: await getDownloadURL(item),
      }))
    );
    setFiles(urls);
  };

  const handleUpload = async () => {
    if (!file) return;
    const fileRef = ref(storage, `uploads/${auth.currentUser.uid}/${file.name}`);
    await uploadBytes(fileRef, file);
    fetchFiles();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-6">
        {user &&
          messages[Math.floor(Math.random() * messages.length)].replace(
            "{name}",
            user.firstName
          )}
      </h1>

      {/* File Upload */}
      <div className="mt-6 flex flex-col items-center">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2 bg-gray-800 rounded"
        />
        <button onClick={handleUpload} className="mt-4 bg-blue-600 p-3 rounded">
          Upload File
        </button>
      </div>

      {/* Display Uploaded Files */}
      <div className="mt-8 w-3/4">
        <h2 className="text-2xl font-bold">Your Uploaded Files</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <a
              key={index}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-800 rounded-lg"
            >
              {file.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}