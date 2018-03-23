import CategorieItem from './categorie_item.js'
import { singleCategorieData } from './api.js'

class CategorieOverview {

	constructor() {

		this.allData = []
		this.data = []
		this.categorieItems = []

	}

	render() {

		const fragment = document.createDocumentFragment(),
			main = document.createElement( 'main' ),
			ul = document.createElement( 'ul' ),
			div = document.createElement( 'div' )

		ul.classList.add( 'overview' )
		main.appendChild( ul )
		div.classList.add( 'empty' )

		fragment.appendChild( main )
		fragment.appendChild( div )

		/*const reader = new FileReader()

		reader.addEventListener( 'load', function( event ) {

			console.log( event )

		} )

		reader.readAsText( '/overview_items.ejs' )*/

		fetch( '/overview_item.ejs' )
			.then( res => res.text() )
			.then( res => {

				console.log( res )

			} )

		return fragment

	}

	set categorieData( data ) {

		this.allData = data
		this.data = data
		this.renderNewData()

	}

	async renderNewData() {

		const ul = document.querySelector( '.overview' )

		let counter = 0,
			i = 0

		while( counter < 20 ) {

			const el = this.data[ i ]

			try {

				const categorieData = await singleCategorieData( el.type )

				if ( categorieData.length === 0 ) {

					i++
					continue

				}

				const item = new CategorieItem( categorieData[ 0 ], el.count ),
					li = item.renderThumbnail()

				this.categorieItems.push( item )
				ul.appendChild( li )

			} catch ( err ) {

				console.log( err )

			}

			i++
			counter++

		}

	}

}

export default CategorieOverview
