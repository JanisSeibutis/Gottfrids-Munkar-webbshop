import '/styles/style.scss'
import {productArray,Product} from './products'
import { toggleTheme } from './theme-toggle'
import { sortingFunc } from './sorting'
import { renderCheckout, header, validateForm } from './checkout'

// Storlek på produktbilder
const productImageWidth: number = 1024
const productImageHeight: number = 1024

type HtmlEl = HTMLElement | null

// Definerade variabler
const productDiv: HtmlEl = document.querySelector('#products')
const cart: HtmlEl = document.querySelector('.cart')
const cartModal: HTMLDialogElement | null = document.querySelector('.cart-modal')
const cartProducts: HtmlEl = document.querySelector('.cart-products')
const cartTotalPrice: HtmlEl = document.querySelector('.cart-total-price')
const closeCartBtn: HtmlEl = document.querySelector('.cart-close-btn')
const subCartBtn: HtmlEl = document.querySelector('.cart-sub-btn')
const discount: HtmlEl = document.querySelector('.discount-info')
const shippingCost: HtmlEl = document.querySelector('.shipping-cost')
const productCost: HtmlEl = document.querySelector('.product-cost')
const backToBasketBtn: HtmlEl = document.querySelector('.form__close')
const footer: HtmlEl = document.querySelector('footer')
const cartAmount: HtmlEl = document.querySelector('.cart-amount')
const totalPrice: HtmlEl = document.querySelector('.total-price')
const mainInfo: HtmlEl = document.querySelector('.main__info')
const productWrap: HtmlEl = document.querySelector('.product-wrap')
const themeToggleBtn: HtmlEl = document.querySelector('.theme-toggle')

export const formSection: HtmlEl = document.querySelector('#order-summary')

toggleTheme()

// Varukorgslista
let cartItems: Product[] = []
// Kopia av varukorgslistan
export let shallowCopyCartItems: Product[] = []
// Fraktkostnad
export let shipping: number = 0
// Summan som ska skickas till beställningsformuläret
let sumToCheckout: number

/* Gör prispåslag på 15%, fredag efter kl.15 fram till och med måndag kl.3 */ //----------------KRAV---------------
const weekendPrice: () => void = () => {
  // Aktuell tid
  const currentTime = new Date()
  if (
    (currentTime.getDay() === 5 && currentTime.getHours() > 15) ||
    currentTime.getDay() === 6 ||
    currentTime.getDay() === 0 ||
    (currentTime.getDay() === 1 && currentTime.getHours() < 3)
  ) {
    productArray.forEach(product => {
      product.price = Math.ceil(product.price * 1.15)
    })
  }
}
weekendPrice()

/* Skriver ut rating stjärnor enligt produkt rating */
const setRating: (rating: number) => string = rating => {
  let stars = ''
  for (let i = 0; i < Math.floor(rating); i++) {
    stars += `<i class="fa fa-star" aria-hidden="true"></i>`
  }
  if (rating.toString().includes('.')) {
    stars += `<i class="fa fa-star-half-alt" aria-hidden="true"></i>`
  }
  return stars
}

//

/**
 *Skriver ut alla tillgängliga produkter
 * @param products Produktlista från /products.mjs
 */
const renderProducts: (product: Product[]) => void = products => {
  themeToggleBtn?.classList.remove('hide')

  productDiv!.innerHTML = ''
  products.forEach(p => {
    productDiv!.innerHTML += `
    <article class="product" data-id=${p.id}>
        <img class="product__image" src="${p.image}" alt="Bild på munk med ${p.name} smak" width=${productImageWidth} height=${productImageHeight}>
        <div class="product-wrap">
          <h3 class="product-info">
            <span class="product-name">${p.name}</span>
            <span class="product-price">Pris: ${p.price} kr</span>
            <div role="img" class="product-rating" aria-label="Kundomdöme ${p.rating} stjärnor">${setRating(p.rating)}</div>
          </h3>
        <div class="amount justify-center">
          <button class="decrease-btn" aria-label="minska antal" data-id=${p.id}>-</button>
          <input class="amount-input main amount-${p.id}" aria-label="produkt antal" data-id=${p.id}  type="number" value=${p.amount} min="0"></input>
          <button class="increase-btn" aria-label="öka antal" data-id=${p.id}>+</button>
        </div>
        </div>
    </article>`
  })
}

renderProducts(productArray)

/* Lägger till event till produkt knappar */
const addBtnEvents: () => void = () => {
  const decreaseBtn = document.querySelectorAll('.decrease-btn') as NodeListOf<HTMLElement>
  decreaseBtn.forEach(b => b.addEventListener('click', e => decreaseAmount(e)))

  const increaseBtn = document.querySelectorAll('.increase-btn') as NodeListOf<HTMLElement>
  increaseBtn.forEach(b => b.addEventListener('click', e => increaseAmount(e)))
}
addBtnEvents()

/* Skriver ut sorterad produktlista */
export const renderSortedProducts = () => {
  renderProducts(productArray)
  selectAllInputs('main', 'id')
  allowOnlyNumbers()
  addBtnEvents()
}

sortingFunc()

shallowCopyCartItems = cartItems.map(item => ({ ...item }))

// Minska produktantal i varukorgen
const decreaseAmount: (e: MouseEvent) => void = e => {
  const target = e.target as HtmlEl
  const eId: number = parseInt(target?.dataset.id!)
  const foundIndex: number = productArray.findIndex(product => product.id == eId)
  // Om produkt inte existerar i listan eller om produktens antal är 0, avsluta.
  if (foundIndex == -1) {
    return
  }

  // Om produktantalet blir 0, ta bort produkten från kopierade varukorgslistan
  if (productArray[foundIndex].amount == 1 && !cartModal?.open) {
    const remainingItems = shallowCopyCartItems.filter(item => item.id != eId)
    shallowCopyCartItems = [...remainingItems]
  }
  // Om produktantalet är 0, gör ingenting
  if (productArray[foundIndex].amount == 0) {
    return
  }
  // Om varukorgen är öppen, låt inte minska produktens antal mindre än 1
  if (cartModal?.open) {
    if (productArray[foundIndex].amount == 1) {
      return
    }
  }
  // Minska antalet med 1
  productArray[foundIndex].amount -= 1

  // Om produktens antal blir 0 efter minskning, ta bort produkten från korglistan
  if (productArray[foundIndex].amount == 0) {
  const target = e.target as HtmlEl

    const remainingProducts = cartItems.filter(
      item => item.id != eId,
    )
    cartItems = [...remainingProducts]
  }

  (document.querySelector(`.amount-${eId}`) as HTMLInputElement).value =
    productArray[foundIndex].amount.toString()

  countTotalPrice()
  renderCartSum()

  if (cartModal?.open) {
    renderCartInputAmount(eId, productArray[foundIndex].amount)
  }

  // Animation på total priset vid ändring
  totalPrice?.classList.add('scale')
  setTimeout(() => totalPrice?.classList.remove('scale'), 500) // -------------------KRAV--------------------
}

// Öka produktantal i varukorgen
const increaseAmount:  (e: MouseEvent) => void = e => {
  const target = e.target as HtmlEl
  const eId: number = parseInt(target?.dataset.id!)
  const foundIndex = productArray.findIndex(product => product.id == eId)

  if (foundIndex == -1) {
    return
  }

  productArray[foundIndex].amount += 1

  // Om produkten INTE existerar i korglistan, lägg till produkten i listan
  if (!cartItems.some(item => item.id == parseInt(target?.dataset.id!))) {
    cartItems.push(productArray[foundIndex])
  }

  if (!shallowCopyCartItems.some(item => item.id == parseInt(target?.dataset.id!))) {
    shallowCopyCartItems.push({ ...productArray[foundIndex] })
  }

  (document.querySelector(`.amount-${eId}`) as HTMLInputElement).value =
    productArray[foundIndex].amount.toString()

  countTotalPrice()
  renderCartSum()

  if (cartModal?.open) {
    renderCartInputAmount(eId, productArray[foundIndex].amount)
  }

  // Animation på total priset vid ändring
  totalPrice?.classList.add('scale')
  setTimeout(() => totalPrice?.classList.remove('scale'), 500) // -------------------KRAV--------------------
}

// Öppna varukorgen vid tryck på korgikonen
cart?.addEventListener('click', () => {
  if (cartItems.length === 0) {
    return
  }
  renderCart()
  cartModal?.showModal()
  selectAllInputs('cart-amount-input', 'cartId')
})

// Lägg till event på varukorgs knappar
const addCartBtnEvents = () => {
  const decreaseBtn = document.querySelectorAll('.cart-decrease-btn')
  decreaseBtn.forEach(b => b.addEventListener('click', e => decreaseAmount(e as MouseEvent)))

  const increaseBtn = document.querySelectorAll('.cart-increase-btn')
  increaseBtn.forEach(b => b.addEventListener('click', e => increaseAmount(e as MouseEvent)))

  const removeBtns = document.querySelectorAll('.cart-remove-btn')
  removeBtns.forEach(button =>
    button.addEventListener('click', e => removeItem(e)),
  )
  closeCartBtn?.addEventListener('click', () => {
    cartModal?.close()
    // formSection.classList.add('hide')
    mainInfo?.classList.remove('hide')
    productWrap?.classList.remove('hide')
  })

  subCartBtn?.addEventListener('click', () => {
    mainInfo?.classList.add('hide')
    productWrap?.classList.add('hide')
    cartModal?.close()
    renderCheckout()
    validateForm()
    formSection?.classList.remove('hide')
    formSection?.scrollIntoView()
    footer?.classList.add('hide')
  })
}

// Skickas tillbaka till varukorgen från checkout
backToBasketBtn?.addEventListener('click', () => {
  themeToggleBtn?.classList.remove('hide')
  mainInfo?.classList.remove('hide')
  productWrap?.classList.remove('hide')
  cartModal?.showModal()
  formSection?.classList.add('hide')
  header?.classList.remove('hide')
  footer?.classList.remove('hide')
})

// Öppna varukorgen
const renderCart = () => {
  cartProducts!.innerHTML = ''

  cartItems.forEach(p => {
    cartProducts!.innerHTML += `
        <div class="cart-items">
          <img class="cart-image" src="${p.image}" alt="Bild på munk med ${p.name} smak" width=${productImageWidth} height=${productImageHeight}>
          <h3 class="cart-product-info" >
            <span class="product-name" >${p.name}</span>
            <span class="product-price" >Pris: ${p.price} kr</span>
            <span class="product-rating" aria-label="Kundomdöme ${p.rating} stjärnor">${setRating(p.rating)}</span>
          </h3>
          <div class="amount cart-amount-div flex justify-between">
            <button class="cart-decrease-btn" aria-label="minska antal" data-id=${p.id}>-</button>
            <input class="amount-input cart-amount-input" type="number" data-cart-id=${p.id}  value=${p.amount} min="0"></input>
            <button class="cart-increase-btn" aria-label="öka antal" data-id=${p.id}>+</button>
            <button class="cart-remove-btn" data-id=${p.id}>Ta bort</button>
          </div>
        </div>
        `
  })

  addCartBtnEvents()
  selectAllInputs('main', 'id')
  allowOnlyNumbers()
}

//  Uppdatera varje produkts antal i varukorgens input ruta
const renderCartInputAmount: (id: number, newValue: number) => void = (id, newValue) => {
  const inputAmount = (document.querySelector(`[data-cart-id="${id}"]`) as HTMLInputElement | null)
  inputAmount!.value = newValue.toString()
}

// Ta bort alla specialtecken från produktantal input
const allowOnlyNumbers = () => {
  const amountInput = document.querySelectorAll<HTMLInputElement>('.amount-input')
  amountInput.forEach(input => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^0-9]/g, '')
    })}
  )
}
allowOnlyNumbers()

export const countTotalPrice = () => {
  // För varje produkt i kopierade listan, hitta matchande produkt i varukorgslitan
  shallowCopyCartItems.forEach(item => {
    const foundItem = cartItems.find(product => product.id === item.id)
    if (foundItem) {
      // Ändra produktantalet till matchande produktens antal
      item.amount = foundItem.amount
      // Referenspris
      const fullPrice = foundItem.price
      // Priset efter 10% rabatt
      const bulkDiscountedPrice = fullPrice * 0.9
      // Om det finns minst 10 utav samma produkt i korgen, lägg på 10% rabatten annars ta fullt pris ---------KRAV-----------
      if (foundItem.amount >= 10) {
        item.price = bulkDiscountedPrice
      } else if (foundItem.amount < 10) {
        item.price = fullPrice
      }
    }
  })

  // Räkna och skriva ut totala summan i varukorgen
  const summedPrice = Math.ceil(
    shallowCopyCartItems.reduce(
      (item, currVal) => item + currVal.price * currVal.amount,
      0,
    ),
  )
  // Totala antal produkter i varukorgen
  const totalAmount = cartItems.reduce(
    (acc, currVal) => acc + currVal.amount,
    0,
  )
  // Om det finns minst 15 produkter i varukorgen, ändra frakt till gratis -------------------KRAV-----------------
  if (totalAmount >= 15) {
    shipping = 0
    if (shippingCost) {
      shippingCost.innerHTML = `Du har uppnått gratis frakt`
      shippingCost.classList.add('free-shipping')
    }
  }
  // Annars ändra fraktsumman till 25kr + 10% av totala produktsumman ---------------KRAV-----------
  else {
    shipping = Math.ceil(25 + summedPrice * 0.1)
    if (shippingCost) {
      shippingCost.innerHTML = `Fraktkostnad: ${shipping} kr`
      shippingCost.classList.remove('free-shipping')
    }
  }

  if (totalPrice && productCost) {
    totalPrice.innerHTML = `Totalt: ${summedPrice} kr`
    productCost.innerHTML = `Produktkostnad: ${summedPrice} kr`
  }

  // Om det är måndag mellan kl 00.00 och kl 10.00, ge 10% rabatt på hela ordern -----------------KRAV----------------
  const currentTime = new Date()
  if (currentTime.getDay() === 1 && currentTime.getHours() < 10) {
    const discountedPrice = Math.floor(summedPrice * 0.9)
    let saved = Math.ceil(summedPrice * 0.1)
    if (discount)
    discount.innerHTML = `<span class="discount">Måndagsrabatt: 10 % på hela beställningen</span>
    <span class="discount">Du sparar ${saved} kr </span>`
    if (cartTotalPrice)
    cartTotalPrice.innerHTML = `Totalt: ${discountedPrice + shipping} kr`
    sumToCheckout = discountedPrice + shipping
    if (productCost)
    productCost.innerHTML = `Produktkostnad: ${discountedPrice} kr`
  } else {
    if (cartTotalPrice)
    cartTotalPrice.innerHTML = `Totalt: ${summedPrice + shipping} kr`
    sumToCheckout = summedPrice + shipping
  }
  return { sumToCheckout }
}

/**
 * Lägger till flera funktionaliteter till produktantal input rutor
 * @param {*} inputClass Produktlistan eller korglistan ska skickas in
 * @param {*} datasetID Dataset id till inputrutan
 */
const selectAllInputs = (inputClass: string, datasetID: string) => {
  const allAmountInputs = document.querySelectorAll(`.${inputClass}`)

  const updateAmount: (e: Event) => void = e => {
    productArray.forEach(product => {
      // Hitta produkten som inputrutan tillhör
      const target = e.target as HTMLInputElement
      if (Number(target.dataset[datasetID]) == product.id) {
        // Om inputrutans värde ändras till 0 eller mindre i varukorgen, ändra inputrutans värde till 1
        if ((Number(target.value) <= 0) && cartModal?.open) {
          target.value = String(1)
        }
        product.amount = Number(target.value)

        // Uppdatera inputrutans värde på huvudsidan
        const productAmountInput: HTMLInputElement | null = document.querySelector(`.amount-${product.id}`)

        if (productAmountInput) {
          let inputValueAsNumber: number = parseFloat(productAmountInput.value)
          inputValueAsNumber = product.amount
      }

        // Om inputrutans värde på huvudsidan ökas till 1 eller mer -
        if (e.target.value > 0) {
          // Och denna produkt inte redan finns i varukorgen, lägg till produkten i varukorgen
          if (!cartItems.some(item => item.id == e.target.dataset[datasetID])) {
            cartItems.push(product)
          }
          // Och om denna produkt inte redan finns i kopierade varukorgslistan, lägg till produkten i kopierade varukorgslistan
          if (
            !shallowCopyCartItems.some(
              item => item.id == e.target.dataset[datasetID],
            )
          ) {
            shallowCopyCartItems.push({ ...product })
          }
        }
        // Om inputrutans värde blir 0, ta bort produkten från varukorgslistan
        if (e.target.value == 0) {
          const remainingItems = cartItems.filter(
            item => item.id != e.target.dataset[datasetID],
          )
          cartItems = [...remainingItems]
          shallowCopyCartItems = cartItems.map(item => ({ ...item }))
        }
      }
    })
    countTotalPrice()
    renderCartSum()

    totalPrice.classList.add('scale')
    setTimeout(() => totalPrice.classList.remove('scale'), 500) // -------------------KRAV--------------------
  }

  // För varje input, lägg till event lyssnare
  allAmountInputs.forEach(input => {
    // Vid tryck på Enter knappen byt fokus till nästa element (+ knappen)
    input.addEventListener('keyup', event => {
      if (event.key === 'Enter') {
        const allFocusableElements = Array.from(
          document.querySelectorAll('input, button'),
        )
        const currentIndexOfElement = allFocusableElements.indexOf(event.target)
        const nextElement = allFocusableElements[currentIndexOfElement + 1]
        nextElement.focus()
        updateAmount(event)
      }
    })
    // Vid byte av fokus från inputrutan uppdatera produktantalet
    input.addEventListener('blur', updateAmount)
  })
}

selectAllInputs('main', 'id')

/* Skriv ut antal produkter i varukorgen */
const renderCartSum = () => {
  let sum = cartItems.reduce((acc, currItem) => acc + currItem.amount, 0)
  cartAmount.innerHTML = sum
}

/* Filtrera och ta bort produkt från varukorgen */
const removeItem = e => {
  const remainingProducts = cartItems.filter(
    item => item.id != e.target.dataset.id,
  )
  const removedProduct = cartItems.find(item => item.id == e.target.dataset.id)
  cartItems = [...remainingProducts]
  if (cartItems.length == 0) {
    cartModal.close()
  }
  shallowCopyCartItems = cartItems.map(item => ({ ...item }))
  renderCart()
  countTotalPrice()
  renderCartSum()

  // Uppdatera input värde för borttagna produkten på huvudsidan och uppdatera antalet på själva produkten
  selectAllInputs('cart-amount-input', 'cartId')
  productArray.forEach(product => {
    document.querySelector(`.amount-${e.target.dataset.id}`).value =
      product.amount
    if (product.id == removedProduct.id) {
      product.amount = 0
    }
  })
}

//* Kompletteringsfunktion till sidans återställning på checkout.mjs */
export const resetPage = () => {
  cartItems.length = 0
  shallowCopyCartItems.length = 0
  productArray.forEach(p => (p.amount = 0)) // ------------------------------Istället för location.relod()------------
  totalPrice.innerHTML = `Totalt: 0 kr`
  cartAmount.innerHTML = 0
  selectAllInputs('main', 'id')
  const allInputs = document.querySelectorAll('.main')
  allInputs.forEach(input => (input.value = 0))
  footer.classList.remove('hide')
  mainInfo.classList.remove('hide')
  productWrap.classList.remove('hide')
  header.classList.remove('hide')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
