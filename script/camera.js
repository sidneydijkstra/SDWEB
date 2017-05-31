
var position = vec3.create();

var yaw = 0;
var pitch = 0;

var front = vec3.create();

// constructor
function camera(){

  position.x = -5;

  // camera update function
  this.update = function(){
    var front_ = vec3.create();
    front_.x = Math.cos(yaw * (Math.PI / 180)) * Math.cos((pitch * (Math.PI / 180)));
    front_.y = Math.sin(pitch * (Math.PI / 180));
    front_.z = Math.sin(yaw * (Math.PI / 180)) * Math.cos(pitch * (Math.PI / 180));
    vec3.normalize(front, front_);
  }

  // get view matrix
  this.getViewMatrix = function(){
    var frontPos = vec3.create();
    vec3.add(frontPos, position, front);
    var modelview = mat4.create();
    // matrix, eye, pos, up
    mat4.lookAt(modelview, [-5,0,0], frontPos, [0,1,0]);
    return modelview;
  }


}
