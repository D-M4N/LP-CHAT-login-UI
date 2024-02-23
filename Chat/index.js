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

  if (message || imageUploadTask) {
  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });


    if (imageUploadTask) {
      return;
    }

  // create db collection and send in the data
  const timestamp = Date.now();
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

  if (messages.image) {
    message = `<li class=${
      username === messages.username ? "sent" : "receive"
    }><img src="${messages.image}" alt="${messages.username}'s image" /></li>`;
  } else {
    message = `<li class=${
      username === messages.username ? "sent" : "receive"
    }><span>${messages.username}: </span>${messages.message}</li>`;
  }

  // append the message on the page
  document.getElementById("messages").innerHTML += message;
});

function uploadImage(file) {
  const storageRef = firebase.storage().ref();
  const uploadTask = storageRef.child(`images/${file.name}`).put(file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // You can add a progress bar here if needed
    },
    (error) => {
      // Handle errors during upload
      console.error("Error uploading image", error);
    },
    () => {
      // Handle successful uploads on complete
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        saveImageToDatabase(downloadURL);
      });
    }
  );
}

function saveImageToDatabase(downloadURL) {
  const timestamp = Date.now();
  db.ref("messages/" + timestamp).set({
    username,
    message: "",
    image: downloadURL,
  });
}

const imageInput = document.getElementById("image-input");
const imageUploadBtn = document.getElementById("image-upload-btn");

imageUploadBtn.addEventListener("click", () => {
  if (imageInput.files.length > 0) {
    uploadImage(imageInput.files[0]);
  }
});
}