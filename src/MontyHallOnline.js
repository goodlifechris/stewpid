import React, { useEffect, useState } from "react";
import { db } from "./firebase"; // Import Firebase Firestore
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // For generating unique game IDs
import { useSearchParams } from "react-router-dom"; // To read game ID from the URL

function MontyHallOnline() {
  const [doors, setDoors] = useState(["🐐", "🐐", "🚗"].sort(() => Math.random() - 0.5));
  const [gameId, setGameId] = useState(null);
  const [playerRole, setPlayerRole] = useState(null); // "host" or "player"
  const [gameState, setGameState] = useState({});
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("gameId");
    if (id) {
      // Player joins existing game
      setGameId(id);
      setPlayerRole("player");
      const unsubscribe = onSnapshot(doc(db, "games", id), (doc) => {
        if (doc.exists()) {
          setGameState(doc.data());
        }
      });
      return () => unsubscribe();
    } else {
      // Host starts a new game
      setGameId(uuidv4());
      setPlayerRole("host");
      setGameState({
        doors: ["🐐", "🐐", "🚗"].sort(() => Math.random() - 0.5),
        selectedDoor: null,
        revealedDoor: null,
        finalChoice: null,
        winner: null,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (playerRole === "host" && gameId) {
      // Save the game state in Firestore
      const saveGame = async () => {
        await setDoc(doc(db, "games", gameId), gameState);
      };
      saveGame();
    }
  }, [gameState, gameId, playerRole]);

  const handlePickDoor = (index) => {
    if (playerRole !== "player" || gameState.revealedDoor !== null) return;
    const revealIndex = gameState.doors.findIndex(
      (door, i) => door === "🐐" && i !== index
    );
    setGameState((prevState) => ({
      ...prevState,
      selectedDoor: index,
      revealedDoor: revealIndex,
    }));
    setMessage(`Door ${revealIndex + 1} has a goat! Do you want to switch?`);
  };

  const handleFinalChoice = (index) => {
    if (playerRole !== "player" || gameState.finalChoice !== null) return;
    const winner = gameState.doors[index] === "🚗" ? "player" : "host";
    setGameState((prevState) => ({
      ...prevState,
      finalChoice: index,
      winner,
    }));
    setMessage(
      winner === "player"
        ? "🎉 Congratulations! You found the car!"
        : "😞 Oops! You got a goat."
    );
  };

  const resetGame = () => {
    const newDoors = ["🐐", "🐐", "🚗"].sort(() => Math.random() - 0.5);
    setGameState({
      doors: newDoors,
      selectedDoor: null,
      revealedDoor: null,
      finalChoice: null,
      winner: null,
    });
    setMessage("");
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>Monty Hall Game</h1>
      {playerRole === "host" && (
        <p>
          Share this link with your friend:{" "}
          <a href={`?gameId=${gameId}`}>{window.location.href}?gameId={gameId}</a>
        </p>
      )}
      <p>{message || "Pick a door!"}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        {gameState.doors &&
          gameState.doors.map((door, index) => (
            <button
              key={index}
              onClick={() =>
                gameState.finalChoice === null
                  ? handlePickDoor(index)
                  : handleFinalChoice(index)
              }
              disabled={
                gameState.revealedDoor === index ||
                (gameState.finalChoice !== null && index !== gameState.finalChoice)
              }
              style={{
                width: "100px",
                height: "150px",
                fontSize: "18px",
                cursor: gameState.finalChoice === null ? "pointer" : "default",
                backgroundColor:
                  gameState.revealedDoor === index || gameState.finalChoice === index
                    ? "#d3d3d3"
                    : "#007BFF",
                color: "#fff",
                border: "2px solid black",
                borderRadius: "5px",
                position: "relative",
              }}
            >
              {gameState.finalChoice !== null ||
              gameState.revealedDoor === index ? (
                <span style={{ fontSize: "36px" }}>{door}</span>
              ) : (
                `Door ${index + 1}`
              )}
            </button>
          ))}
      </div>
      {gameState.finalChoice !== null && playerRole === "host" && (
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
          Start New Game
        </button>
      )}
    </div>
  );
}

export default MontyHallOnline;
