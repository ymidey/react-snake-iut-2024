import uniqid from "uniqid";

export const generateRandomCoordinates = () => {
  console.log("generate random");

  const id = uniqid();

  let min = 0;
  let max = 49;

  let x, y;

  x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;

  x *= 10;

  y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;

  y *= 10;

  console.log(x, y);

  return { x, y, id };
};
