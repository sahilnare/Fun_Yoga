let img;
let poseNet2;
let posses = [];
let video;
let poseNet;
let pose;
let skeleton;

//for setting up everthing - it will run only once
function setup() {
  createCanvas(640, 360);
  // call modelReady() when it is loaded
  img = createImg('assets/pic.png', imageReady);
  // set the image size to the size of the canvas
  img.size(width, height);
  img.hide(); // hide the image in the browser
  frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case


    //creating canvas
    createCanvas(640, 480);
    //capturing video
    video = createCapture(VIDEO);
    video.hide();
    //calling posNet
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', getPoses);
}


// when the image is ready, then load up poseNet
function imageReady(){
  // set some options
  let options = {
      imageScaleFactor: 1,
      minConfidence: 0.1
  }
  
  // assign poseNet
  poseNet2 = ml5.poseNet(modelReady, options);
  // This sets up an event that listens to 'pose' events
  poseNet2.on('pose', function (results) {
      posses = results;
  });
}

function modelReady() {
  select('#status').html('Model Loaded');
   
  // When the model is ready, run the singlePose() function...
  // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results 
  // in the draw() loop, if there are any poses, then carry out the draw commands
  poseNet2.singlePose(img)
}




function getPoses(poses) {
    // console.log(poses);
    if (poses.length > 0) {
        //pushing first object in array
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
      }
}




function modelLoaded() {
    console.log('poseNet Ready!');
}


function draw() {

  if (posses.length > 0) {
    image(img, 0, 0, width, height);
    drawSkeleton(posses);
    drawKeypoints(posses);
    noLoop(); // stop looping when the poses are estimated
}




    // image(img, 0, 0);
    image(video, 1000, 1000);

    if (pose) {
        // let eyeR = pose.rightEye;
        // let eyeL = pose.leftEye;
        // let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
        // fill(255, 0, 0);
        // ellipse(pose.nose.x, pose.nose.y, d);
        // fill(0, 0, 255);
        // ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
        // ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    
        //drawing all the 17 keypoints on the body
        for (let i = 0; i < pose.keypoints.length; i++) {
          let x = pose.keypoints[i].position.x;
          let y = pose.keypoints[i].position.y;
          fill(0, 255, 0);
          ellipse(x, y, 16, 16);
        }
    

        //for drawing line as skeleton gives two points
        for (let i = 0; i < skeleton.length; i++) {
          let a = skeleton[i][0];
          let b = skeleton[i][1];
          strokeWeight(2);
          stroke(255);
          line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
      }
}



// The following comes from https://ml5js.org/docs/posenet-webcam
// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < posses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = posses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                fill(255);
                stroke(20);
                strokeWeight(4);
                ellipse(round(keypoint.position.x), round(keypoint.position.y), 8, 8);
            }
        }
    }
}

// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < posses.length; i++) {
        let skeleton = posses[i].skeleton;
        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255);
            strokeWeight(1);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}