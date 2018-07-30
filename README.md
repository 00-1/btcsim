A simple game for multiple players that simulates buying and selling bitcoin.

Runs the following daily:

#### 🌲 *14:00*

Reads the price of bitcoin from the [coindesk API](https://www.coindesk.com/api/).

> All of the day's trades and scores are based on this price.

#### 🌳 *14:00 - 15:00*

Takes one bitcoin buy or sell instruction per player via a [slack bot](https://api.slack.com/).

> Buy with `"buy btc"`, sell with `"sell btc"`. No decimals, all trades are 1 BTC. 

> You can only trade once per day, within the 1 hour window.

#### 🎄 *15:00*

Writes each player's score to [Google sheets](https://developers.google.com/sheets/api/), and to the slack channel. 

> Your score is your total USD plus your total BTC at today's price.


