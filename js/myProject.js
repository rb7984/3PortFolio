import * as THREE from './three.module.js';
import {OrbitControls} from './OrbitControls.js';
import {FBXLoader} from './FBXLoader.js';
import {InteractionManager} from './three.interactive.js';

const container = document.querySelector('#scene-container');
export const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.set(5,5,5);
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

//Axes Helpers

// var axes = new THREE.AxesHelper(5);
// const grid = new THREE.GridHelper(20,10,'#ffffff','#ffffff');
// scene.add(axes);
// scene.add(grid);

// INteraction Manager

const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
);

var g2 = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
var m2 = new THREE.MeshStandardMaterial({ color: '#a18787', side: THREE.DoubleSide });
var plane = new THREE.Mesh(g2, m2);
plane.rotateX( - Math.PI / 2);
plane.receiveShadow = true;

scene.add(plane);

//Lights

const light = new THREE.AmbientLight( 0xdedede, 1.5);
light.castShadow = true;
scene.add(light);

const lightPoint = new THREE.PointLight( 0xdedede, 2, 30 );
lightPoint.position.set(0,15,0);
lightPoint.lookAt(0,0,0);
lightPoint.castShadow = true;
scene.add(lightPoint);

// const lightDir = new THREE.DirectionalLight(0x404040, 2);
// lightDir.position.set(20,20,20);
// lightDir.lookAt(0,0,0);
// lightDir.castShadow = true;
// scene.add(lightDir);

// Lights Helper

// const dlsh = new THREE.CameraHelper(lightDir.shadow.camera);
// scene.add(dlsh);

//Controls

const controls = new OrbitControls(camera, renderer.domElement);

const fbxLoader = new FBXLoader();
fbxLoader.load('../assets/stand.fbx', (object) => {
    object.traverse( function( node ) { 
        if ( node instanceof THREE.Mesh ) { 
            node.castShadow = true; 
            node.receiveShadow = true;
            node.material.side = THREE.DoubleSide;
        } } );
    object.translateY(0.01);
    scene.add(object)
}
);

// Add - Buttons
var buttonsArray = [3];
var countarray = [[0,0]];
let price = 1000;

for (let i = 0; i < buttonsArray.length; i++) {
    for (let j = 0; j < buttonsArray[i]; j++) {
        let id = 'btn-' + i.toString() + '-' + j.toString();
        document.getElementById(id).onclick = function () {
            addRB(i,j);
        };        
    }
}

function addRB(i,j) {
    var path = '../assets/' + + i.toString() + '-' + j.toString() + '.fbx';
    
    fbxLoader.load(path, (object) => {
        object.traverse( function( node ) { 
            if ( node instanceof THREE.Mesh ) { 
                node.castShadow = true; 
                node.receiveShadow = true;
                
                node.material.side = THREE.DoubleSide;
            } } );
        
        object.translateX(5);
        
        // Interaction
        // object.addEventListener('click', (event) => {
        //     event.target.scale.set(2.0, 2.0, 2.0);
        // });
        object.addEventListener('mouseover', (event) => {
            setTimeout(makeDiv, 250);
            
            function makeDiv(){
            var div = document.createElement("div");
            div.innerHTML = "Contextual-Menu";
            div.setAttribute('class', 'contextual-menu');
            div.setAttribute('id', 'contextual-menu');
            
            document.body.appendChild(div);
            }
        });
        object.addEventListener('mouseout', (event) => {
            setTimeout(makeDiv, 1000);
            
            function makeDiv(){
            var element = document.getElementById("contextual-menu");
            element.parentNode.removeChild(element);
            }
        })

        interactionManager.add(object);
        
        scene.add(object)
    }
    );
    countarray[i][j] ++;
    
    document.getElementById('counter').innerHTML = CalculatePrice(i, j).toString() + ' €';
}

function CalculatePrice(i, j) {

    price += 100;
    return price;
}

function animate() {
	requestAnimationFrame( animate );
    
    interactionManager.update();
    controls.update();
	renderer.render( scene, camera );
};

animate();