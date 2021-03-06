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
      height: 600,
      hasBounds: true,
      wireframes: false
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
  boomStore.init()

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
    }),

    Bodies.rectangle(200, 300, 400, 600, {
      isSensor: true,
      isStatic: true,
      render: {
        sprite: {
          texture: '../images/bg.jpg'
        }
      }
    })
  ])

  boomStore.bubbles = [
    new Bubble({
      x: 120,
      y: 40,
      label: 'bubble1'
    }).matterBody,
    new Bubble({
      x: 120,
      y: 100,
      label: 'bubble2'
    }).matterBody,
    new Bubble({
      x: 120,
      y: 160,
      label: 'bubble3'
    }).matterBody,
    new Bubble({
      x: 120,
      y: 220,
      label: 'bubble4'
    }).matterBody,
    new Bubble({
      x: 120,
      y: 280,
      label: 'bubble5'
    }).matterBody
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
    new Bomb({
      explosionBodies: Composite.allBodies(engine.world),
      beforeExplosion() {
        runner.enabled = true
      },
      beforeDestroy() {
        initBomb()
      }
    })
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
