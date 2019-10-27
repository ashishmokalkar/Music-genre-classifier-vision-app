var el = x => document.getElementById(x);

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
	console.log("Image picked === ", e.target.result);
    el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {
  var uploadFiles = el("file-input").files;
  if (uploadFiles.length !== 1) alert("Please select a file to analyze!");

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
	
	if(result==="Jazz"){
		console.log("INITIOOOOOOOOOOOOOOOOOOOOOOOOJAZZZZZZZZZZZZZZZZZZZ")

		//el("result-image").onload = loadingDone;      // here before setting src

    		//logoImage.src = "img/gameLogo.png";
		//el("result-image").src = "/home/ashish/deeplearning/music_classification/fastai-v3/jazz.jpg"
		/*
    		function loadingDone() {             // gets called when done
        		alert(el("result-image").width);
        		mainCanvas.getContext("2d").drawImage(el("result-image"), 0, 0);
    		}
		*/
		
		el("result-image").className = "";

	}
	else if(result==="Rock"){
		el("result-image").src="/home/ashish/deeplearning/music_classification/fastai-v3/rock.jpg"
		el("result-image").className="";

	}
	else if (result==="Pop"){
		el("result-image").src = "/home/ashish/deeplearning/music_classification/fastai-v3/pop.png"
		el("result-image").className = "";

	}

    }
    el("analyze-button").innerHTML = "Analyze";
  };

}

function genSpectrogram(){
  //console.log("This function will generte Spectrogram");
  //var uploadFiles = el("file-input").files;
  var uploadFiles = el("file-input").files;
  if (uploadFiles.length !== 1) alert("Please select an audio file to get Spectrogram!");
  el("spectrogram-button").innerHTML = "Generating Spectrogram......";
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

function genMel(){
  var uploadFiles = el("file-input").files;
  if (uploadFiles.length !== 1) alert("Please select an audio file to get Spectrogram!");
  el("spectrogram-button").innerHTML = "Generating Mel Spectrogram......";
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
    el("mel-button").innerHTML = "Generate Mel Spectrogram"
  };
}
