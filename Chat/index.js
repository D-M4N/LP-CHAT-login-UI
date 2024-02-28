// Import Firebase
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";

// Initialize Firebase
const firebaseConfig = {
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

// Get references to Firebase services
const storage = firebase.storage();
const storageRef = storage.ref();
const db = firebase.database().ref('https://lowpro-chat-default-rtdb.firebaseio.com');

// Function to send chat message
function sendMessage(message) {
  // Use push() to generate a unique key for each message
  db.push().set({
    message: message,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}


// Function to upload media
function uploadMedia(file) {
  const storageRef = storage.ref();
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

// Function to save media to the database
function saveMediaToDatabase(downloadURL) {
  const timestamp = firebase.database.ServerValue.TIMESTAMP;
  const message = {
    username,
    media: downloadURL,
  };

  // Save the message to the Firebase Realtime Database
  db.ref("media/" + timestamp).set(message);
}


// Fetch Media
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


// Button to trigger media upload
const mediaInput = document.getElementById("media-input");
const mediaUploadBtn = document.getElementById("media-upload-btn");

mediaUploadBtn.addEventListener("click", () => {
  if (mediaInput.files.length > 0) {
    uploadMedia(mediaInput.files[0]);
  }
});

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



