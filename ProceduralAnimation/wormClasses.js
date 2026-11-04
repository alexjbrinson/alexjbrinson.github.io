// const canvas = document.getElementById("myCanvas");
// const container = document.getElementById('container');
// const ctx = canvas.getContext('2d');
const invSqrt2=1/Math.sqrt(2);

function drawCircle(x,y,r,color) {
    ctx.beginPath(); // Start a new path
    ctx.arc(x, y, r, 0, 2 * Math.PI); // x, y, radius, startAngle, endAngle
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath(); // Close the path
}

class Head{
    constructor(x0,y0,r,color,theta0=-Math.PI/2){
    this.r=r; this.x=x0; this.y=y0;this.color=color
    this.theta=theta0;
    
    }
    attachToParent(){}
    draw(){
        drawCircle(this.x, this.y, this.r, this.color);
        drawCircle(this.x+this.r*Math.cos(this.theta+Math.PI/5),
                   this.y+this.r*Math.sin(this.theta+Math.PI/5),this.r/4,'black');
        drawCircle(this.x+this.r*Math.cos(this.theta-Math.PI/5),
                   this.y+this.r*Math.sin(this.theta-Math.PI/5),this.r/4,'black');
    }
    move(dx,dy){
        if(dx!=0||dy!=0){this.theta=Math.atan2(dy,dx); this.x+=dx; this.y+=dy;}
    }
}
let thetaDiff;// this will store angle difference between adjacent segments
class BodySegment{
    constructor(parent,x0,y0,r,color,theta0=-Math.PI/2){
        this.r=r; this.x=x0; this.y=y0; this.color=color
        this.vx=0; this.vy=0; this.dt=.5
        this.parent=parent;
        this.attachToParent();
        this.theta=theta0;
        
    }
    attachToParent(){
        const x0=this.x, y0=this.y
        this.x+=this.vx*this.dt
        this.y+=this.vy*this.dt;
        let dx=this.parent.x-this.x; let dy=this.parent.y-this.y;
        let rSq=dx**2+dy**2; let rMag=Math.sqrt(rSq);
        this.x=this.parent.x-this.parent.r*dx/rMag
        this.y=this.parent.y-this.parent.r*dy/rMag
        this.vx=this.x-x0; this.vy=this.y-y0
        this.theta=Math.atan2(dy, dx);
        thetaDiff=Math.abs(this.parent.theta-this.theta)%(2*Math.PI)
        if(thetaDiff>Math.PI/2&&thetaDiff<3*Math.PI/2){
            console.log("wahh",this.parent.theta, this.theta);
            //TODO, adjust position to satisfy angle constraint
        }
        this.rightLegAnchor=[this.x+this.r*Math.cos(this.theta+Math.PI/2),this.y+this.r*Math.sin(this.theta+Math.PI/2)]
        this.leftLegAnchor=[this.x+this.r*Math.cos(this.theta-Math.PI/2),this.y+this.r*Math.sin(this.theta-Math.PI/2)]
    }
    draw(){
        drawCircle(this.x, this.y, this.r, this.color)
        drawCircle(this.rightLegAnchor[0], this.rightLegAnchor[1], this.r/2, "black")
        drawCircle(this.leftLegAnchor[0], this.leftLegAnchor[1], this.r/2, "black")
    }  
}    

class Leg{//TODO
    constructor(x1,y1, segLength, numSegments, color){
        this.segLength=segLength; this.numSegments=this.numSegments;
        this.attachmentPoint=new Head(x1,y1,segLength, color)
        this.nodes=[this.attachmentPoint]
        for(let i=1;i<numSegments;i++){
            this.nodes[i] = new BodySegment(this.nodes[i-1], this.nodes[i-1].x-this.segLength,
                                            this.nodes[i-1].y, this.segLength, color);
        }
        console.log(this.nodes)
    }
}
leg = new Leg(0,0,1,3,"brown");
let dTheta;


class Worm{
    constructor(numSegments, x0,y0,r0, color, speed, moveSet=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]){
        this.r=r0; this.color=color;
        this.n=numSegments; this.lastDx=0; this.lastDy=-speed;
        this.speed = Math.sqrt(this.lastDx**2+this.lastDy**2);
        this.head = new Head(x0,y0, 1.25*r0,this.color)
        this.body=[this.head]
        this.lost=false;
        for (let i=1; i<numSegments;i++){
            this.body[i]=new BodySegment(this.body[i-1],this.body[i-1].x,
                                         this.body[i-1].y+r0,r0,this.color);}
        this.constrain()
        // this.draw()
        this.upKey=moveSet[0]; this.downKey=moveSet[1]; this.leftKey=moveSet[2]; this.rightKey=moveSet[3]
    }
    constrain(){for (const seg of this.body){seg.attachToParent();} }
    draw(){for (const seg of this.body){seg.draw();} }
    move(dx,dy){
        if(dx!=0||dy!=0){//this condition keeps worm moving if no input is provided.
            dTheta = Math.abs((Math.atan2(dy,dx)-this.head.theta)%(2*Math.PI));
            if(dTheta!=Math.PI){//this condition disallows pure backtracking
                this.head.move(dx,dy); this.lastDx=dx; this.lastDy=dy;
            }
            else{this.head.move(this.lastDx, this.lastDy);}
        }
        else{this.head.move(this.lastDx, this.lastDy);}
        // this.speed = Math.sqrt(this.lastDx**2+this.lastDy**2);
        this.constrain();
        this.draw();
        this.checkIntersection();
    }
    grow(){
        // console.log(this.n)
        let x0=2*this.body[this.n-1].x-this.body[this.n-2].x
        let y0=2*this.body[this.n-1].y-this.body[this.n-2].y
        this.body.push(new BodySegment(this.body[this.n-1],x0,y0,this.r,this.color));this.n+=1; 
    }
    shed(){if (this.n>5){this.body.pop();this.n-=1;}}
    checkIntersection(){
        if (this.n<5){this.collided=false}
        else{
            let x0=this.head.x, y0=this.head.y, spacingSq=(1.5*this.head.r)**2;
            for (let i=4; i<this.n; i++){
                let seg=this.body[i]
                let dx=x0-seg.x, dy=y0-seg.y, drSq=dx**2+dy**2
                if(drSq<spacingSq){console.log('bad worm ', i);this.lost=true;}
            }
        }
    }
    checkBoundaries(){
        if (this.head.x<0||this.head.x>canvas.width){this.lost=true}
        if (this.head.y<0||this.head.y>canvas.height){this.lost=true}
        
        // if (this.head.x<0){this.head.x=canvas.width}//TODO: periodic boundaries?
    }
    checkWormCollision(other){
        if (this===other){}
        else{
            let x0=this.head.x, y0=this.head.y; //spacingSq=(1.5*this.head.r)**2;
            for (let i=0; i<other.n; i++)
            {
                let seg=other.body[i]
                let spacingSq=this.head.r**2+seg.r**2 
                let dx=x0-seg.x, dy=y0-seg.y, drSq=dx**2+dy**2
                if(drSq<spacingSq){console.log('hello ', i);this.lost=true;}
            }
        }
    }
    checkCollision(obj){
        let dx=this.head.x-obj.x, dy=this.head.y-obj.y,drSq=dx**2+dy**2
        if (drSq<(this.head.r+obj.r)**2){return(true)}
        else{return(false)}
    }
    getMove(keys){
        console.log("test", )
        let dx=0, dy=0, drSq=0, drMag=0;
        dx=0; dy=0
        if (keys.g==true) {this.grow()}
        if (keys.e==true) {this.shed()}
        if (keys[this.upKey]) {dy-=this.speed;}
        if (keys[this.downKey]) {dy+=this.speed}
        if (keys[this.leftKey]) {dx-=this.speed;}
        if (keys[this.rightKey]) {dx+=this.speed;}
        if (dx!=0 && dy!=0){dx*=invSqrt2; dy*=invSqrt2}
        this.move(dx, dy);
    }
}

class Apple{
    constructor(){
        this.r=20;
        this.x=this.r+.8*(canvas.width-this.r)*Math.random();
        this.y=this.r+.8*(canvas.height-this.r)*Math.random();
        
        this.speed=5;
        this.vx=this.speed*Math.random(); this.vy=this.speed*Math.random(); this.dt=1
        this.draw();
    }
    draw(){drawCircle(this.x, this.y, this.r, "red");}
    move(){
        if(this.x+this.r+this.vx*this.dt>canvas.width || 
           this.x-this.r+this.vx*this.dt<0){this.vx*=0-1};
        if(this.y+this.r+this.vy*this.dt>canvas.height ||
           this.y-this.r+this.vy*this.dt<0){this.vy*=-1};
        this.x+=this.vx*this.dt; this.y+=this.vy*this.dt;
        this.draw();
    }
}