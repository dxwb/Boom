(() => {
  window.boomStore = {
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
    }
  }
})()
