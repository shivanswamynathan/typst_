// main.js - Corrected to use all-in-one-lite.bundle.js

document.addEventListener('DOMContentLoaded', async () => {
    // Get DOM elements
    const typstCodeArea = document.getElementById('typst-code');
    const renderButton = document.getElementById('render-button');
    const canvasContainer = document.getElementById('canvas-container');
    
    // Add status indicator to the page
    const statusElement = document.createElement('div');
    statusElement.id = 'typst-status';
    statusElement.style.padding = '10px';
    statusElement.style.margin = '10px 0';
    statusElement.style.backgroundColor = '#f8f8f8';
    statusElement.style.borderLeft = '4px solid #ffa500';
    statusElement.textContent = 'Initializing typst.ts library...';
    canvasContainer.parentElement.insertBefore(statusElement, canvasContainer);
  
    try {
      // Directly load the all-in-one-lite bundle which exists in your installation
      const script = document.createElement('script');
      script.src = './node_modules/@myriaddreamin/typst.ts/dist/esm/contrib/all-in-one-lite.bundle.js';
      script.type = 'module';
      
      // Wait for script to load
      const scriptLoaded = new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });
      
      document.head.appendChild(script);
      await scriptLoaded;
      
      statusElement.textContent = 'Script loaded, initializing typst.ts...';
      
      // Check if $typst is available
      if (!window.$typst) {
        throw new Error('$typst global object not found');
      }
      
      // Set WASM module paths - using node_modules path
      const compilerWasmPath = './node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm';
      const rendererWasmPath = './node_modules/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm';
      
      // Initialize compiler and renderer
      window.$typst.setCompilerInitOptions({
        getModule: () => compilerWasmPath
      });
      
      window.$typst.setRendererInitOptions({
        getModule: () => rendererWasmPath
      });
      
      // Update status and enable button
      statusElement.textContent = '✅ typst.ts library initialized successfully';
      statusElement.style.borderColor = '#4caf50'; // Green for success
      console.log('Typst module initialized successfully');
      renderButton.disabled = false;
      
      // Function to render Typst content
      async function renderToCanvas() {
        try {
          // Clear previous canvas if any
          canvasContainer.innerHTML = '';
          
          // Get Typst code from textarea
          const typstCode = typstCodeArea.value;
          
          // Display loading message
          const loadingElement = document.createElement('div');
          loadingElement.textContent = 'Rendering...';
          canvasContainer.appendChild(loadingElement);
          
          console.log('Attempting to render:', typstCode);
          
          // Try SVG first as it's often more reliable
          const svg = await window.$typst.svg({
            mainContent: typstCode
          });
          
          // If we got SVG content, display it
          if (svg) {
            canvasContainer.innerHTML = svg;
            console.log('Rendered using SVG');
            return;
          }
          
          // If SVG fails, try canvas rendering
          const result = await window.$typst.createCanvas({
            container: canvasContainer,
            mainContent: typstCode,
            pixelPerPt: 3
          });
          
          console.log('Render complete', result);
        } catch (error) {
          console.error('Error rendering Typst content:', error);
          canvasContainer.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red;">
            <strong>Error rendering Typst content:</strong><br>
            ${error.message}
          </div>`;
        }
      }
      
      // Add event listener for render button
      renderButton.addEventListener('click', renderToCanvas);
      
      // Initial render
      renderToCanvas();
      
    } catch (error) {
      // Handle initialization errors
      console.error('Error initializing Typst module:', error);
      statusElement.textContent = `❌ Failed to initialize typst.ts: ${error.message}`;
      statusElement.style.borderColor = '#f44336'; // Red for error
      
      canvasContainer.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red; margin-top: 20px;">
        <strong>Failed to initialize Typst module:</strong><br>
        ${error.message}<br><br>
        <code>See browser console for more details (F12 > Console).</code>
      </div>`;
    }
  });