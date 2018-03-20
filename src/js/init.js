import Routes from './routes.js'

function initialize() {

	const routes = new Routes()

	routes.goTo( window.location.pathname )

}

export default initialize
