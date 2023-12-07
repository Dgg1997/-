<template>
  <div id="app">
    <emotion :width="500" :content="content" @getChildInfo="getChildInfo"></emotion>
  </div>
</template>

<script>
import emotion from "./components/emotion/emotion";
export default {
  name: 'App',
  components: {
    emotion
  },
  data(){
    return{
      content:''
    }
  },
  methods:{
    //Ö´ÐÐ·½·¨
    getChildInfo(value) {
      this.content = value
    },
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
}
</style>
