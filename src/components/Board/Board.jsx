import { useEffect, useState, useRef } from "react";
import Snake from "../Snake/Snake";
import gsap from "gsap";
import s from "./Board.module.scss";
import Item from "../Item/Item";
import {
  defaultControls,
  flashUser,
  generateRandomCoordinates,
  triggerMode,
  reversedControls,
  wizz,
  pikachuDancing,
  pikachu,
} from "../../utils/utils";
import GameOver from "../GameOver/GameOver";
import useStore from "../../utils/store";
import Submit from "../Submit/Submit";
import Scoreboard from "../Scoreboard/Scoreboard";

const Board = () => {
  const { mode, removeMode } = useStore();
  const [paused, setPaused] = useState(false);
  const [snakeData, setSnakeData] = useState([
    [0, 0],
    [20, 0],
  ]);

  const [trapArray, setTrapArray] = useState([]);
  const [foodArray, setFoodArray] = useState([]);

  const [hasEnteredResults, setHasEnteredResults] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(0.3);
  const [score, setScore] = useState(0);
  const [death, setDeath] = useState(0);

  const timer = useRef(0);
  const foodTimer = useRef(0);
  const trapTimer = useRef(0);
  const direction = useRef("RIGHT");
  const canChangeDirection = useRef(true);

  const [isPaused, setIsPaused] = useState(false);
  const ambianceMusic = useRef(new Audio("/audio/ambianceMusic.mp3")); // Référence à l'objet Audio
  ambianceMusic.current.loop = true; // Active la lecture en boucle


  const gameIsOver = () => {
    gsap.ticker.remove(gameLoop);

    setDeath(death + 1);

    const video = document.getElementById("die-video");
    video.style.display = "block";

    video.currentTime = 0;
    video.play();

    setGameOver(true);
  };

  // Fonction pour jouer la musique
  const playMusic = () => {
    ambianceMusic.current.play().catch((err) => {
      console.error("Impossible de jouer la musique :", err);
    });
  };

    // Fonction pour mettre la musique en pause
  const pauseMusic = () => {
    ambianceMusic.current.pause();
  };

  const isOutOfBorder = (head) => {
    if (head[0] >= 650 || head[1] >= 650 || head[0] < 0 || head[1] < 0) {
      return true;
    } else {
      return false;
    }
  };

  const hasEatenItem = ({ getter, setter }) => {
  const head = snakeData[snakeData.length - 1];
  const eatSound = new Audio('audio/Food.mp3');

  // comparer les coordonnées de la tête du snake avec les items
  const item = getter.find(
    (_item) => _item.x === head[0] && _item.y === head[1]
  );

  if (item) {
    // Joue le son uniquement si c'est un foodArray
    if (getter === foodArray) {
      eatSound.play();
    }

    // Mettre à jour le tableau des items disponibles
    const newItemArray = getter.filter((_item) => _item !== item);
    setter(newItemArray);

    return true;
  } else {
    // Sinon on renvoie false
    return false;
  }
};

  const moveSnake = () => {
      if (paused) return;
    let newSnakeData = [...snakeData];
    let head = newSnakeData[newSnakeData.length - 1];

    // console.log(head);

    switch (direction.current) {
      case "RIGHT":
        head = [head[0] + 20, head[1]];

        break;
      case "LEFT":
        head = [head[0] - 20, head[1]];

        break;
      case "DOWN":
        head = [head[0], head[1] + 20];

        break;
      case "UP":
        head = [head[0], head[1] - 20];

      default:
        break;
    }

    newSnakeData.push(head);
    newSnakeData.shift();

    const snakeCollapsed = hasCollapsed(head);
    const outOfBorder = isOutOfBorder(head);
    const snakeAteFood = hasEatenItem({
      getter: foodArray,
      setter: setFoodArray,
    });
    const snakeAteTrap = hasEatenItem({
      getter: trapArray,
      setter: setTrapArray,
    });


    if (outOfBorder || snakeCollapsed) {
      gameIsOver();
    } else {
      if (snakeAteTrap === true) {
        // trap execution logic
        const effects = [flashUser, triggerMode, wizz, pikachuDancing, pikachu];

        const selectedEffect =
          effects[Math.floor(Math.random() * effects.length)];

        selectedEffect();
      }
      if (snakeAteFood === true) {
        // agrandir le serpent
        newSnakeData.unshift([]);

        setScore(score + 1);

        if (speed > 0.05) {
          setSpeed(speed - 0.02);
        }
      }
      setSnakeData(newSnakeData);
    }
  };

  const hasCollapsed = (head) => {
    let snake = [...snakeData];

    // retire la dernière case du tableau
    snake.pop();

    // comparer les coordonnées de head (tête du snake) avec les autres points du snake
    for (let i = 0; i < snake.length; i++) {
      if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
        // si match renvoie true
        return true;
      }
    }

    // sinon renvoie false
    return false;
  };

  const onKeyDown = (e) => {
     if (e.key === "p") {
    pauseGame();
    return;
  }
    // console.log(e);
    if (canChangeDirection.current === false) return;
    canChangeDirection.current = false;

    mode.includes("reversed")
      ? reversedControls(e, direction)
      : defaultControls(e, direction);
  };

  const addItem = ({ getter, setter }) => {
    // génération de coordonnées
    const coordinates = generateRandomCoordinates(mode);

    //fusion des deux tableaux
    const array = [...foodArray, ...trapArray];

    //test pour savoir si un item est déjà existant à cet endroit
    const itemAlreadyExistsHere = array.some(
      (item) => item.x === coordinates.x && coordinates.y === item.y
    );

    // si ça existe déjà, rappeler la fonction
    if (itemAlreadyExistsHere) {
      addItem({ getter, setter });
      return;
    }

    setter((oldArray) => [...oldArray, coordinates]);
  };

  const gameLoop = (time, deltaTime, frame) => {
    if (paused) return;
    timer.current += deltaTime * 0.001;
    foodTimer.current += deltaTime * 0.001;
    trapTimer.current += deltaTime * 0.001;

    // ici, gestion de l'apparition de la nourriture
    if (foodTimer.current > 2 && foodArray.length < 5) {
      foodTimer.current = 0;
      addItem({
        getter: foodArray,
        setter: setFoodArray,
      });
    }

    // ici, gestion des pièges
    if (trapTimer.current > 3 && trapArray.length < 3) {
      trapTimer.current = 0;
      addItem({
        getter: trapArray,
        setter: setTrapArray,
      });
    }

    if (timer.current > (mode.includes("impossible") ? 0.02 : speed)) {
      timer.current = 0;
      moveSnake();
      canChangeDirection.current = true;
    }
  };

  const replay = () => {
    // replay game

    removeMode("corner");
    removeMode("impossible");
    removeMode("reversed");

    const video = document.getElementById("die-video");
    video.style.display = "none";
    video.pause();

    //reset game over
    setGameOver(false);
    setHasEnteredResults(false);
    setSpeed(0.2); // reset speed
    setScore(0); // reset score

    //reset data snake
    setSnakeData([
      [0, 0],
      [20, 0],
    ]);
    //reset food
    setFoodArray([]);
    setTrapArray([]);

    //reset direction
    direction.current = "RIGHT";

    //reset timer
    timer.current = 0;

    //reset food timer
    foodTimer.current = 0;
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    gsap.ticker.add(gameLoop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      gsap.ticker.remove(gameLoop);
    };
  }, [snakeData]);

const pauseGame = () => {
  setPaused((prevPaused) => {
    if (prevPaused) {
      gsap.ticker.add(gameLoop);
      playMusic();
    } else {
      gsap.ticker.remove(gameLoop);
      timer.current = 0;
      foodTimer.current = 0;
      trapTimer.current = 0;
      pauseMusic();
    }
    return !prevPaused;
  });
};
// Gestion du chargement initial de la musique
  useEffect(() => {
    const handleKeydown = () => {
      playMusic(); // Joue la musique à la première interaction
      document.removeEventListener("keydown", handleKeydown); // Retire l'écouteur après la première touche
    };

    document.addEventListener("keydown", handleKeydown); // Ajoute l'écouteur pour la première interaction

    return () => {
      document.removeEventListener("keydown", handleKeydown); // Nettoie l'écouteur
    };
  }, []); // Exécuté une seule fois au montage

  return (
    <>
      {gameOver && <GameOver replay={replay} />}
      {gameOver && !hasEnteredResults && (
        <Submit
          score={score}
          death={death}
          setHasEnteredResults={setHasEnteredResults}
        />
      )}
      {gameOver && <Scoreboard />}

      <div id="border" className={s.border}>
      </div>
      <div id="board" className={s.board}>
         {paused && (
    <div className={s.pauseOverlay}>
      <span>Jeu en pause</span>
    </div>
  )}
        <Snake data={snakeData} />

        <span className={s.score}>Score: {score}</span>

        <span className={s.death}>Death: {death}</span>

        {foodArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="food" />
        ))}

        {trapArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="trap" />
        ))}
      </div>
      
    </>
  );
};

export default Board;
