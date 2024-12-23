import Board from "./components/Board/Board";
import Toggle from "./components/Toggle/Toggle";
import { useDropzone } from "react-dropzone";
import useStore from "./utils/store";

function App() {
  const { skin, setSkin } = useStore();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg": [],
      "image/webp": [],
      "image/gif": [],
    },
    maxFiles: 1,
    noClick: true,
    onDrop: (file) => onDrop(file),
  });

  const onDrop = (file) => {
    const src = URL.createObjectURL(file[0]);
    setSkin(src);
  };

  return (
    <div>
      <video autoPlay muted loop id="background-video">
    <source src="/background.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
      <video src="/you-died.mp4" id="die-video" className="die-video"></video>
  <img 
    src="Detective-Pikachu-Dancing-Gree-unscreen.gif" 
    id="nether-video"
    className="nether-video" 
    alt="Detective Pikachu Dancing"
/>

      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {skin && <img src={skin} alt="" />}
      </div>

      <div className="flashbang"></div>
      <div className="pikachu"></div>
      <Board />
      <div className="toggle-wrapper">
        <Toggle mode={"corner"} />
        <Toggle mode={"impossible"} />
        <Toggle mode={"reversed"} />
      </div>
    </div>
  );
}

export default App;
