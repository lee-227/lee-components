import { designComponent } from "../../use/designComponent";
import { computed, ref, watch } from "vue";
import "./input.scss";

console.log("加载了 Input 组件");

export default designComponent({
  name: "lee-input",
  props: {
    status: { type: String, default: "primary" },
    modelValue: { type: [String, Number] }
  },
  emits: {
    updateModelValue: (val: string | number | undefined) => true
  },
  setup({ props, event }) {
    const model = ref(props.modelValue);
    const inputRef = ref(null as null | HTMLInputElement);
    const classes = computed(() => [
      "pl-input",
      `pl-input-status-${props.status}`
    ]);
    const methods = {
      focus(flag: boolean) {
        inputRef.value?.focus();
        if (!flag) {
          model.value = "";
        }
      },
      clear() {
        model.value = "";
      }
    };
    watch(
      () => props.modelValue,
      (val: string | number | undefined) => (model.value = val)
    );
    const handler = {
      onInput: (e: Event) => {
        model.value = (e.target as HTMLInputElement).value;
        event.emit.updateModelValue(model.value);
      }
    };
    return {
      refer: {
        methods,
        model
      },
      render: () => (
        <div class={classes.value}>
          <input
            class="pl-input-inner"
            type="text"
            v-model={model.value}
            onInput={handler.onInput}
            ref={inputRef}
          ></input>
          <button onClick={methods.clear}>clear</button>
          <button onClick={() => methods.focus(false)}>focus</button>
        </div>
      )
    };
  }
});
