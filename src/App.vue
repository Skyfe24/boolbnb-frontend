<script>
import AppHeader from '@/components/AppHeader.vue'
import BasicMap from '@/components/BasicMap.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'BoolBnB',
  data() {
    return {}
  },
  components: { AppHeader, AppFooter }

}

</script>

<template>
  <!-- Header -->
  <AppHeader />
  <RouterView></RouterView>
  <AppFooter />
</template>

<style lang="scss">
@use './assets/scss/style.scss';
</style>
