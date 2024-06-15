// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSoR8KjIpJTdrZoGKrejKlYDs2l4gaMZ8",
    authDomain: "function-aa1ad.firebaseapp.com",
    projectId: "function-aa1ad",
    storageBucket: "function-aa1ad.appspot.com",
    messagingSenderId: "1083115491271",
    appId: "1:1083115491271:web:c376bef34b049bfb7a13e2",
    measurementId: "G-PLQ5SQ939Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Gerar nome de usuário único
function generateUserName() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let userName = '';
    for (let i = 0; i < 4; i++) {
        userName += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 3; i++) {
        userName += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return userName;
}

const userName = generateUserName();



// Função para enviar mensagens
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const messageText = input.value.trim();

    if (messageText !== '') {
        try {
            await addDoc(collection(db, 'chat'), {
                name: userName,
                text: messageText,
                timestamp: serverTimestamp()
            });
            input.value = '';
        } catch (e) {
            console.error('Erro ao adicionar documento: ', e);
        }
    }
}

// Ouvir novas mensagens
onSnapshot(collection(db, 'chat'), (snapshot) => {
    const messages = document.getElementById('messages');
    messages.innerHTML = '';
    snapshot.forEach((doc) => {
        const message = document.createElement('div');
        message.className = 'message';
        const data = doc.data();
        const messageDate = new Date(data.timestamp.seconds * 1000).toLocaleString();
        message.innerHTML = `
            <div class="name">${data.name}</div>
            <div class="text">${data.text}</div>
            <div class="timestamp">${messageDate}</div>
        `;
        messages.appendChild(message);
    });
    messages.scrollTop = messages.scrollHeight;
});

// Adiciona o evento ao botão após o carregamento do módulo
document.getElementById('sendButton').addEventListener('click', sendMessage);

// Envia a mensagem quando pressionar Enter
document.getElementById('messageInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

