import useStore from "../../utils/store";
import s from "./Snake.module.scss";

const Snake = ({ data }) => {
  const { skin } = useStore();

  // console.log(data);

  const getStyle = (dot, i) => {
    // console.log(dot[0], dot[1]);
    let background = null;
    // if(data[data.length])
    // console.log(data[data.length - 1]);
    if (data[data.length - 1] === dot) {
      // console.log("head", dot[0], dot[1]);
      background = `url('/skin.jpg') 0 0`;
    } else {
      background = `url('/skin.jpg') ${10 * i}px 10px`;
    }

    const style = {
      transform: `translate(${dot[0]}px, ${dot[1]}px)`,
      // background: skin ? `url('${skin}') ${10 * i}px 0` : "",
      background: background,
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
