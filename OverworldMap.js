class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};
    this.cutsceneSpaces = config.cutsceneSpaces || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
    
    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      
      let object = this.gameObjects[key]
      object.id = key

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }
  
  async startCutscene(events) {
    this.isCutscenePlaying = true;
    
    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      const result = await eventHandler.init();
      if (result === 'LOST_BATTLE') {
        break;
      }
    }
    
    this.isCutscenePlaying = false;
    
    //Reset Npc to do their idle behavior
   Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    
  }
  
  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      
      const relevantScenario = match.talking.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
    
  }
  
  checkForFootstepCutscene() {
    const hero = this.gameObjects['hero'];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }
  
  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  DemoRoom: {
    id: 'DemoRoom',
    lowerSrc: "./images/maps/DemoLower.png",
    upperSrc: "./images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      }),
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "./images/characters/people/npc1.png",
        behaviorLoop: [
          {type: 'stand', direction: 'left', time: 800},
          {type: 'stand', direction: 'up', time: 800},
          {type: 'stand', direction: 'right', time: 1200},
          {type: 'stand', direction: 'up', time: 300},
        ],
        talking: [
          {
            required: ['TALKED_TO_ERIO'],
            events: [
              {type: 'textMessage', text: 'Erio não é o mais legal?', faceHero: 'npcA'},
            ]
          },
          {
            events: [
              { type: 'textMessage', text: 'Eu vou esmagar você!', faceHero: 'npcA'},
              { type: 'battle', enemyId: 'beth'},
              { type: 'addStoryFlag', flag: 'DEFEATED_BETH'},
              { type: 'textMessage', text: 'Você me esmagou', faceHero: 'npcA'},
              //{type: 'textMessage', text: 'Go away'},
              //{who: 'hero', type: 'walk', direction: 'up'},
            ]
          },
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: './images/characters/people/erio.png',
        talking: [
          {
            required: ['DEFEATED_BETH'],
            events: [
              { type: 'textMessage', text: 'Você derrotou a Beth!? Eu vou bater em você', faceHero: 'npcB'},
              { type: 'battle', enemyId: 'erio'},
            ]
          },
          {
            events: [
              { type: 'textMessage', text: 'Buhahahaha!', faceHero: 'npcB'},
              { type: 'addStoryFlag', flag: 'TALKED_TO_ERIO'},
              //{ type: 'battle', enemyId: 'erio'},
            ]
          },
        ]
        /*behaviorLoop: [
          {type: 'walk', direction: 'left'},
          {type: 'stand', direction: 'up', time: 800},
          {type: 'walk', direction: 'up'},
          {type: 'walk', direction: 'right'},
          {type: 'walk', direction: 'down'},
        ],*/
        
      }),
      pizzaStone: new PizzaStone({
        x: utils.withGrid(2),
        y: utils.withGrid(7),
        storyFlags: 'USED_PIZZA_STONE',
        pizzas: ['v001', 'f001'],
      }),
    },
    walls: {
      [utils.asGridCoord(7,6)] : true,
      [utils.asGridCoord(8,6)] : true,
      [utils.asGridCoord(7,7)] : true,
      [utils.asGridCoord(8,7)] : true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7,4)] : [
        {
          events: [
            { who: 'npcB', type: 'walk', direction: 'left' },
            { who: 'npcB', type: 'stand', direction: 'up', time: 500 },
            { type: 'textMessage', text: 'Voce nao pode ficar ai!' },
            { who: 'npcB', type: 'walk', direction: 'right' },
            { who: 'hero', type: 'walk', direction: 'down' },
            { who: 'hero', type: 'walk', direction: 'left' },
          ]
        }
      ],
      [utils.asGridCoord(5,10)] : [
        {
          events: [
            { 
              type: 'changeMap',
              map: 'Kitchen',
              x: utils.withGrid(2),
              y: utils.withGrid(2),
              direction: 'down'
            },
          ]
        }
      ]
    },
    
  },
  Kitchen: {
    id: 'Kitchen',
    lowerSrc: "./images/maps/KitchenLower.png",
    upperSrc: "./images/maps/KitchenUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        id: 'hero',
        x: utils.withGrid(5),
        y: utils.withGrid(5),
      }),
      npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: "./images/characters/people/npc3.png",
        talking: [
          {
            events: [
              { type: 'textMessage', text: 'You made it!', faceHero:'npcB' },
            ]
          }
        ]
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(5,10)]: [
        {
          events: [
            {
              type: 'changeMap',
              map: 'Street',
              x: utils.withGrid(29),
              y: utils.withGrid(9),
              direction: 'down'
            }
          ]
        }
      ]
    },
  },
  Street: {
    id: 'Street',
    lowerSrc: "./images/maps/StreetLower.png",
    upperSrc: "./images/maps/StreetUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(30),
        y: utils.withGrid(10)
      })
    },
    cutsceneSpaces: {
      [utils.asGridCoord(29,9)]: [
        {
          events: [
            {
              type: 'changeMap',
              map: 'Kitchen',
              x: utils.withGrid(5),
              y: utils.withGrid(10),
              direction: 'up'
            }
          ]
        }
      ]
    },
  }
}