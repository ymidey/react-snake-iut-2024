import uniqid from "uniqid";
import gsap from "gsap";
import useStore from "./store";

const flashbangAudio = new Audio("/audio/csgo-flashbang.mp3");

let flashTween = null;
let pikachuTween = null;

export const netherPortal = () => {
  const video = document.getElementById("nether-video");
  video.style.display = "block";

  setTimeout(() => {
    video.style.display = "none";
  }, 3000);
};

export const flashUser = () => {
  if (flashTween) flashTween.kill();

  flashbangAudio.currentTime = 0;
  flashbangAudio.play();
  document.querySelector(".flashbang").style.opacity = "1";

  flashTween = gsap.to(".flashbang", {
    opacity: 0,
    duration: 2,
    delay: 0.25,
  });
};
// Précharge le son dès le début
const pikachuSound = new Audio('audio/pikachu.mp3');
pikachuSound.load(); // Assure le préchargement

export const pikachu = () => {
  console.log("Pikachu !");

  if (pikachuTween) pikachuTween.kill();

  // Rejoue le son immédiatement sans attendre
  pikachuSound.currentTime = 0;
  pikachuSound.play();

  const pikachuElement = document.querySelector(".pikachu");
  pikachuElement.style.opacity = "1";

  pikachuTween = gsap.timeline({
    onComplete: () => {
      gsap.to(".pikachu", {
        opacity: 0,
        duration: 1,
        delay: 0.25,
      });
    },
  });

  pikachuTween
    .to(pikachuElement, {
      backgroundColor: "yellow",
      opacity: 1,
      duration: 0.1,
      repeat: 2,
      yoyo: true,
    })
    .to(pikachuElement, {
      backgroundColor: "orange",
      duration: 0.1,
      repeat: 2,
      yoyo: true,
    });
};



export const triggerMode = () => {
  const modes = ["impossible", "corner", "reversed"];
  const selectedMode = modes[Math.floor(Math.random() * modes.length)];

  // déclenche le mode sélectionné aléatoirement
  useStore.getState().addMode(selectedMode);

  setTimeout(() => {
    useStore.getState().removeMode(selectedMode);
  }, 1000);
};

export const wizz = () => {
  gsap.to("#board, #border", {
    duration: 0.05,
    x: "+=30%",
    yoyo: true,
    repeat: 9,
  });
};

export const reversedControls = (e, direction) => {
  switch (e.keyCode) {
    //touche du haut
    case 38:
      // console.log("going up");
      if (direction.current !== "UP") {
        direction.current = "DOWN";
      }
      // Going up
      break;
    case 40:
      if (direction.current !== "DOWN") {
        direction.current = "UP";
      }
      // Going down
      break;
    case 37:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT";
      }
      // Going left
      break;
    case 39:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT";
      }
      // Going right
      break;

    default:
      break;
  }
};

export const defaultControls = (e, direction) => {
  switch (e.keyCode) {
    case 38:
      // console.log("going up");
      if (direction.current !== "DOWN") {
        direction.current = "UP";
      }
      // Going up
      break;
    case 40:
      if (direction.current !== "UP") {
        direction.current = "DOWN";
      }
      // Going down
      break;
    case 37:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT";
      }
      // Going left
      break;
    case 39:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT";
      }
      // Going right
      break;

    default:
      break;
  }
};

export const generateRandomCoordinates = (mode, boardSize = 650, objectSize = 20) => {
  const id = uniqid();
  const min = 0;
  const max = boardSize - objectSize; // Dernière position valide
  let x, y;

  if (mode.includes("corner")) {
    const side = Math.random();

    if (side <= 0.25) {
      // Générer sur le bord gauche
      x = min;
      y = Math.floor(Math.random() * (max / objectSize)) * objectSize;
    } else if (side > 0.25 && side <= 0.5) {
      // Générer sur le bord droit
      x = max;
      y = Math.floor(Math.random() * (max / objectSize)) * objectSize;
    } else if (side > 0.5 && side <= 0.75) {
      // Générer sur le bord bas
      x = Math.floor(Math.random() * (max / objectSize)) * objectSize;
      y = max;
    } else {
      // Générer sur le bord haut
      x = Math.floor(Math.random() * (max / objectSize)) * objectSize;
      y = min;
    }
  } else {
    // Mode classique
    x = Math.floor(Math.random() * (max / objectSize)) * objectSize;
    y = Math.floor(Math.random() * (max / objectSize)) * objectSize;
  }

  return { x, y, id };
};
