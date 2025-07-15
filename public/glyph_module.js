
class GlyphEngine {
    constructor() {
        this.glyphSymbols = ['⚡', '🌀', '🔮', '⭐', '🌙', '☀️', '🔥', '💫', '🌊', '⚛️'];
        this.canvas = null;
        this.ctx = null;
    }

    initCanvas(canvasId, width = 600, height = 400) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = canvasId;
            this.canvas.width = width;
            this.canvas.height = height;
        }
        this.ctx = this.canvas.getContext('2d');
        return this.canvas;
    }

    generateGlyph(hash, entropy, weight) {
        return {
            symbol: this.glyphSymbols[hash % this.glyphSymbols.length],
            color: this.hashToColor(hash),
            size: Math.max(12, Math.min(48, weight / 10)),
            opacity: Math.max(0.3, Math.min(1, entropy / 10)),
            pulse: entropy > 7
        };
    }

    hashToColor(hash) {
        const hue = hash % 360;
        const saturation = 70 + (hash % 30);
        const lightness = 50 + (hash % 25);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    renderNFTPreview(container, metadata) {
        const preview = document.createElement('div');
        preview.className = 'nft-preview';
        preview.innerHTML = `
            <div class="nft-card">
                <div class="nft-glyph">${metadata.symbol || '🔮'}</div>
                <h3>${metadata.name || 'Untitled Scroll'}</h3>
                <p class="nft-cid">CID: ${metadata.cid || 'Not minted'}</p>
                <div class="nft-attributes">
                    <span class="attr">Entropy: ${metadata.entropy || 0}</span>
                    <span class="attr">Weight: ${metadata.weight || 0}</span>
                </div>
            </div>
        `;
        container.appendChild(preview);
        return preview;
    }

    renderEntropyGraph(svgElement, data) {
        const width = 600;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };

        const svg = d3.select(svgElement)
            .attr('width', width)
            .attr('height', height);

        svg.selectAll('*').remove();

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.timestamp))
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.entropy))
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .x(d => xScale(d.timestamp))
            .y(d => yScale(d.entropy))
            .curve(d3.curveMonotoneX);

        // Add gradient
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'entropy-gradient')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0).attr('y1', height)
            .attr('x2', 0).attr('y2', 0);

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#0066ff')
            .attr('stop-opacity', 0.1);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#6c5ce7')
            .attr('stop-opacity', 0.8);

        // Add area
        const area = d3.area()
            .x(d => xScale(d.timestamp))
            .y0(height - margin.bottom)
            .y1(d => yScale(d.entropy))
            .curve(d3.curveMonotoneX);

        svg.append('path')
            .datum(data)
            .attr('fill', 'url(#entropy-gradient)')
            .attr('d', area);

        // Add line
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#0066ff')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Add dots
        svg.selectAll('.dot')
            .data(data)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.timestamp))
            .attr('cy', d => yScale(d.entropy))
            .attr('r', 4)
            .attr('fill', '#fd79a8');

        return svg;
    }

    renderDAOThreads(container, threads) {
        const threadContainer = document.createElement('div');
        threadContainer.className = 'dao-threads';

        threads.forEach((thread, index) => {
            const threadElement = document.createElement('div');
            threadElement.className = 'dao-thread';
            threadElement.innerHTML = `
                <div class="thread-header">
                    <span class="thread-glyph">${this.glyphSymbols[index % this.glyphSymbols.length]}</span>
                    <span class="thread-title">${thread.title}</span>
                    <span class="thread-entropy">Entropy: ${thread.entropy}</span>
                </div>
                <div class="thread-body">
                    <p>${thread.description}</p>
                    <div class="thread-commits">
                        ${thread.commits.map(commit => `
                            <span class="commit">${commit.hash.substring(0, 7)}</span>
                        `).join('')}
                    </div>
                </div>
            `;
            threadContainer.appendChild(threadElement);
        });

        container.appendChild(threadContainer);
        return threadContainer;
    }

    createKeyAuthenticator(container) {
        const authenticator = document.createElement('div');
        authenticator.className = 'key-authenticator';
        authenticator.innerHTML = `
            <div class="auth-header">
                <h3>🔑 Key Gate Authenticator</h3>
            </div>
            <div class="auth-services">
                <div class="service-auth">
                    <label>OpenAI API Key:</label>
                    <input type="password" id="openai-key" placeholder="sk-...">
                    <button onclick="glyphEngine.validateKey('openai', document.getElementById('openai-key').value)">Validate</button>
                    <span class="status" id="openai-status">❌</span>
                </div>
                <div class="service-auth">
                    <label>Supabase Key:</label>
                    <input type="password" id="supabase-key" placeholder="eyJ...">
                    <button onclick="glyphEngine.validateKey('supabase', document.getElementById('supabase-key').value)">Validate</button>
                    <span class="status" id="supabase-status">❌</span>
                </div>
                <div class="service-auth">
                    <label>Web3Storage Token:</label>
                    <input type="password" id="web3storage-key" placeholder="eyJ...">
                    <button onclick="glyphEngine.validateKey('web3storage', document.getElementById('web3storage-key').value)">Validate</button>
                    <span class="status" id="web3storage-status">❌</span>
                </div>
            </div>
        `;
        container.appendChild(authenticator);
        return authenticator;
    }

    async validateKey(service, key) {
        try {
            const response = await fetch('/api/validate-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
            });

            const result = await response.json();
            const statusElement = document.getElementById(`${service}-status`);
            
            if (result.valid) {
                statusElement.textContent = '✅';
                statusElement.style.color = '#10b981';
            } else {
                statusElement.textContent = '❌';
                statusElement.style.color = '#ef4444';
            }

            return result.valid;
        } catch (error) {
            console.error('Key validation error:', error);
            return false;
        }
    }
}

// Global instance
const glyphEngine = new GlyphEngine();
