class DirectionInput {
  constructor() {
    this.heldDirections = []

    this.map = {
      'buttonUp': 'up',
      'buttonDown': 'down',
      'buttonLeft': 'left',
      'buttonRight': 'right'
    }
  }
  
  get direction() {
    //console.log(this.heldDirections)
    return this.heldDirections[0]
  }

  init() {
    //I'm crazyyyyy
    document.addEventListener('mousedown', e => {
      const dir = this.map[e.target.id]
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir)
      }
    })
    
    document.addEventListener('mouseover', e => {
      const dir = this.map[e.target.id]
      const index = this.heldDirections.indexOf(dir)
      if (index > -1) {
        this.heldDirections.splice(index, 1)
      }
    })
    
  }
}
