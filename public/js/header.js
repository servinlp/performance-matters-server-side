import { handleClickEvent } from './helpers.js'

function renderHeader( arr ) {

	const header = document.createElement( 'header' ),
		title = document.createElement( 'h1' ),
		p = document.createElement( 'p' )

	title.textContent = 'Catalogus van de Amsterdamse geschiedenis'

	header.appendChild( title )

	if ( !arr || arr.length === 0 ) {

		const subtitle = document.createElement( 'p' )
		subtitle.classList.add( 'subtitle' )
		subtitle.textContent = 'Browse door de geschiedenis van Amsterdam'
		p.textContent = 'Categorie overzicht'

		header.appendChild( subtitle )
		header.appendChild( p )

	} else {

		for ( let i = 0; i < ( arr.length - 1 ); i++ ) {

			const el = arr[ i ],
				a = document.createElement( 'a' )
			a.setAttribute( 'href', el[ 1 ] )
			a.textContent = el[ 0 ]
			a.addEventListener( 'click', handleClickEvent )

			header.appendChild( a )

		}

		p.textContent = arr[ arr.length - 1 ][ 0 ]
		header.appendChild( p )

	}

	return header

}

export default renderHeader
