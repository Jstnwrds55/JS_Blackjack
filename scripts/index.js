//
// Blackjack
// by Justin Edwards
//
//

// stored data
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"],
  values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];

// DOM elements
let textArea = document.getElementById("text-area"),
  newGameButton = document.getElementById("new-game-button"),
  hitButton = document.getElementById("hit-button"),
  stayButton = document.getElementById("stay-button"),
  coinsDiv = document.getElementById("coins"),
  dealButton = document.getElementById("deal-button"),
  coinButton = document.getElementsByClassName("coin"),
  availableTag = document.getElementById("available"),
  betTag = document.getElementById("bet"),
  allInButton = document.getElementById("all-in"),
  resetButton = document.getElementById("reset-button"),
  playingPage = document.getElementById("playing-page"),
  bettingPage = document.getElementById("betting-page"),
  dealerPlayingCards = document.getElementById("dealer-playing-cards"),
  playerPlayingCards = document.getElementById("player-playing-cards"),
  playingCard = document.getElementById("dealer-playing-cards").cloneNode(true),
  playerScoreCard = document.getElementById("player-score"),
  dealerScoreCard = document.getElementById("dealer-score");

// Game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    playerBet = 0,
    playerBank = 1000,
    playerEarnings = 0,
    deck = [];

// default values
hitButton.style.display = "none";
stayButton.style.display = "none";
dealButton.style.display = "none";
playingPage.style.display = "none";
bettingPage.style.visibility = "hidden";

// create event listeners for each amount
for (let i = 0; i < 7; i++) {
  coinButton[i].addEventListener("click", function() {

    // temporary variable
    let bet = parseInt(coinButton[i].innerText);

    // only add bet to player bet if they have enough
    if (playerBet + bet <= playerBank) {
        playerBet += bet;
      } 
    updateCoins(); // update coins

  });

}

// new game or next round button is pressed -> moves into betting page
newGameButton.addEventListener("click", function() {

  playerPlayingCards.innerText = "";
  dealerPlayingCards.innerText = "";

  // hide playing page show betting page
  playingPage.style.display = "none";
  bettingPage.style.visibility = "visible";

  // update coins and change button to next round for later
  updateCoins();
  newGameButton.innerText = "Next Round";

  // Show deal button and hide new game button
  dealButton.style.display = "block";
  newGameButton.style.display = "none";
  textArea.innerText = "Place your bet.";

});

// update the coin display
function updateCoins() {

  // loop through all the coins
  for (let i = 0; i < 7; i++) {

    // if the value of the coin is higher than the user's amount, hide it
    if (!((playerBank - playerBet) / parseInt(coinButton[i].textContent) >= 1)) {
      coinButton[i].style.visibility = "hidden";
    } else {
      coinButton[i].style.visibility = "visible";
    }
  }

  // update tags
  availableTag.innerText = "Available: $" + (playerBank - playerBet); 
  betTag.innerText = "Bet: $" + playerBet;

}

// button for resetting bet
resetButton.addEventListener("click", function() {
  playerBet = 0;
  updateCoins();
});

// button for going all in
allInButton.addEventListener("click", function() {
  playerBet = playerBank;
  updateCoins();
});

// button for starting the deal
dealButton.addEventListener("click", function() {

  if (playerBet == 0) {
    textArea.innerText = "Please place a bet more than 0.";
  } else {
    // hide betting page and show playing page
    bettingPage.style.visibility = "hidden";
    playingPage.style.display = "inline-block";

    // hide all buttons for good measure
    for (let i = 0; i < 7; i++) {
      coinButton[i].style.visibility = "hidden";
    }

    // game variables
    gameStarted = true;
    gameOver = false;
    playerWon = false;

    // create deck and shuffle
    deck = createDeck();
    shuffleDeck(deck);

    // give a card to dealer and 2 to player
    dealerCards = [getNextCard()];
    playerCards = [getNextCard(), getNextCard()];

    // update the display to show the dealt cards
    dealerPlayingCards.innerHTML = dealerCards[0].cardDisplay.innerHTML;
    playerPlayingCards.innerHTML = playerCards[0].cardDisplay.innerHTML + playerCards[1].cardDisplay.innerHTML; 

    // update scores and check if player got blackjack
    updateScores();
    if (playerScore === 21) {
      gameOver = true;
      playerWon = true;
      showStatus();
    } else {
      textArea.innerText = "Bet: $" + playerBet;

      // display control
      hitButton.style.display = "inline";
      stayButton.style.display = "inline";
      newGameButton.style.display = "none";
    }
  }

});

// deck creation
function createDeck() {
  let deck = [];  // deck to return

  // loop through suits
  for (let currentSuit in suits) {

    // loop through each value
    for (let currentValue in values) {

      // create card with correct and initial values
      let card = {
        suit: suits[currentSuit],
        suitUnicode: 0,
        value: values[currentValue],
        displayValue: 0,
        score: 0,   // placeholder
        cardDisplay: playingCard
      };

      // assign aces
      if (card.value === "Ace") {
        card.score = 11; // assign 11 as default for aces
      }

      // if the card is 10 or a face card
      else if (currentValue >= 9) {
        card.score = 10;   // assign 10
      } 
      
      // otherwise assign the currentVal + 2
      else {
        card.score = parseInt(currentValue) + 1;
      }

      // assign unicode values to card object
      switch (card.suit) {
        case "Hearts":
          card.suitUnicode = 2665;
          break;
        case "Clubs":
          card.suitUnicode = 2663;
          break;
        case "Diamonds":
          card.suitUnicode = 2666;
          break;
        case "Spades":
          card.suitUnicode = 2660;
          break;
      }

      // assign values to be shown in the visual card representation
      if (card.score == 11) {
          card.displayValue = "A";
      } else if (card.score == 10) {
        if (card.value === "Ten") {
          card.displayValue = 10;
        } else {
          card.displayValue = card.value.charAt(0);
        }
      } else {
        card.displayValue = card.score;
      }

      // call makeCard and assign it's value to the object
      card.cardDisplay = makeCard("&#x" + card.suitUnicode, card.displayValue);
      if (card.suit == "Hearts" | card.suit == "Diamonds") {
        for (let x = 0; x < 5; x++) {
          card.cardDisplay.getElementsByTagName("p")[x].style.color = "#dd0000";
        }
      }

      // push card created onto the deck
      deck.push(card);
    }
  }
  return deck;    // return the deck
}

// shuffle cards
function shuffleDeck(deck) {

  // for each card choose and random index and swap the card
  for (let card in deck) {
    let cardTemp = deck[card];
    let newIndex = Math.trunc(Math.random() * 52);
    deck[card] = deck[newIndex];
    deck[newIndex] = cardTemp;
  }
}

// function for making visual card
function makeCard(suit, value) {

  // temporary card
  let tempCard = playingCard;

  // loop through each corner and assign the right suit
  for (let x = 0; x < 4; x++) {
    tempCard.getElementsByClassName("suit")[x].innerHTML = suit;
  }

  // assign the right value to the card
  tempCard.getElementsByClassName("card-val")[0].innerHTML = value;

  // return the card
  return tempCard.cloneNode(true);
}

// player chooses to hit
hitButton.addEventListener("click", function() {

  // give player another card
  playerCards.push(getNextCard());

  // reset then update new cards display
  playerPlayingCards.innerHTML = "";
  for (let index in playerCards) {
    playerPlayingCards.innerHTML += playerCards[index].cardDisplay.innerHTML;
  }

  // update scores and display
  updateScores();
  // TODO Update the scores on the display

  // player wins 
  if (dealerScore > 21 | playerScore == 21) {
    gameOver = true;
    playerWon = true;
    showStatus();
  } 
  
  // dealer wins
  else if (playerScore > 21)  {
    gameOver = true;
    playerWon = false;
    showStatus();
  }

});

// player stands
stayButton.addEventListener("click", function() {

  // show dealers last card and update/display scores
  while (dealerScore < 21 && !(dealerScore > playerScore)) {
    dealerCards.push(getNextCard());
    dealerPlayingCards.innerHTML = "";
    for (let index in dealerCards) {
      dealerPlayingCards.innerHTML += dealerCards[index].cardDisplay.innerHTML;
    }
    updateScores();
  }

  // if player wins
  if (dealerScore > 21 || playerScore > dealerScore) {
    playerWon = true;
  } 

  // if the dealer wins
  else if (dealerScore > playerScore) {
    playerWon = false;
  }

  gameOver = true;
  showStatus();

});

// remove and return first card on deck
function getNextCard() {
  return deck.shift();
}

// print out the card in readable format
function getCardString(card) {
  return(card.value + " of " + card.suit);
}

// self explanatory
function updateScores() {
  playerScore = newScore(playerCards);
  dealerScore = newScore(dealerCards);
  playerScoreCard.innerText = "Player Score: " + playerScore;
  dealerScoreCard.innerText = "Dealer Score: " + dealerScore;
}

// score update for each deck, called by updateScores()
function newScore(hand) {

  // initialize amount of aces and score to return
  let numAces = 0;
  let score = 0;

  // loop through cards 
  for (let card in hand) {

    // ace in deck
    if (hand[card].value === "Ace") {
      numAces++;
    }
    // add the score in the hand to the total score
    score += hand[card].score;
  }

  // while there's aces in the hand
  while (numAces > 0) {

    // if the score is above 21 and there's an ace, make that ace worth 1
    if (score > 21) {
      score -= 10;
    }
    numAces--;  // decrement amount of aces
  }

  return score;
}

// called when the game is over
function showStatus() {

  if (!gameStarted) {
    textArea.innerText = "Welcome to Blackjack!";
    return;

  // in the case of the game ending
  } else if (gameOver) {

    // tie game
    if (playerScore === dealerScore) {
      textArea.innerText = "Tie game. Give it another go.";
      playerBet = 0;
    }

    // player lost
    else if (!playerWon) { 

      // player exceeded 21
      if (playerScore > 21) {
        textArea.innerText = "You lost $" + playerBet + ". Your score went over 21.";
      } 
      
      // dealer scored higher
      else {
        textArea.innerText = "You lost $" + playerBet + ". The dealer scored higher than you.";
      }

      playerEarnings -= playerBet;
      playerBank -= playerBet;
      playerBet = 0;

    }

    // player won
    else if (playerWon) {

      // player got blackjack
      if (playerScore == 21) {
        textArea.innerText = "Congratulations, you won $" + playerBet + "! You got blackjack!";
        hitButton.style.display = "none";
        stayButton.style.display = "none";
        newGameButton.style.display = "block";
      }

      // dealer busted
      else if (dealerScore > 21) {
        textArea.innerText = "Congratulations, you won $" + playerBet + "! The dealer busted.";
      }

      // player scored higher than dealer
      else if (playerScore > dealerScore) {
        textArea.innerText = "Congratulations, you won + $" + playerBet + "! You scored higher than the dealer.";
      }

      playerEarnings = playerBet;
      playerBank += playerBet;
      playerBet = 0;

    }

    // if the player is out of money
    if (playerBank === 0) {
      textArea.innerText = "Oops, you're out of money! Restart?";
      playerBank = 1000;
      gameStarted = false;
      newGameButton.innerText = "New Game";
    }
    // new game button
      hitButton.style.display = "none";
      stayButton.style.display = "none";
      newGameButton.style.display = "block";

  }
}



