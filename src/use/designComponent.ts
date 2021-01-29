import {
  defineComponent,
  ExtractPropTypes,
  ComponentPropsOptions,
  SetupContext,
  getCurrentInstance,
  provide,
  inject
} from "vue";

export function designComponent<
  PropsOptions extends Readonly<ComponentPropsOptions>,
  Props extends Readonly<ExtractPropTypes<PropsOptions>>,
  Refer
>(options: {
  name?: string;
  props?: PropsOptions;
  provideRefer?: boolean;
  setup: (
    props: Props,
    setupContext: SetupContext
  ) => {
    refer?: Refer;
    render: () => any;
  };
}) {
  const { setup, provideRefer, ...leftOptions } = options;
  return {
    ...defineComponent({
      ...leftOptions,
      setup(props: Props, setupContext: SetupContext) {
        const ctx = getCurrentInstance() as any;
        if (!setup) {
          console.error("designComponent: setup is required!");
          return () => null;
        }
        const { refer, render } = setup(props, setupContext);
        if (provideRefer) {
          if (!leftOptions.name) {
            return console.error("provideRefer need component name");
          }
          provide(`@@${leftOptions.name}`, refer);
        }
        ctx._refer = refer;
        return render;
      }
    } as any),
    use: {
      ref: (refName: string) => {
        const ctx = (getCurrentInstance() as any).ctx;
        return {
          get value() {
            return ctx.$refs[refName].$._refer as Refer | null;
          }
        };
      },
      inject: (defaultValue?: any) => {
        return inject(`@@${leftOptions.name}`, defaultValue) as Refer;
      }
    }
  };
}
