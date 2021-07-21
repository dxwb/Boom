(function(Bodies){
  const {
    Sprite
  } = PIXI

  class Avatar {
    constructor(x = 0, y = 0) {
      this.pixiSprite = new Sprite(boomStore.app.loader.resources['../images/avatar.png'].texture)
      this.pixiSprite.x = x
      this.pixiSprite.y = y
      this.pixiSprite.anchor.set(.5, .5)
      boomStore.app.stage.addChild(this.pixiSprite)

      this.matterBody = Bodies.rectangle(x, y, 40, 40, {
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
