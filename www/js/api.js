define( [], function() {

	function Api() {
	}

	Api.saveScore = function( gameName, score ) {
		var params = {
			'game_name': gameName,
			'game_level_number': score.game_level_number,
			'player_name': score.player_name,
			'value': score.value
		};
		fetch('http://api.ponup.com/score/add', {
			method: 'post',
			body: new URLSearchParams(params)
		});
	};

	Api.retrieveScores = function( gameName, limit, callback ) {
		var params = new URLSearchParams({
			'game_name': gameName,
			'limit': limit
		});
		var request = new URL('http://api.ponup.com/score/list');
		request.search = params;
		fetch(request)
			.then(function(response) { return response.json(); })
			.then(callback)
			.catch(function(err) {
				console.error('connection failed', err);
			});
	};

	return Api;

} );
