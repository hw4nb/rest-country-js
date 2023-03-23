'use strict'

const URL =
  'https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital'

const countriesHtml = document.querySelector('.countries')
const form = document.querySelector('.form')
const search = document.querySelector('#search')

const fetchData = async (url) => {
  try {
    const response = await fetch(url)
    const countries = await response.json()
    if (countries.status && countries.status === 404) return []
    return countries.slice(0, 20)
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return []
  }
}

const createCountry = (countries) => {
  const fragment = document.createDocumentFragment()
  countries.forEach((country) => {
    const div = document.createElement('div')
    div.classList.add('country-card')
    div.innerHTML = `
      <img class="country-img" src="${country.flags.png}" alt="${country.flags.alt}">
      <div class="country-detail">
        <h3 class="country-name">${country.name.common}</h3>
        <p>Population: <span>${country.population}</span></p>
        <p>Region: <span>${country.region}</span></p>
        <p>Capital: <span>${country.capital[0]}</span></p>
      </div>
    `
    fragment.appendChild(div)
  })
  countriesHtml.innerHTML = ''
  countriesHtml.appendChild(fragment)
}

const searchCountry = () => {
  search.addEventListener('input', (e) => {
    if (e.target.value === '') {
      fetchData(URL).then(createCountry)
    }
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const { value } = search
    const url = `https://restcountries.com/v3.1/name/${value}?fields=name,flags,population,region,capital`
    fetchData(url).then(createCountry)
  })
}

fetchData(URL).then(createCountry)
searchCountry()
