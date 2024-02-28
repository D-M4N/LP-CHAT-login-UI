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

import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.database();

const sendMessage = async (message) => {
  try {
    await db.collection('https://lowpro-chat-default-rtdb.firebaseio.com').add(message);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

const username = prompt("Please Tell Us Your Name");

// Get a reference to the "messages" node
const messagesRef = db.ref("messages");

// Save the message to the Firebase Realtime Database
messagesRef.push({
  username,
  media: downloadURL,
});

// Sending Messages
const form = document.getElementById("message-form");
form.addEventListener("submit", sendMessage);

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


// display images
function displayImage(url) {
  const img = document.createElement("img");
  img.src = url;
  img.alt = "Image";
  document.getElementById("messages").appendChild(img);
}

// Replace "your-image-url" with the actual Firebase Storage download URL
const storage = firebase.storage();
const storageRef = storage.ref();
const imageRef = storageRef.child("path/to/your/image.jpg");

imageRef.getDownloadURL().then((url) => {
  displayImage(url);
}).catch((error) => {
  // Handle any errors
  console.error("Error fetching image", error);
});

// media upload
function uploadMedia(file) {
  const storageRef = firebase.storage().ref();
  const uploadTask = storageRef.child(`media/${file.name}`).put(file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // You can add a progress bar here if needed
    },
    (error) => {
      // Handle errors during upload
      console.error("Error uploading media", error);
    },
    () => {
      // Handle successful uploads on complete
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        saveMediaToDatabase(downloadURL);
      });
    }
  );
}

function saveMediaToDatabase(downloadURL) {
  const timestamp = Date.now();
  const message = {
    username,
    media: downloadURL.toString(), // Convert the download URL to a string
  };

  // Save the message to the Firebase Realtime Database
//   db.ref("messages/" + timestamp).set(message);
// }
// Save the message to the Firebase Realtime Database
db.ref("media/" + timestamp).set(message);
}

//old rules

// {
//   "rules": {
//     ".read": "now < 1711144800000",  // 2024-3-23
//     ".write": "now < 1711144800000",  // 2024-3-23
//   }
// }

//Authorization rules
// {
//   "rules": {
//     ".read": true,
//     ".write": "auth != null"
//   }
// }

//open rules
// {
//   "rules": {
//     ".read": true,
//     ".write": true
//   }
// }


//Button
const mediaInput = document.getElementById("media-input");
const mediaUploadBtn = document.getElementById("media-upload-btn");

mediaUploadBtn.addEventListener("click", () => {
  if (mediaInput.files.length > 0) {
    uploadMedia(mediaInput.files[0]);
  }
});

//Fetch Media
const fetchMedia = db.ref("media/");

fetchMedia.on("child_added", function (snapshot) {
  const mediaData = snapshot.val();
  let mediaElement = "";

  if (mediaData.media.endsWith(".jpg") || mediaData.media.endsWith(".jpeg") || mediaData.media.endsWith(".png")) {
    mediaElement = `<li class=${
      username === mediaData.username ? "sent" : "receive"
    }><img src="${mediaData.media}" alt="${mediaData.username}'s image" /></li>`;
  } else if (mediaData.media.endsWith(".mp4") || mediaData.media.endsWith(".mov") || mediaData.media.endsWith(".avi")) {
    mediaElement = `<li class=${
      username === mediaData.username ? "sent" : "receive"
    }><video controls><source src="${mediaData.media}" type="video/${mediaData.media.split('.').pop()}"></video></li>`;
  } else if (mediaData.media.endsWith(".mp3") || mediaData.media.endsWith(".wav")) {
    mediaElement = `<li class=${
      username === mediaData.username ? "sent" : "receive"
    }><audio controls><source src="${mediaData.media}" type="audio/${mediaData.media.split('.').pop()}"></audio></li>`;
  }

  // Append the media on the page
  document.getElementById("messages").innerHTML += mediaElement;
});

