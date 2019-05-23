
//---------------------


//LOAD  .js files here ... can't get to work though ... for now includ the following

var script = document.createElement('script');
script.src = 'https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js';
document.getElementsByTagName('head')[0].appendChild(script);

var script = document.createElement('script');
script.src = 'https://www.gstatic.com/firebasejs/5.9.4/firebase-storage.js';
document.getElementsByTagName('head')[0].appendChild(script);

var script = document.createElement('script');
script.src = 'https://www.gstatic.com/firebasejs/5.9.4/firebase-database.js';
document.getElementsByTagName('head')[0].appendChild(script);

var script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js';
document.getElementsByTagName('head')[0].appendChild(script);

var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(script);


//---------------------

//firebase
var config = {
apiKey: "AIzaSyD8EYxSsouxIjlHEhbascyGmV4fbVGuArU",
authDomain: "wedweb-67168.firebaseapp.com",
databaseURL: "https://wedweb-67168.firebaseio.com",
projectId: "wedweb-67168",
storageBucket: "wedweb-67168.appspot.com",
messagingSenderId: "1049950905472"
};
firebase.initializeApp(config);
const storageService = firebase.storage();
const storageRef = storageService.ref();



//---------------------

//prevent enter key submiting form
$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});
//If not empty submit on click
$(document).ready(function() {
if ($('#rsvp-form').length > 0 ) {
    rsvpSubmitScript();
}
});

document.getElementById("rsvp-submit").addEventListener("click", function(){
    document.getElementById("form-response").innerHTML = "Thanks for responding!"
});

function rsvpSubmitScript() {

    var b = firebase.database().ref("rsvp");
        $("#rsvp-form").submit(function(config) { $(this), console.log("Submit rsvp to Firebase");
        var n = $("#rsvp-n").val(),
            en = $("#rsvp-en").val(),
            yn = $("#rsvp-yn").val(),
            m = $("#rsvp-m").val(),
            f = { name: n, entre: en, status: yn, message:m};
        return b.push(f).then(function(config) {
            $(".sucess").css("display", "block"),
            $(".sucess-none").css("display", "none") }), !1 })
    
}



//-----------------------


document.querySelector('.file-select').addEventListener('change', handleFileUploadChange);
document.querySelector('.file-submit').addEventListener('click', handleFileUploadSubmit);
document.querySelector('.rsvp').addEventListener('click', handleRSVPUploadSubmit);


function handleRSVPUploadSubmit(){
// add text to firebase dictionary
firebase.database().ref('rsvp').push().set({
  "name":document.getElementById('rsvp-n').value,
  "entre":document.getElementById('rsvp-en').value,
  "yesno":document.getElementById('rsvp-yn').value,
  "message":document.getElementById('rsvp-m').value
});

}


let selectedFile;
function handleFileUploadChange(e) {
selectedFile = e.target.files[0];
document.getElementById('file-submit').innerText = 'Post';

}

function handleFileUploadSubmit(e) {
document.getElementById('file-submit').innerText = 'Posted';

var rn1 = Math.floor(Math.random() * 20);
var rn2 = Math.floor(Math.random() * 20);
var rn3 = Math.floor(Math.random() * 20);
var rn4 = Math.floor(Math.random() * 20);
var rn5 = Math.floor(Math.random() * 20);

var rid = rn1.toString()+rn2.toString()+rn3.toString()+rn4.toString()+rn5.toString();

const uploadTask = storageRef.child(`images/${rid+selectedFile.name}`).put(selectedFile); //create a child directory called images, and place the file inside this directory
uploadTask.on('state_changed', (snapshot) => {
// Observe state change events such as progress, pause, and resume
}, (error) => {
  // Handle unsuccessful uploads
  console.log(error);
}, () => {
   // Do something once upload is complete
   console.log('success');
});
// add file name to firebase database
firebase.database().ref('photo_booth').push().set({
  filename:rid+selectedFile.name
});


};


function getImageData(firebase,storageRef) {
var starCountRef = firebase.database().ref('photo_booth');
starCountRef.on('value', function(snapshot) {
  var photo_booth_filenames = [];
  //loop through each push-id which are unkown values
  snapshot.forEach(function(childSnapshot) {
    // key = push-id which are unkown values
    var key = childSnapshot.key;
    // the actual filename str value
    var filename = childSnapshot.child("filename").val();
    //listen and populate the full filename array
    photo_booth_filenames.push(filename);
  });
  

  
  function downloadRandomImage(photo_booth_filenames,id) {
    storageRef.child('images/'+_.sample(photo_booth_filenames)).getDownloadURL().then(function(url) {
      // This can be downloaded directly:
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
    
      // Or inserted into an <img> element:
      var img = document.getElementById(id);
      img.src = url;
    }).catch(function(error) {
      // Handle any errors
    });
  }
  
  downloadRandomImage(photo_booth_filenames,'s1');
  downloadRandomImage(photo_booth_filenames,'s2');
  downloadRandomImage(photo_booth_filenames,'s3');

  
});


}

getImageData(firebase,storageRef);




//------------------------------




var myIndex2 = 0;
carouselSchedule("mySlides2");

function carouselSchedule() {
  var i;
  var x = document.getElementsByClassName("mySlides2");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  myIndex2++;
  if (myIndex2 > x.length) {
    //getImageData(firebase,storageRef)
    myIndex2 = 1
  }
  x[myIndex2-1].style.display = "block";
  setTimeout(carouselSchedule, 10000); // Change image every 2 seconds
}



