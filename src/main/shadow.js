import * as THREE from 'three';
// 导入轨道控制器库
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机
const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth/window.innerHeight,
    0.1, 1000);

// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);//加入场景

//----------------------------begin---------------------------------------
/** 产生阴影的步骤
    1.材质要满足对光照有反应
    2.设置渲染器开启阴影计算 renderer.shadowMap.enabled = true;
    3.设置光照投射阴影 directionalLight.castShadow = true;
    4.设置物体投射阴影 sphere.castShadow = true;
    5.设置物体接收阴影 plane.receiveShadow = true;
 **/


const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, material);

//投射阴影
sphere.castShadow = true;
scene.add(sphere);

//创建平面
const planeGeometry = new THREE.PlaneBufferGeometry(10, 10);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;

//接收阴影
plane.receiveShadow = true;
scene.add(plane);

const light = new  THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

//-----------------------------end--------------------------------------
//初始化渲染器
const renderer = new THREE.WebGLRenderer();
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

//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


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
    renderer.setPixelRatio(window.devicePixelRatio);
});

//双击进入全屏
window.addEventListener("dblclick", () => {
    const fullScreenElement = document.fullscreenElement;
    if(!fullScreenElement) renderer.domElement.requestFullscreen();
    else document.exitFullscreen();
});

