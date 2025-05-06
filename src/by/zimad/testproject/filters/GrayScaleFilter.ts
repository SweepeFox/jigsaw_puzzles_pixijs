import { Filter } from "pixi.js";

export class GrayScaleFilter extends Filter {
  constructor() {
    const vertex = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;
        uniform mat3 projectionMatrix;
        uniform mat3 textureMatrix;
        varying vec2 vTextureCoord;
      
        void main(void) {
          gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
          vTextureCoord = aTextureCoord;
        }
    `;

    const fragment = `
      uniform sampler2D uSampler;
      varying vec2 vTextureCoord;

      void main(void) {
          vec4 color = texture2D(uSampler, vTextureCoord);
          float gray = (color.r + color.g + color.b) / 3.0;
          gl_FragColor = vec4(vec3(gray, gray, gray), color.a);
      }
    `;

    super(vertex, fragment);
  }
}