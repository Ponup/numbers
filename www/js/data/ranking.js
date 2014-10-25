
define({

	scores: [],

	saveScore: function( score )
	{
		this.scores.push( score );
	},

	getScores: function()
	{
		return this.scores;
	}
});

