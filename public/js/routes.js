import CategorieOverview from './categorie_overview.js'
import CategorieItem from './categorie_item.js'
import { getCategories, singleCategorieData, singleItemData } from './api.js'

class Routes {

	constructor() {}

	/**
	* @param {String} path		- Path of the current url (window.location.pathname)
	* @param {Boolean} internal	- Depending on whether the page is refreshed or not
	*				 you can load or append an object
	*/
	goTo( path, internal = false ) {

		this.path = path

		const request = {
			paths: this.matchPath( this.path ),
			internal
		}

		if ( !request.paths ) {

			request[ '404' ] = true
			request.paths = {
				go: this.paths[ '*' ]
			}

		}

		if ( this.singleProject ) {

			this.singleProject.stopRendering()
			delete this.singleProject

		}

		request.paths.go( request )

	}

	get paths() {

		return {
			'/': req => {

				const categorieOverview = new CategorieOverview()
				document.body.insertAdjacentHTML( 'beforeend', categorieOverview.render() )

				getCategories( data => {

					categorieOverview.categorieData = data

					/*setTimeout( () => {

						categorieOverview.renderNewData()

					}, 5000 )*/

				} )

			},
			'/c/:categorie': async req => {

				try {
					const categorieData = await singleCategorieData( req.paths.params.categorie ),
						categorieItem = new CategorieItem( categorieData )

					document.body.appendChild( categorieItem.render() )

				} catch ( err ) {

					console.log( err )

				}

			},
			'/c/:categorie/single/:single': async req => {

				try {

					const singleData = await singleItemData( req.paths.params.categorie, req.paths.params.single ),
					singleItem = new CategorieItem( singleData )

					document.body.appendChild( singleItem.renderDetailsPage() )

				} catch ( err ) {

					console.log( err )

				}

			}

		}

	}

	/**
	* @return {function} - Returns the function that belonges to the path
	*/
	matchPath() {

		if ( this.paths[ this.path ] ) {

			return {
				go: this.paths[ this.path ]
			}

		}

		const URLMatches = this.matchURL,
			variableNames = []

		// Resource:
		// http://krasimirtsonev.com/blog/article/deep-dive-into-client-side-routing-navigo-pushstate-hash

		if ( !URLMatches || !URLMatches.includes( ':' ) ) return null

		const route = URLMatches.replace( /([:*])(\w+)/g, ( full, dots, name ) => {

				variableNames.push( name )

				/* eslint-disable no-useless-escape */
				return '([^\/]+)'

			} ) + '(?:\/|$)',
			/* eslint-enable no-useless-escape */
			match = this.path.match( new RegExp( route ) )

		if ( match ) {

			const params = match.slice( 1, match.length )
				.reduce( ( param, value, i ) => {

					// if ( param === null ) param = {}

					param[ variableNames[ i ] ] = value

					return param

				}, {} )

			return {
				go: this.paths[ URLMatches ],
				params
			}

		}

	}

	get matchURL() {

		const { path } = this,
			dashLength = path.match( /\//g || [] ).length, // Count number of /

			allPaths = Object.keys( this.paths ),

			// Filter for links that contain a parameter
			possiblePaths = allPaths.filter( el => el.includes( ':' ) ),

			// Get everything untill the second /
			firstPart = path.substr( 0, path.split( '/', 2 ).join( '/' ).length ),

			// Filter on firstPart
			possibleMatches = possiblePaths.filter( el => el.includes( firstPart ) )
				// Filter on the amount of dashes
				.filter( el => el.match( /\//ig || [] ).length === dashLength )
				// Sort on links that end with an absolute path instead of a parameter
				.sort( ( a, b ) => b.lastIndexOf( '/' ) > b.lastIndexOf( ':' ) )

		if ( possibleMatches.length === 0 ) return null

		return possibleMatches.filter( el => possiblePaths.includes( el ) )[ 0 ]

	}

}

export default Routes
