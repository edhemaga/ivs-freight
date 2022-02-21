function initFreshChat() {
  window.fcWidget.init({
    token: "e440477d-bb5d-4e70-a0f7-cf36ec9b6cce",
    host: "https://wchat.freshchat.com"
  });
  // To set unique user id in your system when it is available
  window.fcWidget.setExternalId("john.doe1987");

  // To set user name
  window.fcWidget.user.setFirstName("John");

  // To set user email
  window.fcWidget.user.setEmail("john.doe@gmail.com");

  // To set user properties
  window.fcWidget.user.setProperties({
    plan: "Estate",                 // meta property 1
    status: "Active"                // meta property 2
  });
}

function initialize(i, t) {
  var e;
  i.getElementById(t) ? initFreshChat() : ((e = i.createElement("script")).id = t, e.async = !0, e.src = "https://wchat.freshchat.com/js/widget.js", e.onload = initFreshChat, i.head.appendChild(e))
}

function initiateCall() {
  initialize(document, "freshchat-js-sdk")
}

window.addEventListener ? window.addEventListener("load", initiateCall, !1) : window.attachEvent("load", initiateCall, !1);
