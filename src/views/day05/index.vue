<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1100)
camera.position.set(0, 0, 0.1)
camera.lookAt(new THREE.Vector3(5, 0, 0))
scene.add(camera)
// scene.background = new THREE.TextureLoader().load(new URL('./pic.webp', import.meta.url).href)
const sphereGeometry = new THREE.SphereGeometry(50, 50, 50)
const sphereMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(new URL('./pic.webp', import.meta.url).href),
  side: THREE.DoubleSide
})
// sphereGeometry.scale(1, 1, -1)
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphereMesh)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.x = 5
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)
const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
  controls.update()
}
onMounted(async () => {
  const dom = document.getElementById('canvas')
  dom?.appendChild(renderer.domElement)
  render()
})
</script>
<template>
  <LayoutContainer id="canvas"> </LayoutContainer>
</template>
