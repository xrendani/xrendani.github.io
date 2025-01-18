// widgets.js
class WidgetSystem {
    constructor(engine) {
        this.engine = engine;
        this.widgets = new Map();
        this.setupMainWidgets();
    }

    setupMainWidgets() {
        // Scene Hierarchy Widget
        this.addWidget('hierarchy', {
            title: 'Scene Hierarchy',
            position: { x: 10, y: 60 },
            content: this.createHierarchyContent()
        });

        // Properties Widget
        this.addWidget('properties', {
            title: 'Properties',
            position: { x: 10, y: 320 },
            content: this.createPropertiesContent()
        });

        // Tools Widget
        this.addWidget('tools', {
            title: 'Tools',
            position: { x: window.innerWidth - 220, y: 60 },
            content: this.createToolsContent()
        });

        // Materials Widget
        this.addWidget('materials', {
            title: 'Materials',
            position: { x: window.innerWidth - 220, y: 280 },
            content: this.createMaterialsContent()
        });

        // Timeline Widget
        this.addWidget('timeline', {
            title: 'Timeline',
            position: { x: 300, y: window.innerHeight - 160 },
            content: this.createTimelineContent(),
            width: window.innerWidth - 600
        });

        // Create status bar
        this.createStatusBar();
    }

    createWidget(title, content, options = {}) {
        const widget = document.createElement('div');
        widget.className = 'widget';
        if (options.width) widget.style.width = `${options.width}px`;
        
        widget.innerHTML = `
            <div class="widget-header">
                <div class="widget-title">
                    <i class="fas ${options.icon || 'fa-window-maximize'}"></i>
                    <span>${title}</span>
                </div>
                <div class="widget-controls">
                    <button class="widget-minimize" title="Minimize">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="widget-maximize" title="Maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="widget-close" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="widget-content"></div>
        `;

        const contentEl = widget.querySelector('.widget-content');
        contentEl.appendChild(content);

        this.makeWidgetDraggable(widget);
        this.setupWidgetControls(widget);
        
        return widget;
    }

    createHierarchyContent() {
        const container = document.createElement('div');
        container.className = 'hierarchy-container';
        
        container.innerHTML = `
            <div class="hierarchy-toolbar">
                <button title="Add Object"><i class="fas fa-plus"></i></button>
                <button title="Delete Selected"><i class="fas fa-trash"></i></button>
                <button title="Group Selected"><i class="fas fa-object-group"></i></button>
                <button title="Search"><i class="fas fa-search"></i></button>
            </div>
            <div class="hierarchy-tree"></div>
        `;
        
        return container;
    }

    createPropertiesContent() {
        const container = document.createElement('div');
        container.className = 'properties-container';
        
        container.innerHTML = `
            <div class="property-section">
                <h3>Transform</h3>
                <div class="property-group">
                    <label>Position</label>
                    <div class="vector3-input">
                        <input type="number" class="pos-x" step="0.1" placeholder="X">
                        <input type="number" class="pos-y" step="0.1" placeholder="Y">
                        <input type="number" class="pos-z" step="0.1" placeholder="Z">
                    </div>
                </div>
                <div class="property-group">
                    <label>Rotation</label>
                    <div class="vector3-input">
                        <input type="number" class="rot-x" step="0.1" placeholder="X">
                        <input type="number" class="rot-y" step="0.1" placeholder="Y">
                        <input type="number" class="rot-z" step="0.1" placeholder="Z">
                    </div>
                </div>
                <div class="property-group">
                    <label>Scale</label>
                    <div class="vector3-input">
                        <input type="number" class="scale-x" step="0.1" placeholder="X">
                        <input type="number" class="scale-y" step="0.1" placeholder="Y">
                        <input type="number" class="scale-z" step="0.1" placeholder="Z">
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }

    createToolsContent() {
        const container = document.createElement('div');
        container.className = 'tools-container';
        
        container.innerHTML = `
            <div class="tool-section">
                <h3>Creation Tools</h3>
                <div class="tool-grid">
                    <button class="tool-btn" data-tool="cube">
                        <i class="fas fa-cube"></i>
                        <span>Cube</span>
                    </button>
                    <button class="tool-btn" data-tool="sphere">
                        <i class="fas fa-globe"></i>
                        <span>Sphere</span>
                    </button>
                    <button class="tool-btn" data-tool="cylinder">
                        <i class="fas fa-cylinder"></i>
                        <span>Cylinder</span>
                    </button>
                    <button class="tool-btn" data-tool="plane">
                        <i class="fas fa-square"></i>
                        <span>Plane</span>
                    </button>
                    <button class="tool-btn" data-tool="light">
                        <i class="fas fa-lightbulb"></i>
                        <span>Light</span>
                    </button>
                    <button class="tool-btn" data-tool="camera">
                        <i class="fas fa-video"></i>
                        <span>Camera</span>
                    </button>
                </div>
            </div>
            <div class="tool-section">
                <h3>Transform Tools</h3>
                <div class="tool-group">
                    <button class="tool-btn active" data-transform="translate">
                        <i class="fas fa-arrows-alt"></i>
                    </button>
                    <button class="tool-btn" data-transform="rotate">
                        <i class="fas fa-sync"></i>
                    </button>
                    <button class="tool-btn" data-transform="scale">
                        <i class="fas fa-expand-arrows-alt"></i>
                    </button>
                </div>
            </div>
        `;
        
        return container;
    }

    createMaterialsContent() {
        const container = document.createElement('div');
        container.className = 'materials-container';
        
        container.innerHTML = `
            <div class="material-toolbar">
                <button title="New Material"><i class="fas fa-plus"></i></button>
                <button title="Import Material"><i class="fas fa-file-import"></i></button>
                <button title="Material Library"><i class="fas fa-book"></i></button>
            </div>
            <div class="material-list">
                <div class="material-item">
                    <div class="material-preview"></div>
                    <span>Default Material</span>
                </div>
            </div>
            <div class="material-properties">
                <div class="property-group">
                    <label>Type</label>
                    <select>
                        <option>Standard</option>
                        <option>Physical</option>
                        <option>Toon</option>
                    </select>
                </div>
                <div class="property-group">
                    <label>Color</label>
                    <input type="color" value="#ffffff">
                </div>
                <div class="property-group">
                    <label>Metalness</label>
                    <input type="range" min="0" max="1" step="0.1">
                </div>
                <div class="property-group">
                    <label>Roughness</label>
                    <input type="range" min="0" max="1" step="0.1">
                </div>
            </div>
        `;
        
        return container;
    }

    createTimelineContent() {
        const container = document.createElement('div');
        container.className = 'timeline-container';
        
        container.innerHTML = `
            <div class="timeline-toolbar">
                <div class="playback-controls">
                    <button title="First Frame"><i class="fas fa-step-backward"></i></button>
                    <button title="Play/Pause"><i class="fas fa-play"></i></button>
                    <button title="Last Frame"><i class="fas fa-step-forward"></i></button>
                </div>
                <div class="time-display">
                    <span>Frame: </span>
                    <input type="number" value="0" min="0">
                    <span>Time: </span>
                    <input type="text" value="00:00:00">
                </div>
            </div>
            <div class="timeline-tracks">
                <div class="track-labels">
                    <div class="track-label">Main</div>
                    <div class="track-label">Camera</div>
                    <div class="track-label">Lights</div>
                </div>
                <div class="track-content">
                    <!-- Timeline tracks will be rendered here -->
                </div>
            </div>
        `;
        
        return container;
    }

    createStatusBar() {
        const statusBar = document.createElement('div');
        statusBar.className = 'status-bar';
        
        statusBar.innerHTML = `
            <div class="status-section">
                <span class="fps">FPS: 60</span>
                <span class="objects">Objects: 0</span>
                <span class="vertices">Vertices: 0</span>
            </div>
            <div class="status-section">
                <span class="tool">Tool: Select</span>
                <span class="coordinates">X: 0 Y: 0 Z: 0</span>
            </div>
            <div class="status-section">
                <span class="memory">Memory: 0 MB</span>
                <span class="render-time">Render: 0ms</span>
            </div>
        `;
        
        document.body.appendChild(statusBar);
    }

    // ... (Additional widget functionality)
}
