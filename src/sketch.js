// setup initializes this to a p5.js Video instance.
let video;
let letters = [];
let hits = [];
let alphabet = ["A", "B", "C", "D", "E", "F", 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let count = 0;
let ca = 0;
let timer;
let rwx = 0; // rightWrist x positon
let rwy = 0; // rightWrist y position
let lwx = 0; // leftWrist x position
let lwy = 0; // leftWrist y position
let index = 0; // The index of the alphabet
let time_count = 0;
let time = 60;
let model = 1;

let goin_b1 = true;
let goin_b2 = true;
let goin_b3 = true;
let remaining = 0;
let rem = 0;
let frm = 0;

let score = 0; 


// p5js calls this code once when the page is loaded (and, during development,
// when the code is modified.)
export function setup() {
  createCanvas(windowWidth, windowHeight);
  video = select("video") || createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with single-pose detection. The second argument
  // is a function that is called when the model is loaded. It hides the HTML
  // element that displays the "Loading model…" text.
  const poseNet = ml5.poseNet(video, () => select("#status").hide());

  // Every time we get a new pose, apply the function `drawPoses` to it (call
  // `drawPoses(poses)`) to draw it.
  poseNet.on("pose", drawPoses);

  // Hide the video element, and just show the canvas
  video.hide();
}

// p5js calls this function once per animation frame. In this program, it does
// nothing---instead, the call to `poseNet.on` in `setup` (above) specifies a
// function that is applied to the list of poses whenever PoseNet processes a
// video frame.
export function draw() {}

function drawPoses(poses) {
  // console.log(poses);
  
// When the confidence score is more than 0.5, use rightWrist as the parameter
if (poses.length > 0){
  if (poses[0].pose.rightWrist.confidence > 0.5){
    rwy = poses[0].pose.rightWrist.y;
    rwx = width - poses[0].pose.rightWrist.x;
  }else{
    rwx = mouseX;
    rwy = mouseY;
  }
} else{
  rwx = mouseX;
  rwy = mouseY;
}

// When the confidence score is more than 0.5, use leftWrist as the parameter
if (poses.length > 0){
  if (poses[0].pose.leftWrist.confidence > 0.5){
    lwy = poses[0].pose.leftWrist.y;
    lwx = width - poses[0].pose.leftWrist.x;
  }else{
    lwx = width;
    lwy = height;
  }
} else{
  lwx = width;
  lwy = height;
}

  // Modify the graphics context to flip all remaining drawing horizontally.
  // This makes the image act like a mirror (reversing left and right); this is
  // easier to work with.
  push();
  translate(width, 0); // move the left side of the image to the right
  
  scale(-1.0, 1.0);
  if (model == 1){
    background("rgba(0, 0, 0, 100)");
  }else{
    image(video, 0, 0, video.width, video.height);
  }
  
  
  // drawKeypoints(poses);
  // drawSkeleton(poses);
  
  pop();

  wrist(rwx, rwy, 30);
  wrist(lwx, lwy, 30);

  
  let sizey0 = (height/3)+height/5;
  let sizey1 = (height/3)+1.7*height/5;
  let sizey2 = (height/3)+2.5*height/5;
  

  switch(ca){
    // Start page
    case 0:
      // Display the Start, Settings and Exit
      fill(255);
      textAlign(CENTER, CENTER);
      textFont('Comic Sans MS');
      textSize(30);
      text("Hins: Move your right wrist to choose.", width/2, 30);
      textSize(int(width/10));
      text("Hit the Letter!", width/2, height/3);      
      textSize(width/25);
      text("-Start-", width/2, sizey0);
      text("-Settings-", width/2, sizey1);
      text("-Exit-", width/2, sizey2);

      // The effect of putting your hand on the Start bar
      if (sizey0-height/16 < rwy && rwy< sizey0 + height/16 && rwx > width*1/16 && rwx < width * 15/16) {
        if (goin_b1) {
          timer = frameCount;
        }
        goin_b1 = false;
        noStroke();
        fill(255, 50);
        rectMode(CENTER);
        rect(width/2, sizey0, width*7/8, height/8);
        remaining = frameCount - timer;
        
        if (remaining < 160) { // less than 4 seconds, display progress bar
          fill(255);
          arc(rwx, rwy, 80, 80, 0, radians(map(remaining, 0, 159, 0, 360)), PIE);
        } else { // enter the game
          ca = 4;
          frm = frameCount;
          goin_b1 = true;
        }
      } else {
        goin_b1 = true;
      }

      // The effect of putting your hand on the Setting bar
      if (sizey1-height/16 < rwy && rwy< sizey1 + height/16 && rwx > width*1/16 && rwx < width * 15/16) {
        if (goin_b2) {
          timer = frameCount;
        }
        goin_b2 = false;
        noStroke();
        fill(0,0,255, 50);
        rectMode(CENTER);
        rect(width/2, sizey1, width*7/8, height/8);
        remaining = frameCount - timer;
        
        if (remaining < 160) { // less than 4 seconds, display progress bar
          fill(255);
          arc(rwx, rwy, 80, 80, 0, radians(map(remaining, 0, 159, 0, 360)), PIE);
        } else { // enter the game
          ca = 3;
          goin_b2 = true;
        }
      } else {
        goin_b2 = true;
      }
      
      // The effect of putting your hand on the Exit bar
      if ( rwy > sizey2-height/16 && rwy< sizey2 + height/16 && rwx > width*1/16 && rwx < width * 15/16) {
        if (goin_b3) {
          timer = frameCount;
        }
        goin_b3 = false;
        noStroke();
        fill(255, 0, 0, 50);
        rectMode(CENTER);
        rect(width/2, sizey2, width*7/8, height/8);
        remaining = frameCount - timer;

        if (remaining < 160) { // less than 4 seconds, display progress bar
          fill(255);
          arc(rwx, rwy, 80, 80, 0, radians(map(remaining, 0, 159, 0, 360)), PIE);
        } else { // close the window
          window.close();
        }
      } else {
        goin_b3 = true;
      }

      break;
    
    // Game page
    case 1:
      // Hint
      fill(255);
      textSize(30);
      text("This is the letter that you should hit now: " + alphabet[index], width/2, 20 );

      // Time left
      text("Time left: " + time, width / 16, 20);
      if (time_count == 0){
        time --;
        time_count ++;
      }else if (time_count < 6){
        time_count ++;
      }else if (time_count == 6){
        time_count = 0;
      }

      // Score
      text("Score: " + score, width * 15/16, 20);

      // generate 1 letter per 5 frames
      if (count == 0){
        letters.push( new Letter(random(width), random(0, -50), alphabet[int(random(index,index + 4))]) );
        count ++;
      }else if (count < 5){
        count ++;
      }else if(count == 5){
        count = 0;
      }

      // update and display the letters
      for (let i=0; i<letters.length; i++) {
        let l = letters[i];
        l.update();
        l.display();
        l.move();
      }
      
      
      // detect whether you hit the letter
      for (let i = letters.length-1; i >= 0; i--) {
        if (rwx < letters[i].x + letters[i].size / 2 && rwx > letters[i].x - letters[i].size / 2 && rwy < letters[i].y + letters[i].size / 2 && rwy > letters[i].y - letters[i].size / 2){
          if (letters[i].txt == alphabet[index]){
            letters[i].hit();
            letters.splice(i, 1);
            score += 100;
            index ++;
          }
        } else if (lwx < letters[i].x + letters[i].size / 2 && lwx > letters[i].x - letters[i].size / 2 && lwy < letters[i].y + letters[i].size / 2 && lwy > letters[i].y - letters[i].size / 2){
          if (letters[i].txt == alphabet[index]){
            letters[i].hit();
            letters.splice(i, 1);
            score += 100;
            index ++;
          }
        }
      }

      // remove letters which are done!
      for (let i = letters.length-1; i >= 0; i--) {
        if (letters[i].isDone) {
          letters.splice(i, 1);
        }
      }

      // update and display the hits
      for (let i=0; i<hits.length; i++) {
        let e = hits[i];
        e.move();
        e.updateLifespan();
        e.display();
      }

      // remove hits which are done!
      for (let i = hits.length-1; i >= 0; i--) {
        if (hits[i].isDone) {
          hits.splice(i, 1);
        }
      }
      
      if (time < 0){
        ca = 2;
      }

      if (frameCount - frm > 3350){
        ca = 2;
      }

      if (index > 25){
        index = 0;
      }

      

      break;

    // Ending page
    case 2:
      textSize(int(width/10));
      textAlign(CENTER, CENTER);
      fill(200, 100, 100);
      textFont('Comic Sans MS');
      text("The End", width/2, height/3);
      fill(255);
      textSize(30);
      text("Hins: Move your right wrist to choose.", width/2, 30);
      textSize(width/25);
      text("Score: " + score, width/2, sizey0);
      text("-Back to Menu-", width/2, sizey1);
      text("-Exit-", width/2, sizey2);
      
      // The effect of putting your hand on the Start bar
      if ( rwy > sizey1-height/16 && rwy < sizey1 + height/16 && rwx > width*1/16 && rwx < width * 15/16) {
        if (goin_b1) {
          timer = frameCount;
        }
        goin_b1 = false;
        noStroke();
        fill(255, 50);
        rectMode(CENTER);
        rect(width/2, sizey1, width*7/8, height/8);
        remaining = frameCount - timer;

        if (remaining < 160) { // less than 4 seconds, display progress bar
          fill(255);
          arc(rwx, rwy, 80, 80, 0, radians(map(remaining, 0, 159, 0, 360)), PIE);
        } else { // Back to Menu
          ca = 0;
          initialize();
          goin_b1 = true;
        }
      } else {
        goin_b1 = true;
      }
      
      // The effect of putting your hand on the Exit bar
      if ( rwy > sizey2-height/16 && rwy < sizey2 + height/16 && rwx > width*1/16 && rwx < width * 15/16) {
        if (goin_b3) {
          timer = frameCount;
        }
        goin_b3 = false;
        noStroke();
        fill(255, 0, 0, 50);
        rectMode(CENTER);
        rect(width/2, sizey2, width*7/8, height/8);
        remaining = frameCount - timer;

        if (remaining < 160) { // less than 4 seconds, display progress bar
          fill(255);
          arc(rwx, rwy, 80, 80, 0, radians(map(remaining, 0, 159, 0, 360)), PIE);
        } else { // close the window
          window.close();
        }
      } else {
        goin_b3 = true;
      }

      break;
    
    // Setting page
    case 3: 
      // Display the Model 1, Model 2 and Back
      fill(255);
      textSize(int(width/10));
      textAlign(CENTER, CENTER);
      textFont('Comic Sans MS');
      text("Recent Model: " + model, width/2, height/3);   
      textSize(30);
      text("Hins: Move your right wrist to choose.", width/2, 30);   
      textSize(width/25);
      if (model == 1){
        fill(255, 50);
        text("-Model1-", width/2, sizey0);
        fill(255);
        text("-Model2-", width/2, sizey1);
      }else{
        fill(255);
        text("-Model1-", width/2, sizey0);
        fill(255, 50);
        text("-Model2-", width/2, sizey1);
      }
      fill(255);
      text("-Back-", width/2, sizey2);

      // The effect of putting your hand on the Model1 bar
      if (model == 2){
        if (sizey0-height/16 < rwy && rwy< sizey0 + height/16 && rwx > width*1/16 && rwx < width * 15/16) {
          if (goin_b1) {
            timer = frameCount;
          }
          goin_b1 = false;
          noStroke();
          fill(255, 50);
          rectMode(CENTER);
          rect(width/2, sizey0, width*7/8, height/8);
          remaining = frameCount - timer;
          
          if (remaining < 100) { // less than 4 seconds, display progress bar
            fill(255);
            arc(rwx, rwy, 80, 80, 0, radians(map(remaining, 0, 99, 0, 360)), PIE);
          } else { // enter the game
            model = 1;
          }
        } else {
          goin_b1 = true;
        }
      }

      // The effect of putting your hand on the Model2 bar
      if (model == 1){
        if (sizey1-height/16 < rwy && rwy< sizey1 + height/16 && rwx > width*1/16 && rwx < width * 15/16) {
          if (goin_b2) {
            timer = frameCount;
          }
          goin_b2 = false;
          noStroke();
          fill(0,0,255, 50);
          rectMode(CENTER);
          rect(width/2, sizey1, width*7/8, height/8);
          remaining = frameCount - timer;
          
          if (remaining < 100) { // less than 4 seconds, display progress bar
            fill(255);
            arc(rwx, rwy, 80, 80, 0, radians(map(remaining, 0, 99, 0, 360)), PIE);
          } else { // enter the game
            model = 2;
          }
        } else {
          goin_b2 = true;
        }
      }
      
      // The effect of putting your hand on the Back bar
      if ( rwy > sizey2-height/16 && rwy< sizey2 + height/16 && rwx > width*1/16 && rwx < width * 15/16) {
        if (goin_b3) {
          timer = frameCount;
        }
        goin_b3 = false;
        noStroke();
        fill(255, 0, 0, 50);
        rectMode(CENTER);
        rect(width/2, sizey2, width*7/8, height/8);
        remaining = frameCount - timer;

        if (remaining < 100) { // less than 4 seconds, display progress bar
          fill(255);
          arc(rwx, rwy, 80, 80, 0, radians(map(remaining, 0, 99, 0, 360)), PIE);
        } else { // close the window
          ca = 0;
          goin_b3 = true;
        }
      } else {
        goin_b3 = true;
      }

      break;
    
    // Instruction page
    case 4:
      rem = frameCount - frm;
      fill(255);
      textAlign(CENTER, CENTER);
      textFont('Comic Sans MS');
      if (rem <= 300){
        textSize(40);
        text("Hit the letters in the sequence of the alphabet.", width/2, height/3);
      }else if (rem > 300 && rem <= 500){
        textSize(int(width/15));
        text("Ready?", width/2, height/3);
      }else if (rem > 500 && rem <= 600){
        textSize(int(width/10));
        text("Start!", width/2, height/3);
      }else {
        ca = 1;
        frm = frameCount;
      }

      break;
  }
  


  // display the frameRate
  // fill(255);
  // textSize(13);
  // text( frameRate(), 80, 20 );
}

function wrist(x, y, size){
  fill(map(x, 0, width, 0, 255), map(y, 0, height, 0 ,255), map(x + y, 0, width+height, 0,255));
  noStroke();
  ellipse(x, y, size, size);
}

// Initialize the game
function initialize(){
  score = 0;
  hits = [];
  letters = [];
  index = 0; 
  time = 60;
}

// Draw ellipses over the detected keypoints
// function drawKeypoints(poses) {
//   poses.forEach(pose =>
//     pose.pose.keypoints.forEach(keypoint => {
//       if (keypoint.score > 0.2) {
//         fill(0, 255, 0);
//         noStroke();
//         ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
//       }
//     })
//   );
// }

// // Draw connections between the skeleton joints.
// function drawSkeleton(poses) {
//   poses.forEach(pose => {
//     pose.skeleton.forEach(skeleton => {
//       // skeleton is an array of two keypoints. Extract the keypoints.
//       const [p1, p2] = skeleton;
//       stroke(255, 255, 0);
//       strokeWeight(5);
//       line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
//     });
//   });
// }


// Letter class
class Letter {
  constructor(x, y, txt) {
    // properties
    this.x = x;
    this.y = y;
    this.size = 45;
    this.xSpd = 0;
    this.ySpd = random(7, 11);
    this.r = 255;
    this.g = 255;
    this.b = 0;

    this.txt = txt; 
    this.isDone = false;
  }
  // methods

  update() {
    if (score >= 1000 && score < 2000){
      this.xSpd = random(-10, 10);
      this.ySpd = random(11, 15);
    }else if (score >= 2000){
      this.xSpd = random(-20,20);
      this.ySpd = random (15, 20);
    }

    if (this.y >= height) {
      this.isDone = true;
    }
  }

  // move the letter
  move() {
    this.x -= this.xSpd;
    this.y += this.ySpd;

    if (this.x < 0){
      this.xSpd = - this.xSpd;
    }else if (this.x > width){
      this.xSpd = - this.xSpd;
    }
  }
  
  // display the letter
  display() {
    noStroke();
    fill(255, 255, 255, 0);
    ellipse(this.x, this.y, this.size, this.size);

    fill(this.r, this.g, this.b);
    textSize(50);
    textFont('Comic Sans MS');
    text( this.txt, this.x - 4, this.y + 6);
  }

  // hit the letter
  hit(){
    for (let i = 0; i < 20; i++){
      hits.push( new Hit(this.x, this.y) );
    }
  }
}

// Hit class
class Hit {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.size = random(10, 25);
    this.xSpd = random(-2, 2);
    this.ySpd = random(-2, 2);
    this.r = random(0,255);
    this.g = random(0,255);
    this.b = random(0,255);
    this.lifespan = 0.3; // 50%
    this.lifeReduction = random(0.002, 0.008);
    this.isDone = false;
  }


  move() {
    this.x -= this.xSpd;
    this.y -= this.ySpd;
  }

  display(){
    noStroke();
    fill(this.r, this.g, this.b, 500 * this.lifespan);
    ellipse(this.x, this.y, this.size * this.lifespan, this.size * this.lifespan);
  }

  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0.0) {
      this.isDone = true;
    }
  }
}