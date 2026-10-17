#!/usr/bin/env python3
"""Erzeugt src/1b-dunkel.css aus src/1-stile.css: Dunkel-Modus über Zuordnung der festen Farben.
Aufruf: python3 tools/dunkel.py   (danach python3 build.py)
Hell bleibt unverändert; Dunkel gilt bei :root[data-theme=dark] und bei data-theme=auto + Systemeinstellung dunkel."""
import re, os
H = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
css = open(os.path.join(H, 'src', '1-stile.css'), encoding='utf-8').read()
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
BG = {'#fff':'#171e29','#ffffff':'#171e29','#f7f9fc':'#131a24','#f3f5f9':'#151c26','#fafbfc':'#141b25','#eef0f4':'#262f3d','#f5f6f8':'#0f141b','#fff4d6':'#3a2e10','#fdecec':'#3d1c1c','#e7f6ee':'#123323','#e7f6ec':'#123323','#e8f0fd':'#1c2b47','#eef4ff':'#1c2b47','#fff7e8':'#33280f','#fff6e5':'#33280f','#fde8e7':'#3d1c1c','#f1ecfb':'#28213d','#e3eaf4':'#1d2939','#e3f4fb':'#11303c','#fef0e6':'#3a2615','#fffdf7':'#262414','#fffdf5':'#262414','#f5f8ff':'#1a2436','#e0ecff':'#1c2b47','#dcfae6':'#12331f','#fef0c7':'#3a2e10','#fee4e2':'#3d1c1c','#f6d9a8':'#5a4318','#e5e7eb':'#2b3442','#f0f2f5':'#1d2430','#f9fafb':'#141b25','#f2f4f7':'#1d2430','#ecfdf3':'#12331f','#e6f6fb':'#11303a','#f3f4f7':'#1d2430','#eef2f7':'#1d2430','#f4f6fa':'#151c26','#fefce8':'#2c2a12','#fff1f0':'#3d1c1c','#f0f9ff':'#11303c','#eef3fa':'#1d2939','#f8fafc':'#141b25','#fffbeb':'#2c2612'}
TX = {'#1b2333':'#e4e8ef','#667085':'#9aa4b4','#475467':'#b3bcc9','#344054':'#c8cfda','#98a2b3':'#7f8a9c','#b42318':'#f97066','#067647':'#47cd89','#05603a':'#47cd89','#b54708':'#f79009','#8a5a00':'#fdb022','#1d4ed8':'#84adff','#079455':'#47cd89','#4a3a7a':'#c3b5fd','#1f3a5f':'#9ab7de','#101828':'#e4e8ef','#0f172a':'#e4e8ef','#6941c6':'#b692f6','#1f2937':'#e4e8ef','#111827':'#e4e8ef','#374151':'#c8cfda'}
BD = {'#fff':'#2b3442','#ffffff':'#2b3442','#e3e6ec':'#2b3442','#d0d5dd':'#3a4456','#c4c9d4':'#465063','#c9d3e3':'#3a4658','#b8c1cf':'#4a5568','#d9cdf5':'#4a3d6b','#eef0f4':'#2b3442','#e5e7eb':'#2b3442','#98a2b3':'#5b6578','#f6d9a8':'#5a4318','#e7e9ee':'#2b3442','#dfe3ea':'#2b3442'}
VARTX = {'var(--navy)':'#9ab7de','var(--bodo)':'#9ab7de','var(--ink)':None}
def norm(h):
    h=h.lower()
    return h
KEEP=False
def mapval(prop, val):
    p = prop.strip().lower()
    if p in ('background','background-color','background-image'): M = BG
    elif p in ('color','fill','-webkit-text-fill-color','caret-color'): M = TX
    elif p.startswith('border') or p.startswith('outline'): M = BD
    else: return None
    ch = False
    def rep(m):
        nonlocal ch
        h = norm(m.group(0))
        if h in M: ch = True; return M[h]
        return m.group(0)
    v = re.sub(r'#[0-9a-fA-F]{3,8}\b', rep, val)
    if p == 'color':
        for k, d in VARTX.items():
            if d and k in v: v = v.replace(k, d); ch = True
    return v if ch else (v if KEEP else None)
out = []
for m in re.finditer(r'([^{}@;]+)\{([^{}]*)\}', css):
    sel, body = m.group(1).strip(), m.group(2)
    if not sel or sel.startswith(':root') or sel.startswith('from') or sel.startswith('to') or re.match(r'^\d+%', sel): continue
    decls = []
    for d in body.split(';'):
        if ':' not in d: continue
        p, v = d.split(':', 1)
        KEEP = True
        nv = mapval(p, v)
        KEEP = False
        if nv is not None: decls.append(p.strip() + ':' + nv.strip())
    if decls: out.append((sel, ';'.join(decls)))
def block(pfx):
    L = []
    for sel, d in out:
        ss = []
        for s in sel.split(','):
            s = s.strip()
            if s in ('html',): ss.append(pfx)
            elif s.startswith('body'): ss.append(pfx + ' ' + s)
            else: ss.append(pfx + ' ' + s)
        L.append(','.join(ss) + '{' + d + '}')
    return '\n'.join(L)
TOK = '{color-scheme:dark;--bg:#0f141b;--panel:#171e29;--ink:#e4e8ef;--mut:#9aa4b4;--line:#2b3442;--acc:#5b8def;--accbg:#1c2b47;--warn:#f79009;--warnbg:#3a2615;--ok:#47cd89;--okbg:#12301f;--vio:#9b8afb;--viobg:#28213d;--teal:#36bffa;--tealbg:#11303a;--bodobg:#1d2939;--sellbg:#11303c}'
EXTRA = lambda P: f'''{P} nav button.on{{background:#2f6fdf;color:#fff}}{P} body{{background:var(--bg);color:var(--ink)}}{P} input,{P} select,{P} textarea{{background:#131a24;color:var(--ink);border-color:#3a4456}}{P} .modal{{background:#000000a6}}{P} img.olg,{P} .av img{{filter:none}}'''
D = ':root[data-theme=dark]'; A = ':root[data-theme=auto]'
txt = '/* erzeugt von tools/dunkel.py – nicht von Hand ändern */\n' + D + TOK + '\n' + block(D) + '\n' + EXTRA(D) + '\n@media (prefers-color-scheme:dark){' + A + TOK + '\n' + block(A) + '\n' + EXTRA(A) + '}\n'
open(os.path.join(H, 'src', '1b-dunkel.css'), 'w', encoding='utf-8').write(txt)
print('1b-dunkel.css:', len(out), 'Regeln,', len(txt), 'Zeichen')
