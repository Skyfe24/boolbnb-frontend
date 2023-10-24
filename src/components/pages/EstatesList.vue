<script>
import axios from 'axios';
import AppCard from '@/components/AppCard.vue';
import { setForm } from '@/assets/data/sharedDataService.js';

const searchForm = {
    place: { address: '', lon: null, lat: null }
};

export default {
    components: { AppCard },
    data() {
        return {
            form: searchForm,
            suggestedAddresses: [],
            estates: [],
            apiLoading: false,
            timeoutId: null,
        }
    },
    computed: {
        isAddressFieldEmpty() {
            if (!this.form.place.address) {
                this.suggestedAddresses = [];
                return true;
            }
            return false;
        }
    },
    methods: {
        sendForm() {
            this.apiLoading = true
            this.estates = [];
            const endpoint = 'http://127.0.0.1:8000/api/estates/filter';
            axios.post(endpoint, this.form)
                .then(res => {
                    this.estates = res.data;
                    console.log('RESULTS: ', this.estates);
                })
                .catch(err => { console.error(err) })
                .then(() => { this.apiLoading = false })
        },
        fetchAddress(address) {
            const baseUri = 'https://api.tomtom.com/search/2/search/';
            const params = '.json?limit=5&countrySet=IT';
            const apiKey = '&key=GhG6A9t2m9I7jUfG0xLAixmH1Nk7leZa';

            if (this.isAddressFieldEmpty) return;

            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
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
            document.getElementById('searchAddress').setAttribute('readonly', 'readonly');
            setForm(this.form);
            this.$router.push({ name: 'search-page', query: { redirect: 'home' } });
        }
    },
    mounted() {
        this.form.place.address = '';
        this.sendForm();
    }
}
</script>

<template>
    <main class="container">
        <!-- search address -->
        <form method="POST" @submit.prevent="false">
            <div class="row">
                <div class="addresses px-0 my-3 col-8 mx-auto">
                    <div class="d-flex align-items-center position-relative">
                        <input id="searchAddress" type="text" class="form-control"
                            placeholder="Inizia a scrivere un indirizzo..." v-model="form.place.address"
                            @keyup="fetchAddress($event.target.value)" autocomplete="off">
                    </div>
                </div>
                <div class="col-8 mx-auto position-relative">
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
        </form>

        <AppLoader v-if="apiLoading" />
        <div v-else>
            <!-- Hide if empty -->
            <div v-if="estates.length" class="row 
            row-cols-sm-1 justify-content-center
                row-cols-md-4
                row-cols-lg-6">
                <!-- Dynamic Card Here -->
                <AppCard v-for="estate in estates" :key="estate.id" :data="estate" />
            </div>
            <div v-else class="d-flex justify-content-center align-items-center mt-3">
                <h1>Non ci sono progetti da visualizzare</h1>
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
@use'../../assets/scss/partials/bootstrapCorrection.scss' as *;

form {
    margin-top: 100px;
}

.suggestedAddresses {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
}
</style>