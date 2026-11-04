let numObjects = 1000;
let numThreads=4;// gonna try multithreading lol
const objectsArray = [];
const dt=0.01;
let G=0.5;//,t = 0
let stopId;
let toggleStatus = true; //true means simulation is running
let toggleButton = document.getElementById('toggleButton')

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 10;

function generateRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

class Ball{
    constructor(x0,y0,z0,vx0,vy0,vz0,r,m){
      this.x=x0; this.y=y0; this.z=z0;
      this.vx=vx0; this.vy=vy0; this.vz=vz0;
        this.ax=0; this.ay=0; this.az=0;
      this.radius=r; this.mass=m;
      // Create a simple sphere, and add to scene
      const geometry = new THREE.SphereGeometry(this.radius);
      const material = new THREE.MeshBasicMaterial({ color: generateRandomHexColor() });
      this.body = new THREE.Mesh(geometry, material);
      scene.add(this.body);
      this.drawPosition();
    }
    updatePosition(){
        this.vx+=this.ax*dt; this.vy+=this.ay*dt; this.vz+=this.az*dt;
        this.x+=this.vx*dt; this.y+=this.vy*dt; this.z+=this.vz*dt;
        this.ax=0; this.ay=0; this.az=0;
    }
    drawPosition(){
      this.body.position.x=this.x;
      this.body.position.y=this.y;
      this.body.position.z=this.z;
    };
}

function addBall(){
    x0=20*(Math.random()-0.5);y0=10*(Math.random()-0.5);z0=2*(Math.random()-0.5);
    vx0=0//.1*(Math.random()-0.5);
    vy0=0//.1*(Math.random()-0.5);
    vz0=0//.1*(Math.random()-0.5);
    objectsArray.push(new Ball(x0,y0,z0,vx0,vy0,vz0,0.2,1));
    if(!toggleStatus){renderer.render(scene, camera);}
}


for (i=0; i<numObjects; i++){addBall()}

function vectorNormSquare(ray){
  // let sum=0;
  // for (i=0;i<ray.length;i++){sum+=Math.pow(ray[i],2)}
  return(ray[0]*ray[0]+ray[1]*ray[1]+ray[2]*ray[2])
}

function applyForces(i){

}

function applyForces(){
  let x1,x2,y1,y2,z1,z2,r12;
  for (i=0; i<objectsArray.length-1; i++){
    //const worker = new Worker('./worker.js')
    //worker.postMessage(i);
    obj1=objectsArray[i];
    x1 = obj1.x;
    y1 = obj1.y;
    z1 = obj1.z;
    for (j=i+1; j<objectsArray.length; j++){
      obj2=objectsArray[j];
      x2 = obj2.x;
      y2 = obj2.y;
      z2 = obj2.z;
      r12 = [x1-x2, y1-y2, z1-z2];
      rsq=vectorNormSquare(r12);
        
      c0=G/(rsq*Math.sqrt(rsq));//c0=G/rsq;
      c1=-obj2.mass*c0; c2=obj1.mass*c0
      obj1.ax+=c1*r12[0]; obj1.ay+=c1*r12[1]; obj1.az+=c1*r12[2];
      obj2.ax+=c2*r12[0]; obj2.ay+=c2*r12[1]; obj2.az+=c2*r12[2];
     // //TODO: add bounce, investigate timing performances
        }
    }
}

function toggleAnimation(){
    if (toggleStatus){
        toggleStatus=false;
        toggleButton.textContent="start";
        window.cancelAnimationFrame(stopId);
    }
    else{
        toggleStatus=true;
        toggleButton.textContent="stop";
        animate();
    }
}

function animate() {
  t1=performance.now();
  applyForces();
  for (i=0; i<objectsArray.length; i++){
    currentBall=objectsArray[i];
    currentBall.updatePosition();
    currentBall.drawPosition();
      };
  t2=performance.now();
  console.log(t2-t1);
  renderer.render(scene, camera);
  stopId=requestAnimationFrame(animate);
}

animate();