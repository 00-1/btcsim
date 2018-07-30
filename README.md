A simple game for multiple players that simulates buying and selling bitcoin.

Runs the following daily:

#### *🌲 1400* 

Reads the price of bitcoin from the [coindesk API](https://www.coindesk.com/api/).

> All of the day's trades and scores are based on this price.

#### *🌳 1400—1500* 

Takes one buy or sell instruction per player via a [slack bot](https://api.slack.com/).

> Buy with `"buy btc"`, sell with `"sell btc"`. No decimals, all trades are 1 BTC. 

> Players can only trade once per day, within the 1 hour window.

#### *🎄 1500* 

Writes each player's score to [Google sheets](https://developers.google.com/sheets/api/), and to the slack channel. 

> A player's score is their total USD plus their total BTC at today's price.

#### *🌴 0000—2359* 

The slack bot had commands:

- `btc sim score`: Lists player's scores
- `btc sim history`: Prints a detailed history of the last 10 days of the game

