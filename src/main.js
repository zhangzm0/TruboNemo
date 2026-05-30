// src/main.js
import { NemoPlayer } from './core/nemo-player.js';

// 从 URL 参数获取作品 ID
const params = new URLSearchParams(window.location.search);
const workId = params.get('id') || '272459552'; // 默认作品

const core = new NemoPlayer({ container: 'body', width: 562, height: 900 });

// 内置扩展
core.use((await import('./extensions/screen/index.js')).default);
core.use((await import('./extensions/actor/index.js')).default);

// 动态加载扩展
const extList = [
    'motion',
    'looks',
    'operators',
    'variables',
    'sensing',
    'clone',
    'sound',
    'pen',
    'procedures',
    'broadcast',
];

for (const name of extList) {
    try {
        const mod = await import(`./extensions/${name}/index.js`);
        core.use(mod.default);
        console.log(`✅ ${name}`);
    } catch (e) {
        console.warn(`⚠️ ${name} 加载失败:`, e.message);
    }
}

// FPS
const fpsEl = document.getElementById('fps');
const timerEl = document.getElementById('timer');
let elapsed = 0;

core.app.ticker.add(() => {
    fpsEl.textContent = `FPS: ${core.getFPS()}`;
    elapsed += core.app.ticker.deltaMS / 1000;
    timerEl.textContent = elapsed.toFixed(2) + 's';
});

core.loadFromWorkId(parseInt(workId)).then(() => console.log('✅ 就绪'));

window.core = core;