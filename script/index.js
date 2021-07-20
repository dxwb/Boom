(function(){
  const {
    Application,
    Sprite
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
    forceCanvas: true
  })
  const { loader } = app
  document.querySelector('.box').appendChild(app.view)
  boomStore.app = app

  loader.add([
    '../images/avatar.png',
    '../images/bg.jpg'
  ]).load(() => {
    // 加载背景
    const bg = new Sprite(loader.resources['../images/bg.jpg'].texture)
    app.stage.addChild(bg)


    /* Matter */
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
  
    const avatars = [
      new Avatar(40, 40),
      new Avatar(40, 100),
      new Avatar(40, 160),
      new Avatar(40, 220),
      new Avatar(40, 280)
    ]
    Composite.add(world, [
      ...avatars.map(el => el.matterBodies),
      boomStore.bubbles[0],
      boomStore.bubbles[1],
      boomStore.bubbles[2],
      boomStore.bubbles[3],
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

    Events.on(engine, 'afterUpdate', ev => {
      avatars.forEach(avatar => {
        avatar.pixiSprite.position.set(
          avatar.matterBodies.position.x,
          avatar.matterBodies.position.y
        )
        avatar.pixiSprite.rotation = avatar.matterBodies.angle
      })
    })
  })

  // provide concave decomposition support library
  Common.setDecomp(decomp)
})()
