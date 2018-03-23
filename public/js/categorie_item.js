import { handleClickEvent } from './helpers.js'

class CategorieItem {

	constructor( data, count = null ) {

		this.data = data
		this.count = count

	}

	render() {

		if ( typeof document.createDocumentFragment === 'function' ) {

			this.element = document.createDocumentFragment()

		} else {

			this.element = document.createElement( 'div' )

		}

		const header = document.createElement( 'header' ),
			title = document.createElement( 'h1' ),
			breadcrumb = document.createElement( 'a' ),
			subTitle = document.createElement( 'p' ),

			main = document.createElement( 'main' ),
			ul = document.createElement( 'ul' ),
			empty = document.createElement( 'div' )

		empty.classList.add( 'empty' )

		title.textContent = 'Catalogus van de Amsterdamse geschiedenis'

		breadcrumb.textContent = 'Categorie overview'
		breadcrumb.setAttribute( 'href', '/' )
		breadcrumb.addEventListener( 'click', handleClickEvent )

		subTitle.textContent = this.data[ 0 ].categorie

		header.appendChild( title )
		header.appendChild( breadcrumb )
		header.appendChild( subTitle )

		ul.classList.add( 'overview' )

		main.appendChild( ul )

		this.element.appendChild( header )
		this.element.appendChild( main )
		this.element.appendChild( empty )

		let counter = 0

		while( counter < 20 ) {

			const el = this.data[ counter ],
				li = this.renderThumbnail( el.title, el, el.slug)

			ul.appendChild( li )

			counter++

		}

		this.data = this.data.splice( counter, this.data.length )

		return this.element

	}

	renderThumbnail( title, data, url ) {

		title = title || this.data.categorie
		data = data || this.data
		url = url || '/c/' + this.data.categorie.toLowerCase().replace( / /g, '-' )

		const li = document.createElement( 'li' ),
			a = document.createElement( 'a' ),
			figure = document.createElement( 'figure' ),
			figcaption = document.createElement( 'figcaption' ),
			small = document.createElement( 'small' ),
			img = document.createElement( 'img' )

		img.setAttribute( 'src', data.img )
		img.setAttribute( 'alt', data.categorie )

		figcaption.textContent = title

		a.setAttribute( 'href', url )
		a.addEventListener( 'click', handleClickEvent )

		if ( this.count ) {

			small.textContent = `(${ this.count })`
			figcaption.appendChild( small )

		}

		figure.appendChild( img )
		figure.appendChild( figcaption )

		a.appendChild( figure )

		li.appendChild( a )

		return li

	}

	renderDetailsPage() {

		if ( typeof document.createDocumentFragment === 'function' ) {

			this.element = document.createDocumentFragment()

		} else {

			this.element = document.createElement( 'div' )

		}

		const header = document.createElement( 'header' ),
			title = document.createElement( 'h1' ),
			breadcrumb = document.createElement( 'a' ),
			secondBreadcrumb = document.createElement( 'a' ),
			subTitle = document.createElement( 'p' ),

			main = document.createElement( 'main' ),
			picture = document.createElement( 'picture' ),
			img = document.createElement( 'img' ),
			pictureTitle = document.createElement( 'h2' ),
			textBlock = document.createElement( 'div' )

		title.textContent = 'Catalogus van de Amsterdamse geschiedenis'

		breadcrumb.textContent = 'Categorie overview'
		breadcrumb.setAttribute( 'href', '/' )
		breadcrumb.addEventListener( 'click', handleClickEvent )

		secondBreadcrumb.textContent = this.data.categorie
		secondBreadcrumb.setAttribute( 'href', `/c/${ this.data.categorie.toLowerCase() }` )
		secondBreadcrumb.addEventListener( 'click', handleClickEvent )

		subTitle.textContent = this.data.title

		header.appendChild( title )
		header.appendChild( breadcrumb )
		header.appendChild( secondBreadcrumb )
		header.appendChild( subTitle )

		main.classList.add( 'details' )

		img.setAttribute( 'src', this.data.img )
		img.setAttribute( 'alt', this.data.title )

		pictureTitle.textContent = this.data.title

		picture.appendChild( img )

		main.appendChild( picture )
		textBlock.appendChild( pictureTitle )

		main.appendChild( textBlock )

		this.element.appendChild( header )
		this.element.appendChild( main )

		if ( this.data.description ) {

			const description = document.createElement( 'p' )
			description.classList.add( 'description' )
			description.textContent = this.data.description
			textBlock.appendChild( description )

		}

		if ( this.data.date ) {

			const date = document.createElement( 'p' )
			date.classList.add( 'date' )
			date.textContent = `Date: ${ this.data.date }`
			textBlock.appendChild( date )

		}

		if ( this.data.subjects ) {

			const a = document.createElement( 'a' ),
				p = document.createElement( 'p' )

			p.classList.add( 'subjects' )
			p.textContent = 'Subjects: '

			a.textContent = this.data.subjects
			a.setAttribute( 'href', this.data.subjects )

			p.appendChild( a )
			textBlock.appendChild( p )

		}

		if ( this.data.spatial ) {

			const a = document.createElement( 'a' ),
				p = document.createElement( 'p' )

			p.classList.add( 'spatial' )
			p.textContent = 'Spatial: '

			a.textContent = this.data.spatial
			a.setAttribute( 'href', this.data.spatial )

			p.appendChild( a )
			textBlock.appendChild( p )

		}

		return this.element

	}

}

export default CategorieItem
