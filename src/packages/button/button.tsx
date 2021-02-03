import { designComponent } from "@/use/designComponent";
import { computed } from "vue";
import "./button.scss";

console.log("加载了 Input 组件");

export default designComponent({
  name: "lee-button",
  emits: {
    click: (e: MouseEvent) => {
      console.log(1);
      return true;
    }
  },
  props: {
    status: { type: String, default: "primary" },
    label: { type: String }
  },
  setup({ props, event, setupContext }) {
    const classes = computed(() => [
      "pl-button",
      `pl-button-status-${props.status}`
    ]);

    return {
      render: () => {
        return (
          <button class={classes.value} onClick={event.emit.click}>
            {!setupContext.slots.default
              ? props.label
              : setupContext.slots.default()}
          </button>
        );
      }
    };
  }
});
