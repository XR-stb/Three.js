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


//添加物体
//创建几何体
for(let i = 0; i < 50; i++){
    //一个三角形需要三个顶点，一个顶多是3个坐标，所以总共需要生成9个坐标值
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(9);
    for(let j = 0; j < 9; j++){
        positionArray[j] = Math.random() * 4 - 2;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));

    let randColor = new THREE.Color(Math.random(),Math.random(),Math.random());
    //创建材质
    const material = new THREE.MeshBasicMaterial({
        color: randColor,
        transparent: true,
        opacity: 0.5});

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
}



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

