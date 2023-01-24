import * as THREE from './three.module.js';
import {FBXLoader} from './FBXLoader.js';
import {gsap} from './gsap/index.js';
// import {OrbitControls} from './OrbitControls.js';
// import {InteractionManager} from './three.interactive.js';

//SETUP

const container = document.querySelector('#scene-container');
export const scene = new THREE.Scene();

var clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(-50,50,-50);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setClearColor("#ededed");

// renderer.setSize( container.clientWidth, container.clientHeight );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
container.append(renderer.domElement);
// document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//INTERACTIONS

// const interactionManager = new InteractionManager(
//     renderer,
//     camera,
//     renderer.domElement
// );

var g2 = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
var m2 = new THREE.MeshStandardMaterial({ color: '#2c61d4', side: THREE.DoubleSide });
var plane = new THREE.Mesh(g2, m2);
plane.rotateX( - Math.PI / 2);
plane.translateY(1);
plane.receiveShadow = true;
scene.add(plane);

//LIGHTS

var light = new THREE.AmbientLight( 0xdedede, 1.5);
light.castShadow = true;
scene.add(light);

var lightPointState = true;
const lightIcons = {true: 'sun',false: 'moon'};

var lightPoint = new THREE.PointLight( 0xc9e4ff, 1 );
lightPoint.position.set(0, 60, 0);
lightPoint.castShadow = true;
lightPoint.shadow.camera.near = 1;
lightPoint.shadow.camera.far = 500;
lightPoint.shadow.bias = - 0.002;
lightPoint.shadow.mapSize.set( 2048, 2048 );

scene.add(lightPoint);

function Night(a)
{
    var dur = 1;
        
    if (a)
    {
        gsap.to(lightPoint, {
            intensity: 0.1,
            duration: dur
        });
        gsap.to(light, {
            intensity: 0.8,
            duration: dur
        });
        gsap.to(document.getElementById('moon'), {
            className: lightIcons[lightPointState],
            duration: dur
        })
    }
    else
    {
        gsap.to(lightPoint, {
            intensity: 1,
            duration: dur
        });
        gsap.to(light, {
            intensity: 1.5,
            duration: dur
        });
        gsap.to(document.getElementById('moon'), {
            className: lightIcons[lightPointState],
            duration: dur
        })
    }
    
    lightPointState = !a;
}

document.getElementById('night').onclick = function() {
    Night(lightPointState);
    // document.getElementById('moon').className= lightIcons[!lightPointState];
}


//CONTROLS

// const controls = new OrbitControls(camera, renderer.domElement);

const cP = [[50,50,50],[-60,7,-20],[-42,10,3],[-5,35,5]]
const cT = [[0,0,0],[20,6,-35],[-30,7,-2],[40,35,40]]
var cPC = 0;

// CHANGE VIEW

function ChangeView(a) {
    var oldEl = 'p' + (cPC%cP.length).toString();
    if (a) {cPC += 1;}
    else {cPC -= 1;}    
    var currentEl = 'p' + (cPC%cP.length).toString();
    
    gsap.to(camera.position, {
        x: cP[cPC%cP.length][0], 
        y: cP[cPC%cP.length][1],
        z: cP[cPC%cP.length][2],
        duration: 1,
        onUpdate: function () {
            camera.lookAt(cT[cPC%cP.length][0],cT[cPC%cP.length][1],cT[cPC%cP.length][2]);
        }
    });
    
    document.getElementById(oldEl).className = 'p hidden';
    document.getElementById(currentEl).className = 'p visible';
}

document.getElementById('previous').onclick = function () {
    ChangeView(false);
}

document.getElementById('next').onclick = function () {
    ChangeView(true);
}

// OPEN AND CLOSE BUTTONS

const pages = document.getElementsByClassName('projectButton');

for(let i = 0; i < pages.length; i++)
{
    pages[i].onclick = function () {
        let pageId = 'page' + (i+1).toString();     
        document.getElementById(pageId).className = 'projectPage visible';
    }
}

const closeButtons = document.getElementsByClassName('closeButton');

for(let i = 0; i < closeButtons.length; i++)
{
    closeButtons[i].onclick = function () {
        let pageId = 'page' + (i+1).toString();     
        document.getElementById(pageId).className = 'projectPage hidden';
    }
}
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

fbxLoader.load('../assets/p0.fbx', (object) => {
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

fbxLoader.load('../assets/p1.fbx', (object) => {
    object.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true; 
            node.receiveShadow = true;
            
            const oldMat = node.material;
            
            node.material = new THREE.MeshStandardMaterial( {  
                color: oldMat.color,
                map: oldMat.map
            } );
            
        } } );
    
    scene.add(object)
}
);

fbxLoader.load('../assets/p2.fbx', (object) => {
    object.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true; 
            node.receiveShadow = true;
            
            const oldMat = node.material;
            
            node.material = new THREE.MeshStandardMaterial( {  
                color: oldMat.color,
                map: oldMat.map
            } );
            
        } } );
    
    scene.add(object)
}
);

fbxLoader.load('../assets/prop.fbx', (object) => {
    object.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true; 
            node.receiveShadow = true;
            
            const oldMat = node.material;
            
            node.material = new THREE.MeshStandardMaterial( {  
                color: oldMat.color,
                map: oldMat.map
            } );
            
        } } );
    
    gsap.to(object.position, {x: 5, y: 18, z: 23.5, duration: 6, stagger:{ each: 0.15, yoyo: true, repeat: -1 }, ease: "sine.inOut"});
    
    scene.add(object)
}
);

//Orbit Controls

function UpdateCamera() {    
    const time = clock.getElapsedTime()+20;
    const k = 0.15;
    const f = 100;
    
    camera.position.x = f*Math.sin( time*k );
    camera.position.y = 50;
    camera.position.z = f*Math.cos( time*k );
    
    camera.lookAt(0, 0, 0);
}

function animate() {
	requestAnimationFrame( animate );
    
    //INTERACTIONS
    // interactionManager.update();
    //CONTROLS
    // controls.update();
    
    if (cPC%cP.length == 0) {UpdateCamera();}
    
    renderer.render( scene, camera );
};

animate();