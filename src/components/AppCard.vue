<script>
import { RouterLink } from 'vue-router';

export default {
    props: { data: Object },
    components: { RouterLink },
    computed: {
        getImagePath() {
            if (this.data.images[0]) {
                const url = this.data.images[0].url;
                return `http://127.0.0.1:8000/storage/${url}`;
            } else {
                return 'https://picsum.photos/200/300';
            }
        },
        isEstateSponsored() {
            return this.data.endSponsor !== null;
        }
    },
    //metodo per il troncamento del testo
    methods: {
        truncateText(value, limit) {
            if (value.length > limit) {
                return value.substring(0, limit) + '...';
            }
            return value;
        },
    }
}
</script>

<template>
    <RouterLink :to="{ name: 'estate-detail', params: { id: data.id } }" class="estate-card-link estate-card rounded">
        <figure class="rounded-top position-relative">
            <img :src="getImagePath" alt="Immagine">
            <i class="fa-solid fa-heart heart"></i>
            <div v-if="isEstateSponsored" class="sponsorMark">
                <font-awesome-icon icon="fa-solid fa-rectangle-ad" />
            </div>
        </figure>
        <div class="estate-info">
            <div class="d-flex justify-content-between align-items-start">
                <h5 class="mb-0">{{ data.title }}</h5>
            </div>
            <div class="mt-2">
                <p><strong>Prezzo a Notte: </strong>{{ data.price }} €</p>
                <p><strong>Indirizzo: </strong>{{ data.address }}</p>
            </div>
        </div>
    </RouterLink>
</template>

<style scoped lang="scss">
@use'../assets/scss/partials/vars.scss' as *;

.estate-card-link {
    text-decoration: none;
    color: inherit;
}

.estate-card {
    height: 350px;
    width: 350px;
    border: 2px solid $bg-lightgrey;
    margin: 10px;
    padding: 0;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s, transform 0.3s;

    &:hover {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        transform: translateY(-5px);
    }

    figure {
        height: 50%;
        width: 100%;
        overflow: hidden;

        img {
            object-fit: cover;
            height: 100%;
            width: 100%;
        }
    }

    .estate-info {
        padding: 0 10px;

        h5 {
            font-size: 1.2rem;
            color: $darkBlue;
        }

        p {
            font-size: 1rem;
            color: $darkGray;
        }
    }

    .btn {
        background-color: $logo-color;
        color: #fff;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #FF9C2E;
        }
    }
}

.heart {
    width: 10px;
    height: 10px;
    position: absolute;
    top: 5px;
    right: 15px;
    opacity: 0.45;

    &:hover {
        opacity: 1;
        cursor: pointer;
    }
}

.sponsorMark {
    width: 130px;
    height: 25px;
    background-color: gold;
    transform: rotate(-45deg);
    translate: -35px -155px;
    position: absolute;
    text-align: center;
    border: 2px solid black;
    font-weight: 500;
    line-height: 20px;
}
</style>