import * as THREE from 'three';
// 导入轨道控制器库
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入水面
import { Water } from "three/examples/jsm/objects/Water2";
// 导入gltf模型载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 导入解压模型的库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// 导入hdr
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机
const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth/window.innerHeight,
    0.1, 2000);

// 设置相机位置
camera.position.set(-50, 50, 130);
// 更新摄像头宽高比
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);//加入场景

//----------------------------begin---------------------------------------

// const planeGeometry = new THREE.PlaneBufferGeometry(100, 100);
// const planeMaterial = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
// });
//
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(plane);

// 创建天空球
const skyGeometry = new THREE.SphereBufferGeometry(1000, 60, 60);
//翻转一下，否则天空球内部是黑色的
skyGeometry.scale(1, 1, -1);
let texture = new THREE.TextureLoader().load('./textures/sky.jpg');
const skyMaterial = new THREE.MeshBasicMaterial({
    map: texture,
});
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);



//视频纹理
const video = document.createElement("video");
video.src = "./textures/sky.mp4";
video.loop = true;

window.addEventListener("click", (e) => {
    //当鼠标点击播放视频
    if(video.paused){
        video.play();
        let texture = new THREE.VideoTexture(video);
        skyMaterial.map = texture;
        skyMaterial.map.needsPrelude = true;
    }
});

//载入环境纹理hdr
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync("./assets/050.hdr").then((texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
});

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-100, 100, 10);
scene.add(light);

//创建水面
const waterGeometry = new THREE.CircleBufferGeometry(300, 64);
const water = new Water(waterGeometry,{
   textureWidth: 1024,
    textureHeight: 1024,
    color: 0xeeeeff,
    flowDirection: new THREE.Vector2(1, 1),
    scale: 1,
});
water.position.y = 1;
//让水面水平
water.rotation.x = -Math.PI / 2;
scene.add(water);

//添加小岛模型
//实例化gltf载入库
const loader = new GLTFLoader();
//实例化draco载入库
const dracoLoader = new DRACOLoader();
//添加draco载入库
dracoLoader.setDecoderPath("./draco/");
loader.setDRACOLoader(dracoLoader);

loader.load("./model/island2.glb", (gltf) => {
    scene.add(gltf.scene);
});

//添加环境纹理



//-----------------------------end--------------------------------------
//初始化渲染器
const renderer = new THREE.WebGLRenderer({
    // 设置抗锯齿
    antialias: true,
    // 设置对数深度缓冲区, 避免模型面数过多造成闪烁
    logarithmicDepthBuffer: true,
});
renderer.outputEncoding = THREE.sRGBEncoding;
//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
//开启阴影渲染
renderer.shadowMap.enabled = true;
// console.log(renderer);

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

//使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
//设置控制器阻尼，让控制器更有真实效果（惯性） 需在动画循环里面添加 update()
controls.enableDamping = true;



//让画面一直渲染，相当于loop
function render() {
    // cube.position.x += 0.01;
    // cube.rotation.x += 0.01;
    // if(cube.position.x > 5){
    //     cube.position.x = 0;
    // }
    //为什么采用下面这种方式渲染？两种实现已经删除了
    //因为每一帧渲染的时间长度是不一致的，所以会导致动画时快时慢
    // let time = clock.getElapsedTime();

    controls.update();

    renderer.render(scene, camera);
    //渲染下一帧的时候继续调用render()函数
    requestAnimationFrame(render);
}

render();


//监听画面变化，更新渲染尺寸，即自适应
window.addEventListener("resize", () => {
    // console.log('window size changed');
    //更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //设置渲染器的像素比
    // renderer.setPixelRatio(window.devicePixelRatio);
});


