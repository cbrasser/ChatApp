import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getFirestore, orderBy, query, collection, doc, setDoc, onSnapshot, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyAQ9pCLKploVByyScEYnj3yMsoNFPIt14g",
            authDomain: "ffinfchat.firebaseapp.com",
            projectId: "ffinfchat",
            storageBucket: "ffinfchat.appspot.com",
            messagingSenderId: "787327787927",
            appId: "1:787327787927:web:a63c242f4ba509f53c1ad2"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        const db = getFirestore();
        const q = query(collection(db, "messages"), orderBy("timestamp"));

        async function submitMessage() {
            let message = document.getElementById("input").value
            let username = document.getElementById("username").value
            if (message == "" || username == "") {
                return
            }
            const docRef = await addDoc(collection(db, "messages"), {
                message: message,
                author: username,
                timestamp: Timestamp.now()
            });
            document.getElementById("input").value = ""
        }
        function syncMessages() {
            let messageContainer = document.getElementById("messages")
            let messages = messageContainer.childNodes;
            let username = document.getElementById("username").value

            messages.forEach(message => {
                let author = message.querySelector(".author").textContent;
                let nachricht = message.querySelector(".text").textContent;
                

                if (author == username) {
                    message.classList.add("own")
                } else {
                    message.classList = ["message"]
                    if (nachricht.startsWith("@")) {
                        let empfaenger = nachricht.split(" ")[0].split("@")[1]
                        console.log(empfaenger)
                        console.log(username)
                        if (empfaenger != username) {
                            message.classList.add("hidden")
                        }
                    }
                    
                }

            });
        }
        let inputField = document.getElementById("username")
        inputField.addEventListener('input', syncMessages);
        inputField.addEventListener('propertychange', syncMessages);
        document.getElementById("submitButton").onclick = submitMessage;

        function updateComments(comments) {
            let kommentarListe = document.getElementById("messages")
            kommentarListe.innerHTML = ""
            let kommentareHTML = ""
            comments.forEach(comment => {
                kommentareHTML += `<div class="message ${comment.author == document.getElementById("username").value ? "own" : ""}"><div class="author">${comment.author}</div> <div class="text">${comment.message}</div></div>`
            });
            kommentarListe.innerHTML += kommentareHTML
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push(doc.data());

            });
            updateComments(messages)
            syncMessages()
        });
