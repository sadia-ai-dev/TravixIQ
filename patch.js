const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  /{navItems\.map\(\(item\) => \{[\s\S]*?const isActive = activeTab === item\.id;[\s\S]*?return \([\s\S]*?<button[\s\S]*?onClick=\{\(\) => setActiveTab\(item\.id\)\}[\s\S]*?className=\{`w-full px-3\.5 py-2\.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all \$\{[\s\S]*?isActive [\s\S]*?\? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600\/10' [\s\S]*?: isLight [\s\S]*?\? 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'[\s\S]*?: 'text-zinc-400 hover:bg-zinc-800\/55 hover:text-zinc-100'[\s\S]*?`\}[\s\S]*?>[\s\S]*?\{item\.icon\}[\s\S]*?\{item\.label\}[\s\S]*?<\/button>[\s\S]*?\);[\s\S]*?\}\)}/,
  `{navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isScamShield = item.id === 'scam-shield';
              return (
                <button
                  id={\`nav-item-\${item.id}\`}
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={\`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all \${
                    isActive 
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/10' 
                      : isScamShield
                        ? (isLight ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20')
                        : isLight 
                          ? 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900' 
                          : 'text-zinc-400 hover:bg-zinc-800/55 hover:text-zinc-100'
                  }\`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </div>
                  {isScamShield && !isActive && <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>}
                </button>
              );
            })}`
);
fs.writeFileSync('src/App.tsx', content);
