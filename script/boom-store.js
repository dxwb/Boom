((Events, Bounds, Common) => {
  let isShake = false
  let shakeStamp = 0

  window.boomStore = {
    init() {
      Events.on(boomStore.render, 'beforeRender', () => {
        if (!isShake) return

        if (shakeStamp > 20) {
          Bounds.shift(boomStore.render.bounds, {
            x: 0,
            y: 0
          })

          isShake = false
          shakeStamp = 0
        } else {
          Bounds.shift(boomStore.render.bounds, {
            x: Common.choose([5, 10]) * (shakeStamp % 2 === 0 ? -1 : 1),
            y: Common.choose([5, 10]) * (shakeStamp++ % 2 === 0 ? -1 : 1)
          })
        }
      })
    },
    // 判断某个点是否在canvas中
    // 如果在canvas中，返回于canvas中的坐标系
    // 否则返回false
    inCanvas({ x, y }) {
      const canvas = document.getElementsByTagName('canvas')[0]
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
    }
  }
})(
  Matter.Events,
  Matter.Bounds,
  Matter.Common
)
