import type { Container, Texture } from "pixi.js";

import  { Button } from "../../../../ui/widgets/Button";
import { gsap } from "gsap";

export class PulseButton extends Button {
   public pulseScale: number;
   public pulseDuration: number;

    constructor(parent: Container, up: Texture, scale = 1.05, duration = 1, over?: Texture, down?: Texture, disabled?: Texture) {
        super(parent, up, over, down, disabled);

        this.pulseScale = scale;
        this.pulseDuration = duration;

        this.pulseAnimation();
    }

    pulseAnimation() {
        gsap.to(this.scale, {
          x: this.pulseScale,
          y: this.pulseScale,
          duration: this.pulseDuration,
          ease: "easeInOut",
          repeat: -1,
          yoyo: true
        });
      }
}