import Vue from 'vue';
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete';
 
Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: 'AIzaSyArWelsnd1AEsKTbSo8Lp6cv3HO7V9PEIo', // Can also be an object. E.g, for Google Maps Premium API, pass `{ client: <YOUR-CLIENT-ID> }`
  version: '3.26', // Optional
});