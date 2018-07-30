> A simple game for multiple players that simulates buying and selling bitcoin.

Runs daily:

### 🌲 *14:00*

Reads the price of bitcoin from the [coindesk API](https://www.coindesk.com/api/).

### 🌳 *14:00 - 15:00*

Takes one bitcoin buy or sell instruction per player via a [slack bot](https://api.slack.com/).

### 🎄 *15:00*

Writes each player's score to [Google sheets](https://developers.google.com/sheets/api/), and to the slack channel. 
