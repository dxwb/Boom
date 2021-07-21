(function(Events){
  class Firework {
    constructor(bomb) {
      // 是否发生爆炸
      this.isExploded = false
      // 爆炸产生的烟花的帧id
      this.fireworkFrame = 0
      this.bomb = bomb

      this.handleAfterRender = this.handleAfterRender.bind(this)

      // 加载图片需要时间，如果是new了实例之后立马调用，可能会播放不了动画
      // 解决：进入应用前预加载图片资源
      this._loadImage()
      this._bind()
    }

    run() {
      this.isExploded = true
    }

    _renderFirework() {
      if (!this.isExploded) return

      const { context: ctx } = boomStore.app.renderer
      const size = 300
      const frameSize = 128
      const { position } = this.bomb.matterBody
      const frameX = frameSize * (this.fireworkFrame % 8)
      const frameY = frameSize * Math.floor(this.fireworkFrame++ / 8)

      ctx.save()
      ctx.translate(position.x, position.y)
      ctx.drawImage(this.fireworkImage, frameX, frameY, frameSize, frameSize, -size / 2, -size / 2, size, size)
      ctx.restore()

      if (this.fireworkFrame > 47) {
        this.isExploded = false
        this._destroy()
      }
    }

    _bind() {
      Events.on(boomStore.render, 'afterRender', this.handleAfterRender)
    }

    _loadImage() {
      this.fireworkImage = new Image()
      this.fireworkImage.src = '../images/boom.png'
    }

    handleAfterRender(ev) {
      this._renderFirework(ev)
    }

    _destroy() {
      Events.off(boomStore.render, 'afterRender', this.handleAfterRender)
    }
  }

  window.Firework = Firework
})(Matter.Events)
