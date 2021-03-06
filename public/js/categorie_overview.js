import CategorieItem from './categorie_item.js'
import { singleCategorieData } from './api.js'

class Overview {

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

		fetch( '/overview_item.ejs' )
			.then( res => res.text() )
			.then( res => {

				console.log( res )
				this.renderLi( res )

			} )

		return fragment

	}

	renderLi( template ) {

		const ul = document.querySelector( '.overview' )

		let counter = 0,
			i = 0

		while( counter < 20 ) {

			const el = data[ i ]
			console.log( el )

			if ( el.length === 0 ) {

				i++
				continue

			}

			const li = ejs.render( template, { data: el } )
			ul.appendChild( li )

			i++
			counter++

		}

	}

}

export default Overview
