class KeyPressListener {
  constructor(keyCode, callBack) {
    let keySafe = true
    this.keydownFunction = function(event) {
      if (event.target.id === keyCode) {
        if (keySafe) {
          keySafe = false
          callBack()
        }
      }
    };
    this.keyupFunction = function(event) {
      if (event.target.id === keyCode) {
        keySafe = true
      }
    };
    
    document.addEventListener('mousedown', this.keydownFunction);
    document.addEventListener('mouseup', this.keyupFunction);
    
  }
  
  unbind() {
    document.removeEventListener('mousedown', this.keydownFunction);
    document.removeEventListener('mouseup', this.keyupFunction);
  }
}