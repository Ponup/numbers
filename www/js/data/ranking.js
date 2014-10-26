
define({

	LIST_LIMIT: 10,

	scores: [],

	saveScore: function( score )
	{
		this.scores.push( score );
	},

	getScores: function()
	{
		return this.scores.sort( this.scoreSorting ).slice( 0, this.LIST_LIMIT );
	},

	scoreSorting: function( a, b )
	{
		if( a.score < b.score ) return 1;
		if( a.score === b.score ) return 0;
		return -1;
	}
});

