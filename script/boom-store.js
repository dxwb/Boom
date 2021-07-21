((Events, Common) => {
  let isShake = false
  let shakeStamp = 0

  window.boomStore = {
    init() {
      Events.on(boomStore.render, 'beforeRender', () => {
        if (!isShake) return

        if (shakeStamp > 20) {
          this.app.stage.position.set(0, 0)

          isShake = false
          shakeStamp = 0
        } else {
          this.app.stage.position.set(
            Common.choose([2, 6]) * (shakeStamp % 2 === 0 ? -1 : 1),
            Common.choose([2, 6]) * (shakeStamp++ % 2 === 0 ? -1 : 1)
          )
        }
      })
    },
    // 判断某个点是否在canvas中
    // 如果在canvas中，返回于canvas中的坐标系
    // 否则返回false
    inCanvas({ x, y }) {
      const canvas = document.getElementsByTagName('canvas')[1]
      const rect = canvas.getBoundingClientRect()

      if (x >= rect.x && x <= rect.x + rect.width) {
        if (y >= rect.y && y <= rect.y + rect.height) {
          return {
            x: x - rect.x,
            y: y - rect.y
          }
        }
      }

      return false
    },
    // 窗口抖动
    shake(){
      isShake = true
      shakeStamp = 0
    },
    onPostRenderListener: []
  }
})(
  Matter.Events,
  Matter.Common
)
