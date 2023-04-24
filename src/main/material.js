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
//导入纹理
const textureLoader = new THREE.TextureLoader();
const boxTexture = textureLoader.load('./textures/img5.jpg');//加载的是编译后的文件夹下的资源，所以我们需要将资源放在dist下

//设置纹理偏移
// boxTexture.offset.x = 0.5;

//设置旋转的原点
// boxTexture.center.set(0.5, 0.5);
//设置纹理旋转
// boxTexture.rotation = Math.PI / 4;

//设置纹理的重复
// boxTexture.repeat.set(2, 3);
//设置纹理重复的模式 这里是s方向 在UV映射中对应于U
//镜像重复
//boxTexture.wrapS = THREE.ClampToEdgeWrapping; //这个是默认值
// boxTexture.wrapS = THREE.MirroredRepeatWrapping;
//boxTexture.wrapS = THREE.RepeatWrapping;

// boxTexture.wrapT = THREE.RepeatWrapping;

// const texture = textureLoader.load('./textures/纹理1.jpg');
//灰度图控制透明，黑色完全透明，白色完全不透明
// const AlphaTexture = textureLoader.load('./textures/透明纹理.jpg');
// texture.minFilter = THREE.NearestFilter;
// texture.magFilter = THREE.NearestFilter;


const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
//标准材质MeshStandardMaterial需要有光才能看见
const basicMaterial = new THREE.MeshStandardMaterial({
    color: "#ffff00",
    map: boxTexture,
    // map: texture,
    // alphaMap: AlphaTexture,
    // transparent: true,
    // opacity: 0.9,
    //默认只渲染一面，这样就渲染两面了
    // side: THREE.DoubleSide,
});

const cube = new THREE.Mesh(cubeGeometry, basicMaterial);
scene.add(cube);

// 增加灯光
// 这是环境光， 来自四面八方
const light = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(light);

//平行光 默认从下往上
// const direcLight = new THREE.DirectionalLight(0xfffffff, 0.9);
//改变平行光射入的方向
// direcLight.position.set(1, 10, 1);
// scene.add(direcLight);

//添加平面
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    basicMaterial
);

plane.position.set(3, 0, 0);

scene.add(plane);

//-----------------------------end--------------------------------------
//初始化渲染器
const renderer = new THREE.WebGLRenderer();
//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

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

