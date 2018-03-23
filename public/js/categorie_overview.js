import CategorieItem from './categorie_item.js'
import { singleCategorieData } from './api.js'

class CategorieOverview {

	constructor() {

		this.allData = []
		this.data = []
		this.categorieItems = []

	}

	render() {

		return `
			<header>
				<h1>Catalogus van de Amsterdamse geschiedenis</h1>
				<p class="subtitle">Browse door de geschiedenis van Amsterdam</p>
				<p>Categorie overzicht</p>
			</header>
			<main>
				<ul class="overview"></ul>
			</main>
			<div class="empty"></div>
			`

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

		this.data = this.data.splice( counter, this.data.length )

	}

}

export default CategorieOverview
