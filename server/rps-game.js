


class RpsGame {
	



	constructor(p1, p2) { // these will be the sockets
		this._players = [p1, p2]; //private var
		this._turns = [null, null];
		
		this._sendToPlayers('message', 'Rock Paper Scissors Match Starts!');

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
		this._turns[playerIndex] = turn;
		this._sendToSinglePlayer(playerIndex, 'message', `You selected ${turn}`);
		this._checkGameOver();

	}

	_checkGameOver() {
		const turns = this._turns;

		if (turns[0] && turns[1]) {
			this._sendToPlayers('message', 'Game over ' + turns.join(' : '));
			this._getGameResult();
			this._turns = [null, null];
			this._sendToPlayers('message', 'Next round!');

		}
	}


	_getGameResult() {
		const winDist = (this._decodeTurn(this._turns[0]) - this._decodeTurn(this._turns[1]) + 3) % 3;

		switch(winDist){
			case 0:
				this._sendToPlayers('message', "draw");
				break;
			case 1:
				this._sendWinLoseMsg(this._players[0], this._players[1]);
				break;
			case 2:
				this._sendWinLoseMsg(this._players[1], this._players[0]);
				break;
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

	
}



module.exports = RpsGame;
