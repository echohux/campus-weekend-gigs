import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, Bell, BookOpen, BriefcaseBusiness, Building2, CalendarDays, Check,
  ChevronDown, ChevronRight, CircleUserRound, Clock3, FileCheck2, FileText,
  GraduationCap, HeartHandshake, IdCard, LayoutList, MapPin, Search, ShieldCheck,
  Store, Upload, UsersRound, WalletCards, X
} from 'lucide-react';
import { seedJobs, CAMPUS } from './data/jobs';
import { sendCode, loginOrRegister, logout, getCurrentUser } from './cloudbase';

const defaults = { verified: false, applications: [], merchantStatus: 'pending', merchantJobs: [] };
const roleKey = uid => `wb-role:${uid}`;
const stateKey = uid => `weekend-buddy:${uid}`;

// 业务数据按登录用户 uid 隔离存储（登录态本身由 CloudBase 维护）
function usePersistedState(uid) {
  const [state, setState] = useState(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(stateKey(uid))) }; }
    catch { return defaults; }
  });
  useEffect(() => localStorage.setItem(stateKey(uid), JSON.stringify(state)), [uid, state]);
  return [state, setState];
}

// 从 SDK 抛出的错误里尽量取到可读信息
function readErr(e, fallback) {
  return e?.error_description || e?.message || e?.msg || fallback;
}

// 把相对资源路径拼上部署基路径，兼容 GitHub Pages 子路径（/campus-weekend-gigs/）
const asset = p => import.meta.env.BASE_URL + p;

function Brand() {
  return <div className="brand"><span className="brand-mark"><HeartHandshake size={26}/></span><span>周末搭子</span></div>;
}

function Status({ children, tone = 'green' }) {
  return <span className={`status status-${tone}`}><Check size={13}/>{children}</span>;
}

function Login({ onAuthed }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const verificationRef = useRef(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSend = async () => {
    setError('');
    if (!emailValid) { setError('请输入正确的邮箱地址'); return; }
    setSending(true);
    try {
      verificationRef.current = await sendCode(email.trim());
      setCooldown(60); // 避免频繁发送
    } catch (e) {
      setError(readErr(e, '验证码发送失败，请稍后再试'));
    } finally {
      setSending(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!emailValid) { setError('请输入正确的邮箱地址'); return; }
    if (!code.trim()) { setError('请输入收到的邮箱验证码'); return; }
    if (!verificationRef.current) { setError('请先点击「获取验证码」'); return; }
    setSubmitting(true);
    try {
      const { uid, isNewUser } = await loginOrRegister({
        email: email.trim(), code: code.trim(), verification: verificationRef.current,
      });
      let finalRole = role;
      if (isNewUser) localStorage.setItem(roleKey(uid), role);
      else finalRole = localStorage.getItem(roleKey(uid)) || role;
      onAuthed({ uid, role: finalRole });
    } catch (e) {
      setError(readErr(e, '登录失败，请检查验证码是否正确'));
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="login-shell">
    <header className="login-header"><Brand/><nav><a href="#about">关于平台</a><a href="#safety">安全说明</a></nav></header>
    <section className="login-layout">
      <div className="auth-panel">
        <button className="text-back" type="button" aria-label="返回"><ArrowLeft size={19}/> 安全、透明的周末兼职</button>
        <h1>登录你的周末计划</h1>
        <p className="lead">认证学生和真实商家，在更近的地方找到更合适的周末安排。</p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="account">邮箱</label>
          <input id="account" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="请输入邮箱地址" autoComplete="email" />
          <label htmlFor="code">验证码</label>
          <div className="input-action"><input id="code" value={code} onChange={e=>setCode(e.target.value)} placeholder="输入邮箱验证码" inputMode="numeric" autoComplete="one-time-code"/><button type="button" onClick={handleSend} disabled={sending || cooldown>0}>{cooldown>0 ? `${cooldown}s 后重发` : sending ? '发送中…' : '获取验证码'}</button></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="role-label">首次使用？请选择你的身份</div>
          <div className="role-grid">
            <button className={`role-card ${role==='student'?'selected':''}`} type="button" onClick={()=>setRole('student')} aria-pressed={role==='student'}><GraduationCap/><span><strong>我是学生</strong><small>寻找周末兼职</small></span>{role==='student'&&<Check className="selected-check"/>}</button>
            <button className={`role-card ${role==='merchant'?'selected':''}`} type="button" onClick={()=>setRole('merchant')} aria-pressed={role==='merchant'}><Store/><span><strong>我是商家</strong><small>发布短期工作</small></span>{role==='merchant'&&<Check className="selected-check"/>}</button>
          </div>
          <p className="role-note"><ShieldCheck size={16}/> 身份仅在首次注册时生效，稍后不可直接切换</p>
          <button className="primary full" type="submit" disabled={submitting}>{submitting ? '处理中…' : '登录 / 注册'}</button>
        </form>
      </div>
      <div className="route-art" aria-hidden="true">
        <div className="place campus"><GraduationCap size={44}/><span>校园</span></div>
        <svg viewBox="0 0 500 260"><path d="M82 90 C180 25, 195 210, 305 120 S410 80, 440 160"/><circle cx="82" cy="90" r="7"/><circle cx="440" cy="160" r="7"/></svg>
        <div className="place shop"><Store size={44}/><span>商家</span></div>
        <p>从校园出发，找到附近可信的周末机会</p>
      </div>
    </section>
  </main>;
}

const studentNav = [
  ['jobs', Search, '找兼职'], ['applications', FileText, '我的申请'], ['verify', ShieldCheck, '身份认证'], ['profile', CircleUserRound, '我的']
];

function Shell({ role, page, setPage, children, onLogout }) {
  const nav = role === 'student' ? studentNav : [
    ['jobs', BriefcaseBusiness, '岗位管理'], ['applicants', UsersRound, '申请者'], ['verify', ShieldCheck, '身份认证']
  ];
  return <div className={`app-shell ${role}`}>
    <header className="app-header"><Brand/><nav>{nav.map(([key,,label])=><button key={key} onClick={()=>setPage(key)} className={page===key?'active':''}>{label}</button>)}</nav><div className="account"><Bell size={20}/><button onClick={onLogout}>{role==='student'?'林同学':'陈店长'} <ChevronDown size={16}/></button></div></header>
    <aside className="side-nav"><Brand/>{nav.map(([key,Icon,label])=><button key={key} onClick={()=>setPage(key)} className={page===key?'active':''}><Icon size={20}/>{label}</button>)}</aside>
    <div className="app-content" id="main-content">{children}</div>
    <nav className="bottom-nav" aria-label="主要导航">{nav.map(([key,Icon,label])=><button key={key} onClick={()=>setPage(key)} className={page===key?'active':''}><Icon size={21}/><span>{label}</span></button>)}</nav>
  </div>;
}

function Notice({ verified, role, onVerify }) {
  return <div className={`notice ${verified?'success':''}`}><span><ShieldCheck size={21}/>{verified ? `${role==='student'?'学生':'商家'}身份已通过认证` : `${role==='student'?'完成学生认证后即可申请':'商家认证审核中，审核通过后可发布岗位'}`}</span><button onClick={onVerify}>{verified?'查看认证':'去认证'} <ChevronRight size={16}/></button></div>;
}

function JobRow({ job, active, onSelect }) {
  return <button className={`job-row ${active?'active':''}`} onClick={onSelect}>
    <img src={asset(job.image)} alt="" width="112" height="84"/>
    <span className="job-main"><span className="job-heading"><strong>{job.title}</strong><ChevronRight size={19}/></span><span>{job.merchant} <Status>商家已认证</Status></span><span className="job-meta"><span><CalendarDays/> {job.time}</span><span><MapPin/> {job.distance}</span><span><WalletCards/> ¥{job.pay}/小时</span><span><UsersRound/> 剩余 {job.slots} 人</span></span></span>
  </button>;
}

function JobDetail({ job, verified, applied, onApply }) {
  return <aside className="detail-panel">
    <img className="detail-image" src={asset(job.image)} alt={`${job.merchant}工作环境`} />
    <div className="detail-body"><div className="title-line"><h2>{job.title}</h2><Status>商家已认证</Status></div><p>{job.merchant} · {job.distance}</p>
      <div className="pay-line"><strong>¥{job.pay}/小时</strong><span>剩余 {job.slots} 人</span></div>
      <div className="detail-facts"><span><CalendarDays/> {job.time}</span><span><MapPin/> {job.address}</span></div>
      <h3>岗位描述</h3><p>{job.description}</p><h3>任职要求</h3><ul>{job.requirements.map(x=><li key={x}>{x}</li>)}</ul>
      <div className="merchant-line"><span className="merchant-avatar"><Store/></span><span><small>招聘商家</small><strong>{job.merchant}</strong></span><Status>商家已认证</Status></div>
      <button className="primary full" disabled={!verified||applied} onClick={onApply}>{applied?'申请已提交':verified?'申请这份工作':'完成学生认证后即可申请'}</button>
    </div>
  </aside>;
}

const JOB_TYPES = ['全部类型', '餐饮服务', '活动协助', '门店整理', '促销派单'];
const JOB_DAYS = ['本周末', '周六', '周日'];
const DISTANCES = ['不限距离', '1公里内', '3公里内', '5公里内'];
const SORTS = ['距离优先', '薪资从高到低', '薪资从低到高'];
const distanceLimit = { '不限距离': Infinity, '1公里内': 1, '3公里内': 3, '5公里内': 5 };

function FilterDropdown({ icon: Icon, value, options, onChange, active }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return <div className="filter-dd" ref={ref}>
    <button type="button" className={active ? 'active' : ''} aria-haspopup="listbox" aria-expanded={open} onClick={()=>setOpen(o=>!o)}><Icon/>{value}<ChevronDown/></button>
    {open && <ul className="filter-menu" role="listbox">
      {options.map(opt => <li key={opt} role="option" aria-selected={opt===value} className={opt===value?'selected':''} onClick={()=>{ onChange(opt); setOpen(false); }}>{opt}{opt===value && <Check size={15}/>}</li>)}
    </ul>}
  </div>;
}

function StudentHome({ state, update, setPage }) {
  const [selectedId, setSelectedId] = useState(seedJobs[0].id);
  const [query, setQuery] = useState('');
  const [day, setDay] = useState('本周末');
  const [distance, setDistance] = useState('不限距离');
  const [sort, setSort] = useState('距离优先');
  const [type, setType] = useState('全部类型');
  const [coords, setCoords] = useState(null); // 用户授权后的真实位置
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  const located = !!coords;
  const origin = coords || CAMPUS;

  // 以“你的位置”为中心展示附近岗位：距离沿用数据中的设定值（合理区间），
  // 定位只切换“距学校/距我”的口径，避免固定远点坐标导致距离失真、列表被清空。
  const sourceJobs = useMemo(() => seedJobs.map(j => ({
    ...j,
    distance: `${located ? '距我' : '距学校'} ${j.distanceKm.toFixed(1)} km`,
  })), [located]);

  const jobs = useMemo(() => {
    let list = sourceJobs.filter(j => (j.title + j.merchant).includes(query));
    if (day !== '本周末') list = list.filter(j => j.day === day);
    if (type !== '全部类型') list = list.filter(j => j.type === type);
    const lim = distanceLimit[distance];
    if (lim !== Infinity) list = list.filter(j => j.distanceKm <= lim);
    return [...list].sort((a, b) => {
      if (sort === '薪资从高到低') return b.pay - a.pay;
      if (sort === '薪资从低到高') return a.pay - b.pay;
      return a.distanceKm - b.distanceKm;
    });
  }, [sourceJobs, query, day, distance, sort, type]);

  const locate = () => {
    if (!navigator.geolocation) { setGeoError('当前浏览器不支持定位'); return; }
    setLocating(true); setGeoError('');
    navigator.geolocation.getCurrentPosition(
      pos => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      err => { setGeoError(err.code === 1 ? '定位权限被拒绝，可在浏览器地址栏重新授权' : '定位失败，请重试'); setLocating(false); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const selected = sourceJobs.find(j => j.id === selectedId) || sourceJobs[0];
  const applied = state.applications.includes(selected.id);
  return <>
    <div className="page-heading"><span>你好，同学</span><h1>这个周末，找份离你更近的工作</h1></div>
    <div className="search-box"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="搜索岗位或商家" placeholder="搜索岗位或商家"/></div>
    <button type="button" className={`loc-bar ${located ? 'active' : ''}`} onClick={locate} disabled={locating}>
      <MapPin size={17}/>
      <span>{locating ? '定位中…' : located ? `已以你的位置为中心 · ${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}` : '开启定位，优先显示离你最近的兼职'}</span>
      {!located && !locating && <ChevronRight size={16}/>}
    </button>
    {geoError && <p className="form-error" role="alert">{geoError}</p>}
    <div className="filters">
      <FilterDropdown icon={CalendarDays} value={day} options={JOB_DAYS} onChange={setDay} active={day!=='本周末'}/>
      <FilterDropdown icon={MapPin} value={distance} options={DISTANCES} onChange={setDistance} active={distance!=='不限距离'}/>
      <FilterDropdown icon={WalletCards} value={sort} options={SORTS} onChange={setSort} active={sort!=='距离优先'}/>
      <FilterDropdown icon={LayoutList} value={type} options={JOB_TYPES} onChange={setType} active={type!=='全部类型'}/>
    </div>
    <Notice verified={state.verified} role="student" onVerify={()=>setPage('verify')}/>
    <div className="student-grid"><section className="job-list" aria-label="兼职列表">{jobs.map(j=><JobRow key={j.id} job={j} active={selected.id===j.id} onSelect={()=>setSelectedId(j.id)}/>)}{!jobs.length&&<div className="empty"><Search/><h2>没有找到相关岗位</h2><p>换个关键词或筛选条件试试看。</p></div>}</section><JobDetail job={selected} verified={state.verified} applied={applied} onApply={()=>update(s=>({...s,applications:[...s.applications,selected.id]}))}/></div>
  </>;
}

function Verification({ role, state, update }) {
  const isStudent = role === 'student';
  const verified = isStudent ? state.verified : state.merchantStatus === 'verified';
  const [submitted, setSubmitted] = useState(!isStudent && state.merchantStatus === 'pending');
  const submit = e => { e.preventDefault(); setSubmitted(true); if(isStudent) update(s=>({...s,verified:true})); else update(s=>({...s,merchantStatus:'pending'})); };
  return <section className="form-page"><div className="page-heading"><span>身份认证</span><h1>{isStudent?'验证在校身份':'验证真实经营主体'}</h1><p>{isStudent?'认证信息仅用于平台审核，商家无法查看你的证件原图。':'通过认证后才能发布岗位，学生只会看到认证结果。'}</p></div>
    {verified ? <div className="verified-state"><ShieldCheck/><h2>身份认证已通过</h2><p>你现在可以使用完整的平台功能。</p></div> : submitted && !isStudent ? <div className="verified-state pending"><Clock3/><h2>资料正在审核</h2><p>这是演示流程，审核状态会保存在本机浏览器。</p><button className="secondary" onClick={()=>update(s=>({...s,merchantStatus:'verified'}))}>模拟审核通过</button></div> :
    <form className="verification-form" onSubmit={submit}>
      <div className="form-grid">
        <label>{isStudent?'姓名':'商户名称'}<input required defaultValue={isStudent?'林小满':'青禾咖啡（静安店）'}/></label>
        <label>{isStudent?'学校':'联系人'}<input required defaultValue={isStudent?'海城大学':'陈店长'}/></label>
        <label>{isStudent?'学号':'联系电话'}<input required defaultValue={isStudent?'2026010238':'138 0000 8888'}/></label>
        <label>{isStudent?'入学年份':'经营地址'}<input required defaultValue={isStudent?'2024':'大学城文汇路 88 号'}/></label>
      </div>
      <label className="upload-box"><Upload/><strong>上传{isStudent?'学生证':'营业执照'}照片</strong><span>演示版不会上传真实文件，点击即可模拟选择</span><input type="file" accept="image/*"/></label>
      <label className="consent"><input type="checkbox" required/>我确认提交的信息真实有效，并同意仅用于平台身份审核</label>
      <button className="primary" type="submit">提交认证</button>
    </form>}
  </section>;
}

function Applications({ state }) {
  const jobs = seedJobs.filter(j=>state.applications.includes(j.id));
  return <section><div className="page-heading"><span>我的申请</span><h1>跟进每一次申请</h1></div>{jobs.length?<div className="application-list">{jobs.map(j=><div className="application-row" key={j.id}><img src={asset(j.image)} alt=""/><span><strong>{j.title}</strong><small>{j.merchant} · {j.time}</small></span><Status tone="amber">等待商家确认</Status></div>)}</div>:<div className="empty"><FileText/><h2>还没有申请记录</h2><p>完成身份认证后，去发现合适的周末工作。</p></div>}</section>;
}

function PublishDrawer({ onClose, onSave, initial, title = '发布新岗位' }) {
  const v = initial || {};
  const submit = e => { e.preventDefault(); const data = new FormData(e.currentTarget); onSave(Object.fromEntries(data)); };
  return <div className="drawer-backdrop" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="publish-title"><header><h2 id="publish-title">{title}</h2><button onClick={onClose} aria-label="关闭"><X/></button></header><form onSubmit={submit}>
    <label>岗位名称<input name="title" required defaultValue={v.title ?? '咖啡店周末店员'}/></label><label>工作类型<select name="type" defaultValue={v.type ?? '餐饮服务'}><option>餐饮服务</option><option>活动协助</option><option>门店整理</option><option>促销派单</option></select></label>
    <label>工作日期<input name="date" type="date" required defaultValue={v.date ?? '2026-10-17'}/></label><div className="form-grid"><label>开始时间<input name="start" type="time" defaultValue={v.start ?? '10:00'}/></label><label>结束时间<input name="end" type="time" defaultValue={v.end ?? '18:00'}/></label><label>时薪<input name="pay" type="number" defaultValue={v.pay ?? 22}/></label><label>招聘人数<input name="slots" type="number" defaultValue={v.slots ?? 4}/></label></div>
    <label>工作地址<input name="address" defaultValue={v.address ?? '大学城文汇路 88 号'}/></label><label>岗位描述<textarea name="description" rows="4" defaultValue={v.description ?? '负责门店日常协助、顾客接待与环境整理。'}/></label><label>任职要求<textarea name="requirements" rows="3" defaultValue={v.requirements ?? '年满 18 周岁，周末可到岗，认真负责。'}/></label>
    <footer><button type="button" className="secondary" onClick={onClose}>取消</button><button className="primary" type="submit">{initial ? '保存修改' : '发布岗位'}</button></footer>
  </form></aside></div>;
}

const MERCHANT_TABS = ['招聘中', '草稿', '已结束'];
const baseMerchantJobs = [
  { title:'咖啡店周末店员', time:'周六 10:00–18:00', pay:22, hired:'2/4 已录用', applicants:'6 人申请', status:'招聘中', _idx:-1 },
  { title:'奶茶店周末兼职', time:'周日 12:00–20:00', pay:23, hired:'1/3 已录用', applicants:'4 人申请', status:'招聘中', _idx:-1 },
  { title:'书展现场引导', time:'周六 09:00–17:00', pay:24, hired:'3/8 已录用', applicants:'9 人申请', status:'招聘中', _idx:-1 },
  { title:'周末外卖打包员', time:'周日 11:00–14:00', pay:21, hired:'0/2 已录用', applicants:'3 人申请', status:'招聘中', _idx:-1 },
  { title:'国庆市集临时工', time:'周日 09:00–17:00', pay:25, hired:'0/6 已录用', applicants:'草稿未发布', status:'草稿', _idx:-1 },
  { title:'门店盘点助理', time:'周六 18:00–21:00', pay:19, hired:'0/3 已录用', applicants:'草稿未发布', status:'草稿', _idx:-1 },
  { title:'中秋门店促销', time:'已于上周结束', pay:20, hired:'4/4 已录用', applicants:'已完成', status:'已结束', _idx:-1 },
  { title:'迎新季传单派发', time:'已于两周前结束', pay:21, hired:'6/6 已录用', applicants:'已完成', status:'已结束', _idx:-1 },
];

function MerchantHome({ state, update, setPage }) {
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null); // { job, index }
  const [tab, setTab] = useState('招聘中');
  const verified = state.merchantStatus === 'verified';
  const jobs = [...baseMerchantJobs, ...state.merchantJobs.map((j, i) => ({ ...j, status:'招聘中', _idx:i }))];
  const counts = MERCHANT_TABS.reduce((m, t) => ({ ...m, [t]: jobs.filter(j => j.status === t).length }), {});
  const shown = jobs.filter(j => j.status === tab);
  const openEdit = job => { setEditing({ job, index: job._idx }); setDrawer(true); };
  const saveJob = data => {
    update(s => {
      if (editing && editing.index >= 0) {
        const copy = [...s.merchantJobs];
        copy[editing.index] = { ...copy[editing.index], ...data };
        return { ...s, merchantJobs: copy };
      }
      if (editing) return s; // 编辑的是示例岗位，演示环境不持久化
      return { ...s, merchantJobs: [...s.merchantJobs, { ...data, hired:'0/'+data.slots+' 已录用', applicants:'0 人申请' }] };
    });
    setDrawer(false); setEditing(null);
  };
  return <><Notice verified={verified} role="merchant" onVerify={()=>setPage('verify')}/><div className="merchant-heading"><div className="page-heading"><span>下午好，陈店长</span><h1>周末用工，一处安排</h1><p>轻松发布周末岗位，快速找到合适的搭子。</p></div><button className="primary" disabled={!verified} onClick={()=>{setEditing(null);setDrawer(true);}}>发布新岗位</button></div>
    <div className="tabs">{MERCHANT_TABS.map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t} <span>{counts[t]}</span></button>)}</div>
    <div className="merchant-jobs">{shown.length ? shown.map((j,i)=><article key={i}><header><h2>{j.title}</h2><Status tone={j.status==='招聘中'?'green':'amber'}>{j.status}</Status></header><div className="merchant-meta"><span><CalendarDays/> {j.time||j.date}</span><span><WalletCards/> ¥{j.pay}/小时</span><span><UsersRound/> {j.hired}</span><span><FileText/> {j.applicants}</span></div><footer><button className="secondary" onClick={()=>setPage('applicants')}>查看申请者</button><button className="secondary" onClick={()=>openEdit(j)}>编辑岗位</button></footer></article>) : <div className="empty"><BriefcaseBusiness/><h2>这里还没有岗位</h2><p>切换其它标签，或点击右上角发布新岗位。</p></div>}</div>
    {drawer&&<PublishDrawer initial={editing?.job} title={editing?'编辑岗位':'发布新岗位'} onClose={()=>{setDrawer(false);setEditing(null);}} onSave={saveJob}/>}</>;
}

const seedApplicants = [
  { id:1, name:'林小满', school:'海城大学 · 会展经济', job:'咖啡店周末店员', note:'有两次咖啡店兼职经验', status:'待确认' },
  { id:2, name:'赵之航', school:'海城大学 · 市场营销', job:'展会活动协助', note:'周末全天可到岗', status:'待确认' },
  { id:3, name:'周可欣', school:'海城职院 · 学前教育', job:'书店整理员', note:'细心耐心，喜欢阅读', status:'待确认' },
  { id:4, name:'吴鸿博', school:'海城大学 · 计算机', job:'书展现场引导', note:'做过展会志愿者', status:'待确认' },
  { id:5, name:'钱思彤', school:'海城师范 · 汉语言', job:'奶茶店周末兼职', note:'手脚麻利，能排早班', status:'待确认' },
  { id:6, name:'孙佳一', school:'海城职院 · 市场营销', job:'周末外卖打包员', note:'住校，离店近', status:'已录用' },
  { id:7, name:'郑雨桐', school:'海城大学 · 工商管理', job:'咖啡店周末店员', note:'仅周日有空', status:'已拒绝' },
];

function Applicants() {
  const [list, setList] = useState(seedApplicants.map(a => ({ ...a })));
  const setStatus = (id, status) => setList(l => l.map(a => a.id === id ? { ...a, status } : a));
  return <section><div className="page-heading"><span>申请者</span><h1>查看并确认报名</h1></div>
    <div className="application-list">{list.map(a=><div className="application-row applicant" key={a.id}>
      <span className="profile-avatar"><CircleUserRound size={26}/></span>
      <span className="applicant-main"><strong>{a.name}</strong><small>{a.school}</small><small>报名：{a.job} · {a.note}</small></span>
      {a.status==='待确认'
        ? <span className="applicant-actions"><button className="secondary" onClick={()=>setStatus(a.id,'已拒绝')}>拒绝</button><button className="primary" onClick={()=>setStatus(a.id,'已录用')}>录用</button></span>
        : <Status tone={a.status==='已录用'?'green':'amber'}>{a.status}</Status>}
    </div>)}</div>
  </section>;
}

function Profile({ role, state, setPage, onLogout }) {
  const user = getCurrentUser();
  const email = user?.email || user?.username || '已登录用户';
  const verified = role === 'student' ? state.verified : state.merchantStatus === 'verified';
  const appCount = state.applications?.length || 0;
  return <section className="form-page">
    <div className="page-heading"><span>我的</span><h1>个人中心</h1></div>
    <div className="profile-card">
      <div className="profile-id">
        <span className="profile-avatar"><CircleUserRound size={30}/></span>
        <div><strong>{email}</strong><small>{role === 'student' ? '学生用户' : '商家用户'}</small></div>
        <Status tone={verified ? 'green' : 'amber'}>{verified ? '已认证' : '未认证'}</Status>
      </div>
      <ul className="profile-list">
        <li><button onClick={()=>setPage('verify')}><ShieldCheck size={18}/><span>身份认证</span><small>{verified ? '已通过' : '去认证'}</small><ChevronRight size={18}/></button></li>
        {role === 'student' && <li><button onClick={()=>setPage('applications')}><FileText size={18}/><span>我的申请</span><small>{appCount} 条</small><ChevronRight size={18}/></button></li>}
      </ul>
      <button className="secondary full" onClick={onLogout}>退出登录</button>
    </div>
  </section>;
}

function AuthedApp({ session, onLogout }) {
  const [state, setState] = usePersistedState(session.uid);
  const [page, setPage] = useState('jobs');
  const update = fn => setState(fn);
  const role = session.role;
  return <Shell role={role} page={page} setPage={setPage} onLogout={onLogout}>
    {role==='student' ? (page==='jobs'?<StudentHome state={state} update={update} setPage={setPage}/>:page==='applications'?<Applications state={state}/>:page==='verify'?<Verification role="student" state={state} update={update}/>:page==='profile'?<Profile role="student" state={state} setPage={setPage} onLogout={onLogout}/>:<StudentHome state={state} update={update} setPage={setPage}/>) : (page==='jobs'?<MerchantHome state={state} update={update} setPage={setPage}/>:page==='verify'?<Verification role="merchant" state={state} update={update}/>:page==='applicants'?<Applicants/>:<MerchantHome state={state} update={update} setPage={setPage}/>)}
  </Shell>;
}

export default function App() {
  // 启动时读取 CloudBase 登录态；已登录则直接进入应用
  const [session, setSession] = useState(() => {
    const u = getCurrentUser();
    if (!u) return null;
    return { uid: u.uid, role: localStorage.getItem(roleKey(u.uid)) || 'student' };
  });

  const handleLogout = async () => {
    await logout();
    setSession(null);
  };

  if (!session) return <Login onAuthed={setSession}/>;
  return <AuthedApp session={session} onLogout={handleLogout}/>;
}
