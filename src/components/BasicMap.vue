<script>
export default {
    props: {
        estate: Object,
    },
    created() {
        this.mapInstance = null;
    },
    mounted() {
        this.setMap();
    },
    methods: {
        setMap() {
            this.mapInstance = tt.map({
                key: 'M67vYPGoqcGCwsgAOqnQFq8m8VRJHYoW',
                container: 'map-div',
                center: { lat: this.estate.latitude, lon: this.estate.longitude },
                zoom: 16
            });

            // Marker
            new tt.Marker().setLngLat([this.estate.longitude, this.estate.latitude]).addTo(this.mapInstance);
        }
    }
}

</script>

<template>
    <div class="addressCard">
        <div class="card-header headerAddress  p-2">
            <div class="address">
                <span><strong>Indirizzo</strong></span>
                <span>: {{ estate.address }}</span>
            </div>
            <div class="position">
                <span><strong>Posizione</strong></span>
                <span>: ({{ estate.longitude }}, {{ estate.latitude }})</span>
            </div>
        </div>
        <div class="card-body p-0">
            <div id="map-div"></div>
        </div>
    </div>
</template>

<style>
#map-div {
    width: 100%;
    height: 400px;
    border: 0;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}

.addressCard .card-header.headerAddress {
    padding: 0;
    margin: 0;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}
</style>