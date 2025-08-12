window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script1 = function()
{
  (function () {
  var player = GetPlayer();
  
  // Add the extracted Jump to Slide function from Articulate community
  function jumpToSlide(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "_frame";
    var n = DS.presentation.getFlatSlides().find(function(e) {
      return e.id === t;
    });
    return null != n ? DS.windowManager.requestSlideForReview(n, e).then(function() {
      return {
        target: n.absoluteId
      };
    }) : Promise.reject("Slide with id '".concat(t, "' not found"));
  }
  
  // Initialize variables
  player.SetVar("AIFeedback", "Contacting AI...");
  player.SetVar("AIScore", 0);
  
  var learnerMessage = player.GetVar("LearnerReply") || "";
  
  if (!learnerMessage.trim()) {
    player.SetVar("AIFeedback", "Please enter a response before submitting.");
    jumpToSlide("5aRiauksztt");
    return;
  }

  // Use relative path since we're on the same domain  
  var apiUrl = "/api/chat";
  
  var xhr = new XMLHttpRequest();
  xhr.open("POST", apiUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var reply = data.reply || "";
          
          // Extract score
          var scoreMatch = reply.match(/Score:\s*(\d)\/5/i);
          var score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
          
          player.SetVar("AIScore", score);
          player.SetVar("AIFeedback", reply);
          
          // Jump to feedback slide
          jumpToSlide("5aRiauksztt");
          
        } catch (parseError) {
          console.error("Parse error:", parseError);
          player.SetVar("AIFeedback", "Error parsing response: " + parseError.message);
          jumpToSlide("5aRiauksztt");
        }
      } else {
        console.error("HTTP Error:", xhr.status, xhr.responseText);
        player.SetVar("AIFeedback", "Error " + xhr.status + ": " + xhr.statusText);
        jumpToSlide("5aRiauksztt");
      }
    }
  };
  
  xhr.onerror = function() {
    console.error("Request failed");
    player.SetVar("AIFeedback", "Network error - please try again");
    jumpToSlide("5aRiauksztt");
  };
  
  xhr.ontimeout = function() {
    console.error("Request timed out");
    player.SetVar("AIFeedback", "Request timed out - please try again");
    jumpToSlide("5aRiauksztt");
  };
  
  xhr.timeout = 30000; // 30 second timeout
  
  try {
    xhr.send(JSON.stringify({ message: learnerMessage }));
  } catch (error) {
    console.error("Send error:", error);
    player.SetVar("AIFeedback", "Failed to send request: " + error.message);
    jumpToSlide("5aRiauksztt");
  }
})();
}

};
