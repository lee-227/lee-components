<template>
  <div class="">
    <lee-button label="label"></lee-button>
    <lee-button>lee</lee-button>
    <h4>状态</h4>
    <lee-button
      v-for="item in ['primary', 'success', 'warn', 'error', 'info']"
      :label="item"
      :key="item"
      :status="item"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "demo-button"
});
</script>
