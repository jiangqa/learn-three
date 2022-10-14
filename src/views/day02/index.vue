<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入水面
import { Water } from 'three/examples/jsm/objects/Water2'
// 导入gltf载入库
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// 初始化场景
const scene = new THREE.Scene()

//初始化相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
//设置相机位置
camera.position.set(-50, 50, 130)
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

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// //添加平面
// const planeGeometry = new THREE.PlaneGeometry(100, 100)
// //添加材质
// const meshBasicMaterial = new THREE.MeshBasicMaterial({
//   color: 0xffffff
// })
// const plane = new THREE.Mesh(planeGeometry, meshBasicMaterial)
// scene.add(plane)

let texture = new THREE.TextureLoader().load('textures/sky.jpg')

//创建一个球
const skyGeometry = new THREE.SphereGeometry(1000, 60, 60)
//创建纹理
const skyMaterial = new THREE.MeshBasicMaterial({
  map: texture
})
skyGeometry.scale(1, 1, -1)
const sky = new THREE.Mesh(skyGeometry, skyMaterial)
scene.add(sky)
// 载入环境纹理hdr
const hdrLoader = new RGBELoader()
hdrLoader.loadAsync(new URL('./assets/050.hdr', import.meta.url).href).then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-100, 100, 10)
scene.add(light)

// 创建水面
const waterGeometry = new THREE.CircleGeometry(1000, 64)
const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 1
})
water.position.y = 3
// 水面旋转至水平
water.rotation.x = -Math.PI / 2
scene.add(water)

// 添加小岛模型
// 实例化gltf载入库
const loader = new GLTFLoader()
// 实例化draco载入库
const dracoLoader = new DRACOLoader()
// 添加draco载入库
dracoLoader.setDecoderPath('./libs/draco/gltf/')
// 添加draco载入库
loader.setDRACOLoader(dracoLoader)

loader.load(new URL('./model/island2.glb', import.meta.url).href, (gltf) => {
  scene.add(gltf.scene)
})
//创建轨道控制器 机围绕目标进行轨道运动
const controls = new OrbitControls(camera, renderer.domElement)
const render = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(render)
  controls.update()
}
onMounted(() => {
  const dom = document.getElementById('day02')
  dom?.appendChild(renderer.domElement)
  render()
})
</script>
<template>
  <LayoutContainer id="day02" ref="canvas" />
</template>
