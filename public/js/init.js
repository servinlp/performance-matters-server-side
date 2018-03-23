import { handleClickEvent } from './helpers.js'

function initialize() {

	const a = Array.from( document.querySelectorAll( 'a' ) )

        a.forEach( el => {

                el.addEventListener( 'click', handleClickEvent )

        } )

}

export default initialize
