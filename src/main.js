import { createApp } from 'vue'
import App from './App.vue'

// Font
import '@fontsource/montserrat';

// Router
import { router } from './router'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// FontAwesome Components
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faSquareParking } from '@fortawesome/free-solid-svg-icons'
import { faWifi } from '@fortawesome/free-solid-svg-icons'
import { faKitchenSet } from '@fortawesome/free-solid-svg-icons'
import { faTv } from '@fortawesome/free-solid-svg-icons'
import { faWaterLadder } from '@fortawesome/free-solid-svg-icons'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'
import { faBackward } from '@fortawesome/free-solid-svg-icons'
import { faForward } from '@fortawesome/free-solid-svg-icons'
import { faRotate } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faRectangleAd } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'


// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// Generics Components
import AppLoader from './components/AppLoader.vue'

// Including fontawesome icon
library.add(faXmark,faCircleUser, faMagnifyingGlass, faSquareParking, faWifi, faKitchenSet, faTv, faWaterLadder, faUserTie, faBackward, faForward, faRotate, faHouse, faTriangleExclamation, faCircleNotch, faRectangleAd);

// App
const app = createApp(App);
app.use(router);
app.component('AppLoader', AppLoader);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
