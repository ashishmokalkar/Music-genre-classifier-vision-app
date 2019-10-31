var el = x => document.getElementById(x);
var chose_sample_rock_song = 0;
var chose_sample_jazz_song = 0;

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();

  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
	//console.log("Image picked === ", e.target.result);
    el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {
  var uploadFiles = el("file-input").files;
  //if (uploadFiles.length !== 1) alert("Please select a file to analyze!");
  //chose_sample_rock_song = 0;
  //chose_sample_jazz_song = 0;
  el("analyze-button").innerHTML = "Analyzing...";
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
    true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);

  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
	var result=response["result"];
	el("result-label").innerHTML = "The audio song seems to be : "+result;
    }
    el("analyze-button").innerHTML = "Analyze";
  };

}

function genSpectrogram(){
  el("spectrogram-button").innerHTML = "Generating Spectrogram....";
  if (chose_sample_rock_song === 1 || chose_sample_jazz_song === 1 ) {

	if (chose_sample_rock_song === 1) {
		console.log("Setting up rock file url");
		chose_sample_rock_song = 0;
		file_URL = "https://drive.google.com/uc?export=download&id=1f7G3m_rADqBvUO9WOsgRQeCigH2ErwyZ";
	}
	else if(chose_sample_jazz_song === 1) {
		chose_sample_jazz_song = 0;
		console.log("Setting up Jazz url");
		file_URL = "https://drive.google.com/uc?export=download&id=1-t0KXuUuSsgV_t329d6I087Fm3hPrRj0";
	}

	console.log("Into sample spec");
  	var formData = new FormData();
	cors_url = "https://cors-anywhere.herokuapp.com/";
	//total_URL = cors_url+"https://drive.google.com/uc?export=download&id=1f7G3m_rADqBvUO9WOsgRQeCigH2ErwyZ";
	total_URL = cors_url+file_URL;
	//URL = "/home/ashish/deeplearning/music_classification/Music-genre-classifier-vision-app/app/Long_cool_woman_ROCK.wav"
	var x;
	var request = new XMLHttpRequest();
	request.responseType = "blob";
	request.onload = function() {
	formData.append("file", request.response);

	var xhr = new XMLHttpRequest();
	var loc = window.location;
	xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/spectrogram`,
	true);
	xhr.onerror = function() {
		alert(xhr.responseText);
	};
	xhr.responseType="blob"
  	xhr.send(formData);

  	xhr.onload = function(e) {
    	if (this.readyState === 4) {
      	console.log("Into choose readt state");
	//var b64Response = btoa(e.target.response);
	const blobUrl = URL.createObjectURL(e.target.response);
	//el("image-picked").src = 'data:image/png;base64,'+b64Response;
	el("image-picked").src = blobUrl;
	el("image-picked").classname="";
    	}
    	el("spectrogram-button").innerHTML = "Generate Spectrogram";
  	};

	}
	request.open("GET", total_URL);
	//request.setRequestHeader("Content-type", "multipart/form-data");
	request.send();

  }
  else {
	  var uploadFiles = el("file-input").files;
	  console.log("UPLOAD FILESSSSSSSS = ", uploadFiles);
	  //if (uploadFiles.length !== 1) alert("Please select an audio file to get Spectrogram!");
	  //el("spectrogram-button").innerHTML = "Generating Spectrogram......";
	  var xhr = new XMLHttpRequest();
	  var loc = window.location;
	  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/spectrogram`,
	    true);
	  xhr.onerror = function() {
	    alert(xhr.responseText);
	  };


	  xhr.responseType="blob"
	  var fileData = new FormData();
	  fileData.append("file", uploadFiles[0]);
	  xhr.send(fileData);

	  xhr.onload = function(e) {
	    if (this.readyState === 4) {

		//var b64Response = btoa(e.target.response);
		const blobUrl = URL.createObjectURL(e.target.response);
		//el("image-picked").src = 'data:image/png;base64,'+b64Response;
		el("image-picked").src = blobUrl;
	    }
	    el("spectrogram-button").innerHTML = "Generate Spectrogram";
	  };
  }
}

function genMel(){
  el("mel-button").innerHTML = "Generating MEL Spectrogram....";
  if (chose_sample_rock_song === 1 || chose_sample_jazz_song === 1 ) {
	if (chose_sample_rock_song === 1) {
		console.log("Setting up rock file url");
		chose_sample_rock_song = 0;
		file_URL = "https://drive.google.com/uc?export=download&id=1f7G3m_rADqBvUO9WOsgRQeCigH2ErwyZ";
	}
	else if(chose_sample_jazz_song === 1) {
		chose_sample_jazz_song = 0;
		console.log("Setting up Jazz url");
		file_URL = "https://drive.google.com/uc?export=download&id=1-t0KXuUuSsgV_t329d6I087Fm3hPrRj0";
	}

	console.log("Into sample MELLL");
  	var formData = new FormData();
	cors_url = "https://cors-anywhere.herokuapp.com/";
	total_URL = cors_url+file_URL;
	//URL = "/home/ashish/deeplearning/music_classification/Music-genre-classifier-vision-app/app/Long_cool_woman_ROCK.wav"
	var x;

	var request = new XMLHttpRequest();
	request.responseType = "blob";
	request.onload = function() {
	  formData.append("file", request.response);

	var xhr = new XMLHttpRequest();
	var loc = window.location;
	xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/mel`,
	true);
	xhr.onerror = function() {
		alert(xhr.responseText);
	};
	xhr.responseType="blob"
  	xhr.send(formData);

  	xhr.onload = function(e) {
    	if (this.readyState === 4) {
      	console.log("Into choose readt state");
	//var b64Response = btoa(e.target.response);
	const blobUrl = URL.createObjectURL(e.target.response);
	//el("image-picked").src = 'data:image/png;base64,'+b64Response;
	el("image-picked").src = blobUrl;
	el("image-picked").classname="";
    	}
    	el("mel-button").innerHTML = "Generate MEL Spectrogram";
  	};

	}
	request.open("GET", total_URL);
	//request.setRequestHeader("Content-type", "multipart/form-data");
	request.send();

  }
  else{

	  var uploadFiles = el("file-input").files;
	  //if (uploadFiles.length !== 1) alert("Please select an audio file to get Spectrogram!");
	  //el("spectrogram-button").innerHTML = "Generating Mel Spectrogram......";
	  console.log("Into MEL file select");
	  var xhr = new XMLHttpRequest();
	  var loc = window.location;
	  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/mel`,
	    true);
	  xhr.onerror = function() {
	    alert(xhr.responseText);
	  };
	  xhr.responseType="blob"
	  var fileData = new FormData();
	  fileData.append("file", uploadFiles[0]);
	  xhr.send(fileData);

	  xhr.onload = function(e) {
	    if (this.readyState === 4) {
		const blobUrl = URL.createObjectURL(e.target.response);
		//el("image-picked").src = 'data:image/png;base64,'+b64Response;
		el("image-picked").src = blobUrl;
	    }
	    //el("analyze-button").innerHTML = "Analyze";
	    el("mel-button").innerHTML = "Generate MEL Spectrogram"
	  };
  }
}

function choose_long_cool(){

	chose_sample_rock_song = 1;
	console.log("Into choose ROCKKKKK...yeahhhhhh");
	el("upload-label").innerHTML = "Long Cool Woman.wav(ROCK song)";
}


function choose_smiling_jazz_song(){
	chose_sample_jazz_song = 1;
	console.log("Into choose JAZZZZZZZZ...yeahhhhhh");
	el("upload-label").innerHTML = "When you are smiling.wav(JAZZ song)";

}
