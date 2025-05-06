import { Filter } from "pixi.js";

export class OutlineFilter extends Filter {
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
          float alpha = color.a;
          vec2 texelSize = vec2(3.0 / 512.0, 3.0 / 512.0);
          vec2 neighborTexel = vTextureCoord + texelSize;
          float neighborAlpha = texture2D(uSampler, neighborTexel).a;
          vec2 neighborTexelLeft = vTextureCoord - texelSize;
          float neighborAlphaLeft = texture2D(uSampler, neighborTexelLeft).a;
          vec2 neighborTexelUp = vTextureCoord + vec2(0.0, texelSize.y);
          float neighborAlphaUp = texture2D(uSampler, neighborTexelUp).a;
          vec2 neighborTexelDown = vTextureCoord - vec2(0.0, texelSize.y);
          float neighborAlphaDown = texture2D(uSampler, neighborTexelDown).a;
          if ((alpha > 0.5 && (neighborAlpha < 0.5 || neighborAlphaLeft < 0.5 || neighborAlphaUp < 0.5 || neighborAlphaDown < 0.5)) ||
              (alpha < 0.5 && (neighborAlpha > 0.5 || neighborAlphaLeft > 0.5 || neighborAlphaUp > 0.5 || neighborAlphaDown > 0.5))) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // белая обводка
          } else {
            gl_FragColor = color;
          }
        }
      `;

        super(vertex, fragment);
    }
}