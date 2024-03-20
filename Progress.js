class Progress {
  constructor() {
    this.mapId = 'DemoRoom';
    this.startingHeroX = 0;
    this.startingHeroY = 0;
    this.startingHeroDirection = 'down';
    this.saveFileKey = 'PizzaLegends_SaveFile1';
  }
  
  async save() {
    try {
      const response = await fetch('http://localhost:3000/save_player_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mapId: this.mapId,
          startingHeroX: this.startingHeroX,
          startingHeroY: this.startingHeroY,
          startingHeroDirection: this.startingHeroDirection,
          playerState: {
            pizzas: playerState.pizzas,
            lineup: playerState.lineup,
            items: playerState.items,
            storyFlags: playerState.storyFlags
          }
        })
      });
      const result = await response.json();
      console.log('resultado: ', result);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }
  
  async getSaveFile() {
    const response = await fetch('http://localhost:3000/player_data');
    const data = await response.json();
    return data ? data : null
  }
  
  load() {
    try {
      const data = this.getSaveFile();
      if (data) {
        this.mapId = data.map_id;
        this.startingHeroX = data.starting_hero_X;
        this.startingHeroY = data.starting_hero_Y;
        this.startingHeroDirection = data.starting_hero_direction;
        playerState.pizzas = data.pizzas;
        playerState.lineup = data.lineup;
        playerState.items = data.items;
        playerState.storyFlags = data.story_flags;
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }
}
