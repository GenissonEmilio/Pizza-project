window.Actions = {
  damage1: {
    name: 'Whomp!',
    description: 'Dar uma pizzada no inimigo',
    success: [
      { type: 'textMessage', text: '{CASTER} usa {ACTION}!' },
      { type: 'animation', animation: 'spin' },
      { type: 'stateChange', damage: 10 },
    ],
  },
  saucyStatus: {
    name: 'Tomato Squeeze',
    description: 'Recupera um pouco de HP por turno',
    targetType: 'friendly',
    success: [
      { type: 'textMessage', text: '{CASTER} usa {ACTION}!' },
      { type: 'stateChange', status: { type: 'saucy', expiresIn: 3 } },
    ],
  },
  clumsyStatus: {
    name: 'Oliver Oil',
    description: 'Possui uma chance de colocar o inimigo para dormir',
    success: [
      { type: 'textMessage', text: '{CASTER} usa {ACTION}!' },
      { type: 'animation', animation: 'glob', color: '#dafd2a'},
      { type: 'animation', animation: 'glob', color: '#red'},
      { type: 'animation', animation: 'glob', color: '#dafd2a'},
      { type: 'stateChange', status: { type: 'clumsy', expiresIn: 3 } },
      { type: 'textMessage', text: '{TARGET} está dormindo' },
    ],
  },
  //Item
  item_recoverStatus: {
    name: 'Lâmpada',
    description: 'Remove status negativos',
    targetType: 'friendly',
    success: [
      { type: 'textMessage', text: '{CASTER} usa uma {ACTION}!' },
      { type: 'stateChange', status: null },
      { type: 'textMessage', text: 'Se sentindo fresco', },
    ],
  },
  item_recoverHp: {
    name: 'Parmesão',
    description: 'Recupera uma quantidade de HP',
    targetType: 'friendly',
    success: [
      { type:'textMessage', text: '{CASTER} povilha com um pouco de {ACTION}!' },
      { type:'stateChange', recover: 10,},
      { type:'textMessage', text: '{CASTER} recuperou HP!'},
    ]
  },
}