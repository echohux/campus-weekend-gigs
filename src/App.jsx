import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Bell, BookOpen, BriefcaseBusiness, Building2, CalendarDays, Check,
  ChevronDown, ChevronRight, CircleUserRound, Clock3, FileCheck2, FileText,
  GraduationCap, HeartHandshake, IdCard, LayoutList, MapPin, Search, ShieldCheck,
  Store, Upload, UsersRound, WalletCards, X
} from 'lucide-react';
import { seedJobs } from './data/jobs';

const STORAGE_KEY = 'weekend-buddy-mvp-v1';
const defaults = { loggedIn: false, role: 'student', verified: false, applications: [], merchantStatus: 'pending', merchantJobs: [] };

function usePersistedState() {
  const [state, setState] = useState(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }; }
    catch { return defaults; }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), [state]);
  return [state, setState];
}

function Brand() {
  return <div className="brand"><span className="brand-mark"><HeartHandshake size={26}/></span><span>周末搭子</span></div>;
}

function Status({ children, tone = 'green' }) {
  return <span className={`status status-${tone}`}><Check size={13}/>{children}</span>;
}

function Login({ onLogin }) {
  const [role, setRole] = useState('student');
  const [account, setAccount] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const submit = (event) => {
    event.preventDefault();
    if (!account.trim() || !code.trim()) { setError('请输入账号和任意 4 位演示验证码'); return; }
    onLogin(role);
  };
  return <main className="login-shell">
    <header className="login-header"><Brand/><nav><a href="#about">关于平台</a><a href="#safety">安全说明</a></nav></header>
    <section className="login-layout">
      <div className="auth-panel">
        <button className="text-back" type="button" aria-label="返回"><ArrowLeft size={19}/> 安全、透明的周末兼职</button>
        <h1>登录你的周末计划</h1>
        <p className="lead">认证学生和真实商家，在更近的地方找到更合适的周末安排。</p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="account">手机号或邮箱</label>
          <input id="account" value={account} onChange={e=>setAccount(e.target.value)} placeholder="请输入手机号或邮箱" autoComplete="username" />
          <label htmlFor="code">验证码</label>
          <div className="input-action"><input id="code" value={code} onChange={e=>setCode(e.target.value)} placeholder="输入任意 4 位数字" inputMode="numeric"/><button type="button">获取验证码</button></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="role-label">首次使用？请选择你的身份</div>
          <div className="role-grid">
            <button className={`role-card ${role==='student'?'selected':''}`} type="button" onClick={()=>setRole('student')} aria-pressed={role==='student'}><GraduationCap/><span><strong>我是学生</strong><small>寻找周末兼职</small></span>{role==='student'&&<Check className="selected-check"/>}</button>
            <button className={`role-card ${role==='merchant'?'selected':''}`} type="button" onClick={()=>setRole('merchant')} aria-pressed={role==='merchant'}><Store/><span><strong>我是商家</strong><small>发布短期工作</small></span>{role==='merchant'&&<Check className="selected-check"/>}</button>
          </div>
          <p className="role-note"><ShieldCheck size={16}/> 身份稍后不可直接切换</p>
          <button className="primary full" type="submit">登录 / 注册</button>
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
    <img src={job.image} alt="" width="112" height="84"/>
    <span className="job-main"><span className="job-heading"><strong>{job.title}</strong><ChevronRight size={19}/></span><span>{job.merchant} <Status>商家已认证</Status></span><span className="job-meta"><span><CalendarDays/> {job.time}</span><span><MapPin/> {job.distance}</span><span><WalletCards/> ¥{job.pay}/小时</span><span><UsersRound/> 剩余 {job.slots} 人</span></span></span>
  </button>;
}

function JobDetail({ job, verified, applied, onApply }) {
  return <aside className="detail-panel">
    <img className="detail-image" src={job.image} alt={`${job.merchant}工作环境`} />
    <div className="detail-body"><div className="title-line"><h2>{job.title}</h2><Status>商家已认证</Status></div><p>{job.merchant} · {job.distance}</p>
      <div className="pay-line"><strong>¥{job.pay}/小时</strong><span>剩余 {job.slots} 人</span></div>
      <div className="detail-facts"><span><CalendarDays/> {job.time}</span><span><MapPin/> {job.address}</span></div>
      <h3>岗位描述</h3><p>{job.description}</p><h3>任职要求</h3><ul>{job.requirements.map(x=><li key={x}>{x}</li>)}</ul>
      <div className="merchant-line"><span className="merchant-avatar"><Store/></span><span><small>招聘商家</small><strong>{job.merchant}</strong></span><Status>商家已认证</Status></div>
      <button className="primary full" disabled={!verified||applied} onClick={onApply}>{applied?'申请已提交':verified?'申请这份工作':'完成学生认证后即可申请'}</button>
    </div>
  </aside>;
}

function StudentHome({ state, update, setPage }) {
  const [selected, setSelected] = useState(seedJobs[0]);
  const [query, setQuery] = useState('');
  const jobs = useMemo(()=>seedJobs.filter(j=>(j.title+j.merchant).includes(query)),[query]);
  const applied = state.applications.includes(selected.id);
  return <>
    <div className="page-heading"><span>你好，林同学</span><h1>这个周末，找份离你更近的工作</h1></div>
    <div className="search-box"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="搜索岗位或商家" placeholder="搜索岗位或商家"/></div>
    <div className="filters"><button><CalendarDays/>本周末<ChevronDown/></button><button><MapPin/>3公里内<ChevronDown/></button><button><WalletCards/>薪资从高到低<ChevronDown/></button><button><LayoutList/>全部类型<ChevronDown/></button></div>
    <Notice verified={state.verified} role="student" onVerify={()=>setPage('verify')}/>
    <div className="student-grid"><section className="job-list" aria-label="兼职列表">{jobs.map(j=><JobRow key={j.id} job={j} active={selected.id===j.id} onSelect={()=>setSelected(j)}/>)}{!jobs.length&&<div className="empty"><Search/><h2>没有找到相关岗位</h2><p>换个关键词试试看。</p></div>}</section><JobDetail job={selected} verified={state.verified} applied={applied} onApply={()=>update(s=>({...s,applications:[...s.applications,selected.id]}))}/></div>
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
  return <section><div className="page-heading"><span>我的申请</span><h1>跟进每一次申请</h1></div>{jobs.length?<div className="application-list">{jobs.map(j=><div className="application-row" key={j.id}><img src={j.image} alt=""/><span><strong>{j.title}</strong><small>{j.merchant} · {j.time}</small></span><Status tone="amber">等待商家确认</Status></div>)}</div>:<div className="empty"><FileText/><h2>还没有申请记录</h2><p>完成身份认证后，去发现合适的周末工作。</p></div>}</section>;
}

function PublishDrawer({ onClose, onSave }) {
  const submit = e => { e.preventDefault(); const data = new FormData(e.currentTarget); onSave(Object.fromEntries(data)); };
  return <div className="drawer-backdrop" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="publish-title"><header><h2 id="publish-title">发布新岗位</h2><button onClick={onClose} aria-label="关闭"><X/></button></header><form onSubmit={submit}>
    <label>岗位名称<input name="title" required defaultValue="咖啡店周末店员"/></label><label>工作类型<select name="type" defaultValue="餐饮服务"><option>餐饮服务</option><option>活动协助</option><option>门店整理</option></select></label>
    <label>工作日期<input name="date" type="date" required defaultValue="2026-10-17"/></label><div className="form-grid"><label>开始时间<input name="start" type="time" defaultValue="10:00"/></label><label>结束时间<input name="end" type="time" defaultValue="18:00"/></label><label>时薪<input name="pay" type="number" defaultValue="22"/></label><label>招聘人数<input name="slots" type="number" defaultValue="4"/></label></div>
    <label>工作地址<input name="address" defaultValue="大学城文汇路 88 号"/></label><label>岗位描述<textarea name="description" rows="4" defaultValue="负责门店日常协助、顾客接待与环境整理。"/></label><label>任职要求<textarea name="requirements" rows="3" defaultValue="年满 18 周岁，周末可到岗，认真负责。"/></label>
    <footer><button type="button" className="secondary" onClick={onClose}>保存草稿</button><button className="primary" type="submit">发布岗位</button></footer>
  </form></aside></div>;
}

function MerchantHome({ state, update, setPage }) {
  const [drawer, setDrawer] = useState(false);
  const verified = state.merchantStatus === 'verified';
  const jobs = [{ title:'咖啡店周末店员', time:'周六 10:00–18:00', pay:22, hired:'2/4 已录用', applicants:'6 人申请' }, ...state.merchantJobs];
  const saveJob = data => { update(s=>({...s,merchantJobs:[...s.merchantJobs,{...data,hired:'0/'+data.slots+' 已录用',applicants:'0 人申请'}]})); setDrawer(false); };
  return <><Notice verified={verified} role="merchant" onVerify={()=>setPage('verify')}/><div className="merchant-heading"><div className="page-heading"><span>下午好，陈店长</span><h1>周末用工，一处安排</h1><p>轻松发布周末岗位，快速找到合适的搭子。</p></div><button className="primary" disabled={!verified} onClick={()=>setDrawer(true)}>发布新岗位</button></div>
    <div className="tabs"><button className="active">招聘中 <span>{jobs.length}</span></button><button>草稿 <span>0</span></button><button>已结束 <span>0</span></button></div>
    <div className="merchant-jobs">{jobs.map((j,i)=><article key={i}><header><h2>{j.title}</h2><Status>招聘中</Status></header><div className="merchant-meta"><span><CalendarDays/> {j.time||j.date}</span><span><WalletCards/> ¥{j.pay}/小时</span><span><UsersRound/> {j.hired}</span><span><FileText/> {j.applicants}</span></div><footer><button className="secondary">查看申请者</button><button className="secondary">编辑岗位</button></footer></article>)}</div>
    {drawer&&<PublishDrawer onClose={()=>setDrawer(false)} onSave={saveJob}/>}</>;
}

export default function App() {
  const [state, setState] = usePersistedState();
  const [page, setPage] = useState('jobs');
  const update = fn => setState(fn);
  if (!state.loggedIn) return <Login onLogin={role=>setState({...defaults,loggedIn:true,role,merchantStatus:role==='merchant'?'pending':'pending'})}/>;
  return <Shell role={state.role} page={page} setPage={setPage} onLogout={()=>setState({...defaults})}>
    {state.role==='student' ? (page==='jobs'?<StudentHome state={state} update={update} setPage={setPage}/>:page==='applications'?<Applications state={state}/>:page==='verify'?<Verification role="student" state={state} update={update}/>:<Verification role="student" state={state} update={update}/>) : (page==='jobs'?<MerchantHome state={state} update={update} setPage={setPage}/>:page==='verify'?<Verification role="merchant" state={state} update={update}/>:<Applications state={{applications:[]}}/>)}
  </Shell>;
}
