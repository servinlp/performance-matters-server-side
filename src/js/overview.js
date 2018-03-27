import CategorieItem from './categorie_item.js'
import { handleClickEvent } from './helpers.js'
import { singleCategorieData } from './api.js'

class Overview {

	constructor( categorie ) {

		this.categorie = categorie

		if ( categorie ) {

			const filter = data.filter( el => el.type === this.categorie )[ 0 ]
			this.data = filter.items

		} else {

			this.data = data

		}

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

				this.renderLi( res )

			} )

		return fragment

	}

	renderLi( template ) {

		const ul = document.querySelector( '.overview' )

		let counter = 0,
			i = 0

		while( counter < 20 ) {

			const el = this.data[ i ]

			if ( el.length === 0 ) {

				i++
				continue

			}

			const li = ejs.render( template, { data: el, categorie: this.categorie } )
			ul.insertAdjacentHTML( 'beforeend', li )

			const addedLi = ul.querySelectorAll( 'li' ),
				lastLi = addedLi[ addedLi.length - 1 ]

			lastLi.addEventListener( 'click', handleClickEvent )

			i++
			counter++

		}

	}

}

export default Overview
