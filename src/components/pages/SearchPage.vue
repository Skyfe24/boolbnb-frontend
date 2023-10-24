<script>

import axios from 'axios';
import { getForm } from '@/assets/data/sharedDataService.js';

const searchForm = {
  place: { address: '', lon: null, lat: null },
  radius: '20',
  minBeds: '1',
  minRooms: '1',
  services: {}
};
export default {
  name: 'EstateDetail',
  data() {
    return {
      form: searchForm,
      services: [],
      filteredEstates: [],
      addressTimeoutId: null,
      filtersTimeoutId: null,
      suggestedAddresses: [],
      isAddressSelected: false,
      formLoading: false
    }
  },
  components: {},
  props: {},
  computed: {
    isAddressFieldEmpty() {
      if (!this.form.place.address) {
        this.suggestedAddresses = [];
        return true;
      }
      return false;
    },
    filteredEstatesReady() {
      return Boolean(this.filteredEstates.length);
    },
    isFilterReset() {
      if (this.form.place.address == '' &&
        this.form.radius == '20' &&
        this.form.minRooms == '1' &&
        this.form.minBeds == '1' &&
        Object.keys(this.form.services).length === 0) {
        return true;
      }
      return false;
    }
  },
  methods: {
    toEstateDetail(estateId) {
      this.$router.push({ name: 'estate-detail', params: { id: estateId } });
    },
    getImagePath(image) {
      const url = image.url;
      return `http://127.0.0.1:8000/storage/${url}`;
    },

    fetchServices() {
      this.filteredEstates = [];
      const endpoint = 'http://127.0.0.1:8000/api/services';
      axios.get(endpoint)
        .then(res => {
          this.services = res.data;
          console.log('services: ', this.services);
          this.services.forEach(service => {
            this.form.services[service.label] = false;
          });
        })
        .catch(err => { console.error(err) })
    },
    sendForm() {
      this.formLoading = true;
      this.filteredEstates = [];
      const endpoint = 'http://127.0.0.1:8000/api/estates/filter';
      axios.post(endpoint, this.form)
        .then(res => {
          this.filteredEstates = res.data;
          console.log('RESULTS: ', this.filteredEstates);
        })
        .catch(err => { console.error(err) })
        .then(() => { this.formLoading = false; })
    },
    fetchAddress(address) {
      const baseUri = 'https://api.tomtom.com/search/2/search/';
      const params = '.json?limit=5&countrySet=IT';
      const apiKey = '&key=GhG6A9t2m9I7jUfG0xLAixmH1Nk7leZa';

      if (this.isAddressFieldEmpty || this.isAddressSelected) return;

      clearTimeout(this.addressTimeoutId);
      this.addressTimeoutId = setTimeout(() => {
        const endpoint = `${baseUri}${address}${params}${apiKey}`;
        this.suggestedAddresses = [];

        axios.get(endpoint)
          .then(res => {
            const results = res.data.results;
            results.forEach(result => {
              this.suggestedAddresses.push(result);
            })
          })
      }, 500);
    },
    selectPlace(address) {
      this.suggestedAddresses = [];
      this.form.place.address = address.address.freeformAddress;
      this.form.place.lon = address.position.lon;
      this.form.place.lat = address.position.lat;
      this.isAddressSelected = true;
      document.getElementById('searchAddress').setAttribute('readonly', 'readonly');
      this.sendForm();
    },
    autoSelectPlace(query) {
      if (query) {
        this.suggestedAddresses = [];
        this.form.place.address = query.place.address;
        this.form.place.lon = query.place.lon;
        this.form.place.lat = query.place.lat;
        document.getElementById('searchAddress').setAttribute('readonly', 'readonly');
        this.isAddressSelected = true;
        this.sendForm();
      }
      else {
        this.resetAddress();
      }
    },
    filtersChanged() {
      clearTimeout(this.filtersTimeoutId);
      this.filtersTimeoutId = setTimeout(() => {
        console.log('clicked');
        if (this.isAddressSelected) this.sendForm();
      }, 250);
    },
    servicesChanged() {
      if (this.isAddressSelected) this.sendForm();
    },
    resetAddress() {
      this.filteredEstates = [];
      this.form.place.address = '';
      this.form.place.lon = null;
      this.form.place.lat = null;
      this.isAddressSelected = false;
      document.getElementById('searchAddress').removeAttribute('readonly');
      document.getElementById('searchAddress').focus();
    },
    printDistance(distance) {
      return distance.toFixed(2);
    },
    initForm() {
      this.resetAddress();
      this.form.radius = '20';
      this.form.minRooms = '1';
      this.form.minBeds = '1';
      this.form.services = {};
    },
    checkRoute() {
      if (this.$route.query.redirect != 'home') return;
      const query = getForm();
      console.log('QUERY: ', query);
      this.autoSelectPlace(query);
    }
  },
  mounted() {
    this.form.place.address = '';
    this.checkRoute();
    this.fetchServices();
  }
}
</script>

<template>
  <section class="searchPage">
    <div class="container">
      <!-- Title -->
      <h2 class="my-3">Ricerca Avanzata</h2>

      <div class="card">
        <div class="card-body">
          <!-- SearchForm -->
          <form method="POST" @submit.prevent="false">
            <div class="row justify-content-center">
              <!-- address -->
              <div class="col-sm-12 col-lg-8 mb-3">
                <div class="addresses">
                  <label for="searchAddress" class="form-label">Cerca un indirizzo o una città</label>
                  <div class="d-flex align-items-center position-relative">
                    <input id="searchAddress" type="text" class="form-control"
                      placeholder="Inizia a scrivere un indirizzo" v-model="form.place.address"
                      @keyup="fetchAddress($event.target.value)" autocomplete="off">
                    <div v-if="isAddressSelected" @click="resetAddress()"><font-awesome-icon class="btn closeIcon"
                        icon="fa-solid fa-xmark" /></div>
                  </div>
                </div>
                <div class="position-relative">
                  <div v-if="!isAddressFieldEmpty" class="suggestedAddresses">
                    <ul class="list-group">
                      <li v-for="address in suggestedAddresses" :key="address.id" @click="selectPlace(address)"
                        class="liAddress list-group-item">
                        <div class="suggestedAddress">{{ address.address.freeformAddress }}</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- radius -->
              <div class="col-sm-6 col-lg-2 mb-3">
                <label for="range" class="form-label mb-3">Nel raggio di {{ form.radius }} Km</label>
                <input type="range" class="" min="10" max="40" step="5" id="range" v-model="form.radius"
                  @input="filtersChanged">
              </div>

              <!-- min rooms -->
              <div class="col-sm-3 col-lg-1 mb-3">
                <label for="minRooms" class="form-label">Stanze</label>
                <input id="minRooms" type="tel" class="form-control" placeholder="Min. Stanze" v-model="form.minRooms"
                  @keyup="filtersChanged">
              </div>

              <!-- min beds -->
              <div class="col-sm-3 col-lg-1 mb-3">
                <label for="minBeds" class="form-label">Letti</label>
                <input id="minBeds" type="tel" class="form-control" placeholder="Min. Camere" v-model="form.minBeds"
                  @keyup="filtersChanged">
              </div>

              <!-- services -->
              <div class="col-sm-8 col-md-12 text-center mb-3">
                <h4 class="py-3">Seleziona i servizi che desideri</h4>
                <div v-for="service in services" :key="service.id" class="form-check form-check-inline">
                  <input :id="service.label" class="btn-check" type="checkbox" v-model="form.services[service.label]"
                    @change="servicesChanged">
                  <label :for="service.label"><font-awesome-icon
                      :class="['iconService', { 'iconSelected': form.services[service.label] }]"
                      :icon="'fa-solid fa-' + service.icon" /></label>
                </div>
              </div>

              <!-- Button -->
              <div class="d-flex align-items-center justify-content-center my-3">
                <button id="resetFormBtn" type="button" class="btn" @click="initForm" :disabled="isFilterReset">
                  <span><font-awesome-icon icon="fa-solid fa-rotate" /> Reset</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="search">
        <AppLoader v-if="formLoading" :form="true" class="appLoader" />
        <div v-else>

          <!-- Results -->
          <div v-if="filteredEstatesReady" class="results">
            <h2 class="my-2">Risultati</h2>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col" width="30%">Immagine</th>
                  <th scope="col" width="30%">Alloggio</th>
                  <th scope="col" width="10%">Prezzo</th>
                  <th scope="col" width="10%">Stanze</th>
                  <th scope="col" width="10%">Letti</th>
                  <th scope="col" width="30%">Servizi</th>
                  <th scope="col" width="10%">Distanza</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="estate in  filteredEstates " :key="estate.id" height="50" @click="toEstateDetail(estate.id)">
                  <td> <img
                      :src="estate.images[0] ? getImagePath(estate.images[0]) : 'https://www.frosinonecalcio.com/wp-content/uploads/2021/09/default-placeholder.png'"
                      alt="cover"></td>
                  <td> {{ estate.title }} </td>
                  <td> {{ estate.price }} €</td>
                  <td> {{ estate.rooms }} </td>
                  <td> {{ estate.beds }} </td>
                  <td>
                    <ul class="d-flex gap-2 align-items-center m-0 p-0">
                      <li class="itemService" v-for=" service  in  estate.services " :key="service.id">
                        <font-awesome-icon class="iconService small" :icon="'fa-solid fa-' + service.icon" />
                      </li>
                    </ul>
                  </td>
                  <td> {{ printDistance(estate.distance) }} Km</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="d-flex justify-content-center mt-5">
            <h1>Nessun risultato</h1>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use'@/assets/scss/partials/bootstrapCorrection.scss';
@use'@/assets/scss/partials/vars.scss' as *;

ul li {
  list-style-type: none;
}

.search {
  position: relative;
}

img {
  height: 70px;
  width: 70px;
  border-radius: 8px;
  object-fit: cover;
}

.table td {
  vertical-align: middle;
}

.table tr {
  cursor: pointer;
}

.searchPage {
  margin-top: 100px;
}

.appLoader {
  position: absolute;
  left: 0;
  top: 150px;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.555);
  z-index: 2;
  border-radius: 8px;
}

.iconService {
  padding: 10px;
  font-size: 1.6rem;
  font-weight: 500;
  border: 2px solid transparent;
}

.itemService:hover {
  color: black;
}

form {
  .iconService {
    cursor: pointer;

    &:hover {
      color: $logo-color;
      border: 2px solid $logo-color;
      border-radius: 8px;
    }
  }
}

.iconService.small {
  font-size: 1rem;
}

.iconSelected {
  color: $logo-color;
  border: 2px solid $logo-color;
  border-radius: 8px;
}

.form-label {
  font-size: 1rem;
  font-weight: 500;
}

.input-group-text {
  background-color: white;
}

.card-body {
  box-shadow: 5px 5px 5px 2px darkgray;
}

.filterSearchCard {
  border-radius: 1rem;
}

.suggestedAddresses {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.btn {
  background-color: #396E91;
  color: #EBEEED;

  &:hover {
    background-color: #EBEEED;
    color: #396E91;
  }

}

.table tbody tr:hover{
  --bs-table-accent-bg: rgba(255, 189, 89, 0.3);
  --bs-table-hover-bg: rgba(255, 189, 89, 0.3);
}
</style>
