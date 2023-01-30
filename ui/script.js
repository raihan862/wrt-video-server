const socket = io("http://localhost:5000");
let id = "";
const inp = document.getElementById("name");
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then(function (stream) {
    var video = document.querySelector("video");

    video.srcObject = stream;
    video.onloadedmetadata = function (e) {
      video.play();
    };
    socket.emit("getid");
    socket.on("me", (uid) => {
      inp.innerText = "Your User Id is" + uid;
      id = uid;
    });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start(1);

    mediaRecorder.ondataavailable = async (e) => {
      video.style.background = "red";
      video.style.color = "black";

      socket.emit("videoChunk", e.data, id || "rayhan");
    };
    setTimeout(() => {
      mediaRecorder.stop();
    }, 10000);
    mediaRecorder.onstop = (e) => {
      video.style.background = "";
      video.style.color = "";
    };
  });
