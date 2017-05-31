
function texture(){
  console.log("texture loader activated!");

  // load new texture
  this.loadTexture = function (location) {
    var cubeTexture = gl.createTexture();
    var cubeImage = new Image();
    cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture, location); }
    cubeImage.src = location;
    return cubeTexture;
  }


}

// handle loaded texture
function handleTextureLoaded(image, texture, location) {
  console.log("loading texture [location: " + location + "]");
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}
