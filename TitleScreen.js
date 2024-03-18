class TitleScreen {
  constructor({ progress }) {
    this.progress = progress;
  }
  
  getOptions(resolve) {
    const saveFile = this.progress.getSaveFile();
    return [
      {
        label: 'Novo Jogo',
        description: 'Iniciar um novo jogo',
        handler: () => {
          this.close();
          resolve();
        }
      },
      saveFile ? {
        label: 'Continuar',
        description: 'Carregar progresso',
        handler: () => {
          this.close();
          resolve(saveFile);
        }
      } : null
    ].filter(v => v);
  }
  
  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('TitleScreen');
    this.element.innerHTML = (`
      <img class="TitleScreen_logo" src="./images/logo.png" alt="Pizza Lgends" />
    `)
    
  }
  
  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }
  
  init(container) {
    return new Promise(resolve => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu = new keyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve));
    })
  }
}