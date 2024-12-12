import {
  countTotalPrice,
  shipping,
  shallowCopyCartItems,
  resetPage,
  formSection,
} from './main.mjs'

// Definerade variabler
export const header = document.querySelector('header')
const checkoutItems = document.querySelector('.checkout')
const form = document.querySelector('.form')
const name = document.querySelector('.form__name')
const lastname = document.querySelector('.form__lastname')
const street = document.querySelector('.form__street')
const postcode = document.querySelector('.form__postcode')
const doorcode = document.querySelector('.form__doorcode')
const city = document.querySelector('.form__city')
const mobilePhone = document.querySelector('.form__phone')
const email = document.querySelector('.form__email')
const paymentCard = document.querySelector('input.form__payment-card')
const paymentInvoice = document.querySelector('input.form__payment-invoice')
const identityNumber = document.querySelector('.form__person-id')
const identity = document.querySelector('.pers-id')
const cardInfo = document.querySelector('.form__card')
const resetOrder = document.querySelector('.form__reset')
const checkoutTotal = document.querySelector('.checkout__total')
const invoiceOverLimit = document.querySelector('.over-limit')
const hardResetWarning = document.querySelector('.form__hard-reset')
const hardResetBtn = document.querySelector('.form__hard-reset-btn')
const closeCheckoutModal = document.querySelector('.form__modal--close')
const formSubBtn = document.querySelector('.form__submit')
const orderInfo = document.querySelector('.order-info')
const srSuccessMsg = document.querySelector('#success-sr')
const themeToggleBtn = document.querySelector('.theme-toggle')

// RegEx regler
const nameCheck = /^[A-Za-zÅÄÖåäö]{2,}$/
const lastnameCheck = /^[A-Za-zÅÄÖåäö]{2,}$/
const streetCheck = /^[A-Za-zÅÄÖåäö\s-]+ [0-9]{1,5}[A-Za-z]?$/
const postcodeCheck = /^[0-9]{3}\s?[0-9]{2}$/
const doorcodeCheck = /^\d{3,10}$/ // 3-10 siffror
const cityCheck = /^[A-Za-zÅÄÖåäö]{2,}([- ]?[A-Za-zÅÄÖåäö]{2,})*$/
const mobilePhoneCheck = /^(?:\+46|0)(\d{1,3})[\s-]?(\d{3})[\s-]?(\d{4})$/

const emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const persIdCheck = /^\d{8}-?\d{4}$/

// Avbryt formuläret från att skickas
form.addEventListener('submit', e => {
  e.preventDefault()
})

/**
 * Validera angivna input och sätt dataset.valid till sant eller falskt för att aktivera/avaktivera submit knapp
 * @param {*} el input som ska valideras
 * @param {*} value inputs värde som skrivits in
 * @param {*} regEx Reguljärt uttrycksmönster för specifika angivna input
 * @return {*}
 */ // Validera alla krävda inputs --------------------------------------------------------------------------KRAV--------------------
const validateInput = (el, value, regEx) => {
  let result = regEx.exec(value)
  if (value !== '') {
    if (!result) {
      el.classList.remove('input-border')
      el.classList.add('invalid-input-border')
      el.setAttribute('aria-invalid', 'true')
      el.closest('label').querySelector('.inputError').innerHTML = 'Ogiltig'
      // el.closest('label').querySelector('.inputError').style.color = 'red'
      el.closest('label')
        .querySelector('.inputError')
        .classList.remove('valid-input-color')
      el.closest('label')
        .querySelector('.inputError')
        .classList.add('invalid-input-color')
      el.dataset.valid = 'false'
    } else if (result) {
      el.classList.remove('invalid-input-border')
      el.classList.add('input-border')
      el.setAttribute('aria-invalid', 'false')
      el.closest('label').querySelector('.inputError').innerHTML = 'Ok'
      el.closest('label')
        .querySelector('.inputError')
        .classList.remove('invalid-input-color')
      el.closest('label')
        .querySelector('.inputError')
        .classList.add('valid-input-color')
      el.dataset.valid = 'true'
    }
  } else if (value == '') {
    el.classList.remove('invalid-input-border')
    el.setAttribute('aria-invalid', 'false')
    el.closest('label').querySelector('.inputError').innerHTML = ''
    el.dataset.valid = 'false'
  }
  validateForm()
  if (result) {
    return result[0].toString()
  }
}

// Alla krävda formulärfält
let requiredInputs = [
  name,
  lastname,
  street,
  postcode,
  city,
  mobilePhone,
  email,
]

// Lägg till input validation för namn
let validName
const nameError = document.querySelector('#nameError')
name.addEventListener('input', e => {
  e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '')
})
name.addEventListener('blur', e => {
  const value = e.target.value.trim()
  validName = validateInput(e.target, value, nameCheck)
  if (value !== '' && !validName) {
    nameError.textContent = 'Ange minst 2 bokstäver'
    name.setAttribute('aria-describedby', 'nameError')
  } else {
    nameError.textContent = ''
    name.removeAttribute('aria-describedby')
  }
})

// Lägg till input validation för efternamn
let validLastName
const lastnameError = document.querySelector('#lastnameError')
lastname.addEventListener('input', e => {
  e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '')
})
lastname.addEventListener('blur', e => {
  const value = e.target.value.trim()
  validLastName = validateInput(e.target, value, lastnameCheck)
  if (value !== '' && !validLastName) {
    lastnameError.textContent = 'Ange minst 2 bokstäver'
    lastname.setAttribute('aria-describedby', 'lastnameError')
  } else {
    lastnameError.textContent = ''
    lastname.removeAttribute('aria-describedby')
  }
})

// Lägg till input validation för gata
let validStreet
const streetError = document.querySelector('#streetError')
street.addEventListener('blur', e => {
  const value = e.target.value.trim()
  validStreet = validateInput(e.target, value, streetCheck)
  if (value !== '' && !validStreet) {
    streetError.textContent = 'Ange gatan'
    street.setAttribute('aria-describedby', 'streetError')
  } else {
    streetError.textContent = ''
    street.removeAttribute('aria-describedby')
  }
})

// Lägg till input validation för postkod och filtrera bort bokstäver
let validPostcode
const postcodeError = document.querySelector('#postcodeError')
postcode.addEventListener(
  'input',
  e => (e.target.value = e.target.value.replace(/[^0-9\s]/g, '')),
)
postcode.addEventListener('blur', e => {
  const value = e.target.value.trim()
  validPostcode = validateInput(e.target, value, postcodeCheck)
  if (value !== '' && !validPostcode) {
    postcodeError.textContent = 'Ange postnummer med 5 siffror'
    postcode.setAttribute('aria-describedby', 'postcodeError')
  } else {
    postcodeError.textContent = ''
    postcode.removeAttribute('aria-describedby')
  }
})

// Lägg till input validation för dörrkod och filtrera bort bokstäver
let validDoorcode
const doorcodeError = document.querySelector('#doorcodeError')
doorcode.addEventListener(
  'input',
  e => (e.target.value = e.target.value.replace(/[^0-9\s]/g, '')),
)
doorcode.addEventListener('blur', e => {
  const value = e.target.value.trim()
  validateInput(e.target, value, doorcodeCheck)
  if (value !== '' && !validDoorcode) {
    doorcodeError.textContent = 'Ange portkod med 3 till 10 siffror'
    doorcode.setAttribute('aria-describedby', 'doorcodeError')
  } else {
    doorcodeError.textContent = ''
    doorcode.removeAttribute('aria-describedby')
  }
})

// Lägg till input validation för stad
let validCity
const cityError = document.querySelector('#cityError')
city.addEventListener('input', e => {
  e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '')
})
city.addEventListener('blur', e => {
  const value = e.target.value.trim()
  validCity = validateInput(e.target, value, cityCheck)
  if (value !== '' && !validCity) {
    cityError.textContent = 'Ange stad'
    city.setAttribute('aria-describedby', 'cityError')
  } else {
    cityError.textContent = ''
    city.removeAttribute('aria-describedby')
  }
})

// Lägg till input validation för mobil och filtrera bort bokstäver
let validPhone
const phoneError = document.querySelector('#phoneError')
mobilePhone.addEventListener(
  'input',
  e => (e.target.value = e.target.value.replace(/[^0-9\s]/g, '')),
)
mobilePhone.addEventListener('blur', e => {
  const value = e.target.value.trim()
  validPhone = validateInput(e.target, value, mobilePhoneCheck)
  if (value !== '' && !validPhone) {
    phoneError.textContent = 'Ange telefonnummer med minst 10 siffror'
    mobilePhone.setAttribute('aria-describedby', 'phoneError')
  } else {
    phoneError.textContent = ''
    mobilePhone.removeAttribute('aria-describedby')
  }
})

// Lägg till input validation för email
let validEmail
const emailError = document.querySelector('#emailError')
email.addEventListener('blur', e => {
  const value = e.target.value.trim()
  validEmail = validateInput(e.target, value, emailCheck)
  if (value !== '' && !validEmail) {
    emailError.textContent = 'Ange en giltig epostadress'
    email.setAttribute('aria-describedby', 'emailError')
  } else {
    emailError.textContent = ''
    email.removeAttribute('aria-describedby')
  }
})

// Lägg till input validation för personkod och filtrera bort bokstäver
let validIdentity
const identityError = document.querySelector('#identityError')
identity.addEventListener(
  'input',
  e => (e.target.value = e.target.value.replace(/[^0-9\s-]/g, '')),
)
identity.addEventListener('blur', e => {
  const value = e.target.value.trim()
  validIdentity = validateInput(e.target, value, persIdCheck)
  if (value !== '' && !validIdentity) {
    identityError.textContent = 'Ange svenskt personnummer med 12 siffror'
    identity.setAttribute('aria-describedby', 'identityError')
  } else {
    identityError.textContent = ''
    identity.removeAttribute('aria-describedby')
  }
})

/*  */
export const validateForm = () => {
  // Lägg till eller ta bort personnummer från formulärets kravlista
  if (paymentInvoice.checked) {
    if (requiredInputs.every(item => item !== identity)) {
      requiredInputs.push(identity)
    }
  } else if (paymentCard.checked) {
    requiredInputs = requiredInputs.filter(item => item !== identity)
  }
  // Om alla krävda formulär är rätt ifyllda, aktivera beställ knappen -----------------KRAV---------------
  if (requiredInputs.every(input => input.dataset.valid === 'true')) {
    formSubBtn.disabled = false
    formSubBtn.style.backgroundColor = 'rgb(255, 119, 142)'
  } else {
    formSubBtn.disabled = true
    formSubBtn.style.backgroundColor = 'gray'
    formSubBtn.setAttribute('title', 'form not complete')
  }
}

// Om kortbetalning väljs, göm persson nummer input
paymentCard.addEventListener('change', e => {
  if (e.target.checked) {
    identity.required = false
    cardInfo.classList.remove('hide')
    identityNumber.classList.add('hide')
    validateForm()
  }
})

// Om faktura betalning väljs, göm kortbetalnings inputs
paymentInvoice.addEventListener('change', e => {
  if (e.target.checked) {
    cardInfo.classList.add('hide')
    identityNumber.classList.remove('hide')
    identity.required = true
    identity.setAttribute('aria-required', 'true')
    validateForm()
  }
})

// Lägg till rätt klasser till kort/faktura betalning vid form reset och återställ all data
resetOrder.addEventListener('click', () => {
  hardResetWarning.showModal()
})

// Stäng checkout dialogen med tillbaka knapp
closeCheckoutModal.addEventListener('click', e => {
  e.preventDefault()
  hardResetWarning.close()
})

export const renderCheckout = () => {
  // Hämtad ordersumma från main.mjs
  const { sumToCheckout } = countTotalPrice()

  // Göm theme toggle knapp
  themeToggleBtn.classList.add('hide')

  // Göm header
  header.classList.add('hide')
  // Visa produkter som ligger i varukorgen
  checkoutItems.innerHTML = ''
  shallowCopyCartItems.forEach(p => {
    let price = p.amount * p.price
    price = Math.floor(price)
    checkoutItems.innerHTML += `
        <div class="checkout__item flex font-bold justify-start items-center gap-3 full">
          <img class="checkout__image" src="${p.image}" alt="Bild på munk med ${p.name} smak" width="1024" height="1024>
          <span class="checkout__name">${p.name}</span>
          <span class="checkout__amount">x ${p.amount}</span>
          <span class="checkout__price" data-id="${p.id}">${price} kr</span>
        </div>
      `
    // Om det finns minst 10 av samma smak, ändra prisets färg till röd
    const allSpans = document.querySelectorAll('.checkout__price')
    allSpans.forEach(span => {
      if (span.dataset.id == p.id && p.amount >= 10) {
        span.style.color = 'red'
      }
    })
  })

  /* Starta timer för att rensa formuläret om den inte har skickats iväg innan 15min */ //------------KRAV--------------------
  const setResetForm = () => {
    setTimeout(() => {
      alert('Beställing tog för lång tid, formuläret har rensats.')
      location.reload()
    }, 900000)
  }

  // Om ordersumman överstiger 800kr, gör faktura ej valbar ------------------KRAV---------------------------
  if (sumToCheckout > 800) {
    paymentInvoice.disabled = true
    paymentInvoice.setAttribute('aria-disabled', 'true')
    paymentInvoice.setAttribute('aria-describedby', 'overLimit')
    invoiceOverLimit.classList.remove('hide')
    cardInfo.classList.remove('hide')
    identityNumber.classList.add('hide')
    paymentCard.checked = true
  } else {
    paymentInvoice.setAttribute('aria-disabled', 'false')
    paymentInvoice.disabled = false
    paymentInvoice.removeAttribute('aria-describedby')
    invoiceOverLimit.classList.add('hide')
  }
  checkoutTotal.innerHTML = `
  <span class="checkout-price font-bold mt-3" >Produktkostnad: ${sumToCheckout - shipping} kr</span>
  <span class="font-bold">Fraktkostnad: ${shipping} kr</span>
  <span class="font-bold">Totalt: ${sumToCheckout} kr</span>
  `
  setResetForm()
  const currentTime = new Date()
  const checkoutPrice = document.querySelector('.checkout-price')
  if (currentTime.getDay() === 1 && currentTime.getHours() < 10) {
    checkoutPrice.textContent = `Produktkostnad efter 10% rabatt ${sumToCheckout - shipping} kr`
    checkoutPrice.classList.add('discounted')
  }
}

// Bekräftelseruta för gjord beställning  ---------------------------KRAV---------------------
let modalOpen = false
formSubBtn.addEventListener('click', () => {
  // Meddelande för skärmläsare vid skickad formulär
  srSuccessMsg.textContent = 'Order mottagen'
  orderInfo.showModal()
  // Låt inte orderbekräftelse modalen stängas med Escape
  orderInfo.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      e.preventDefault()
    }
  })
  modalOpen = true
  orderInfo.innerHTML = `
  <h2>Tack för beställningen!</h2>
  <span>Leveranstid 30-45 minuter</span>
  <div class="flex flex-col items-center" >
    <h3>Beställarens info:</h3>
    <span>${validName.toLowerCase()} ${validLastName.toLowerCase()}</span>
    <span>${validStreet.toLowerCase()}</span>
    <span>${validPostcode} ${validCity.toLowerCase()}</span>
    <span>${validPhone}</span>
    <span>${validEmail}</span>
  </div>
  <button class="form__submitted form__button" aria-label="Återgå till sidans start">Ok</button>
  `
  // Återställ hela sidan när order bekräftelserutan stängs
  const formSubmitted = document.querySelector('.form__submitted')
  if (modalOpen === true) {
    formSubmitted.addEventListener('click', () => {
      location.href = 'index.html'
    })
  }
})

// Återställ hela sidan med knappen från checkout modal --------------------------------KRAV----------------
hardResetBtn.addEventListener('click', () => {
  themeToggleBtn.classList.remove('hide')
  form.reset()
  form.querySelectorAll('input').forEach(input => {
    input.removeAttribute('aria-describedby')
    input.removeAttribute('aria-invalid')
    input.removeAttribute('data-valid')
    input.style.border = '1px solid rgb(255, 119, 142)'
    document
      .querySelectorAll('.inputError')
      .forEach(error => (error.innerHTML = ''))
  })
  resetPage()
  hardResetWarning.close()
  formSection.classList.add('hide')
})
