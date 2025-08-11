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
  
  // Initialize variables
  player.SetVar("AIFeedback", "Contacting AI...");
  player.SetVar("AIScore", 0);
  
  var learnerMessage = player.GetVar("LearnerReply") || "";
  
  if (!learnerMessage.trim()) {
    player.SetVar("AIFeedback", "Please enter a response before submitting.");
    setTimeout(function() {
      player.JumpToNextSlide();
    }, 2000);
    return;
  }

  // Use relative path since we're on the same domain  
  var apiUrl = "/api/chat";
  
  console.log("Current domain:", window.location.host);
  console.log("Full URL will be:", window.location.origin + apiUrl);
  
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
          
          // Direct slide advance - much simpler!
          setTimeout(function() {
            player.JumpToNextSlide();
          }, 1000); // Wait 1 second so user can see the feedback
          
        } catch (parseError) {
          console.error("Parse error:", parseError);
          player.SetVar("AIFeedback", "Error parsing response: " + parseError.message);
          setTimeout(function() {
            player.JumpToNextSlide();
          }, 2000);
        }
      } else {
        console.error("HTTP Error:", xhr.status, xhr.responseText);
        player.SetVar("AIFeedback", "Error " + xhr.status + ": " + xhr.statusText);
        setTimeout(function() {
          player.JumpToNextSlide();
        }, 2000);
      }
    }
  };
  
  xhr.onerror = function() {
    console.error("Request failed");
    player.SetVar("AIFeedback", "Network error - please try again");
    setTimeout(function() {
      player.JumpToNextSlide();
    }, 2000);
  };
  
  xhr.ontimeout = function() {
    console.error("Request timed out");
    player.SetVar("AIFeedback", "Request timed out - please try again");
    setTimeout(function() {
      player.JumpToNextSlide();
    }, 2000);
  };
  
  xhr.timeout = 30000; // 30 second timeout
  
  try {
    xhr.send(JSON.stringify({ message: learnerMessage }));
  } catch (error) {
    console.error("Send error:", error);
    player.SetVar("AIFeedback", "Failed to send request: " + error.message);
    setTimeout(function() {
      player.JumpToNextSlide();
    }, 2000);
  }
})();
}

};
