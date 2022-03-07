var anim;
var animSeq;
var messages;
var mssg = 0;

var numClicks = 0;

var TypeEnum = {
  NORMAL: 1,
  RANDOM: 2,
};

let Sounds; //All sounds
let SoundsTemp; //A sentence

let Explode; //Explosion sound

var sNum; //Logic for incrementing callback loop

//----------------------------------------


//Robot eventually explodes?

function preload() {
  robo = loadFont("assets/roboto.thin.ttf");

  //These are all the speech parts we have to choose from
  Sounds = [
    loadSound("assets/sounds/sound1.wav"),
    loadSound("assets/sounds/sound2.wav"),
    loadSound("assets/sounds/sound3.wav"),
    loadSound("assets/sounds/sound4.wav"),
    loadSound("assets/sounds/sound5.wav"),
    loadSound("assets/sounds/sound6.wav"),
    loadSound("assets/sounds/sound8.wav")

  ]
  //This will house the speech parts to be spoken
  SoundsTemp = [];

  Explode = loadSound("assets/sounds/explose.wav");
}

function setup() {
  createCanvas(400, 400);
  frameRate(10);


  messages = [];
  messages.push("Do Not Click The Robot");
  messages.push("Uhhhmmmm...");
  messages.push("*BEEP*");
  messages.push("*BLEEP*");
  messages.push("*BOOP*");
  messages.push("*BLOOP*");
  messages.push("*BLORP*");

  anim = new Animation(6, "assets/images/image");
  explosion = new Animation(10, "assets/images/exp")
  explosion.freezeLastFrame = true;
  animSeq = new AnimationSeq();
  animSeq.add(anim);
  animSeq.add(explosion);
  animSeq.pause();
  animSeq.changePlayType(TypeEnum.RANDOM);

  //Sound
  sNum = 0;
}

function draw() {
  //background(45);
  clear();
  animSeq.play();

  fill(240, 20, 35);
  textAlign(CENTER);
  textSize(30);
  textFont(robo);
  text(messages[mssg], 0, 350, 400, 50);
}


function mousePressed() {

  numClicks++;

  if (numClicks < 6) {
    Speak(); //Robot sounds
    animSeq.advanceFrame();
    mssg = Math.trunc(random(2, messages.length));
    setTimeout(RoboText, 500)
  }

  if (numClicks == 6) {
    Explode.play(); //Robot exploseded
    animSeq.changeAnimation(1);
    animSeq.pause = false;
    mssg = 1;
  }
}

function RoboText() {
  if (numClicks < 6) {
    mssg = 0;
    animSeq.resetFrame();
  }

}

class Animation {

  constructor(_numFrames, _address) {
    this.animID;
    this.pause = false;
    this.frames = [];
    this.numFrames = _numFrames;
    this.currentFrame = 0;
    this.address = _address;
    this.pos = createVector(width / 5, height / 6);
    this.playType = TypeEnum.NORMAL;
    this.freezeLastFrame = false;

    print(width / 2);

    for (let i = 0; i < this.numFrames; i++) {
      let Name = this.address + nf(i, 2) + ".png";
      this.frames.push(loadImage(Name));
    }
  }

  play() {
    if (!this.pause) {
      if (this.playType == TypeEnum.NORMAL) {
        this.currentFrame = (this.currentFrame + 1) % this.numFrames;
      } else if (this.playType == TypeEnum.RANDOM) {
        this.currentFrame = Math.trunc(random(this.numFrames));
      }

    }
    if (this.freezeLastFrame && this.currentFrame == this.numFrames - 1) {
      this.currentFrame = this.numFrames - 1;
      this.pause = true;
    }
    image(this.frames[this.currentFrame], this.pos.x, this.pos.y);
  }

  advanceFrame() {
    if (this.playType == TypeEnum.NORMAL) {
      this.currentFrame = (this.currentFrame + 1) % this.numFrames;
    } else if (this.playType == TypeEnum.RANDOM) {
      this.currentFrame = Math.trunc(random(1, this.numFrames));
    }
  }
  resetAnim() {
    this.currentFrame = 0;
  }
  changePlayType(_playType) {
    this.playType = _playType;
  }
}

class AnimationSeq {

  constructor() {
    this.animations = [];
    this.playID = 0;
  }

  add(_animation) {
    _animation.animID = this.animations.length;
    this.animations.push(_animation);
  }

  play() {
    this.animations[this.playID].play();
  }

  pause() {
    this.animations[this.playID].pause = !this.animations[this.playID].pause;
  }

  advanceFrame() {
    this.animations[this.playID].advanceFrame();
  }

  resetFrame() {
    this.animations[this.playID].resetAnim();
  }
  changePlayType(_playType) {
    this.animations[this.playID].changePlayType(_playType);
  }
  changeAnimation(_playID) {
    this.playID = _playID;
  }
}

//-------------Sound Logic------------------------

//Randomizes sounds to be played in speech
function RandomizeSounds() {
  var total = 3; //How sounds to play at a time
  var numsounds = Sounds.length;
  var _sounds = [...Sounds];
  var randomizedlist = [];

  while (total > 0) {
    var nxt = Math.trunc(random(0, _sounds.length));
    randomizedlist.push(_sounds[nxt]);
    _sounds.splice(nxt, 1);
    total--;
  }
  //The next sentence
  SoundsTemp = [...randomizedlist];
}

//Initiates speech
function Speak() {
  RandomizeSounds();
  PlaySound(0);
  SoundsTemp[0].onended(SchedSound)
}

//Callback loop for triggering speech parts
function SchedSound(element) {
  sNum++;

  if (sNum < SoundsTemp.length) {
    PlaySound(sNum);
    SoundsTemp[sNum].onended(SchedSound);
  } else {
    sNum = 0;
  }
}

//Play() wrapper
function PlaySound(num) {
  SoundsTemp[num].rate(random(0.9, 1.8))
  SoundsTemp[num].setVolume(0.25);
  SoundsTemp[num].play();
  //Distance & other modulation
}