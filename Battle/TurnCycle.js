class TurnCycle {
  constructor({battle, onNewEvent, onWinner }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.onWinner = onWinner;
    this.currentTeam = 'player';
  }
  
  async turn() {
    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId];
    const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"];
    const enemy = this.battle.combatants[enemyId];
    
    const submission = await this.onNewEvent({
      type: 'submissionMenu',
      caster,
      enemy
    })
    
    //Stop here if we are replacing this Pizza
    if (submission.replacement) {
      await this.onNewEvent({
        type: 'replace',
        replacement: submission.replacement
      })
      await this.onNewEvent({
        type: 'textMessage',
        text: `Vá em enfrente ${submission.replacement.name}!`
      })
      this.nextTurn();
      return;
    }
    
    if (submission.instanceId) {
      
      //Add to list to persist to player state later
      this.battle.usedInstanceIds[submission.instanceId] = true;
      
      //Removing item from battle state
      this.battle.items = this.battle.items.filter(i => i.instanceId !== submission.instanceId)
    }
    
    const resultingEvents = caster.getReplacedEvents(submission.action.success);
    
    for (let i=0; i<resultingEvents.length; i++) {
      const event = {
       ...resultingEvents[i],
       submission,
       action: submission.action, 
       caster,
       target: submission.target
      }
      await this.onNewEvent(event);
    }
    
    //Did the target die?
    const targetDead = submission.target.hp <= 0;
    if (targetDead) {
      await this.onNewEvent({
        type: 'textMessage', text: `${submission.target.name} foi destruído`
      })
      
      if (submission.target.team === 'enemy') {
        
        const playerActivePizzaId = this.battle.activeCombatants.player;
        const xp = submission.target.givesXp;
        
        await this.onNewEvent({
          type: 'textMessage',
          text: `Ganhou ${xp} Xp!`
        })
        
        await this.onNewEvent({
        type: 'giveXp',
        xp,
        combatants: this.battle.combatants[playerActivePizzaId]
      })
      }
    }
    
    //Do we have a winning team?
    const winner = this.getWinningTeam();
    if (winner) {
      await this.onNewEvent({
        type: 'textMessage',
        text: 'Venceu!'
      })
      this.onWinner(winner);
      return;
    }
      
    
    //We have a Dead target, but still no winner, so bring in a replacement
    if (targetDead) {
      const replacement = await this.onNewEvent({
        type: 'replacementMenu',
        team: submission.target.team
      });
      await this.onNewEvent({
        type: 'replace',
        replacement: replacement
      })
      await this.onNewEvent({
        type: 'textMessage',
        text: `${replacement.name} apareceu!`
      })
    }
    
    //Check for post events
    //Do things after your original turn submission
    const postEvents = caster.getPostEvents();
    for (let i = 0; i < postEvents.length; i++) {
      const event = {
       ...postEvents[i],
       submission,
       action: submission.action, 
       caster,
       target: submission.target,
      }
      await this.onNewEvent(event);
    }
    
    //Check for status expire
    const expireEvent = caster.decrementStatus();
    if (expireEvent) {
      await this.onNewEvent(expireEvent)
    }
    
    this.nextTurn();
  }
  
  nextTurn() {
    this.currentTeam = this.currentTeam === 'player' ? 'enemy' : 'player';
    this.turn();
  }
  
  getWinningTeam() {
    let aliveTeams = {};
    Object.values(this.battle.combatants).forEach(c => {
      if (c.hp > 0) {
        aliveTeams[c.team] = true;
      }
    })
    if (!aliveTeams['player']) { return 'enemey' }
    if (!aliveTeams['enemy']) { return 'player' }
    return null;
  }
  
  async init() {
    await this.onNewEvent({
      type: 'textMessage',
      text: `${this.battle.enemy.name} quer te jogar no chão`
    });
    
    //Start the first turn!
    this.turn()
    
  }
}