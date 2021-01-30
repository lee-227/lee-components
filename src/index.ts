import { App } from "vue";
import Button from "./packages/button";
import Input from "./packages/input";
const plugins = [Input, Button];
function install(app: App) {
  plugins.forEach(app.use);
}
export default {
  install
};
export { Input, Button, install };
