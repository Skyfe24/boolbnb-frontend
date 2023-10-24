<script></script>
<template>
    <header class="d-flex align-items-center justify-content-between container-fluid ps-4">
        <RouterLink class="nav-link active" :to="{ name: 'estates' }">
            <div class="flex-shrink-0  d-sm-block">
                <img src="../assets/BOOLlogo.svg" alt="Logo BoolBnB" class="logo">
            </div>
        </RouterLink>
        <div class="right-nav d-flex">
            <RouterLink class="nav-link active me-2" :to="{ name: 'search-page' }">
                <span class="badge d-flex align-items-center justify-content-center rounded-pill">
                    <span id="search-icon">Ricerca avanzata</span>
                    <font-awesome-icon class="icon" :icon="['fas', 'magnifying-glass']" />
                </span>
            </RouterLink>

            <a href="http://127.0.0.1:8000/admin/estates">
                <span class="badge d-flex align-items-center justify-content-center rounded-pill">
                    <span id="search-icon">Area personale</span>
                    <font-awesome-icon class="icon" icon="fa-solid fa-circle-user" />
                </span>
            </a>
        </div>

    </header>
</template>
<style scoped lang="scss">
@use'../assets/scss/partials/vars.scss';

a {
    text-decoration: none;
    transition: color 0.3s ease;
}

.badge {
    width: 40px;
    height: 40px;
    color: #213644;
    font-size: 1rem;
    background-color: #FFBD59;
    transition: width 0.5s ease;


    #search-icon {
        display: none;
    }

    &:hover {
        background-color: #FF9C2E;
        cursor: pointer;
        width: 190px;
        transition: background-color 0.5s ease, width 0.5s ease;

        #search-icon {
            display: block;
            margin-right: 0.5rem;
        }
    }
}

@media screen and (max-width: 768px) {}

header {
    height: 80px;
    font-weight: bold;
    position: fixed;
    z-index: 2;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    background-color: white;
    top: 0;
}

.logo {
    height: 50px;
    width: auto;
}
</style>