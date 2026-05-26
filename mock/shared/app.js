/* ==============================
   勤怠ナビ 共通JS
   - 業界自動切替（?industry=xxx or localStorage）
   - 打刻・申請・承認の localStorage 永続化
   - モーダル・トースト
   ============================== */

const INDUSTRIES = {
  logistics:    { name: '軽貨物・運送業', logo: '勤怠ナビ', subtitle: 'HRMS for Japan SMB' },
  restaurant:   { name: '飲食チェーン',   logo: '店舗ナビ', subtitle: 'For Restaurant Chain' },
  caregiving:   { name: '介護事業所',     logo: 'ケアナビ', subtitle: 'For Care Facility' },
  professional: { name: '士業事務所',     logo: '士業ナビ', subtitle: 'For Professional Office' },
};

const NAV_CONFIG = {
  logistics: [
    { group: 'メイン' },
    { icon: '📊', label: 'ダッシュボード', href: 'logistics.html' },
    { icon: '⏰', label: '勤怠管理',       href: 'attendance.html' },
    { icon: '📅', label: 'シフト作成',     href: 'shift.html' },
    { icon: '🏖', label: '休暇申請',       href: 'leave.html' },
    { group: '人事' },
    { icon: '👥', label: '従業員',         href: 'employees.html' },
    { icon: '💴', label: '給与計算',       soon: true },
    { icon: '📈', label: '評価',           soon: true },
    { icon: '📝', label: '入退社',         soon: true },
    { group: '設定' },
    { icon: '⚙', label: '会社設定',       soon: true },
    { icon: '🇯🇵', label: '祝日カレンダー', soon: true },
  ],
  restaurant: [
    { group: '店舗運営' },
    { icon: '🏪', label: '店舗ダッシュボード', href: 'restaurant.html' },
    { icon: '⏰', label: '打刻・勤怠',         href: 'attendance.html' },
    { icon: '📅', label: 'シフト作成',         href: 'shift.html' },
    { icon: '🍱', label: 'まかない管理',       soon: true },
    { group: 'スタッフ' },
    { icon: '👥', label: '従業員・バイト',     href: 'employees.html' },
    { icon: '🏖', label: '休暇申請',           href: 'leave.html' },
    { icon: '💴', label: '給与（深夜割増）',   soon: true },
    { icon: '🎓', label: '研修・スキル',       soon: true },
    { group: '経営' },
    { icon: '📊', label: '人件費分析',         soon: true },
    { icon: '🍴', label: '店舗別売上連動',     soon: true },
    { icon: '⚙', label: '店舗設定',           soon: true },
  ],
  caregiving: [
    { group: '運営' },
    { icon: '🏥', label: '施設ダッシュボード', href: 'caregiving.html' },
    { icon: '⏰', label: '打刻・勤怠',         href: 'attendance.html' },
    { icon: '📅', label: 'シフト（配置基準）', href: 'shift.html' },
    { icon: '🛌', label: '夜勤管理',           soon: true },
    { group: 'スタッフ' },
    { icon: '👥', label: '職員一覧',           href: 'employees.html' },
    { icon: '🏖', label: '休暇申請',           href: 'leave.html' },
    { icon: '🎓', label: '資格・研修管理',     soon: true },
    { icon: '💴', label: '給与（処遇改善加算）', soon: true },
    { group: 'ケア' },
    { icon: '👴', label: '利用者管理',         soon: true },
    { icon: '📝', label: 'ケア記録連携',       soon: true },
    { icon: '⚙', label: '加算設定',           soon: true },
  ],
  professional: [
    { group: '業務' },
    { icon: '📊', label: 'ダッシュボード',     href: 'professional.html' },
    { icon: '⏱', label: '工数（タイムチャージ）', href: 'attendance.html' },
    { icon: '📅', label: 'シフト作成',         href: 'shift.html' },
    { icon: '📁', label: '案件管理',           soon: true },
    { group: '所員' },
    { icon: '👥', label: '所員一覧',           href: 'employees.html' },
    { icon: '🏖', label: '休暇申請',           href: 'leave.html' },
    { icon: '📈', label: '稼働率分析',         soon: true },
    { icon: '💴', label: '給与計算',           soon: true },
    { group: '期限・予定' },
    { icon: '⚠', label: '期日カレンダー',     soon: true },
    { icon: '🏢', label: '顧問先管理',         soon: true },
    { icon: '⚙', label: '設定',               soon: true },
  ],
};

// ===== 業界検出 =====
function getIndustry() {
  const url = new URL(location.href);
  let ind = url.searchParams.get('industry');
  if (!ind) ind = localStorage.getItem('hrms-current-industry');
  if (!ind || !INDUSTRIES[ind]) ind = 'logistics';
  localStorage.setItem('hrms-current-industry', ind);
  return ind;
}

// ===== サイドバー描画 =====
function renderSidebar(industry, activeHref) {
  const ind = INDUSTRIES[industry];
  const nav = NAV_CONFIG[industry] || NAV_CONFIG.logistics;
  let html = `<div class="logo">${ind.logo}<small>${ind.subtitle}</small></div><nav>`;
  for (const item of nav) {
    if (item.group) { html += `<div class="group">${item.group}</div>`; continue; }
    const cls = item.soon ? 'disabled' : (item.href === activeHref ? 'active' : '');
    const href = item.soon ? '#' : `${item.href}?industry=${industry}`;
    const soon = item.soon ? '<span class="soon">近日</span>' : '';
    html += `<a href="${href}" class="${cls}">${item.icon} ${item.label}${soon}</a>`;
  }
  html += '</nav>';
  return html;
}

// ===== バナー =====
function renderBanner(industry) {
  const ind = INDUSTRIES[industry];
  return `<div class="mock-banner">⚠ 営業デモ用モック ｜ ${ind.name} ｜ <a href="index.html">業種選択へ戻る</a></div>`;
}

// ===== localStorage CRUD =====
const Store = {
  key(industry, type) { return `hrms-mock-${industry}-${type}`; },
  get(industry, type, defaultVal = []) {
    try { return JSON.parse(localStorage.getItem(this.key(industry, type))) ?? defaultVal; }
    catch { return defaultVal; }
  },
  set(industry, type, val) { localStorage.setItem(this.key(industry, type), JSON.stringify(val)); },
  add(industry, type, item) {
    const arr = this.get(industry, type, []);
    arr.push({ id: Date.now() + Math.random().toString(36).slice(2, 7), ...item });
    this.set(industry, type, arr);
    return arr;
  },
  remove(industry, type, id) {
    const arr = this.get(industry, type, []).filter(x => x.id !== id);
    this.set(industry, type, arr);
    return arr;
  },
  update(industry, type, id, patch) {
    const arr = this.get(industry, type, []).map(x => x.id === id ? { ...x, ...patch } : x);
    this.set(industry, type, arr);
    return arr;
  },
};

// ===== モーダル =====
function modal(html, onOk) {
  let overlay = document.querySelector('#__modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = '__modal';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  overlay.classList.add('open');
  overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
  window.__modalOk = onOk;
}
function closeModal() {
  const overlay = document.querySelector('#__modal');
  if (overlay) overlay.classList.remove('open');
}
function submitModal() {
  if (window.__modalOk) window.__modalOk();
  closeModal();
}

// ===== トースト =====
function toast(msg, type = '') {
  let t = document.querySelector('#__toast');
  if (!t) {
    t = document.createElement('div');
    t.id = '__toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.className = `toast ${type}`;
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== 共通: ページ初期化 =====
function initPage(activeHref) {
  const industry = getIndustry();
  document.body.dataset.industry = industry;
  const sb = document.querySelector('aside');
  if (sb) sb.innerHTML = renderSidebar(industry, activeHref);
  const banner = document.querySelector('.mock-banner-placeholder');
  if (banner) banner.outerHTML = renderBanner(industry);
  // user header
  const user = document.querySelector('.user-placeholder');
  if (user) {
    const name = { logistics: '谷井 誠也（管理者）', restaurant: '鈴木 店長', caregiving: '山下 施設長', professional: '谷井 所長' }[industry];
    const initial = { logistics: '谷', restaurant: '鈴', caregiving: '山', professional: '谷' }[industry];
    user.outerHTML = `<div class="user"><span>${name}</span><div class="avatar">${initial}</div></div>`;
  }
  return industry;
}

// ===== サンプル従業員データ（業界別） =====
const SAMPLE_EMPLOYEES = {
  logistics: [
    { name: '佐藤 健太', dept: '配送1課', role: 'ドライバー', joinDate: '2022-04-01' },
    { name: '鈴木 美咲', dept: '事務',    role: '事務職',    joinDate: '2020-09-15' },
    { name: '高橋 一郎', dept: '配送2課', role: 'ドライバー', joinDate: '2019-03-10' },
    { name: '田中 太郎', dept: '配送1課', role: 'ドライバー', joinDate: '2023-07-01' },
    { name: '渡辺 由美', dept: '経理',    role: '経理',      joinDate: '2018-04-01' },
    { name: '伊藤 拓海', dept: '配送3課', role: 'ドライバー', joinDate: '2024-01-15' },
    { name: '山本 桜',   dept: '営業',    role: '営業',      joinDate: '2021-04-01' },
  ],
  restaurant: [
    { name: '鈴木 店長',   dept: '新宿東口店', role: '店長',       joinDate: '2018-03-01' },
    { name: '田中 料理長', dept: '新宿東口店', role: '料理長',     joinDate: '2019-06-15' },
    { name: '佐藤 美咲',   dept: '新宿東口店', role: 'ホール社員', joinDate: '2021-04-01' },
    { name: '山田 拓也',   dept: '新宿東口店', role: 'バイト',     joinDate: '2024-04-10' },
    { name: '伊藤 凛',     dept: '新宿東口店', role: 'バイト',     joinDate: '2023-09-01' },
    { name: '渡辺 健',     dept: '新宿東口店', role: 'バイト',     joinDate: '2024-11-01' },
    { name: '高橋 真央',   dept: '新宿東口店', role: 'キッチン社員', joinDate: '2020-10-01' },
  ],
  caregiving: [
    { name: '山下 施設長', dept: '管理',     role: '施設長/介護福祉士', joinDate: '2015-04-01' },
    { name: '佐藤 みどり', dept: 'ユニット1', role: '介護福祉士',       joinDate: '2017-09-15' },
    { name: '鈴木 健一',   dept: 'ユニット1', role: '介護福祉士',       joinDate: '2019-04-01' },
    { name: '田中 由香',   dept: 'ユニット1', role: '初任者研修修了',   joinDate: '2023-07-01' },
    { name: '渡辺 真理子', dept: 'ユニット1', role: '介護福祉士/夜勤専従', joinDate: '2018-04-01' },
    { name: '伊藤 翔太',   dept: 'ユニット1', role: '実務者研修修了',   joinDate: '2022-01-15' },
    { name: '高橋 美奈',   dept: 'ユニット1', role: '介護福祉士',       joinDate: '2016-04-01' },
  ],
  professional: [
    { name: '谷井 所長',     dept: '社労士', role: '所長/社労士',     joinDate: '2015-04-01' },
    { name: '佐藤 副所長',   dept: '社労士', role: '副所長/社労士',   joinDate: '2017-04-01' },
    { name: '鈴木 真理',     dept: '事務',   role: '事務リーダー',   joinDate: '2018-09-15' },
    { name: '田中 拓海',     dept: '事務',   role: '事務職',         joinDate: '2021-04-01' },
    { name: '渡辺 美咲',     dept: '事務',   role: '補助（パート）', joinDate: '2022-10-01' },
  ],
};

const SAMPLE_LEAVE = {
  logistics: [
    { name: '佐藤 健太', type: '有給',   from: '2026-06-03', to: '2026-06-05', days: 3, reason: '家族旅行', status: 'pending' },
    { name: '田中 太郎', type: '有給',   from: '2026-05-25', to: '2026-05-25', days: 1, reason: '私用',     status: 'approved' },
    { name: '鈴木 美咲', type: '残業申請', from: '2026-05-24', to: '2026-05-24', days: 0.4, reason: '月末処理', status: 'pending' },
  ],
  restaurant: [
    { name: '山田 拓也', type: '希望休', from: '2026-05-28', to: '2026-05-28', days: 1, reason: '大学テスト', status: 'pending' },
    { name: '伊藤 凛',   type: '希望休', from: '2026-05-31', to: '2026-05-31', days: 1, reason: '実習',       status: 'approved' },
  ],
  caregiving: [
    { name: '高橋 美奈', type: '夜勤明け休', from: '2026-05-25', to: '2026-05-25', days: 1, reason: '夜勤明け', status: 'approved' },
    { name: '田中 由香', type: '有給',       from: '2026-06-10', to: '2026-06-12', days: 3, reason: '私用',     status: 'pending' },
  ],
  professional: [
    { name: '佐藤 副所長', type: '有給', from: '2026-06-15', to: '2026-06-16', days: 2, reason: '私用', status: 'pending' },
    { name: '鈴木 真理',   type: '半休', from: '2026-05-27', to: '2026-05-27', days: 0.5, reason: '通院', status: 'approved' },
  ],
};

function seedDataIfEmpty(industry) {
  if (Store.get(industry, 'employees', null) === null) {
    Store.set(industry, 'employees', SAMPLE_EMPLOYEES[industry].map((e, i) => ({ id: `emp-${i}`, ...e })));
  }
  if (Store.get(industry, 'leave', null) === null) {
    Store.set(industry, 'leave', SAMPLE_LEAVE[industry].map((l, i) => ({ id: `lv-${i}`, ...l })));
  }
  if (Store.get(industry, 'attendance', null) === null) {
    Store.set(industry, 'attendance', []);
  }
  if (Store.get(industry, 'shifts', null) === null) {
    Store.set(industry, 'shifts', {});
  }
}

function fmtDate(d) {
  const dt = (d instanceof Date) ? d : new Date(d);
  const Y = dt.getFullYear(), M = String(dt.getMonth() + 1).padStart(2, '0'), D = String(dt.getDate()).padStart(2, '0');
  return `${Y}-${M}-${D}`;
}
function fmtTime(d) {
  const dt = (d instanceof Date) ? d : new Date(d);
  return String(dt.getHours()).padStart(2, '0') + ':' + String(dt.getMinutes()).padStart(2, '0');
}
function todayISO() { return fmtDate(new Date()); }
function nowHM() { return fmtTime(new Date()); }
