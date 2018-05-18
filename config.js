
export const getHeader = function(){
	const tokenData =  JSON.parse(window.localStorage.getItem('jwt'))
	const headers = {
		'Accept': 'application/json',
		'Authorization':'Bearer ' +tokenData.access_token
	}
	return headers
}

export const baseURL            = 'http://localhost:8000'


export const fetchCityURL       = baseURL+'/api/FetchCities'
export const getCityHasDealURL  = baseURL+ '/api/GetCityInformationHasDeal'


export const fetchTypeURL       = baseURL+ '/api/FetchTypes'
//API STORE
export const getStoreURL        = baseURL+ '/api/GetStore'
export const getStoreHasDealURL = baseURL+ '/api/LoadStore'
//API AUTH
export const loginURL           = baseURL+ '/api/login'
export const registerURL        = baseURL+ '/api/register'
export const logoutURL          = baseURL+ '/api/logout'
export const tokenURL           = baseURL+'/oauth/token'
export const getUserURL         = baseURL+ '/api/df'