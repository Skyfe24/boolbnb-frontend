<script>
import axios from 'axios';
import BasicMap from '@/components/BasicMap.vue';
import ContactForm from './ContactForm.vue';


export default {
    name: 'DetailedAppCard',
    data() {
        return {
            estate_id: '',
            ip_address: '',
        }
    },
    components: {
        ContactForm, BasicMap
    },
    props: {
        estate: Object
    },
    emits: ['newEstate'],
    computed: {
        hasImages() {
            return Boolean(this.estate.images.length);
        }
    },
    methods: {
        sendVisit() {
            const endpoint = 'http://127.0.0.1:8000/api/visits';
            const data = {
                estate_id: this.estate.id,
                ip_address: this.ip_address
            };
            axios.post(endpoint, data)
                .then(res => {
                    const results = res.data;
                    console.log('RESULTS: ', results);
                })
                .catch(err => { console.error(err) })
        },
        getImagePath(image) {
            const url = image.url;
            return `http://127.0.0.1:8000/storage/${url}`;
        },
        formatDates($in_date) {
            const date = new Date($in_date);

            let day = date.getDate();
            let month = date.getMonth() + 1;
            const year = date.getFullYear();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();

            day = day < 10 ? '0' + day : day;
            month = month < 10 ? '0' + month : month;
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            const out_date = `${day}/${month}/${year} alle ${hours}:${minutes}`;
            return out_date;
        }
    },
    mounted() {
        axios.get('https://api.ipify.org?format=json')
            .then(response => {
                this.ip_address = response.data.ip;
                this.sendVisit();
            })
            .catch(err => {
                console.error("Failed to get IP", err);
            });
    }
}

</script>

<template>
    <div v-if="estate" class="card my-3">
        <div class="text-center position-relative p-3">
            <div class="headerCenter d-flex justify-content-between align-items-center m-2">
                <button type="button" class="btn bt-slide" @click="$emit('newEstate', estate.prevId)">
                    <span><font-awesome-icon icon="fa-solid fa-backward" /></span>
                    <span class="mx-2 d-none d-sm-inline">Precedente</span>
                </button>
                <RouterLink class="btn bt-home" :to="{ name: 'estates' }">
                    <span><font-awesome-icon icon="fa-solid fa-house" /></span>
                    <span class="mx-2 d-none d-sm-inline">Home Page</span>
                </RouterLink>
                <button type="button" class="btn bt-slide" @click="$emit('newEstate', estate.nextId)">
                    <span class="mx-2 d-none d-sm-inline">Successivo</span>
                    <span><font-awesome-icon icon="fa-solid fa-forward" /></span>
                </button>
            </div>
        </div>
        <!-- images carousel -->
        <div v-if="hasImages" id="imagesCarousel" class="carousel slide">
            <div class="carousel-inner">
                <div v-for="image in estate.images" :key="image.id" class="carousel-item"
                    :class="estate.images[0].id == image.id ? 'active' : ''">
                    <img :src="getImagePath(image)" class="estateImg d-block" alt="">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#imagesCarousel" data-bs-slide="prev">
                <span class="btn btn-primary"><font-awesome-icon icon="fa-solid fa-backward" /></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#imagesCarousel" data-bs-slide="next">
                <span class="btn btn-primary"><font-awesome-icon icon="fa-solid fa-forward" /></span>
            </button>
        </div>
        <div class="card-body">
            <!-- title -->
            <div class="estateTitle">
                <h2 class="text-center py-2">{{ estate.title }}</h2>
            </div>
            <!-- description -->
            <div class="estateDescription ms-2">
                <div><strong>Descrizione</strong></div>
                <p>{{ estate.description }}</p>
            </div>
            <div class="card-body d-flex p-0 gap-3 my-3">
                <div class="left d-flex flex-column justify-content-between ms-2">
                    <div>
                        <span><strong>Stanze</strong></span>
                        <span>: {{ estate.rooms }}</span>
                    </div>
                    <div>
                        <span><strong>Camere</strong></span>
                        <span>: {{ estate.beds }}</span>
                    </div>
                    <div>
                        <span><strong>Bagni</strong></span>
                        <span>: {{ estate.bathrooms }}</span>
                    </div>
                    <div>
                        <span><strong>Superficie</strong></span>
                        <span>: {{ estate.mq }} m<sup><small>2</small></sup></span>
                    </div>
                    <div>
                        <span><strong>Prezzo</strong></span>
                        <span>: {{ estate.price }} €</span>
                    </div>
                    <div>
                        <span><strong>Creato il</strong></span>
                        <span>: {{ formatDates(estate.created_at) }} </span>
                    </div>
                    <div>
                        <span><strong>Ultima modifica</strong></span>
                        <span>: {{ formatDates(estate.updated_at) }} </span>
                    </div>
                    <div v-if="estate.services" class="estateServices d-flex align-items-center">
                        <span><strong>Servizi: </strong></span>
                        <span v-for="service in estate.services" :key="service.id">
                            <font-awesome-icon class="iconService" :icon="'fa-solid fa-' + service.icon" />
                        </span>
                    </div>
                </div>
                <div class="right">
                    <ContactForm :estate_id="estate.id" />
                </div>
            </div>
            <!-- services -->
            <BasicMap :estate="estate" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/partials/vars' as *;

#imagesCarousel .btn {
    font-size: 1.5rem;
    font-weight: bold;
    color: $logo-color;
    background-color: $bg-lightgrey;
    border: 1px solid $logo-color;
    opacity: 0.5;
}

#imagesCarousel .carousel-control-next:hover .btn.btn-primary,
#imagesCarousel .carousel-control-prev:hover .btn.btn-primary {
    opacity: 1;
}

.bt-home {
    background-color: #396E91;
    color: $bg-lightgrey;
    transition: background-color 0.3s;

    &:hover {
        background-color: $bg-lightgrey;
        color: #396E91;
    }
}

.bt-slide {
    background-color: #396E91;
    color: $bg-lightgrey;
    transition: background-color 0.3s;

    &:hover {
        background-color: #EBEEED;
        color: #396E91;
    }
}

.estateImg {
    width: 100%;
    height: 500px;
    margin: 0 auto;
    object-fit: cover;
    border-radius: 0;

    @media screen and (min-width: 992px) {
        width: 700px;
        border-radius: 10px;
    }

    @media screen and (min-width: 1200px) {
        width: 850px;
    }

    @media screen and (min-width: 1400px) {
        width: 1000px;
    }
}

.iconService {
    padding: 10px;
    font-size: 1.6rem;
    font-weight: 500;
    border: 2px solid transparent;
}

.card-body>* {
    padding-bottom: 0.5rem;
}

.headerLeft {
    position: absolute;
    left: 1rem;
}

.card-body .left {
    flex-basis: 50%;
}

.card-body .right {
    flex-basis: 50%;
}
</style>
