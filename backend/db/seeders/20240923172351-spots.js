'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Spot',[
    {
    "ownerId": 1,
    "address": "556 Tracy Street",
    "city": "Spring Valley",
    "state": "California",
    "country":"United States",
    "lat":88.7645358,
    "lng":-122.4730329,
    "name":"Elegant Luxury! Cabin Sleep 19",
    "description":"Adventure meets luxury with this one of a kind climate controlled glamping excursion. All the best of nature combined with the luxury of an upscale hotel room. Gaze up at the stars or out at the rolling Eureka forestry from the comfort of your 100% climate controlled dome. Soak in the jetted tub cookout on the deck and drink cocktails from the built in hammock. 15min to Spring Valley downtown. NO WIFI and cell service is spotty.",
    "price": 200
   },
   {
    "ownerId": 2,
    "address": "997 Caleb Steven Street",
    "city": "Fall Valley",
    "state": "Washington DC",
    "country":"United States",
    "lat":99.7645358,
    "lng":-111.4730329,
    "name":"Warm Cozy! Cabin Sleep 20",
    "description":"Nestled beneath towering redwoods, Caz Cabin is a beautifully remodeled retreat. Serene alfresco meals on the decks or skip stones in the backyard creek. Inside, cozy up to the wood fire and get comfy. Custom design and thoughtful details promise an unforgettable stay and your connection to all Sonoma has to offer. Escape the city! Insta - CazCabinProject",
    "price": 100

   },
   {
    "ownerId": 3,
    "address": "345 Ave",
    "city": "Cazadero",
    "state": "California",
    "country":"United States",
    "lat":26.7645358,
    "lng":-112.4730329,
    "name":"Elegant Luxury! Cabin Sleep 19",
    "description":"The Cobb Haus is located at the end of a quiet dirt road of a rural neighborhood. (Please note: there are neighbors, however the cabin is situated in a way that it faces out into the forest making it feel private and secluded when inside. The deck however, can be seen by the neighbor). It is nestled in the dogwood trees with a beautiful deck (and an outdoor shower!). It offers one large open common space as well as a bedroom and living room with amazing tree views - it feels like you're in a treehouse! ",
    "price": 329
   },
   {
    "ownerId": 14,
    "address": "326 Cobber Rd",
    "city": "Winter Vally",
    "state": "New York",
    "country":"United States",
    "lat":77.7645358,
    "lng":-102.4730329,
    "name":"Romantic Luxury! Cabin Sleep 33",
    "description":"This rustic yet luxurious cabin is the perfect place to unplug. Walk through the woods, relax by a fire, and enjoy the food and wine of the Russian River Valley. 10 minutes from the beach. Minutes from Occidental, Graton, Forestville, and Guerneville. House has a full bathroom, bedroom downstairs with a Cal King bed and one upstairs with two twin beds.5 acres in the redwoods, trampoline, fire pit area, high-speed Internet.",
    "price": 500
   },
   {
    "ownerId": 15,
    "address": "693 groveland Street",
    "city": "Groveland",
    "state": "Colorado",
    "country":"United States",
    "lat":98.7645358,
    "lng":-322.4730329,
    "name":"Guest Favorite! Cabin Sleep 39",
    "description":"A rustic chalet cabin on a quiet cul-de-sac. Great little getaway cabin for those who want to escape the craziness of a big city. The home is perfect for a small group of up to 5 (max) including kids.About 25 miles to Yosemite National Park entrance.",
    "price": 237
   },
   {
    "ownerId": 6,
    "address": "395 Sea Tea Street",
    "city": "Sea Tree",
    "state": "California",
    "country":"United States",
    "lat":58.7645358,
    "lng":-99.4730329,
    "name":"romantic getaway! Cabin Sleep 69",
    "description":"Curated amenities make oceanfront Sea Ranch Abalone Bay a perfect romantic getaway, girl's weekend, gentleman's holiday, or relaxing retreat for the family. Ample workspace, Note . Pre-planning support and concierge assures you have the experience of a lifetime. Guests required to sign rental agreement and provide security deposit of $500. Added Pet fee of $80 for 1 dog, $160 for 2 dogs. The host welcomes all and does not discriminate against anyone.",
    "price": 290
   },
   {
    "ownerId": 27,
    "address": "382 Big Man Ave",
    "city":"Granbury",
    "state": "Texas",
    "country":"United States",
    "lat":111.7645257,
    "lng":-122.4730329,
    "name":"Trails edge lake house, boat dock, & best view!!!",
    "description":"Experience tranquility among the trees with a private soaking tub on the redwood deck. Spectacular infinity pool and hot tub with sunset views are located a short walk away from the cottage. Hot tub is heated year-round during the two hours around sunset; pool is heated April through Oct. Note: We are only renting the cottage this year so this is your last chance to have the pool and hot tub to yourself - in 2025 Reverie Retreat is expanding. ",
    "price": 340
   },
   {
    "ownerId": 8,
    "address": "600 Justin B Street",
    "city": "Walnut Creek",
    "state": "California",
    "country":"United States",
    "lat":116.7645358,
    "lng":-122.4730329,
    "name":"Gorgeous & Peaceful Shavehead Lake",
    "description":"Our cozy, oceanfront gem has amazing views and is the perfect place to relax and reconnect with yourself, loved ones, and friends. When whales are migrating, you can spot them from our comfy couch.We are on the bluff with an oceanfront hot tub, within walking distance to Gualala restaurants, groceries & shops. Please respect our dream home, our neighbors, & bring only good vibes here. This is a beautiful and remote area, please plan accordingly to relax and enjoy the slow pace of life here.",
    "price": 276
   },
   {
    "ownerId": 9,
    "address": "267 William Street",
    "city": "Gualua",
    "state": "New Jersey",
    "country":"United States",
    "lat":114.7645358,
    "lng":-122.4730329,
    "name":"Stunning round house view waterfall spa & cottage!",
    "description":"For your vacationing bliss is our newly-built, high-design round house situated on 5+ private acres with its own creek, waterfall, pond, expansive decks, hot tub and separate cottage. It's close to two cool towns filled w great food, art, music, wineries, breweries and endless outdoor sport options, but you won't want to leave..there's no other spot like it on Earth. With soaring cathedral ceilings, panoramic windows & gorgeous views, you'll be transported into the surrounding beauty around you.",
    "price": 380
   },
   {
    "ownerId": 10,
    "address": "988 Grass Punch Street",
    "city": "Grass Valley",
    "state": "Washington DC",
    "country":"United States",
    "lat":109.7645358,
    "lng":-111.4730329,
    "name":"Kings Hill Ranch Off Grid A Frame Tiny House!",
    "description":"Secluded Off Grid A Frame tiny home on a 300-acre ranch nestled deep in the forest.This unique property has an organic 30-acre walnut orchard, thriving off rainfall and an aquifer. We implement multi species grazing and have an array of animals that free range the property during the day including goats, sheep, horses, chickens, peacocks, pigs & alpacas.",
    "price": 440
   },
   {
    "ownerId": 11,
    "address": "556 Charlie Puth Street",
    "city": "Lakefront Valley",
    "state": "California",
    "country":"United States",
    "lat":115.7645358,
    "lng":-122.4730329,
    "name":"Charlie's Cabin | Lakefront • Spa • Firepit • Dock",
    "description":"Welcome to Charlie's Cabin located in the heart of beautiful Lake County. Your cabin, directly on the lake, has everything you'll need to create the perfect getaway. With two bedrooms, an open concept living area featuring a chef's kitchen. The expansive deck provides a second living area with plenty of seating around the table or fire pit with lake and mountain views. The lower level provides a second deck and private dock - so bring your boat!",
    "price": 328
   },
   {
    "ownerId": 22,
    "address": "987 Napa Valley Street",
    "city": "Napa Valley",
    "state": "Washington DC",
    "country":"United States",
    "lat":109.7645358,
    "lng":-111.4730329,
    "name":"White House Napa",
    "description":"Blending extraordinary history with contemporary comfort and sophistication, White House Napa offers an upscale, homelike hideaway rooted in the beauty of Napa. Awaken to a new day in the California sun and take a dip in the pool. Raise your glass in the afternoon at our complimentary Wine Hour. Enjoy an evening stroll or bike ride around town. Take a seat in our courtyard and flip through a great book. However you prefer to unwind, our team will welcome you into an idyllic getaway.",
    "price": 999

   },
   {
    "ownerId": 23,
    "address": "654 Tuscan Villa Ave",
    "city": "Fairfield",
    "state": "California",
    "country":"United States",
    "lat":113.7645358,
    "lng":-112.4730329,
    "name":"Villa Capricho: Tuscan Retreat w/GuestHouse & Pool",
    "description":"Step inside Villa Capricho and you'll be transported to a world of luxury and elegance. The home's Tuscan-inspired architecture can be felt throughout, with beautiful art and high-end furnishings creating a warm and inviting atmosphere. The living area and family room offer comfortable seating and breathtaking views of the vineyards. Open the French doors in the living area to access the spacious patio, where you can soak up the California sunshine while sipping on your favorite Suisun Valley wine. ",
    "price": 929
   },
   {
    "ownerId": 24,
    "address": "726 Honard Vinary Rd",
    "city": "Sea Ranch Vally",
    "state": "Virgina",
    "country":"United States",
    "lat":97.7645358,
    "lng":-102.4730329,
    "name":"Vacation Luxury! Cabin Sleep 988888",
    "description":"Welcome to our Malibu Hills paradise! This luxurious vacation rental home offers a truly unique and unforgettable experience. Step into a world of enchantment as you explore the mesmerizing crystal garden, a magical oasis where tranquility and beauty converge. Feel the allure of the wild west as you unwind in the charming tipi, perfect for stargazing or finding solace amidst the breathtaking sunsets every evening. Perched high and in a gated community, experience the magic of Malibu Hills.",
    "price": 880
   },
   {
    "ownerId": 25,
    "address": "899 Sealand Street",
    "city": "Sealand",
    "state": "Chicago",
    "country":"United States",
    "lat":98.7645358,
    "lng":-112.4730329,
    "name":"Guest Favorite ever! Cabin Sleep 999999999",
    "description":"Bring everyone together in this impressive Mediterranean Villa in the heart of Beverly Hills!!  8,600 square feet and seven luxurious guest suites, lush oversized backyard w/ pool, spa, waterfall, sport court and plenty of outdoor areas perfect for lounging in the sun or dining al fresco. At Luxury Mansion Rentals",
    "price": 983
   },
   {
    "ownerId": 26,
    "address": "395 Upfunk Street",
    "city": "Los Angeles",
    "state": "California",
    "country":"United States",
    "lat":77.7645358,
    "lng":-99.4730329,
    "name":"Best Price and Best View ever!",
    "description":"Take it easy at this unique and tranquil Estate with all the comforts of home and office plus much more.  Pickleball to Frisbee golf.  Par 3 golf hole and putting greens to the business facilities (including a boardroom with AV capacity)  With endless activities, unique spaces, and thoughtful touches, your stay will be everything you need and more.",
    "price": 990
   },
   {
    "ownerId": 17,
    "address": "394 Big Cave Ave",
    "city":"Beverly Hill",
    "state": "California",
    "country":"United States",
    "lat":111.7645257,
    "lng":-122.4730329,
    "name":"Trails edge lake house, boat dock, & best view!!!",
    "description":"Retreat to this beautiful 20 acre Hacienda set on a boutique organic vineyard and olive orchard in the Pastures of Heaven. This luxurious 6 bedroom vacation rental and its impeccably maintained grounds are the perfect location for your next celebration or retreat. With large common spaces, state of the art kitchen, and expansive outdoor amenities, this home was designed for entertaining.  ",
    "price": 999
   },
   {
    "ownerId": 28,
    "address": "8834 Selina B Street",
    "city": "Concord",
    "state": "California",
    "country":"United States",
    "lat":114.7645358,
    "lng":-122.4730329,
    "name":"Gorgeous & Peaceful Shavehead Lake",
    "description":"Retreat to this beautiful 20 acre Hacienda set on a boutique organic vineyard and olive orchard  in the Pastures of Heaven. This luxurious 6 bedroom vacation rental and its impeccably maintained grounds are the perfect location for your next celebration or retreat. With large common spaces, state of the art kitchen, and expansive outdoor amenities, this home was designed for entertaining. ",
    "price": 452
   },
   {
    "ownerId": 29,
    "address": "883 Temu Street",
    "city": "Orlando",
    "state": "Florida",
    "country":"United States",
    "lat":114.7645358,
    "lng":-122.4730329,
    "name":"Stunning farm house!",
    "description":"Gather your family and friends for an unforgettable getaway at this enchanting haven. Nestled above the picturesque Santa Rosa Valley, this privately gated equestrian estate spans 11.59 acres. Accommodating up to 15 guests, it offers the ultimate experience in privacy, seclusion, and serenity. Ideal for personal connections and fun, please note that parties are not allowed, ensuring a tranquil and peaceful retreat for all.",
    "price": 879
   },
   {
    "ownerId": 20,
    "address": "988 Flower Punch Street",
    "city": "Flower Valley",
    "state": "Washington DC",
    "country":"United States",
    "lat":109.7645358,
    "lng":-111.4730329,
    "name":"Flower everywhere best view ever and romantic ever!",
    "description":"The Flower Valley Inn features 8 themed rooms in the heart of Rustic Wine Country, just a few miles from Napa. The secluded 55-acre ranch is surrounded by vineyards, making it the perfect venue for wine tasting trips, out-of-town guests or weekend getaways. There are farm stands, wine tasting rooms restaurants within a short drive. Parties or events involving guests not staying at the property are not allowed. See our other listing 'Wine Country Estate & Wedding Venue' for info on Events.",
    "price": 895
   }
   
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Spot', null, {});
  }
};
