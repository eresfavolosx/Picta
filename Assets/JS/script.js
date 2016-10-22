var app = new Vue({
  el: '#navigation-wrapper',
  data: {
    navigation: [
      {name: 'HOME', icon: 'home', selected: true},
      {name: 'PROJECTS', icon: 'assignment', selected: false},
      {name: 'MESSAGES', icon: 'chat', selected: false},
      {name: 'PROFILE', icon: 'account_circle', selected: false}
    ]
  },
  methods:{
    selectItem: function(placement){
      for(var i = 0; i < this.navigation.length; i++){
        this.navigation[i].selected = false;
      }
      this.navigation[placement].selected = true;
    }
  }
}

// Grab elements, create settings, etc.
var video = document.getElementById('video');

// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('video');

// Trigger photo take
document.getElementById("snap").addEventListener("click", function() {
	context.drawImage(video, 0, 0, 640, 480);
});
