<script lang="ts">
import { injectAppNavigator } from "../navigator/app-navigator";
import { AppMenu, MENUS } from "./menus";
export default {
  name: "app-menu",
  props: {
    currentPath: {
      type: String
    }
  },
  setup() {
    const navigator = injectAppNavigator();
    return {
      menus: MENUS,
      handleClickMenu(menu: AppMenu) {
        navigator.methods.go(menu.page);
      }
    };
  }
};
</script>
