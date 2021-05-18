(function(Bodies, Body, Vector, Common, Events){
  let fireworkFrame = 0

  class Bomb {
    constructor(
      {
        x = 0,
        y = 0,
        explosionBodies = [],
        beforeExplosion = () => {},
        beforeDestroy = () => {}
      }
    ) {
      this.element = this._addDom()
      this.matterBody = Bodies.circle(x, y, 20)
      this.mouse = {
        dragging: false
      }
      // 检测与爆炸射线碰撞的bodies
      this.explosionBodies = explosionBodies
      // 爆炸前的hook
      this.beforeExplosion = beforeExplosion
      // 销毁前的hook
      this.beforeDestroy = beforeDestroy

      // 修正this
      this.handleAfterRender = this.handleAfterRender.bind(this)
      this.handleMouseMove = this.handleMouseMove.bind(this)
      this.handleMouseUp = this.handleMouseUp.bind(this)

      this._bind()
    }

    _renderFirework() {
      const { position } = this
    }

    _explosion() {
      const bomb = this.matterBody
      const bodies = this.explosionBodies

      this.beforeExplosion()

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

          Body.applyForce(_body, point, Vector.mult(Vector.sub(verts[1], verts[0]), .0007))
        })
      }

      this._renderFirework(bomb)
      this._destroy(bomb)
    }

    _bind() {
      const { element } = this

      element.addEventListener('mousedown', ev => {
        const x = ev.clientX - 20
        const y = ev.clientY - 20

        this.mouse.dragging = true
        element.style.left = `${x}px`
        element.style.top = `${y}px`
      })

      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)

      Events.on(boomStore.render, 'afterRender', this.handleAfterRender)
    }

    handleMouseUp(ev) {
      this.mouse.dragging = false

      const point = boomStore.inCanvas({
        x: ev.clientX,
        y: ev.clientY
      })

      if (!point) {
        alert('不对哦，你没有把炸弹放到聊天界面中呢 ~ ')
        return
      }

      this.matterBody.position.x = point.x
      this.matterBody.position.y = point.y
      this._explosion()
    }

    handleMouseMove(ev) {
      const x = ev.clientX - 20
      const y = ev.clientY - 20

      if (this.mouse.dragging) {
        this.element.style.left = `${x}px`
        this.element.style.top = `${y}px`
      }
    }

    handleAfterRender() {
      this._renderFirework()
    }

    _addDom() {
      const dom = document.createElement('div')
      dom.className = `bomb b${Common.choose([1, 2, 3])}`
      document.body.appendChild(dom)
      return dom
    }

    _destroy() {
      this.beforeDestroy()

      document.body.removeChild(this.element)
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)

      Events.off(boomStore.render, 'afterRender', this.handleAfterRender)
    }
  }

  window.Bomb = Bomb
})(
  Matter.Bodies,
  Matter.Body,
  Matter.Vector,
  Matter.Common,
  Matter.Events
)
