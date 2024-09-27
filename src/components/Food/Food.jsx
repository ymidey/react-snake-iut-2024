import s from "./Food.module.scss";

const Food = ({ coordinates }) => {
  // console.log(coordinates);

  const style = {
    transform: `translate(${coordinates.x}px, ${coordinates.y}px)`,
  };

  return <div className={s.food} style={style}></div>;
};

export default Food;
