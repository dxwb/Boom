(function(){
  class Message {
    constructor(x = 0, y = 0, bubbleLabel = '') {
      this.avatar = new Avatar(x, y)
      this.bubble = new Bubble({
        x: 120,
        y,
        label: bubbleLabel
      })
    }
  }

  let isOffset = false
  let offset = 0
  // 注册每一帧渲染后要做的事
  boomStore.onPostRenderListener.push(() => {
    if (!isOffset) return

    offset += 10

    boomStore.messages.forEach(({ avatar, bubble }) => {
      avatar.pixiSprite.y -= 10
      bubble.pixiSprite.y -= 10
    })

    // 40是每条消息的高度
    // 30是空隙高度
    if (offset >= 40 + 20) {
      offset = 0
      isOffset = false
    }
  })

  document.getElementById('btn').addEventListener('click', () => {
    const { app, messages } = boomStore
    const msg = new Message(40, 9 * 60 + 40, 'labelp')
    app.stage.addChild(msg.avatar.pixiSprite, msg.bubble.pixiSprite)
    messages.push(msg)

    isOffset = true
  })

  window.Message = Message
})()
