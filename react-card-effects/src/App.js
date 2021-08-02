import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cards from "./Cards";
import "./App.css"

function App() {
  const [deckId, setDeckId] = useState(null);
  const [showDraw, setShowDraw] = useState(true)
  const [cards, setCards] = useState([]);
  const timerId = useRef();

  useEffect(() => {
    axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(res => {
      setDeckId(res.data.deck_id);
    });
  }, []);

  function handleDrawToggle() {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
    else {
      timerId.current = setInterval(() => {
        axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`).then(res => {
          setCards(c => [...c, {
            image: res.data.cards[0].image,
            code: res.data.cards[0].code,
            offsetX: Math.floor(Math.random() * 41) - 20,
            offsetY: Math.floor(Math.random() * 41) - 20,
            rotation: Math.floor(Math.random() * 41) - 20
          }]);
          if (res.data.remaining === 0) {
            setShowDraw(false);
            clearInterval(timerId.current);
            timerId.current = null;
            alert("Error: no cards remaining!");
          }
        });
      }, 1000);
    }
  }

  function handleShuffle() {
    axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`).then(res => {
      setCards([]);
      setShowDraw(true);
    });
  }

  return (
    <>
      {showDraw && <button className="draw" onClick={handleDrawToggle}>{timerId.current ? "Stop" : "Start"} drawing</button>}
      {!showDraw && <button className="shuffle" onClick={handleShuffle}>Shuffle</button>}
      <div>
        {cards.map(c => <Cards {...c} key={c.code} />)}
      </div>
    </>
  );
}

export default App;
