import template from '../views/country.html?raw'

const fetchCountry = async country => {
  const url = `${import.meta.env.VITE_API_URL}/name/${country}?fullText=true`

  try {
    const response = await fetch(url)
    const country = await response.json()
    if (country.status && country.status === 404) return null
    return country[0]
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    return null
  }
}

export default () => {
  const divElement = document.createElement('div')
  divElement.innerHTML = template

  const cleanRoute = window.location.hash.replace('#/', '')
  const countryHtml = divElement.querySelector('#country-full__info')

  const createCountry = country => {
    countryHtml.innerHTML = `
      <img class="country-full__info__img" src=${country.flags.png}
      alt=${country.flags.alt} />
      <div class="country-full__info__detail">
        <h4>${country.name.common}</h4>
        <div class="detail">
          <div class="detail__item">
            <p>Native Name:
              <span>
                ${
                  Object.values(country.name.nativeName)[
                    Object.values(country.name.nativeName).length - 1
                  ].common
                }
              </span>
            </p>
            <p>Population: <span>${country.population.toLocaleString()}</span></p>
            <p>Region: <span>${country.region}</span></p>
            <p>Sub Region: <span>${country.subregion}</span></p>
            <p>Capital: <span>${country.capital}</span></p>
          </div>
          <div class="detail__item">
            <p>Top Level Domain: <span>${country.tld[0]}</span></p>
            <p>Currencies:
              <span>
                ${Object.values(country.currencies)[0].name}
              </span>
            </p>
            <p>Languages:
              <span>
                ${Object.values(country.languages).join(', ')}
              </span>
            </p>
          </div>
        </div>
        <p>Border Countries:
          <span>
            ${country.borders ? Object.values(country.borders).join(', ') : ''}
          </span>
        </p>
      </div>
    `
  }

  fetchCountry(cleanRoute).then(createCountry)
  return divElement
}
