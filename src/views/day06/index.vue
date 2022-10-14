<script setup>
import * as THREE from 'three'
import { onMounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x333333)
//环境贴图 hdr图像加载器RGBELoader手机的HDR拍照就是高动态范围，用于对象的最明亮和最暗部分相差特别大的时候。
scene.environment = new RGBELoader().load(new URL('./venice_sunset_1k.hdr', import.meta.url).href, () => {})

//EquirectangularReflectionMapping 和 EquirectangularRefractionMapping 用于等距圆柱投影的环境贴图，也被叫做经纬线映射贴图。等距圆柱投影贴图表示沿着其水平中线360°的视角，以及沿着其垂直轴向180°的视角。贴图顶部和底部的边缘分别对应于它所映射的球体的北极和南极。
scene.environment.mapping = THREE.EquirectangularReflectionMapping
//雾
scene.fog = new THREE.Fog(0x333333, 10, 15)

// 坐标格辅助对象. 坐标格实际上是2维线数组.
const grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff)
grid.material.opacity = 0.2
grid.material.depthWrite = false
grid.material.transparent = true
scene.add(grid)

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(4.25, 1.4, -4.5)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.85
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.maxDistance = 9
controls.target.set(0, 0.5, 0)
controls.update()
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)
const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.03,
  sheen: 0.5
})

const detailsMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1.0,
  roughness: 0.5
})

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.25,
  roughness: 0,
  transmission: 1.0
})

const shadow = new THREE.TextureLoader().load(new URL('./ferrari_ao.png', import.meta.url).href)
//DRACOLoader 用于解码使用KHR_draco_mesh_compression扩展压缩过的文件。
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./libs/draco/gltf/')

// 用于载入glTF 2.0资源的加载器
const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)

const wheels = []
loader.load('./models/gltf/ferrari.glb', function (gltf) {
  const carModel = gltf.scene.children[0]

  //设置body 材质
  carModel.getObjectByName('body').material = bodyMaterial

  carModel.getObjectByName('rim_fl').material = detailsMaterial
  carModel.getObjectByName('rim_rr').material = detailsMaterial
  carModel.getObjectByName('rim_rl').material = detailsMaterial
  carModel.getObjectByName('trim').material = detailsMaterial

  //玻璃材质
  carModel.getObjectByName('glass').material = glassMaterial
  scene.add(carModel)

  //轮子
  wheels.push(
    carModel.getObjectByName('wheel_fl'),
    carModel.getObjectByName('wheel_fr'),
    carModel.getObjectByName('wheel_rl'),
    carModel.getObjectByName('wheel_rr')
  )
  //车底阴影
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
    new THREE.MeshBasicMaterial({
      map: shadow,
      blending: THREE.MultiplyBlending,
      toneMapped: false,
      transparent: true
    })
  )
  mesh.rotation.x = -Math.PI / 2
  mesh.renderOrder = 2
  carModel.add(mesh)
})
const clock = new THREE.Clock()
const render = () => {
  const time = -clock.getElapsedTime()
  //轮子旋转
  for (let i = 0; i < wheels.length; i++) {
    wheels[i].rotation.x = time * Math.PI
  }
  //网格移动
  grid.position.z = -time % 1
  renderer.render(scene, camera)
  controls.update()
  requestAnimationFrame(render)
}
onMounted(async () => {
  const dom = document.getElementById('canvas')
  dom?.appendChild(renderer.domElement)
  render()
  const bodyColorInput = document.getElementById('body-color')
  bodyColorInput.addEventListener('input', function () {
    bodyMaterial.color.set(this.value)
  })

  const detailsColorInput = document.getElementById('details-color')
  detailsColorInput.addEventListener('input', function () {
    detailsMaterial.color.set(this.value)
  })

  const glassColorInput = document.getElementById('glass-color')
  glassColorInput.addEventListener('input', function () {
    glassMaterial.color.set(this.value)
  })
})
</script>
<template>
  <LayoutContainer id="canvas">
    <div class="fixed">
      <div class="colorPicker"><input id="body-color" type="color" value="#ff0000" /><br />Body</div>
      <div class="colorPicker"><input id="details-color" type="color" value="#ffffff" /><br />Details</div>
      <div class="colorPicker"><input id="glass-color" type="color" value="#ffffff" /><br />Glass</div>
    </div>
  </LayoutContainer>
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
