import { WebGLUtils } from './WebGLUtils';

export class Compositor {
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;

    private aPositionLoc: number;
    private aTexCoordLoc: number;
    private uMatrixLoc: WebGLUniformLocation;
    private uTextureLoc: WebGLUniformLocation;
    private uUseTextureLoc: WebGLUniformLocation;
    private uColorLoc: WebGLUniformLocation;

    private vao: WebGLVertexArrayObject;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;

        const vsSource = `#version 300 es
        in vec2 a_position;
        in vec2 a_texCoord;
        uniform mat3 u_matrix;
        out vec2 v_texCoord;
        void main() {
            vec3 pos = u_matrix * vec3(a_position, 1.0);
            gl_Position = vec4(pos.xy, 0.0, 1.0);
            v_texCoord = a_texCoord;
        }`;

        const fsSource = `#version 300 es
        precision mediump float;
        in vec2 v_texCoord;
        uniform sampler2D u_texture;
        uniform bool u_useTexture;
        uniform vec4 u_color;
        out vec4 outColor;
        void main() {
            if (u_useTexture) {
                outColor = texture(u_texture, v_texCoord);
            } else {
                outColor = u_color;
            }
        }`;

        const vs = WebGLUtils.createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = WebGLUtils.createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        this.program = WebGLUtils.createProgram(gl, vs, fs);

        this.aPositionLoc = gl.getAttribLocation(this.program, "a_position");
        this.aTexCoordLoc = gl.getAttribLocation(this.program, "a_texCoord");
        this.uMatrixLoc = gl.getUniformLocation(this.program, "u_matrix")!;
        this.uTextureLoc = gl.getUniformLocation(this.program, "u_texture")!;
        this.uUseTextureLoc = gl.getUniformLocation(this.program, "u_useTexture")!;
        this.uColorLoc = gl.getUniformLocation(this.program, "u_color")!;

        this.vao = gl.createVertexArray()!;
        gl.bindVertexArray(this.vao);

        // Kwadrat 0..1 (6 wierzchołków dla dwóch trójkątów)
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,  1, 0,  0, 1,
            0, 1,  1, 0,  1, 1,
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.aPositionLoc);
        gl.vertexAttribPointer(this.aPositionLoc, 2, gl.FLOAT, false, 0, 0);

        const texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 1,  1, 1,  0, 0,
            0, 0,  1, 1,  1, 0,
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.aTexCoordLoc);
        gl.vertexAttribPointer(this.aTexCoordLoc, 2, gl.FLOAT, false, 0, 0);
    }

    /**
     * Rysuje dowolną teksturę (np. sprite kota) przy użyciu macierzy transformacji.
     * Macierz zawiera już w sobie pozycję (x, y), skalę (w, h) i obrót.
     */
    drawTexture(texture: WebGLTexture, matrix: Float32Array) {
        this.gl.useProgram(this.program);
        this.gl.bindVertexArray(this.vao);

        // Przekazujemy macierz obliczoną przez BaseNode
        this.gl.uniformMatrix3fv(this.uMatrixLoc, false, matrix);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform1i(this.uTextureLoc, 0);
        this.gl.uniform1i(this.uUseTextureLoc, 1);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    /**
     * Rysuje prostokąt kolorowy (np. tło lub UI)
     */
    drawRect(r: number, g: number, b: number, a: number, matrix: Float32Array) {
        this.gl.useProgram(this.program);
        this.gl.bindVertexArray(this.vao);

        this.gl.uniformMatrix3fv(this.uMatrixLoc, false, matrix);
        this.gl.uniform4f(this.uColorLoc, r, g, b, a);
        this.gl.uniform1i(this.uUseTextureLoc, 0);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}
