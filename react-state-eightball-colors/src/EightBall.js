import React, { useState } from 'react';
import './EightBall.css'

const EightBall = ({ answers }) => {
  const [color, setColor] = useState("black");
  const [msg, setMsg] = useState("Think of a Question");
  const [counter, setCounter] = useState({green: 0, goldenrod: 0, red: 0});

  const getAnswer = () => {
    const ans = answers[Math.floor(Math.random() * answers.length)];
    counter[ans.color] += 1;
    setColor(ans.color);
    setMsg(ans.msg);
    setCounter(counter);
  };
  const reset = () => {
    setColor("black");
    setMsg("Think of a Question");
  };

  return (
    <div>
      <button className="EightBall" style={{backgroundColor: color}} onClick={color === "black" ? getAnswer : null}>{msg}</button>
      <p>Green: {counter.green} | Yellow: {counter.goldenrod} | Red: {counter.red}</p>
      {color !== "black" && <button onClick={reset}>Reset</button>}
    </div>
  );
};

export default EightBall;