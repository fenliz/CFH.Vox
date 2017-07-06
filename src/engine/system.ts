import { Console } from './console/console';

export interface ISystem {
    update(deltaTime: number): void;
    draw(): void;
    onKeyDown(ev: KeyboardEvent): void;
    onKeyUp(ev: KeyboardEvent): void;
    registerConsoleCommands(console: Console): void;
}
