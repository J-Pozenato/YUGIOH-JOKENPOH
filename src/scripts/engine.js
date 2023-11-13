const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
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
    playerSide: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),

    },
    actions: {
        button: document.getElementById("next-duel"),
    },
}



const pathCards = "./src/assets/icons/"

const cardData = [
    {
        id:0,
        name: "Bue Eyes White Dragon",
        type: "Paper",
        img: `${pathCards}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathCards}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathCards}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    // console.log(randomIndex)
    return cardData[randomIndex].id
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src",`${pathCards}card-back.png`)
    cardImage.setAttribute("data-id", idCard)
    cardImage.classList.add("card")

    if(fieldSide === state.playerSide.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        })

        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(idCard)
        })
    }



    return cardImage

}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)
    
        // console.log(cardImage)
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img
    state.cardSprites.name.innerText = cardData[index].name
    state.cardSprites.type.innerText = "Atribute :" + cardData[index].type
}


async function setCardsField(cardId) {
    await removeAllCardsImages()

    let computerCardId = await getRandomCardId()

    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"

    await hiddenCardDetails()

    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore()
    await drawButton(duelResults)

}

async function hiddenCardDetails() {
    state.cardSprites.name.innerText = ""
    state.cardSprites.type.innerText = ""
    state.cardSprites.avatar.src = ""
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw"
    let playerCard = cardData[playerCardId]

    if(playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win"
        state.score.playerScore++
    } else if(playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "lose"
        state.score.computerScore++


    }

    await playAudio(duelResults)

    return duelResults
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text) {
    state.actions.button.innerText = text
    state.actions.button.style.display = "block"
}

async function resetDuel() {
    state.cardSprites.avatar.src = ""
    state.actions.button.style.display = "none"

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    init()

}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    
    try
    {
        audio.play()
    } catch {}
}

async function removeAllCardsImages() {
    let cards = state.playerSide.computerBOX
    let imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    cards = state.playerSide.player1BOX
    imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())
}

function init() {
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"
    drawCards(5, state.playerSide.player1)
    drawCards(5, state.playerSide.computer)

    const bgm = document.getElementById("bgm")
    bgm.play()
}

init()
