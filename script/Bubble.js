(function(Vertices, Bodies){
  const Bubble = {
    create(x = 0, y = 0, label) {
      const bubbleVertices = Vertices.fromPath('20 10 20 0 100 0 100 40 20 40 20 30 10 20')

      return Bodies.fromVertices(
        x,
        y,
        bubbleVertices,
        {
          label,
          render: {
            fillStyle: '#66ccff',
            strokeStyle: '#ff6600',
            lineWidth: 1
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
