
define( [ 'jquery', 'config' ], function( $, config ) {

	function Brick()
	{
		this.counted = false;
		this.index = null;
	}

	Brick.prototype.setIndex = function( index )
	{
		this.index = index;
	};

	Brick.prototype.getIndex = function()
	{
		return this.index;
	};

	Brick.prototype.setValue = function( value )
	{
		this.value = value;
	};

	Brick.prototype.getValue = function()
	{
		return this.value;
	};

	Brick.prototype.setGridLocation = function( x, y )
	{
		this.x = x;
		this.y = y;
	};

	Brick.prototype.toHtmlNode = function()
	{
		var htmlNode = document.createElement( 'div' );
		htmlNode.id = this.getId();
		htmlNode.className = 'brick';
		htmlNode.innerText = this.value;

		if( this.value in config.specialBrickStyles )
		{
			$( htmlNode ).css( config.specialBrickStyles[ this.value ] );
		}
		else
		{
			$( htmlNode ).css( config.brickStyles[ this.value ] );
		}

		htmlNode.style.lineHeight = config.brickSize + 'px';
		htmlNode.style.width = config.brickSize + 'px';
		htmlNode.style.height = config.brickSize + 'px';
		htmlNode.style.left = ( this.x * config.brickSize ) + 'px';
		htmlNode.style.top = ( this.y * config.brickSize ) + 'px';
		return htmlNode;
	};

	Brick.prototype.remove = function()
	{
		var htmlNode = document.getElementById( this.getId() ),
		    $htmlNode = $( htmlNode );

		// @todo optimise this for mobile!
		$htmlNode.fadeOut( 200, function() { $( this ).remove(); } );
	};

	Brick.prototype.getId = function()
	{
		return 'brick_' + this.index;
	};

	return Brick;
});

