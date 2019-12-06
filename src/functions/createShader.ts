import { WebGLRenderer, WebGLRenderTarget, Vector2, Vector3, OrthographicCamera, ShaderMaterial, Mesh, PlaneBufferGeometry, Scene, Uniform } from 'three';

/**
 * Creates a function that allows shaders to be easily applied.
 * @param renderer 
 * @param fragmentShader 
 * @param vertexShader 
 */
export default function createShader(renderer: WebGLRenderer, fragmentShader?: string, vertexShader?: string) {
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new Scene();

    let uniforms = {
        iTime: new Uniform(0),
        iResolution:  new Uniform(new Vector3()),
        iTexture: new Uniform(null),
    };

    const shaderMaterial: ShaderMaterial = new ShaderMaterial({
        uniforms,
        fragmentShader,
        vertexShader,
    });

    const shaderMesh = new Mesh(new PlaneBufferGeometry(2, 2), shaderMaterial);
    shaderMesh.frustumCulled = false;

    scene.add(shaderMesh);

    return (inputBuffer: WebGLRenderTarget, time: number, finalPass = false) => {
        uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height, 1);
        uniforms.iTime.value = time * 0.001;
        uniforms.iTexture.value = inputBuffer.texture;
        
        const size = renderer.getDrawingBufferSize(new Vector2());
        const outputBuffer: WebGLRenderTarget = finalPass ? null : new WebGLRenderTarget(size.width, size.height);
    
        renderer.setRenderTarget(outputBuffer);
        renderer.render(scene, camera);
    
        return outputBuffer;
    };
}