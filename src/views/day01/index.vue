<script lang="ts" setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import useFullScreen from '../../use/useFullScreen'
import a from './texture/a.jpg'
const { fullScreen } = useFullScreen()
//创建场景
const scene = new THREE.Scene()

//创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5
//创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)

//纹理
const texture = new THREE.TextureLoader().load(a)

//创建材质
const material = new THREE.MeshBasicMaterial({
  // color: 0x00ff00,
  map: texture
})
// 几何体添加材质
const cube = new THREE.Mesh(geometry, material)
//坐标系 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)

//场景中添加几何体/坐标
scene.add(cube).add(axesHelper)

//创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
//创建轨道控制器 机围绕目标进行轨道运动
const controls = new OrbitControls(camera, renderer.domElement)
// const clock = new THREE.Clock()
gsap.to(cube.position, {
  x: 5, //需要改变的参数
  duration: 2, //动画时间
  ease: 'power1.inOut', //动画速度曲线
  yoyo: true, //是否往返
  repeat: -1 // 重复次数 -1为无限重复
})
gsap.to(cube.rotation, {
  x: 2 * Math.PI,
  duration: 2,
  ease: 'power1.inOut', //动画速度曲线
  yoyo: true, //是否往返
  repeat: -1 // 重复次数 -1为无限重复
})

function animate() {
  //时钟运行总时长
  // const time = clock.getElapsedTime()

  //2次运行时间差
  // const delta = clock.getDelta()
  // console.log(time)
  //旋转
  // cube.rotation.x += 0.02
  // cube.rotation.y += 0.02
  //移动
  // cube.position.x += 0.01
  //缩放
  // cube.scale.x += 0.01
  //控制器
  controls.update()
  //渲染器渲染场景和相机
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

onMounted(() => {
  const dom = document.getElementById('day01')
  dom?.appendChild(renderer.domElement)
  animate()
  window.addEventListener('resize', () => {
    //更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    //更新相机投影矩阵
    camera.updateProjectionMatrix()
    //更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight)
    //更新像素比
    renderer.setPixelRatio(window.devicePixelRatio)
  })
  window.addEventListener('dblclick', () => {
    // animation.isActive() ? animation.pause() : animation.resume()
    fullScreen()
  })
})
</script>
<template>
  <LayoutContainer id="day01" ref="canvas" />
</template>
