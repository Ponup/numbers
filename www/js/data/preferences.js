
define({

	hasProperty: function( name )
	{
		return ( null !== localStorage.getItem( name ) );
	},

	getBooleanProperty: function( name )
	{
		return ( '1' === localStorage.getItem( name ) );
	},

	setBooleanProperty: function( name, value )
	{
		localStorage.setItem( name, value ? '1' : '0' );
	},

	isMusicEnabled: function()
	{
		return this.isEnabled( 'musicEnabled' );
	},

	isSoundEnabled: function()
	{
		return this.isEnabled( 'soundEnabled' );
	},

	isEnabled: function( name )
	{
		return !this.hasProperty( name ) || this.getBooleanProperty( name );
	}
});
