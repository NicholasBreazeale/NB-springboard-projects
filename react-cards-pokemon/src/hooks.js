import { useState } from "react";

function useFlip() {
  const [isFacingUp, setIsFacingUp] = useState(true);
  const flipCard = () => {
    setIsFacingUp(isUp => !isUp);
  };

  return [isFacingUp, flipCard];
}

export default useFlip;
