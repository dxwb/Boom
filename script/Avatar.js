(function(Bodies){
  const Avatar = {
    create(x = 0, y = 0) {
      return Bodies.rectangle(x, y, 40, 40, {
        chamfer: {
          radius: 3
        },
        render: {
          sprite: {
            texture: '../images/avatar.jpg',
            xScale: .5,
            yScale: .5
          }
        }
      })
    }
  }

  window.Avatar = Avatar
})(
  Matter.Bodies
)
