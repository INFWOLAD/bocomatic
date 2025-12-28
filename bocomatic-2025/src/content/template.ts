function getOpenSwitch(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.get({ templateSwitch: false }, (res) => {
      resolve(!!res.templateSwitch)
    })
  })
}
function getFirstRun(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.get({ firstRun: true }, (res) => {
      resolve(!!res.firstRun)
    })
  })
}
async function main() {
  // 获取开关状态
  const isOpen = await getOpenSwitch()
  const isFirstRun = await getFirstRun()

  // 首次运行提示
  if (isFirstRun) {
    alert(
      `
      欢迎使用 Bocomatic! 
      
      该提示仅在首次运行时显示，如需再次查看，请重置插件。
      `,
    )
    chrome.storage.local.set({ firstRun: false })
  }
  // 如果开关关闭，直接退出
  if (!isOpen) return
  // confirm('Content script is running!')
}

main()
