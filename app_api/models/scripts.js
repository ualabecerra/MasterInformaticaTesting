db.locations.save({name: 'Starcups',
	        address: '125 High Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            coords: [-0.9690884,51.455041],
            openingTimes: [{
                days: 'Monday - Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            }, {
                days: 'Saturday',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
            }, {
                days: 'Sunday',
                closed: true
            }]
        })

db.locations.update({
name: 'Starcups'
}, {
$push: {
reviews: {
author: 'Simon Holmes',
_id: ObjectId(),
rating: 5,
timestamp: new Date("Jul 16, 2013"),
reviewText: "What a great place. I can't say enough good things about it."
}
}
})


db.locations.update({
name: 'Starcups'
}, {
$push: {
reviews: {
author: 'Antonio Becerra',
_id: ObjectId(),
rating: 5,
timestamp: new Date("Jul 16, 2013"),
reviewText: "What a great place. I can't say enough good things about it."
}
}
})

db.locations.update({
name: 'Starcups'
}, {
$push: {
reviews: {
author: 'Daniel Becerra',
_id: ObjectId(),
rating: 5,
timestamp: new Date("Jul 16, 2013"),
reviewText: "What a great place. I can't say enough good things about it."
}
}
})


db.locations.save({name: 'Entrevinos',
	        address: 'Callzada de Castro 45',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            coords: [-2.4499777,36.8388359],
            openingTimes: [{
                days: 'Monday - Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            }, {
                days: 'Saturday',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
            }, {
                days: 'Sunday',
                closed: true
            }],
            reviews: [
            {	author: 'Ana Becerra',
				_id: ObjectId(),
				rating: 5,
				timestamp: new Date("Nov 30, 2017"),
				reviewText: "What a great place. I can't say enough good things about it."
				}, 
				{
				author: 'Manolo Torres',
				_id: ObjectId(),
				rating: 5,
				timestamp: new Date("Dec 1, 2017"),
				reviewText: "What a great place. I can't say enough good things about it."
				}, {
				author: 'Daniel Becerra',
				_id: ObjectId(),
				rating: 5,
				timestamp: new Date("Oct 15, 2017"),
				reviewText: "What a great place. I can't say enough good things about it."}
				]
        })



db.locations.save({name: 'Bar Lamarca',
	        address: 'Calle Gregorio Maranon',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            coords: [-2.4570093,36.8380492],
            openingTimes: [{
                days: 'Monday - Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            }, {
                days: 'Saturday',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
            }, {
                days: 'Sunday',
                closed: true
            }],
            reviews: [
            {	author: 'Ana Becerra',
				_id: ObjectId(),
				rating: 5,
				timestamp: new Date("Nov 30, 2017"),
				reviewText: "What a great place. I can't say enough good things about it."
				}, 
				{
				author: 'Manolo Torres',
				_id: ObjectId(),
				rating: 5,
				timestamp: new Date("Dec 1, 2017"),
				reviewText: "What a great place. I can't say enough good things about it."
				}, {
				author: 'Daniel Becerra',
				_id: ObjectId(),
				rating: 5,
				timestamp: new Date("Oct 15, 2017"),
				reviewText: "What a great place. I can't say enough good things about it."}
				]
        })

db.updateUser("heroku_bw86gphw", { 
	roles: [
	{role : "dbOwner", db: "heroku_bw86gphw"},
	{role : "dbAdmin", db: "heroku_bw86gphw"},
	{role : "readWrite", db: "heroku_bw86gphw"} 
	]})