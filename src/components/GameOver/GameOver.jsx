import s from "./GameOver.module.scss";

const GameOver = ({ replay }) => {
  return (
    <div className={s.gameOver}>
      <h1>Game over</h1>
      <button onClick={replay}>Replay</button>
    </div>
  );
};

export default GameOver;
