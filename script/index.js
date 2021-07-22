(function(){
  const {
    Application,
    Sprite,
    Container
  } = PIXI

  const {
    Engine,
    Render,
    Runner,
    Common,
    MouseConstraint,
    Mouse,
    Composite,
    Bodies,
    Events
  } = Matter

  const app = new Application({
    width: 400,
    height: 600,
    forceCanvas: true,
    antialias: true
  })
  const { loader } = app
  document.querySelector('.box').appendChild(app.view)
  boomStore.app = app

  loader.add([
    '../images/avatar.png',
    '../images/bg.jpg',
    '../images/bubble1.png'
  ]).load(() => {
    // 加载背景
    const bg = new Sprite(loader.resources['../images/bg.jpg'].texture)
    app.stage.addChild(bg)

    app.renderer.on('postrender', () => {
      boomStore.onPostRenderListener.forEach(f => f())
    })


    /* Matter */
    // create engine
    const engine = Engine.create()
    const { world } = engine

    // create renderer
    const render = Render.create({
      canvas: document.querySelector('#engine'),
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
      })
    ])

    const messages = [
      new Message(40, 40, 'bubble1')
    ]
    app.stage.addChild(
      ...messages.map(msg => msg.avatar.pixiSprite),
      ...messages.map(msg => msg.bubble.pixiSprite)
    )

    // 添加到全局对象中
    boomStore.messages = messages

    ;(function initBomb() {
      const bomb = new Bomb({
        beforeExplosion() {
          if (!runner.enabled) {
            messages.forEach(msg => {
              Composite.add(world, msg.avatar.createMatterBody())
              Composite.add(world, msg.bubble.createMatterBody())
            })
          }

          runner.enabled = true

          bomb.explosionBodies = Composite.allBodies(engine.world)
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

    Events.on(engine, 'afterUpdate', () => {
      messages.forEach(msg => {
        const { avatar, bubble } = msg

        avatar.pixiSprite.position.set(
          avatar.matterBody.position.x,
          avatar.matterBody.position.y
        )
        avatar.pixiSprite.rotation = avatar.matterBody.angle

        bubble.pixiSprite.position.set(
          bubble.matterBody.position.x,
          bubble.matterBody.position.y
        )
        bubble.pixiSprite.rotation = bubble.matterBody.angle
      })
    })
  })

  // provide concave decomposition support library
  Common.setDecomp(decomp)
})()
