
// key
var _keys = [];

// mouse
var _mouseX = 0;
var _mouseY = 0;
var _mouseDown = false;

// phone
var _phoneX = 0;
var _phoneY = 0;
var _isPhoneMovement = false;

// keycodes
class keyCode{
    constructor() {
      // special keys
      this.BACKSPACE = 8;
      this.TAB = 9;
      this.ENTER = 13;
      this.SHIFT = 16;
      this.CONTROL = 17;
      this.ALT = 18;
      this.PAUSE = 19;
      this.BREAK = 19;
      this.CAPS_LOCK = 20;
      this.ESCAPE = 27;
      this.PAGE_UP = 33;
      this.PAGE_DOWN = 34;
      this.END = 35;
      this.HOME = 36;
      this.LEFT_ARROW = 37;
      this.UP_ARROW = 38;
      this.RIGHT_ARROW = 39;
      this.DOWN_ARROW = 40;
      this.INSERT = 45;
      this.DELETE = 46;
      this.SPACE = 32;

      // numbers
      this.ZERO = 48;
      this.ONE = 49;
      this.TWO = 50;
      this.TREE = 51;
      this.FOUR = 52;
      this.FIVE = 53;
      this.SIX = 54;
      this.SEVEN = 55;
      this.EIGHT = 56;
      this.NINE = 57;

      // letters
      this.A = 65;
      this.B = 66;
      this.C = 67;
      this.D = 68;
      this.E = 69;
      this.F = 70;
      this.G = 71;
      this.H = 72;
      this.I = 73;
      this.J = 74;
      this.K = 75;
      this.L = 76;
      this.M = 77;
      this.N = 78;
      this.O = 79;
      this.P = 80;
      this.Q = 81;
      this.R = 82;
      this.S = 83;
      this.T = 84;
      this.U = 85;
      this.V = 86;
      this.W = 87;
      this.X = 88;
      this.Y = 89;
      this.Z = 90;

    }
};

function input(){
  // keycode handeler
  this.keycode = new keyCode();

  // mouse positions

  // get key
  this.getKey = function(code){
    return _keys[code];
  }

  // get mouse down
  this.getMouseDown = function(){
    return _mouseDown;
  }

  // get mouse x
  this.getMouseX = function(){
    return _mouseX;
  }

  // get mouse y
  this.getMouseY = function(){
    return _mouseY;
  }

  // get if phone movement
  this.isPhoneMovement = function(){
    return _isPhoneMovement;
  }

  // get phone x
  this.getPhoneX = function(){
    return _phoneX;
  }

  // get phone y
  this.getPhoneY = function(){
    return _phoneY - 90;
  }

  // phone movement handeler
  window.addEventListener('deviceorientation', function(event) {
    // set phone movement to true
    if(!_isPhoneMovement){
      _isPhoneMovement = true;
    }
    // print to <p> in index
    document.getElementById("infotag").innerHTML = "INFO: " + Math.round(event.alpha) + ' : ' + Math.round(event.beta) + ' : ' + Math.round(event.gamma);
    // set variable
    _phoneX = event.alpha;
    _phoneY = event.beta;
  });

}

// key click handeler
function _keyCodeEventHandeler(event, down){
  // on key down
  if(down && _keys[event.keyCode] != true){
    _keys[event.keyCode] = true;
  }
  // on key up
  else if(!down && _keys[event.keyCode] != false){
    _keys[event.keyCode] = false;
  }
}

// mouse click handeler
function _mouseClickHandeler(event, down){
  _mouseDown = down;
}

// mouse movement handeler
function _mouseMovementHandeler(event){
    var rect = canvas.getBoundingClientRect();
    _mouseX = Math.round(event.clientX - rect.left);
    _mouseY = Math.round(event.clientY - rect.top);
}
