let numObjects = 50;
let numThreads=4;// gonna try multithreading eventually lol
const objectsArray = [];
let stopId;

let toggleButton = document.getElementById('toggleButton')
let xNext, yNext, zNext, newVal;

let t=0
let dt=0.05, dtSq=dt**2, df=1/dt;
// Paul Trap Force Framework

// let wRF=10/3;

class Param{
    constructor(name, initValue, minValue, maxValue){
        this.name=name; this.value=initValue;
        this.min = minValue; this.max=maxValue;
        this.inputElem = document.getElementById(name)
        this.inputElem.value = this.value;
        this.inputElem.addEventListener('keyup', () => {this.onLineEdit(event)});
        console.log(this);
        console.log(this.inputElem);
        this.onUpdatedValue();
    }
    onLineEdit(event){
        if (event.key==='Enter'){
        newVal=parseFloat(this.inputElem.value);
            if (newVal>=this.min && newVal<=this.max){
                this.value = newVal;
                this.onUpdatedValue();
            }
            this.inputElem.value=this.value;
            console.log(this.name,'=',this.value)
        }
    }
    onUpdatedValue(){}
}

const G = new Param('G', -0.1, -1, 1);
const Bz = new Param('Bz', 0, -10, 10);
const beta = new Param('beta', .1, 0, 10);
const VDC = new Param('VDC', .02, 0, 10);
const VRF = new Param('VRF', 1, 0, 10);
const wRF = new Param('wRF', 10/3, 0, 10);
const dtParm = new Param('dt', 0.05, 0, 1);

dtParm.onUpdatedValue=function(){dt=dtParm.value; dtSq=dt**2; df=1/dt;}//overwriting update function

class Ball{
    constructor(x0,y0,z0,vx0,vy0,vz0,r,m){
      this.xPast=x0; this.yPast=y0; this.zPast=z0;
      this.vx=vx0; this.vy=vy0; this.vz=vz0;
      this.ax=0; this.ay=0; this.az=0;
      this.x=x0+vx0*dt; this.y=y0+vy0*dt; this.z=z0+vz0*dt;
      this.radius=r; this.mass=m;
      // Create a simple sphere, and add to scene
      const geometry = new THREE.SphereGeometry(this.radius);
      const material = new THREE.MeshBasicMaterial({ color: generateRandomHexColor() });
      this.body = new THREE.Mesh(geometry, material);
      scene.add(this.body);
      this.drawPosition();
    }
    updatePosition(method){
        switch (method){
          case "euler":
            this.xPast=this.x; this.yPast=this.y; this.zPast=this.z; //hang on to this in case I switch mid-sim?
            this.vx+=this.ax*dt; this.vy+=this.ay*dt; this.vz+=this.az*dt;
            this.x+=this.vx*dt; this.y+=this.vy*dt; this.z+=this.vz*dt;
            break;
          case "verlet":
            xNext=2*this.x-this.xPast+this.ax*dtSq;
            yNext=2*this.y-this.yPast+this.ay*dtSq;
            zNext=2*this.z-this.zPast+this.az*dtSq;   
            this.xPast=this.x; this.yPast=this.y; this.zPast=this.z;
            this.x = xNext; this.y = yNext; this.z = zNext;
            //still might need velocities for things like lorentz force, damping, or drag
            this.vx=(this.x-this.xPast)*df; this.vy=(this.y-this.yPast)*df; this.vz=(this.z-this.zPast)*df
            break;
        }
        this.ax=0; this.ay=0; this.az=0; //refresh then add up forces from scratch on next frame
    }

    drawPosition(){
      this.body.position.x=this.x;
      this.body.position.y=this.y;
      this.body.position.z=this.z;
    };
}

function addBall(){
    x0=20*(Math.random()-0.5);y0=10*(Math.random()-0.5);z0=2*(Math.random()-0.5);
    vx0=5*(Math.random()-0.5);
    vy0=5*(Math.random()-0.5);
    vz0=1*(Math.random()-0.5);
    objectsArray.push(new Ball(x0,y0,z0,vx0,vy0,vz0,0.2,1));
    if(!toggleStatus){renderer.render(scene, camera);}
}

for (i=0; i<numObjects; i++){addBall()}

function vectorNormSquare(ray){
  // let sum=0;
  // for (i=0;i<ray.length;i++){sum+=Math.pow(ray[i],2)}
  return(ray[0]*ray[0]+ray[1]*ray[1]+ray[2]*ray[2])
}

function calculateSingleParticleForces(obj){
    /*this applies forces which only depend on single particle coords e.g. paul trap + B-field*/
    obj.ax+=VDC.value*obj.x-rfAmp*VRF.value*obj.x+Bz.value*obj.vy-beta.value*obj.vx
    obj.ay+=VDC.value*obj.y+rfAmp*VRF.value*obj.y-Bz.value*obj.vx-beta.value*obj.vy
    obj.az+=-2*VDC.value*obj.z-beta.value*obj.vz
}

function applyForces(){
  let x1,x2,y1,y2,z1,z2,r12;
  for (i=0; i<objectsArray.length; i++){
    //const worker = new Worker('./worker.js')
    //worker.postMessage(i);
    obj1=objectsArray[i];
    calculateSingleParticleForces(obj1);
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
        
      c0=G.value/(rsq*Math.sqrt(rsq));//c0=G/rsq;
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
let rfAmp
function animate() {
  rfAmp=Math.cos(wRF.value*t);
  t1=performance.now();
  applyForces();
  for (i=0; i<objectsArray.length; i++){
    currentBall=objectsArray[i];
    currentBall.updatePosition("euler");
    currentBall.drawPosition();
      };
  t+=dt;
  t2=performance.now();
  // console.log(t2-t1);
  renderer.render(scene, camera);
  stopId=requestAnimationFrame(animate);
}

animate();