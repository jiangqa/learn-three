import fscreen from 'fscreen'
export default function useFullScreen() {
  function fullScreen() {
    const dom = document.body
    if (fscreen.fullscreenElement) {
      fscreen.exitFullscreen()
    } else {
      fscreen.requestFullscreen(dom)
    }
  }
  return {
    fullScreen
  }
}
