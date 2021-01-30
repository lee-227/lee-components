import { designComponent } from "@/use/designComponent";
import { computed } from "vue";
import "./button.scss";
export default designComponent({
  name: "lee-button",
  props: {
    status: { type: String, default: "primary" },
    label: { type: String }
  },
  setup(props, setupContext) {
    const classes = computed(() => [
      "pl-button",
      `pl-button-status-${props.status}`
    ]);

    return {
      render: () => {
        return (
          <button class={classes.value}>
            {!setupContext.slots.default
              ? props.label
              : setupContext.slots.default()}
          </button>
        );
      }
    };
  }
});
