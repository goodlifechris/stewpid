import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

function MontyHallGame() {
  const [doors, setDoors] = useState(["🐐", "🐐", "🚗"].sort(() => Math.random() - 0.5)); // Randomize car and goats
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [revealedDoor, setRevealedDoor] = useState(null);
  const [gameState, setGameState] = useState("pick"); // States: pick, reveal, result
  const [finalChoice, setFinalChoice] = useState(null);
  const [message, setMessage] = useState("Pick a door and trust your instincts!");

  const [score, setScore] = useState({
    cars: 0,
    goats: 0,
    switchWins: 0,
    stickWins: 0,
  });

  useEffect(() => {
    const savedScore = JSON.parse(localStorage.getItem("montyHallScore"));
    if (savedScore) {
      setScore({
        cars: savedScore.cars || 0,
        goats: savedScore.goats || 0,
        switchWins: savedScore.switchWins || 0,
        stickWins: savedScore.stickWins || 0,
      });
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
    setMessage(
      `Door ${revealIndex + 1} has a goat! Will you adapt and switch, or stay the course?`
    );
    setGameState("reveal");
  };

  const handleFinalChoice = (index) => {
    if (gameState !== "reveal") return;
    setFinalChoice(index);

    const isWin = doors[index] === "🚗";
    const didSwitch = index !== selectedDoor;

    setScore((prevScore) => ({
        cars: isWin ? (prevScore.cars || 0) + 1 : prevScore.cars || 0,
        goats: !isWin ? (prevScore.goats || 0) + 1 : prevScore.goats || 0,
        switchWins:
          didSwitch && isWin ? (prevScore.switchWins || 0) + 1 : prevScore.switchWins || 0,
        stickWins:
          !didSwitch && isWin ? (prevScore.stickWins || 0) + 1 : prevScore.stickWins || 0,
      }));

    setMessage(
      isWin
        ? "🎉 Victory! Your decision led to success!"
        : "😞 You got a goat. Every decision builds resilience!"
    );
    setGameState("result");
  };

  const resetGame = () => {
    setDoors(["🐐", "🐐", "🚗"].sort(() => Math.random() - 0.5));
    setSelectedDoor(null);
    setRevealedDoor(null);
    setFinalChoice(null);
    setGameState("pick");
    setMessage("Pick a door and trust your instincts!");
  };

  const isWin = gameState === "result" && doors[finalChoice] === "🚗";

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "'Montserrat', sans-serif",
        background: "#000",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Confetti Effect */}
      {isWin && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <img style={{height:200, width:200}} src="https://drive.google.com/thumbnail?id=1QbKR0AJvkYghk543IknFnxHSXh87AOqx&sz=w1000" alt="W3Schools.com"/>
      <h1 style={{ textTransform: "uppercase", fontWeight: "bold", marginBottom: "10px" }}>
        Monty Hall Game
      </h1>
      <p style={{ fontStyle: "italic", marginBottom: "20px" }}>
        "Life is about choices. Adapt, decide, and thrive."
      </p>

      <div style={{ marginBottom: "20px" }}>
        <h3>Score</h3>
        <p>
          Cars (Wins): <b>{score.cars}</b>
        </p>
        <p>
          Goats (Losses): <b>{score.goats}</b>
        </p>
        <h3>Switch vs Stick Wins</h3>
        <p>
          Wins by Switching: <b>{score.switchWins}</b>
        </p>
        <p>
          Wins by Sticking: <b>{score.stickWins}</b>
        </p>
        <h4 style={{ fontStyle: "italic", marginBottom: "20px" }}>{message}</h4>

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
              gameState === "result" || index === revealedDoor
            }
            style={{
              width: "100px",
              height: "150px",
              fontSize: "18px",
              cursor: gameState === "result" ? "default" : "pointer",
              backgroundColor:
                gameState === "result" && index === finalChoice
                  ? "#444"
                  : index === revealedDoor
                  ? "#666"
                  : "#222",
              color: "#fff",
              border: "2px solid #fff",
              borderRadius: "5px",
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
            backgroundColor: "#fff",
            color: "#000",
            border: "2px solid #000",
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
