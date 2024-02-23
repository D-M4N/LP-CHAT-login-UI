var firebaseConfig = {
  apiKey: "AIzaSyCXImSzbJhdzmVkcMzZc8LgN9EDaCH6WUw",
  authDomain: "lowpro-chat.firebaseapp.com",
  databaseURL: "https://lowpro-chat-default-rtdb.firebaseio.com",
  projectId: "lowpro-chat",
  storageBucket: "lowpro-chat.appspot.com",
  messagingSenderId: "401818287275",
  appId: "1:401818287275:web:2d2e236e4c9d94a3cc0bee",
  measurementId: "G-BB1WMBCHER"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const username = prompt("Please Tell Us Your Name");

// Sending Messages
function sendMessage(e) {
  e.preventDefault();

  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // create db collection and send in the data
  db.ref("messages/" + timestamp).set({
    username,
    message,
  });
}

// Attach the sendMessage function to the form submit event
const form = document.getElementById("message-form");
form.addEventListener("submit", sendMessage);

// Receiving Text Messages
const fetchChat = db.ref("messages/");

fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const message = `<li class=${
    username === messages.username ? "sent" : "receive"
  }><span>${messages.username}: </span>${messages.message}</li>`;

  // append the message on the page
  document.getElementById("messages").innerHTML += message;
});