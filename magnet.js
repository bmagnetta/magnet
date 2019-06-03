
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




/*
document.getElementById("rsvp-submit").addEventListener("click", function(){
    document.getElementById("form-response").innerHTML = "Thanks for responding!"
});
*/

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


//document.querySelector('.file-select').addEventListener('change', handleFileUploadChange);
//document.querySelector('.file-submit').addEventListener('click', handleFileUploadSubmit);



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


//============================================================
//
//---Photo Slideshow
//
//============================================================

//--------------------------------
//---Create slideshow
//--------------------------------

window.myIndex = 1;
window.photoScrolls = {};
window.photoSelected = {};

function BuildPhotoFeed(div_name) {
    //div_name == id of element in website, path in database
    //window.magnet_user, in setup instructions, included in code snippet.

    window.photoScrolls[div_name]=1//set global index book keeping variable.
    window.photoSelected[div_name]=""//set global structure for keep track of selected file for each feed.
    
    var i;
    for (i = 1; i < 4; i++) {
        var card_name = div_name+"-card"+i;

        var card = document.createElement("DIV");
        card.setAttribute("id", card_name);
        card.setAttribute("class", div_name+" w3-row w3-padding-32 w3-card w3-center");
        document.getElementById(div_name).appendChild(card);
        
        var img = document.createElement("IMG");
        img.setAttribute("id", div_name+"-i"+i);
        img.setAttribute("class", "w3-animate-fading w3-hover-opacity");
        img.setAttribute("style", "width:100%");
        pullImageData(div_name,div_name+"-i"+i)
        document.getElementById(card_name).appendChild(img);

    }
    var select = document.createElement("INPUT");
    select.setAttribute("type", "file");
    select.setAttribute("class", "file-select");
    select.setAttribute("accept", "image/*");
    select.setAttribute("name", div_name);
    select.addEventListener('change', handlePhotoUploadChange);
    document.getElementById(div_name).appendChild(select);
    
    
    var submit = document.createElement("BUTTON");
    submit.setAttribute("id", "file-submit");
    submit.setAttribute("class", "file-submit");
    submit.setAttribute("name", div_name);
    submit.innerText = '';
    submit.addEventListener('click', handlePhotoUploadValidate);
    document.getElementById(div_name).appendChild(submit);
    
}


//https://stackoverflow.com/questions/30469755/why-a-variable-defined-global-is-undefined
function StartPhotoScroll() {
    //console.log(window.myIndex);
    const keys = Object.keys(window.photoScrolls);

    for (const key of keys) {
        //window.photoScrolls[key] this is the index variable, key is ps_key
        var i;
        var x = document.getElementsByClassName(key);

        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        };
        window.photoScrolls[key]=window.photoScrolls[key]+1;
        //console.log(window.photoScrolls[key]);
        if (window.photoScrolls[key] > x.length) {
            //getImageData(firebase,storageRef)
            window.photoScrolls[key] = 1;
        };
        x[window.photoScrolls[key]-1].style.display = "block";
        setTimeout(StartPhotoScroll, 10000); // Change image every 2 seconds

    }

}

//----------------------------------------------

//download photos that are already on storage and update the photo feed susing the window.photoScrolls

//include button to upload photos

function handlePhotoUploadChange(e) {
    var div_name = e.target.name;
    window.photoSelected[div_name] = e.target.files[0];
    var x = document.getElementsByClassName("file-submit");
    for (i = 0; i < x.length; i++) {
        if (x[i].name == div_name){
            x[i].innerText = 'Post';
        }
    };


}


function handlePhotoUploadValidate(e) {

    var api_ref = firebase.database().ref("users/"+window.magnet_user);
    api_ref.once('value', function(snapshot) {
      if (snapshot.exists()) {
        console.log("window.magnet_user is valid");
        if (snapshot.child("pforms").child("plan_cnt").val()>snapshot.child("pforms").child("used_cnt").val()){
            console.log("You still have submissions for the month");

            handlePhotoUploadSubmit(e)

        } else {
            console.log("You've reached your max number of submissions for the month");
        }

      }
      else {
        console.log("window.magnet_user is invalid");
      }

    });

}


function handlePhotoUploadSubmit(e) {
    
    //only upload if
    if (e.target.innerText != 'Posted' && e.target.innerText != '') {
        
        var div_name = e.target.name;
        var selectedFile = window.photoSelected[div_name];


        var rn1 = Math.floor(Math.random() * 20);
        var rn2 = Math.floor(Math.random() * 20);
        var rn3 = Math.floor(Math.random() * 20);
        var rn4 = Math.floor(Math.random() * 20);
        var rn5 = Math.floor(Math.random() * 20);

        var rid = rn1.toString()+rn2.toString()+rn3.toString()+rn4.toString()+rn5.toString();

        const uploadTask = storageRef.child(`${window.magnet_user}/${rid+selectedFile.name}`).put(selectedFile); //create a child directory called images, and place the file inside this directory
        uploadTask.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        }, (error) => {
            // Handle unsuccessful uploads
            console.log("photo upload failed");
            console.log(error);
        }, () => {
            // Do something once upload is complete
            console.log("photo upload sucess");
            // add file name to firebase database
            firebase.database().ref("data/"+window.magnet_user+"/"+div_name).push().set({
              filename:rid+selectedFile.name
            });
        
            //update button to say posted. show success
            e.target.innerText = 'Posted';
            
            //Add count traffic here
            var c = firebase.database().ref("users/"+window.magnet_user+"/pforms");
            c.once('value', function(snapshot) {
                var v = snapshot.child("used_cnt").val();
                var d = firebase.database().ref("users/"+window.magnet_user+"/pforms/used_cnt");
                d.set(v+1);
                console.log("updated the used_cnt by one");
            });



        });

    }

};

//--------------------------------------------------



function pullImageData(div_name,img_id) {
    var ref = firebase.database().ref("data/"+window.magnet_user+"/"+div_name);
    ref.on('value', function(snapshot) {
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
      //console.log("calling downloadRandomImage");
      
      
      function downloadRandomImage(photo_booth_filenames,img_id) {
        //console.log("calling downloadRandomImage");
        storageRef.child(window.magnet_user+"/"+_.sample(photo_booth_filenames)).getDownloadURL().then(function(url) {
          // This can be downloaded directly:
          var xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = function(event) {
            var blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();
        
          // Or inserted into an <img> element:
          var img = document.getElementById(img_id);
          img.src = url;
        }).catch(function(error) {
          // Handle any errors
          console.log("Error: downloadRandomImage")
        });
      }
      
      
      downloadRandomImage(photo_booth_filenames,img_id)
      
    });

}


window.pullIndex = 0;
window.pullKey= "";
window.pullPSapi= "";
window.pullFilename= "";

function pullImageDataVis(div_name,img_id) {
    var ref = firebase.database().ref("data/"+window.magnet_user+"/"+div_name);
    ref.on('value', function(snapshot) {
    
        var photo_booth_filenames = [];
        var keys = [];
        //loop through each push-id which are unkown values
        snapshot.forEach(function(childSnapshot) {
            // key = push-id which are unkown values
            var key = childSnapshot.key;
            // the actual filename str value
            window.pullKey = key;
            var filename = childSnapshot.child("filename").val();
            //listen and populate the full filename array
            photo_booth_filenames.push(filename);
            keys.push(key);
        });
        //console.log(photo_booth_filenames);
        var sub = photo_booth_filenames[window.pullIndex];
        window.pullPSapi= div_name;
        window.pullKey = keys[window.pullIndex];
        window.pullFilename= sub;
        console.log(sub);

        console.log(window.magnet_user+"/"+sub);

        storageRef.child(window.magnet_user+"/"+sub).getDownloadURL().then(function(url) {
            // This can be downloaded directly:
            
            console.log("sucessfull downloaded an image")

            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function(event) {
                var blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();

            // Or inserted into an <img> element:
            var img = document.getElementById(img_id);
            img.src = url;
        }).catch(function(error) {
            // Handle any errors
            console.log("Error: downloadRandomImage")
        });

        if (window.pullIndex < photo_booth_filenames.length-1){
            window.pullIndex = window.pullIndex +1;
        } else {
            window.pullIndex = 0;
        }
        
        console.log(window.pullIndex);

    });

}



//--------------------------------------

function SkipPhoto(img_id){
    //console.log("called skipphoto");
    //console.log(window.pullPSapi);
    //console.log(img_id);
    pullImageDataVis(window.pullPSapi,img_id);
}
function RemovePhoto(){
    // Create a reference to the file to delete
    var desertRef = storageRef.child(window.magnet_user+"/"+window.pullFilename);
    // Delete the file
    desertRef.delete().then(function() {
        // Photo deleted successfully. Now delete database reference
        var c = firebase.database().ref("data/"+window.magnet_user+"/"+window.pullPSapi+"/"+window.pullKey);
        c.remove();
        //console.log(window.pullFilename);
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log("photo delete failed")
    });
}


function VisualizePhotoValidate(img_id,rem_id,skip_id,ps_name) {

    //document.getElementById(vis_title).innerHTML = ps_name;
    //document.getElementById(skip_id).addEventListener('click', SkipPhoto);
    document.getElementById(skip_id).setAttribute("onclick","SkipPhoto('"+img_id+"')");
    document.getElementById(rem_id).addEventListener('click', RemovePhoto);


    var api_ref = firebase.database().ref("users/"+window.magnet_user);
    api_ref.once('value', function(snapshot) {
      if (snapshot.exists()) {
        console.log("window.magnet_user is valid");
        //get validation token
        VisualizePhoto(img_id,ps_name)

      }
      else {
        console.log("window.magnet_user is invalid");
      }

    });

}


function VisualizePhoto(img_id,ps_name) {

    pullImageDataVis(ps_name,img_id)

}

//============================================================
//
//---Forms
//
//============================================================

//--------------------------------
//---Create Forms
//--------------------------------

function BuildForm(div_name,input_names) {
    //div_name == id of element in website, path in database
    //window.magnet_user, in setup instructions, included in code snippet.

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
            SubmitFormValidate(div_name,form_name,input_names);
        }
    });



}

function SubmitFormValidate(div_name,form_name,input_names) {

    var api_ref = firebase.database().ref("users/"+window.magnet_user);
    api_ref.once('value', function(snapshot) {
      if (snapshot.exists()) {
        console.log("window.magnet_user is valid");
        if (snapshot.child("forms").child("plan_cnt").val()>snapshot.child("forms").child("used_cnt").val()){
            console.log("You still have submissions for the month");

            SubmitForm(div_name,form_name,input_names)
        } else {
            console.log("You've reached your max number of submissions for the month");

        }

      }
      else {
        console.log("window.magnet_user is invalid");
      }

    });

}

function SubmitForm(div_name,form_name,input_names) {
    console.log("calling SubmitTest");
    

    var b = firebase.database().ref("data/"+window.magnet_user+"/"+div_name);
    //what is the below script doing? $("#rsvp-n") retrieves this element.
    //https://javascript.info/forms-submit explains form.submit()
    $('#'+form_name).submit(function() {
        console.log("Submit rsvp to Firebase");
        var f = {};
        for (i = 0; i < input_names.length; i++) {
            f[input_names[i]]=$('#'+form_name+input_names[i]).val()
        };
        console.log(f);
        //Keep track of traffic
        var c = firebase.database().ref("users/"+window.magnet_user+"/forms");
        c.once('value', function(snapshot) {
            var v = snapshot.child("used_cnt").val();
            var d = firebase.database().ref("users/"+window.magnet_user+"/forms/used_cnt");
            d.set(v+1);
            console.log("updated the used_cnt by one");
        });


        return b.push(f)
    , !1 })
    // !1 prevents the form from moving position after submission
}

//prevent enter key submiting form
$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});


//--------------------------------
//---Visualize Forms
//--------------------------------

function VisualizeFormValidate(vis_name,form_name) {

    //document.getElementById(vis_title).innerHTML = form_name;

    var api_ref = firebase.database().ref("users/"+window.magnet_user);
    api_ref.once('value', function(snapshot) {
      if (snapshot.exists()) {
        console.log("window.magnet_user is valid");
        //get validation token
        VisualizeForm(vis_name,form_name)
      }
      else {
        console.log("window.magnet_user is invalid");
      }

    });

}


function RemoveFormEntry(form_name,key) {
    //console.log("calling RemoveFormEntry")
    //console.log(form_name)
    //console.log(key)
    var c = firebase.database().ref("data/"+window.magnet_user+"/"+form_name+"/"+key);
    c.remove();
    //loop through and delete table is more efficient
    //simply recall complete data download. inefficient but works for now.
    GetFormData(form_name);
}


function VisualizeForm(vis_name,form_name) {
    console.log("calling VisualizationTest");
    
    var b = firebase.database().ref("data/"+window.magnet_user+"/"+form_name);
    
    b.once('value', function(snapshot) {

        var txt = "";
        txt += "<table class='w3-table w3-centered w3-striped'>"
        var button_ids = [];
        snapshot.forEach(function(childSnapshot) {
            // key will be "ada" the first time and "alan" the second time
            var key = childSnapshot.key;
            button_ids.push(key);
            txt += "<tr>"+"<td>" + key + "</td>"+"<td>" + "<button class='w3-button w3-hover-red' onclick=RemoveFormEntry('"+form_name+"','"+key+"')>remove</button>" + "</td>"+"</tr>";
            // childData will be the actual contents of the child
            var childData = childSnapshot.val();
            for (var key in childData){
                txt += "<tr>"+"<td>" + key + "</td>"+"<td>" + childData[key] + "</td>"+"</tr>";
            }


        });

        txt += "</table>"
        
        //console.log(txt)
        document.getElementById(vis_name).innerHTML = txt;
        


    });
}

