<template>
	<v-container fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm8 md4>
				<v-card class="elevation-12">
					<v-progress-linear indeterminate v-if="loading"></v-progress-linear>
					<v-toolbar color="transparent" dense class="elevation-0" > 
						<v-toolbar-title>
							Đăng nhập
						</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<v-alert :color="alert.type"  icon="warning" :value="show" outline>
							{{alert.message}}
						</v-alert>
						<v-form>
							<v-text-field 
							color="red accent-3"
							prepend-icon="email" 
							v-model.trim="email"  
							label="Email" 
							type="text" 
							:error-messages="errors.collect('email')"
							v-validate="'required|email'"
							data-vv-name="email" ></v-text-field>

							<v-text-field 
							color="red accent-3"
							prepend-icon="lock" 
							v-model="password" name="password" 
							label="Mật khẩu" 
							id="password" 
							type="password"
							:error-messages="errors.collect('password')"
							v-validate="'required'"
							data-vv-name="password" 
							@keyup.enter="login"></v-text-field>
						</v-form>
						<v-spacer></v-spacer>
						<nuxt-link :to="{path: '/forget-password'}">Quên mật khẩu?</nuxt-link>
					</v-card-text>
					<v-card-actions>
						<v-btn color="red accent-3" dark block :loading="loading" @click.stop.prevent="login">Đăng nhập</v-btn>
					</v-card-actions>
					<v-card-actions>
						<v-layout row wrap justify-center>
							<v-flex xs6>
								Bạn chưa có tài khoản?
								<nuxt-link :to="{path: '/register'}">Đăng ký</nuxt-link>
							</v-flex>
						</v-layout>	
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import {mapState} from 'vuex'
import axios from 'axios'
import Cookies from 'js-cookie'
import {clientID, clientSecret} from '@/env'
import {tokenURL, loginURL} from '@/config'
import {removeToken} from '@/utils/auth'
import vietnam from 'vee-validate/dist/locale/vi';
export default {
	middleware: 'authenticated',
	layout: 'credential',
	asyncData() {
		return {
			email: '',
			password: '',
			loading: false,
			locale: 'vi'
		}
	},
	methods: {
		login() {
			var vm = this
			let data = {email: vm.email, password: vm.password}
			vm.$validator.validateAll().then(async function( result ) {
				if( result ) {
					vm.loading = await !vm.loading
					await axios.post('/api/auth/login', data).then(response => {
						console.log(response)
						if(response.status == 200) {
							if(response.data.type === 'error') {
								vm.$store.dispatch('alert', {name: vm.$route.name, alert:  {show: true, message: response.data.message, type: 'error'}})
							}  else {
								const data = response.data
								vm.$store.commit('SET_TOKEN', data)
								vm.$store.dispatch('getUser').then(response => {
									if(response.data.type == 'success') {
										if(typeof vm.redirect == 'undefined') {
											vm.$router.push({path: '/'})
										} else {
											vm.$router.push({path: vm.redirect})	
										}	
									}
									else if (response.data.type == 'error') {
										vm.$store.commit('REVOKE_TOKEN')
										vm.$store.dispatch('alert', {name: vm.$route.name, alert: {message: response.data.message, type: 'warning'}})
									}

								})
							}
						}
					}).catch(error => {
						if(error.response.status === 401) {
							vm.$store.dispatch('alert', {name: vm.$route.name, alert:  {show: true, message: 'Email hoặc mật khẩu không đúng', type: 'error'}})
						}
					})
					vm.loading = !vm.loading
				}
			})			
		}
	},
	created() {
		this.$validator.localize(this.locale, {
			messages:vietnam.messages,
			attributes: {
				email: 'Email',
				password: 'Mật khẩu'
			}
		})
		this.$validator.localize(this.locale)
	},
	computed: {
		redirect() {
			return this.$route.query.redirect
		},
		...mapState({
			name: state => state.alertStore.name,
			alert: state => state.alertStore.alert
		}), 
		show() {
			if(this.$route.name == this.name && this.alert.show) {
				return true
			}
			return false
		}
	}
}
</script>

<style>

</style>
