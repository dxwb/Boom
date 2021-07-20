(function(Vertices, Bodies){
  class Bubble {
    constructor({
      x = 0,
      y = 0,
      contentWidth = 100,
      contentHeight = 40,
      label
    }) {
      const bubbleVertices = Vertices.fromPath(`20 10 20 0 ${contentWidth} 0 ${contentWidth} ${contentHeight} 20 ${contentHeight} 20 30 10 20`)

      this.matterBody = Bodies.fromVertices(
        x,
        y,
        bubbleVertices,
        {
          label,
          render: {
            fillStyle: '#abc',
            strokeStyle: '#cde'
          }
        },
        true
      )
    }
  }

  window.Bubble = Bubble
})(
  Matter.Vertices,
  Matter.Bodies
)
