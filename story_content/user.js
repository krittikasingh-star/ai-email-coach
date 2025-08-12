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

  function jumpToSlide(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "_frame";
    var n = DS.presentation.getFlatSlides().find(function(e) {
      return e.id === t;
    });
    return n
      ? DS.windowManager.requestSlideForReview(n, e).then(function() {
          return { target: n.absoluteId };
        })
      : Promise.reject("Slide with id '" + t + "' not found");
  }

  player.SetVar("AIFeedback", "Contacting AI...");
  player.SetVar("AIScore", 0);

  var learnerMessage = player.GetVar("LearnerReply") || "";

  if (!learnerMessage.trim()) {
    player.SetVar("AIFeedback", "Please enter a response before submitting.");
    jumpToSlide("5aRiauksztt");
    return;
  }

  // Hardcoded original email prompt
  var emailPrompt = `Hi
I’m presenting tomorrow morning and could really use a quick look at my slides for clarity. 
It should take 10 minutes, and I value your eye for succinct messaging.
Is there any chance you could take a pass today?
Appreciate it,
Nina
Context: You don't have a half hour today and can spare at most 10 minutes, which will not be enough to go through the slides thoroughly.`;

  var apiUrl = "/api/chat";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", apiUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          player.SetVar("AIScore", data.AIScore || 0);
          player.SetVar("AIFeedback", data.reply || "");
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

  xhr.timeout = 30000;

  try {
    xhr.send(JSON.stringify({
      message: `Original email to respond to:\n${emailPrompt}\n\nLearner's reply:\n${learnerMessage}`
    }));
  } catch (error) {
    console.error("Send error:", error);
    player.SetVar("AIFeedback", "Failed to send request: " + error.message);
    jumpToSlide("5aRiauksztt");
  }
})();

}

};
