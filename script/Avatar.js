(function(Bodies){
  const {
    Sprite
  } = PIXI

  class Avatar {
    constructor(x = 0, y = 0) {
      this.x = x
      this.y = y
      this.pixiSprite = new Sprite(boomStore.app.loader.resources['../images/avatar.png'].texture)
      this.pixiSprite.x = x
      this.pixiSprite.y = y
      this.pixiSprite.anchor.set(.5, .5)
    }

    createMatterBody() {
      this.matterBody = Bodies.rectangle(this.x, this.y, 40, 40, {
        chamfer: {
          radius: 5
        }
      })
    }
  }

  window.Avatar = Avatar
})(
  Matter.Bodies
)
