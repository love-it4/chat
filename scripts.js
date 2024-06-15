import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDSoR8KjIpJTdrZoGKrejKlYDs2l4gaMZ8",
  authDomain: "function-aa1ad.firebaseapp.com",
  projectId: "function-aa1ad",
  storageBucket: "function-aa1ad.appspot.com",
  messagingSenderId: "1083115491271",
  appId: "1:1083115491271:web:c376bef34b049bfb7a13e2",
  measurementId: "G-PLQ5SQ939Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usernameInput = document.getElementById('username');
const createUserButton = document.getElementById('create-user');
const header = document.getElementById('header');
const chatSection = document.getElementById('chat-section');
const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message');
const messagesDiv = document.getElementById('messages');

createUserButton.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (username) {
    const userDoc = doc(db, 'users', username);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      alert('User already exists');
    } else {
      await setDoc(userDoc, { name: username });
      localStorage.setItem('username', username);
      header.textContent = username;
      usernameInput.value = '';
      chatSection.classList.remove('hidden');
      loadMessages();
    }
  } else {
    alert('Please enter a username');
  }
});

const savedUsername = localStorage.getItem('username');
if (savedUsername) {
  header.textContent = savedUsername;
  chatSection.classList.remove('hidden');
  loadMessages();
}

async function loadMessages() {
  const q = query(collection(db, 'chat'), orderBy('id', 'asc'));
  onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = '';
    snapshot.forEach((doc) => {
      const messageData = doc.data();
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message');
      messageDiv.innerHTML = `
        <div class="sender">${messageData.sender}</div>
        <div class="text">${messageData.text}</div>
        <div class="timestamp">${new Date(messageData.timestamp.toDate()).toLocaleString()}</div>
      `;
      messagesDiv.appendChild(messageDiv);
    });
  });
}

sendMessageButton.addEventListener('click', async () => {
  const text = messageInput.value.trim();
  if (text) {
    const username = localStorage.getItem('username');
    const messagesSnapshot = await getDocs(collection(db, 'chat'));
    let messageId = 1;
    if (!messagesSnapshot.empty) {
      messageId = messagesSnapshot.size + 1;
    }
    await addDoc(collection(db, 'chat'), {
      id: messageId,
      sender: username,
      text: text,
      timestamp: new Date()
    });
    messageInput.value = '';
  } else {
    alert('Please enter a message');
  }
});
