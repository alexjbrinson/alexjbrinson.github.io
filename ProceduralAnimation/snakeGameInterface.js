const keys={};
document.addEventListener('keydown', function(event) {keys[event.key] = true;});
document.addEventListener('keyup', function(event) {keys[event.key] = false;});

const canvas = document.getElementById("myCanvas");
const container = document.getElementById('container');
const ctx = canvas.getContext('2d');

function findCookie(cookieName){
  let cookieArray = decodeURIComponent(document.cookie).split(";");
  console.log(cookieArray);
  for (cookie of cookieArray)
  {
    kvp=cookie.split("="); key = kvp[0]; val=kvp[1];
    if (key==cookieName){return(val)}
  }
  return(false)
}

function drawTextCanvas(messageStringList, fontSize=48, color='black'){
  //Takes list of strings (one per line); draws text vertically and horizontally centered on canvas
    ctx.font = String(fontSize)+"px serif";
    ctx.strokeStyle=color;
    numLines=messageStringList.length
    for (const [i, messageString] of messageStringList.entries())
    {
      let textX=(canvas.width-ctx.measureText(messageString).width)/2;
      let textY=(canvas.height+fontSize)/2-(numLines/2-i)*fontSize;
      ctx.strokeText(messageString, textX, textY)
    }    
}

function updateScore(wormList, scoreList, highScore){
    let fontSize= 30;
    ctx.font = fontSize+"px calibri";
    let lastMessageStart = 10;
    for (let i = 0; i<numPlayers; i++){
        let worm = wormList[i];
        ctx.strokeStyle=worm.color;
        messageString=worm.color+": "+scoreList[i]+"   ";
        ctx.strokeText(messageString, lastMessageStart, fontSize)
        lastMessageStart += ctx.measureText(messageString).width;
    }
    ctx.strokeStyle="black";
    messageString="High Score: "+highScore+"  "; messageWidth=ctx.measureText(messageString).width;
    ctx.strokeText(messageString, canvas.width-messageWidth, canvas.height-fontSize)
}

function resizeCanvas() {
  canvas.width = window.innerWidth*0.97;
  canvas.height = window.innerHeight*0.93;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let highScoreSearch = findCookie("highScore"), highScore=Number(highScoreSearch)// absence of cookie means false (0), otherwise a positive int
let speed=6, initLength=20;
let numPlayers, anyMovement;
let apple, wormList, scoreList;
let p2Keys = ['w','s','a','d'];

function setUpGame(){
    anyMovement = false;
    apple=new Apple()
    wormList=[]; scoreList=[];
    wormList.push(new Worm(initLength, 100,500,10, "green", speed));
    // wormList.push(new Worm(40, 200,500,10, "blue", 6, moveSet=p2Keys));
    numPlayers=wormList.length
    for(let i=0; i<numPlayers; i++){scoreList.push(0)};
}
let p2Trigger=false;
function setUpLoop(){
  //This loop serves as the "game lobby" for players to enter/exit. Game is triggered when spacebar is pressed.
  console.log("in set up loop")
  ctx.fillStyle="rgb(200,200,255)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  updateScore(wormList, scoreList, highScore);
  let setupTextList=["Press SpaceBar to Trigger New Game"];
  if (p2Trigger){setupTextList.push("(press shift + ["+String([p2Keys])+"] to remove player)");}
  else{setupTextList.push("(press ["+String([p2Keys])+"] to add player)")}
  
  // for (const worm of wormList){worm.draw();}
  if (keys["Shift"]){
    for(const key of p2Keys){if (keys[key.toUpperCase()]){p2Trigger=false;}}
  }
  else{
    for(const key of p2Keys){if (keys[key]){p2Trigger=true;}}
  }
  
  if(p2Trigger && numPlayers<2)
  {
    wormList.push(new Worm(initLength, 200,500,10, "blue", speed, moveSet=p2Keys));
    scoreList.push(0);
    numPlayers=wormList.length
  }
  else if (p2Trigger==false && numPlayers>=2)
  {
    wormList.pop(1);
    scoreList.pop(1);
    numPlayers=wormList.length
  }
  // console.log("p2Trigger",p2Trigger)
  drawTextCanvas(setupTextList);
  if (keys[" "]==true){triggerCountdown();}
  else{stopId=requestAnimationFrame(setUpLoop);}
}

function triggerCountdown(){
  function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));} //TODO: learn how to use async shit
  function printCounter(i){
    ctx.fillStyle="rgb(200,200,255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const worm of wormList){worm.draw();}
    updateScore(wormList, scoreList, highScore);
    drawTextCanvas([String(i)]);
  }
  async function startGameCountdown(countDownFrom){
    for (let i = countDownFrom; i>0; i--)
    {
        printCounter(i);
        console.log(i)
        await sleep(1000);
    }
    printCounter(0); await sleep(10);
    animate();
  }
  startGameCountdown(3);
}

function animate() {//primary gameplay loop
  ctx.fillStyle="rgb(200,200,255)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  anyMovement ? apple.move() : apple.draw();
  let liveWormIndices=[];
  for (let i = 0; i<numPlayers; i++)
  {
    let worm = wormList[i];
    if (wormList[i].lost){wormList[i].draw()}
    else{liveWormIndices.push(i);}}
  console.log("live worm indices: ",liveWormIndices)
  for (const i of liveWormIndices)
  {
    let worm = wormList[i];
    worm.getMove(keys)
    anyMovement = wormList[i].speed>0 ? true: anyMovement;
    worm.checkBoundaries();
    if (worm.checkCollision(apple)){
      apple = new Apple(); for (let j=0;j<5;j++){worm.grow()};
      scoreList[i]+=1;
      if(scoreList[i]>highScore){
        highScore=scoreList[i];
        document.cookie = "highScore="+highScore;
      };
      // speed+=1;
                                 }
    for (const j of liveWormIndices){worm.checkWormCollision(wormList[j])};
  }
  updateScore(wormList, scoreList, highScore);
  if ((liveWormIndices.length==1) && (wormList.length>1)){
    let color = wormList[liveWormIndices[0]].color
    drawTextCanvas([color[0].toUpperCase()+color.slice(1) + " Player Wins!"]);
  }
  if (liveWormIndices.length==0)
  {
    setUpGame();
    setUpLoop();
  }
  else{stopId=requestAnimationFrame(animate);}
}

setUpGame()
setUpLoop()