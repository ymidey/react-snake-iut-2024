import useStore from "../../utils/store";
import s from "./Snake.module.scss";

const Snake = ({ data }) => {
  const { skin } = useStore();

  const getStyle = (dot, i) => {
    const style = {
      transform: `translate(${dot[0]}px, ${dot[1]}px)`,
      background: skin ? `url('${skin}') ${10 * i}px 0` : "",
    };

    return style;
  };

  return (
    <>
      {data.map((dot, i) => (
        <div key={i} className={s.snakeDot} style={getStyle(dot, i)}></div>
      ))}
    </>
  );
};

export default Snake;
