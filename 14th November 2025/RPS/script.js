let userScore = 0;
let compScore = 0;
let rounds = 0;

document.getElementById("playBtn").addEventListener("click", playRound);

function playRound() {
    if (rounds >= 5) {
        document.getElementById("message").innerText =
            "Game Over! Refresh to play again.";
        return;
    }

    let userChoice = prompt("Choose R, P, or S").toUpperCase();
    if (!["R", "P", "S"].includes(userChoice)) {
        alert("Invalid input! Choose R, P, or S.");
        return;
    }

    const options = ["R", "P", "S"];
    let compChoice = options[Math.floor(Math.random() * 3)];

    let result = "";

    if (userChoice === compChoice) {
        result = `Tie! Both chose ${userChoice}.`;
    } else if (
        (userChoice === "R" && compChoice === "S") ||
        (userChoice === "P" && compChoice === "R") ||
        (userChoice === "S" && compChoice === "P")
    ) {
        userScore++;
        result = `You win! ${userChoice} beats ${compChoice}.`;
    } else {
        compScore++;
        result = `Computer wins! ${compChoice} beats ${userChoice}.`;
    }

    rounds++;

    document.getElementById("userScore").innerText = "Score: " + userScore;
    document.getElementById("compScore").innerText = "Score: " + compScore;
    document.getElementById("message").innerText =
        result + ` (Round ${rounds}/5)`;

    if (rounds === 5) {
        let finalMsg = "";
        if (userScore > compScore) finalMsg = "Final Result: YOU WIN!";
        else if (compScore > userScore) finalMsg = "Final Result: COMPUTER WINS!";
        else finalMsg = "Final Result: IT'S A TIE!";

        document.getElementById("message").innerText += "\n" + finalMsg;
    }
}
