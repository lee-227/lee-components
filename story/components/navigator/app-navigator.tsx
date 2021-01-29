import { designComponent } from "@/use/designComponent";
import {
  defineComponent,
  inject,
  onBeforeUnmount,
  provide,
  reactive
} from "vue";

interface Route {
  path?: string;
  hash?: string;
  param?: { [k: string]: string };
}

function getRoute(): Route {
  let locationHash = window.location.hash || "";
  if (locationHash.charAt(0) === "#") {
    locationHash = locationHash.slice(1);
  }
  const [path, hash] = decodeURIComponent(locationHash).split("#");
  return {
    path,
    hash
  };
}

function useAppNavigator(props: { defaultPath?: string }) {
  const currentRoute = getRoute();
  !currentRoute.path && (currentRoute.path = props.defaultPath);
  const state = reactive({
    route: currentRoute
  });
  const methods = {
    go(path: string) {
      window.location.hash = encodeURIComponent(path);
    }
  };
  const handler = {
    hashChange: () => {
      state.route = getRoute();
    }
  };
  const refer = {
    state,
    methods
  };
  window.addEventListener("hashchange", handler.hashChange);
  onBeforeUnmount(() =>
    window.removeEventListener("hashchange", handler.hashChange)
  );
  return refer;
}

export const AppNavigator = designComponent({
  name: "app-navigator",
  provideRefer: true,
  props: {
    defaultPath: String
  },
  setup(props, setupContext) {
    let refer = useAppNavigator(props);
    return {
      refer,
      render: () =>
        !!setupContext.slots.default ? setupContext.slots.default() : null
    };
  }
});
