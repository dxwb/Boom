(function(){
  const {
    Engine,
    Render,
    Runner,
    Common,
    MouseConstraint,
    Mouse,
    Composite,
    Bodies
  } = Matter

  // provide concave decomposition support library
  Common.setDecomp(decomp)

  // create engine
  const engine = Engine.create()
  const { world } = engine

  // create renderer
  const render = Render.create({
    element: document.getElementsByClassName('box')[0],
    engine,
    options: {
      width: 400,
      height: 600
    }
  })

  Render.run(render)

  // create runner
  const runner = Runner.create({
    enabled: false
  })
  Runner.run(runner, engine)
  boomStore.runner = runner
  boomStore.render = render

  // add bodies
  Composite.add(world, [
    // walls
    // 下
    Bodies.rectangle(200, 600, 400, 1, {
      isStatic: true
    }),
    // 右
    Bodies.rectangle(400, 300, 1, 10000, {
      isStatic: true
    }),
    // 左
    Bodies.rectangle(0, 300, 1, 10000, {
      isStatic: true
    })
  ])

  boomStore.bubbles = [
    Bubble.create(120, 40, 'bubble1'),
    Bubble.create(120, 100, 'bubble2'),
    Bubble.create(120, 160, 'bubble3'),
    Bubble.create(120, 220, 'bubble4'),
    Bubble.create(120, 280, 'bubble5')
  ]
  Composite.add(world, [
    Avatar.create(40, 40),
    boomStore.bubbles[0],

    Avatar.create(40, 100),
    boomStore.bubbles[1],

    Avatar.create(40, 160),
    boomStore.bubbles[2],

    Avatar.create(40, 220),
    boomStore.bubbles[3],

    Avatar.create(40, 280),
    boomStore.bubbles[4]
  ])

  ;(function initBomb() {
    const bomb = Bomb.create()
    bomb.explosionBodies = Composite.allBodies(engine.world)
    bomb.beforeExplosion = beforeExplosion
    bomb.beforeDestroy = beforeDestroy

    function beforeExplosion() {
      runner.enabled = true
    }
    function beforeDestroy() {
      initBomb()
    }
  })()

  // add mouse control
  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  })

  Composite.add(world, mouseConstraint)

  // keep the mouse in sync with rendering
  render.mouse = mouse

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: {
      x: 0,
      y: 0
    },
    max: {
      x: 400,
      y: 600
    }
  })

  // context for MatterTools.Demo
  // return {
  //   engine: engine,
  //   runner: runner,
  //   render: render,
  //   canvas: render.canvas,
  //   stop: function () {
  //     Matter.Render.stop(render)
  //     Matter.Runner.stop(runner)
  //   }
  // }
})()
