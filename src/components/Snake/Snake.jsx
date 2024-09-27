import s from "./Snake.module.scss";

const Snake = ({ data }) => {
  // console.log(data);
  return (
    <>
      {data.map((dot, i) => (
        <div
          key={i}
          className={s.snakeDot}
          style={{ transform: `translate(${dot[0]}px, ${dot[1]}px)` }}
        ></div>
      ))}
    </>
  );
};

export default Snake;
