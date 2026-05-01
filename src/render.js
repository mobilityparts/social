import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ORANGE = '#F5A000';
const NAVY = '#0D0E2A';
const WHITE = '#FFFFFF';
const ADDRESS = 'Parvis Notre Dame 14, 1020 Laeken';
const EMAIL = 'shop@mobilityparts.eu';

const WA_ICON = `<svg viewBox="0 0 24 24" width="22" height="22" fill="#25D366" style="flex-shrink:0;vertical-align:middle"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

let _logoWhite = null;
let _logoNavy = null;

function logoSrc(variant = 'white') {
  if (variant === 'white') {
    if (!_logoWhite) {
      const f = path.resolve(__dirname, '../brand/logoFondblancOrange.png');
      _logoWhite = `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`;
    }
    return _logoWhite;
  }
  if (!_logoNavy) {
    const f = path.resolve(__dirname, '../brand/logoFondbleuOrange.png');
    _logoNavy = `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`;
  }
  return _logoNavy;
}

function logo(variant = 'white', w = 210, extra = '') {
  return `<img src="${logoSrc(variant)}" style="width:${w}px;display:block;${extra}" />`;
}

function footer(onDark = true) {
  return `<div style="position:absolute;bottom:0;left:0;right:0;height:68px;background:${onDark ? NAVY : 'rgba(13,14,42,0.95)'};display:flex;align-items:center;justify-content:space-between;padding:0 36px;z-index:30;gap:12px">
    <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="${ORANGE}" style="flex-shrink:0"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      <span style="color:${ORANGE};font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${ADDRESS}</span>
    </div>
    <div style="width:1px;height:30px;background:${ORANGE};opacity:0.35;flex-shrink:0"></div>
    <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
      ${WA_ICON}
      <span style="color:${WHITE};font-family:'Barlow',sans-serif;font-size:18px;font-weight:600">${EMAIL}</span>
    </div>
  </div>`;
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">`;

function wrap(body) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${FONTS}<style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:1080px;height:1080px;overflow:hidden;position:relative;font-family:'Barlow Condensed','Arial Black',Impact,sans-serif}
  </style></head><body>${body}</body></html>`;
}

// ─── 20 TEMPLATES ──────────────────────────────────────────────────────────

const TEMPLATES = [

  // 1. GRADIENT RISE — photo full bleed, navy gradient bottom, headline bottom-left
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:url('${img}') center/cover no-repeat;position:relative">
      <div style="position:absolute;inset:0;background:linear-gradient(to top,${NAVY}f0 0%,${NAVY}88 32%,transparent 58%)"></div>
      <div style="position:absolute;top:32px;left:36px">${logo('white', 210)}</div>
      <div style="position:absolute;bottom:72px;left:36px;right:36px">
        <div style="color:${ORANGE};font-size:14px;font-weight:700;letter-spacing:5px;text-transform:uppercase;font-family:'Barlow',sans-serif;margin-bottom:10px">MOBILITY PARTS</div>
        <div style="color:${WHITE};font-size:76px;font-weight:900;line-height:1;text-transform:uppercase;margin-bottom:8px">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.7);font-size:26px;font-weight:600;font-family:'Barlow',sans-serif">${sub}</div>` : ''}
      </div>
      ${footer()}
    </div>`),

  // 2. SPLIT FORGE — dark left 42%, photo right 58%, orange vertical separator
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;display:flex;position:relative">
      <div style="width:42%;background:${NAVY};display:flex;flex-direction:column;padding:40px 34px 72px;justify-content:space-between;z-index:2">
        ${logo('navy', 210)}
        <div>
          <div style="width:52px;height:5px;background:${ORANGE};margin-bottom:22px;border-radius:2px"></div>
          <div style="color:${WHITE};font-size:64px;font-weight:900;line-height:1.05;text-transform:uppercase;margin-bottom:14px">${h}</div>
          ${sub ? `<div style="color:rgba(255,255,255,0.5);font-size:21px;font-family:'Barlow',sans-serif;line-height:1.5">${sub}</div>` : ''}
        </div>
        <div style="color:${ORANGE};font-size:17px;font-weight:700;font-family:'Barlow',sans-serif">Always by your side</div>
      </div>
      <div style="position:absolute;left:42%;top:0;bottom:0;width:5px;background:${ORANGE};z-index:10"></div>
      <div style="flex:1;background:url('${img}') center/cover no-repeat;position:relative">
        <div style="position:absolute;inset:0;background:linear-gradient(to right,${NAVY}55,transparent 40%)"></div>
      </div>
      ${footer(true)}
    </div>`),

  // 3. SLASH BURN — orange diagonal slash bottom, headline on slash
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:url('${img}') center/cover no-repeat;position:relative">
      <div style="position:absolute;inset:0;background:${NAVY}44"></div>
      <div style="position:absolute;top:32px;left:36px">${logo('white', 210)}</div>
      <div style="position:absolute;bottom:62px;left:0;right:0;height:240px;background:${ORANGE};clip-path:polygon(0 35%,100% 0,100% 100%,0 100%);display:flex;align-items:flex-end;padding:0 40px 76px">
        <div>
          <div style="color:${NAVY};font-size:72px;font-weight:900;line-height:1;text-transform:uppercase">${h}</div>
          ${sub ? `<div style="color:${NAVY};font-size:24px;font-weight:700;font-family:'Barlow',sans-serif;opacity:0.75;margin-top:6px">${sub}</div>` : ''}
        </div>
      </div>
      ${footer(true)}
    </div>`),

  // 4. CINEMATIC — dark letterbox top + bottom, photo center, headline in bottom bar
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;display:flex;flex-direction:column;background:${NAVY};position:relative">
      <div style="height:96px;display:flex;align-items:center;justify-content:space-between;padding:0 40px">
        ${logo('navy', 210)}
        <span style="color:${ORANGE};font-family:'Barlow',sans-serif;font-size:15px;font-weight:700;letter-spacing:4px;text-transform:uppercase">Always by your side</span>
      </div>
      <div style="flex:1;background:url('${img}') center/cover no-repeat"></div>
      <div style="height:176px;padding:0 40px 68px;display:flex;flex-direction:column;justify-content:center">
        <div style="color:${ORANGE};font-size:13px;font-weight:700;letter-spacing:5px;font-family:'Barlow',sans-serif;margin-bottom:8px">▸ ▸ ▸</div>
        <div style="color:${WHITE};font-size:62px;font-weight:900;text-transform:uppercase;line-height:1">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.5);font-size:20px;font-family:'Barlow',sans-serif;margin-top:6px">${sub}</div>` : ''}
      </div>
      ${footer(true)}
    </div>`),

  // 5. CORNER BLAZE — orange triangle top-right with logo, dark bottom gradient
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:url('${img}') center/cover no-repeat;position:relative">
      <div style="position:absolute;inset:0;background:linear-gradient(to top,${NAVY}ee 0%,${NAVY}66 38%,transparent 58%)"></div>
      <div style="position:absolute;top:0;right:0;width:0;height:0;border-style:solid;border-width:0 270px 270px 0;border-color:transparent ${ORANGE} transparent transparent"></div>
      <div style="position:absolute;top:16px;right:16px">${logo('navy', 180)}</div>
      <div style="position:absolute;bottom:72px;left:40px;right:40px">
        <div style="color:${ORANGE};font-size:14px;font-weight:700;letter-spacing:4px;text-transform:uppercase;font-family:'Barlow',sans-serif;margin-bottom:12px">▶ MOBILITY PARTS</div>
        <div style="color:${WHITE};font-size:78px;font-weight:900;text-transform:uppercase;line-height:1;margin-bottom:8px">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.65);font-size:24px;font-family:'Barlow',sans-serif">${sub}</div>` : ''}
      </div>
      ${footer()}
    </div>`),

  // 6. MINIMAL FLOAT — photo full bleed, floating white card bottom-left
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:url('${img}') center/cover no-repeat;position:relative">
      <div style="position:absolute;top:32px;right:36px">${logo('white', 210)}</div>
      <div style="position:absolute;bottom:72px;left:36px;right:36px;background:${WHITE};border-left:7px solid ${ORANGE};padding:26px 30px;box-shadow:0 12px 50px rgba(0,0,0,0.45)">
        <div style="color:${ORANGE};font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;font-family:'Barlow',sans-serif;margin-bottom:8px">MOBILITY PARTS</div>
        <div style="color:${NAVY};font-size:60px;font-weight:900;text-transform:uppercase;line-height:1;margin-bottom:8px">${h}</div>
        ${sub ? `<div style="color:rgba(13,14,42,0.6);font-size:22px;font-family:'Barlow',sans-serif">${sub}</div>` : ''}
      </div>
      ${footer()}
    </div>`),

  // 7. EDITORIAL RIGHT — photo left 55%, navy right panel 45%
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;display:flex;position:relative">
      <div style="width:55%;background:url('${img}') center/cover no-repeat;position:relative">
        <div style="position:absolute;inset:0;background:linear-gradient(to left,${NAVY}bb,transparent 45%)"></div>
      </div>
      <div style="flex:1;background:${NAVY};display:flex;flex-direction:column;padding:40px 34px 80px;justify-content:space-between">
        ${logo('navy', 210)}
        <div>
          <div style="width:44px;height:5px;background:${ORANGE};margin-bottom:20px;border-radius:2px"></div>
          <div style="color:${WHITE};font-size:62px;font-weight:900;line-height:1.05;text-transform:uppercase;margin-bottom:14px">${h}</div>
          ${sub ? `<div style="color:rgba(255,255,255,0.5);font-size:21px;font-family:'Barlow',sans-serif;line-height:1.5">${sub}</div>` : ''}
          <div style="margin-top:22px;height:2px;background:${ORANGE};opacity:0.35"></div>
        </div>
        <div style="color:${ORANGE};font-size:16px;font-weight:700;font-family:'Barlow',sans-serif">Always by your side</div>
      </div>
      ${footer(true)}
    </div>`),

  // 8. ARC BOTTOM — curved dark shape at bottom, headline centered in arc
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:url('${img}') center/cover no-repeat;position:relative">
      <div style="position:absolute;top:32px;left:36px">${logo('white', 210)}</div>
      <div style="position:absolute;bottom:0;left:-8%;right:-8%;height:320px;background:${NAVY};border-radius:60% 60% 0 0/40% 40% 0 0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:64px">
        <div style="color:${ORANGE};font-size:13px;font-weight:700;letter-spacing:5px;text-transform:uppercase;font-family:'Barlow',sans-serif;margin-bottom:10px">● MOBILITY PARTS</div>
        <div style="color:${WHITE};font-size:66px;font-weight:900;text-transform:uppercase;text-align:center;line-height:1">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.5);font-size:22px;font-family:'Barlow',sans-serif;text-align:center;margin-top:8px">${sub}</div>` : ''}
      </div>
      ${footer(true)}
    </div>`),

  // 9. STACKED POWER — photo top 58%, navy bottom 42%
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;display:flex;flex-direction:column;position:relative">
      <div style="height:58%;background:url('${img}') center/cover no-repeat;position:relative">
        <div style="position:absolute;top:28px;left:32px">${logo('white', 210)}</div>
        <div style="position:absolute;bottom:0;left:0;right:0;height:70px;background:linear-gradient(to bottom,transparent,${NAVY})"></div>
      </div>
      <div style="flex:1;background:${NAVY};padding:22px 40px 72px;display:flex;flex-direction:column;justify-content:center">
        <div style="width:64px;height:5px;background:${ORANGE};margin-bottom:18px;border-radius:2px"></div>
        <div style="color:${WHITE};font-size:70px;font-weight:900;text-transform:uppercase;line-height:1;margin-bottom:10px">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.5);font-size:22px;font-family:'Barlow',sans-serif">${sub}</div>` : ''}
      </div>
      ${footer(true)}
    </div>`),

  // 10. NEON BORDER — dark bg, photo inside orange-bordered frame
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:${NAVY};display:flex;flex-direction:column;align-items:center;padding:30px 40px 80px;position:relative">
      <div style="display:flex;justify-content:space-between;width:100%;align-items:center;margin-bottom:18px">
        ${logo('navy', 210)}
        <div style="color:${ORANGE};font-size:14px;font-weight:700;letter-spacing:3px;text-transform:uppercase;font-family:'Barlow',sans-serif">Always by your side</div>
      </div>
      <div style="flex:1;width:100%;border:4px solid ${ORANGE};background:url('${img}') center/cover no-repeat;box-shadow:0 0 40px ${ORANGE}33;position:relative">
        <div style="position:absolute;top:-1px;left:-1px;width:22px;height:22px;border-top:5px solid ${WHITE};border-left:5px solid ${WHITE}"></div>
        <div style="position:absolute;top:-1px;right:-1px;width:22px;height:22px;border-top:5px solid ${WHITE};border-right:5px solid ${WHITE}"></div>
        <div style="position:absolute;bottom:-1px;left:-1px;width:22px;height:22px;border-bottom:5px solid ${WHITE};border-left:5px solid ${WHITE}"></div>
        <div style="position:absolute;bottom:-1px;right:-1px;width:22px;height:22px;border-bottom:5px solid ${WHITE};border-right:5px solid ${WHITE}"></div>
      </div>
      <div style="width:100%;margin-top:18px">
        <div style="color:${WHITE};font-size:56px;font-weight:900;text-transform:uppercase;line-height:1">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.45);font-size:19px;font-family:'Barlow',sans-serif;margin-top:6px">${sub}</div>` : ''}
      </div>
      ${footer(true)}
    </div>`),

  // 11. SIDE COLUMN — orange vertical bar left, photo right, headline bottom-right
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;display:flex;position:relative">
      <div style="width:86px;background:${ORANGE};display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2;flex-shrink:0">
        <div style="transform:rotate(-90deg);white-space:nowrap;color:${NAVY};font-size:16px;font-weight:900;letter-spacing:5px;text-transform:uppercase">MOBILITY PARTS</div>
      </div>
      <div style="flex:1;background:url('${img}') center/cover no-repeat;position:relative">
        <div style="position:absolute;inset:0;background:linear-gradient(to top,${NAVY}ee 0%,transparent 50%)"></div>
        <div style="position:absolute;top:28px;right:32px">${logo('white', 210)}</div>
        <div style="position:absolute;bottom:72px;right:36px;text-align:right">
          <div style="color:${WHITE};font-size:68px;font-weight:900;text-transform:uppercase;line-height:1">${h}</div>
          ${sub ? `<div style="color:rgba(255,255,255,0.55);font-size:22px;font-family:'Barlow',sans-serif;margin-top:8px">${sub}</div>` : ''}
        </div>
      </div>
      ${footer()}
    </div>`),

  // 12. LABEL TAG — orange header tag parallelogram, photo bg
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:url('${img}') center/cover no-repeat;position:relative">
      <div style="position:absolute;inset:0;background:${NAVY}44"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:108px;background:${ORANGE};clip-path:polygon(0 0,100% 0,94% 100%,0 100%);display:flex;align-items:center;padding:0 40px;gap:22px">
        ${logo('white', 210)}
        <div style="width:2px;height:48px;background:${NAVY};opacity:0.25"></div>
        <div style="color:${NAVY};font-size:19px;font-weight:900;letter-spacing:2px;text-transform:uppercase;font-family:'Barlow Condensed',sans-serif">Always by your side</div>
      </div>
      <div style="position:absolute;bottom:72px;left:40px;right:40px">
        <div style="color:${WHITE};font-size:78px;font-weight:900;text-transform:uppercase;line-height:1;margin-bottom:8px;text-shadow:0 3px 24px rgba(13,14,42,0.7)">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.8);font-size:26px;font-family:'Barlow',sans-serif;text-shadow:0 2px 12px rgba(13,14,42,0.6)">${sub}</div>` : ''}
      </div>
      ${footer()}
    </div>`),

  // 13. SPOTLIGHT — radial vignette, centered logo, headline bottom
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:url('${img}') center/cover no-repeat;position:relative">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 28%,${NAVY}cc 100%)"></div>
      <div style="position:absolute;top:36px;left:50%;transform:translateX(-50%)">${logo('white', 210)}</div>
      <div style="position:absolute;bottom:72px;left:0;right:0;text-align:center;padding:0 60px">
        <div style="display:inline-block;width:52px;height:4px;background:${ORANGE};margin-bottom:16px"></div>
        <div style="color:${WHITE};font-size:72px;font-weight:900;text-transform:uppercase;line-height:1;margin-bottom:10px">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.6);font-size:23px;font-family:'Barlow',sans-serif">${sub}</div>` : ''}
      </div>
      ${footer()}
    </div>`),

  // 14. MAGAZINE BOLD — dark overlay, huge faded MP monogram background element
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:url('${img}') center/cover no-repeat;position:relative">
      <div style="position:absolute;inset:0;background:${NAVY}bb"></div>
      <div style="position:absolute;bottom:-30px;right:-20px;color:${ORANGE};font-size:280px;font-weight:900;opacity:0.07;line-height:1;pointer-events:none;z-index:0">MP</div>
      <div style="position:absolute;top:40px;left:40px;z-index:2">${logo('navy', 210)}</div>
      <div style="position:absolute;top:50%;left:40px;right:40px;transform:translateY(-50%);z-index:2">
        <div style="color:${ORANGE};font-size:14px;font-weight:700;letter-spacing:5px;text-transform:uppercase;font-family:'Barlow',sans-serif;margin-bottom:16px">— MOBILITY PARTS —</div>
        <div style="color:${WHITE};font-size:82px;font-weight:900;text-transform:uppercase;line-height:1;margin-bottom:12px">${h}</div>
        <div style="height:3px;background:${ORANGE};width:108px;margin:16px 0"></div>
        ${sub ? `<div style="color:rgba(255,255,255,0.55);font-size:24px;font-family:'Barlow',sans-serif">${sub}</div>` : ''}
      </div>
      ${footer()}
    </div>`),

  // 15. WINDOW FRAME — photo in centered framed box, navy outer border, corner accents
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:${NAVY};display:flex;flex-direction:column;padding:30px 40px 80px;position:relative">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        ${logo('navy', 210)}
        <div style="color:${ORANGE};font-size:14px;font-weight:700;letter-spacing:3px;font-family:'Barlow',sans-serif">${ADDRESS}</div>
      </div>
      <div style="flex:1;border:3px solid ${ORANGE}66;position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:url('${img}') center/cover no-repeat"></div>
        <div style="position:absolute;top:-1px;left:-1px;width:24px;height:24px;border-top:5px solid ${ORANGE};border-left:5px solid ${ORANGE}"></div>
        <div style="position:absolute;top:-1px;right:-1px;width:24px;height:24px;border-top:5px solid ${ORANGE};border-right:5px solid ${ORANGE}"></div>
        <div style="position:absolute;bottom:-1px;left:-1px;width:24px;height:24px;border-bottom:5px solid ${ORANGE};border-left:5px solid ${ORANGE}"></div>
        <div style="position:absolute;bottom:-1px;right:-1px;width:24px;height:24px;border-bottom:5px solid ${ORANGE};border-right:5px solid ${ORANGE}"></div>
      </div>
      <div style="margin-top:18px">
        <div style="color:${WHITE};font-size:54px;font-weight:900;text-transform:uppercase;line-height:1">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.4);font-size:19px;font-family:'Barlow',sans-serif;margin-top:6px">${sub}</div>` : ''}
      </div>
      ${footer(true)}
    </div>`),

  // 16. DIAGONAL DUEL — photo background, orange solid bottom-right triangle, headline on orange
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;position:relative">
      <div style="position:absolute;inset:0;background:url('${img}') center/cover no-repeat"></div>
      <div style="position:absolute;inset:0;background:${ORANGE};clip-path:polygon(60% 100%,100% 40%,100% 100%)"></div>
      <div style="position:absolute;top:32px;left:36px">${logo('white', 210)}</div>
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:flex-end;justify-content:flex-end;padding:80px 40px 72px">
        <div style="text-align:right">
          <div style="color:${NAVY};font-size:72px;font-weight:900;text-transform:uppercase;line-height:1">${h}</div>
          ${sub ? `<div style="color:${NAVY};font-size:24px;font-family:'Barlow',sans-serif;font-weight:700;opacity:0.75;margin-top:6px">${sub}</div>` : ''}
        </div>
      </div>
      ${footer()}
    </div>`),

  // 17. BANNER ROLL — photo bg, horizontal orange ribbon across center
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:url('${img}') center/cover no-repeat;position:relative">
      <div style="position:absolute;inset:0;background:${NAVY}44"></div>
      <div style="position:absolute;top:32px;left:36px">${logo('white', 210)}</div>
      <div style="position:absolute;top:50%;left:0;right:0;transform:translateY(-50%)">
        <div style="background:${ORANGE};padding:22px 40px;clip-path:polygon(0 0,100% 0,97% 50%,100% 100%,0 100%,3% 50%)">
          <div style="color:${NAVY};font-size:70px;font-weight:900;text-transform:uppercase;line-height:1;text-align:center">${h}</div>
          ${sub ? `<div style="color:${NAVY};font-size:22px;font-family:'Barlow',sans-serif;font-weight:700;text-align:center;opacity:0.8;margin-top:4px">${sub}</div>` : ''}
        </div>
      </div>
      ${footer()}
    </div>`),

  // 18. CLEAN PRO — frosted top card, full photo bg, modern corporate
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:url('${img}') center/cover no-repeat;position:relative">
      <div style="position:absolute;inset:0;background:${NAVY}2a"></div>
      <div style="position:absolute;top:0;left:0;right:0;padding:30px 40px 26px;background:rgba(13,14,42,0.85)">
        <div style="display:flex;align-items:center;gap:18px;margin-bottom:14px">
          ${logo('navy', 180)}
          <div style="width:2px;height:38px;background:${ORANGE}88"></div>
          <div style="color:rgba(255,255,255,0.45);font-size:15px;font-family:'Barlow',sans-serif;letter-spacing:2px;text-transform:uppercase">Always by your side</div>
        </div>
        <div style="color:${WHITE};font-size:62px;font-weight:900;text-transform:uppercase;line-height:1">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.5);font-size:22px;font-family:'Barlow',sans-serif;margin-top:8px">${sub}</div>` : ''}
      </div>
      ${footer()}
    </div>`),

  // 19. GRID OVERLAY — subtle technical grid over photo, editorial feel
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:url('${img}') center/cover no-repeat;position:relative">
      <div style="position:absolute;inset:0;background-image:linear-gradient(${NAVY}18 1px,transparent 1px),linear-gradient(90deg,${NAVY}18 1px,transparent 1px);background-size:54px 54px"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to top,${NAVY}f0 0%,${NAVY}55 38%,transparent 60%)"></div>
      <div style="position:absolute;top:32px;left:36px">${logo('white', 210)}</div>
      <div style="position:absolute;bottom:72px;left:40px;right:40px">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
          <div style="width:42px;height:3px;background:${ORANGE}"></div>
          <span style="color:${ORANGE};font-size:13px;font-weight:700;letter-spacing:4px;text-transform:uppercase;font-family:'Barlow',sans-serif">MOBILITY PARTS</span>
        </div>
        <div style="color:${WHITE};font-size:74px;font-weight:900;text-transform:uppercase;line-height:1">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.55);font-size:24px;font-family:'Barlow',sans-serif;margin-top:8px">${sub}</div>` : ''}
      </div>
      ${footer()}
    </div>`),

  // 20. DUAL PANEL — navy top+bottom, orange side bars, photo in center
  ({ img, h, sub }) => wrap(`
    <div style="width:1080px;height:1080px;background:${NAVY};display:flex;flex-direction:column;position:relative">
      <div style="padding:28px 40px 16px;display:flex;justify-content:space-between;align-items:center">
        ${logo('navy', 210)}
        <div style="color:${ORANGE};font-size:14px;font-weight:700;letter-spacing:3px;font-family:'Barlow',sans-serif;text-transform:uppercase">Always by your side</div>
      </div>
      <div style="flex:1;display:flex;overflow:hidden">
        <div style="width:10px;background:${ORANGE};flex-shrink:0"></div>
        <div style="flex:1;background:url('${img}') center/cover no-repeat"></div>
        <div style="width:10px;background:${ORANGE};flex-shrink:0"></div>
      </div>
      <div style="padding:18px 40px 72px">
        <div style="color:${WHITE};font-size:64px;font-weight:900;text-transform:uppercase;line-height:1">${h}</div>
        ${sub ? `<div style="color:rgba(255,255,255,0.45);font-size:20px;font-family:'Barlow',sans-serif;margin-top:8px">${sub}</div>` : ''}
      </div>
      ${footer(true)}
    </div>`),
];

async function fetchImageAsDataUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
  const buffer = await res.arrayBuffer();
  const ct = res.headers.get('content-type') || 'image/jpeg';
  const b64 = Buffer.from(buffer).toString('base64');
  return `data:${ct};base64,${b64}`;
}

export async function renderBrandedImage({ imageUrl, headline, sub, postCount }) {
  const templateIndex = postCount % TEMPLATES.length;
  const templateFn = TEMPLATES[templateIndex];

  const imgDataUrl = await fetchImageAsDataUrl(imageUrl);
  const html = templateFn({ img: imgDataUrl, h: headline, sub: sub || '' });

  const isCI = process.env.CI === 'true';
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      ...(isCI ? ['--disable-gpu'] : []),
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle2', timeout: 30000 });
    const buffer = await page.screenshot({ type: 'png' });
    return { buffer, templateIndex };
  } finally {
    await browser.close();
  }
}
