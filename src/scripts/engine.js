const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1Box : document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
    {
    id: 3,
    name: "Obelisk The Tormentor",
    type: "Rock",
    img: `${pathImages}obelisk-the-tormentor.png`,
    WinOf: [2, 5],
    LoseOf: [0, 4],
},
{
    id: 4,
    name: "Slifer The Sky Dragon.",
    type: "Paper",
    img: `${pathImages}slifer-the-sky-dragon.png`,
    WinOf: [1, 3],
    LoseOf: [2, 5],
},
{
    id: 5,
    name: "The Winged Dragon Of Ra.",
    type: "Scissors",
    img: `${pathImages}the-winged-dragon-of-ra.png`,
    WinOf: [0, 4],
    LoseOf: [1, 3],
},










];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });
    }


    return cardImage;
}

async function setCardsField(cardId){
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();
    await showHiddenCardFiledsImages(true);

    await hiddenCardDetails();

    await drawCardsInfield(cardId, computerCardId)



    let duelResults = await checkDuelResults (cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}
async function drawCardsInfield(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFiledsImages(value){
if (value === true) {state.fieldCards.player.style.display = "block";
state.fieldCards.computer.style.display = "block";
}
if(value=== false){
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
}
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore() {
state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win";
        await playAudio("win");
        state.score.playerScore++;
    }
    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "lose";
        await playAudio("lose");
        state.score.computerScore++;
    }
    return duelResults;
}

async function removeAllCardsImages(){
    let computerBox = state.playerSides.computerBox;
    let player1Box = state.playerSides.player1Box;
    let imgElements = computerBox.querySelectorAll("img");
imgElements.forEach((img) => img.remove());


imgElements = player1Box.querySelectorAll("img");
imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    const field = document.getElementById(fieldSide);
    field.innerHTML = ""; // Limpa o campo antes de adicionar cartas
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        field.appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"
    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}
function init() {
showHiddenCardFiledsImages(false)


    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm")
    bgm.play();
}


init();
