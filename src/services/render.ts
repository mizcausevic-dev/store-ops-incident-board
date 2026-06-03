import {
  incidentLane,
  recoveryPosture,
  slaRisksLane,
  summary,
  verification
} from "./storeOpsIncidentBoardService";

const _STYLE = `
  :root{
    --bg:#070a0f; --panel:#0b1220; --panel2:#0a1426;
    --line:rgba(120,255,170,.18); --line2:rgba(120,255,170,.10);
    --text:#e9f3ff; --muted:rgba(233,243,255,.72); --muted2:rgba(233,243,255,.55);
    --bert:#37ff8b; --bert2:#19c7ff;
    --warn:#ffcc66; --bad:#ff5c7a; --good:#37ff8b; --plum:#b88cff;
    --shadow: 0 18px 60px rgba(0,0,0,.55);
    --radius: 18px;
    --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{
    margin:0; font-family:var(--sans); color:var(--text);
    background:
      radial-gradient(1200px 600px at 20% -10%, rgba(55,255,139,.18), transparent 60%),
      radial-gradient(900px 520px at 90% 0%, rgba(25,199,255,.16), transparent 55%),
      radial-gradient(1000px 600px at 50% 110%, rgba(55,255,139,.10), transparent 60%),
      linear-gradient(180deg, #05070c 0%, #070a0f 35%, #05070c 100%);
    overflow-x:hidden;
  }
  .grid-bg{
    position:fixed; inset:0; pointer-events:none; opacity:.12; z-index:-1;
    background-image:
      linear-gradient(to right, rgba(55,255,139,.14) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(55,255,139,.10) 1px, transparent 1px);
    background-size: 46px 46px;
    mask-image: radial-gradient(900px 600px at 40% 10%, #000 60%, transparent 100%);
  }
  .wrap{max-width:1280px; margin:0 auto; padding:24px 22px 80px}
  .topbar{
    display:flex; justify-content:space-between; align-items:flex-start; gap:14px;
    border-bottom:1px solid var(--line2); padding-bottom:14px; margin-bottom:22px;
    font-family:var(--mono); font-size:11px; letter-spacing:.16em; color:var(--muted);
    text-transform:uppercase;
  }
  .topbar .left{color:var(--bert)}
  .topbar .right{text-align:right; color:var(--muted)}
  .topbar .right div{margin-bottom:4px}
  .herorow{display:grid; grid-template-columns: 1.5fr .9fr; gap:18px}
  @media (max-width:1000px){.herorow{grid-template-columns:1fr}}
  .hero{
    background: linear-gradient(180deg, rgba(11,18,32,.95), rgba(8,14,26,.92));
    border:1px solid var(--line); border-radius:22px; padding:28px 28px 24px;
    box-shadow: var(--shadow); position:relative; overflow:hidden;
    border-top:2px solid var(--bert2);
  }
  .hero h1{ font-size:64px; line-height:.95; margin:0 0 18px; letter-spacing:-.5px; font-weight:800; }
  @media (max-width:700px){.hero h1{font-size:42px}}
  .hero p{color:var(--muted); font-size:15px; line-height:1.55; max-width:680px; margin:0 0 18px}
  .chiprow,.tabs{display:flex; flex-wrap:wrap; gap:8px}
  .meta-chip,.tab{
    font-family:var(--mono); font-size:11px; color:var(--muted);
    padding:7px 12px; border-radius:999px; border:1px solid var(--line);
    background:rgba(6,10,18,.4);
  }
  .tabs{margin-top:14px}
  .tab{letter-spacing:.08em; text-transform:uppercase}
  .tab.active{background:linear-gradient(135deg, rgba(55,255,139,.18), rgba(25,199,255,.18)); color:var(--text); border-color:rgba(25,199,255,.32)}
  .side{display:flex; flex-direction:column; gap:14px}
  .bluf{
    border:1px solid var(--warn); border-left:4px solid var(--warn);
    background: linear-gradient(180deg, rgba(255,204,102,.06), rgba(11,18,32,.92));
    border-radius:14px; padding:16px 18px;
  }
  .bluf b, .bluf strong{color:var(--text)}
  .bluf .lbl, .corr .lbl{font-family:var(--mono); font-size:10px; letter-spacing:.18em; text-transform:uppercase}
  .bluf .lbl{color:var(--warn)} .corr .lbl{color:var(--bert)}
  .bluf p, .corr p{color:var(--muted); font-size:13.5px; line-height:1.55; margin:6px 0 0}
  .corr{
    border:1px solid var(--bert); border-left:4px solid var(--bert);
    background: linear-gradient(180deg, rgba(55,255,139,.06), rgba(11,18,32,.92));
    border-radius:14px; padding:16px 18px;
  }
  .toolchips{display:flex; flex-wrap:wrap; gap:8px}
  .toolchip{
    font-family:var(--mono); font-size:11px; padding:6px 12px; border-radius:999px;
    border:1px solid currentColor; background:transparent;
  }
  .tc-claude{color:var(--bert2)} .tc-codex{color:var(--warn)} .tc-gpt{color:var(--bert)} .tc-perplex{color:var(--plum)}
  .section{margin-top:34px}
  .sh{
    display:flex; justify-content:space-between; align-items:baseline; gap:14px;
    padding-bottom:10px; border-bottom:1px solid var(--line2); margin-bottom:14px;
  }
  .sh h2{margin:0; font-size:24px; font-weight:600; letter-spacing:-.2px}
  .sh .note{font-family:var(--mono); font-size:11px; color:var(--muted2); letter-spacing:.16em; text-transform:uppercase}
  .kpis{display:grid; grid-template-columns: repeat(4, 1fr); gap:12px}
  @media (max-width:1100px){.kpis{grid-template-columns: repeat(2, 1fr)}}
  @media (max-width:640px){.kpis{grid-template-columns: 1fr}}
  .kpi{
    border:1px solid var(--line); border-radius:14px; padding:14px 14px 12px;
    background: linear-gradient(180deg, rgba(11,18,32,.85), rgba(8,14,26,.65));
    position:relative; overflow:hidden;
  }
  .kpi:before{
    content:""; position:absolute; inset:-1px; border-radius:14px; pointer-events:none;
    background: radial-gradient(400px 100px at 20% 10%, rgba(55,255,139,.10), transparent 60%);
  }
  .kpi > *{position:relative}
  .kpi .v{font-family:var(--mono); font-size:26px; font-weight:600; letter-spacing:-.5px}
  .kpi.amber .v{color:var(--warn)} .kpi.cyan .v{color:var(--bert2)}
  .kpi.green .v{color:var(--bert)} .kpi.plum .v{color:var(--plum)}
  .kpi.red .v{color:var(--bad)} .kpi.white .v{color:var(--text)}
  .kpi .lbl{font-family:var(--mono); font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); margin-top:6px}
  .kpi .h{font-size:12px; color:var(--muted); line-height:1.45; margin-top:8px}
  .stack{display:grid; grid-template-columns: repeat(4,1fr); gap:12px}
  @media (max-width:1100px){.stack{grid-template-columns: repeat(2,1fr)}}
  @media (max-width:640px){.stack{grid-template-columns: 1fr}}
  .src{
    border:1px solid var(--line); border-radius:16px; padding:16px;
    background: linear-gradient(180deg, rgba(11,18,32,.85), rgba(8,14,26,.65));
  }
  .src .src-name{font-family:var(--mono); font-size:11px; color:var(--bert); letter-spacing:.2em; text-transform:uppercase}
  .src .src-tit{margin:8px 0 6px; font-size:17px; font-weight:600}
  .src p{margin:0; font-size:13px; color:var(--muted); line-height:1.55}
  .ledger{display:grid; grid-template-columns: 1fr 1fr; gap:14px}
  @media (max-width:1000px){.ledger{grid-template-columns:1fr}}
  .led{
    border:1px solid var(--line); border-radius:16px; padding:18px 20px;
    background: linear-gradient(180deg, rgba(11,18,32,.85), rgba(8,14,26,.65));
  }
  .led-head{display:flex; align-items:center; gap:10px; font-family:var(--mono); font-size:12px; letter-spacing:.18em; text-transform:uppercase; color:var(--bert)}
  .led-head.bad{color:var(--bad)}
  .led-head .dot{width:8px; height:8px; border-radius:50%; background:currentColor; box-shadow:0 0 10px currentColor}
  .led ul{list-style:none; padding:0; margin:14px 0 0}
  .led li{display:grid; grid-template-columns: 18px 1fr; gap:10px; padding:10px 0; border-bottom:1px dashed var(--line2); font-size:14px; line-height:1.55}
  .led li:last-child{border-bottom:none}
  .led li .pip{color:var(--bert); font-family:var(--mono); padding-top:2px}
  .led li.bad .pip{color:var(--bad)}
  .led li b{color:var(--text)}
  .led li, .led li *{color:var(--muted)}
  code{
    font-family:var(--mono); font-size:12px; color:var(--bert2);
    background:rgba(25,199,255,.08); padding:1px 6px; border-radius:5px;
    border:1px solid rgba(25,199,255,.18);
  }
  .board{display:grid; grid-template-columns: repeat(2,1fr); gap:14px}
  @media (max-width:1000px){.board{grid-template-columns: 1fr}}
  .pcard{
    border:1px solid var(--line); border-radius:16px; padding:18px 20px;
    background: linear-gradient(180deg, rgba(11,18,32,.85), rgba(8,14,26,.65));
    display:flex; flex-direction:column;
  }
  .pcard .ptop{display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; gap:10px}
  .pcard .pnum{font-family:var(--mono); font-size:22px; font-weight:600; color:var(--bert)}
  .pcard .ppri{font-family:var(--mono); font-size:10px; padding:5px 10px; border-radius:999px; border:1px solid var(--line); color:var(--bert); letter-spacing:.14em; background:rgba(55,255,139,.06)}
  .pcard h3{margin:6px 0 8px; font-size:19px; font-weight:600}
  .pcard .pdesc{font-size:13.5px; color:var(--muted); line-height:1.55; margin:0 0 14px}
  .pcard ul.check{list-style:none; padding:0; margin:0 0 14px}
  .pcard ul.check li{display:grid; grid-template-columns: 18px 1fr; gap:10px; padding:6px 0; font-size:13.5px; color:var(--muted); line-height:1.45}
  .pcard ul.check li:before{
    content:""; width:14px; height:14px; border:1px solid var(--line); border-radius:3px;
    background:rgba(6,10,18,.4); margin-top:3px;
  }
  .pcard .pfoot{margin-top:auto; display:flex; gap:8px; flex-wrap:wrap}
  .ttbl{
    width:100%; border-collapse:separate; border-spacing:0;
    border:1px solid var(--line); border-radius:14px; overflow:hidden;
  }
  .ttbl th, .ttbl td{padding:13px 14px; text-align:left; font-size:13.5px; vertical-align:top}
  .ttbl thead th{
    font-family:var(--mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase;
    color:var(--muted2); border-bottom:1px solid var(--line); background:rgba(11,18,32,.5);
  }
  .ttbl tbody tr:hover{background:rgba(55,255,139,.03)}
  .st{font-family:var(--mono); font-size:10px; padding:4px 9px; border-radius:6px; letter-spacing:.1em; text-transform:uppercase; border:1px solid currentColor; display:inline-block}
  .st.shipped{color:var(--bert)} .st.built{color:var(--bert2)} .st.testers{color:var(--warn)}
  .st.needs{color:var(--bad)} .st.merge{color:var(--warn)}
  .ttbl b{color:var(--text)}
  .ttbl td, .ttbl td *{color:var(--muted)}
  .inv{display:grid; grid-template-columns: repeat(4,1fr); gap:12px}
  @media (max-width:1100px){.inv{grid-template-columns: repeat(2,1fr)}}
  @media (max-width:640px){.inv{grid-template-columns: 1fr}}
  .ivc{
    border:1px solid var(--line); border-radius:14px; padding:14px;
    background: linear-gradient(180deg, rgba(11,18,32,.85), rgba(8,14,26,.65));
  }
  .ivt{display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px}
  .ivc h4{margin:0; font-size:15px; font-weight:600}
  .ivc p{margin:6px 0 0; font-size:12.5px; color:var(--muted); line-height:1.5}
  .pill{
    font-family:var(--mono); font-size:10px; padding:3px 8px; border-radius:6px;
    border:1px solid currentColor; letter-spacing:.1em; text-transform:uppercase;
  }
  .pill.shipped{color:var(--bert)} .pill.built{color:var(--bert2)} .pill.needs{color:var(--bad)} .pill.merge{color:var(--warn)}
  .quote{
    margin-top:24px; border:1px solid rgba(55,255,139,.22);
    background:
      radial-gradient(700px 200px at 0% 0%, rgba(55,255,139,.10), transparent 60%),
      linear-gradient(180deg, rgba(11,18,32,.92), rgba(8,14,26,.88));
    border-radius:18px; padding:24px 26px; position:relative; overflow:hidden;
  }
  .quote .lbl{font-family:var(--mono); font-size:11px; color:var(--bert); letter-spacing:.22em; text-transform:uppercase}
  .quote .q{margin-top:12px; font-size:32px; line-height:1.25; font-weight:600; max-width:1000px}
  .quote .a{margin-top:10px; font-family:var(--mono); font-size:12px; color:var(--muted2)}
  .quote .qm{position:absolute; right:18px; bottom:-30px; font-size:180px; line-height:1; font-family:Georgia, serif; color:rgba(55,255,139,.08); pointer-events:none}
  footer{
    margin-top:30px; padding-top:14px; border-top:1px dashed var(--line2);
    display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;
    font-family:var(--mono); font-size:11px; color:var(--muted2); letter-spacing:.08em;
  }
  footer a{color:var(--bert2); text-decoration:none}
  footer a:hover{text-decoration:underline}
`;

type NavLink = { href: string; label: string };

// ============================================================================
// KineticGain-Style01 v1.1.0 (CLOSED design system)
// Brand mark = 4 polygons, never altered. Single source CSS inlined for CWV.
// To change anything in the design system, bump to Style02 with a decision
// record — do not edit silently. The main{z-index:2} rule prevents the
// body::after onyx wash from overlaying body content (it does in plain <main>).
// ============================================================================

const KG_FAVICON_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Kinetic Gain"><rect width="64" height="64" rx="15" fill="#0D0F12"/><g transform="translate(10 22.79) scale(0.25581)"><rect x="0" y="0" width="14" height="72" fill="#475B6B"/><polygon points="32,0 83,0 77,18 26,18" fill="#F5F2EB"/><polygon points="32,27 127,27 121,45 26,45" fill="#F5F2EB"/><polygon points="32,54 172,54 166,72 26,72" fill="#F5F2EB"/></g></svg>`
  );

const KG_MARK_SVG = `<svg class="kg-mark" viewBox="-8 -8 188 88" aria-hidden="true"><rect class="anchor" x="0" y="0" width="14" height="72"/><polygon class="bar" points="32,0 83,0 77,18 26,18"/><polygon class="bar" points="32,27 127,27 121,45 26,45"/><polygon class="bar" points="32,54 172,54 166,72 26,72"/></svg>`;

const KG_STYLE01_CSS = `:root{--onyx:#0D0F12;--cream:#F5F2EB;--bluegray:#475B6B;--bluegray-bright:#6E879A;--radius:16px;--maxw:1180px;--ease:cubic-bezier(.22,.61,.36,1);--font:"Geist",-apple-system,sans-serif;--mono:"Geist Mono",ui-monospace,monospace;--serif:"Newsreader",Georgia,serif;--a-emerald:#34D399;--a-cyan:#22D3EE;--a-violet:#A78BFA;--a-amber:#FBBF24;--a-pink:#F472B6;--a-blue:#60A5FA;--a-coral:#FB7185;--green:#69E3B3;--danger:#FF7F9B}html[data-theme="dark"]{--ground:#0D0F12;--ink:var(--cream);--ink-dim:#9AA1AD;--ink-faint:#565C68;--surface:rgba(255,255,255,.025);--surface-2:rgba(255,255,255,.045);--line:rgba(255,255,255,.08);--line-soft:rgba(255,255,255,.05);--signal:var(--bluegray-bright);--glow:1}html[data-theme="light"]{--ground:var(--cream);--ink:var(--onyx);--ink-dim:#5A5E63;--ink-faint:#A8A59C;--surface:rgba(13,15,18,.02);--surface-2:rgba(13,15,18,.04);--line:#E2DDD1;--line-soft:#EBE7DC;--signal:var(--bluegray);--glow:0}*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{background:var(--ground);color:var(--ink);font-family:var(--font);line-height:1.5;letter-spacing:-.011em;-webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative;transition:background .5s var(--ease),color .5s var(--ease)}body::after{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;opacity:var(--glow);transition:opacity .5s var(--ease);background:radial-gradient(900px 600px at 12% -5%,rgba(124,92,232,.16),transparent 60%),radial-gradient(800px 600px at 92% 8%,rgba(34,211,238,.10),transparent 55%),radial-gradient(1000px 700px at 70% 100%,rgba(71,91,107,.18),transparent 60%),linear-gradient(180deg,#0D0F12 0%,#0E1014 55%,#0C0E11 100%)}::selection{background:var(--a-violet);color:#0A0B11}a{color:inherit}.wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px}.eyebrow{font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-faint)}.kg-logo{display:flex;align-items:center;gap:11px;text-decoration:none;color:var(--ink)}.kg-mark{height:22px;width:auto;display:block;flex:none}.kg-mark .anchor{fill:var(--signal)}.kg-mark .bar{fill:var(--ink)}.kg-word{font-weight:600;font-size:18px;letter-spacing:-.035em;color:var(--ink);white-space:nowrap}header{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--ground) 72%,transparent);backdrop-filter:blur(16px) saturate(150%);border-bottom:1px solid var(--line-soft)}.nav{display:flex;align-items:center;justify-content:space-between;height:68px;position:relative;z-index:2}.nav-links{display:flex;align-items:center;gap:22px;flex-wrap:wrap}.nav-links a{font-family:var(--mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-dim);text-decoration:none;transition:color .25s var(--ease)}.nav-links a:hover,.nav-links a.active{color:var(--ink)}.nav-links a.active{border-bottom:1px solid var(--a-cyan);padding-bottom:2px}.nav-right{display:flex;align-items:center;gap:14px}.theme-btn,.menu-btn{width:34px;height:34px;border:1px solid var(--line);border-radius:9px;background:transparent;color:var(--ink-dim);cursor:pointer;display:grid;place-items:center;transition:all .25s var(--ease)}.menu-btn{display:none;color:var(--ink)}.theme-btn:hover,.menu-btn:hover{color:var(--ink);border-color:var(--a-violet)}.theme-btn svg,.menu-btn svg{width:15px;height:15px}.hero{padding:80px 0 50px;position:relative;z-index:2}.hero .eyebrow{margin-bottom:22px;display:inline-flex;align-items:center;gap:10px}.hero .eyebrow .dot{width:7px;height:7px;border-radius:50%;background:linear-gradient(120deg,var(--a-violet),var(--a-cyan));box-shadow:0 0 12px rgba(124,92,232,.7)}.hero h1,.hero h2{font-size:clamp(36px,5.6vw,68px);font-weight:600;line-height:1.04;letter-spacing:-.035em;max-width:18ch;color:var(--ink)}.hero h1 .grad,.hero h2 .grad{background:linear-gradient(110deg,var(--a-violet),var(--a-cyan) 55%,var(--a-emerald));-webkit-background-clip:text;background-clip:text;color:transparent}.hero p,.section p{margin-top:22px;max-width:60ch;font-size:clamp(15px,1.4vw,17px);color:var(--ink-dim);line-height:1.6}.hero p strong{color:var(--ink);font-weight:500}.sec{padding:70px 0;border-top:1px solid var(--line-soft);position:relative;z-index:2}.sec-head{display:flex;gap:18px;align-items:baseline;margin-bottom:38px;flex-wrap:wrap}.sec-num{font-family:var(--mono);font-size:12px;letter-spacing:.1em;background:linear-gradient(120deg,var(--a-violet),var(--a-cyan));-webkit-background-clip:text;background-clip:text;color:transparent}.sec-title{font-size:clamp(24px,3vw,38px);font-weight:600;letter-spacing:-.03em;line-height:1.08}.sec-lead{color:var(--ink-dim);max-width:54ch;font-size:16px;line-height:1.6;margin-top:6px}.acard,.card{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;transition:transform .3s var(--ease),border-color .3s var(--ease),background .3s var(--ease);padding:24px}.acard::before,.card::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--accent,linear-gradient(90deg,var(--a-violet),var(--a-cyan)));opacity:.9}.acard::after{content:"";position:absolute;inset:0;background:var(--accent,linear-gradient(90deg,var(--a-violet),var(--a-cyan)));opacity:0;filter:blur(40px);transition:opacity .4s var(--ease);z-index:-1}.acard:hover,.card:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--ink) 22%,transparent);background:var(--surface-2)}.acard:hover::after{opacity:.08}footer{border-top:1px solid var(--line-soft);padding:44px 0 32px;position:relative;z-index:2;margin-top:48px}.foot-top{display:flex;justify-content:space-between;align-items:flex-start;gap:32px;flex-wrap:wrap;margin-bottom:32px}.foot-tag{max-width:38ch;color:var(--ink-dim);font-size:14.5px;line-height:1.6;margin-top:14px}.foot-cols{display:flex;gap:48px;flex-wrap:wrap}.foot-col h4{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:14px}.foot-col a{display:block;color:var(--ink-dim);text-decoration:none;font-size:13.5px;margin-bottom:8px;transition:color .2s var(--ease)}.foot-col a:hover{color:var(--ink)}.foot-bot{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;padding-top:22px;border-top:1px solid var(--line-soft);font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-faint)}.reveal{opacity:0;transform:translateY(20px);transition:opacity .8s var(--ease),transform .8s var(--ease)}.reveal.in{opacity:1;transform:none}@media(max-width:880px){.menu-btn{display:grid}.nav-links{position:absolute;top:68px;left:0;right:0;flex-direction:column;align-items:flex-start;background:var(--ground);border-bottom:1px solid var(--line);padding:20px 28px;gap:18px;display:none}.nav-links.open{display:flex}}@media(max-width:560px){.hero{padding:50px 0 30px}}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}`;

const KG_COMPAT_CSS = `main{position:relative;z-index:2}.shell{max-width:var(--maxw);margin:0 auto;padding:0 28px 60px}.herorow{display:grid;grid-template-columns:1fr;gap:18px}.hero{padding-top:20px;padding-bottom:10px}.hero h1,.hero h2{max-width:12ch}.side{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch}.side .toolchips{align-content:start}.bluf,.corr{height:100%}.hero .card h2{font-size:clamp(26px,3.2vw,40px)!important;font-weight:600;line-height:1.1;letter-spacing:-.025em;color:var(--ink);font-family:var(--font)!important;margin:8px 0 10px}.hero .card h3{font-family:var(--font)!important;font-size:18px!important;font-weight:600;line-height:1.35;color:var(--ink);margin:0 0 14px}.hero .card p{margin:0 0 14px;font-size:15px;color:var(--ink-dim);line-height:1.6}.right-panel h3{color:var(--ink)}.card.section h2,.card.section h3,.table-wrap.section h3{font-family:var(--font)!important;font-weight:600;color:var(--ink)}.card.section h2{font-size:clamp(24px,2.8vw,34px)!important;line-height:1.1;letter-spacing:-.02em;margin:6px 0 10px}.card.section h3,.table-wrap.section h3{font-size:17px;margin:0 0 14px}.section-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:18px;margin:24px 0}.card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin:24px 0}.table-wrap{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:18px 20px 20px;position:relative;overflow:hidden}.table-wrap::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--a-cyan),var(--a-violet));opacity:.9}.card.section,.table-wrap.section{margin-top:18px}.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:18px}.stat{padding:20px 22px;background:var(--surface-2);border:1px solid var(--line);border-radius:14px;transition:border-color .25s var(--ease),transform .25s var(--ease)}.stat:hover{border-color:color-mix(in srgb,var(--a-cyan) 35%,transparent);transform:translateY(-2px)}.stat label{display:block;font-family:var(--mono);font-size:10.5px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint);margin-bottom:10px}.stat strong{display:block;font-size:clamp(28px,3.4vw,40px);font-weight:600;letter-spacing:-.035em;line-height:1;background:linear-gradient(120deg,var(--a-cyan),var(--a-violet));-webkit-background-clip:text;background-clip:text;color:transparent;font-family:var(--font)}.stat span{display:block;margin-top:9px;font-size:12.5px;color:var(--ink-dim);line-height:1.5}.eyebrow{display:block;margin-bottom:8px}.list{display:grid;gap:0}.list .item{padding:14px 0;border-top:1px solid var(--line-soft);transition:padding-left .2s var(--ease)}.list .item:first-child{border-top:0;padding-top:4px}.list .item:hover{padding-left:6px}.item strong{display:block;font-size:14.5px;font-weight:600;color:var(--ink);margin-bottom:4px;font-family:var(--font)}.item p,.item span{color:var(--ink-dim);font-size:13px;line-height:1.55;margin:0;font-family:var(--font)}.item p{margin-bottom:3px}table{width:100%;border-collapse:collapse;font:13.5px/1.55 var(--font)}th,td{text-align:left;padding:11px 10px;border-bottom:1px solid var(--line-soft);vertical-align:top;color:var(--ink)}th{font-family:var(--mono);font-size:10.5px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-faint);background:rgba(255,255,255,.02)}html[data-theme="light"] th{background:rgba(13,15,18,.025)}tbody tr{transition:background .15s var(--ease)}tbody tr:hover{background:var(--surface-2)}tbody tr:last-child td{border-bottom:0}td strong{color:var(--ink);font-weight:600}.tag{display:inline-block;padding:3px 10px;border-radius:999px;font-family:var(--mono);font-size:10.5px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;background:color-mix(in srgb,var(--a-cyan) 12%,transparent);color:var(--a-cyan);border:1px solid color-mix(in srgb,var(--a-cyan) 32%,transparent)}.tag.watch,.tag.yellow{background:color-mix(in srgb,var(--a-amber) 12%,transparent);color:var(--a-amber);border-color:color-mix(in srgb,var(--a-amber) 32%,transparent)}.tag.critical,.tag.red{background:color-mix(in srgb,var(--a-coral) 12%,transparent);color:var(--a-coral);border-color:color-mix(in srgb,var(--a-coral) 32%,transparent)}.tag.healthy,.tag.green{background:color-mix(in srgb,var(--a-emerald) 14%,transparent);color:var(--a-emerald);border-color:color-mix(in srgb,var(--a-emerald) 35%,transparent)}.badge{width:42px;height:42px;border-radius:11px;background:linear-gradient(135deg,var(--a-violet),var(--a-cyan));color:#0A0B11;display:grid;place-items:center;font-family:var(--mono);font-size:13px;font-weight:600;letter-spacing:.04em;box-shadow:0 4px 18px rgba(124,92,232,.28);flex:none}.brand{display:flex;align-items:flex-start;gap:14px}.brand h1{font-size:clamp(20px,2.4vw,28px);font-weight:600;letter-spacing:-.015em;line-height:1.15;color:var(--ink);margin:2px 0 6px;font-family:var(--font)}.brand p{font-size:14px;color:var(--ink-dim);line-height:1.55;margin:0;font-family:var(--font);max-width:62ch}.footer-note{color:var(--ink-faint);font-size:13px;line-height:1.6;margin-top:14px;font-family:var(--font)}.card code,.item code,.footer-note code,.shell code{font-family:var(--mono);font-size:12px;background:color-mix(in srgb,var(--a-cyan) 8%,transparent);border:1px solid color-mix(in srgb,var(--a-cyan) 22%,transparent);color:var(--a-cyan);padding:1px 7px;border-radius:6px}.demo-pill{display:inline-flex;align-items:center;gap:7px;padding:5px 11px;border-radius:999px;border:1px solid var(--line);color:var(--ink-faint);font-family:var(--mono);font-size:10.5px;font-weight:500;letter-spacing:.10em;text-transform:uppercase}.demo-pill::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--a-emerald);box-shadow:0 0 8px var(--a-emerald)}@media(max-width:1100px){.side{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:980px){.side,.section-grid,.card-grid{grid-template-columns:1fr}.stat-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.stat-grid{grid-template-columns:1fr}.shell{padding:0 16px 40px}.hero{padding-top:12px}}`;

const KG_THEME_JS = `(function(){var key='kg-theme';var saved=null;try{saved=localStorage.getItem(key)}catch(e){}var t=saved||'dark';document.documentElement.setAttribute('data-theme',t);document.addEventListener('DOMContentLoaded',function(){var btn=document.getElementById('themeBtn');if(btn){btn.addEventListener('click',function(){var cur=document.documentElement.getAttribute('data-theme');var n=cur==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);try{localStorage.setItem(key,n)}catch(e){}})}var m=document.getElementById('menuBtn');if(m){m.addEventListener('click',function(){var nl=document.querySelector('.nav-links');if(nl){nl.classList.toggle('open')}})}if('IntersectionObserver'in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)})}})})();`;

function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>${title}</title>
  <meta name="description" content="TypeScript control plane for store incidents, SLA blockers, recovery posture, and buyer-safe restaurant operations. Operator surface in the Kinetic Gain Suite." />
  <meta name="theme-color" content="#0D0F12" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests" />
  <link rel="canonical" href="https://stores.kineticgain.com/" />
  <link rel="icon" type="image/svg+xml" href="${KG_FAVICON_DATA_URI}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Kinetic Gain" />
  <meta property="og:title" content="${title}" />
  <meta property="og:url" content="https://stores.kineticgain.com/" />
  <meta property="og:description" content="TypeScript control plane for store incidents, SLA blockers, recovery posture, and buyer-safe restaurant operations. Operator surface in the Kinetic Gain Suite." />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="TypeScript control plane for store incidents, SLA blockers, recovery posture, and buyer-safe restaurant operations. Operator surface in the Kinetic Gain Suite." />
  <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"ProfessionalService","@id":"https://stores.kineticgain.com/#service","name":"Kinetic Gain — TypeScript control plane for store incidents, SLA blockers, recovery posture, and buyer-safe restaurant operations","url":"https://stores.kineticgain.com/","areaServed":"United States","description":"TypeScript control plane for store incidents, SLA blockers, recovery posture, and buyer-safe restaurant operations. Operator surface in the Kinetic Gain Suite."},{"@type":"WebSite","@id":"https://stores.kineticgain.com/#website","url":"https://stores.kineticgain.com/","name":"TypeScript control plane for store incidents, SLA blockers, recovery posture, and buyer-safe restaurant operations","publisher":{"@type":"Organization","name":"Kinetic Gain LLC"}}]}</script>
  <style>${KG_STYLE01_CSS}${KG_COMPAT_CSS}</style>
</head>
<body>
  <header>
    <div class="wrap nav">
      <a class="kg-logo" href="/" aria-label="Kinetic Gain — TypeScript control plane for store incidents, SLA blockers, recovery posture, and buyer-safe restaurant operations">
        ${KG_MARK_SVG}
        <span class="kg-word">Kinetic Gain</span>
      </a>
      <nav class="nav-links" id="primaryNav">
        <a href="/incident-lane">Incident Lane</a>
        <a href="/sla-risks">SLA Risks</a>
        <a href="/recovery-posture">Recovery Posture</a>
        <a href="/verification">Verification</a>
        <a href="/docs">Docs</a>
      </nav>
      <div class="nav-right">
        <span class="demo-pill" title="Static deterministic demo">Demo</span>
        <button class="theme-btn" id="themeBtn" aria-label="Toggle theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
        </button>
        <button class="menu-btn" id="menuBtn" aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>
  </header>
  <main class="wrap shell">
    ${body}
  </main>
  <footer>
    <div class="wrap">
      <div class="foot-top">
        <div>
          <a class="kg-logo" href="/" aria-label="Kinetic Gain">${KG_MARK_SVG}<span class="kg-word">Kinetic Gain</span></a>
          <p class="foot-tag">TypeScript control plane for store incidents, SLA blockers, recovery posture, and buyer-safe restaurant operations — operator surface in the Kinetic Gain Suite. Static demo data; no live calls.</p>
        </div>
        <div class="foot-cols">
          <div class="foot-col">
            <h4>Estate</h4>
            <a href="https://kineticgain.com/">kineticgain.com</a>
            <a href="https://suite.kineticgain.com/">Kinetic Gain Suite</a>
            <a href="https://kineticgain.com/embedded">Kinetic Gain Embedded</a>
          </div>
          <div class="foot-col">
            <h4>This surface</h4>
            <a href="https://github.com/mizcausevic-dev/store-ops-incident-board">GitHub repo</a>
          </div>
        </div>
      </div>
      <div class="foot-bot">
        <span>© Kinetic Gain LLC — Boston, MA</span>
        <span>Style01 · v1.1.0</span>
      </div>
    </div>
  </footer>
  <script>${KG_THEME_JS}</script>
</body>
</html>`;
}

function topbar(active: string) {
  // Style01 nav lives in layout()'s <header>. This helper exists only so per-page
  // renderers can flag the active route without re-emitting the chrome. Returns "" for index;
  // for other routes, emits a tiny inline script that marks the matching nav link active.
  const links = [
    {
      "href": "/",
      "label": "Overview"
    },
    {
      "href": "/incident-lane",
      "label": "Incident Lane"
    },
    {
      "href": "/sla-risks",
      "label": "SLA Risks"
    },
    {
      "href": "/recovery-posture",
      "label": "Recovery Posture"
    },
    {
      "href": "/verification",
      "label": "Verification"
    },
    {
      "href": "/docs",
      "label": "Docs"
    }
  ];
  const match = links.find((l) => l.href === active);
  if (!match) return "";
  const file = active === "/" ? "index.html" : active.replace(/^\//, "") + ".html";
  return `<script>document.addEventListener('DOMContentLoaded',function(){var as=document.querySelectorAll('.nav-links a');for(var i=0;i<as.length;i++){var h=as[i].getAttribute('href');if(h==='${match.href}'||h==='${file}'){as[i].classList.add('active')}}});</script>`;
}



function renderTabs(_active: string, _links: NavLink[]) {
  return ""; // Style01 nav lives in layout()'s <header>; suppress the duplicate tab strip.
}

function renderHero(active: string) {
  const links: NavLink[] = [
    { href: "/", label: "Overview" },
    { href: "/incident-lane", label: "Incident Lane" },
    { href: "/sla-risks", label: "SLA Risks" },
    { href: "/recovery-posture", label: "Recovery Posture" },
    { href: "/verification", label: "Verification" },
    { href: "/docs", label: "Docs" }
  ];

  return `${topbar(active)}
  <div class="herorow">
    <section class="hero">
      <div class="chiprow">
        <span class="meta-chip">Store incidents</span>
        <span class="meta-chip">Dispatch recovery</span>
        <span class="meta-chip">Guest promise safety</span>
        <span class="meta-chip">Operator escalation</span>
      </div>
      <h1>Store incidents and recovery control plane.</h1>
      <p>Incident queues, SLA blockers, and recovery posture in one operator surface for restaurant and food-commerce teams that need cleaner store, labor, and dispatch handoffs before the next guest promise window burns.</p>
      ${renderTabs(active, links)}
    </section>
    <aside class="side">
      <div class="bluf">
        <div class="lbl">Current watch item</div>
        <p><strong>Recovery proof, ETA parity, and staffing-to-demand drift</strong> are the fastest ways to turn a contained store incident into broken guest trust.</p>
      </div>
      <div class="corr">
        <div class="lbl">Operator correction</div>
        <p>Map every store incident to evidence, owner, and reopen-safe posture before store ops, dispatch, and marketplace teams start working from different recovery snapshots.</p>
      </div>
      <div class="toolchips">
        <span class="toolchip tc-codex">codex</span>
        <span class="toolchip tc-claude">claude</span>
        <span class="toolchip tc-gpt">webops</span>
        <span class="toolchip tc-perplex">revops</span>
      </div>
    </aside>
  </div>`;
}

function statusClass(value: "red" | "yellow" | "green") {
  if (value === "red") return "needs";
  if (value === "yellow") return "merge";
  return "shipped";
}

function heroShell(active: string, content: string) {
  return `${renderHero(active)}${content}`;
}

export function renderOverview() {
  const metrics = summary();
  const packets = recoveryPosture();
  return layout(
    "Store Ops Incident Board",
    heroShell(
      "/",
      `<section class="section">
        <div class="sh"><h2>Control snapshot</h2><div class="note">Restaurant-safe incident ops</div></div>
        <div class="kpis">
          <div class="kpi cyan"><div class="v">${metrics.incidents}</div><div class="lbl">Store incidents</div><div class="h">Active store incidents tied to owner, recovery lane, and next action.</div></div>
          <div class="kpi red"><div class="v">${metrics.urgentIncidents}</div><div class="lbl">Urgent incidents</div><div class="h">Red incidents where guest promise and dispatch posture are already under pressure.</div></div>
          <div class="kpi amber"><div class="v">${metrics.blockedRecoveries}</div><div class="lbl">Blocked recoveries</div><div class="h">Evidence and reopen blockers still waiting on proof.</div></div>
          <div class="kpi plum"><div class="v">${metrics.fragilePackets}</div><div class="lbl">Fragile packets</div><div class="h">Recovery packets that still need stronger reopen posture before release.</div></div>
        </div>
        <div class="quote">
          <div class="lbl">Primary recommendation</div>
          <div class="q">${metrics.recommendation}</div>
          <div class="a">Store trust comes from aligned recovery events, proof bundles, and reopen-safe packet posture.</div>
          <div class="qm">”</div>
        </div>
      </section>
      <section class="section">
        <div class="sh"><h2>Recovery packets</h2><div class="note">What can safely move next</div></div>
        <div class="inv">
          ${packets
            .map(
              (packet) => `<article class="ivc">
                <div class="ivt"><h4>${packet.packetId}</h4><span class="pill ${statusClass(packet.status)}">${packet.status}</span></div>
                <p><b>${packet.audience}</b></p>
                <p>${packet.confidenceScore}% confidence · ${packet.reviewWindowHours} hours to next review window.</p>
                <p>${packet.decisionNote}</p>
              </article>`
            )
            .join("")}
        </div>
      </section>`
    )
  );
}

export function renderIncidentLane() {
  const rows = incidentLane();
  return layout(
    "Store Ops Incident Board — Incident Lane",
    heroShell(
      "/incident-lane",
      `<section class="section">
        <div class="sh"><h2>Incident lane</h2><div class="note">Cases under pressure</div></div>
        <table class="ttbl">
          <thead><tr><th>Store incident</th><th>Owner</th><th>Severity</th><th>Next move</th></tr></thead>
          <tbody>
            ${rows
              .map(
                (item) => `<tr>
                  <td><b>${item.brand} · ${item.incidentType}</b><br />${item.incidentId} · ${item.region} · ${item.store}<br />${item.excerpt}</td>
                  <td>${item.owner}</td>
                  <td><span class="st ${statusClass(item.severity)}">${item.severity}</span></td>
                  <td>${item.nextAction}</td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </section>`
    )
  );
}

export function renderSlaRisks() {
  const risks = slaRisksLane();
  return layout(
    "Store Ops Incident Board — SLA Risks",
    heroShell(
      "/sla-risks",
      `<section class="section">
        <div class="sh"><h2>SLA risks</h2><div class="note">Evidence gaps before guest and franchise promises</div></div>
        <div class="ledger">
          <div class="led">
            <div class="led-head"><span class="dot"></span>Proof packets required</div>
            <ul>
              ${risks
                .map(
                  (item) => `<li class="${item.readiness === "red" ? "bad" : ""}"><span class="pip">→</span><div><b>${item.riskId} · ${item.blocker}</b><br />${item.requiredEvidence}</div></li>`
                )
                .join("")}
            </ul>
          </div>
          <div class="led">
            <div class="led-head bad"><span class="dot"></span>Impact areas at risk</div>
            <ul>
              ${risks
                .map(
                  (item) => `<li class="${item.readiness === "red" ? "bad" : ""}"><span class="pip">→</span><div><b>${item.riskId} · ${item.owner}</b> · ${item.impactArea}<br />${item.note}</div></li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
      </section>`
    )
  );
}

export function renderRecoveryPosture() {
  const packets = recoveryPosture();
  return layout(
    "Store Ops Incident Board — Recovery Posture",
    heroShell(
      "/recovery-posture",
      `<section class="section">
        <div class="sh"><h2>Recovery posture</h2><div class="note">Packet confidence and reopen timing</div></div>
        <div class="board">
          ${packets
            .map(
              (packet) => `<article class="pcard">
                <div class="ptop">
                  <div class="pnum">${packet.confidenceScore}%</div>
                  <div class="ppri">${packet.packetId}</div>
                </div>
                <h3>${packet.audience}</h3>
                <p class="pdesc">${packet.decisionNote}</p>
                <ul class="check">
                  <li>Status: ${packet.status}</li>
                  <li>Blocker: ${packet.blocker}</li>
                  <li>Review window: ${packet.reviewWindowHours} hours</li>
                </ul>
                <div class="pfoot"><span class="pill ${statusClass(packet.status)}">${packet.status}</span></div>
              </article>`
            )
            .join("")}
        </div>
      </section>`
    )
  );
}

export function renderVerification() {
  const points = verification();
  return layout(
    "Store Ops Incident Board — Verification",
    heroShell(
      "/verification",
      `<section class="section">
        <div class="sh"><h2>Verification</h2><div class="note">What this surface proves</div></div>
        <div class="ledger">
          <div class="led">
            <div class="led-head"><span class="dot"></span>Operator-grade evidence</div>
            <ul>${points.map((item) => `<li><span class="pip">→</span><div>${item}</div></li>`).join("")}</ul>
          </div>
          <div class="led">
            <div class="led-head"><span class="dot"></span>KG Embedded fit</div>
            <ul>
              <li><span class="pip">→</span><div>Store incidents, reopen blockers, and guest-promise posture can surface in-product without exposing unsafe write paths.</div></li>
              <li><span class="pip">→</span><div>Recovery-safe launch posture stays connected to dashboards, operator reviews, and revenue-safe remediation workflows.</div></li>
              <li><span class="pip">→</span><div>Synthetic data only; this repo demonstrates system shape, not production store, employee, or franchise records.</div></li>
            </ul>
          </div>
        </div>
      </section>`
    )
  );
}

export function renderDocs() {
  return layout(
    "Store Ops Incident Board — Docs",
    heroShell(
      "/docs",
      `<section class="section">
        <div class="sh"><h2>System docs</h2><div class="note">Routes and control surfaces</div></div>
        <div class="stack">
          <article class="src"><div class="src-name">Control plane</div><div class="src-tit">Incident lane</div><p>Case-by-case store incident queue with store, incident type, owner routing, and next reopen-safe move.</p></article>
          <article class="src"><div class="src-name">Risk map</div><div class="src-tit">SLA risks</div><p>Required evidence, owner lanes, and impact areas for blocked guest-promise, staffing, and dispatch posture.</p></article>
          <article class="src"><div class="src-name">Field view</div><div class="src-tit">Recovery posture</div><p>Packet-level confidence, blocker state, and next review-window timing.</p></article>
          <article class="src"><div class="src-name">Embedded tie-back</div><div class="src-tit">KG Embedded</div><p>Security-first in-product analytics extension for store incidents, reopen cadence, and multi-location restaurant workflows.</p></article>
        </div>
        <div class="quote">
          <div class="lbl">Route surface</div>
          <div class="q"><code>/</code> · <code>/incident-lane</code> · <code>/sla-risks</code> · <code>/recovery-posture</code> · <code>/verification</code> · <code>/docs</code></div>
          <div class="a">The shell is standardized for future operator surfaces.</div>
          <div class="qm">”</div>
        </div>
      </section>`
    )
  );
}
