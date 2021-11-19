// =================
// KEYBOARD HANDLING
// =================

var keys = [];

function handleKeydown(evt) {
    keys[evt.keyCode] = true;
}

function handleKeyup(evt) {
    keys[evt.keyCode] = false;
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) {
    var isDown = keys[keyCode];
    //console.log('keyCode: ' + keyCode)
    //console.log('keys: ' + keys[keyCode])
    keys[keyCode] = false;
    //console.log('isDown: ' + isDown)
    return isDown;
}

// A tiny little convenience function
function keyCode(keyChar) {
    return keyChar.charCodeAt(0);
}

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

// Prevent spacebar from scrolling down on page
window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  });
