import * as THREE from 'three';
//导入轨道控制器库
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入动画库
import gsap from "gsap";
//导入dat.gui
import * as dat from "dat.gui";


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
const cubeGeometry = new THREE.BoxGeometry();
//创建材质
const cubeMaterial = new THREE.MeshBasicMaterial({color:0xffff00});

//根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//修改物体的位置
// cube.position.set(3, 0, 0);
// cube.position.y = 1;
//缩放
// cube.scale.set(2, 3, 1);
// cube.scale.x = 3;
//旋转,角度是弧度制
// cube.rotation.set(1, 1, 1);
// cube.rotation.x = Math.PI / 4;
scene.add(cube);

//创建gui
const gui = new dat.GUI();
//为对应的属性添加对应的拖动条ui来控制大小
gui.add(cube.position, "x").min(0).max(5)
    .step(0.01).name("x轴坐标")
    .onChange((value) => {
       // console.log('值被修改了')
       //  cube.material.x.set(value);
    }).onFinishChange((value) => {
        // console.log('完全停下来', value)
    });

//修改物体颜色
const params = {
    color: "#ffff00",
    move:() => {
        gsap.to(cube.position, { x: 5, duration: 2, repeat: -1, yoyo: true })
    }
};

gui.addColor(params, "color").name("颜色").onChange((value) => {
    cube.material.color.set(value);
});

gui.add(cube, "visible").name("是否显示");
gui.add(params, "move").name("cube move");

//如果内容太多了怎么办，使用文件夹形式的gui
var folder = gui.addFolder("设置立方体");
folder.add(cube.material, "wireframe");//是否显示线框


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

//设置时钟
const clock = new THREE.Clock();

//设置动画
// var animate1 = gsap.to(cube.position, { x:5, duration: 5,
//     //设置动画的速度曲线,具体参数可以取gsap官网查看
//     ease: "power1.inOut",
//     //设置重复的次数，-1是无限次
//     repeat: -1,
//     //往返运动
//     yoyo: true,
//     //延迟两秒
//     delay: 2,
//     onComplete: () => { // 动画完成的回调函数
//     console.log("finish");
//     },
//     onStart: () => {
//         console.log("start");
//     }
// });
//为animate1动画添加双击屏幕停止的监听事件
// window.addEventListener("dblclick", () => {
//     if(animate1.isActive()) animate1.pause();
//     else animate1.resume();//恢复动画
// });
//旋转动画
// gsap.to(cube.rotation, { x: Math.PI * 2, duration: 5, ease: "power1.inOut" });

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

