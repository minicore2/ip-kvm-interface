// Position: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events#Examples
// Cursor Capture
var zerorpc = require("zerorpc");
var server = new zerorpc.Server({
  data: function(reply) {
    // check pointerLock support
    var havePointerLock = 'pointerLockElement' in document ||
                          'mozPointerLockElement' in document ||
                          'webkitPointerLockElement' in document;

    // element for pointerLock
    var requestedElement = document.getElementById('video');

    // prefixes
    requestedElement.requestPointerLock = requestedElement.requestPointerLock || requestedElement.mozRequestPointerLock || requestedElement.webkitRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock ||
                               document.mozExitPointerLock ||
                               document.webkitExitPointerLock;

    var x;
    var y;
    var a;
    var b;

    var isLocked = function() {
      return requestedElement === document.pointerLockElement ||
             requestedElement === document.mozPointerLockElement ||
             requestedElement === document.webkitPointerLockElement;
    }

    requestedElement.addEventListener('click', function() {
      if (!isLocked()) {
        x = 0;
        y = 0;
        requestedElement.requestPointerLock();
      }
      // else {
      //   document.exitPointerLock();
      // }
    }, false);

    var moveCallback = function(e) {
      var position = document.getElementById("position");

        x += e.movementX ||
        e.mozMovementX ||
        e.webkitMovementX ||
        0;

        y -= e.movementY ||
        e.mozMovementY ||
        e.webkitMovementY ||
        0;

        a = e.clientX;
        b = e.clientY;

      position.innerHTML = 'Position X: ' + x +
                           '<br />Position Y: ' + y +
                           '<br />Initial X Window Position : ' + a +
                           '<br />Initial Y Window Position : ' + b;
    }

    var changeCallback = function() {
      if (!havePointerLock) {
        alert('Unable to Lock Pointer');
        return;
      }
      if (isLocked()) {
        document.addEventListener("mousemove", moveCallback, false);
        document.body.classList.add('locked');
      }

      else {
        document.removeEventListener("mousemove", moveCallback, false);
        document.body.classList.remove('locked');
      }
    }

    document.addEventListener('pointerlockchange', changeCallback, false);
    document.addEventListener('mozpointerlockchange', changeCallback, false);
    document.addEventListener('webkitpointerlockchange', changeCallback, false);

    var xList = [];
    var yList = [];

    lastX = xList[xList.length - 1]
    if (x != lastX) {
      xList.push(x)
      reply(null, "X: " + x);
    }

    lastY = yList[yList.length - 1]
    if (y != lastY) {
      yList.push(y)
      reply(null, "Y: " + y);
    }

    // Click
    function whichClick(event) {
      document.getElementById("click-button").innerHTML = "You pressed button: " + event.button;
    }

  }
});
server.bind("tcp://0.0.0.0:4242");