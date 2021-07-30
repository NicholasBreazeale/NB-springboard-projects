import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Box from "./Box";
import NewBoxForm from "./NewBoxForm";

function BoxList() {
  const [boxes, setBoxes] = useState([]);

  function addBox({ color, width, height }) {
    setBoxes(bx => [...bx, {id: uuidv4(), color, width, height}]);
  }

  function removeBox(id) {
    setBoxes(boxes.filter(b => b.id !== id));
  }

  return (
    <>
      <NewBoxForm addBox={addBox} />
      <div data-testid="box-list">
        {boxes.map(b => 
          <Box backgroundColor={b.color} width={`${b.width}px`} height={`${b.height}px`} removeBox={() => removeBox(b.id)} key={b.id} />
        )}
      </div>
    </>
  );
}

export default BoxList;
