import React, { useState, useEffect } from "react";

function MontyHallGame() {
  const [doors, setDoors] = useState(["🐐", "🐐", "🚗"].sort(() => Math.random() - 0.5)); // Randomize car and goats
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [revealedDoor, setRevealedDoor] = useState(null);
  const [gameState, setGameState] = useState("pick"); // States: pick, reveal, result
  const [finalChoice, setFinalChoice] = useState(null);
  const [message, setMessage] = useState("Pick a door!");

  const [score, setScore] = useState({
    cars: 0,
    goats: 0,
  });

  // Load score from localStorage on initial render
  useEffect(() => {
    const savedScore = JSON.parse(localStorage.getItem("montyHallScore"));
    if (savedScore) {
      setScore(savedScore);
    }
  }, []);

  // Save score to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("montyHallScore", JSON.stringify(score));
  }, [score]);

  const probabilities = {
    stick: "33.33%", // Probability of winning if the user sticks
    switch: "66.67%", // Probability of winning if the user switches
  };

  const handlePickDoor = (index) => {
    if (gameState !== "pick") return;
    setSelectedDoor(index);

    // Host reveals a goat behind an unselected door
    const revealIndex = doors.findIndex(
      (door, i) => door === "🐐" && i !== index
    );
    setRevealedDoor(revealIndex);
    setMessage(`Door ${revealIndex + 1} has a goat! Do you want to switch?`);
    setGameState("reveal");
  };

  const handleFinalChoice = (index) => {
    if (gameState !== "reveal") return;
    setFinalChoice(index);

    const isWin = doors[index] === "🚗";
    setScore((prevScore) => ({
      cars: isWin ? prevScore.cars + 1 : prevScore.cars,
      goats: !isWin ? prevScore.goats + 1 : prevScore.goats,
    }));

    setMessage(
      isWin
        ? "🎉 Congratulations! You found the car!"
        : "😞 Oops! You got a goat."
    );
    setGameState("result");
  };

  const resetGame = () => {
    setDoors(["🐐", "🐐", "🚗"].sort(() => Math.random() - 0.5));
    setSelectedDoor(null);
    setRevealedDoor(null);
    setFinalChoice(null);
    setGameState("pick");
    setMessage("Pick a door!");
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>Monty Hall Game</h1>
      <p>{message}</p>
      <div style={{ marginBottom: "20px" }}>
        <h3>Score</h3>
        <p>
          Cars (Wins): <b>{score.cars}</b>
        </p>
        <p>
          Goats (Losses): <b>{score.goats}</b>
        </p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        {doors.map((door, index) => (
          <button
            key={index}
            onClick={() =>
              gameState === "pick"
                ? handlePickDoor(index)
                : gameState === "reveal" && handleFinalChoice(index)
            }
            disabled={
              gameState === "result" || index === revealedDoor || (gameState === "reveal" && index === selectedDoor)
            }
            style={{
              width: "100px",
              height: "150px",
              fontSize: "18px",
              cursor: gameState === "result" ? "default" : "pointer",
              backgroundColor:
                gameState === "result" && index === finalChoice
                  ? "#d3d3d3"
                  : index === revealedDoor
                  ? "#ccc"
                  : "#007BFF",
              color: "#fff",
              border: "2px solid black",
              borderRadius: "5px",
              position: "relative",
            }}
          >
            {/* Show door content only after the game ends */}
            {gameState === "result" ? (
              <div>
                <span style={{ fontSize: "36px" }}>{doors[index]}</span>
                <br />
                <small>Door {index + 1}</small>
              </div>
            ) : gameState === "reveal" && index === revealedDoor ? (
              <div>
                <span style={{ fontSize: "36px" }}>{doors[index]}</span>
                <br />
                <small>Door {index + 1}</small>
              </div>
            ) : (
              `Door ${index + 1}`
            )}
          </button>
        ))}
      </div>
      {gameState === "reveal" && (
        <div style={{ marginTop: "20px" }}>
          <h3>Chances:</h3>
          <p>
            Sticking with your choice: <b>{probabilities.stick}</b>
          </p>
          <p>
            Switching your choice: <b>{probabilities.switch}</b>
          </p>
        </div>
      )}
      {gameState === "result" && (
        <button
          onClick={resetGame}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#28A745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Play Again
        </button>
      )}
    </div>
  );
}

export default MontyHallGame;
