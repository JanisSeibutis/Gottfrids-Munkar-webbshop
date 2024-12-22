// Länkar till bildfiler
const appleFritter: string = './images/apple-fritter.jpeg'
const chocholate: string = './images/chocholate.jpeg'
const cookiesAndCream: string = './images/cookies&cream.jpeg'
const cruller: string = './images/cruller.jpeg'
const halloween: string = './images/halloween.jpeg'
const mapleBacon: string = './images/maple-bacon.jpeg'
const matcha: string = './images/matcha.jpeg'
const peanutButter: string = './images/peanutbutter-jelly.jpeg'
const pumpkin: string = './images/pumpkin-spice.jpeg'
const smores: string = './images/smores.jpeg'
const strawberry: string = './images/strawberry.jpeg'

export type Product = {id: number, name: string, price: number, amount: number, image: string, rating: number, category: string}

// Produkter
export const productArray = [
  {
    id: 0,
    name: 'Apple-fritter',
    price: 15,
    amount: 0,
    image: appleFritter,
    rating: 3.5,
    category: 'Klassiska smaker',
  },
  {
    id: 1,
    name: 'Chocholate',
    price: 12,
    amount: 0,
    image: chocholate,
    rating: 3,
    category: 'Klassiska smaker',
  },

  {
    id: 2,
    name: 'Cruller',
    price: 15,
    amount: 0,
    image: cruller,
    rating: 4,
    category: 'Klassiska smaker',
  },
  {
    id: 3,
    name: 'Halloween Special',
    price: 18,
    amount: 0,
    image: halloween,
    rating: 3.5,
    category: 'Unika smaker',
  },
  {
    id: 4,
    name: 'Maple Bacon',
    price: 15,
    amount: 0,
    image: mapleBacon,
    rating: 3,
    category: 'Klassiska smaker',
  },
  {
    id: 5,
    name: 'Matcha',
    price: 15,
    amount: 0,
    image: matcha,
    rating: 4,
    category: 'Unika smaker',
  },
  {
    id: 6,
    name: 'Peanut Butter & Jelly',
    price: 15,
    amount: 0,
    image: peanutButter,
    rating: 4.5,
    category: 'Unika smaker',
  },
  {
    id: 7,
    name: 'Pumpkin Spice',
    price: 18,
    amount: 0,
    image: pumpkin,
    rating: 3,
    category: 'Säsongs smaker',
  },
  {
    id: 8,
    name: 'Smores',
    price: 18,
    amount: 0,
    image: smores,
    rating: 3.5,
    category: 'Säsongs smaker',
  },
  {
    id: 9,
    name: 'Cookies & Cream',
    price: 18,
    amount: 0,
    image: cookiesAndCream,
    rating: 4.5,
    category: 'Unika smaker',
  },
  {
    id: 10,
    name: 'Strawberry',
    price: 12,
    amount: 0,
    image: strawberry,
    rating: 3,
    category: 'Klassiska smaker',
  },
]

