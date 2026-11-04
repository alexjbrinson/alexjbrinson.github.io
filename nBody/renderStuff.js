// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
let cameraRadius=10, maxCamRad=100, minCamRad=1;
camera.position.z = cameraRadius;
const origin = new THREE.Vector3(0,0,0);
let toggleStatus = true; //true means simulation is running

function resizeCanvas() {
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (toggleStatus==false){renderer.render(scene, camera);}
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function generateRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

let isMouseDown, onMouseDownPosition;
document.addEventListener('mousedown', function(event) {onMouseDown(event)});
document.addEventListener('mouseup', function(event) {onMouseUp(event)});
document.addEventListener('mousemove', function(event){onDocumentMouseMove(event)});
document.addEventListener("wheel", function(event){changeZoom(event)});

function changeZoom(event){
    console.log(event)
    radChange=event.deltaY/72;
    //cameraRadius+=radChange;
    cameraRadius=Math.max(minCamRad, Math.min(maxCamRad,cameraRadius+radChange));
    updateCamera();
}


function onMouseUp(event){
    isMouseDown=false;
    onMouseUpPosition=event
    lastTheta=theta; lastPhi=phi
    console.log(lastTheta, lastPhi)
}


function onMouseDown(event){
    isMouseDown = true;
    console.log(event);
    onMouseDownPosition = event;
}

let theta=0, phi=0, lastTheta=0,lastPhi=0;
function updateCamera(){
    camera.position.x = cameraRadius * Math.sin( theta * Math.PI /180 )
                            * Math.cos( phi * Math.PI / 180 );
    camera.position.y = cameraRadius * Math.sin( phi * Math.PI / 180 );
    camera.position.z = cameraRadius * Math.cos( theta * Math.PI / 180 )
                            * Math.cos( phi * Math.PI / 180 );
    // console.log(camera.position.x,camera.position.y,camera.position.z)
    // camera.rotation.y= theta*Math.PI/180
    // camera.rotation.x= -Math.cos(theta/180)*phi*Math.PI/180
    camera.lookAt(origin);//rotations are hard, okay?
    if (lastPhi<90&&phi>90){camera.rotation.y-=180;}
    camera.updateMatrix();
    if (toggleStatus==false){renderer.render(scene, camera);}
}

function onDocumentMouseMove( event ) {
    event.preventDefault();//what do?
    if (isMouseDown){
        theta = -( ( event.clientX - onMouseDownPosition.x ) * 0.05 ) + lastTheta;
        phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.05 ) + lastPhi
        phi = phi%90;//??? TODO: use brain
        updateCamera();
    }
    // mouse3D = projector.unprojectVector(
    //     new THREE.Vector3(
    //         ( event.clientX / renderer.domElement.width ) * 2 - 1,
    //         - ( event.clientY / renderer.domElement.height ) * 2 + 1,
    //         0.5
    //     ),
    //     camera
    // );
    // ray.direction = mouse3D.subSelf( camera.position ).normalize();

    // interact();
    // renderer.render();
}