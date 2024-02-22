// Adding Functionality
// You now need to open the index.js file. 
// This is where we will build out the functionality of our application step by step.

// Initializing the Application
// You need to tell your application how to connect to the 
// Realtime Database we created and initialize the Firebase application.

// Copy the firebaseConfig for your application from the 
// Firebase Project Console and paste it into your index.js file. 
// Then add the following lines of code:


var firebaseConfig = {
    apiKey: "AIzaSyCXImSzbJhdzmVkcMzZc8LgN9EDaCH6WUw",
    authDomain: "lowpro-chat.firebaseapp.com",
    databaseURL: "https://lowpro-chat-default-rtdb.firebaseio.com",
    projectId: "lowpro-chat",
    storageBucket: "lowpro-chat.appspot.com",
    messagingSenderId: "401818287275",
    appId: "1:401818287275:web:2d2e236e4c9d94a3cc0bee",
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const db = firebase.database();
  
  const username = prompt("Please Tell Us Your Name");


//   Sending Messages
// In order to send messages, users will type into the input form provided and 
// click on the ‘Send’ button. Your app will subscribe to the submit event 
// when the ‘Send’ button is clicked and then call the sendMessage() function.

// The sendMessage() function will:
// Prevent the default form behaviour
// Capture and store the message sent by the user
// Clear the input box
// Scroll to the bottom of the page where the new message will appear
// Add the message to the database
// Edit your index.js file to contain the following code:

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


//   Receiving Text Messages
// When a message is sent by one user it needs to be received by the other users of the application.

// Edit your index.js file to contain the following code:

const fetchChat = db.ref("messages/");

fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const message = `<li class=${
    username === messages.username ? "sent" : "receive"
  }><span>${messages.username}: </span>${messages.message}</li>`;
  // append the message on the page
  document.getElementById("messages").innerHTML += message;
});

// In the code above, you subscribe to the database's 
// child_added event in order to be notified when new messages are 
// added to the database. When a new message is added, it is appended to the <ul> 
// element you created earlier as a new list item.
// At this point, if you open your application in a browser it should be possible to:
// Specify a username
// Send and receive messages