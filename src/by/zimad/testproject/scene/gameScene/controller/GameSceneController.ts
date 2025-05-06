import type { GameSceneModel } from "../model/GameSceneModel";

import { PuzzlePiece, PuzzlePieceState } from "../components/PuzzlePiece";
import { BarPuzzlePiece } from "../components/BarPuzzlePiece";
import { Game } from "../../../../Game";
import MiniSignal from "mini-signals";
import { Point } from "pixi.js";

const PUZZLES_BAR_SIZE = 4;
const NORMAL_BAR_PUZZLE_SCALE = 0.6;
const DRAG__BAR_PUZZLE_SCALE = 1;

const APP_IOS_LINK = "https://apps.apple.com/us/app/magic-jigsaw-puzzles-games-hd/id439873467";
const APP_ANDROID_LINK = "https://play.google.com/store/apps/details?id=com.bandagames.mpuzzle.gp";

export class GameSceneController {
    public readonly onePuzzleSolved: MiniSignal = new MiniSignal();
    public readonly puzzleSolved: MiniSignal = new MiniSignal();
    public readonly barPuzzleStartDrag: MiniSignal = new MiniSignal();
    public readonly barPuzzleEndDrag: MiniSignal = new MiniSignal();

    private readonly model: GameSceneModel;

    private lastBarPuzzleIndex: number = -1;
    private currentBarPuzzleInitPosition: Point;

    public constructor(model: GameSceneModel) {
        this.model = model;
    }

    public addPuzzle(puzzle: PuzzlePiece, barPuzzle: BarPuzzlePiece): void {
        puzzle.setState(PuzzlePieceState.WRONG);

        barPuzzle.startDrag.add(this.onBarPuzzleStartDrag, this);
        barPuzzle.endDrag.add(this.onBarPuzzleEndDrag, this);

        this.model.puzzles.push(puzzle);
        this.model.barPuzzles.push(barPuzzle);
    }

    public createBarPuzzles(barWidth: number, barHeight: number): BarPuzzlePiece[] {
        const barPuzzles: BarPuzzlePiece[] = [];

        for (let i = 0; i < PUZZLES_BAR_SIZE; i++) {
            const barPuzzle = this.model.barPuzzles[i];

            barPuzzle.position.set((barWidth / PUZZLES_BAR_SIZE) * i - barWidth / 2 + (barWidth / 4) / 2, barPuzzle.y - barHeight / 2);
            barPuzzle.scale.set(NORMAL_BAR_PUZZLE_SCALE);

            barPuzzles.push(barPuzzle);
            this.lastBarPuzzleIndex++;
        }

        return barPuzzles;
    }

    public onPlay() {
        const isIOS = navigator.userAgent.match(/iPhone|iPad/i) !== null;
        window.location.href = isIOS ? APP_IOS_LINK : APP_ANDROID_LINK;
    }

    private onBarPuzzleStartDrag(barPuzzleIndex: number): void {
        this.model.currentPuzzleIndex = barPuzzleIndex;
        this.currentBarPuzzleInitPosition = this.model.barPuzzles[barPuzzleIndex].position.clone();

        this.model.barPuzzles[barPuzzleIndex].scale.set(DRAG__BAR_PUZZLE_SCALE);
        this.barPuzzleStartDrag.dispatch(this.model.barPuzzles[barPuzzleIndex]);
    }

    private onBarPuzzleEndDrag(barPuzzleIndex: number): void {
        const barPuzzle = this.model.barPuzzles[barPuzzleIndex];

        this.model.currentPuzzleIndex = -1;
        barPuzzle.position.set(this.currentBarPuzzleInitPosition.x, this.currentBarPuzzleInitPosition.y);
        barPuzzle.scale.set(NORMAL_BAR_PUZZLE_SCALE);

        const mousePosition = Game.RENDERER.plugins.interaction.mouse.global;
        const puzzleBounds = this.model.puzzles[barPuzzleIndex].getBounds();

        if (puzzleBounds.contains(mousePosition.x, mousePosition.y)) {
            this.model.puzzles[barPuzzleIndex].setState(PuzzlePieceState.RIGHT);
            this.checkPuzzles();

            if (this.lastBarPuzzleIndex < this.model.barPuzzles.length - 1) {
                this.lastBarPuzzleIndex++;

                const nextBarPuzzle = this.model.barPuzzles[this.lastBarPuzzleIndex];
                nextBarPuzzle.scale.set(NORMAL_BAR_PUZZLE_SCALE);
                nextBarPuzzle.position.set(this.currentBarPuzzleInitPosition.x, this.currentBarPuzzleInitPosition.y);

                this.barPuzzleEndDrag.dispatch(nextBarPuzzle);
            }

            this.onePuzzleSolved.dispatch();
            barPuzzle.destroy();
        }
        else {
            barPuzzle.playWrongAnimation();
        }
    }

    private checkPuzzles(): void {
        const rightPuzzlesCount = this.model.puzzles.filter(puzzle => puzzle.state === PuzzlePieceState.RIGHT).length;
        if (rightPuzzlesCount !== this.model.puzzles.length) {
            return;
        }

        this.puzzleSolved.dispatch();
    }
}