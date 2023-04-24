import * as THREE from 'three';
// 导入轨道控制器库
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 导入gltf模型载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 导入解压模型的库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import {AmbientLight} from "three";

//gltf转glb
//gltf-pipeline -i scene.gltf -o scene.glb

// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机
const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth/window.innerHeight,
    0.1, 2000);

// 设置相机位置
camera.position.set(0, 5, -20);
camera.rotation.x = Math.PI;
camera.rotation.y = Math.PI;
camera.rotation.z = Math.PI;
// 更新摄像头宽高比
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);//加入场景

//----------------------------begin---------------------------------------



//添加物体
//创建几何体
const cubeGeometry = new THREE.BoxGeometry();
//创建材质
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xdddddd});

//根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//修改物体的位置
cube.position.set(3, 0, 0);
// 缩放
cube.scale.set(2, 3, 1);
cube.scale.z = 5;
//旋转,角度是弧度制
// cube.rotation.set(1, 1, 1);
cube.rotation.y = Math.PI / 2;
scene.add(cube);

//添加模型
//实例化gltf载入库
const loader = new GLTFLoader();
//实例化draco载入库
const dracoLoader = new DRACOLoader();
//添加draco载入库
dracoLoader.setDecoderPath("./draco/");
loader.setDRACOLoader(dracoLoader);

scene.add(new AmbientLight(0xdddddd));
scene.add(new THREE.AmbientLight(0xffffff, 10));

loader.load("./phoenix_bird/scene.glb", (gltf) => {
    console.log(gltf);
    gltf.scene.scale.set(1, 1, 1);
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


