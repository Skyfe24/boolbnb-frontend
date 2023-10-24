<script>
import axios from 'axios';
const baseUri = 'http://127.0.0.1:8000/api/messages';
const emailJsValidationExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const toast = document.querySelector('.toast-container');

export default {
    name: 'ContactForm',
    props: {
        estate_id: Number
    },
    data() {
        return {
            formLoading: false,
            form: {
                email: '',
                name: '',
                text: '',
                estate_id: null,
            },
            showToast: false,
            errors: { email: [], text: [] }
        };
    },
    methods: {
        sendForm() {
            this.errors = { email: [], text: [] };
            const errors = !this.validateForm();
            if (errors) return;
            this.form.estate_id = this.computedEstateId;
            this.formLoading = true;
            axios.post(baseUri, this.form)
                .then(response => {
                    console.log('DATA: ', response.data);
                    this.form.email = '';
                    this.form.name = '';
                    this.form.text = '';
                    this.showToast = true;
                    // Chiudi il toast automaticamente dopo 2.5 secondi
                    setTimeout(() => {
                        this.showToast = false
                    }, 2500);
                })
                .catch(error => {
                    console.error(error);
                }).then(() => { this.formLoading = false })
        },

        validateForm() {
            // email validation
            if (!this.form.email) {
                this.errors.email.push('L\'email è obbligatoria');
            } else if (!this.form.email.match(emailJsValidationExp)) {
                this.errors.email.push('L\'email inserita non è valida');
            }
            // text validation
            if (!this.form.text) {
                this.errors.text.push('Scrivi un messaggio per il proprietario dell\'alloggio');
            }
            const hasErrors = Object.keys(this.errors).some(key => this.errors[key].length > 0);
            return !hasErrors;
        }
    },
    computed: {
        computedEstateId() {
            return this.estate_id;
        }
    }
}
</script>


<template>
    <h2>Contatta il proprietario</h2>
    <div class="toast-container" :class="{ 'd-none': !showToast }">
        <div class="my-toast">
            <div class="my-toast-header d-flex justify-content-between" data-bs-theme="dark">
                <strong class="me-auto toast-title">BoolBnB</strong>
            </div>
            <p class="my-2">Il tuo messaggio è stato inviato con successo!</p>
        </div>
    </div>
    <div class="card mt-4">
        <div class="card-body shadow">
            <form @submit.prevent="sendForm" novalidate>

                <AppLoader v-if="formLoading" :form="true" class="appLoader" />

                <div class="row d-flex justify-content-end">
                    <div class="col-6">
                        <div>
                            <label for="email" class="form-label"><strong>Email <sup
                                        class="text-danger">*</sup></strong></label>
                            <input v-model.trim="form.email" type="email" class="form-control"
                                :class="{ 'is-invalid': errors.email.length }" id="email" name="email"
                                aria-describedby="emailHelp">
                        </div>
                        <div>
                            <ul class="errorList">
                                <li v-for="error in errors.email" class="errorMessage text-danger">
                                    <span><font-awesome-icon icon="fa-solid fa-triangle-exclamation" /></span>
                                    <span class="mx-2">{{ error }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-6">
                        <div>
                            <label for="name" class="form-label"><strong>Nome</strong></label>
                            <input v-model.trim="form.name" type="text" class="form-control" id="name" name="name">
                        </div>
                    </div>
                    <div class="col-12">
                        <div>
                            <label for="text" class="form-label"><strong>Messaggio<sup
                                        class="text-danger">*</sup></strong></label>
                            <textarea v-model.trim="form.text" class="form-control"
                                :class="{ 'is-invalid': errors.text.length }" name="text" id="text" rows="5"></textarea>
                        </div>
                        <div>
                            <ul class="errorList">
                                <li v-for="error in errors.text" class="errorMessage text-danger">
                                    <span><font-awesome-icon icon="fa-solid fa-triangle-exclamation" /></span>
                                    <span class="mx-2">{{ error }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <button type="submit" class="btn">Invia</button>
                </div>
            </form>
        </div>
    </div>
</template>



<style scoped lang="scss">
@use'../assets/scss/partials/bootstrapCorrection.scss' as *;

form {
    position: relative;
}

.toast-title {
    color: #FFBD59;

}

.appLoader {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.555);
    z-index: 2;
    border-radius: 8px;
}

.btn {
    width: 100px;
    margin-right: 1rem;
    background-color: #396E91;
    color: #EBEEED;

    &:hover {
        background-color: #EBEEED;
        color: #396E91;
    }

}

.errorList {
    padding: 0 0.5rem;
}

.toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #333;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    ;
}

.shadow {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)
}

.my-toast-header {
    width: 100%;
}

.my-toast {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
</style>