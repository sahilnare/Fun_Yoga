let video;
let poseNet;
let pose;
let skeleton;

//for setting up everthing - it will run only once
function setup() {
    //creating canvas
    createCanvas(640, 480);
    //capturing video
    video = createCapture(VIDEO);
    video.hide();
    //calling posNet
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', getPoses);
}


function getPoses(poses) {
    //console.log(poses);
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
    image(video, 0, 0);

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