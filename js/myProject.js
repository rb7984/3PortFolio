import * as THREE from './three.module.js';
import {OrbitControls} from './OrbitControls.js';
import {FBXLoader} from './FBXLoader.js';
import {InteractionManager} from './three.interactive.js';
import {gsap} from 'gsap';

const container = document.querySelector('#scene-container');
export const scene = new THREE.Scene();

var clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.set(-50,50,-50);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setClearColor("#ededed");

// renderer.setSize( container.clientWidth, container.clientHeight );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
container.append(renderer.domElement);
//document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
);

var g2 = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
var m2 = new THREE.MeshStandardMaterial({ color: '#a18787', side: THREE.DoubleSide });
var plane = new THREE.Mesh(g2, m2);
plane.rotateX( - Math.PI / 2);
plane.translateY(1);
plane.receiveShadow = true;

scene.add(plane);

//Lights

const light = new THREE.AmbientLight( 0xdedede, 1.5);
light.castShadow = true;
scene.add(light);

const lightPoint = new THREE.PointLight( 0xc9e4ff, 1 );
lightPoint.position.set(0, 100,0);
lightPoint.lookAt(0, 0, 0);
lightPoint.castShadow = true;
scene.add(lightPoint);

const lightHelper = new THREE.PointLightHelper(lightPoint,2,'#a18787')
scene.add(lightHelper)

//Controls

const controls = new OrbitControls(camera, renderer.domElement);
const cPX = [50,-50,-50,50];
const cPY = [50,50,50,50];
const cPZ = [50,50,-50,-50];
var cPC = 0;

function ChangeView(a) {

    camera.position.set(cPX[cPC%4],cPY[cPC%4],cPZ[cPC%4]);
    camera.lookAt(0,0,0);

    if (a) cPC += 1;
    else cPC -= 1;
}

document.getElementById('previous').onclick = function () {
    ChangeView(false);
}

document.getElementById('next').onclick = function () {
    ChangeView(true);
}

// window.addEventListener('mousedown',(event) => {
//     camera.position.set(cPX[cPC%5],cPY[cPC%5],cPZ[cPC%5]);
//     cPC += 1;
// });

const fbxLoader = new FBXLoader();
fbxLoader.load('../assets/model.fbx', (object) => {
    object.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true; 
            node.receiveShadow = true;
            
            const oldMat = node.material;
            
            node.material = new THREE.MeshStandardMaterial( {  
                color: oldMat.color,
                map: oldMat.map,
            } );
            
        } } );
    
    scene.add(object)
}
);

//Orbit Controls

function animate() {
	requestAnimationFrame( animate );
    
    interactionManager.update();
    // controls.update();
	renderer.render( scene, camera );
};

animate();