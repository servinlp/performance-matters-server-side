const express =		require( 'express' ),
      ejs =		require( 'ejs' ),
      app =		express(),
      apiData =		require( './libs/apiData' ),
      compression =	require( 'compression' ),
      helmet =		require( 'helmet' ),
      PORT =		8000

app.set( 'view engine', 'ejs' )
app.set( 'views', './views' )
app.use( express.static( 'public' ) )
app.use( express.static( 'views' ) )

app.use( compression() )
app.use( helmet() )

app.get( '*', ( req, res, next ) => {

	res.locals.allData = apiData
	next()

} )

app.get( '/', ( req, res ) => {

	res.locals.data = apiData

	res.render( 'index' )

} )

app.get( '/c/:categorie', ( req, res ) => {

	const data = apiData.filter( el => el.type === req.params.categorie )[ 0 ]

	res.render( 'categorie', {
		categorie: req.params.categorie,
		data: data.items
	} )

} )

app.get( '/c/:categorie/single/:slug', ( req, res ) => {

	const data = apiData.filter( el => el.type === req.params.categorie )[ 0 ].items
			.filter( el => el.titleSlug === req.params.slug )[ 0 ]

	res.render( 'details', {
		categorie: req.params.categorie,
		data: data
	} )

} )

app.listen( PORT, ( req, res ) => {

	console.log( `You can find me at http://localhost:${ PORT }` )

} )
