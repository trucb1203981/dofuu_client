<template>
	<div ref="target_store" fluid class="mt-4" v-scroll="onScroll">
		<v-toolbar :fixed="offsetTop>offsetTab" color="white" class="elevation-0 scroll-y"  flat dense style="max-height: 400px" tabs> 
			<v-btn flat :to="{path: '/'}" icon>
				<v-icon>chevron_left</v-icon>
			</v-btn>
			<v-toolbar-title class="red--text text-accent-2" style="width: 300px">
				{{store.name}}
			</v-toolbar-title>
			<v-tabs>
				<v-tabs-slider color="yellow"></v-tabs-slider>
				<v-tab nuxt exact :to="{name: 'city-store', params: {city: $route.params.city, store: $route.params.store}}">
					Thực Đơn
				</v-tab>
				<v-tab nuxt exact :to="{name: 'city-store-about', params: {city: $route.params.city, store: $route.params.store}}">
					Giới thiệu
				</v-tab>
			</v-tabs>
		</v-toolbar>
		<v-layout>
			<v-flex xs1 md3>
				<v-navigation-drawer hide-overlay clipped floating class="transparent">
					<v-container>
						<v-card flat tile>
							<v-card-media :src="image(store.avatar)" height="200">
								<v-content class="text-md-right">
									<v-tooltip top>
										<v-icon slot="activator" :color="store.status_color">radio_button_checked</v-icon>
										<span>{{store.status}}</span>
									</v-tooltip>
								</v-content>
							</v-card-media>
						</v-card>
						<v-list  avatar dense>
							<v-list-tile>
								<v-list-tile-content>
									
									<v-list-tile-title class="title">
										<v-tooltip top>
											<span slot="activator">{{store.name}}</span>
											<span>{{store.name}}</span>
										</v-tooltip>
									</v-list-tile-title>
								</v-list-tile-content>
								<v-list-tile-action>
									<v-tooltip top>
										<v-icon slot="activator" color="primary"  >
											verified_user
										</v-icon> 	
										<span>Chứng nhận hợp tác với dofuu</span>
									</v-tooltip>
								</v-list-tile-action>
							</v-list-tile>
							<v-list-tile>
								<v-list-tile-content>
									<v-list-tile-title>{{store.address}}
									</v-list-tile-title>
								</v-list-tile-content>
							</v-list-tile>
						</v-list>
						<v-divider></v-divider>
						<v-list  avatar dense>
							<v-list-tile>
								<v-list-tile-content>
									<v-list-tile-title><v-icon>alarm</v-icon>
										<span v-for="(item, i) in store.activities" v-if="i==0"> 
											<span v-for="(time, index) in item.times">
												{{time.from}} - {{time.to}} 
											</span>	
											<span :class="{'red--text accent-4--text': status(store.status) == 2, 'green--text accent-4--text': status(store.status) == 1, 'yellow--text accent-4--text': status(store.status) == 3}"><strong><i>({{store.status}})</i></strong></span>
										</span>
										
									</v-list-tile-title>
								</v-list-tile-content>
							</v-list-tile>
							<v-list-tile>
								<v-list-tile-content>
									<v-list-tile-title>
										<v-icon>access_time</v-icon> Chuẩn bị: {{store.prepareTime}} phút
									</v-list-tile-title>
								</v-list-tile-content>
							</v-list-tile>
						</v-list>
					</v-container>	
				</v-navigation-drawer>
			</v-flex>
			<v-flex xs10 md9>
				<nuxt-child :key="$route.params.store" :store.sync="store"/>
			</v-flex>		
		</v-layout>			
	</div>
</template>

<script>
import moment from 'moment'
import Cookies from 'js-cookie'
import axios from 'axios'
import {getStoreURL, getHeader} from '@/config'
import index from '@/mixins/index'
import {mapState} from 'vuex'
export default {
	mixins: [index],
	asyncData({params}) {
		return {
			store: {},
			city: {},
			activeSearch: false,
			offsetTab: 0,
		}
	},
	methods: {
		getStore() {
			const params = {_CID: this.$route.params.city, _SID: this.$route.params.store}
			axios.get(getStoreURL, {params, withCredentials:true}).then(response => {
				if(response.status == 200) {
					this.$store.commit('CHANGE_CITY', parseInt(Cookies.get('flag_c')))
					this.store = response.data.store
					this.$store.commit('UPDATE_CITY', response.data.city)
				}
			})
		},
		onScroll (e) {
			this.$store.commit('ON_SCROLL', window.scrollY)
		}
	},
	computed: {
		...mapState({
			offsetTop: state => state.offsetTop
		})
	},
	created() {
		this.getStore()
	},
	mounted() {
		this.offsetTab = this.$refs.target_store.offsetTop
	}
}
</script>