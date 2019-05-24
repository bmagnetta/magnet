
//---------------------


//LOAD  .js files here ... can't get to work though ... for now includ the following

/*
var magnet_setup = document.getElementById("magnet-setup")


var newScript = document.createElement("script");
newScript.src = "https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js";
magnet_setup.insertAdjacentElement("beforebegin", newScript);

var newScript = document.createElement("script");
newScript.src = "https://www.gstatic.com/firebasejs/5.9.4/firebase-storage.js";
magnet_setup.insertAdjacentElement("beforebegin", newScript);

var newScript = document.createElement("script");
newScript.src = "https://www.gstatic.com/firebasejs/5.9.4/firebase-database.js";
magnet_setup.insertAdjacentElement("beforebegin", newScript);

var newScript = document.createElement("script");
newScript.src = "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js";
magnet_setup.insertAdjacentElement("beforebegin", newScript);

var newScript = document.createElement("script");
newScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js";
magnet_setup.insertAdjacentElement("beforebegin", newScript);
*/



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


document.getElementById("rsvp-submit").addEventListener("click", function(){
    document.getElementById("form-response").innerHTML = "Thanks for responding!"
});


//remove jsquerry in future. replace with plain vanilla JS
//https://www.sitepoint.com/jquery-document-ready-plain-javascript/
//https://gist.github.com/joyrexus/7307312

//If form is "ready" and has elements then submit
$(document).ready(function() {
if ($('#rsvp-form').length > 0 ) {
    rsvpSubmitScript();
}
});







function rsvpSubmitScript() {

    var b = firebase.database().ref("rsvp");
    //what is the below script doing? $("#rsvp-n") retrieves this element.
    //https://javascript.info/forms-submit explains form.submit()
    $("#rsvp-form").submit(function() {
        console.log("Submit rsvp to Firebase");
        var n = $("#rsvp-n").val();
        var en = $("#rsvp-en").val();
        var yn = $("#rsvp-yn").val();
        var m = $("#rsvp-m").val();
        var f = { name: n, entre: en, status: yn, message:m};
        return b.push(f)
    , !1 })
    // !1 prevents the form from moving position after submission
}





//-----------------------


document.querySelector('.file-select').addEventListener('change', handleFileUploadChange);
document.querySelector('.file-submit').addEventListener('click', handleFileUploadSubmit);



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

//------------------------------

function populateTest(div_name,input_names) {
    //div_name == id of element in website, path in database
    //magnet_api_key, in setup instructions, included in code snippet.

    var card_name = div_name+"-card";
    var form_name = div_name+"-form";

    //---Given skeleton div, build a form
    var card = document.createElement("DIV");
    card.setAttribute("id", card_name);
    card.setAttribute("class", "w3-row w3-padding-32 w3-card w3-center");
    document.getElementById(div_name).appendChild(card);


    var form = document.createElement("FORM");
    form.setAttribute("id", form_name);
    form.setAttribute("class", "sucess-none");
    document.getElementById(card_name).appendChild(form);

    var i;
    for (i = 0; i < input_names.length; i++) {
        var y = document.createElement("INPUT");
        y.setAttribute("type", "text");
        y.setAttribute("placeholder", input_names[i]);
        y.setAttribute("id", form_name+input_names[i]);
        y.setAttribute("class", "w3-input w3-border");
        document.getElementById(form_name).appendChild(y);
    };
    
    
    var button = document.createElement("INPUT");
    button.setAttribute("type", "submit");
    button.setAttribute("id", "submit-test");
    button.setAttribute("class", "btn");
    button.setAttribute("value", "Submit");
    document.getElementById(form_name).appendChild(button);

    console.log("calling buildTest");
    
    //If form is "ready" and has elements then submit
    $(document).ready(function() {
        console.log("calling ready");

        if ($('#'+form_name).length > 0 ) {
            SubmitTestValidate(div_name,form_name,input_names);
        }
    });



}

function SubmitTestValidate(div_name,form_name,input_names) {

    var api_ref = firebase.database().ref("api_key/"+magnet_api_key);
    api_ref.once('value', function(snapshot) {
      if (snapshot.exists()) {
        console.log("magnet_api_key is valid");
        SubmitTest(div_name,form_name,input_names)
      }
      else {
        console.log("magnet_api_key is invalid");
      }

    });

}




function SubmitTest(div_name,form_name,input_names) {
    console.log("calling SubmitTest");
    

    var b = firebase.database().ref("data/"+magnet_api_key+"/"+div_name);
    //what is the below script doing? $("#rsvp-n") retrieves this element.
    //https://javascript.info/forms-submit explains form.submit()
    $('#'+form_name).submit(function() {
        console.log("Submit rsvp to Firebase");
        var f = {};
        for (i = 0; i < input_names.length; i++) {
            f[input_names[i]]=$('#'+form_name+input_names[i]).val()
        };
        console.log(f);
        return b.push(f)
    , !1 })
    // !1 prevents the form from moving position after submission
}


//------Visualization----------------

function VisualizationTestValidate(vis_title,vis_name,form_name) {

    document.getElementById(vis_title).innerHTML = form_name;

    var api_ref = firebase.database().ref("api_key/"+magnet_api_key);
    api_ref.once('value', function(snapshot) {
      if (snapshot.exists()) {
        console.log("magnet_api_key is valid");
        VisualizationTest(vis_name,form_name)
      }
      else {
        console.log("magnet_api_key is invalid");
      }

    });

}


function VisualizationTest(vis_name,form_name) {
    console.log("calling VisualizationTest");
    
    var b = firebase.database().ref("data/"+magnet_api_key+"/"+form_name);
    
    b.once('value', function(snapshot) {

        var txt = "";
        txt += "<table border='1'>"
        
        snapshot.forEach(function(childSnapshot) {
            // key will be "ada" the first time and "alan" the second time
            var key = childSnapshot.key;
            txt += "<tr>"+"<td>" + key + "</td>"+"</tr>";
            // childData will be the actual contents of the child
            var childData = childSnapshot.val();
            for (var key in childData){
                txt += "<tr>"+"<td>" + key + "</td>"+"<td>" + childData[key] + "</td>"+"</tr>";


            }




        });

        txt += "</table>"
        
        console.log(txt)
        document.getElementById(vis_name).innerHTML = txt;

    });


}


