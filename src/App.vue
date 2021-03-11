<template>
  <div id="app">
    <form>
      <label> First Name
        <input v-model="model.firstName"/>
        <pre>required {{model.$v.firstName.required}}</pre>
        <pre>minLength {{model.$v.firstName.minLength}}</pre>
        <pre>includes 'a' {{model.$v.firstName.includes}}</pre>
        <pre>invalid {{model.$v.firstName.$invalid}}</pre>
      </label>
      <br>
      <label> Last Name
        <input v-model="model.lastName"/>
        <pre>required {{model.$v.lastName.required}}</pre>
        <pre>minLength {{model.$v.lastName.minLength}}</pre>
        <pre>invalid {{model.$v.lastName.$invalid}}</pre>
      </label>
      <hr>
      <button type="submit" @click.prevent="model.$v.$touch">
        Submit
      </button>
      <pre>invalid {{model.$v.$invalid}}</pre>
      <pre>error {{model.$v.$error}}</pre>
    </form>
  </div>
</template>

<script>
import FormModel from './FormModel';

export default {
  name: 'App',
  data() {
    return {
      model: new FormModel({
        firstName: '',
        lastName: '',
      }),
    };
  },
  computed: {
    validations() {
      return {
        firstName: {
          includes: value => {return this.model.firstName.includes('a');},
        },
      }
    },
  },
  created() {
    this.model.$v.$addRules(this.validations)
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
