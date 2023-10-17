const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// general settings
let gamePlaying = false;
const gravity = .4;
const speed = 6;
const size = [51, 36];
const jump = -9;
const cTenth = (canvas.width / 10);

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipe;

// pipe settings
const pipeWidth = 78;
const pipeGap = 270; //расстояние между трубами
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

// звуковые эффекты
const score_audio = new Audio();
score_audio.src = "audio/score.mp3"


const setup = () => {
  currentScore = 0;
  flight = jump;
  

  // полет птички, высота (середина экрана - размер птички)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // первые три трубы: массив с элементами, созданными функцией
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

//движение птиц и труб 
const render = () => {
  
  index++;
  
  

  // задний фон - первая часть
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // задний фон - 2 часть
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // отражение труб
  if (gamePlaying){
    
    
    pipes.map(pipe => {
      // движение труб
      pipe[0] -= speed;

      // верхняя труба
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // нижняя труба
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // балл и создание трубы
      if(pipe[0] <= -pipeWidth){
        score_audio.play();
        currentScore++;
        
        // лучшая скорость ? 
        bestScore = Math.max(bestScore, currentScore);
        //новая труба
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
        console.log(pipes);
      }
    
      // удар об трубу
      if ([
        pipe[0] <= cTenth + size[0], 
        pipe[0] + pipeWidth >= cTenth, 
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
      }
    })
  }
  // пташка
  if (gamePlaying) {
    
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);
      // text accueil
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText('Click to play', 90, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  
  window.requestAnimationFrame(render);
}


setup();
img.onload = render;

// начало игры

document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;

document.addEventListener('keydown', () => gamePlaying = true);
window.onkeydown = () => flight = jump;