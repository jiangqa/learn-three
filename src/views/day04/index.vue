<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 初始化场景
const scene = new THREE.Scene()

//初始化相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
//设置相机位置
camera.position.set(-10, 10, 20)
//更新摄像头的宽高比
camera.aspect = window.innerWidth / window.innerHeight
//更新摄像透投影矩阵
camera.updateProjectionMatrix()
//场景添加摄像机
scene.add(camera)
//初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
  //   对数深度缓冲区
  logarithmicDepthBuffer: true
})
renderer.outputEncoding = THREE.sRGBEncoding
//设置渲染器宽高
renderer.setSize(window.innerWidth, window.innerHeight)
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const group = new THREE.Group()
for (let i = 0; i < 10; i++) {
  const random = Math.random() * 10
  const boxGeometry = new THREE.BoxGeometry(1, random, 1)
  const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
  })

  const box = new THREE.Mesh(boxGeometry, boxMaterial)
  let z = 0
  let x = 2 * i + 2
  if (i >= 5) {
    z = 3
    x = 2 * (i - 5) + 2
  }
  box.position.set(x, random / 2, z)
  group.add(box)
}
scene.add(group)
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
const controls = new OrbitControls(camera, renderer.domElement)

const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
  controls.update()
}
onMounted(() => {
  const dom = document.getElementById('day01')
  dom?.appendChild(renderer.domElement)
  render()
})
</script>
<template>
  <div id="day01" ref="canvas" />
</template>
