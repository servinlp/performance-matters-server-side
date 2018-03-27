import { handleClickEvent } from './helpers.js'

class CategorieItem {

	constructor( categorie, single ) {

		this.categorie = categorie
		this.single = single

		this.data = data.filter( el => el.type === this.categorie )[ 0 ].items
				.filter( el => el.titleSlug === this.single )[ 0 ]

	}

	render() {

		if ( typeof document.createDocumentFragment === 'function' ) {

			this.element = document.createDocumentFragment()

		} else {

			this.element = document.createElement( 'div' )

		}

		fetch( '/details_element.ejs' )
                        .then( res => res.text() )
                        .then( res => {

				this.renderFromTemplate( res )

			} )

	}

	renderFromTemplate( template ) {

		const details = ejs.render( template, { data: this.data } )
                document.body.insertAdjacentHTML( 'beforeend', details )

	}

}

export default CategorieItem
