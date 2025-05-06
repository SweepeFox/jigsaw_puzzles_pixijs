import type { BarPuzzlePiece } from "./BarPuzzlePiece";
import type { Point, Texture } from "pixi.js";

import { MiniSignalBinding } from "mini-signals";
import { Game } from "../../../../Game";
import { Sprite } from "pixi.js";
import { gsap } from "gsap";

const MOVE_SPEED = 1.5;

export class Hand extends Sprite {
    private readonly startPosition: Point;
    private readonly targetPosition: Point;

    private readonly updateSignalBinding: MiniSignalBinding;
    private readonly dragPuzzleSignalBindings: MiniSignalBinding[] = [];

    private isMovingToTarget = true;

    constructor(texture: Texture, startPosition: Point, targetPosition: Point, barPuzzles: BarPuzzlePiece[]) {
        super(texture);

        this.startPosition = startPosition;
        this.targetPosition = targetPosition;
        this.position.set(startPosition.x, startPosition.y);

        barPuzzles.forEach(barPuzzle => {
            const startDragSignalBinding = barPuzzle.startDrag.add(this.destroy, this);
            this.dragPuzzleSignalBindings.push(startDragSignalBinding);
        });

        this.updateSignalBinding = Game.UPDATE_SIGNAL.add(this.update, this);
    }

    private update(dt: number): void {
        const moveSpeed = MOVE_SPEED * dt;

        if (this.isMovingToTarget) {
            this.x += (this.targetPosition.x - this.x) / moveSpeed;
            this.y += (this.targetPosition.y - this.y) / moveSpeed;

            if (Math.abs(this.targetPosition.x - this.x) < 1 && Math.abs(this.targetPosition.y - this.y) < 1) {
                this.isMovingToTarget = false;
            }
        } else {
            this.x += (this.startPosition.x - this.x) / moveSpeed;
            this.y += (this.startPosition.y - this.y) / moveSpeed;

            if (Math.abs(this.startPosition.x - this.x) < 1 && Math.abs(this.startPosition.y - this.y) < 1) {
                this.isMovingToTarget = true;
            }
        }
    }

    public override destroy() {
        this.dragPuzzleSignalBindings.forEach(binding => binding.detach());
        this.updateSignalBinding.detach();

        gsap.to(this, { alpha: 0, duration: 0.5 }).then(() => super.destroy());
    }
}