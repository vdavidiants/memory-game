class GameScene extends Phaser.Scene {
  constructor() {
    super("Game")
  }
  preload() {
    this.load.image("bg", "assets/sprites/space.jpg")
    this.load.image("card", "assets/sprites/card.jpg")
    this.load.image("card1", "assets/sprites/card1.jpg")
    this.load.image("card2", "assets/sprites/card2.jpg")
    this.load.image("card3", "assets/sprites/card3.jpg")
    this.load.image("card4", "assets/sprites/card4.jpg")
    this.load.image("card5", "assets/sprites/card5.jpg")
  }
  createText() {
    this.timeoutText = this.add.text(10, 330, "", {
      font: "36px Yui",
      fill: "#ffffff",
    })
  }

  onTimerTick() {
    this.timeoutText.setText("Time: " + this.timeout)
    if (this.timeout <= 0) {
      this.start()
    } else {
      --this.timeout
    }
  }
  createTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true,
    })
  }
  create() {
    this.timeout = config.timeout
    this.createTimer()
    this.createBackground()
    this.createText()
    this.createCards()
    this.start()
  }
  start() {
    this.timeout = config.timeout
    this.openedCard = null
    this.openedCardsCount = 0
    this.initCards()
  }
  initCards() {
    let positions = this.getCardsPositions()
    this.cards.forEach((card) => {
      let position = positions.pop()
      card.close()
      card.setPosition(position.x, position.y)
    })
  }
  createBackground() {
    // this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg')
    this.add.sprite(0, 0, "bg").setOrigin(0, 0)
  }
  createCards() {
    this.cards = []
    for (let value of config.cards) {
      for (let i = 0; i < 2; i++) {
        this.cards.push(new Card(this, value))
      }
    }

    this.input.on("gameobjectdown", this.onCardClicked, this)
  }
  onCardClicked(pointer, card) {
    if (card.opened) {
      return false
    }
    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        this.openedCard = null
        ++this.openedCardsCount
      } else {
        this.openedCard.close()
        this.openedCard = card
      }
    } else {
      this.openedCard = card
    }
    card.open()
    if (this.openedCardsCount === this.cards.length / 2) {
      this.start()
    }
  }
  getCardsPositions() {
    let positions = []
    let cardTexture = this.textures.get("card").getSourceImage()
    let cardWidth = cardTexture.width + 4
    let cardHeight = cardTexture.height + 4
    let offsetX =
      (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2
    let offsetY =
      (this.sys.game.config.height - cardHeight * config.rows) / 2 +
      cardHeight / 2

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        positions.push({
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        })
      }
    }

    return Phaser.Utils.Array.Shuffle(positions)
  }
}
