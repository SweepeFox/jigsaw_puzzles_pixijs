import type { GameSceneController } from "../controller/GameSceneController";
import type { GameSceneModel } from "../model/GameSceneModel";
import type { MiniSignalBinding } from "mini-signals";

import { Container, Point, RenderTexture, Sprite, TextStyle, Texture } from "pixi.js";
import { GameSceneResourcesPackage } from "../resources/GameSceneResourcesPackage";
import { GrayScaleFilter } from "../../../filters/GrayScaleFilter";
import { PointerEvent } from "../../../../ui/events/PointerEvent";
import { BaseView } from "../../../../scene/viewable/BaseView";
import { BarPuzzlePiece } from "../components/BarPuzzlePiece";
import { PulseButton } from "../components/PulseButton";
import { PuzzlePiece } from "../components/PuzzlePiece";
import { Text } from "../../../../ui/widgets/Text";
import { Hand } from "../components/Hand";
import { Game } from "../../../../Game";
import { gsap } from "gsap";

export class GameSceneView extends BaseView {
    private readonly resourcesPackage: GameSceneResourcesPackage;
    private readonly controller: GameSceneController;
    private readonly model: GameSceneModel;

    private readonly barPuzzleStartDragSignalBinding: MiniSignalBinding;
    private readonly barPuzzleEndDragSignalBinding: MiniSignalBinding;
    private readonly onePuzzleSolvedSignalBinding: MiniSignalBinding;
    private readonly puzzleSolvedSignalBinding: MiniSignalBinding;
    private readonly updateSignalBinding: MiniSignalBinding;

    private playButton: PulseButton;
    private puzzlesContainer: Sprite;
    private frame: Sprite;
    private grid: Sprite;
    private base: Sprite;
    private bar: Sprite;
    private title: Text;

    public constructor(controller: GameSceneController, model: GameSceneModel, resourcesPackage: GameSceneResourcesPackage) {
        super();

        this.controller = controller;
        this.model = model;
        this.resourcesPackage = resourcesPackage;

        this.start();

        this.onePuzzleSolvedSignalBinding = this.controller.onePuzzleSolved.add(() => {
            const mousePosition = this.toLocal(Game.RENDERER.plugins.interaction.mouse.global);
            this.createRightPuzzleParticles(mousePosition);
        });

        this.puzzleSolvedSignalBinding =  this.controller.puzzleSolved.add(() => this.onPuzleSolved());
        this.barPuzzleStartDragSignalBinding = this.controller.barPuzzleStartDrag.add((puzzle: BarPuzzlePiece) => this.onBarPuzzleStartDrag(puzzle));
        this.barPuzzleEndDragSignalBinding = this.controller.barPuzzleEndDrag.add((puzzle: BarPuzzlePiece) => this.onBarPuzzleEndDrag(puzzle));
        this.updateSignalBinding = Game.UPDATE_SIGNAL.add(this.update, this);
    }

    public start(): void {
        const background = new Sprite(this.resourcesPackage.assets_game_game_scene_bg_jpg);
        background.width = Game.WIDTH;
        background.height = Game.HEIGHT;
        this.addChild(background);

        this.title = new Text("Complete \nthe puzzle", new GameSceneTitleTextStyle(), background);
        this.title.anchor.set(0.5, 0);
        this.title.position.set(background.width / 2 + 50, 70);

        this.base = new Sprite(this.resourcesPackage.assets_game_image_jpg);
        this.base.anchor.set(0.5, 0.5);
        this.base.position.set(background.width / 2, background.height / 2 - 150);
        this.base.filters = [new GrayScaleFilter()];
        this.addChild(this.base);

        const baseMask = new Sprite(this.resourcesPackage.assets_game_base_mask_png);
        baseMask.anchor.set(0.5, 0.5);
        this.base.addChild(baseMask);
        this.base.mask = baseMask;

        this.frame = new Sprite(this.resourcesPackage.assets_game_frame_png);
        this.frame.anchor.set(0.5, 0.5);
        this.frame.position.set(this.base.x, this.base.y + 5);
        this.addChild(this.frame);

        this.createPuzzles();

        this.grid = new Sprite(this.resourcesPackage.assets_game_grid_png);
        this.grid.alpha = 0.7;
        this.grid.anchor.set(0.5, 0.5);
        this.grid.position = this.base.position;
        this.addChild(this.grid);

        this.bar = new Sprite(this.resourcesPackage.assets_game_bar_png);
        this.bar.anchor.set(0.5, 1);
        this.bar.position.set(background.width / 2, background.height - this.bar.height - this.bar.height / 2);
        this.addChild(this.bar);

        this.playButton = new PulseButton(this, this.resourcesPackage.assets_game_play_button_png);
        this.playButton.anchor.set(0.5, 0.5);
        this.playButton.position.set(background.width / 2, background.height - this.playButton.height / 4 - this.playButton.height / 2);
        this.playButton.on(PointerEvent.Up, () => this.controller.onPlay());

        const barPuzzles = this.controller.createBarPuzzles(this.bar.width, this.bar.height);
        this.bar.addChild(...barPuzzles);

        this.createHand();
    }

    private update() {
        if (this.model.currentPuzzleIndex === -1) {
            return;
        }

        const mousePosition = Game.RENDERER.plugins.interaction.mouse.global;
        const localPosition = this.bar.toLocal(mousePosition);
        this.model.barPuzzles[this.model.currentPuzzleIndex]?.position.set(localPosition.x, localPosition.y);
    }

    private onBarPuzzleStartDrag(barPuzzle: BarPuzzlePiece): void {
        this.bar.setChildIndex(barPuzzle, this.bar.children.length - 1);
    }

    private onBarPuzzleEndDrag(barPuzzle: BarPuzzlePiece): void {
        this.bar.addChild(barPuzzle);
    }

    private createPuzzles(): void {
        const puzzlePiecesMasks: Sprite[] = this.createPuzzleMasks();

        this.puzzlesContainer = new Sprite();
        this.puzzlesContainer.anchor.set(0.5, 0.5);
        this.puzzlesContainer.position.set(Game.WIDTH / 2, Game.HEIGHT / 2 - 150);

        for (let i = 0; i < puzzlePiecesMasks.length; i++) {
            const mask = puzzlePiecesMasks[i];
            const baseSprite = new Sprite(this.resourcesPackage.assets_game_image_jpg);

            mask.position.set(mask.x + Game.WIDTH / 2, mask.y + Game.HEIGHT / 2);

            const container = new Container();
            container.addChild(baseSprite);
            container.addChild(mask);

            container.mask = mask;
            container.position.set(-mask.x, -mask.y);

            const renderTexture = RenderTexture.create({ width: mask.width, height: mask.height });
            Game.RENDERER.render(container, { renderTexture });

            const puzzlePiece = new PuzzlePiece(renderTexture);
            this.puzzlesContainer.addChild(puzzlePiece);

            puzzlePiece.x -= this.resourcesPackage.assets_game_image_jpg.width / 2 - mask.x;
            puzzlePiece.y -= this.resourcesPackage.assets_game_image_jpg.height / 2 - mask.y;

            this.controller.addPuzzle(puzzlePiece, new BarPuzzlePiece(renderTexture, i));
        };

        this.addChild(this.puzzlesContainer);
    }

    private createHand(): void {
        const randomPuzzleIndex = Math.floor(Math.random() * this.bar.children.length);

        const targetPuzzle = this.model.puzzles[randomPuzzleIndex];
        const targetPuzzleGlobalPosition = targetPuzzle.toGlobal(new Point());
        const targetPuzzlePosition = new Point(targetPuzzleGlobalPosition.x + targetPuzzle.width / 2, targetPuzzleGlobalPosition.y + targetPuzzle.height / 2);
        const startPuzzlePosition = this.model.barPuzzles[randomPuzzleIndex].toGlobal(new Point());

        const hand = new Hand(this.resourcesPackage.assets_game_hand_png, startPuzzlePosition, targetPuzzlePosition, this.model.barPuzzles);
        this.addChild(hand);
    }

    private createPuzzleMasks(): Sprite[] {
        const createMask = (texture: Texture, x: number, y: number) => {
            const mask = new Sprite(texture);
            mask.position.set(x, y);
            return mask;
        }

        const masks: Sprite[] = [];
        masks[0] = createMask(this.resourcesPackage.assets_game_1_png, -Game.WIDTH / 2 + 2, -Game.HEIGHT / 2);
        masks[1] = createMask(this.resourcesPackage.assets_game_2_png, masks[0].x + masks[0].width - 53, masks[0].y);
        masks[2] = createMask(this.resourcesPackage.assets_game_3_png, masks[1].x + masks[1].width - 55, masks[1].y);
        masks[3] = createMask(this.resourcesPackage.assets_game_4_png, masks[2].x + masks[2].width - 53, masks[2].y);

        masks[4] = createMask(this.resourcesPackage.assets_game_5_png, masks[0].x, masks[0].y + masks[0].height - 53);
        masks[5] = createMask(this.resourcesPackage.assets_game_6_png, masks[4].x + masks[4].width - 53, masks[4].y - 53);
        masks[6] = createMask(this.resourcesPackage.assets_game_7_png, masks[5].x + masks[5].width - 53, masks[4].y);
        masks[7] = createMask(this.resourcesPackage.assets_game_8_png, masks[6].x + masks[6].width - 55, masks[4].y - 53);

        masks[8] = createMask(this.resourcesPackage.assets_game_9_png, masks[4].x, masks[4].y + masks[4].height - 53);
        masks[9] = createMask(this.resourcesPackage.assets_game_10_png, masks[8].x + masks[8].width - 55, masks[8].y + 50);
        masks[10] = createMask(this.resourcesPackage.assets_game_11_png, masks[9].x + masks[9].width - 55, masks[8].y);
        masks[11] = createMask(this.resourcesPackage.assets_game_12_png, masks[10].x + masks[10].width - 55, masks[8].y + 50);

        masks[12] = createMask(this.resourcesPackage.assets_game_13_png, masks[8].x, masks[8].y + masks[8].height - 54);
        masks[13] = createMask(this.resourcesPackage.assets_game_14_png, masks[12].x + masks[12].width - 53, masks[12].y - 53);
        masks[14] = createMask(this.resourcesPackage.assets_game_15_png, masks[13].x + masks[13].width - 55, masks[12].y - 1);
        masks[15] = createMask(this.resourcesPackage.assets_game_16_png, masks[14].x + masks[14].width - 55, masks[12].y - 53);

        return masks;
    }

    private createRightPuzzleParticles(position: Point, distance = 250): void {
        const particles = [];
        for (let i = 0; i < 200; i++) {
            const particle = new Sprite(Texture.WHITE);
            particle.position.set(position.x, position.y);
            particle.scale.set(0.5);
            particle.anchor.set(0.5);
            particle.tint = 0xFFFF00;
            particles.push(particle);
        }

        this.addChild(...particles);

        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * distance;
            const newX = particle.x + Math.cos(angle) * radius;
            const newY = particle.y + Math.sin(angle) * radius;

            gsap.to(particle, 1, {
                x: newX,
                y: newY,
                alpha: 0,
                ease: "power2.out",
                onComplete: () => {
                    particle.destroy();
                }
            });
        }
    }

    private onPuzleSolved(): void {
        this.unsubscribeFromEvents();

        gsap.to(this.bar, { alpha: 0, duration: 1 });
        gsap.to(this.title, { alpha: 0, duration: 1 });

        this.puzzlesContainer.alpha = 0;
        this.grid.alpha = 0;

        this.createRightPuzzleParticles(this.base.position, 1000);
        this.base.filters = [];

        gsap.to(this.base.scale, { x: this.base.scale.x + 0.1, y: this.base.scale.y + 0.1, duration: 1 });
        gsap.to(this.base.position, { x: Game.WIDTH / 2, y: Game.HEIGHT / 2, duration: 1 });

        gsap.to(this.frame.scale, { x: this.frame.scale.x + 0.1, y: this.frame.scale.y + 0.1, duration: 1 });
        gsap.to(this.frame.position, { x: Game.WIDTH / 2, y: Game.HEIGHT / 2 + 5, duration: 1 });

        this.playButton.pulseDuration /= 2;
        this.playButton.pulseScale += 0.2;
        this.playButton.pulseAnimation();

    }

    private unsubscribeFromEvents(): void {
        this.updateSignalBinding.detach();
        this.puzzleSolvedSignalBinding.detach();
        this.onePuzzleSolvedSignalBinding.detach();
        this.barPuzzleStartDragSignalBinding.detach();
        this.barPuzzleEndDragSignalBinding.detach();
    }
}

class GameSceneTitleTextStyle extends TextStyle {
    public constructor() {
        super({
            align: "center",
            fontFamily: "Regular",
            fontSize: 100,
            fontWeight: "bold",
            fill: 0x883916,
        });
    }
}