<script setup>
import * as THREE from 'three'
import { onMounted } from 'vue'

const objects = []

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xf0f0f0)

const geometry = new THREE.PlaneGeometry(1000, 1000)
const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false, color: 0x000000 }))
geometry.rotateX(-Math.PI / 2)
scene.add(plane)
objects.push(plane)
const gridHelper = new THREE.GridHelper(1000, 20)
scene.add(gridHelper)

const rollOverGeo = new THREE.BoxGeometry(50, 50, 50)
const rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true })
const rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial)
rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25)

scene.add(rollOverMesh)

const cubeGeo = new THREE.BoxGeometry(50, 50, 50)
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0xfeb74c,
  map: new THREE.TextureLoader().load(new URL('./square-outline-textured.png', import.meta.url).href)
})
const ambientLight = new THREE.AmbientLight(0x606060)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(1, 0.75, 0.5).normalize()
scene.add(directionalLight)

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
camera.position.set(500, 800, 1300)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.85
const axesHelper = new THREE.AxesHelper(100)
scene.add(axesHelper)
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)
const pointer = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let isShiftDown = false
const onPointerMove = (event) => {
  pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
  // 用一个新的原点和方向向量来更新射线
  raycaster.setFromCamera(pointer, camera)
  //检测所有在射线与物体之间，包括或不包括后代的相交部分。返回结果时，相交部分将按距离进行排序，最近的位于第一个。
  const intersects = raycaster.intersectObjects(objects, false)

  if (intersects.length > 0) {
    const intersect = intersects[0]

    rollOverMesh.position.copy(intersect.point).add(intersect.face.normal)
    // divideScalar(50) 向量除以标量50
    // floor 向下取整
    // multiplyScalar(50) 向量与所传入的标量50进行相乘
    //addScalar(25) 将传入的标量s和这个向量的x值、y值以及z值相加
    rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25)
    render()
  }
}

const onPointerDown = (event) => {
  pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)

  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObjects(objects, false)

  if (intersects.length > 0) {
    const intersect = intersects[0]

    // delete cube

    if (isShiftDown) {
      if (intersect.object !== plane) {
        scene.remove(intersect.object)

        objects.splice(objects.indexOf(intersect.object), 1)
      }

      // create cube
    } else {
      const voxel = new THREE.Mesh(cubeGeo, cubeMaterial)
      voxel.position.copy(intersect.point).add(intersect.face.normal)
      voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25)
      scene.add(voxel)

      objects.push(voxel)
    }

    render()
  }
}
const onDocumentKeyDown = (event) => {
  switch (event.keyCode) {
    case 16:
      isShiftDown = true
      break
  }
}
const onDocumentKeyUp = (event) => {
  switch (event.keyCode) {
    case 16:
      isShiftDown = false
      break
  }
}

document.addEventListener('pointermove', onPointerMove)
document.addEventListener('pointerdown', onPointerDown)
document.addEventListener('keydown', onDocumentKeyDown)
document.addEventListener('keyup', onDocumentKeyUp)

const render = () => {
  renderer.render(scene, camera)
  // requestAnimationFrame(render)
}
onMounted(async () => {
  const dom = document.getElementById('canvas')
  dom?.appendChild(renderer.domElement)
  render()
})
</script>
<template>
  <LayoutContainer id="canvas"></LayoutContainer>
</template>
<style scoped lang="less">
.fixed {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 40px;
  left: 0;
  width: 100%;
  height: 40px;

  .colorPicker {
    margin: 0 20px;
    color: #fff;
  }
}
</style>
