import productArray from './products'
import { renderSortedProducts } from './main'

/* Lägger till sorterings funktion till alla sorterings knappar */ // ----------------KRAV--------------
export const sortingFunc = () => {
  // Sortera produkter efter rating
  const SortRatingBtn = document.querySelector('.sort-rating')
  SortRatingBtn.addEventListener('click', () => {
    productArray.sort((a, b) => b.rating - a.rating)
    renderSortedProducts()
  })
  // Sortera produkter efter namn
  const SortNameBtn = document.querySelector('.sort-name')
  SortNameBtn.addEventListener('click', () => {
    productArray.sort((a, b) => a.name.localeCompare(b.name))
    renderSortedProducts()
  })
  // Sortera produkter efter kategori
  const sortCategoryBtn = document.querySelector('.sort-category')
  sortCategoryBtn.addEventListener('click', () => {
    productArray.sort((a, b) => a.category.localeCompare(b.category))
    renderSortedProducts()
  })
  // Sortera produkter efter pris
  const sortPriceBtn = document.querySelector('.sort-price')
  sortPriceBtn.addEventListener('click', () => {
    productArray.sort((a, b) => a.price - b.price)
    renderSortedProducts()
  })
}
