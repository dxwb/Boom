(function(Bodies){
  const Avatar = {
    create(x = 0, y = 0) {
      return Bodies.rectangle(x, y, 40, 40, {
        chamfer: {
          radius: 5
        },
        render: {
          sprite: {
            texture: '../images/avatar.jpg'
          }
        }
      })
    }
  }

  window.Avatar = Avatar
})(
  Matter.Bodies
)
