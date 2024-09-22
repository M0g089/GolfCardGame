const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Card {
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }

  getScore() {
    if (this.value === 7) return 0;
    if (this.value === 'J') return -1;
    if (this.value === 'Q') return 12;
    if (this.value === 'K') return 13;
    return this.value; 
  }

  toString() {
    return `${this.value} of ${this.suit}`;
  }
}

const createDeck = () => {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
  const deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push(new Card(value, suit));
    });
  });
  return deck;
};

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};


class Player {
  constructor(name) {
    this.name = name;
    this.hand = [];
  }

  addCard(card) {
    this.hand.push(card);
  }

  replaceCard(index, card) {
    const replacedCard = this.hand[index];
    this.hand[index] = card;
    return replacedCard;
  }

  getScore() {
    return this.hand.reduce((acc, card) => acc + card.getScore(), 0);
  }

  displayHand() {
    return this.hand.map(card => card.toString()).join(', ');
  }
}

const startGame = () => {
  const deck = shuffleDeck(createDeck());
  const discardPile = [];

  
  const player1 = new Player('Player 1');
  const player2 = new Player('Player 2');
  const players = [player1, player2];

  
  for (let i = 0; i < 4; i++) {
    player1.addCard(deck.pop());
    player2.addCard(deck.pop());
  }

  discardPile.push(deck.pop());

  let currentPlayerIndex = 0;

  const takeTurn = () => {
    const currentPlayer = players[currentPlayerIndex];

    console.log(`\nIt's ${currentPlayer.name}'s turn.`);
    console.log(`${currentPlayer.name}'s hand: ${currentPlayer.displayHand()}`);
    console.log(`Top of discard pile: ${discardPile[discardPile.length - 1].toString()}`);

    rl.question('Draw from deck (D) or discard pile (P)? ', (action) => {
      let drawnCard;
      if (action.toLowerCase() === 'd') {
        drawnCard = deck.pop();
        console.log(`You drew: ${drawnCard.toString()}`);
      } else {
        drawnCard = discardPile.pop();
        console.log(`You took from discard pile: ${drawnCard.toString()}`);
      }

      rl.question('Replace which card (0-3)? ', (index) => {
        const replacedCard = currentPlayer.replaceCard(parseInt(index), drawnCard);
        discardPile.push(replacedCard);
        console.log(`Replaced ${replacedCard.toString()} with ${drawnCard.toString()}`);
        currentPlayerIndex = (currentPlayerIndex + 1) % 2; // Switch to the next player

        if (deck.length === 0 || players.some(player => player.hand.every(card => card))) {
          endGame();
        } else {
          takeTurn();
        }
      });
    });
  };

  const endGame = () => {
    rl.close();
    console.log('\nGame Over!');
    console.log(`${player1.name}'s score: ${player1.getScore()}`);
    console.log(`${player2.name}'s score: ${player2.getScore()}`);

    const winner = player1.getScore() < player2.getScore() ? player1 : player2;
    console.log(`${winner.name} wins!`);
  };

  takeTurn();
};

startGame();