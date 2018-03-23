const express =		require( 'express' ),
      ejs =		require( 'ejs' ),
      app =		express(),
      apiData =		require( './libs/apiData' ),
      PORT =		8000

app.set( 'view engine', 'ejs' )
app.set( 'views', './views' )
app.use( express.static( 'public' ) )
app.use( express.static( 'views' ) )

app.get( '/', ( req, res ) => {

	res.locals.data = apiData

	res.render( 'index' )

} )

app.get( '/c/:categorie', ( req, res ) => {

	console.log( req.params.categorie )
	res.render( 'categorie' )

} )

app.listen( PORT, ( req, res ) => {

	console.log( `You can find me at http://localhost:${ PORT }` )

} )
