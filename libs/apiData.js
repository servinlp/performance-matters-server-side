const fetch = require( 'node-fetch' ),
	data = []

function categories() {

	const sparqlquery = `
		PREFIX dc: <http://purl.org/dc/elements/1.1/>
		SELECT DISTINCT ?type (COUNT(?cho) AS ?count) WHERE {
			?cho dc:type ?type
		}
	        GROUP BY ?type
		ORDER BY DESC(?count)
		LIMIT 500`,
	        encodedquery = encodeURIComponent( sparqlquery ),
		queryurl = `https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=${ encodedquery }&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on`

	fetch( queryurl )
		.then( res => res.json() )
		.then( res => {

			const dat = res.results.bindings.map( el => ( {
				count: el.count.value,
				type: el.type.value.toLowerCase().replace( /\./g, '' ),
				items: []
			} ) )

			dat.forEach( el => {

				data.push( el )

			} )

			getFirstXCategories( dat )

		} )
		.catch( err => {

			console.log( err )

		} )

}

categories()

async function getFirstXCategories( res, num = 20 ) {

	const promises = []

	let counter = 0

	for ( let i = 0; i < num; i++ ) {

		promises.push( singleCategorieData( res[ i ].type ) )

	}

	try {

		const categorieData = await Promise.all( promises )

		categorieData.forEach( el => {

			if ( el.length === 0 ) {

				counter++

			} else {

				const curr = data.filter( d => d.type === el[ 0 ].categorie )[ 0 ]
				curr.items = curr.items.concat( el )

			}
		} )

	} catch ( err ) {

		console.log( err )

	}

	if ( counter ) {

		const ress = res.slice( num )
		getFirstXCategories( ress, counter )

	} else {

		console.log( 'DONE' )

	}

}

function singleCategorieData( categorie ) {

	return new Promise( ( resolve, reject ) => {

		const sparqlquery = `
			PREFIX dc: <http://purl.org/dc/elements/1.1/>
			PREFIX foaf: <http://xmlns.com/foaf/0.1/>
			PREFIX dct: <http://purl.org/dc/terms/>
			SELECT ?cho ?title ?img ?subjects ?spatial ?description ?date WHERE {
				?cho dc:type "${ categorie }"^^xsd:string .
				?cho dc:title ?title .
				?cho foaf:depiction ?img .
				OPTIONAL { ?cho dc:subject ?subjects } .
				OPTIONAL { ?cho dct:spatial ?spatial } .
				OPTIONAL { ?cho dc:description ?description } .
				OPTIONAL { ?cho dc:date ?date } .
			}
		        LIMIT 1000`,
		        encodedquery = encodeURIComponent( sparqlquery ),
			queryurl = `https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=${ encodedquery }&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on`

		fetch( queryurl )
			.then( res => res.json() )
			.then( res => {

				const data = unique( res.results.bindings.map( el => {

					const obj = {
						cho: el.cho.value,
						title: el.title.value,
						img: el.img.value,
						slug: '/c/' + categorie.toLowerCase().replace( / /g, '-' ) + '/single/' + el.title.value.toLowerCase().replace( / /g, '-' ),
						titleSlug: el.title.value.toLowerCase().replace( / /g, '-' ),
						categorie: categorie.toLowerCase()
					}

					if ( el.description ) {

						obj.description = el.description.value

					}

					if ( el.subjects ) {

						obj.subjects = el.subjects.value

					}

					if ( el.spatial ) {

						obj.spatial = el.spatial.value

					}

					if ( el.date ) {

						obj.date = el.date.value

					}

					return obj

				} ) )

				resolve( data )

			} )
			.catch( err => {

				console.log( err )
				reject( err )

			} )

	} )

}

function unique( xs ) {

	return xs.filter( ( x, i ) => {

		const index = xs.findIndex( el => el.title === x.title )
                return index === i

	} )

}

module.exports = data
