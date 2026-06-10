let fs = require('fs');
let c = fs.readFileSync('C:/Users/Administrator/Desktop/AI/index.html', 'utf-8');

// 1. Add "thinking" text to typing indicator
c = c.replace(
  'typing.innerHTML = \'<div class="chat-avatar">🤖</div><div class="chat-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>\';',
  'typing.innerHTML = \'<div class="chat-avatar">🤖</div><div class="chat-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div><div style="font-size:11px;color:#94a3b8;margin-top:4px;">AI正在分析数据，请稍候...</div></div>\';'
);

// 2. Replace getDataContext with compact version
let start = c.indexOf('function getDataContext() {');
let d = 0, end = -1;
for (let i = start + 28; i < c.length; i++) {
  if (c[i] === '{') d++;
  else if (c[i] === '}') { d--; if (d === 0) { end = i; break; } }
}

let newFn = 'function getDataContext() {\n' +
'  if (!state.rawData || state.rawData.length === 0) return \"(暂无导入数据)\";\n' +
'  var ips = new Set(); state.rawData.forEach(function(r) { if (r.IP) ips.add(r.IP); });\n' +
'  var regions = new Set(); state.rawData.forEach(function(r) { if (r[\"渠道\"]) regions.add(r[\"渠道\"]); });\n' +
'  return \"已导入\" + state.rawData.length + \"条。IP:\" + Array.from(ips).slice(0,20).join(\",\") + (ips.size > 20 ? \"等\" + ips.size + \"个\" : \"\") + \"。区域:\" + Array.from(regions).join(\",\") + \"。\";\n' +
'}';

c = c.substring(0, start) + newFn + c.substring(end + 1);

// Verify
let js = c.substring(c.lastIndexOf('<script>') + 8, c.lastIndexOf('</script>'));
try { new Function(js); console.log('JS OK'); } catch (e) { console.log('ERROR:', e.message); }

fs.writeFileSync('C:/Users/Administrator/Desktop/AI/index.html', c);
console.log('Done');
