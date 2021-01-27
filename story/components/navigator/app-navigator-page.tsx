import { DefineComponent, defineComponent, reactive } from "vue";
import { injectAppNavigator } from "./app-navigator";

export const AppNavigatorPage = defineComponent({
  setup() {
    const state = reactive({
      PageComponent: null as null | DefineComponent,
    });
    const navigator = injectAppNavigator();
  },
});
