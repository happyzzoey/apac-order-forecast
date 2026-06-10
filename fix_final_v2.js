let fs = require('fs');
let c = fs.readFileSync('C:/Users/Administrator/Desktop/AI/index.html', 'utf-8');

// ===== 1. Remove mode toggle, show both sections =====
c = c.replace(
  '<div class="mode-toggle">\n      <button class="mode-btn active" data-mode="dp" onclick="switchMode(\'dp\')">📊 DP预测</button>\n      <button class="mode-btn" data-mode="chat" onclick="switchMode(\'chat\')">💬 AI分析</button>\n    </div>',
  '<div class="mode-toggle"><span style="color:rgba(255,255,255,0.8);font-size:14px;">📊 DP需求预测 + 💬 AI市场分析</span></div>'
);
console.log('1. Mode toggle removed');

// ===== 2. Make chat card always visible (not hidden) =====
c = c.replace('<div class="card hidden" id="chatCard">', '<div class="card" id="chatCard">');
console.log('2. Chat card always visible');

// ===== 3. Remove switchMode function =====
c = c.replace(/function switchMode\(mode\) \{[\s\S]*?\n\}/, '');
console.log('3. switchMode removed');

// ===== 4. Remove switchMode calls in onclick =====
// Already removed in step 1

// ===== 5. Remove state.mode references =====
c = c.replace("var state = { mode: 'dp', rawData: null, headers: [], importFileName: null, importTime: null, tableFormat: 'simple' };",
  "var state = { rawData: null, headers: [], importFileName: null, importTime: null, tableFormat: 'simple' };");
console.log('5. state.mode removed');

// ===== 6. Fix loadChatSettings to auto-load on page load =====
c = c.replace(
  '// Load saved API settings\n  if (mode === \'chat\') loadChatSettings();',
  'loadChatSettings();'
);
// Also remove remaining references
c = c.replace(
  '// Load saved API settings\n  if (mode === \'chat\') loadChatSettings();\n}',
  'loadChatSettings();\n}'
);
console.log('6. loadChatSettings fixed');

// ===== 7. Remove the mode-switch related card show/hide =====
let oldSwitchBody = `  document.querySelectorAll('.mode-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  // Show/hide cards
  var dpCards = ['filterCard', 'previewCard', 'resultCard'];
  dpCards.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', mode !== 'dp');
  });
  var chatCard = document.getElementById('chatCard');
  if (chatCard) chatCard.classList.toggle('hidden', mode !== 'chat');`;
c = c.replace(oldSwitchBody, '');
console.log('7. Card toggle removed');

// ===== 8. Move chat API settings into a collapsible section =====
c = c.replace(
  '<div class="card-title"><span class="icon icon-purple">💬</span> AI 市场分析助手</div>',
  '<div class="card-title"><span class="icon icon-purple">💬</span> AI 市场分析助手 <span style="font-size:11px;font-weight:400;color:var(--text-secondary);">（基于导入数据 + AI大模型）</span></div>'
);
console.log('8. Chat title updated');

// ===== 9. Auto-load settings on page load =====
// Add at the end before INIT
c = c.replace('// ===== INIT =====', 'loadChatSettings();\n\n// ===== INIT =====');
console.log('9. Auto-load API settings on init');

// ===== Verify =====
let js = c.substring(c.lastIndexOf('<script>') + 8, c.lastIndexOf('</script>'));
try {
  new Function(js);
  console.log('JS OK');
} catch (e) {
  console.log('JS ERROR:', e.message);
}

// Save back to DP_Final.html
fs.writeFileSync('C:/Users/Administrator/Desktop/AI/DP_Final.html', c);
fs.writeFileSync('C:/Users/Administrator/Desktop/AI/index.html', c);
console.log('=== Both files saved ===');
