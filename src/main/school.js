import * as THREE from 'three';
// 导入轨道控制器库
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 导入gltf模型载入库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 导入解压模型的库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import {AmbientLight} from "three";

import { FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OGeometry} from "three/examples/jsm/libs/OimoPhysics";

//gltf转glb
//gltf-pipeline -i scene.gltf -o scene.glb

// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机
const camera = new THREE.PerspectiveCamera(75,
    window.innerWidth/window.innerHeight,
    0.1, 2000);

// 设置相机位置
camera.position.set(0, 100, 0);
camera.lookAt(0, 0, 0);

// 更新摄像头宽高比
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);//加入场景

//----------------------------begin---------------------------------------
//Light
scene.add(new THREE.AmbientLight(0xffffff, 2))
// const dLight = new THREE.DirectionalLight(0xffffff, 2);
// dLight.position.set(0, 10, 0);

// dLight.castShadow = true;
// dLight.shadow.camera.near = 10;
// dLight.shadow.camera.far = 1000;
// scene.add(dLight);

const light1 = new THREE.AmbientLight( 0xffffff , 0.5); // soft white light
scene.add( light1 );

//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//导入纹理
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('./textures/floor/PavingStones008_1K_Roughness.jpg');//加载的是编译后的文件夹下的资源，所以我们需要将资源放在dist下
//设置纹理的重复
floorTexture.repeat.set(30, 1);
//设置纹理重复的模式 这里是s方向 在UV映射中对应于U
//镜像重复
// floorTexture.wrapS = THREE.ClampToEdgeWrapping; //这个是默认值
// floorTexture.wrapS = THREE.MirroredRepeatWrapping;
floorTexture.wrapS = THREE.RepeatWrapping;
// floorTexture.wrapT = THREE.RepeatWrapping;

//地面 groundGroup
const planeGroup = new THREE.Group();
const planeG = new THREE.PlaneBufferGeometry(80, 40);
const planeM = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    color: 0xDCDCDC,
    // map: floorTexture,
});


const plane = new THREE.Mesh(planeG, planeM);
// plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.01;
plane.position.x -= 10;
scene.add(plane)

const geometry = new THREE.BoxGeometry( 2, 2, 2 );
const material = new THREE.MeshStandardMaterial( {color: 0x00ffff} );
const cube1 = new THREE.Mesh( geometry, material );
cube1.position.set(20, 2, 10);
// cube1.castShadow = true;
// scene.add( cube1 );

const cube2 = new THREE.Mesh( geometry, material );
cube2.position.set(20, 2, -10);
// scene.add( cube2 );


//添加模型
//实例化gltf载入库
const loader = new GLTFLoader();
//实例化draco载入库
const dracoLoader = new DRACOLoader();
//添加draco载入库
dracoLoader.setDecoderPath("./draco/");
loader.setDRACOLoader(dracoLoader);


//树
const treeGroup = new THREE.Group();
loader.load("./model/maple_tree/scene.gltf", (gltf) => {
    gltf.scene.scale.set(0.005, 0.005, 0.005);
    gltf.scene.position.x = 10;
    treeGroup.add(gltf.scene);
});
loader.load("./model/maple_tree/scene.gltf", (gltf) => {
    gltf.scene.scale.set(0.005, 0.005, 0.005);
    gltf.scene.position.x = 10;
    gltf.scene.position.z = 1.5;
    treeGroup.add(gltf.scene);
});
loader.load("./model/maple_tree/scene.gltf", (gltf) => {
    gltf.scene.scale.set(0.005, 0.005, 0.005);
    gltf.scene.position.x = 10;
    gltf.scene.position.z = 3;
    treeGroup.add(gltf.scene);

    const treeGroup1 = treeGroup.clone();
    treeGroup1.position.set(0, 0, 5);
    scene.add(treeGroup1);

    const treeGroup2 = treeGroup.clone();
    treeGroup2.position.set(0, 0, -10);
    scene.add(treeGroup2);

    const treeGroup3 = treeGroup.clone();
    treeGroup3.position.set(15, 0, -10);
    scene.add(treeGroup3);

    const treeGroup4 = treeGroup.clone();
    treeGroup4.position.set(-55, 0, -15);
    scene.add(treeGroup4);

    const treeGroup5 = treeGroup.clone();
    treeGroup5.position.set(-42, 0, -5);
    treeGroup5.rotation.y = Math.PI / 2;
    scene.add(treeGroup5);
});
treeGroup.position.set(15, 0, 5);
scene.add(treeGroup);


//草
loader.load("./model/grass/scene.gltf", (gltf) => {
    // gltf.scene.scale.set(0.5, 0.1, 0.5);
    gltf.scene.position.set(-78, 0, 0);
    scene.add(gltf.scene);
});
loader.load("./model/grass/scene.gltf", (gltf) => {
    // gltf.scene.scale.set(0.5, 0.1, 0.5);
    gltf.scene.position.set(-81, 0, 0);
    scene.add(gltf.scene);
});
// loader.load("./GLTFBuild/large_buildingC.glb", (gltf) => {
//     // console.log(gltf);
//     // gltf.scene.scale.x = 1;
//     // gltf.scene.castShadow = true;
//     scene.add(gltf.scene);
// });
//
// loader.load("./GLTFBuild/large_buildingB.glb", (gltf) => {
//     // console.log(gltf);
//     // gltf.scene.scale.x = 1;
//     gltf.scene.position.set(5, 0, 5);
//     // gltf.scene.castShadow = true;
//     scene.add(gltf.scene);
// });
// loader.load("./GLTFBuild/锤子.gltf", (gltf) => {
//     gltf.scene.position.y = 20;
//     gltf.scene.scale.set(10, 10, 10);
//     scene.add(gltf.scene);
//     console.log(gltf)
// });
//教学楼模型--------------------
const teachBuildGroup = new THREE.Group();
loader.load("./GLTFBuild/large_buildingA.glb", (gltf) => {
    // console.log(gltf);
    // gltf.scene.scale.x = 1;
    gltf.scene.position.set(20, 0, 5);
    // gltf.scene.castShadow = true;
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    teachBuildGroup.add(gltf.scene);
});
loader.load("./GLTFBuild/large_buildingA.glb", (gltf) => {
    // console.log(gltf);
    // gltf.scene.scale.x = 1;
    gltf.scene.position.set(18.5, 0, 5);
    gltf.scene.rotation.y = -Math.PI / 2;
    gltf.scene.position.z += 0.45;
    // gltf.scene.castShadow = true;
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    teachBuildGroup.add(gltf.scene);
});
loader.load("./GLTFBuild/large_buildingA.glb", (gltf) => {
    // console.log(gltf);
    // gltf.scene.scale.x = 1;
    gltf.scene.position.set(18.5, 0, 7);
    gltf.scene.rotation.y = -Math.PI / 2;
    gltf.scene.position.z += 0.45;
    // gltf.scene.castShadow = true;
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    teachBuildGroup.add(gltf.scene);
});
loader.load("./GLTFBuild/large_buildingA.glb", (gltf) => {
    // console.log(gltf);
    // gltf.scene.scale.x = 1;
    gltf.scene.position.set(18.5, 0, 9);
    gltf.scene.rotation.y = -Math.PI / 2;
    gltf.scene.position.z += 0.45;
    // gltf.scene.castShadow = true;
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    teachBuildGroup.add(gltf.scene);
});
loader.load("./GLTFBuild/large_buildingF.glb", (gltf) => {
    // console.log(gltf);
    // gltf.scene.scale.x = 1;
    gltf.scene.position.set(20, 0, 10);
    gltf.scene.rotation.y = Math.PI;
    // gltf.scene.castShadow = true;
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    teachBuildGroup.add(gltf.scene);
    // console.log(teachBuildGroup.children);
});
// console.log(teachBuildGroup.children);
//a区
loader.load("./GLTFBuild/large_buildingA.glb", (gltf) => {
    // console.log(gltf);
    // gltf.scene.scale.x = 1;
    gltf.scene.position.set(21.5, 0, 5);
    gltf.scene.rotation.y = -Math.PI / 2;
    gltf.scene.position.z += 0.45;
    // gltf.scene.castShadow = true;
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    teachBuildGroup.add(gltf.scene);
});
loader.load("./GLTFBuild/large_buildingA.glb", (gltf) => {
    // console.log(gltf);
    // gltf.scene.scale.x = 1;
    gltf.scene.position.set(21.5, 0, 7);
    gltf.scene.rotation.y = -Math.PI / 2;
    gltf.scene.position.z += 0.45;
    // gltf.scene.castShadow = true;
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    teachBuildGroup.add(gltf.scene);
});

loader.load("./GLTFBuild/large_buildingA.glb", (gltf) => {
    // console.log(gltf);
    // gltf.scene.scale.x = 1;
    gltf.scene.position.set(21.5, 0, 9);
    gltf.scene.rotation.y = -Math.PI / 2;
    gltf.scene.position.z += 0.45;
    // gltf.scene.castShadow = true;
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    teachBuildGroup.add(gltf.scene);

    loader.load("./GLTFBuild/large_buildingF.glb", (gltf) => {
        // console.log(gltf);
        // gltf.scene.scale.x = 1;
        gltf.scene.position.set(14, 0, 10);
        gltf.scene.rotation.y = Math.PI;
        // gltf.scene.castShadow = true;
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;

                child.material.emissive =  child.material.color;
                child.material.emissiveMap = child.material.map ;
            }
        } );
        teachBuildGroup.add(gltf.scene);
        // console.log(teachBuildGroup.children);
    });

    loader.load("./GLTFBuild/large_buildingF.glb", (gltf) => {
        // console.log(gltf);
        // gltf.scene.scale.x = 1;
        gltf.scene.position.set(14, 0, -10);
        // gltf.scene.rotation.y = Math.PI;
        // gltf.scene.castShadow = true;
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;

                child.material.emissive =  child.material.color;
                child.material.emissiveMap = child.material.map ;
            }
        } );
        teachBuildGroup.add(gltf.scene);
        // console.log(teachBuildGroup.children);
    });

    loader.load("./GLTFBuild/large_buildingF.glb", (gltf) => {
        // console.log(gltf);
        // gltf.scene.scale.x = 1;
        gltf.scene.position.set(20, 0, -10);
        // gltf.scene.rotation.y = Math.PI;
        // gltf.scene.castShadow = true;
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;

                child.material.emissive =  child.material.color;
                child.material.emissiveMap = child.material.map ;
            }
        } );
        teachBuildGroup.add(gltf.scene);
        // console.log(teachBuildGroup.children);
    });

    const buildClone = teachBuildGroup.clone();
    // console.log(teachBuildGroup.children);
    buildClone.position.set(-6, 0, 0);
    scene.add(buildClone);

    const buildClone1 = teachBuildGroup.clone();
    buildClone1.position.set(34, 0, 0);
    buildClone1.rotation.y = -Math.PI;
    scene.add(buildClone1);

    const buildClone2 = teachBuildGroup.clone();
    buildClone2.position.set(40, 0, 0);
    buildClone2.rotation.y = -Math.PI;
    scene.add(buildClone2);

    scene.add(teachBuildGroup);
});

//------------教学楼模型--------------------


//-----------------宿舍模型--------------------
loader.load("./GLTFBuild/large_buildingA.glb", (gltf) => {
    // console.log(gltf);
    // gltf.scene.scale.x = 1;
    gltf.scene.position.set(21.5, 0, 9);
    gltf.scene.rotation.y = -Math.PI / 2;
    gltf.scene.position.z += 0.45;
    // gltf.scene.castShadow = true;
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    teachBuildGroup.add(gltf.scene);
    teachBuildGroup.add(gltf.scene);

    loader.load("./GLTFBuild/large_buildingF.glb", (gltf) => {
        // console.log(gltf);
        // gltf.scene.scale.x = 1;
        gltf.scene.position.set(14, 0, 10);
        gltf.scene.rotation.y = Math.PI;
        // gltf.scene.castShadow = true;
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;

                child.material.emissive =  child.material.color;
                child.material.emissiveMap = child.material.map ;
            }
        } );
        teachBuildGroup.add(gltf.scene);
        teachBuildGroup.add(gltf.scene);
        // console.log(teachBuildGroup.children);
    });

    loader.load("./GLTFBuild/large_buildingF.glb", (gltf) => {
        // console.log(gltf);
        // gltf.scene.scale.x = 1;
        gltf.scene.position.set(14, 0, -10);
        // gltf.scene.rotation.y = Math.PI;
        // gltf.scene.castShadow = true;
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;

                child.material.emissive =  child.material.color;
                child.material.emissiveMap = child.material.map ;
            }
        } );
        teachBuildGroup.add(gltf.scene);
        teachBuildGroup.add(gltf.scene);
        // console.log(teachBuildGroup.children);
    });

    loader.load("./GLTFBuild/large_buildingF.glb", (gltf) => {
        // console.log(gltf);
        // gltf.scene.scale.x = 1;
        gltf.scene.position.set(20, 0, -10);
        // gltf.scene.rotation.y = Math.PI;
        // gltf.scene.castShadow = true;
        gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;

                child.material.emissive =  child.material.color;
                child.material.emissiveMap = child.material.map ;
            }
        } );
        teachBuildGroup.add(gltf.scene);
        teachBuildGroup.add(gltf.scene);
        // console.log(teachBuildGroup.children);
    });

    const buildClone = teachBuildGroup.clone();
    // console.log(teachBuildGroup.children);
    buildClone.position.set(-30, 0, -15);
    scene.add(buildClone);

    const buildClone1 = teachBuildGroup.clone();
    buildClone1.position.set(10, 0, 15);
    buildClone1.rotation.y = -Math.PI;
    scene.add(buildClone1);

    const buildClone2 = teachBuildGroup.clone();
    buildClone2.position.set(2, 0, 15);
    buildClone2.rotation.y = -Math.PI;
    scene.add(buildClone2);

    const buildClone3 = teachBuildGroup.clone();
    buildClone3.position.set(-38, 0, -15);
    // buildClone3.rotation.y = -Math.PI;
    scene.add(buildClone3);

    scene.add(teachBuildGroup);
});
//------------宿舍模型--------------------

const basketballGroup = new THREE.Group();

loader.load("./blender/basketball_court.glb", (gltf) => {
    gltf.scene.position.set(-85, 0, 15);
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    basketballGroup.add(gltf.scene);
});
loader.load("./blender/basketball_court.glb", (gltf) => {
    gltf.scene.position.set(-80, 0, 15);
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    basketballGroup.add(gltf.scene);
});
loader.load("./blender/basketball_court.glb", (gltf) => {
    gltf.scene.position.set(-75, 0, 15);
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    basketballGroup.add(gltf.scene);
});
loader.load("./blender/basketball_court.glb", (gltf) => {
    gltf.scene.position.set(-75, 0, 12);
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    basketballGroup.add(gltf.scene);
});
loader.load("./blender/basketball_court.glb", (gltf) => {
    gltf.scene.position.set(-75, 0, 9);
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    basketballGroup.add(gltf.scene);
});
loader.load("./blender/basketball_court.glb", (gltf) => {
    gltf.scene.position.set(-75, 0, 6);
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    basketballGroup.add(gltf.scene);
});
scene.add(basketballGroup);

loader.load("./blender/操场.glb", (gltf) => {
    // console.log(gltf);
    gltf.scene.rotation.y = Math.PI / 2;
    gltf.scene.position.set(-35, -0.3, 0);
    gltf.scene.scale.set(0.05, 0.05, 0.05);
    // gltf.scene.castShadow = true;
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    scene.add(gltf.scene);
});


// loader.load("./blender/图书馆.glb", (gltf) => {
//     console.log(gltf);
//     gltf.scene.position.set(5, 2.8, 0);
//     gltf.scene.rotation.x = -Math.PI;
//     gltf.scene.rotation.y = -Math.PI / 2;
//     gltf.scene.scale.set(0.5, 0.5, 0.5);
//     // gltf.scene.castShadow = true;
//     gltf.scene.traverse( function ( child ) {
//         if ( child.isMesh ) {
//             child.castShadow = true;
//             child.receiveShadow = true;
//
//             child.material.emissive =  child.material.color;
//             child.material.emissiveMap = child.material.map ;
//         }
//     } );
//     scene.add(gltf.scene);
// });

loader.load("./blender/library/图书馆2.glb", (gltf) => {
    // gltf.scene.position.set(5, 0, 0);
    gltf.scene.rotation.y = Math.PI / 2;
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;

            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
        }
    } );
    scene.add(gltf.scene);
},
    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );
        console.log(error);
    });


// let loader1 = new FBXLoader();
// loader1.load( './blender/锤子.fbx', function ( object )
// {//加载路径fbx文件
//     object.traverse( function ( child )
//     {
//         if ( child.isMesh )
//         {
//             child.castShadow = true;
//             child.receiveShadow = true;
//
//             child.material.emissive =  child.material.color;
//             child.material.emissiveMap = child.material.map ;
//         }
//
//     } );
//     object.scale.set(0.01, 0.01, 0.01);
//     object.position.y = 12;
//     // scene.add( object );//模型
// } );



const roadG = new THREE.PlaneBufferGeometry(50, 5);
const roadM = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    // color: "0x929394",
    map: floorTexture,
});
const road = new THREE.Mesh(roadG, roadM);
road.rotation.x = -Math.PI / 2;
road.position.y = 0.01;
road.position.x += 5;
scene.add(road);

const road2G = new THREE.PlaneBufferGeometry(30, 3);
const road2 = new THREE.Mesh(road2G, roadM);
road2.rotation.x = -Math.PI / 2;
road2.rotation.z = -Math.PI / 2;
road2.position.y = 0.01;
road2.position.x += 5;
scene.add(road2);
//-----------------------------end--------------------------------------
//初始化渲染器
const renderer = new THREE.WebGLRenderer({
    // 设置抗锯齿
    antialias: true,
    // 设置对数深度缓冲区, 避免模型面数过多造成闪烁
    logarithmicDepthBuffer: true,
});
renderer.toneMappingExposure = 0.5;
renderer.physicallyCorrectLights = true;
renderer.setClearColor(0x95e4e8);
renderer.outputEncoding = THREE.sRGBEncoding;
//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
//开启阴影渲染
// renderer.shadowMap.enabled = true;
// console.log(renderer);

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

//使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);

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


