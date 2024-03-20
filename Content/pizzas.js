window.PizzaTypes = {
  normal: 'normal',
  spicy: 'spicy',
  veggie: 'veggie',
  fungi: 'fungi',
  chill: 'chill',
}

window.Pizzas = {
  's001': {
    name: 'Slice Samurai',
    description: 'Descrição da pizza',
    type: PizzaTypes.spicy,
    src: './images/characters/pizzas/s001.png',
    icon: './images/icons/spicy.png',
    actions: [ 'saucyStatus', 'clumsyStatus', 'damage1' ],
  },
  's002': {
    name: 'Bacon Brigade',
    description: 'Um guerreiro notável que não tem medo de nada',
    type: PizzaTypes.spicy,
    src: './images/characters/pizzas/s002.png',
    icon: './images/icons/spicy.png',
    actions: [ 'damage1', 'saucyStatus', 'clumsyStatus'],
  },
  'v001': {
    name: 'Call me Kale',
    description: 'Descrição da pizza',
    type: PizzaTypes.veggie,
    src: './images/characters/pizzas/v001.png',
    icon: './images/icons/veggie.png',
    actions: [ 'damage1' ],
  },
  'f001': {
    name: 'Portobello Express',
    description: 'Descrição da pizza',
    type: PizzaTypes.fungi,
    src: './images/characters/pizzas/f001.png',
    icon: './images/icons/fungi.png',
    actions: [ 'damage1' ],
  },
}
