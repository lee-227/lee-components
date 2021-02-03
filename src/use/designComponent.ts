import {
  defineComponent,
  ExtractPropTypes,
  ComponentPropsOptions,
  SetupContext,
  getCurrentInstance,
  provide,
  inject
} from "vue";
import { ComponentEvent, getComponentEmit, useEvent } from "./useEvents";

export function designComponent<
  Emits extends { [k: string]: (...args: any[]) => boolean },
  PropsOptions extends Readonly<ComponentPropsOptions>,
  Props extends Readonly<ExtractPropTypes<PropsOptions>>,
  Refer
>(options: {
  name?: string;
  props?: PropsOptions;
  emits?: Emits;
  provideRefer?: boolean;
  setup: (parameter: {
    props: Props;
    event: ComponentEvent<Emits>;
    setupContext: SetupContext<Emits>;
  }) => {
    refer?: Refer;
    render: () => any;
  };
}) {
  const { setup, provideRefer, emits, ...leftOptions } = options;
  return {
    ...defineComponent({
      ...leftOptions,
      emits: getComponentEmit(emits),
      setup(props: Props, setupContext: any) {
        const ctx = getCurrentInstance() as any;
        const event = useEvent<Emits>(emits!);
        if (!setup) {
          console.error("designComponent: setup is required!");
          return () => null;
        }
        const { refer, render } = setup({ props, event, setupContext });
        if (provideRefer) {
          if (!leftOptions.name) {
            return console.error("provideRefer need component name");
          }
          provide(`@@${leftOptions.name}`, refer);
        }
        if (!!refer) {
          const duplicateKey = Object.keys(leftOptions || {}).find(i =>
            Object.prototype.hasOwnProperty.call(refer as any, i)
          );
          if (!!duplicateKey) {
            console.error(
              `designComponent: duplicate key ${duplicateKey} in refer`
            );
          } else {
            Object.assign(ctx.proxy, refer);
          }
        }
        return render;
      }
    } as any),
    use: {
      ref: (refName: string) => {
        const ctx = getCurrentInstance() as any;
        return {
          get value() {
            return ctx.refs[refName] as Refer | null;
          }
        };
      },
      inject: (defaultValue?: any) => {
        return inject(`@@${leftOptions.name}`, defaultValue) as Refer;
      }
    }
  };
}
