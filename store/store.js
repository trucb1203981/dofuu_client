import axios from 'axios'
import Cookies from 'js-cookie'
import Cookie from 'cookie'
import CookieParser from 'cookieparser'

const state = {
	tabIndex:0,
	headers: [
	{title: 'Danh mục'},
	{title: 'Giỏ hàng'}
	]
}

const mutations = {
	CHANGE_TAB(state, tabIndex) {
		if(state.tabIndex != tabIndex ){
			state.tabIndex = tabIndex
		}
	}
}

const actions = {

}

const getters = {
}

export default {
	state, mutations, actions, getters
}