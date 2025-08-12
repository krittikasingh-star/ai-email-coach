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
I’m presenting tomorrow morning and could really use a quick look at my slides for clarity. It should take 30 minutes, and I value your eye for succinct messaging.
Is there any chance you could take a pass today?
Appreciate it,Nina
Context: Your schedule is completely booked today, leaving you with at most 10 minutes available. Unfortunately, this limited time is not enough for a comprehensive review.`;

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

window.Script2 = function()
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

  player.SetVar("AIFeedback2", "Contacting AI...");
  player.SetVar("AIScore2", 0);

  var learnerMessage = player.GetVar("LearnerReply2") || "";

  if (!learnerMessage.trim()) {
    player.SetVar("AIFeedback2", "Please enter a response before submitting.");
    jumpToSlide("5vZoxkoWMq6");
    return;
  }

  // Hardcoded original email prompt
  var emailPrompt = `Hi,  
We’ve got a potential client demo tomorrow with GreenTech and I need the marketing brochure ready today so I can send it to them this evening.  The version in the drive still looks like an earlier draft.  
Could you send me the final PDF?  
Thanks,  
Alex
Context: You can finalise the brochure today if you get the missing product specs and pricing from Rina in Product within the next two hours. You have already sent them two reminder emails.`;

  var apiUrl = "/api/chat";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", apiUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          player.SetVar("AIScore2", data.AIScore || 0);
          player.SetVar("AIFeedback2", data.reply || "");
          jumpToSlide("5vZoxkoWMq6");
        } catch (parseError) {
          console.error("Parse error:", parseError);
          player.SetVar("AIFeedback2", "Error parsing response: " + parseError.message);
          jumpToSlide("5vZoxkoWMq6");
        }
      } else {
        console.error("HTTP Error:", xhr.status, xhr.responseText);
        player.SetVar("AIFeedback2", "Error " + xhr.status + ": " + xhr.statusText);
        jumpToSlide("5vZoxkoWMq6");
      }
    }
  };

  xhr.onerror = function() {
    console.error("Request failed");
    player.SetVar("AIFeedback2", "Network error - please try again");
    jumpToSlide("5vZoxkoWMq6");
  };

  xhr.ontimeout = function() {
    console.error("Request timed out");
    player.SetVar("AIFeedback2", "Request timed out - please try again");
    jumpToSlide("5vZoxkoWMq6");
  };

  xhr.timeout = 30000;

  try {
    xhr.send(JSON.stringify({
      message: `Original email to respond to:\n${emailPrompt}\n\nLearner's reply:\n${learnerMessage}`
    }));
  } catch (error) {
    console.error("Send error:", error);
    player.SetVar("AIFeedback2", "Failed to send request: " + error.message);
    jumpToSlide("5vZoxkoWMq6");
  }
})();

}

window.Script3 = function()
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

  player.SetVar("AIFeedback3", "Contacting AI...");
  player.SetVar("AIScore3", 0);

  var learnerMessage = player.GetVar("LearnerReply3") || "";

  if (!learnerMessage.trim()) {
    player.SetVar("AIFeedback3", "Please enter a response before submitting.");
    jumpToSlide("5qqTIysJ6tR");
    return;
  }

  // New hardcoded original email prompt
  var emailPrompt = `Hi,
Hope you are doing well. Is the bug in the pricing tool fixed yet? I need to finalise Friday’s quotes for the DeltaCorp project and can’t do that without it.
If it’s still in progress, could you let me know?
Thanks,
Jordan
Context: The fix won’t be ready until next Tuesday. The only way to meet the Friday deadline is to use a workaround, for example manually pulling the data or using a temporary export.`;

  var apiUrl = "/api/chat";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", apiUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          player.SetVar("AIScore3", data.AIScore || 0);
          player.SetVar("AIFeedback3", data.reply || "");
          jumpToSlide("5qqTIysJ6tR");
        } catch (parseError) {
          console.error("Parse error:", parseError);
          player.SetVar("AIFeedback3", "Error parsing response: " + parseError.message);
          jumpToSlide("5qqTIysJ6tR");
        }
      } else {
        console.error("HTTP Error:", xhr.status, xhr.responseText);
        player.SetVar("AIFeedback3", "Error " + xhr.status + ": " + xhr.statusText);
        jumpToSlide("5qqTIysJ6tR");
      }
    }
  };

  xhr.onerror = function() {
    console.error("Request failed");
    player.SetVar("AIFeedback3", "Network error - please try again");
    jumpToSlide("5qqTIysJ6tR");
  };

  xhr.ontimeout = function() {
    console.error("Request timed out");
    player.SetVar("AIFeedback3", "Request timed out - please try again");
    jumpToSlide("5qqTIysJ6tR");
  };

  xhr.timeout = 30000;

  try {
    xhr.send(JSON.stringify({
      message: `Original email to respond to:\n${emailPrompt}\n\nLearner's reply:\n${learnerMessage}`
    }));
  } catch (error) {
    console.error("Send error:", error);
    player.SetVar("AIFeedback3", "Failed to send request: " + error.message);
    jumpToSlide("5qqTIysJ6tR");
  }
})();

}

};
