var name = '';
var encoded = null;
var fileExt = null;
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
const icon = document.querySelector('i.fa.fa-microphone')

function previewFile(input) {
  var reader = new FileReader();
  filename = input.files[0].name;
  fileExt = filename.split(".").pop();
  var onlyname = filename.replace(/\.[^/.]+$/, "");
  var finalName = onlyname + "_" + Date.now() + "." + fileExt;
  filename = finalName;

  reader.onload = function (e) {
    var src = e.target.result;
    var newImage = document.createElement("img");
    newImage.src = src;
    encoded = newImage.outerHTML;
  }
  reader.readAsDataURL(input.files[0]);
}

function upload() {
  last_index_quote = encoded.lastIndexOf('"');
  if (fileExt == 'jpg' || fileExt == 'jpeg') {
    encodedStr = encoded.substring(33, last_index_quote);
  }
  else {
    encodedStr = encoded.substring(32, last_index_quote);
  }
  var apigClient = apigClientFactory.newClient();
  var customLabels = document.getElementById('customlabels').value;

  var params = {
    "bucket": "b2bucketphotos",
    "folder": filename,
    "x-amz-meta-customLabels": customLabels,
    "Content-Type": "image/jpg;base64"
  };

  var additionalParams = {
    headers: {
      "Content-Type": "image/jpg;base64",
      "x-amz-meta-customLabels": customLabels,

    }
  };


  console.log(params);
  console.log(additionalParams);

  apigClient.uploadBucketFolderPut(params, encodedStr, additionalParams)
    .then(function (result) {
      console.log('success OK');
      console.log(result);
      alert("Photo uploaded successfully!");
    }).catch(function (result) {
      console.log(result);
    });
}

function searchFromVoice() {
  recognition.start();
  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    console.log(speechToText)
    recognition.stop();

    document.getElementById("search").value = speechToText

    var apigClient = apigClientFactory.newClient({ apiKey: "apikey" });
    var params = {
      "q": speechToText
    };
    var body = {
      "q": speechToText
    };

    var additionalParams = {
      queryParams: {
        q: speechToText
      }
    };

    apigClient.searchGet(params, body, additionalParams)
      .then(function (result) {
        console.log('success OK');
        console.log(result);
        showImages(result.data.keys);
        console.log(result.data.keys);
      }).catch(function (result) {
        console.log(result);
        console.log(speechToText);
      });

    // console.log(speechToText);
  }//
}


function search() {
  var searchTerm = document.getElementById("search").value;
  var apigClient = apigClientFactory.newClient({ apiKey: "apikey" });
  var params = {
    "q": searchTerm
  };
  var body = {
    "q": searchTerm
  };

  var additionalParams = {
    queryParams: {
      q: searchTerm
    },

  };
  console.log(searchTerm);
  apigClient.searchGet(params, body, additionalParams)
    .then(function (result) {
      console.log('success OK');
      console.log(result)
      showImages(result.data.keys);
    }).catch(function (result) {
      console.log(result);
    });
}

function showImages(res) {
  var newDiv = document.getElementById("div");
  if (typeof (newDiv) != 'undefined' && newDiv != null) {
    while (newDiv.firstChild) {
      newDiv.removeChild(newDiv.firstChild);
    }
  }
  console.log(res)
  if (res.length == 0) {
    var newContent = document.createTextNode("No image to display");
    newDiv.appendChild(newContent);
    var currentDiv = document.getElementById("div1");
    document.body.insertBefore(newDiv, currentDiv);
  }
  else {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i]);
      var newDiv = document.getElementById("div");
      newDiv.style.display = 'inline'
      var newContent = document.createElement("img");
      newContent.style.height = 'inherit';
      newContent.style.width = 'inherit';
      newContent.src = 'https://b2bucketphotos.s3.amazonaws.com/' + res[i];
      newDiv.appendChild(newContent);
      var currentDiv = document.getElementById("div1");
      document.body.insertBefore(newDiv, currentDiv);
    }
  }
}
