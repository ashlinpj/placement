const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const FONT = '"Fira Code", monospace';

// ── Utility ──
function drawRoundedRect(x, y, w, h, r, fillStyle, strokeStyle, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fillStyle) { ctx.fillStyle = fillStyle; ctx.fill(); }
    if (strokeStyle) { ctx.strokeStyle = strokeStyle; ctx.lineWidth = lineWidth || 1; ctx.stroke(); }
}

function drawArrow(x1, y1, x2, y2, color, alpha) {
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLen = 8;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4));
    ctx.stroke();
    ctx.globalAlpha = 1;
}

// ══════════════════════════════════════════
//  DSA Structure Visualizations
// ══════════════════════════════════════════

class DSAStructure {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.alpha = 0.18 + Math.random() * 0.12;
        this.highlightIdx = -1;
        this.highlightTimer = 0;
        this.scale = 0.7 + Math.random() * 0.3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        const margin = 200;
        if (this.x < -margin) this.x = W + margin;
        if (this.x > W + margin) this.x = -margin;
        if (this.y < -margin) this.y = H + margin;
        if (this.y > H + margin) this.y = -margin;

        // Animate highlight
        this.highlightTimer++;
        if (this.highlightTimer > 40) {
            this.highlightTimer = 0;
            this.highlightIdx++;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);

        switch (this.type) {
            case 'stack': this.drawStack(); break;
            case 'linkedlist': this.drawLinkedList(); break;
            case 'array': this.drawArray(); break;
            case 'queue': this.drawQueue(); break;
            case 'bst': this.drawBST(); break;
            case 'graph': this.drawGraph(); break;
            case 'heap': this.drawHeap(); break;
            case 'hashtable': this.drawHashTable(); break;
        }

        ctx.restore();
    }

    // ── Stack ──
    drawStack() {
        const items = [17, 42, 8, 31, 55];
        const bw = 60, bh = 28, gap = 4;
        const totalH = items.length * (bh + gap);
        const cyan = '#00c8ff';

        // Label
        ctx.globalAlpha = this.alpha * 1.3;
        ctx.fillStyle = cyan;
        ctx.font = `bold 11px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText('STACK', 30, -totalH - 15);

        // Top arrow
        ctx.globalAlpha = this.alpha;
        drawArrow(-25, -totalH + bh / 2, -5, -totalH + bh / 2, cyan, this.alpha * 0.8);
        ctx.globalAlpha = this.alpha * 0.9;
        ctx.font = `9px ${FONT}`;
        ctx.textAlign = 'right';
        ctx.fillStyle = cyan;
        ctx.fillText('TOP', -28, -totalH + bh / 2 + 3);

        for (let i = 0; i < items.length; i++) {
            const yy = -totalH + i * (bh + gap);
            const isHi = (this.highlightIdx % items.length) === i;
            const a = isHi ? this.alpha * 2.5 : this.alpha;

            ctx.globalAlpha = a;
            ctx.shadowColor = isHi ? cyan : 'transparent';
            ctx.shadowBlur = isHi ? 12 : 0;
            drawRoundedRect(0, yy, bw, bh, 4,
                `rgba(0, 200, 255, ${isHi ? 0.15 : 0.05})`,
                cyan, isHi ? 2 : 1);
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#fff';
            ctx.font = `13px ${FONT}`;
            ctx.textAlign = 'center';
            ctx.fillText(items[i], 30, yy + bh / 2 + 4);
        }
        ctx.globalAlpha = 1;
    }

    // ── Linked List ──
    drawLinkedList() {
        const items = [3, 7, 15, 22];
        const nw = 50, nh = 30, gap = 30;
        const pink = '#ff2daa';

        ctx.globalAlpha = this.alpha * 1.3;
        ctx.fillStyle = pink;
        ctx.font = `bold 11px ${FONT}`;
        ctx.textAlign = 'left';
        ctx.fillText('LINKED LIST', 0, -15);

        for (let i = 0; i < items.length; i++) {
            const xx = i * (nw + gap);
            const isHi = (this.highlightIdx % items.length) === i;
            const a = isHi ? this.alpha * 2.5 : this.alpha;

            ctx.globalAlpha = a;
            ctx.shadowColor = isHi ? pink : 'transparent';
            ctx.shadowBlur = isHi ? 12 : 0;

            // Node box (data | next)
            drawRoundedRect(xx, 0, nw, nh, 4,
                `rgba(255, 45, 170, ${isHi ? 0.15 : 0.05})`,
                pink, isHi ? 2 : 1);
            // Divider
            ctx.beginPath();
            ctx.moveTo(xx + nw * 0.65, 0);
            ctx.lineTo(xx + nw * 0.65, nh);
            ctx.strokeStyle = pink;
            ctx.globalAlpha = a * 0.5;
            ctx.stroke();
            ctx.globalAlpha = a;
            ctx.shadowBlur = 0;

            // Value
            ctx.fillStyle = '#fff';
            ctx.font = `12px ${FONT}`;
            ctx.textAlign = 'center';
            ctx.fillText(items[i], xx + nw * 0.32, nh / 2 + 4);

            // Arrow to next
            if (i < items.length - 1) {
                drawArrow(xx + nw, nh / 2, xx + nw + gap, nh / 2, pink, a);
            } else {
                // NULL
                ctx.globalAlpha = a * 0.6;
                ctx.fillStyle = pink;
                ctx.font = `9px ${FONT}`;
                ctx.textAlign = 'center';
                ctx.fillText('null', xx + nw * 0.82, nh / 2 + 3);
            }
        }
        ctx.globalAlpha = 1;
    }

    // ── Array ──
    drawArray() {
        const items = [5, 12, 3, 9, 21, 7];
        const cw = 38, ch = 32;
        const green = '#00ff88';

        ctx.globalAlpha = this.alpha * 1.3;
        ctx.fillStyle = green;
        ctx.font = `bold 11px ${FONT}`;
        ctx.textAlign = 'left';
        ctx.fillText('ARRAY', 0, -15);

        for (let i = 0; i < items.length; i++) {
            const xx = i * cw;
            const isHi = (this.highlightIdx % items.length) === i;
            const a = isHi ? this.alpha * 2.5 : this.alpha;

            ctx.globalAlpha = a;
            ctx.shadowColor = isHi ? green : 'transparent';
            ctx.shadowBlur = isHi ? 12 : 0;
            drawRoundedRect(xx, 0, cw, ch, 2,
                `rgba(0, 255, 136, ${isHi ? 0.15 : 0.04})`,
                green, isHi ? 2 : 1);
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#fff';
            ctx.font = `12px ${FONT}`;
            ctx.textAlign = 'center';
            ctx.fillText(items[i], xx + cw / 2, ch / 2 + 4);

            // Index below
            ctx.globalAlpha = a * 0.5;
            ctx.fillStyle = green;
            ctx.font = `9px ${FONT}`;
            ctx.fillText(i, xx + cw / 2, ch + 14);
        }
        ctx.globalAlpha = 1;
    }

    // ── Queue ──
    drawQueue() {
        const items = [8, 14, 27, 33, 41];
        const cw = 40, ch = 30, gap = 6;
        const yellow = '#ffcc00';

        ctx.globalAlpha = this.alpha * 1.3;
        ctx.fillStyle = yellow;
        ctx.font = `bold 11px ${FONT}`;
        ctx.textAlign = 'left';
        ctx.fillText('QUEUE', 0, -15);

        // Front / Rear labels
        ctx.globalAlpha = this.alpha * 0.8;
        ctx.font = `9px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText('Front', cw / 2, ch + 18);
        ctx.fillText('Rear', (items.length - 1) * (cw + gap) + cw / 2, ch + 18);

        for (let i = 0; i < items.length; i++) {
            const xx = i * (cw + gap);
            const isHi = (this.highlightIdx % items.length) === i;
            const a = isHi ? this.alpha * 2.5 : this.alpha;

            ctx.globalAlpha = a;
            ctx.shadowColor = isHi ? yellow : 'transparent';
            ctx.shadowBlur = isHi ? 12 : 0;
            drawRoundedRect(xx, 0, cw, ch, 4,
                `rgba(255, 204, 0, ${isHi ? 0.15 : 0.04})`,
                yellow, isHi ? 2 : 1);
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#fff';
            ctx.font = `12px ${FONT}`;
            ctx.textAlign = 'center';
            ctx.fillText(items[i], xx + cw / 2, ch / 2 + 4);
        }

        // Arrows
        ctx.globalAlpha = this.alpha * 0.7;
        drawArrow(-20, ch / 2, -4, ch / 2, yellow, this.alpha * 0.7);
        const lastX = (items.length - 1) * (cw + gap) + cw;
        drawArrow(lastX + 4, ch / 2, lastX + 20, ch / 2, yellow, this.alpha * 0.7);

        ctx.globalAlpha = 1;
    }

    // ── Binary Search Tree ──
    drawBST() {
        const nodes = [
            { v: 20, x: 0, y: 0 },
            { v: 10, x: -50, y: 45 },
            { v: 30, x: 50, y: 45 },
            { v: 5, x: -75, y: 90 },
            { v: 15, x: -25, y: 90 },
            { v: 25, x: 25, y: 90 },
            { v: 35, x: 75, y: 90 },
        ];
        const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
        const purple = '#7b2fff';
        const r = 16;

        ctx.globalAlpha = this.alpha * 1.3;
        ctx.fillStyle = purple;
        ctx.font = `bold 11px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText('BST', 0, -20);

        // Edges
        edges.forEach(([a, b]) => {
            ctx.globalAlpha = this.alpha * 0.7;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.strokeStyle = purple;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Nodes
        nodes.forEach((n, i) => {
            const isHi = (this.highlightIdx % nodes.length) === i;
            const a = isHi ? this.alpha * 2.5 : this.alpha;

            ctx.globalAlpha = a;
            ctx.shadowColor = isHi ? purple : 'transparent';
            ctx.shadowBlur = isHi ? 14 : 0;

            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(123, 47, 255, ${isHi ? 0.2 : 0.06})`;
            ctx.fill();
            ctx.strokeStyle = purple;
            ctx.lineWidth = isHi ? 2 : 1;
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#fff';
            ctx.font = `12px ${FONT}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(n.v, n.x, n.y);
        });
        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = 1;
    }

    // ── Graph ──
    drawGraph() {
        const nodes = [
            { x: 0, y: 0 }, { x: 60, y: -30 }, { x: 80, y: 40 },
            { x: -10, y: 60 }, { x: -55, y: 20 },
        ];
        const edges = [[0,1],[1,2],[2,3],[3,4],[4,0],[0,2],[1,3]];
        const cyan = '#00c8ff';
        const r = 14;

        ctx.globalAlpha = this.alpha * 1.3;
        ctx.fillStyle = cyan;
        ctx.font = `bold 11px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText('GRAPH', 15, -45);

        edges.forEach(([a, b]) => {
            ctx.globalAlpha = this.alpha * 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.strokeStyle = cyan;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        nodes.forEach((n, i) => {
            const isHi = (this.highlightIdx % nodes.length) === i;
            const a = isHi ? this.alpha * 2.5 : this.alpha;

            ctx.globalAlpha = a;
            ctx.shadowColor = isHi ? cyan : 'transparent';
            ctx.shadowBlur = isHi ? 14 : 0;

            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 200, 255, ${isHi ? 0.18 : 0.06})`;
            ctx.fill();
            ctx.strokeStyle = cyan;
            ctx.lineWidth = isHi ? 2 : 1;
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#fff';
            ctx.font = `11px ${FONT}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i, n.x, n.y);
        });
        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = 1;
    }

    // ── Heap (Min-Heap visual) ──
    drawHeap() {
        const nodes = [
            { v: 2, x: 0, y: 0 },
            { v: 5, x: -40, y: 38 },
            { v: 8, x: 40, y: 38 },
            { v: 10, x: -60, y: 76 },
            { v: 12, x: -20, y: 76 },
            { v: 15, x: 20, y: 76 },
            { v: 20, x: 60, y: 76 },
        ];
        const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
        const orange = '#ff8c00';
        const r = 14;

        ctx.globalAlpha = this.alpha * 1.3;
        ctx.fillStyle = orange;
        ctx.font = `bold 11px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText('MIN HEAP', 0, -18);

        edges.forEach(([a, b]) => {
            ctx.globalAlpha = this.alpha * 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.strokeStyle = orange;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        nodes.forEach((n, i) => {
            const isHi = (this.highlightIdx % nodes.length) === i;
            const a = isHi ? this.alpha * 2.5 : this.alpha;

            ctx.globalAlpha = a;
            ctx.shadowColor = isHi ? orange : 'transparent';
            ctx.shadowBlur = isHi ? 14 : 0;

            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 140, 0, ${isHi ? 0.18 : 0.06})`;
            ctx.fill();
            ctx.strokeStyle = orange;
            ctx.lineWidth = isHi ? 2 : 1;
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#fff';
            ctx.font = `11px ${FONT}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(n.v, n.x, n.y);
        });
        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = 1;
    }

    // ── Hash Table ──
    drawHashTable() {
        const buckets = [
            { key: '"age"', val: '25' },
            { key: '', val: '' },
            { key: '"name"', val: '"A"' },
            { key: '"id"', val: '42' },
            { key: '', val: '' },
            { key: '"key"', val: '"X"' },
        ];
        const teal = '#00e5a0';
        const bw = 100, bh = 22, gap = 3;

        ctx.globalAlpha = this.alpha * 1.3;
        ctx.fillStyle = teal;
        ctx.font = `bold 11px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText('HASH TABLE', bw / 2, -12);

        buckets.forEach((b, i) => {
            const yy = i * (bh + gap);
            const isHi = (this.highlightIdx % buckets.length) === i && b.key;
            const a = isHi ? this.alpha * 2.5 : this.alpha;

            ctx.globalAlpha = a;
            ctx.shadowColor = isHi ? teal : 'transparent';
            ctx.shadowBlur = isHi ? 10 : 0;

            // Index column
            drawRoundedRect(0, yy, 22, bh, 2,
                `rgba(0, 229, 160, ${isHi ? 0.12 : 0.03})`,
                teal, 1);
            ctx.fillStyle = teal;
            ctx.font = `9px ${FONT}`;
            ctx.textAlign = 'center';
            ctx.fillText(i, 11, yy + bh / 2 + 3);

            // Data column
            drawRoundedRect(24, yy, bw - 24, bh, 2,
                `rgba(0, 229, 160, ${isHi ? 0.12 : 0.03})`,
                teal, isHi ? 2 : 1);
            ctx.shadowBlur = 0;

            if (b.key) {
                ctx.fillStyle = '#fff';
                ctx.font = `10px ${FONT}`;
                ctx.textAlign = 'center';
                ctx.fillText(`${b.key}: ${b.val}`, 24 + (bw - 24) / 2, yy + bh / 2 + 3);
            }
        });
        ctx.globalAlpha = 1;
    }
}

// ══════════════════════════════════════════
//  Initialize Structures
// ══════════════════════════════════════════

const TYPES = ['stack', 'linkedlist', 'array', 'queue', 'bst', 'graph', 'heap', 'hashtable'];
const structures = [];

function initStructures() {
    structures.length = 0;
    TYPES.forEach((type, i) => {
        // Distribute across the canvas in a loose grid
        const cols = 4;
        const row = Math.floor(i / cols);
        const col = i % cols;
        const cellW = W / cols;
        const cellH = H / 2;
        const x = cellW * col + cellW * 0.2 + Math.random() * cellW * 0.4;
        const y = cellH * row + cellH * 0.25 + Math.random() * cellH * 0.3;
        structures.push(new DSAStructure(type, x, y));
    });
}
initStructures();
window.addEventListener('resize', () => { resize(); initStructures(); });

// ── Floating code snippets (reduced count) ──
const CODE_SNIPPETS = [
    'if (left < right)',
    'push(stack, node)',
    'while (!queue.empty())',
    'return dp[n][m]',
    'visited[v] = true',
    'node.next = prev',
    'for i in range(n):',
    'adj[u].push(v)',
];

class FloatingCode {
    constructor() {
        this.reset();
        this.y = Math.random() * H;
    }
    reset() {
        this.x = -300;
        this.y = Math.random() * H;
        this.speed = 0.2 + Math.random() * 0.4;
        this.text = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
        this.alpha = 0.04 + Math.random() * 0.05;
        this.size = 12 + Math.random() * 4;
    }
    update() {
        this.x += this.speed;
        if (this.x > W + 300) this.reset();
    }
    draw() {
        ctx.font = `${this.size}px ${FONT}`;
        ctx.fillStyle = `rgba(0, 200, 255, ${this.alpha})`;
        ctx.textAlign = 'left';
        ctx.fillText(this.text, this.x, this.y);
    }
}

const floatingCodes = [];
for (let i = 0; i < 8; i++) {
    const fc = new FloatingCode();
    fc.x = Math.random() * W;
    floatingCodes.push(fc);
}

// ── Sparse ambient particles (just a few) ──
const particles = [];
for (let i = 0; i < 12; i++) {
    particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.2 + 0.05,
    });
}

// ══════════════════════════════════════════
//  Main Render Loop
// ══════════════════════════════════════════

function draw() {
    // Fade trail
    ctx.fillStyle = 'rgba(10, 10, 26, 0.25)';
    ctx.fillRect(0, 0, W, H);

    // Floating code
    floatingCodes.forEach(fc => { fc.update(); fc.draw(); });

    // Sparse particles
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123, 47, 255, ${p.alpha})`;
        ctx.fill();
    });

    // DSA Structures
    structures.forEach(s => { s.update(); s.draw(); });

    requestAnimationFrame(draw);
}

// Initial clear
ctx.fillStyle = '#0a0a1a';
ctx.fillRect(0, 0, W, H);
draw();
