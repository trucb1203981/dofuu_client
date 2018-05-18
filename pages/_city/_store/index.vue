<template>
	<v-container fluid>
		<v-layout>
			<v-flex xs12 md8>
				<v-card color="white" v-if="store.coupon" flat>
					<v-tooltip v-model="showTooltip" top>
						<div slot="activator"></div>
						<span>{{messageTooltip}}</span>
					</v-tooltip>
					<v-alert outline color="warning" icon="card_giftcard" :value="true" class="py-0">
						<v-card color="transparent" flat>							
							<v-card-title class="pb-0 pl-1">
								<div>
									<div class="title">{{store.coupon.title}}</div>
									<div class="subheading">Nhập mã: <span class="red--text"><strong><u>{{store.coupon.code}}</u></strong></span> để được khuyến mãi {{store.coupon.discount}}%</div>
									<input type="hidden" id="coupon-code" :value="store.coupon.code">
								</div>
							</v-card-title>							
							<v-card-actions  class="pa-0 pb-2">
								<div>Khuyến mãi kết thúc sau <v-icon>alarm</v-icon> 
									<span class="subheading"><strong>{{time.dd}}</strong> Ngày <strong>{{time.hh}} : {{time.mm}} : {{time.ss}} </strong>
									{{start(store.coupon.endedAt)}}</span>
								</div>
								<v-spacer></v-spacer>
								<v-btn small flat @click="copyCode()">
									<v-icon>content_copy</v-icon>
									<span>Sao chép mã</span>
								</v-btn> 								
							</v-card-actions>							
						</v-card>						
					</v-alert>
				</v-card>
				<v-content v-if="menu" v-for="(data, index) in menu" :key="index">
					<v-subheader v-if="data.products.length>0"  :id="'item_'+data.id"><span >{{data.name | upperCase }} ({{data._name | upperCase}})</span></v-subheader>
					<v-card hover class="mb-2" v-for="(item, i) in data.products" :key="i">	
						<v-layout row wrap>
							<v-flex xs12 md5 d-flex>
								<v-card-media :src="image(item.image)" height="200px">
								</v-card-media>
							</v-flex>
							<v-flex xs12 md7 d-flex>
								<v-card-text>
									<h3 class="title">{{item.name}}</h3>
									<span class="grey--text">{{item._name}}</span><br>
									<span v-if="item.description">Mô tả: {{item.description}}</span><br>
									<span class="grey--text">Đã được đặt <strong class="black--text">{{item.count}}</strong> lần</span><br>
								</v-card-text>										
							</v-flex>
							<v-flex xs12 md5 d-flex>
								<v-card-actions>
									<v-btn block color="red accent-2" dark @click.native="addToCart(item)">
										<span>{{item.price | formatPrice}}</span>
										<v-icon>add_shopping_cart</v-icon>
									</v-btn>
								</v-card-actions>
							</v-flex>
						</v-layout>
					</v-card>
				</v-content>
			</v-flex>
			<!-- RIGHT NAVBAR -->
			<v-flex xs12 md4 class="ml-4" ref="target_navbar_right">
				<v-card :class="{'card--sticky' : offsetTop>offsetNavbarRight-50 && !$vuetify.breakpoint.xsOnly}">

					<v-toolbar	color="red"	dark extended flat>
						<v-text-field  prepend-icon="search" label="Tìm kiếm món" solo-inverted class="mx-3" v-model="search" flat/>

						<v-tabs icons-and-text slot="extension" centered :value="`item-${tabIndex}`"   color="transparent">

							<v-tabs-slider color="yellow"></v-tabs-slider>
							
							<v-tab v-for="(tab, index) in tabs" :key="index" @click="changeTab(index)":href="`#item-${index}`" >
								
								{{tab.title}}
								
								<v-badge color="indigo" v-if="index == 1" overlap>
									<span slot="badge" v-if="counts>0">{{counts}}</span>
									<v-icon>shopping_cart</v-icon>						 
								</v-badge>
								
								<v-icon v-if="index == 0">assignment</v-icon>
							
							</v-tab>

						</v-tabs>

					</v-toolbar>

					<v-card-text v-if="tabIndex==0">
						<v-list>
							<v-list-tile v-for="item in store.catalogues" v-if="item.products.length>0" @click="goTo('#item_'+item.id)" :key="item.name">
								<v-list-tile-content>
									<v-list-tile-title>
										{{item.name}}
									</v-list-tile-title>
									<v-list-tile-sub-title>
										{{item._name}}
									</v-list-tile-sub-title>
								</v-list-tile-content>
							</v-list-tile>
						</v-list>
					</v-card-text>
					<v-card v-else-if="tabIndex==1" class="transparent">
						<v-layout row wrap align-center class="pt-2 grey lighten-2 pb-2">
							<v-data-table v-if="cart && cart.items.length>0" :items="cart.items" class="elevation-1 scroll-y" hide-actions hide-headers style="max-height:280px; overflow-x:hidden">
								<template slot="items" slot-scope="props">
									<td class="text-xs-left">{{props.item.name}}</td>
									<td>
										<v-layout column justify-center>
											<v-flex md2 d-flex>
												<v-btn icon ripple @click.stop="addToCart(props.item)">
													<v-icon color="green">add_box</v-icon>
												</v-btn>
											</v-flex>
											<v-flex md2 d-flex class="justify-center">
												{{props.item.qty}}x
											</v-flex>
											<v-flex md2 d-flex>
												<v-btn icon ripple @click.stop="minusToCart(props.item)">
													<v-icon color="grey" >indeterminate_check_box</v-icon>
												</v-btn>
											</v-flex>
										</v-layout>
									</td>
									<td>{{props.item.price | formatPrice}}</td>
								</template>
							</v-data-table>
						</v-layout>
						<v-divider></v-divider>
						<v-layout row wrap>
							<v-flex	xs12 sm12 md12 lg12>
								<v-list dense> 
									<v-list-tile>
										<v-list-tile-content>Tổng:</v-list-tile-content>
										<v-list-tile-content class="align-end">{{subTotal | formatPrice}}</v-list-tile-content>
									</v-list-tile>
									<v-list-tile>
										<v-list-tile-content>
											<span>Phí vận chuyển: <v-icon size="20" color="primary" @click="">help</v-icon></span>
										</v-list-tile-content>
										<v-list-tile-action class="align-end">
											<span>  {{0 | formatPrice}} </span>
										</v-list-tile-action>
									</v-list-tile>
								</v-list>
							</v-flex>
						</v-layout>
						<v-divider></v-divider>
						<v-card-actions>
							<v-btn block :disabled="!cart || cart.items.length==0" color="red accent-2 white--text" dense @click.native="checkOut">
								Gửi đơn hàng
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-card>			
			</v-flex>
		</v-layout>
		<vue-dialog :store.sync="store"></vue-dialog>
	</v-container>
</template>

<script>
import Cookies from 'js-cookie'
import moment from 'moment'
import axios from 'axios'
import {getStoreURL, getHeader} from '@/config'
import index from '@/mixins/index'
import {mapState} from 'vuex'
const CheckoutDialog = () => ({
  // The component to load (should be a Promise)
  component: import('@/components/CheckoutDialog'),
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
})
export default {
	props: ['store'],
	mixins: [index],
	components: {
		'vue-dialog' :CheckoutDialog
	},
	asyncData() {
		return {
			duration: 300,
			offset: 0,
			easing: 'easeInOutCubic',
			offsetNavbarRight: 0,
			bag: {
				intance: 20,
				items: []
			},
			time: {
				dd:0,
				hh:0,
				mm:0,
				ss:0
			},
			showTooltip: false,
			messageTooltip: '',
			storeInfo: null,
			search: ''
		}
	},
	methods: {
		// SCROLLING TO CATALOGUE
		goTo: function (target) {
			this.$vuetify.goTo(target, this.options)
		},
		//SET TIMEOUT AT END TIME FOR COUPON
		start: function (date) {
			setTimeout(() => {
				let timeNow   = new Date().getTime()
				
				let endedTime = new Date(date).getTime()				
				
				let distance  = Math.floor(endedTime - timeNow)/1000
				
				let day       = Math.floor(distance / (60 * 60 * 24));
				
				let hour      = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
				
				let minutes   = Math.floor((distance % (60 * 60)) / 60);
				
				var seconds   = Math.floor(distance % (60));
				
				this.time     = {dd: day, hh: hour, mm: minutes, ss: seconds}
			}, 1000)
		},
		// ADD ITEM TO CART
		addToCart: function (product) {
			const productIndex  = this.cart.items.findIndex(item => {
				return item.id === product.id
			})
			if (productIndex > -1) {
				this.cart.items[productIndex].qty++
			} else {
				product.qty = 1
				this.cart.items.push(product)
			}
			this.$store.commit('FETCH_CART', this.cart)
			window.localStorage.setItem('cart', JSON.stringify(this.cart))
		},
		// MINUS ITEM TO CART
		minusToCart: function (product) {
			const productIndex = this.cart.items.findIndex(item => {
				return item.id === product.id
			})
			if (productIndex > -1) {
				if (this.cart.items[productIndex].qty > 1){
					this.cart.items[productIndex].qty--
				} else if (this.cart.items[productIndex].qty == 1) {
					this.cart.items.splice(productIndex, 1)	
				}
				this.$store.commit('FETCH_CART', this.cart)
				window.localStorage.setItem('cart', JSON.stringify(this.cart))
			} 
		},
		//CHANGE TAB RIGHT NAVBAR
		changeTab (index) {
			if (this.tabIndex === index) {
				return false
			}
			this.$store.commit('CHANGE_TAB', index)
		},
		//COPY DEAL CODE
		copyCode() {
			var vm = this
			let code = document.querySelector('#coupon-code')
			code.setAttribute('type', 'text')

			code.select()

			try {
				var successful = document.execCommand('copy');
				this.messageTooltip = successful ? 'Sao chép mã khuyến mãi thành công' : 'Sao chép mã khuyến mãi thất bại'
			} catch (error) {
				this.messageTooltip = 'Không thể sao chép mã khuyến mãi'
			}
			code.setAttribute('type', 'hidden')
			window.getSelection().removeAllRanges()
			vm.showTooltip = !vm.showTooltip

			setTimeout(() => {
				vm.showTooltip = !vm.showTooltip
			}, 1000)
			
		},
		//CHECK OUT CART
		checkOut () {
			var vm = this
			vm.$store.dispatch('getUser').then(response => {
				if(response.status == 200) {
					vm.$store.commit('SHOW_CHECKOUT')
				}
			}).catch(error => {
				vm.$router.push({name: 'login', query: {redirect: this.$route.path}})
			})
		},
		getByKeyWords: function(list, value) {
			let search = new String(value).toLowerCase()
			let data   = list
			if(!search.length) {
				return data
			}
			let temp   = data.map(item => {
				let product = item.products.filter(product => product.name.toLowerCase().indexOf(search) > -1)
				if(product.length>0) {
					return product
				}
			})
			return new Array(temp)
		}
	},
	computed: {
		...mapState({
			offsetTop: state => state.offsetTop,
			tabIndex: state  => state.storeStore.tabIndex,
			tabs: state      => state.storeStore.headers,
			cart: state      => Object.assign({}, state.cartStore.cart),
			isAuth: state    => state.authStore.isAuth,
			show: state      => state.cartStore.show
		}),
		options: function() {
			return {
				duration: this.duration,
				offset: this.offset,
				easing: this.easing
			}
		},
		//COUNT ITEM IN CART
		counts() {
			return this.$store.getters.counts
		},
		//SUBTOTAL PRICE ALL ITEM IN CART
		subTotal() {
			return this.$store.getters.subTotal
		},
		menu: function () {
			if(this.store.catalogues) {
				return this.getByKeyWords(this.store.catalogues, this.search)
				// var temp = this.getByKeyWords(this.store.catalogues, 'Trà sữa đài loan')
				// console.log(temp)
				// return temp
			}
		}
	},
	watch: {
		'store': function(val, oldVal) {
			this.$store.dispatch('getToCart', val.id)
		}
	},
	mounted: async function() {		
		this.offsetNavbarRight = this.$refs.target_navbar_right.offsetTop
	},
	beforeDestroy() {
		this.$store.commit('CLOSE_CHECKOUT')
	}
}
</script>
<style scoped>
.card--sticky {
	position: fixed;
	right: 16px;
	top: 50px;
	bottom: auto;
	width: 318.578px
}
</style>