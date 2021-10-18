import { Component, Constructor } from "cc";

const START_METHOD_NAME = 'start';

type StartMethod<T extends Component> = (this: T) => void;

export function injectComponent<T extends Component>(componentConstructor: Constructor<T>): PropertyDecorator {
    return (target, propertyKey) => {
        const oldDescriptor = Object.getOwnPropertyDescriptor(target, START_METHOD_NAME);

        let oldMethod: StartMethod<T> | undefined;
        if (oldDescriptor) {
            if (typeof oldDescriptor.value === 'function') {
                oldMethod = oldDescriptor.value;
            } else {
                throw new Error(`The existing 'start' property is not a function.`);
            }
        }

        const newDescriptor: PropertyDescriptor = {
            value: function (this: T) {
                if (oldMethod) {
                    oldMethod.apply(this);
                }
                const instance = this.node.getComponent(componentConstructor);
                Reflect.set(this, propertyKey, instance);
            },
        };

        Object.defineProperty(target, START_METHOD_NAME, newDescriptor);
    };
}
