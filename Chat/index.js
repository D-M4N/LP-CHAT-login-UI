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
const database = firebase.database().ref();
const messagesRef = database.child('messages');
// Get the file input, upload button, and progress bar elements
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-button');
const progressBarContainer = document.getElementById('progress-bar-container');
const progressBar = document.getElementById('progress-bar');

// Set the upload button's listener
uploadButton.addEventListener('click', () => {
  // Get the selected file
  const file = fileInput.files[0];

// Create a reference to the file in the storage
const fileRef = storageRef.child(`files/${file.name}`);

// Create a task to upload the file
const task = fileRef.put(file);

// Set the progress bar's maximum value to the file size
progressBar.max = file.size;

// Set the progress bar's value to zero
progressBar.value = 0;

// Set the progress bar's visibility to true
progressBarContainer.style.visibility = 'visible';

// Add a listener for the task's progress
task.on('state_changed', (snapshot) => {
  // Get the progress of the upload
  const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

  // Set the progress bar's value to the progress
  progressBar.value = snapshot.bytesTransferred;

  // Set the progress bar's text to the progress
  progressBar.textContent = `${Math.round(percentage)}%`;

  // Set the progress bar's color based on the progress
  if (percentage < 50) {
    progressBar.style.backgroundColor = '#e66465';
  } else if (percentage < 80) {
    progressBar.style.backgroundColor = '#f7b801';
  } else {
    progressBar.style.backgroundColor = '#6fcf97';
  }
});

// Add a listener for the task's completion
task.then((snapshot) => {
  // Get the download URL for the uploaded file
  const downloadURL = snapshot.ref.getDownloadURL();

  // Set the download URL to the message
  database.push().set({
    downloadURL: downloadURL,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  }).then(() => {
    // Hide the progress bar
    progressBarContainer.style.visibility = 'hidden';
  });
}).catch((error) => {
  // Handle the error
  console.error(error);

  // Hide the progress bar
  progressBarContainer.style.visibility = 'hidden';
});
});


//send messages button

// Add a click event listener to the send button
sendButton.addEventListener('click', () => {
  // Get the message text
  const messageText = messageInput.value;

  // Exit if the message is empty
  if (!messageText) {
    return;
  }

  // Clear the message input
  messageInput.value = '';

  // Save the message to the database
  messagesRef.push().set({
    message: messageText,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
});


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


// {
//   "rules": {
//     ".read": "auth != null",
//     ".write": "auth != null"
//   }
// }
