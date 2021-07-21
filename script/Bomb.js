(function(Bodies, Body, Vector, Common, Bounds){
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
      this.handleMouseMove = this.handleMouseMove.bind(this)
      this.handleMouseUp = this.handleMouseUp.bind(this)

      this._bind()
    }

    _explosion() {
      const bomb = this.matterBody
      const bodies = this.explosionBodies

      this.beforeExplosion()
      this._removeElement()

      // 创建一个烟花并引爆
      new Firework(this).run()

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
            _body = boomStore.bubbles.find(b => b.matterBody.label === body.label).matterBody
          }

          Body.applyForce(_body, point, Vector.mult(Vector.sub(verts[1], verts[0]), .0007))
        })
      }

      this._destroy()

      boomStore.shake()
    }

    _bind() {
      const { element } = this

      element.addEventListener('mousedown', ev => {
        const x = ev.clientX - 20
        const y = ev.clientY - 20

        this.mouse.dragging = true
        element.style.position = 'fixed'
        element.style.left = `${x}px`
        element.style.top = `${y}px`
      })

      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
    }

    handleMouseUp(ev) {
      if (!this.mouse.dragging) return

      this.mouse.dragging = false

      const point = boomStore.inCanvas({
        x: ev.clientX,
        y: ev.clientY
      })

      this.element.style.position = 'static'
      if (!point) {
        alert('不对哦，你没有把炸弹放到聊天界面中呢 ~ ')
        return
      }

      this.matterBody.position.x = point.x
      this.matterBody.position.y = point.y
      this._explosion()
    }

    handleMouseMove(ev) {
      if (!this.mouse.dragging) return

      const x = ev.clientX - 20
      const y = ev.clientY - 20
      
      this.element.style.left = `${x}px`
      this.element.style.top = `${y}px`
    }

    _addDom() {
      const dom = document.createElement('div')
      dom.className = `bomb b${Common.choose([1, 2, 3])}`
      document.getElementById('p').appendChild(dom)
      return dom
    }

    _removeElement() {
      document.getElementById('p').removeChild(this.element)
    }

    _destroy() {
      this.beforeDestroy()

      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
    }
  }

  window.Bomb = Bomb
})(
  Matter.Bodies,
  Matter.Body,
  Matter.Vector,
  Matter.Common,
  Matter.Bounds
)
