


class RpslsGame { // rock-paper-scissors-whale-slackbot
	
	constructor(p1, p2) { // these will be the sockets
		this._players = [p1, p2]; //private var //todo: maybe change to unlimited players?
		this._turns = [null, null];
		this._scores = [0, 0];
		this._scoreToWin = 2;
		// this._winList = [null, null]; // set up with predefined indices fr potential parallelism in the future
		

		this._computerTurns = ["rock", "paper", "scissors", "whale", "slackbot"]; //todo: make this a class var?

		this._sendToPlayers('message', '🪨 Rock 🪨 - 📄 Paper 📄 - ✂️ Scissors ✂️ - 🐳 Whale 🐳 - 🤖 Slackbot 🤖 - Match Starts!');

		this._players.forEach((player, idx) => {
			player.on('turn', (turn) => {
				this._onTurn(idx, turn);
			});
		});
	}

	_sendToPlayers(eventType, msg) {
		this._players.forEach((player) => {
			player.emit(eventType, msg);
		});
	}

	_sendToSinglePlayer(playerIndex, eventType, msg) {
		this._players[playerIndex].emit(eventType, msg);
	}

	_onTurn(playerIndex, turn) {
		if (this._turns[playerIndex]) {
			this._sendToSinglePlayer(playerIndex, 'message', `You've already selected ${turn}! Please wait for your opponents to play!`);
		} else {
			this._turns[playerIndex] = turn;
			this._sendToSinglePlayer(playerIndex, 'message', `You selected ${turn}`);
			this._checkGameOver();
		}
	}

	_checkWinner() {
		let maxElem = -Infinity;
	    let maxIndices = [];
	    let win = false;

	    for (let i = 0; i < this._scores.length; i++) {
	        if (this._scores[i] === maxElem) {
	          maxIndices.push(i+1);
	        } else if (this._scores[i] > maxElem) {
	            maxIndices = [i+1];
	            maxElem = this._scores[i];
	            if (this._scoreToWin <= maxElem) {
	            	win = true;
	            }
	        }
	    }
	    return [maxIndices, win]; // the players with highest score
	}

	_updateScores() {
		this._sendToPlayers('score', `newScores`);
		this._scores.forEach((elem, ind) => {
			this._sendToPlayers('score', `Player ${ind + 1}: ${elem} points\n`);
		});
	}

	_checkGameOver() {
		const turns = this._turns;

		if (turns[0] && turns[1]) {
			this._computerTurn = this._getComputerTurn();

			

			this._getGameResult();
			//todo: scores on another div
			this._updateScores();
			


			//todo: check if winning score and then reset
			let winArr = this._checkWinner();
			let winners = winArr[0];
			let isWin = winArr[1];
			if (isWin) {
				this._sendToPlayers('message', 'Game over! Player ' + winners.join(" & ") + " win!");
				this._sendToPlayers('message', 'Next Game!');
				this._scores = [0, 0];
				this._updateScores();
			}

			
			this._turns = [null, null];

			

		}
	}

	_changeScore(arr, scoreChange) {
		arr.forEach((ind) => {this._scores[ind - 1] += scoreChange;});
	}

	_getGameResult() {
		//todo: compare with computer turn

		let _playersWithRock = [];
		let _playersWithPaper = [];
		let _playersWithScissors = [];
		let _playersWithWhale = [];
		let _playersWithSlackbot = [];

		this._turns.forEach((turn, ind) => {
			switch(turn) {
				case 'rock':
					_playersWithRock.push(ind+1);
					break;
				case 'paper':
					_playersWithPaper.push(ind+1);
					break;
				case 'scissors':
					_playersWithScissors.push(ind+1);
					break;
				case 'whale': // whale
					_playersWithWhale.push(ind+1);
					break;
				case 'slackbot': // slackbot
					_playersWithSlackbot.push(ind+1);
					break;
				default:
					throw new Error(`Could not decode ${turn}`);
				}

			}
		);
		let turn;


//todo" handle turn make it item

		switch(this._computerTurn){
			case 'rock':
				if (_playersWithPaper.length){
					turn = this._computerTurns[1];
					this._sendToPlayers('message', '+1! Player ' + _playersWithPaper.join(' & ') + `'s ${turn} covers Upsilon's ${this._computerTurn}!`);
					this._changeScore(_playersWithPaper, 1);
				}
				if (_playersWithSlackbot.length){
					turn = this._computerTurns[4];
					this._sendToPlayers('message', '+1! Player ' + _playersWithSlackbot.join(' & ') + `'s ${turn} vaporizes Upsilon's ${this._computerTurn}!`);
					this._changeScore(_playersWithSlackbot, 1);
				}
				if (_playersWithRock.length){
					turn = this._computerTurns[0];
					this._sendToPlayers('message', 'Draw! Player ' + _playersWithRock.join(' & ') + ` chose ${turn}, an equal match for Upsilon's ${this._computerTurn}`);
				}

				if (_playersWithScissors.length){
					turn = this._computerTurns[2];
					this._sendToPlayers('message', `Oh no! Upsilon's ${this._computerTurn} crushes player ` + _playersWithScissors.join(' & ') + `'s ${turn}!`);
					this._changeScore(_playersWithScissors, -1);
				}

				if (_playersWithWhale.length){
					turn = this._computerTurns[3];
					this._sendToPlayers('message', `Oh no! Upsilon's ${this._computerTurn} crushes player ` + _playersWithWhale.join(' & ') + `'s ${turn}!`);
					this._changeScore(_playersWithWhale, -1);
				}
				break;

				
			case 'paper':
				if (_playersWithScissors.length){
					turn = this._computerTurns[2];
					this._sendToPlayers('message', '+1! Player ' + _playersWithScissors.join(' & ') + `'s ${turn} cuts Upsilon's ${this._computerTurn}!`);
					this._changeScore(_playersWithScissors, 1);
				}

				if (_playersWithWhale.length){
					turn = this._computerTurns[3];
					this._sendToPlayers('message', '+1! Player ' + _playersWithWhale.join(' & ') + `'s ${turn} eats Upsilon's ${this._computerTurn}!`);
					this._changeScore(_playersWithWhale, 1);
				}
				if (_playersWithPaper.length){
					turn = this._computerTurns[1];
					this._sendToPlayers('message', 'Draw! Player ' + _playersWithPaper.join(' & ') + ` chose ${turn}, an equal match for Upsilon's ${this._computerTurn}`);
				
				}
				if (_playersWithSlackbot.length){
					turn = this._computerTurns[4];
					this._sendToPlayers('message',`Oh no! Upsilon's ${this._computerTurn} disproves player ` + _playersWithSlackbot.join(' & ') + `'s ${turn}!`);
					this._changeScore(_playersWithSlackbot, -1);
				}
				if (_playersWithRock.length){
					turn = this._computerTurns[0];
					this._sendToPlayers('message', `Oh no! Upsilon's ${this._computerTurn} covers player ` + _playersWithRock.join(' & ') + `'s ${turn}!`);
					this._changeScore(_playersWithRock, -1);
				}

				
				break;
			case 'scissors':
				if (_playersWithSlackbot.length){
					turn = this._computerTurns[4];
					this._sendToPlayers('message', '+1! Player ' + _playersWithSlackbot.join(' & ') + `'s ${turn} smashes Upsilon's ${this._computerTurn}!`);
					this._changeScore(_playersWithSlackbot, 1);
				}
				
				if (_playersWithWhale.length){
					turn = this._computerTurns[3];
					this._sendToPlayers('message', '+1! Player ' + _playersWithWhale.join(' & ') + `'s ${turn} decapitates Upsilon's ${this._computerTurn}!`);
					this._changeScore(_playersWithWhale, 1);
				}
				
				if (_playersWithScissors.length){
					turn = this._computerTurns[2];
					this._sendToPlayers('message', 'Draw! Player ' + _playersWithScissors.join(' & ') + ` chose ${turn}, an equal match for Upsilon's ${this._computerTurn}`);
				
				}

				if (_playersWithPaper.length){
					turn = this._computerTurns[1];
					this._sendToPlayers('message', `Oh no! Upsilon's ${this._computerTurn} cuts player ` + _playersWithPaper.join(' & ') + `'s ${turn}!`);
					this._changeScore(_playersWithPaper, -1);
				}

				if (_playersWithRock.length){
					turn = this._computerTurns[0];
					this._sendToPlayers('message', `Oh no! Upsilon's ${this._computerTurn} crushes player ` + _playersWithRock.join(' & ') + `'s ${turn}!`);
					this._changeScore(_playersWithRock, -1);
				}

				
				break;
			case 'whale':
				if (_playersWithPaper.length){
					turn = this._computerTurns[1];
					this._sendToPlayers('message', '+1! Player ' + _playersWithPaper.join(' & ') + `'s ${turn} eats Upsilon's ${this._computerTurn}!`);
					this._changeScore(_playersWithPaper, 1);
				}
				if (_playersWithSlackbot.length){
					turn = this._computerTurns[4];
					this._sendToPlayers('message', '+1! Player ' + _playersWithSlackbot.join(' & ') + `'s ${turn} poisons Upsilon's ${this._computerTurn}!`);
					this._changeScore(_playersWithSlackbot, 1);
				}

				if (_playersWithWhale.length){
					turn = this._computerTurns[3];
					this._sendToPlayers('message', 'Draw! Player ' + _playersWithWhale.join(' & ') + ` chose ${turn}, an equal match for Upsilon's ${this._computerTurn}`);
				
				}
				
				if (_playersWithRock.length){
					turn = this._computerTurns[0];
					this._sendToPlayers('message', `Oh no! Upsilon's ${this._computerTurn} crushes player ` + _playersWithRock.join(' & ') + `'s ${turn}!`);
					this._changeScore(_playersWithRock, -1);
				}

				if (_playersWithScissors.length){
					turn = this._computerTurns[2];
					this._sendToPlayers('message', `Oh no! Upsilon's ${this._computerTurn} decapitates player ` + _playersWithScissors.join(' & ') + `'s ${turn}!`);
					this._changeScore(_playersWithScissors, -1);
				}

				
				break;
			case 'slackbot':

				
				if (_playersWithRock.length){
					turn = this._computerTurns[0];
					this._sendToPlayers('message',  '+1! Player ' + _playersWithRock.join(' & ') + `'s ${turn} vaporizes Upsilon's ${this._computerTurn}!`);
					this._changeScore(_playersWithRock, 1);
				}

				if (_playersWithScissors.length){
					turn = this._computerTurns[2];
					this._sendToPlayers('message', '+1! Player ' + _playersWithScissors.join(' & ') + `'s ${turn} smashes Upsilon's ${this._computerTurn}!`);
					this._changeScore(_playersWithScissors, 1);
				}
				if (_playersWithSlackbot.length){
					turn = this._computerTurns[4];
					this._sendToPlayers('message', 'Draw! Player ' + _playersWithSlackbot.join(' & ') + ` chose ${turn}, an equal match for Upsilon's ${this._computerTurn}`);
				
				}
				
				if (_playersWithPaper.length){
					turn = this._computerTurns[1];
					this._sendToPlayers('message', `Oh no! Upsilon's ${this._computerTurn} disproves player ` + _playersWithPaper.join(' & ') + `'s ${turn}!`);
					this._changeScore(_playersWithPaper, -1);
				}
				if (_playersWithWhale.length){
					turn = this._computerTurns[3];
					this._sendToPlayers('message', `Oh no! Upsilon's ${this._computerTurn} poisons player ` + _playersWithWhale.join(' & ') + `'s ${turn}!`);
					this._changeScore(_playersWithWhale, -1);
				}
				break;
			default:
				throw new Error(`Could not decode turn ${turn}`);

		}

	}

	_sendWinLoseMsg(winner, loser) {
		winner.emit('message', 'You won!');
		loser.emit('message', 'You lose :( ');
	}

	_decodeTurn(turn) {
		switch(turn) {
			case 'rock':
				return 0;
			case 'paper':
				return 1;
			case 'scissors':
				return 2;
			default:
				throw new Error(`Could not decode turn ${turn}`);

		}
	}

	_getRandomInt(max_len) {
  		return Math.floor(Math.random() * max_len);
	}

	_getComputerTurn(){
		return this._computerTurns[this._getRandomInt(this._computerTurns.length)];
	}


	
	
}



module.exports = RpslsGame;
