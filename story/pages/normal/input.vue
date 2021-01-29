<template>
  <div class="demo-input">
    <lee-input></lee-input>
    <h4>状态</h4>
    <lee-input
      v-for="item in ['primary', 'success', 'warn', 'error', 'info']"
      :key="item"
      :status="item"
      style="margin-right: 8px"
    />
    <h4>类型提示</h4>
    <lee-input ref="myInput" />
    <button @click="outerClear">outer clear</button>
    <button @click="outerFocus">outer focus</button>
  </div>
</template>

<script lang="ts">
import { Input } from "@/index";
import { defineComponent } from "vue";
export default defineComponent({
  name: "demo-input",
  setup() {
    const inputRef = Input.use.ref("myInput");
    return {
      outerClear: () => {
        inputRef.value?.methods.clear();
      },
      outerFocus: () => {
        inputRef.value?.methods.focus(false);
      }
    };
  }
});
</script>
