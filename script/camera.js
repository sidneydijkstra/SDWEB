

// constructor
function camera(){

  this.position = vec3.create();
  this.yaw = 0;
  this.pitch = 0;
  this.front = vec3.create();

  this.position = [-5,0,0];

  // camera update function
  this.update = function(){
    var front_ = vec3.create();
    front_[0] = Math.cos(this.yaw * (Math.PI / 180)) * Math.cos((this.pitch * (Math.PI / 180)));
    front_[1] = Math.sin(this.pitch * (Math.PI / 180));
    front_[2] = Math.sin(this.yaw * (Math.PI / 180)) * Math.cos(this.pitch * (Math.PI / 180));
    vec3.normalize(this.front, front_);
  }

  // get view matrix
  this.getViewMatrix = function(){
    var frontPos = vec3.create();
    var modelview = new Float32Array(16);
    vec3.add(frontPos, this.position, this.front);
    // matrix, eye, pos, up
    mat4.lookAt(modelview, this.position, frontPos, [0,1,0]);
    return modelview;
  }


}
