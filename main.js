// main.js - Canvas renderer for Typst documents

// We'll dynamically import the library
let $typst;

// Initialize TypstCanvas class for rendering Typst documents to canvas
export class TypstCanvas {
  constructor() {
    this.container = null;
    this.initialized = false;
    this.currentDocument = null;
    this.pixelPerPt = 3.0; // Default pixel ratio
  }

  /**
   * Initialize the Typst canvas renderer
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Load the all-in-one bundle from CDN
      const module = await import('https://cdn.jsdelivr.net/npm/@myriaddreamin/typst.ts@0.5.5-rc7/dist/esm/contrib/all-in-one-lite.bundle.js');
      $typst = module.$typst;
      
      await $typst.setRendererInitOptions({
        getModule: () => 'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer@0.5.5-rc7/pkg/typst_ts_renderer_bg.wasm'
      });
      
      await $typst.setCompilerInitOptions({
        getModule: () => 'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler@0.5.5-rc7/pkg/typst_ts_web_compiler_bg.wasm'
      });
      
      this.initialized = true;
      console.log('✅ Typst canvas renderer initialized successfully');
    } catch (error) {
      console.error('Error initializing Typst canvas renderer:', error);
      throw error;
    }
  }

  /**
   * Set the container element for rendering
   * @param {HTMLElement} container - The container to render in
   */
  setContainer(container) {
    this.container = container;
  }

  /**
   * Set the pixel per point ratio
   * @param {number} pixelPerPt - The pixel per point ratio 
   */
  setPixelPerPt(pixelPerPt) {
    this.pixelPerPt = pixelPerPt;
  }

  /**
   * Render Typst content to canvas
   * @param {string} typstCode - The Typst code to render
   */
  async render(typstCode) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.container) {
      throw new Error('Container element not set. Call setContainer() first.');
    }

    try {
      // Clear the container
      this.container.innerHTML = '';
      
      // Render to canvas
      await $typst.canvas(this.container, {
        mainContent: typstCode,
        pixelPerPt: this.pixelPerPt,
        backgroundColor: '#ffffff'
      });
      
      console.log('Typst document rendered to canvas successfully');
    } catch (error) {
      console.error('Error rendering Typst document to canvas:', error);
      
      // Display error message in the container
      this.container.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red;">
        <strong>Error rendering Typst content:</strong><br>
        ${error.message}
      </div>`;
      
      throw error;
    }
  }

  /**
   * Render a Typst file from a URL
   * @param {string} url - The URL of the Typst file
   */
  async renderFromUrl(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch Typst file: ${response.statusText}`);
      }
      
      const typstCode = await response.text();
      await this.render(typstCode);
    } catch (error) {
      console.error('Error loading Typst file from URL:', error);
      throw error;
    }
  }
}

// Initialize a global instance
const typstCanvas = new TypstCanvas();
export default typstCanvas;