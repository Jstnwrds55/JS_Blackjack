# JS_Blackjack
BlackJack game made using raw HTML/CSS/Javascript

<h2>Card Display</h2>
There is a separate div in the html for the dealer's cards and the player's cards. Each div contains one playing card as a div to begin with and this will be copied into the Javascript and used to create more cards to display. Display of suits/values is done purely using CSS positioning. When a card is popped off the deck the values are stored in the card object and added to the list of either player or dealer cards. From there, the card information is then copied into the div copied and displayed on the screen. 

<h2>Deck Creation</h2>
The CreateDeck() function loops through the suits and values in the list near the top of the program to create a card for each combination. It assigns the unicode character for the suit based on the suit and the card value in terms of blackjack. After creating the card, it is added to the deck.

<h2>Deck Shuffling/Dealing</h2>
For each card in the deck it chooses a random index in the range of the deck and swaps it. This could lead to a card getting swapped back into place but that's just the nature of cards. Dealing a card is as simple as using shift to remove the card from the deck and adding it to the player or dealer deck.

