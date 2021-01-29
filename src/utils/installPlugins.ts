import { App, Plugin } from "vue";

export function installPlugins<T extends { name: string }>(
  component: T,
  plugins?: Plugin[]
) {
  return {
    ...component,
    install(app: App) {
      app.component(component.name, component);
      !!plugins && plugins.forEach(app.use);
    }
  };
}
