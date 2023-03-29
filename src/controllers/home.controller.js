import { environment } from '../environments/environment'
import template from '../views/home.html?raw'

const REGIONS = ['Africa', 'America', 'Asia', 'Europe', 'Oceania']
const URL = `${environment.apiUrl}/all?fields=name,flags,population,region,capital`

const fetchCountries = async url => {
  try {
    const response = await fetch(url)
    const countries = await response.json()
    if (countries.status && countries.status === 404) return []
    return countries.slice(0, 40)
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return []
  }
}

export default () => {
  const divElement = document.createElement('div')
  divElement.innerHTML = template

  const countriesHtml = divElement.querySelector('#countries')
  const regionSelect = divElement.querySelector('#region')
  const form = divElement.querySelector('#form')
  const search = divElement.querySelector('#search')

  const createRegionList = () => {
    regionSelect.innerHTML = `
      <option value="" disabled selected hidden>Filter by Region</option>
      ${REGIONS.map(
        region => `
        <option>${region}</option>
      `
      ).join('')}
    `
  }

  const createCountry = countries => {
    const fragment = document.createDocumentFragment()

    countries.forEach(country => {
      const a = document.createElement('a')
      a.classList.add('country')
      a.href = `#/${country.name.common.toLowerCase()}`
      a.innerHTML = `
        <img class="country__img" src=${country.flags.png}
        alt=${country.flags.alt} />
        <div class="country__detail">
          <h3 class="country__detail__name">${country.name.common}</h3>
          <p>Population: <span>${country.population.toLocaleString()}</span></p>
          <p>Region: <span>${country.region}</span></p>
          <p>Capital: <span>${country.capital[0]}</span></p>
        </div>
      `
      fragment.appendChild(a)
    })
    countriesHtml.innerHTML = ''
    countriesHtml.appendChild(fragment)
  }

  const searchCountry = () => {
    regionSelect.addEventListener('change', e => {
      const { value } = e.target
      const url = `${environment.apiUrl}/region/${value.toLowerCase()}`
      if (value) fetchCountries(url).then(createCountry)
    })

    search.addEventListener('input', e => {
      if (e.target.value === '') {
        fetchCountries(URL).then(createCountry)
        regionSelect.value = ''
      }
    })

    form.addEventListener('submit', e => {
      e.preventDefault()
      const { value } = search
      const url = `${environment.apiUrl}/name/${value}?fields=name,flags,population,region,capital`
      fetchCountries(url).then(createCountry)
    })
  }

  createRegionList()
  searchCountry()
  fetchCountries(URL).then(createCountry)

  return divElement
}
