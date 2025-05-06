import { Transition } from "./Transition";

export class DummyTransition extends Transition {
    public inAnimation(): Promise<Transition> {
        return Promise.resolve(this);
    }
    public outAnimation(): Promise<Transition> {
        return Promise.resolve(this);
    }
}
