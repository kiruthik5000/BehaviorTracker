import React from 'react';

// ─── Reusable Sub-components ──────────────────────────────────────────────────

const Icon = ({ name, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const NavBtn = ({ icon, label }) => (
  <button className="flex items-center gap-xs px-sm py-1.5 font-label-sm text-label-sm text-on-surface-variant hover:bg-ide-surface-variant hover:text-ide-primary transition-all rounded">
    <Icon name={icon} className="!text-[18px]" />
    <span>{label}</span>
  </button>
);

const SideNavItem = ({ icon, label, active = false }) => (
  <div className={`flex flex-col items-center gap-1 w-full py-2 cursor-pointer transition-all
    ${active
      ? 'text-ide-primary border-l-2 border-ide-primary bg-ide-surface-container-high'
      : 'text-on-surface-variant hover:bg-ide-surface-variant hover:text-on-surface'}`}>
    <Icon name={icon} />
    {label && <span className="font-label-sm text-label-sm scale-90">{label}</span>}
  </div>
);

const TabItem = ({ icon, iconColor, label, active = false }) => (
  <div className={`flex items-center gap-sm px-md h-full cursor-pointer transition-colors
    ${active
      ? 'bg-ide-surface-container-low border-t border-x border-outline-variant border-b-2 border-b-ide-primary'
      : 'text-on-surface-variant hover:bg-ide-surface-variant'}`}>
    <Icon name={icon} className={`!text-[14px] ${iconColor}`} />
    <span className="font-label-sm text-label-sm">{label}</span>
    <Icon name="close" className="!text-[12px] text-on-surface-variant hover:text-on-surface cursor-pointer" />
  </div>
);

const TestCase = ({ num, status, input, expected }) => (
  <div className="border border-outline-variant rounded-lg overflow-hidden bg-ide-surface-container-low/30">
    <div className="flex items-center justify-between px-md py-1.5 bg-ide-surface-container-high border-b border-outline-variant">
      <span className="font-label-sm text-label-sm font-bold text-on-surface">Case {num}</span>
      <div className="flex items-center gap-md">
        <span className={`text-[10px] font-bold uppercase ${status === 'Passed' ? 'text-green-400' : 'text-red-400'}`}>{status}</span>
        <Icon name="delete" className="!text-[14px] text-on-surface-variant cursor-pointer" />
      </div>
    </div>
    <div className="p-md grid grid-cols-2 gap-md">
      <div>
        <label className="text-[10px] text-on-surface-variant uppercase mb-1 block">Input</label>
        <div className="bg-ide-surface-container-lowest p-2 rounded font-code-md text-[13px] border border-outline-variant/30 text-ide-primary">{input}</div>
      </div>
      <div>
        <label className="text-[10px] text-on-surface-variant uppercase mb-1 block">Expected Output</label>
        <div className="bg-ide-surface-container-lowest p-2 rounded font-code-md text-[13px] border border-outline-variant/30 text-tertiary">{expected}</div>
      </div>
    </div>
  </div>
);

const LockedCase = ({ num }) => (
  <div className="border border-outline-variant/50 rounded-lg p-md flex items-center justify-between bg-ide-surface-container-low/10 opacity-70 grayscale">
    <div className="flex items-center gap-md">
      <Icon name="lock" className="text-outline" />
      <div>
        <div className="font-label-sm text-label-sm font-bold text-on-surface">Test Case {num} (Hidden)</div>
        <div className="text-[11px] text-on-surface-variant">Details available after submission</div>
      </div>
    </div>
    <span className="text-[10px] bg-ide-surface-container-high px-2 py-0.5 rounded text-on-surface-variant">LOCKED</span>
  </div>
);

// ─── Code snippet displayed in the editor ─────────────────────────────────────
const codeLines = [
  { type: 'comment', content: '/** @param {number[]} nums  @param {number} target  @return {number[]} */' },
  { type: 'line', content: ['keyword:const', ' ', 'function:twoSum', ' = ', 'keyword:function', '(nums, target) {'] },
  { type: 'line', content: ['    ', 'keyword:const', ' map = ', 'keyword:new', ' ', 'function:Map', '();'] },
  { type: 'line', content: ['    ', 'keyword:for', ' (', 'keyword:let', ' i = ', 'number:0', '; i < nums.length; i++) {'] },
  { type: 'line', content: ['        ', 'keyword:const', ' complement = target - nums[i];'] },
  { type: 'line', content: ['        ', 'keyword:if', ' (map.', 'function:has', '(complement)) {'] },
  { type: 'line', content: ['            ', 'keyword:return', ' [map.', 'function:get', '(complement), i];'] },
  { type: 'line', content: ['        }'] },
  { type: 'line', content: ['        map.', 'function:set', '(nums[i], i);'] },
  { type: 'line', content: ['    }'] },
  { type: 'line', content: ['};'] },
];

const colorMap = { keyword: 'code-syntax-keyword', function: 'code-syntax-function', number: 'code-syntax-number' };

function renderCodeLine(parts) {
  return parts.map((part, i) => {
    const [type, ...rest] = part.split(':');
    if (colorMap[type]) return <span key={i} className={colorMap[type]}>{rest.join(':')}</span>;
    return <span key={i}>{part}</span>;
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NeonIDE() {
  return (
    <div className="bg-ide-background text-on-surface text-[13px] overflow-hidden h-screen flex flex-col">

      {/* Top Nav */}
      <header className="bg-ide-surface-container-lowest border-b border-outline-variant flex justify-between items-center h-12 px-md w-full z-50">
        <div className="flex items-center gap-md">
          <span className="text-[20px] font-bold text-tertiary-fixed-dim tracking-tighter">NeonIDE</span>
          <div className="h-6 w-px bg-outline-variant ml-2" />
          <nav className="hidden md:flex gap-md items-center h-full">
            <a className="text-[11px] font-medium text-ide-primary border-b-2 border-ide-primary pb-1 hover:bg-ide-surface-variant transition-colors duration-200" href="#">Explorer</a>
            <a className="text-[11px] font-medium text-on-surface-variant hover:bg-ide-surface-variant hover:text-ide-primary transition-colors duration-200" href="#">Debugger</a>
            <a className="text-[11px] font-medium text-on-surface-variant hover:bg-ide-surface-variant hover:text-ide-primary transition-colors duration-200" href="#">Version Control</a>
          </nav>
        </div>
        <div className="flex items-center gap-sm">
          <div className="flex items-center bg-ide-surface-container-high px-sm py-1 rounded gap-xs mr-4 border border-outline-variant">
            <span className="text-[11px] text-on-surface-variant">JavaScript</span>
            <Icon name="expand_more" className="text-on-surface-variant !text-[14px]" />
          </div>
          <div className="flex items-center gap-xs">
            <NavBtn icon="format_align_left" label="Format" />
            <NavBtn icon="terminal" label="Run" />
            <button className="bg-tertiary-container text-on-tertiary-container px-md py-1.5 rounded text-[11px] font-bold uppercase tracking-wider glow-cyan active:opacity-80 active:scale-95 transition-all">
              Submit
            </button>
          </div>
          <div className="h-6 w-px bg-outline-variant mx-2" />
          <div className="flex items-center gap-xs">
            <Icon name="view_sidebar" className="p-1.5 hover:bg-ide-surface-variant rounded cursor-pointer text-on-surface-variant" />
            <Icon name="settings" className="p-1.5 hover:bg-ide-surface-variant rounded cursor-pointer text-on-surface-variant" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">

        {/* Side Nav */}
        <aside className="bg-ide-surface-dim border-r border-outline-variant flex flex-col items-center py-md gap-lg h-full w-16 shrink-0">
          <div className="flex flex-col gap-md items-center w-full">
            <SideNavItem icon="code" label="Challenges" active />
            <SideNavItem icon="search" label="Search" />
            <SideNavItem icon="account_tree" label="Source" />
            <SideNavItem icon="bug_report" label="Debug" />
          </div>
          <div className="mt-auto flex flex-col gap-md items-center w-full">
            <SideNavItem icon="settings" />
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant mb-4">
              <img alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4OfAMnt8nTixCqzcwM3vNgkkjI2KJ-_5dbRquca2dOX2bnip7UDXcqBnbvGRsht1HcdLe15ojJI9w0hbuWk4Ym8Jf3HRRhpN0Dw3lEF2yL3yfnJPddUfGHyeX7QKZGVS3pvj_4k4MldciGhSbiZTXB0Tr-CrjXZ7sqUovy1pVVB8r3QZXFiWPhdL7wWklkg4tn3O8CIIZ1HV3kTTTXuHAAgpX2VgOeOUJE8pCsjlGyACbk6fLwIoG-fPDKBzM7VSZ9kIhYK1zVyxy" />
            </div>
          </div>
        </aside>

        <main className="flex-1 flex overflow-hidden">

          {/* Left Panel: Problem */}
          <section className="w-[420px] bg-ide-surface-container-low border-r border-outline-variant flex flex-col shrink-0 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-sm mb-2">
                <span className="px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-800/50 text-[10px] font-bold uppercase">Easy</span>
                <span className="text-[11px] text-on-surface-variant">ID: 1</span>
              </div>
              <h1 className="text-[20px] font-bold text-ide-primary mb-4">Two Sum</h1>
              <div className="text-on-surface-variant text-[13px] leading-relaxed space-y-4">
                <p>Given an array of integers <code className="bg-ide-surface-container-high px-1 rounded text-ide-primary">nums</code> and an integer <code className="bg-ide-surface-container-high px-1 rounded text-ide-primary">target</code>, return indices of the two numbers such that they add up to target.</p>
                <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
                {[
                  { title: 'Example 1', input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9, return [0, 1].' },
                  { title: 'Example 2', input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
                ].map(({ title, input, output, explanation }) => (
                  <div key={title}>
                    <h3 className="text-on-surface font-bold mb-2">{title}:</h3>
                    <div className="bg-ide-surface-container-lowest p-4 rounded border border-outline-variant font-mono text-[12px] space-y-1">
                      <p><span className="text-on-surface-variant">Input:</span> {input}</p>
                      <p><span className="text-on-surface-variant">Output:</span> {output}</p>
                      {explanation && <p><span className="text-on-surface-variant">Explanation:</span> {explanation}</p>}
                    </div>
                  </div>
                ))}
                <div>
                  <h3 className="text-on-surface font-bold mb-2">Constraints:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>2 &lt;= nums.length &lt;= 10<sup>4</sup></li>
                    <li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
                    <li>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></li>
                    <li className="text-tertiary">Only one valid answer exists.</li>
                  </ul>
                </div>
                <div className="p-4 bg-ide-surface-container-high rounded-lg border border-outline-variant/30 italic">
                  <span className="text-tertiary font-bold not-italic mr-2">Follow-up:</span>
                  Can you come up with an algorithm less than O(n<sup>2</sup>) time complexity?
                </div>
              </div>
            </div>
          </section>

          {/* Center Panel: Editor */}
          <section className="flex-1 flex flex-col min-w-0 bg-ide-surface-container-low border-r border-outline-variant">
            {/* Tabs */}
            <div className="flex items-center bg-ide-surface-container-lowest border-b border-outline-variant h-10 px-xs gap-xs">
              <TabItem icon="javascript" iconColor="text-amber-400" label="solution.js" active />
              <TabItem icon="description" iconColor="text-ide-primary" label="notes.md" />
            </div>

            {/* Editor */}
            <div className="flex-1 flex overflow-hidden font-mono text-[13px] bg-ide-surface-container-low">
              <div className="w-12 border-r border-outline-variant/30 flex flex-col items-end py-4 pr-3 text-on-surface-variant/40 select-none leading-5">
                {Array.from({ length: 14 }, (_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <div className="flex-1 p-4 overflow-auto leading-5">
                {codeLines.map((line, i) => (
                  <div key={i}>
                    {line.type === 'comment'
                      ? <span className="code-syntax-comment">{line.content}</span>
                      : renderCodeLine(line.content)}
                  </div>
                ))}
              </div>
            </div>

            {/* Eval Bar */}
            <div className="h-10 bg-ide-surface-container-highest border-t border-outline-variant flex items-center px-md justify-between z-10">
              <div className="flex items-center gap-md">
                <div className="flex items-center gap-xs">
                  <Icon name="check_circle" className="text-green-400 !text-[18px]" />
                  <span className="text-[11px] font-bold text-green-400">Tests Passed: 12/12</span>
                </div>
                <div className="h-4 w-px bg-outline-variant" />
                {[{ icon: 'timer', label: 'Runtime: 45ms' }, { icon: 'memory', label: 'Memory: 42.1 MB' }].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-xs text-on-surface-variant">
                    <Icon name={icon} className="!text-[16px]" />
                    <span className="text-[11px]">{label}</span>
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-tertiary-fixed font-bold bg-tertiary-container/20 px-2 py-0.5 rounded">PASSED</span>
            </div>

            {/* Terminal */}
            <div className="h-80 border-t border-outline-variant flex flex-col">
              <div className="flex items-center bg-ide-surface-container-high px-md h-9 gap-lg">
                {['Output', 'Debug Console'].map(t => (
                  <div key={t} className="text-[11px] text-on-surface-variant h-full flex items-center cursor-pointer hover:text-on-surface border-b-2 border-transparent transition-all">{t}</div>
                ))}
                <div className="text-[11px] text-ide-primary border-b-2 border-ide-primary h-full flex items-center cursor-pointer font-bold">Custom Test Cases</div>
                <div className="ml-auto">
                  <Icon name="block" className="!text-[14px] text-on-surface-variant cursor-pointer hover:text-on-surface" />
                </div>
              </div>
              <div className="flex-1 bg-ide-surface-container-lowest overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-md py-2 border-b border-outline-variant/30 bg-ide-surface-container-low/50">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Test Suite</span>
                    <span className="px-1.5 py-0.5 rounded bg-ide-surface-container-high text-[10px] text-on-surface-variant">5 Cases Total</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <button className="flex items-center gap-1 px-2 py-1 rounded bg-ide-surface-container-high text-on-surface hover:bg-ide-surface-variant transition-colors text-[11px] font-bold">
                      <Icon name="add" className="!text-[14px]" /> Add Case
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 rounded bg-tertiary-container text-on-tertiary-container hover:opacity-90 transition-colors text-[11px] font-bold glow-cyan">
                      <Icon name="play_arrow" className="!text-[14px]" /> Run All
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-md space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="expand_more" className="!text-[14px] text-green-400" />
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Active Cases</span>
                    </div>
                    <TestCase num={1} status="Passed" input="nums = [2,7,11,15], target = 9" expected="[0,1]" />
                    <TestCase num={2} status="Passed" input="nums = [3,2,4], target = 6" expected="[1,2]" />
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="lock" className="!text-[14px] text-on-surface-variant" />
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Locked Cases</span>
                    </div>
                    <LockedCase num={4} />
                    <LockedCase num={5} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel: AI */}
          <section className="w-[280px] bg-ide-surface-container border-l border-outline-variant flex flex-col shrink-0">
            <div className="p-3 border-b border-outline-variant">
              <div className="flex items-center gap-sm mb-4">
                <Icon name="auto_awesome" className="text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }} />
                <span className="text-[16px] font-semibold">AI Insights</span>
              </div>
              <div className="bg-ide-surface-container-high border border-outline-variant p-sm rounded">
                <span className="text-[9px] uppercase tracking-widest text-on-surface-variant block mb-1">Complexity Analysis</span>
                <div className="flex justify-between items-center">
                  {[{ label: 'Time', val: 'O(n)', color: 'text-green-400' }, { label: 'Space', val: 'O(n)', color: 'text-amber-400' }].map(({ label, val, color }) => (
                    <div key={label} className="flex items-end gap-1">
                      <span className="text-[20px] font-semibold text-tertiary">{val}</span>
                      <span className={`text-[10px] pb-1 ${color}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-md flex flex-col gap-md">
              <div className="bg-ide-surface-container-highest/40 border border-tertiary/20 p-md rounded-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1">
                  <Icon name="bolt" className="!text-[14px] text-tertiary" />
                </div>
                <span className="text-[11px] text-tertiary font-bold mb-1 block">Optimization Hint</span>
                <p className="text-on-surface-variant text-[12px] leading-relaxed">Your hash map approach is optimal. It trades space for time, achieving linear complexity.</p>
              </div>
              <div className="mt-auto flex gap-sm items-start">
                <div className="w-6 h-6 rounded bg-secondary-container flex items-center justify-center shrink-0">
                  <Icon name="auto_awesome" className="!text-[14px] text-on-secondary-container" />
                </div>
                <div className="bg-ide-surface-container-high p-sm rounded-lg text-[12px]">
                  Your solution is perfect. Ready to move to the next challenge?
                </div>
              </div>
            </div>
            <div className="p-md border-t border-outline-variant">
              <div className="relative">
                <textarea
                  className="w-full bg-ide-surface-container-lowest border border-outline-variant rounded-xl px-md py-2 text-[13px] focus:outline-none focus:border-tertiary-container transition-all resize-none overflow-hidden"
                  placeholder="Ask AI..."
                  rows={1}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-tertiary-container">
                  <Icon name="send" />
                </button>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-ide-surface-container-lowest border-t border-outline-variant fixed bottom-0 w-full flex justify-between items-center px-md z-50 h-6">
        <div className="flex items-center gap-lg">
          <div className="flex items-center gap-1">
            <Icon name="account_tree" className="!text-[14px] text-tertiary-fixed" />
            <span className="text-[11px] text-on-surface-variant hover:text-ide-primary cursor-pointer transition-opacity">Main Branch</span>
          </div>
          <div className="flex items-center gap-lg">
            <span className="text-[11px] text-on-surface-variant hover:text-ide-primary cursor-pointer">Errors: 0</span>
            <span className="text-[11px] text-on-surface-variant hover:text-ide-primary cursor-pointer">Warnings: 0</span>
          </div>
        </div>
        <div className="flex items-center gap-lg">
          <span className="text-[11px] text-on-surface-variant">Ln 14, Col 1 | UTF-8</span>
          <span className="text-[11px] text-tertiary-fixed font-bold hover:text-ide-primary cursor-pointer">Prettier: Active</span>
          <span className="text-[11px] text-on-surface-variant">JavaScript (ES6)</span>
        </div>
      </footer>

    </div>
  );
}
