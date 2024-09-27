import { useEffect, useState, useRef } from "react";
import Snake from "../Snake/Snake";
import gsap from "gsap";
import s from "./Board.module.scss";
import Food from "../Food/Food";
import { generateRandomCoordinates } from "../../utils/utils";
import GameOver from "../GameOver/GameOver";

const Board = () => {
  const [snakeData, setSnakeData] = useState([
    [0, 0],
    [10, 0],
  ]);

  const [foodArray, setFoodArray] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(0.2);
  const [score, setScore] = useState(0);

  const timer = useRef(0);
  const foodTimer = useRef(0);
  const direction = useRef("RIGHT");
  const canChangeDirection = useRef(true);

  const gameIsOver = () => {
    gsap.ticker.remove(gameLoop);

    setGameOver(true);

    console.log("game over");
  };

  const isOutOfBorder = () => {
    const head = snakeData[snakeData.length - 1];

    if (head[0] >= 500 || head[1] >= 500 || head[0] < 0 || head[1] < 0) {
      return true;
    } else {
      return false;
    }
  };

  const hasEatenFood = () => {
    const head = snakeData[snakeData.length - 1];

    // comparer les coordonnées de la tête du snake avec LES food
    const food = foodArray.find(
      (_food) => _food.x === head[0] && _food.y === head[1]
    );

    if (food) {
      // si y'a match on renvoie true

      // mettre à jour le tableau des food disponibles
      const newFoodArray = foodArray.filter((_food) => _food !== food);

      setFoodArray(newFoodArray);

      return true;
    } else {
      // sinon on renvoie false
      return false;
    }
    // console.log(food);
  };

  const moveSnake = () => {
    let newSnakeData = [...snakeData];
    let head = newSnakeData[newSnakeData.length - 1];

    // console.log(head);

    switch (direction.current) {
      case "RIGHT":
        head = [head[0] + 10, head[1]];

        break;
      case "LEFT":
        head = [head[0] - 10, head[1]];

        break;
      case "DOWN":
        head = [head[0], head[1] + 10];

        break;
      case "UP":
        head = [head[0], head[1] - 10];

      default:
        break;
    }

    newSnakeData.push(head);
    newSnakeData.shift();

    const snakeCollapsed = hasCollapsed();
    const outOfBorder = isOutOfBorder();
    const snakeAteFood = hasEatenFood();

    console.log(snakeCollapsed);

    if (outOfBorder || snakeCollapsed) {
      gameIsOver();
    } else {
      if (snakeAteFood === true) {
        // agrandir le serpent
        newSnakeData.unshift([]);

        setScore(score + 10);

        if (speed > 0.05) {
          console.log("speed =", speed);
          setSpeed(speed - 0.02);
        }
      }
      setSnakeData(newSnakeData);
    }
  };

  const hasCollapsed = () => {
    let snake = [...snakeData];
    let head = snake[snake.length - 1];

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
    // console.log(e);
    if (canChangeDirection.current === false) return;
    canChangeDirection.current = false;

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

  const addFood = () => {
    // console.log("add food");
    // génération de coordonnées
    const coordinates = generateRandomCoordinates();
    console.log(coordinates);
    // mise à jour du state
    setFoodArray((oldFoodArray) => [...oldFoodArray, coordinates]);
  };

  const gameLoop = (time, deltaTime, frame) => {
    // console.log(time, deltaTime, frame);

    timer.current += deltaTime * 0.001;
    foodTimer.current += deltaTime * 0.001;

    if (foodTimer.current > 3 && foodArray.length < 3) {
      foodTimer.current = 0;
      addFood();
    }

    if (timer.current > speed) {
      //   console.log("Move snake");
      timer.current = 0;
      moveSnake();
      canChangeDirection.current = true;
    }
  };

  const replay = () => {
    // replay game

    //reset game over
    setGameOver(false);
    setSpeed(0.2); // reset speed
    setScore(0); // reset score

    //reset data snake
    setSnakeData([
      [0, 0],
      [10, 0],
    ]);
    //reset food
    setFoodArray([]);

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

  return (
    <div className={s.board}>
      <Snake data={snakeData} />

      <span className={s.score}>Score: {score}</span>

      {gameOver && <GameOver replay={replay} />}

      {foodArray.map((coordinates) => (
        <Food key={coordinates.id} coordinates={coordinates} />
      ))}
    </div>
  );
};

export default Board;
