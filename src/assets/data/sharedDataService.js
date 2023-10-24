import { reactive } from 'vue';

const sharedData = reactive({
  form: null,
});

export function setForm(form) {
  sharedData.form = form;
}

export function getForm() {
  return sharedData.form;
}
