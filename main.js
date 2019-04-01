// Initialize Firebase

  var config = {
    apiKey: "AIzaSyB95vKDjLpR0ikqX3aAl31q4PfLtgmF_kA",
    authDomain: "peoples-of-nigeria.firebaseapp.com",
    databaseURL: "https://peoples-of-nigeria.firebaseio.com",
    projectId: "peoples-of-nigeria",
    storageBucket: "peoples-of-nigeria.appspot.com",
    messagingSenderId: "13075555821"
  };

firebase.initializeApp(config);

  
// Reference messages collection
var collection = 'peoples';

var messagesRef = firebase.database().ref(collection);
  
// uploader
var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');
var uploadURL;

// listes for file selection
fileButton.addEventListener('change', function(e) {
    //get file
    var file = e.target.files[0];

    // create a storage ref
    var storageRef = firebase.storage().ref('people_icons/' + file.name);

    // upload file to firebase stora
    var task = storageRef.put(file);

    // update progress bar
    // 3 types of state changes in form of functions
    task.on('state_changed',
        function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            uploader.value = percentage;    
            
        },
        function error(err){
            console.log(err)

        },
        function complete () {
            // get the download url
            task.snapshot.ref.getDownloadURL()
            .then ((url) => {
                uploadURL = url;
                console.log(uploadURL);
            })
        }
    );
})


  // Listen for form submit
  document.getElementById('contactForm').addEventListener('submit', submitForm);
  
  // Submit form
  function submitForm(e){
    e.preventDefault();
  
    // Get values
    var name = getInputVal('name');
    var lname = getInputVal('lname');
    var kingdom = getInputVal('kingdom');
    var email = getInputVal('email');
    var phone = getInputVal('phone');
    var message = getInputVal('message');
    var iconurl = uploadURL;

    // Save message
    saveMessage(name, lname, kingdom, email, phone, message, iconurl);
  
    // Show alert
    document.querySelector('.alert').style.display = 'block';
  
    // Hide alert after 3 seconds
    setTimeout(function(){
      document.querySelector('.alert').style.display = 'none';
    },3000);
  
    // Clear form
    document.getElementById('contactForm').reset();
  
    // Read data and population output
    document.getElementById('output').innerHTML = "<hr>"
    readDataOutput(collection);
  }
  
  // Function to get get form values
  function getInputVal(id){
    return document.getElementById(id).value;
  }
  
  // Save message to firebase
  function saveMessage(name, lname,kingdom, email, phone, message,uploadURL){
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
      name: name,
      lname:lname,
      kingdom:kingdom,
      email:email,
      phone:phone,
      message:message,
      iconurl:uploadURL
    });
  }

  // Read db data and write to output div
  function readDataOutput(collection) {
    // Get a database reference to our posts
    var ref = firebase.database().ref(collection);
    // Attach an asynchronous callback to read the data at our posts reference
    var divout = document.getElementById("output");
    var k = 0;
    ref.on("child_added", function(snapshot) {
        vals = snapshot.val();
        var html = '<div class="row wrapperout"><div class="col">' + vals.name;
        html +=   '</div><div class="col">' + vals.lname + '</div><div class="col">' + vals.kingdom;
        html +=  '</div><div class="col">'+vals.phone + '</div><div class="col">' + vals.email + '</div> <div class="col">';
        html +=   vals.message + '</div>'+'<div class="col">' +'<img id="iconurl" src="'+ vals.iconurl+'"></div></div>';
        
        divout.innerHTML += html
        
    }, 
    function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    document.getElementById('output').innerHTML += "</table>";
  }
  