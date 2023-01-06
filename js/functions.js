import * as THREE from './three.module.js';

import {scene} from '.myProject.js';

document.getElementById('btn').onclick = function () {
    adding()

};

function adding()
{    
    var g = new THREE.BoxGeometry(10,10,10);
    var m = new THREE.MeshStandardMaterial({ color: '#a18787', side: THREE.DoubleSide });
    var b = new THREE.Mesh(g, m);
    
    scene.add(b)
}