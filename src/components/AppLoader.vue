<script>
export default {
    name: 'AppLoader',
    props: { form: Boolean },
}
</script>

<template>
    <div v-if="form" class="formLoader d-flex align-items-center justify-content-center">
        <span class="loaderCircle"><font-awesome-icon :icon="['fas', 'circle-notch']" spin size="2xl" /></span>
    </div>
    <div v-else class="container mt-5 wrap">
        <div class="d-flex flex-wrap">
            <div v-for="n in 20" class="cardGray d-flex flex-column justify-content-center p-3 me-3 mt-3">
                <div class="imageGray"></div>
                <div v-for="n in 3" class="titleGray"></div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/partials/vars' as *;

.loaderCircle {
    font-size: 3.5rem;
    color: $logo-color;
}

.cardGray {
    background-image: linear-gradient(-60deg, rgb(241, 239, 239) 50%, rgb(250, 247, 247) 50%);
    background-size: 200% 200%;
    animation: GradientAnimation 1s ease-in-out infinite alternate;
    border-radius: 8px;

    .imageGray {
        height: 80px;
        width: 180px;
        background-color: rgb(224, 224, 224);
        border-radius: 8px;
    }

    .titleGray {
        height: 20px;
        width: 80%;
        margin-top: 10px;
        background-color: rgb(224, 224, 224);
        border-radius: 8px;
    }

}

@keyframes GradientAnimation {
    0% {
        background-position: 100% 100%;
    }

    100% {
        background-position: 0% 0%;
    }
}
</style>