<script setup>
import * as THREE from 'three'
import { onMounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OimoPhysics } from 'three/examples/jsm/physics/OimoPhysics'

// 初始化场景
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x666666)

//初始化相机
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(-3, 4, 10)
camera.lookAt(0, 0.5, 0)
//更新摄像头的宽高比
camera.aspect = window.innerWidth / window.innerHeight
//更新摄像透投影矩阵
camera.updateProjectionMatrix()
//场景添加摄像机
scene.add(camera)

const hemiLight = new THREE.HemisphereLight()
hemiLight.intensity = 0.35
scene.add(hemiLight)

const dirLight = new THREE.DirectionalLight()
dirLight.position.set(5, 5, 5)
dirLight.castShadow = true
dirLight.shadow.camera.zoom = 2
scene.add(dirLight)

const floor = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 4), new THREE.MeshBasicMaterial({ color: 0x111111 }))
floor.position.y = -2.5
floor.receiveShadow = true
scene.add(floor)

//一种非光泽表面的材质，没有镜面高光
const material = new THREE.MeshLambertMaterial()

const matrix = new THREE.Matrix4()
const color = new THREE.Color()

const geometryBox = new THREE.BoxGeometry(0.1, 0.1, 0.1)

//渲染大量具有相同几何体与材质、
const boxes = new THREE.InstancedMesh(geometryBox, material, 100)
boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage) // will be updated every frame
boxes.castShadow = true
boxes.receiveShadow = true
scene.add(boxes)
for (let i = 0; i < boxes.count; i++) {
  matrix.setPosition(Math.random() - 0.5, Math.random() * 3, Math.random() - 0.5)
  boxes.setMatrixAt(i, matrix)
  boxes.setColorAt(i, color.setHex(0xffffff * Math.random()))
}

// Spheres

const geometrySphere = new THREE.IcosahedronGeometry(0.075, 3)
const spheres = new THREE.InstancedMesh(geometrySphere, material, 100)
spheres.instanceMatrix.setUsage(THREE.DynamicDrawUsage) // will be updated every frame
spheres.castShadow = true
spheres.receiveShadow = true
scene.add(spheres)

for (let i = 0; i < spheres.count; i++) {
  matrix.setPosition(Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5)
  spheres.setMatrixAt(i, matrix)
  spheres.setColorAt(i, color.setHex(0xffffff * Math.random()))
}

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
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

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
onMounted(async () => {
  const physics = await OimoPhysics()
  physics.addMesh(floor)
  physics.addMesh(spheres, 1)
  physics.addMesh(boxes, 1)
  const dom = document.getElementById('day01')
  dom?.appendChild(renderer.domElement)
  render()
})
</script>
<template>
  <div id="day01" ref="canvas" />
</template>
