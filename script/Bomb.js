(function(Bodies, Body, Vector){
  const Bomb = {
    create(x = 0, y = 0) {
      const bomb = Bodies.circle(x, y, 15)

      bomb.$$dom = this._addDom()
      this._bind(bomb)

      return bomb
    },
    _explosion(bomb, bodies) {
      bomb.beforeExplosion && bomb.beforeExplosion()

      const { position } = bomb
      const range = 1000
      const num = 100

      for (let i = 0; i < num; i++) {
        const angle = 360 / 100 * i
        const endPoint = {
          x: position.x + range * Math.cos(angle),
          y: position.y + range * Math.sin(angle)
        }
        const collisions = raycast(bodies, position, endPoint).filter(raycol => !raycol.body.isStatic)

        collisions.forEach(({ body, point, verts }) => {
          let _body = body

          if (body.label.includes('bubble')) {
            _body = boomStore.bubbles.find(b => b.label === body.label)
          }

          Body.applyForce(_body, point, Vector.mult(Vector.sub(verts[1], verts[0]), .001))
        })
      }

      this._destroy(bomb)
    },
    _addDom() {
      const dom = document.createElement('div')
      dom.className = 'bomb'
      document.body.appendChild(dom)
      return dom
    },
    _bind(bomb) {
      const dom = bomb.$$dom

      const mouse = {
        dragging: false
      }

      dom.addEventListener('mousedown', ev => {
        const x = ev.clientX - 15
        const y = ev.clientY - 15

        mouse.dragging = true
        dom.style.left = `${x}px`
        dom.style.top = `${y}px`
      })

      document.addEventListener('mousemove', ev => {
        const x = ev.clientX - 15
        const y = ev.clientY - 15

        if (mouse.dragging) {
          dom.style.left = `${x}px`
          dom.style.top = `${y}px`
        }
      })

      dom.addEventListener('mouseup', ev => {
        mouse.dragging = false

        const point = boomStore.inCanvas({
          x: ev.clientX,
          y: ev.clientY
        })

        if (!point) {
          alert('不对哦，你没有把炸弹放到聊天界面中呢 ~ ')
          return
        }

        bomb.position.x = point.x
        bomb.position.y = point.y
        this._explosion(bomb, bomb.explosionBodies)
      })
    },
    _destroy(bomb) {
      bomb.beforeDestroy()
      document.body.removeChild(bomb.$$dom)
    }
  }

  window.Bomb = Bomb
})(
  Matter.Bodies,
  Matter.Body,
  Matter.Vector
)
