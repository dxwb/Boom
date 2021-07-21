(function(Vertices, Bodies){
  const {
    Sprite
  } = PIXI

  class Bubble {
    constructor({
      x = 0,
      y = 0,
      label
    }) {
      this.label = label
      this.pixiSprite = new Sprite(boomStore.app.loader.resources['../images/bubble1.png'].texture)
      this.pixiSprite.x = x
      this.pixiSprite.y = y
      this.pixiSprite.anchor.set(.5, .5)
    }

    createMatterBody() {
      const { width, height } = this.pixiSprite
      const bubbleVertices = Vertices.fromPath(`4 12 4 0 ${width} 0 ${width} ${height} 4 ${height} 4 21 0 16`)

      this.matterBody = Bodies.fromVertices(
        this.pixiSprite.x,
        this.pixiSprite.y,
        bubbleVertices,
        { label: this.label },
        true
      )

      return this.matterBody
    }
  }

  window.Bubble = Bubble
})(
  Matter.Vertices,
  Matter.Bodies
)
