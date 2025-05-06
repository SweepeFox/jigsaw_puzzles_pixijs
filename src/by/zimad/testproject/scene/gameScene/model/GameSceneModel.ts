import type { BarPuzzlePiece } from "../components/BarPuzzlePiece";
import type { PuzzlePiece } from "../components/PuzzlePiece";

export class GameSceneModel {
    public puzzles: PuzzlePiece[] = [];
    public barPuzzles: BarPuzzlePiece[] = [];
    public currentPuzzleIndex: number = -1;
}