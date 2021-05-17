(function(Vertices, Bodies){
  const Avatar = {
    create(x = 0, y = 0) {
      const avatarVertices = Vertices.fromPath('0 0 40 0 40 40 0 40')

      return Bodies.fromVertices(
        x,
        y,
        avatarVertices,
        {},
        true
      )
    }
  }

  window.Avatar = Avatar
})(
  Matter.Vertices,
  Matter.Bodies
)
