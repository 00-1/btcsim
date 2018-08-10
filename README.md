A simple slack bot game for multiple players that simulates buying and selling bitcoin.

#### 🌲

Reads the price of bitcoin from the [coindesk API](https://www.coindesk.com/api/).

> All of the day's trades and scores are based on this price.

#### 🌳 

Takes buy or sell instructions via a [slack bot](https://api.slack.com/).

> Buy with `"@btc buy"`, sell with `"@btc sell"`. No decimals, all trades are 1 BTC. 

> Check the score with `"@btc score"` or view a detailed history with `"@btc history"`

#### 🎄

Writes each player's transactions and score to [Google sheets](https://developers.google.com/sheets/api/).

> A player's score is their total USD plus their total BTC at today's price.

