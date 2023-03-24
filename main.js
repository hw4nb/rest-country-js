'use strict'

const URL =
	'https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital'

const REGIONS = ['Africa', 'America', 'Asia', 'Europe', 'Oceania']

const countriesHtml = document.querySelector('.countries')
const regionSelect = document.querySelector('.region')

const form = document.querySelector('.form')
const search = document.querySelector('#search')

const fetchData = async url => {
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
		a.classList.add('country-card')
		a.href = `#/${country.name.common.toLowerCase()}`
		a.innerHTML = `
      <img class="country-img" src="${country.flags.png}" alt="${country.flags.alt}">
      <div class="country-detail">
        <h3 class="country-name">${country.name.common}</h3>
        <p>Population: <span>${country.population}</span></p>
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
		const {value} = e.target
		const url = `https://restcountries.com/v3.1/region/${value.toLowerCase()}`
		if (value) fetchData(url).then(createCountry)
	})

	search.addEventListener('input', e => {
		if (e.target.value === '') {
			fetchData(URL).then(createCountry)
			regionSelect.value = ''
		}
	})

	form.addEventListener('submit', e => {
		e.preventDefault()
		const {value} = search
		const url = `https://restcountries.com/v3.1/name/${value}?fields=name,flags,population,region,capital`
		fetchData(url).then(createCountry)
	})
}

createRegionList()
searchCountry()
fetchData(URL).then(createCountry)
