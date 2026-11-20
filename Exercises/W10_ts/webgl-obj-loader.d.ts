export declare namespace OBJ {
    declare class Mesh {

        constructor ( s: string );

        vertices: number[];

        vertexNormals: number[];

        vertexColors: number[];

        indices: number[];

    }
    declare const initMeshBuffers: ( gl: WebGLRenderingContext, mesh: Mesh ) => void;
}
