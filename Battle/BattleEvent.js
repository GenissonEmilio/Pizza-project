class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }
  
  textMessage(resolve) {
    
    const text = this.event.text
    .replace('{CASTER}', this.event.caster?.name)
    .replace('{TARGET}', this.event.target?.name)
    .replace('{ACTION}', this.event.action?.name)
    
    const message = new TextMessage({
      text,
      onComplete: () => {
        resolve();
      }
    });
    message.init(this.battle.element)
  }
  
  async stateChange(resolve) {
    const {caster, target, damage, recover, status, action} = this.event;
    let who = this.event.onCaster ? caster : target;
    
    if (damage) {
      //modify the target to have less hp
      target.update({
        hp: target.hp - damage
      })
      
      //start blinking
      target.pizzaElement.classList.add('battle-damage-blink');
    }
    
    if (recover) {
      let newHp = who.hp + recover;
      if (newHp > who.maxHp) {
        newHp = who.maxHp
      }
      who.update({
        hp: newHp
      })
    }
    
    if (status) {
      who.update({
        status: {...status}
      })
    }
    if (status === null) {
      who.update({
        status: null
      })
    }
    
    //Wait a little bit
    await utils.wait(600)
    
    this.battle.playerTeam.update();
    this.battle.enemyTeam.update();
    
    //Stop blinking
    target.pizzaElement.classList.remove('battle-damage-blink');
    resolve();
  }
  
  submissionMenu(resolve) {
    const {caster} = this.event;
    const menu = new SubmissionMenu({
      caster: this.event.caster,
      enemy: this.event.enemy,
      items: this.battle.items, 
      replacements: Object.values(this.battle.combatants).filter(c => {
        return c.id !== this.event.caster.id && c.team === this.event.caster.team && c.hp > 0
      }),
      onComplete: submission => {
        resolve(submission);
      }
    })
    menu.init(this.battle.element)
  }
  
  replacementMenu(resolve) {
    const menu = new ReplacementMenu({
      replacements: Object.values(this.battle.combatants).filter(c => {
        return c.team === this.event.team && c.hp > 0;
      }),
      onComplete: replacement => {
        resolve(replacement);
      }
    })
    menu.init(this.battle.element)
  }
  
  async replace(resolve) {
    const {replacement} = this.event;
    
    //Clear out the old combatant
    const prevCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]];
    this.battle.activeCombatants[replacement.team] = null;
    prevCombatant.update();
    await utils.wait(480);
    
    //In with the new!
    this.battle.activeCombatants[replacement.team] = replacement.id;
    replacement.update();
    await utils.wait(480);
    
    this.battle.playerTeam.update();
    this.battle.enemyTeam.update();
    
    resolve();
  }
  
  giveXp(resolve) {
    let amount = this.event.xp;
    const {combatants} = this.event;
    const step = () => {
      if (amount > 0) {
        amount -= 1;
        combatants.xp += 1;
        
        //Check if we've hit leve up point
        if (combatants.xp === combatants.maxXp) {
          combatants.xp = 0;
          combatants.maxXp = 100;
          combatants.level += 1;
        }
        
        combatants.update();
        requestAnimationFrame(step);
        return
      }
      resolve();
    }
    requestAnimationFrame(step)
  }
  
  animation(resolve) {
    const fn = BattleAnimations[this.event.animation];
    fn(this.event, resolve);
  }
  
  init(resolve) {
    this[this.event.type](resolve);
  }
}