import Routes from './routes.js'

function unique( xs ) {

	  return xs.filter( ( x, i ) => {

		  const index = xs.findIndex( el => el.title === x.title )
		  return index === i

	  } )

}

function handleClickEvent( e ) {

	const link = e.target.tagName === 'A' ? e.target : e.target.parentNode.parentNode

	if ( !link.href.includes( window.location.origin ) ) return

	e.preventDefault()

	if ( window.history ) {

		window.history.pushState( {}, '', link.getAttribute( 'href' ) )

	}

	const header = document.querySelector( 'header' ),
		main = document.querySelector( 'main' ),
		empty = document.querySelector( '.empty' ),
		oldA = Array.from( document.querySelectorAll( 'a' ) )

	oldA.forEach( el => {

		el.removeEventListener( 'click', handleClickEvent )

	} )

	header.remove()
	main.remove()

	if ( empty ) {

		empty.remove()

	}

	window.scrollTo( 0, 0 )

	const routes = new Routes()

	routes.goTo( link.getAttribute( 'href' ), true )

}

function createObserver( el ) {

	console.log( el )

	var observer

	var options = {
	      root: null,
	      rootMargin: "0px",
	      threshold: buildThresholdList()
	};

	observer = new IntersectionObserver( handleIntersect, options )
	observer.observe( el )

}

function handleIntersect() {

	console.log( 'run intersection' )

}

function buildThresholdList() {

	var thresholds = [],
		numSteps = 20.0

	for (var i=1.0; i<=numSteps; i++) {
		var ratio = i/numSteps;
		thresholds.push(ratio);
	}

	thresholds.push(0);
	return thresholds

}

export {
	unique,
	handleClickEvent,
	createObserver
}
