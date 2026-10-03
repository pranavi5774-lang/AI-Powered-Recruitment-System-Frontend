import { mountMatchScene } from './match-scene.js'
import { apiLogin, apiRegister, apiRequest, getApiBaseUrl, normalizeList, setApiBaseUrl } from './api.js'
import { demoAccounts, demoPassword, getSession, registerDemo, saveSession, signIn, signOut } from './auth.js'

const app = document.querySelector('#app')
const themeStorageKey = 'nexahire-theme'

const candidates = [
  { id: 1, name: 'Aarav Mehta', initials: 'AM', role: 'Product Designer', email: 'aarav.mehta@email.com', applied: 'Today, 10:42 AM', score: 96, status: 'Interview', skills: ['Figma', 'Design systems', 'Research'], color: 'mint' },
  { id: 2, name: 'Isha Kulkarni', initials: 'IK', role: 'Frontend Developer', email: 'isha.k@email.com', applied: 'Today, 09:18 AM', score: 92, status: 'Review', skills: ['React', 'JavaScript', 'CSS'], color: 'lilac' },
  { id: 3, name: 'Kabir Shah', initials: 'KS', role: 'Data Analyst', email: 'kabir.shah@email.com', applied: 'Yesterday', score: 88, status: 'Shortlisted', skills: ['SQL', 'Python', 'Tableau'], color: 'peach' },
  { id: 4, name: 'Ananya Rao', initials: 'AR', role: 'Frontend Developer', email: 'ananya.rao@email.com', applied: 'Yesterday', score: 84, status: 'Review', skills: ['Vue', 'TypeScript', 'Testing'], color: 'blue' },
  { id: 5, name: 'Rehan Siddiqui', initials: 'RS', role: 'Product Designer', email: 'rehan.s@email.com', applied: 'Oct 01, 2026', score: 79, status: 'Review', skills: ['Figma', 'Prototyping', 'UI'], color: 'yellow' },
  { id: 6, name: 'Mira Desai', initials: 'MD', role: 'Data Analyst', email: 'mira.desai@email.com', applied: 'Sep 30, 2026', score: 76, status: 'Shortlisted', skills: ['Excel', 'SQL', 'Power BI'], color: 'rose' },
  { id: 7, name: 'Dev Patel', initials: 'DP', role: 'Frontend Developer', email: 'dev.p@email.com', applied: 'Sep 29, 2026', score: 71, status: 'Review', skills: ['HTML', 'JavaScript', 'Git'], color: 'mint' },
]

const jobs = [
  { id: 101, title: 'Frontend Developer', department: 'Engineering', type: 'Full-time', location: 'Pune, Hybrid', applicants: 48, status: 'Active', icon: 'code-slash', color: 'green' },
  { id: 102, title: 'Product Designer', department: 'Design', type: 'Full-time', location: 'Remote', applicants: 36, status: 'Active', icon: 'pen-tool', color: 'coral' },
  { id: 103, title: 'Data Analyst', department: 'Analytics', type: 'Full-time', location: 'Pune, On-site', applicants: 29, status: 'Active', icon: 'bar-chart-line', color: 'blue' },
  { id: 104, title: 'HR Operations Associate', department: 'People', type: 'Full-time', location: 'Pune, Hybrid', applicants: 17, status: 'Draft', icon: 'people', color: 'yellow' },
]

const employees = [
  { name: 'Priya Nair', initials: 'PN', department: 'People', role: 'HR Manager', attendance: 'Present', leave: 'None', color: 'peach' },
  { name: 'Rohan Deshmukh', initials: 'RD', department: 'Engineering', role: 'Software Engineer', attendance: 'Present', leave: 'None', color: 'blue' },
  { name: 'Sneha Joshi', initials: 'SJ', department: 'Design', role: 'UI Designer', attendance: 'Remote', leave: 'None', color: 'rose' },
  { name: 'Arjun Kapoor', initials: 'AK', department: 'Analytics', role: 'Data Analyst', attendance: 'On leave', leave: 'Oct 02-03', color: 'mint' },
  { name: 'Nisha Verma', initials: 'NV', department: 'Engineering', role: 'QA Engineer', attendance: 'Present', leave: 'None', color: 'lilac' },
]

const leaveRequests = [
  { name: 'Arjun Kapoor', initials: 'AK', department: 'Analytics', dates: 'Oct 02 - Oct 03', days: '2 days', type: 'Casual leave', reason: 'Family commitment', status: 'Pending', color: 'mint' },
  { name: 'Sneha Joshi', initials: 'SJ', department: 'Design', dates: 'Oct 08 - Oct 10', days: '3 days', type: 'Earned leave', reason: 'Personal travel', status: 'Pending', color: 'rose' },
  { name: 'Rohan Deshmukh', initials: 'RD', department: 'Engineering', dates: 'Oct 12', days: '1 day', type: 'Sick leave', reason: 'Medical appointment', status: 'Approved', color: 'blue' },
]

const candidateApplications = [
  { title: 'Product Designer', department: 'Design', applied: 'Sep 29, 2026', status: 'Interview', resume: 'Aarav_Mehta_Resume.pdf' },
  { title: 'UX Researcher', department: 'Design', applied: 'Sep 25, 2026', status: 'Review', resume: 'Aarav_Mehta_Resume.pdf' },
]

const roleNavigation = {
  'HR administrator': [
    { label: 'Overview', icon: 'grid-1x2' },
    { label: 'Match studio', icon: 'boxes' },
    { label: 'Candidates', icon: 'people' },
    { label: 'Job openings', icon: 'briefcase' },
    { label: 'Employees', icon: 'person-vcard' },
    { label: 'Leave requests', icon: 'calendar2-check' },
  ],
  Candidate: [
    { label: 'Find jobs', icon: 'search' },
    { label: 'My applications', icon: 'file-earmark-text' },
  ],
  Employee: [
    { label: 'My profile', icon: 'person-vcard' },
    { label: 'Attendance & leave', icon: 'calendar2-week' },
  ],
  Administrator: [
    { label: 'Overview', icon: 'grid-1x2' },
    { label: 'Match studio', icon: 'boxes' },
    { label: 'User access', icon: 'shield-lock' },
    { label: 'Job openings', icon: 'briefcase' },
    { label: 'Employees', icon: 'person-vcard' },
    { label: 'Leave requests', icon: 'calendar2-check' },
  ],
}

let authSession = getSession()
let activeRole = authSession?.role || 'HR administrator'
let activeView = authSession ? roleNavigation[activeRole]?.[0]?.label || 'Overview' : 'Login'
let candidateFilter = 'All applicants'
let candidateSearch = ''
let uploadedResumeName = ''
let uploadedResumeId = null
let selectedMatchCandidateId = 2
let matchSceneController = null
let activeTheme = localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light'
let authMode = 'login'
let forceDemoLogin = false
let jobSearch = ''
let jobDepartment = 'All departments'
let jobSort = 'applicants'
let cameraStream = null
let realtimeTimer = null
let lastNotificationId = null
let toastSequence = 0
const toastItems = []
let currentEmployeeProfile = null
let currentAttendance = null
const remoteLoadedViews = new Set()
let dashboardStats = { openPositions: 12, applicants: 284, interviews: 18, employees: 36, activity: null }

const icon = (name) => `<i class="bi bi-${name}" aria-hidden="true"></i>`
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()

function applyTheme() {
  document.documentElement.dataset.theme = activeTheme
  document.body.dataset.theme = activeTheme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', activeTheme === 'dark' ? '#101510' : '#f7f7f2')
}

function loginShellView() {
  app.innerHTML = `<main class="login-shell"><section class="login-story"><a class="brand login-brand" href="#login" aria-label="NexaHire home"><span class="brand-mark">${icon('person-workspace')}</span><span class="brand-name">nexa<span>hire</span></span></a><div class="login-story-copy"><span class="login-eyebrow">PEOPLE OPERATIONS, TOGETHER</span><h1>Build a team<br />that moves <em>forward.</em></h1><p>Recruitment and employee management, brought into one workspace.</p></div><div class="login-story-footer"><span>RECRUITMENT</span><i></i><span>PEOPLE</span><i></i><span>GROWTH</span></div><span class="login-edition">NEXAHIRE WORKSPACE <span>·</span> DEMO</span></section><section class="login-panel"><div class="login-panel-top"><span class="login-panel-label">WORKSPACE ACCESS</span><button class="icon-button theme-toggle" type="button" data-action="theme-toggle" aria-label="${activeTheme === 'dark' ? 'Switch to light theme' : 'Switch to black theme'}" title="${activeTheme === 'dark' ? 'Switch to light theme' : 'Switch to black theme'}">${icon(activeTheme === 'dark' ? 'sun' : 'moon-stars')}</button></div><div class="login-form-wrap"><span class="login-form-mark">${icon('person-check')}</span><h2>Welcome back</h2><p class="login-form-subtitle">Sign in to your NexaHire workspace.</p><form id="login-form" novalidate><label class="form-label" for="login-email">Email address</label><input class="form-control" id="login-email" name="email" type="email" autocomplete="username" placeholder="you@company.com" required /><label class="form-label" for="login-password">Password</label><div class="password-field"><input class="form-control" id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required /><button class="password-toggle" type="button" data-action="toggle-password" aria-label="Show password" title="Show password">${icon('eye')}</button></div><p class="login-error" id="login-error" role="alert" hidden></p><button class="button button-primary login-submit" type="submit">Sign in ${icon('arrow-right')}</button></form><div class="demo-access"><div class="demo-access-heading"><span>DEMO ACCOUNTS</span><span>Choose a role</span></div><div class="demo-account-list">${demoAccounts.map((account) => `<button class="demo-account-button" type="button" data-action="demo-account" data-email="${account.email}"><span>${icon(account.role === 'Candidate' ? 'person-badge' : account.role === 'Employee' ? 'person-vcard' : account.role === 'Administrator' ? 'shield-lock' : 'people')}</span>${account.role}</button>`).join('')}</div><p>Shared demo password: <code>${demoPassword}</code></p></div><p class="login-disclaimer">Demo sign-in only. Connect Flask authentication before using real accounts.</p></div><span class="login-copyright">NEXAHIRE · PEOPLE, WITH PURPOSE</span></section></main>`
}

function loginView() {
  loginShellView()
  const formWrap = document.querySelector('.login-form-wrap')
  if (!formWrap) return
  const isLogin = authMode === 'login'
  formWrap.innerHTML = `<span class="login-form-mark">${icon(isLogin ? 'person-check' : 'person-plus')}</span><div class="auth-mode-tabs" role="tablist" aria-label="Account access"><button type="button" class="auth-mode-tab ${isLogin ? 'active' : ''}" data-auth-mode="login" role="tab" aria-selected="${isLogin}">Sign in</button><button type="button" class="auth-mode-tab ${!isLogin ? 'active' : ''}" data-auth-mode="register" role="tab" aria-selected="${!isLogin}">Create account</button></div><h2>${isLogin ? 'Welcome back' : 'Join NexaHire'}</h2><p class="login-form-subtitle">${isLogin ? 'Sign in to your NexaHire workspace.' : 'Create a candidate or employee account.'}</p>${isLogin ? `<form id="login-form" novalidate><label class="form-label" for="login-email">Email address</label><input class="form-control" id="login-email" name="email" type="email" autocomplete="username" placeholder="you@company.com" required /><label class="form-label" for="login-password">Password</label><div class="password-field"><input class="form-control" id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required /><button class="password-toggle" type="button" data-action="toggle-password" aria-label="Show password" title="Show password">${icon('eye')}</button></div><p class="login-error" id="login-error" role="alert" hidden></p><button class="button button-primary login-submit" type="submit">Sign in ${icon('arrow-right')}</button></form><div class="demo-access"><div class="demo-access-heading"><span>DEMO ACCOUNTS</span><span>Choose a role</span></div><div class="demo-account-list">${demoAccounts.map((account) => `<button class="demo-account-button" type="button" data-action="demo-account" data-email="${account.email}"><span>${icon(account.role === 'Candidate' ? 'person-badge' : account.role === 'Employee' ? 'person-vcard' : account.role === 'Administrator' ? 'shield-lock' : 'people')}</span>${account.role}</button>`).join('')}</div><p>Shared demo password: <code>${demoPassword}</code></p></div>` : `<form id="registration-form" novalidate><label class="form-label" for="register-name">Full name</label><input class="form-control" id="register-name" name="name" autocomplete="name" placeholder="Your name" required maxlength="80" /><label class="form-label" for="register-email">Email address</label><input class="form-control" id="register-email" name="email" type="email" autocomplete="email" placeholder="you@email.com" required /><label class="form-label" for="register-role">Account type</label><select class="form-select" id="register-role" name="role"><option value="Candidate">Candidate</option><option value="Employee">Employee</option></select><label class="form-label" for="register-password">Password</label><div class="password-field"><input class="form-control" id="register-password" name="password" type="password" autocomplete="new-password" placeholder="At least 8 characters" minlength="8" required /><button class="password-toggle" type="button" data-action="toggle-register-password" aria-label="Show password" title="Show password">${icon('eye')}</button></div><label class="form-label" for="register-confirm">Confirm password</label><input class="form-control" id="register-confirm" name="confirm" type="password" autocomplete="new-password" placeholder="Re-enter your password" required /><p class="login-error" id="login-error" role="alert" hidden></p><button class="button button-primary login-submit" type="submit">Create account ${icon('arrow-right')}</button></form><p class="login-disclaimer">HR and administrator accounts must be created by an administrator.</p>`}<p class="login-disclaimer">${isLogin ? 'Demo accounts are for UI testing. Use a Flask API for real accounts.' : 'Passwords are sent to Flask over HTTPS; they are never stored in this browser.'}</p>`
}

function avatar(person, size = '') {
  return `<span class="avatar ${person.color || 'mint'} ${size}" aria-hidden="true">${person.initials || initials(person.name)}</span>`
}

function statusPill(status) {
  const style = status.toLowerCase().replaceAll(' ', '-')
  return `<span class="status-pill ${style}"><span class="status-dot"></span>${status}</span>`
}

function pageHeading() {
  const headings = {
    Overview: ['Overview', 'Your team, hiring, and people operations at a glance.'],
    'Match studio': ['Match studio', 'Explore candidate fit through an interactive 3D match map.'],
    Candidates: ['Candidates', 'Find the people who fit your open roles.'],
    'Job openings': ['Job openings', 'Manage open roles and keep hiring moving.'],
    Employees: ['Employees', 'A clear view of the people behind the work.'],
    'Leave requests': ['Leave requests', 'Review upcoming time off and team coverage.'],
    'Find jobs': ['Find jobs', 'Explore roles and submit an application.'],
    'My applications': ['My applications', 'Track your applications and next steps.'],
    'My profile': ['My profile', 'Your employee details and current work information.'],
    'Attendance & leave': ['Attendance & leave', 'Your attendance snapshot and time-off balance.'],
    'User access': ['User access', 'Review the roles configured for this workspace.'],
  }
  return headings[activeView]
}

function shell() {
  const [title, subtitle] = pageHeading()
  const visibleNavigation = roleNavigation[activeRole] || roleNavigation['HR administrator']
  const fallbackProfile = activeRole === 'Candidate' ? { name: 'Aarav Mehta', initials: 'AM', color: 'peach' } : activeRole === 'Employee' ? { name: 'Rohan Deshmukh', initials: 'RD', color: 'blue' } : { name: 'Pranavi Jadhav', initials: 'PJ', color: 'profile' }
  const profile = authSession?.role === activeRole ? { ...fallbackProfile, ...authSession, initials: initials(authSession.name || fallbackProfile.name) } : fallbackProfile
  app.innerHTML = `
    <aside class="sidebar" id="sidebar">
      <a class="brand" href="#overview" aria-label="NexaHire home" data-view="Overview">
        <span class="brand-mark">${icon('person-workspace')}</span>
        <span class="brand-name">nexa<span>hire</span></span>
      </a>
      <div class="workspace-label">WORKSPACE</div>
      <nav class="side-nav" aria-label="Main navigation">
        ${visibleNavigation.map((item) => `<button class="nav-link ${activeView === item.label ? 'active' : ''}" data-view="${item.label}" type="button">${icon(item.icon)}<span>${item.label}</span>${item.label === 'Leave requests' ? '<span class="nav-count">2</span>' : ''}</button>`).join('')}
      </nav>
      <div class="sidebar-bottom">
        <div class="plan-card">
          <span class="plan-icon">${icon('sparkles')}</span>
          <div><strong>Hiring, thoughtfully.</strong><p>AI-assisted matching is in demo mode.</p></div>
          <span class="demo-mark">DEMO</span>
        </div>
        <button class="profile-switch" type="button" data-action="profile-menu">
          <span class="avatar ${profile.color}">${profile.initials}</span>
          <span class="profile-copy"><strong>${profile.name}</strong><small>${activeRole} · demo preview</small></span>
          ${icon('three-dots')}
        </button>
        <div class="role-menu" id="role-menu" hidden>${authSession?.role === 'Administrator' ? `<p>PREVIEW AS ROLE</p>${Object.keys(roleNavigation).map((role) => `<button type="button" data-role="${role}" class="role-option ${activeRole === role ? 'selected' : ''}"><span>${role}</span>${activeRole === role ? icon('check') : ''}</button>`).join('')}` : ''}<button class="role-option signout-option" type="button" data-action="sign-out"><span>Sign out</span>${icon('box-arrow-right')}</button></div>
      </div>
    </aside>
    <div class="mobile-scrim" data-action="close-menu"></div>
    <main class="main-panel">
      <header class="topbar">
        <button class="icon-button mobile-menu" type="button" aria-label="Open navigation" data-action="toggle-menu">${icon('list')}</button>
        <div class="breadcrumbs"><span>Workspace</span>${icon('chevron-right')}<strong>${title}</strong></div>
        <div class="topbar-actions">
          <span class="today-label">${new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</span>
          <button class="icon-button theme-toggle" type="button" data-action="theme-toggle" aria-label="${activeTheme === 'dark' ? 'Switch to light theme' : 'Switch to black theme'}" title="${activeTheme === 'dark' ? 'Switch to light theme' : 'Switch to black theme'}">${icon(activeTheme === 'dark' ? 'sun' : 'moon-stars')}</button>
          <button class="icon-button notification-button" type="button" aria-label="Notifications" data-action="notifications">${icon('bell')}<span class="notification-dot"></span></button>
          ${avatar(profile)}
        </div>
      </header>
      <div class="page-content ${activeView === 'Match studio' ? 'match-page-content' : ''}">
        <div class="page-heading">
          <div><p class="eyebrow">PEOPLE OPERATIONS</p><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div>
          <div class="heading-actions">${activeRole !== 'Candidate' && activeRole !== 'Employee' && activeView === 'Job openings' ? `<button class="button button-primary" data-action="new-job" type="button">${icon('plus-lg')}<span>New job</span></button>` : activeRole !== 'Candidate' && activeRole !== 'Employee' && activeView === 'Overview' ? `<button class="button button-primary" data-action="new-job" type="button">${icon('plus-lg')}<span>Post a job</span></button>` : ''}</div>
        </div>
        <section class="view-enter">${viewContent()}</section>
      </div>
    </main>
    <div class="toast-region" id="toast-region" aria-live="polite" aria-atomic="true"></div>`
}

function metricCard({ iconName, label, value, change, tone, note }) {
  return `<article class="metric-card"><div class="metric-top"><span class="metric-icon ${tone}">${icon(iconName)}</span><span class="metric-change">${icon('arrow-up-right')} ${change}</span></div><p class="metric-label">${label}</p><div class="metric-value-row"><strong class="metric-value">${value}</strong><span class="metric-note">${note}</span></div></article>`
}

function candidateRow(person, compact = false) {
  return `<tr>
    <td><div class="person-cell">${avatar(person)}<div><strong>${person.name}</strong><small>${person.role}</small></div></div></td>
    <td><span class="match-score"><span class="score-ring" style="--score:${person.score}%"><span>${person.score}</span></span><span>match</span></span></td>
    ${compact ? '' : `<td><span class="applied-date">${person.applied}</span></td>`}
    <td>${statusPill(person.status)}</td>
    <td class="table-action"><button class="row-action" type="button" aria-label="View ${person.name}" title="View candidate" data-action="view-candidate" data-id="${person.id}">${icon('arrow-up-right')}</button></td>
  </tr>`
}

function candidateTable({ compact = false } = {}) {
  return `<div class="table-scroll"><table class="data-table"><thead><tr><th>Candidate</th><th>AI match <span class="demo-mark">${authSession.demo ? 'DEMO' : 'API'}</span></th>${compact ? '' : '<th>Applied</th>'}<th>Status</th><th></th></tr></thead><tbody id="candidate-results">${candidateRows({ compact })}</tbody></table></div>`
}

function candidateRows({ compact = false } = {}) {
  const filtered = candidates.filter((person) => {
    const matchesFilter = candidateFilter === 'All applicants' || person.status === candidateFilter
    const matchesSearch = `${person.name} ${person.role} ${person.skills.join(' ')}`.toLowerCase().includes(candidateSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })
  return filtered.length ? filtered.map((person) => candidateRow(person, compact)).join('') : `<tr><td colspan="5" class="empty-cell">No candidates match this search.</td></tr>`
}

function overviewView() {
  const activity = dashboardStats.activity || [{ day: 'Fri', a: 40, i: 18 }, { day: 'Sat', a: 28, i: 11 }, { day: 'Sun', a: 34, i: 15 }, { day: 'Mon', a: 60, i: 31 }, { day: 'Tue', a: 49, i: 22 }, { day: 'Wed', a: 76, i: 37 }, { day: 'Thu', a: 92, i: 46 }]
  return `
    <div class="welcome-strip"><div><span class="welcome-kicker">FRIDAY, OCTOBER 2</span><h2>Good morning, ${escapeHTML(authSession?.name?.split(' ')[0] || 'team')} <span class="wave">${icon('sun')}</span></h2><p>A steady week for great matches. Here's what's happening across your team.</p></div><div class="welcome-decoration"><span class="sun-disc"></span><span class="leaf leaf-one"></span><span class="leaf leaf-two"></span><span class="welcome-stat"><strong>+18%</strong><small>applications this week</small></span></div></div>
    <div class="metrics-grid">
      ${metricCard({ iconName: 'briefcase', label: 'Open positions', value: dashboardStats.openPositions, change: '2', tone: 'tone-green', note: 'this month' })}
      ${metricCard({ iconName: 'person-plus', label: 'New applicants', value: dashboardStats.applicants, change: '18%', tone: 'tone-coral', note: 'this week' })}
      ${metricCard({ iconName: 'calendar2-week', label: 'Interviews', value: dashboardStats.interviews, change: '4', tone: 'tone-blue', note: 'scheduled' })}
      ${metricCard({ iconName: 'person-check', label: 'Team members', value: dashboardStats.employees, change: '3', tone: 'tone-yellow', note: 'this quarter' })}
    </div>
    <div class="dashboard-grid">
      <article class="panel hiring-panel"><div class="panel-heading"><div><h2>Hiring activity</h2><p>Applications received over time</p></div><button class="select-button" type="button" data-action="chart-period">Last 7 days ${icon('chevron-down')}</button></div><div class="chart-legend"><span><i class="legend-dot legend-applications"></i>Applications</span><span><i class="legend-dot legend-interviews"></i>Interviews</span></div><div class="chart-wrap"><div class="chart-y-labels"><span>60</span><span>40</span><span>20</span><span>0</span></div><div class="chart-area"><div class="chart-grid-lines"><i></i><i></i><i></i><i></i></div><div class="bar-chart">${activity.map((bar) => `<div class="bar-group"><div class="bar-pair"><span class="bar bar-primary" style="--bar-height:${Number(bar.applications ?? bar.a ?? 0)}%"></span><span class="bar bar-secondary" style="--bar-height:${Number(bar.interviews ?? bar.i ?? 0)}%"></span></div><span class="bar-label">${escapeHTML(bar.day || bar.date || '')}</span></div>`).join('')}</div></div></div></article>
      <article class="panel pipeline-panel"><div class="panel-heading"><div><h2>Hiring pipeline</h2><p>Across all open roles</p></div><button class="icon-button subtle" type="button" aria-label="More pipeline options" data-action="pipeline-info">${icon('three-dots')}</button></div><div class="pipeline-total"><strong>284</strong><span>total applicants</span></div><div class="pipeline-list"><div class="pipeline-item"><div class="pipeline-label"><span>New applications</span><strong>126</strong></div><div class="pipeline-track"><i class="pipeline-fill fill-new" style="--fill:82%"></i></div></div><div class="pipeline-item"><div class="pipeline-label"><span>In review</span><strong>84</strong></div><div class="pipeline-track"><i class="pipeline-fill fill-review" style="--fill:61%"></i></div></div><div class="pipeline-item"><div class="pipeline-label"><span>Interview</span><strong>42</strong></div><div class="pipeline-track"><i class="pipeline-fill fill-interview" style="--fill:38%"></i></div></div><div class="pipeline-item"><div class="pipeline-label"><span>Offer</span><strong>18</strong></div><div class="pipeline-track"><i class="pipeline-fill fill-offer" style="--fill:20%"></i></div></div></div><button class="text-link" type="button" data-view="Candidates">View candidate pipeline ${icon('arrow-right')}</button></article>
    </div>
    <article class="panel candidate-panel"><div class="panel-heading candidate-panel-heading"><div><h2>Top matches</h2><p>Strongest profile matches for your open roles</p></div><div class="panel-heading-actions"><span class="demo-mark">${authSession.demo ? 'SAMPLE MATCH DATA' : 'API MATCH DATA'}</span><button class="text-link" type="button" data-view="Candidates">All candidates ${icon('arrow-right')}</button></div></div>${candidateTable({ compact: true })}</article>
    <div class="bottom-grid"><article class="panel focus-panel"><div class="panel-heading"><div><h2>Roles to watch</h2><p>Openings gaining momentum</p></div><button class="text-link" type="button" data-view="Job openings">All roles ${icon('arrow-right')}</button></div><div class="focus-list">${jobs.slice(0, 3).map((job) => `<div class="focus-row"><span class="job-icon ${job.color}">${icon(job.icon)}</span><div class="focus-copy"><strong>${job.title}</strong><small>${job.department} <span>·</span> ${job.location}</small></div><span class="applicant-count">${job.applicants} <small>applied</small></span></div>`).join('')}</div></article><article class="panel team-panel"><div class="panel-heading"><div><h2>People today</h2><p>Team attendance snapshot</p></div><button class="text-link" type="button" data-view="Employees">Directory ${icon('arrow-right')}</button></div><div class="attendance-summary"><strong>32 <span>/ 36</span></strong><div class="attendance-track"><i></i></div><small>team members are in today</small></div><div class="team-avatars">${employees.slice(0, 5).map((person) => avatar(person)).join('')}<span class="team-more">+31</span><span class="online-label"><i></i> Team active</span></div></article></div>`
}

function candidatesView() {
  const filters = ['All applicants', 'Review', 'Shortlisted', 'Interview']
  return `<div class="view-toolbar"><div class="filter-tabs">${filters.map((filter) => `<button type="button" class="filter-tab ${candidateFilter === filter ? 'selected' : ''}" data-filter="${filter}">${filter}${filter === 'All applicants' ? `<span>${candidates.length}</span>` : ''}</button>`).join('')}</div><label class="search-field">${icon('search')}<input type="search" id="candidate-search" placeholder="Search candidates or skills" value="${escapeHTML(candidateSearch)}" /></label></div><article class="panel candidate-panel full-table-panel"><div class="panel-heading candidate-panel-heading"><div><h2>All applicants</h2><p>Ranked by skills match score</p></div><span class="demo-mark">${authSession.demo ? 'DEMO SCORES' : 'API SCORES'}</span></div>${candidateTable()}</article><p class="data-note">${authSession.demo ? 'Match scores are sample UI data.' : 'Match scores are returned by the matching API.'} ${authSession.demo ? 'Your team’s Flask matching endpoint can supply the real score and matched skills.' : ''}</p>`
}

function filteredJobs() {
  return jobs.filter((job) => {
    const matchesText = `${job.title} ${job.department} ${job.location}`.toLowerCase().includes(jobSearch.toLowerCase())
    return matchesText && (jobDepartment === 'All departments' || job.department === jobDepartment)
  }).sort((first, second) => {
    if (jobSort === 'title') return first.title.localeCompare(second.title)
    if (jobSort === 'department') return first.department.localeCompare(second.department)
    return second.applicants - first.applicants
  })
}

function jobCardMarkup(job, index) {
  return `<article class="job-card"><div class="job-card-top"><span class="job-icon ${job.color}">${icon(job.icon)}</span>${statusPill(job.status)}</div><h2>${escapeHTML(job.title)}</h2><p class="job-department">${escapeHTML(job.department)} <span>·</span> ${escapeHTML(job.type)}</p><div class="job-meta"><span>${icon('geo-alt')} ${escapeHTML(job.location)}</span><span>${icon('people')} ${job.applicants} applicants</span></div><div class="job-card-footer"><span>Posted ${index === 0 ? '2 days' : `${index + 2} days`} ago</span><button class="text-link" type="button" data-action="job-applicants" data-title="${escapeHTML(job.title)}">View applicants ${icon('arrow-right')}</button></div></article>`
}

function renderJobResults() {
  const results = filteredJobs()
  const list = document.querySelector('#job-results')
  if (list) list.innerHTML = results.length ? results.map(jobCardMarkup).join('') : '<p class="empty-cell">No openings match these filters.</p>'
  const count = document.querySelector('#job-result-count')
  if (count) count.textContent = `${results.length} openings`
}

function jobsView() {
  const departments = ['All departments', ...new Set(jobs.map((job) => job.department))]
  const results = filteredJobs()
  return `<div class="jobs-summary"><div class="jobs-summary-copy"><span class="summary-icon">${icon('briefcase')}</span><div><strong>${jobs.filter((job) => job.status === 'Active').length} active openings</strong><p>Across ${new Set(jobs.map((job) => job.department)).size} departments</p></div></div><span class="demo-mark">${authSession.demo ? 'SAMPLE DATA' : 'LIVE DATA'}</span></div><div class="jobs-toolbar"><label class="search-field">${icon('search')}<input type="search" id="job-search" placeholder="Search job title or location" value="${escapeHTML(jobSearch)}" /></label><select class="form-select job-filter-select" id="job-department-filter" aria-label="Filter by department">${departments.map((department) => `<option ${jobDepartment === department ? 'selected' : ''}>${escapeHTML(department)}</option>`).join('')}</select><select class="form-select job-filter-select" id="job-sort" aria-label="Sort jobs"><option value="applicants" ${jobSort === 'applicants' ? 'selected' : ''}>Most applicants</option><option value="title" ${jobSort === 'title' ? 'selected' : ''}>Title A-Z</option><option value="department" ${jobSort === 'department' ? 'selected' : ''}>Department</option></select><span id="job-result-count" class="job-result-count">${results.length} openings</span></div><div class="jobs-grid" id="job-results">${results.length ? results.map(jobCardMarkup).join('') : '<p class="empty-cell">No openings match these filters.</p>'}</div>${authSession.demo ? `<div class="api-hint">${icon('info-circle')} Demo openings use sample records. Your Flask GET /api/jobs endpoint can replace them.</div>` : ''}`
}

function employeesView() {
  return `<div class="people-stats"><div class="people-stat"><span class="stat-glyph tone-green">${icon('people')}</span><div><strong>36</strong><small>Total employees</small></div></div><div class="people-stat"><span class="stat-glyph tone-blue">${icon('person-check')}</span><div><strong>32</strong><small>Present today</small></div></div><div class="people-stat"><span class="stat-glyph tone-coral">${icon('calendar2-minus')}</span><div><strong>4</strong><small>On leave</small></div></div></div><article class="panel candidate-panel"><div class="panel-heading candidate-panel-heading"><div><h2>Team directory</h2><p>Profiles and attendance overview</p></div><label class="search-field directory-search">${icon('search')}<input type="search" id="employee-search" placeholder="Search employees" /></label></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Employee</th><th>Department</th><th>Role</th><th>Today</th><th>Leave balance</th><th></th></tr></thead><tbody id="employee-results">${employeeRows()}</tbody></table></div></article><p class="data-note">Five sample profiles shown. Employee profiles and attendance must come from the employee API in the connected app.</p>`
}

function employeeRows(query = '') {
  const filtered = employees.filter((person) => `${person.name} ${person.department} ${person.role}`.toLowerCase().includes(query.toLowerCase()))
  return filtered.length ? filtered.map((person, index) => `<tr><td><div class="person-cell">${avatar(person)}<div><strong>${person.name}</strong><small>EMP-00${index + 21}</small></div></div></td><td>${person.department}</td><td>${person.role}</td><td>${statusPill(person.attendance)}</td><td>${person.leave === 'None' ? '<span class="neutral-text">12 days</span>' : `<span class="neutral-text">${person.leave}</span>`}</td><td><button class="row-action" type="button" aria-label="View ${person.name}" data-action="employee-info" data-name="${person.name}">${icon('arrow-up-right')}</button></td></tr>`).join('') : '<tr><td colspan="6" class="empty-cell">No employees match this search.</td></tr>'
}

function leaveView() {
  return `<div class="leave-overview"><article class="leave-intro"><span class="leave-icon">${icon('calendar-heart')}</span><div><p class="eyebrow">TEAM COVERAGE</p><h2>Time away, in balance.</h2><p>Plan ahead and keep every team supported.</p></div><div class="leave-total"><strong>${leaveRequests.filter((request) => request.status === 'Pending').length}</strong><span>need review</span></div></article><div class="leave-kpis"><div><span>Pending</span><strong>${leaveRequests.filter((request) => request.status === 'Pending').length}</strong></div><div><span>Approved this month</span><strong>${leaveRequests.filter((request) => request.status === 'Approved').length + 8}</strong></div><div><span>Out today</span><strong>4</strong></div></div></div><article class="panel candidate-panel"><div class="panel-heading candidate-panel-heading"><div><h2>Requests</h2><p>Review and manage team time off</p></div><span class="demo-mark">SAMPLE DATA</span></div><div class="table-scroll"><table class="data-table leave-table"><thead><tr><th>Employee</th><th>Dates</th><th>Leave type</th><th>Reason</th><th>Status</th><th></th></tr></thead><tbody>${leaveRequests.map((request, index) => `<tr><td><div class="person-cell">${avatar(request)}<div><strong>${request.name}</strong><small>${request.department}</small></div></div></td><td><span class="date-range">${request.dates}</span><small class="table-subtext">${request.days}</small></td><td>${request.type}</td><td class="reason-cell">${request.reason}</td><td>${statusPill(request.status)}</td><td>${request.status === 'Pending' ? `<div class="decision-actions"><button class="decision-button approve" type="button" aria-label="Approve ${request.name}'s leave" title="Approve" data-action="leave-decision" data-index="${index}" data-status="Approved">${icon('check-lg')}</button><button class="decision-button decline" type="button" aria-label="Decline ${request.name}'s leave" title="Decline" data-action="leave-decision" data-index="${index}" data-status="Declined">${icon('x-lg')}</button></div>` : ''}</td></tr>`).join('')}</tbody></table></div></article><p class="data-note">Leave actions update this local demo only. Connect approvals to a protected backend endpoint.</p>`
}

function findJobsView() {
  const activeJobs = jobs.filter((job) => job.status === 'Active')
  return `<div class="candidate-intro"><div class="candidate-intro-copy"><span class="eyebrow">YOUR NEXT CHAPTER</span><h2>Find work that fits.</h2><p>Explore roles and keep your applications together.</p></div><div class="candidate-intro-mark">${icon('compass')}</div></div><section class="resume-panel"><div class="resume-copy"><span class="resume-icon">${icon('file-earmark-arrow-up')}</span><div><strong>Your resume</strong><p id="resume-description">${uploadedResumeName ? `Ready to attach: ${escapeHTML(uploadedResumeName)}` : 'Add a PDF or Word document to include with your applications.'}</p></div></div><label class="button button-secondary upload-button">${icon('upload')}<span>${uploadedResumeName ? 'Replace resume' : 'Upload resume'}</span><input id="resume-upload" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" /></label></section><div class="candidate-jobs-heading"><div><h2>Open roles</h2><p>${activeJobs.length} positions accepting applications</p></div><span class="demo-mark">${authSession.demo ? 'SAMPLE JOBS' : 'LIVE JOBS'}</span></div><div class="jobs-grid candidate-job-grid">${activeJobs.map((job) => { const applied = candidateApplications.some((application) => application.title === job.title); return `<article class="job-card candidate-job-card"><div class="job-card-top"><span class="job-icon ${job.color}">${icon(job.icon)}</span><span class="job-tag">${job.type}</span></div><h2>${escapeHTML(job.title)}</h2><p class="job-department">${job.department} <span>·</span> ${job.location}</p><p class="candidate-job-description">Work with a thoughtful team building useful products and services.</p><div class="job-card-footer"><span>${job.applicants} applicants</span><button class="button ${applied ? 'button-applied' : 'button-primary'}" type="button" data-action="apply-job" data-title="${escapeHTML(job.title)}" ${applied ? 'disabled' : ''}>${applied ? `${icon('check')} Applied` : 'Apply now'}</button></div></article>` }).join('')}</div><p class="data-note">${authSession.demo ? 'Demo only: selected resumes and applications are stored in this browser, not sent to Flask.' : 'Resume files and applications are sent to your workspace API.'}</p>`
}

function applicationsView() {
  return `<div class="application-summary"><div><span class="summary-icon">${icon('file-earmark-check')}</span><div><strong>${candidateApplications.length} applications</strong><p>Keep track of each opportunity in one place.</p></div></div><span class="demo-mark">SAMPLE DATA</span></div><article class="panel candidate-panel"><div class="panel-heading candidate-panel-heading"><div><h2>Application activity</h2><p>Updates for Aarav Mehta</p></div><button class="text-link" type="button" data-view="Find jobs">Browse open roles ${icon('arrow-right')}</button></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Role</th><th>Department</th><th>Applied</th><th>Resume</th><th>Status</th></tr></thead><tbody>${candidateApplications.map((application) => `<tr><td><div class="person-cell"><span class="job-icon green">${icon('briefcase')}</span><div><strong>${escapeHTML(application.title)}</strong><small>Application received</small></div></div></td><td>${escapeHTML(application.department)}</td><td>${escapeHTML(application.applied)}</td><td><span class="resume-name">${icon('file-earmark-pdf')} ${escapeHTML(application.resume)}</span></td><td>${statusPill(application.status)}</td></tr>`).join('')}</tbody></table></div></article><p class="data-note">Interview stages and application updates are sample records until connected to your backend.</p>`
}

function employeeProfileView() {
  return `<div class="employee-profile-layout"><article class="employee-id-panel"><div class="employee-profile-avatar">RD</div><span class="eyebrow">EMPLOYEE PROFILE</span><h2>Rohan Deshmukh</h2><p>Software Engineer · Engineering</p><span class="employee-active">${icon('check-circle-fill')} Active employee</span></article><article class="panel employee-details-panel"><div class="panel-heading"><div><h2>Work details</h2><p>Your current employee information</p></div></div><dl class="employee-details"><div><dt>Employee ID</dt><dd>EMP-0022</dd></div><div><dt>Department</dt><dd>Engineering</dd></div><div><dt>Manager</dt><dd>Priya Nair</dd></div><div><dt>Work location</dt><dd>Pune, Hybrid</dd></div><div><dt>Work email</dt><dd>rohan.d@company.example</dd></div><div><dt>Start date</dt><dd>June 16, 2024</dd></div></dl></article></div><p class="data-note">Profile details are sample data. The employee API should return only the signed-in employee's permitted information.</p>`
}

function employeeAttendanceView() {
  const myRequests = leaveRequests.filter((request) => request.name === 'Rohan Deshmukh')
  return `<div class="people-stats"><div class="people-stat"><span class="stat-glyph tone-green">${icon('calendar-check')}</span><div><strong>Present</strong><small>Today's attendance</small></div></div><div class="people-stat"><span class="stat-glyph tone-blue">${icon('calendar2-week')}</span><div><strong>12 days</strong><small>Annual leave remaining</small></div></div><div class="people-stat"><span class="stat-glyph tone-yellow">${icon('hourglass-split')}</span><div><strong>${myRequests.filter((request) => request.status === 'Pending').length}</strong><small>Pending requests</small></div></div></div><div class="employee-leave-layout"><article class="panel employee-leave-panel"><div class="panel-heading"><div><h2>Request time off</h2><p>Send a leave request to your manager</p></div></div><form id="employee-leave-form" class="leave-request-form"><label class="form-label" for="leave-type">Leave type</label><select class="form-select" id="leave-type" name="type"><option>Casual leave</option><option>Earned leave</option><option>Sick leave</option></select><div class="form-row"><div><label class="form-label" for="leave-start">Start date</label><input class="form-control" id="leave-start" name="start" type="date" required /></div><div><label class="form-label" for="leave-end">End date</label><input class="form-control" id="leave-end" name="end" type="date" required /></div></div><label class="form-label" for="leave-reason">Reason</label><textarea class="form-control" id="leave-reason" name="reason" rows="3" placeholder="Add a short note for your manager" required maxlength="180"></textarea><button class="button button-primary" type="submit">${icon('send')} Submit request</button></form></article><article class="panel employee-leave-panel"><div class="panel-heading"><div><h2>Your requests</h2><p>Recent time away</p></div></div><div class="self-request-list">${myRequests.length ? myRequests.map((request) => `<div class="self-request"><span class="leave-icon">${icon('calendar2')}</span><div><strong>${request.type}</strong><small>${request.dates} · ${request.days}</small></div>${statusPill(request.status)}</div>`).join('') : '<p class="empty-self-requests">No recent requests.</p>'}</div></article></div>`
}

function accessView() {
  const roles = [
    { name: 'Administrator', description: 'User access, system settings', count: 2, iconName: 'shield-lock', color: 'coral' },
    { name: 'HR administrator', description: 'Hiring and employee operations', count: 4, iconName: 'person-workspace', color: 'green' },
    { name: 'Employee', description: 'Personal profile, attendance, leave', count: 36, iconName: 'person-vcard', color: 'blue' },
    { name: 'Candidate', description: 'Job applications and status', count: 128, iconName: 'person-badge', color: 'yellow' },
  ]
  return `<div class="access-summary"><span class="summary-icon">${icon('shield-check')}</span><div><strong>Role-based workspace</strong><p>Access policies must also be enforced by the Flask API.</p></div><span class="demo-mark">PREVIEW</span></div><div class="access-grid">${roles.map((role) => `<article class="access-card"><span class="job-icon ${role.color}">${icon(role.iconName)}</span><div class="access-card-copy"><h2>${role.name}</h2><p>${role.description}</p></div><strong class="access-count">${role.count}<small> users</small></strong><span class="access-state"><i></i> Enabled</span></article>`).join('')}</div><div class="api-hint">${icon('info-circle')} This screen demonstrates role categories only. Hiding navigation is not authentication; secure each API route on the server.</div>`
}

function matchSelectionDetails(person) {
  return `<div class="match-selection-score"><strong>${person.score}<small>%</small></strong><span>sample match</span></div><div class="match-selection-copy"><span class="eyebrow">SELECTED CANDIDATE</span><h2>${person.name}</h2><p>${person.role} · ${person.status}</p><div class="match-skill-list">${person.skills.map((skill) => `<span>${escapeHTML(skill)}</span>`).join('')}</div></div>`
}

function matchStudioView() {
  const matchingCandidates = candidates.filter((person) => person.role === 'Frontend Developer')
  const selected = matchingCandidates.find((person) => person.id === selectedMatchCandidateId) || matchingCandidates[0]
  if (!selected) return '<p>No candidate profiles are available for this role.</p>'
  selectedMatchCandidateId = selected.id
  return `<div class="match-toolbar"><div class="match-role-label"><span class="job-icon green">${icon('code-slash')}</span><div><span class="eyebrow">OPEN ROLE</span><strong>Frontend Developer</strong><small>Engineering · Pune, Hybrid</small></div></div><div class="match-toolbar-actions"><span class="match-demo-label"><i></i> 3D DEMO</span><button class="button button-secondary" type="button" data-action="scene-toggle">${icon('pause-fill')}<span>Pause motion</span></button><button class="icon-button" type="button" aria-label="Recenter 3D scene" title="Recenter scene" data-action="scene-reset">${icon('arrow-clockwise')}</button></div></div><div class="match-scene-stage"><div class="match-canvas" id="match-scene-canvas" role="img" aria-label="Animated three-dimensional candidate profiles connected to the Frontend Developer role"></div><div class="scene-label"><span class="scene-overline">SKILL-BASED MATCH MAP</span><strong>Candidate network</strong><small>Click a profile or choose a candidate below</small></div><div class="scene-legend"><span><i class="legend-candidate"></i>Candidate profile</span><span><i class="legend-role"></i>Open role</span><span><i class="legend-link"></i>Skill overlap</span></div><span class="scene-axis-label">LIVE SCENE · SAMPLE DATA</span></div><div class="match-candidates-heading"><div><h2>Ranked profiles</h2><p>Compare sample skills overlap for this opening</p></div><span class="demo-mark">NOT MODEL OUTPUT</span></div><div class="match-candidate-list">${matchingCandidates.map((person, index) => `<button class="match-candidate-option ${person.id === selected.id ? 'selected' : ''}" type="button" data-match-candidate="${person.id}"><span class="match-rank">0${index + 1}</span>${avatar(person)}<span class="match-candidate-name"><strong>${person.name}</strong><small>${person.skills.slice(0, 2).join(' · ')}</small></span><span class="match-candidate-fit">${person.score}%<small>fit</small></span></button>`).join('')}</div><div class="match-selection-details" id="match-selection-details">${matchSelectionDetails(selected)}</div><p class="data-note">Scores and skill overlaps are sample UI data. Connect your Flask TF-IDF/cosine-similarity endpoint to show the project model's actual results.</p>`
}

function viewContent() {
  if (activeView === 'Candidates') return candidatesView()
  if (activeView === 'Job openings') return jobsView()
  if (activeView === 'Employees') return employeesView()
  if (activeView === 'Leave requests') return leaveView()
  if (activeView === 'Find jobs') return findJobsView()
  if (activeView === 'My applications') return applicationsView()
  if (activeView === 'My profile') return employeeProfileView()
  if (activeView === 'Attendance & leave') return employeeAttendanceView()
  if (activeView === 'User access') return accessView()
  if (activeView === 'Match studio') return matchStudioView()
  return overviewView()
}

function showToast(message, tone = 'success') {
  const toast = { id: ++toastSequence, message: String(message), tone }
  toastItems.push(toast)
  renderToastQueue()
  window.setTimeout(() => {
    const index = toastItems.findIndex((item) => item.id === toast.id)
    if (index !== -1) toastItems.splice(index, 1)
    document.querySelector(`[data-toast-id="${toast.id}"]`)?.remove()
  }, 3200)
}

function renderToastQueue() {
  const region = document.querySelector('#toast-region')
  if (!region) return
  toastItems.forEach((item) => {
    if (region.querySelector(`[data-toast-id="${item.id}"]`)) return
    const toast = document.createElement('div')
    toast.className = `app-toast ${item.tone}`
    toast.dataset.toastId = String(item.id)
    toast.innerHTML = `${icon(item.tone === 'error' ? 'exclamation-circle-fill' : 'check-circle-fill')}<span>${escapeHTML(item.message)}</span>`
    region.append(toast)
  })
}

function addApiConfigControl() {
  const formWrap = document.querySelector('.login-form-wrap')
  if (!formWrap) return
  const control = document.createElement('button')
  control.type = 'button'
  control.className = 'api-config-button'
  control.dataset.action = 'configure-api'
  control.textContent = `Flask API: ${getApiBaseUrl()} · Configure`
  formWrap.append(control)
}

function normalizedStatus(value, fallback = 'Review') {
  return String(value || fallback).toLowerCase().replace(/(?:^|[\s_-])\w/g, (part) => part.toUpperCase())
}

function mapApiCandidate(person, index) {
  const color = ['mint', 'lilac', 'peach', 'blue', 'yellow', 'rose'][index % 6]
  const name = person.name || person.full_name || person.candidate_name || 'Candidate'
  const skills = Array.isArray(person.skills) ? person.skills : typeof person.skills === 'string' ? person.skills.split(',').map((skill) => skill.trim()).filter(Boolean) : []
  return { id: person.id ?? person.candidate_id ?? index + 1, name, initials: initials(name), role: person.job_title || person.position || person.role || 'Applicant', email: person.email || '', applied: person.applied_at || person.created_at || 'Recently', score: Number(person.match_score ?? person.score ?? 0), status: normalizedStatus(person.status), skills, color }
}

function mapApiJob(job, index) {
  return { id: job.id ?? job.job_id ?? index + 1, title: job.title || job.job_title || 'Open role', department: job.department || 'People', type: job.employment_type || job.type || 'Full-time', location: job.location || 'Not specified', applicants: Number(job.applicant_count ?? job.applicants ?? 0), status: normalizedStatus(job.status, 'Active'), icon: 'briefcase', color: ['green', 'coral', 'blue', 'yellow'][index % 4] }
}

function mapApiEmployee(person, index) {
  const name = person.name || person.full_name || 'Employee'
  return { name, initials: initials(name), department: person.department || 'People', role: person.job_title || person.role || 'Employee', attendance: normalizedStatus(person.attendance_status || person.attendance, 'Present'), leave: person.leave || 'None', color: ['peach', 'blue', 'rose', 'mint', 'lilac'][index % 5] }
}

function mapApiApplication(application) {
  return { title: application.job_title || application.title || 'Application', department: application.department || 'People', applied: application.applied_at || application.created_at || 'Recently', status: normalizedStatus(application.status), resume: application.resume_filename || application.resume_name || 'Resume on file' }
}

function replaceItems(target, rows) {
  target.splice(0, target.length, ...rows)
}

async function loadRemoteView(view) {
  if (!authSession || authSession.demo || remoteLoadedViews.has(view)) return
  const request = {
    Overview: ['/dashboard/stats', 'stats'],
    Candidates: ['/candidates', 'candidates'],
    'Match studio': ['/candidates?job_title=Frontend%20Developer', 'candidates'],
    'Job openings': ['/jobs', 'jobs'],
    'Find jobs': ['/jobs', 'jobs'],
    'My applications': ['/applications/mine', 'applications'],
    Employees: ['/employees', 'employees'],
    'Leave requests': ['/leave-requests', 'leave_requests'],
    'My profile': ['/employees/me', 'employee'],
    'Attendance & leave': ['/attendance/me', 'attendance'],
  }[view]
  if (!request) return
  remoteLoadedViews.add(view)
  const section = document.querySelector('.view-enter')
  const indicator = document.createElement('div')
  indicator.className = 'api-loading-state'
  indicator.textContent = `Loading ${view.toLowerCase()}...`
  section?.prepend(indicator)
  try {
    const response = await apiRequest(request[0])
    const data = response?.data || response
    if (view === 'Overview') {
      dashboardStats = { ...dashboardStats, openPositions: Number(data.open_positions ?? dashboardStats.openPositions), applicants: Number(data.applicants ?? data.new_applicants ?? dashboardStats.applicants), interviews: Number(data.interviews ?? dashboardStats.interviews), employees: Number(data.employee_count ?? data.employees ?? dashboardStats.employees), activity: Array.isArray(data.hiring_activity) ? data.hiring_activity : dashboardStats.activity }
    } else if (view === 'My profile') {
      currentEmployeeProfile = data.employee || data
    } else if (view === 'Attendance & leave') {
      currentAttendance = data.attendance || data
    } else {
      const rows = normalizeList(response, request[1])
      if (view === 'Candidates' || view === 'Match studio') replaceItems(candidates, rows.map(mapApiCandidate))
      if (view === 'Job openings' || view === 'Find jobs') replaceItems(jobs, rows.map(mapApiJob))
      if (view === 'Employees') replaceItems(employees, rows.map(mapApiEmployee))
      if (view === 'My applications') replaceItems(candidateApplications, rows.map(mapApiApplication))
      if (view === 'Leave requests') replaceItems(leaveRequests, rows.map((item, index) => ({ ...item, id: item.id ?? index, name: item.employee_name || item.name || 'Employee', initials: initials(item.employee_name || item.name || 'Employee'), dates: item.dates || item.start_date || 'Pending dates', days: item.days || '', type: item.leave_type || item.type || 'Leave', reason: item.reason || '', status: normalizedStatus(item.status, 'Pending'), department: item.department || 'People', color: ['mint', 'rose', 'blue'][index % 3] })))
    }
    if (activeView === view) render()
  } catch (error) {
    remoteLoadedViews.delete(view)
    showToast(error.message || 'Could not load data from the backend.', 'error')
  } finally {
    indicator.remove()
  }
}

function hydrateEmployeeViews() {
  const live = authSession && !authSession.demo
  if (live) {
    const sourceLabels = {
      Candidates: ['API SCORES', 'Match scores are returned by the matching API.'],
      'Match studio': ['API MATCH DATA', 'Match scores and skills are supplied by the matching API.'],
      Employees: ['LIVE DATA', 'Employee profiles and attendance are returned by the employee API.'],
      'Leave requests': ['LIVE DATA', 'Leave requests are returned by the workspace API.'],
      'My applications': ['LIVE DATA', 'Application updates are returned by your workspace API.'],
    }
    const labels = sourceLabels[activeView]
    const sourceLabel = document.querySelector('.view-enter > .data-note')
    if (labels && sourceLabel) sourceLabel.textContent = labels[1]
    if (activeView === 'My applications') {
      const sampleTag = document.querySelector('.application-summary .demo-mark')
      const owner = document.querySelector('.candidate-panel-heading p')
      if (sampleTag) sampleTag.textContent = 'LIVE DATA'
      if (owner) owner.textContent = `Updates for ${authSession.name}`
    }
    if (activeView === 'Employees') {
      const counts = document.querySelectorAll('.people-stats .people-stat strong')
      if (counts[0]) counts[0].textContent = String(employees.length)
      if (counts[1]) counts[1].textContent = String(employees.filter((person) => person.attendance === 'Present').length)
    }
    if (activeView === 'Leave requests') {
      const label = document.querySelector('.candidate-panel-heading .demo-mark')
      if (label) label.textContent = 'LIVE DATA'
    }
    if (activeView === 'My profile' && currentEmployeeProfile) {
      const avatarNode = document.querySelector('.employee-profile-avatar')
      if (avatarNode) avatarNode.textContent = initials(currentEmployeeProfile.name || currentEmployeeProfile.full_name || authSession.name)
      const note = document.querySelector('.view-enter > .data-note')
      if (note) note.textContent = 'Profile details shown are returned by the employee API.'
    }
    if (activeView === 'Match studio') {
      const scoreLabel = document.querySelector('.match-selection-score span')
      if (scoreLabel) scoreLabel.textContent = 'API match'
    }
    if (activeView === 'Overview') {
      const pipelineTotal = document.querySelector('.pipeline-total strong')
      if (pipelineTotal) pipelineTotal.textContent = String(dashboardStats.applicants)
      const positions = document.querySelector('.welcome-stat small')
      if (positions) positions.textContent = 'live workspace data'
    }
  }

  if (activeView === 'My profile' && currentEmployeeProfile) {
    const profile = currentEmployeeProfile
    const name = profile.name || profile.full_name || authSession.name
    const summary = document.querySelector('.employee-id-panel h2')
    const role = document.querySelector('.employee-id-panel > p')
    const details = document.querySelectorAll('.employee-details dd')
    if (summary) summary.textContent = name
    if (role) role.textContent = `${profile.job_title || profile.role || 'Employee'} · ${profile.department || 'People'}`
    const values = [profile.employee_id || profile.id || '—', profile.department || '—', profile.manager_name || profile.manager || '—', profile.location || profile.work_location || '—', profile.email || authSession.email, profile.start_date || profile.joined_at || '—']
    details.forEach((element, index) => { if (values[index]) element.textContent = values[index] })
  }

  if (activeView === 'Attendance & leave' && currentAttendance) {
    const stats = document.querySelectorAll('.people-stats .people-stat strong')
    if (stats[0]) stats[0].textContent = normalizedStatus(currentAttendance.attendance_status, 'Present')
    if (stats[1]) stats[1].textContent = `${Number(currentAttendance.leave_balance_days ?? 12)} days`
    if (stats[2]) stats[2].textContent = String(Number(currentAttendance.pending_requests ?? 0))
  }
}

function stopRealtimeUpdates() {
  if (realtimeTimer) window.clearInterval(realtimeTimer)
  realtimeTimer = null
}

async function pollNotifications() {
  try {
    const query = lastNotificationId ? `?after_id=${encodeURIComponent(lastNotificationId)}` : ''
    const response = await apiRequest(`/notifications${query}`)
    normalizeList(response, 'notifications').forEach((notification) => {
      const notificationId = notification.id ?? notification.notification_id
      if (notificationId !== undefined && notificationId === lastNotificationId) return
      lastNotificationId = notificationId ?? lastNotificationId
      showToast(notification.message || notification.title || 'You have a new notification.')
    })
  } catch (error) {
    if (!pollNotifications.warned) {
      showToast(`Live updates are unavailable: ${error.message}`, 'error')
      pollNotifications.warned = true
    }
  }
}

function startRealtimeUpdates() {
  stopRealtimeUpdates()
  pollNotifications.warned = false
  if (!authSession || authSession.demo) return
  void pollNotifications()
  realtimeTimer = window.setInterval(pollNotifications, 5000)
}

function openCandidate(id) {
  const person = candidates.find((candidate) => candidate.id === Number(id))
  if (!person) return
  const modal = document.createElement('div')
  modal.className = 'modal-scrim'
  modal.dataset.action = 'close-modal'
  modal.innerHTML = `<section class="detail-modal" role="dialog" aria-modal="true" aria-labelledby="candidate-title"><button class="icon-button modal-close" type="button" aria-label="Close" data-action="close-modal">${icon('x-lg')}</button><div class="detail-profile">${avatar(person, 'avatar-large')}<div><span class="eyebrow">CANDIDATE PROFILE</span><h2 id="candidate-title">${person.name}</h2><p>${person.role}</p></div></div><div class="detail-score"><div><span class="eyebrow">SAMPLE SKILLS MATCH</span><p>Compared with the role requirements</p></div><strong>${person.score}<small>%</small></strong></div><div class="detail-skills"><h3>Skills found in resume</h3><div>${person.skills.map((skill) => `<span>${escapeHTML(skill)}</span>`).join('')}</div></div><div class="detail-info"><span>${icon('envelope')} ${person.email}</span><span>${icon('clock')} Applied ${person.applied}</span></div><div class="modal-footer-actions"><button class="button button-secondary" type="button" data-action="close-modal">Close</button><button class="button button-primary" type="button" data-action="shortlist" data-id="${person.id}">${icon('bookmark-plus')} Shortlist candidate</button></div></section>`
  document.body.append(modal)
}

function openJobModal() {
  const modal = document.createElement('div')
  modal.className = 'modal-scrim'
  modal.dataset.action = 'close-modal'
  modal.innerHTML = `<form class="detail-modal job-modal" id="job-form" role="dialog" aria-modal="true" aria-labelledby="job-modal-title"><button class="icon-button modal-close" type="button" aria-label="Close" data-action="close-modal">${icon('x-lg')}</button><span class="eyebrow">HIRING WORKSPACE</span><h2 id="job-modal-title">Create a job opening</h2><p class="modal-description">Add the details your candidate and HR teams need.</p><label class="form-label" for="job-title">Job title</label><input class="form-control" id="job-title" name="title" placeholder="e.g. Backend Developer" required maxlength="70" /><label class="form-label" for="job-department">Department</label><input class="form-control" id="job-department" name="department" placeholder="e.g. Engineering" required maxlength="50" /><div class="form-row"><div><label class="form-label" for="job-location">Location</label><input class="form-control" id="job-location" name="location" placeholder="Pune, Hybrid" required maxlength="60" /></div><div><label class="form-label" for="job-type">Employment type</label><select class="form-select" id="job-type" name="type"><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option></select></div></div><div class="modal-footer-actions"><button class="button button-secondary" type="button" data-action="close-modal">Cancel</button><button class="button button-primary" type="submit">${icon('plus-lg')} Add opening</button></div></form>`
  document.body.append(modal)
  modal.querySelector('#job-title').focus()
}

function render() {
  applyTheme()
  matchSceneController?.dispose()
  matchSceneController = null
  if (!authSession) {
    stopRealtimeUpdates()
    loginView()
    addApiConfigControl()
    renderToastQueue()
    return
  }
  shell()
  renderToastQueue()
  if (!authSession.demo && !realtimeTimer) startRealtimeUpdates()
  hydrateEmployeeViews()
  if (activeView === 'Find jobs') {
    const resumePanel = document.querySelector('.resume-panel')
    if (resumePanel) {
      const cameraButton = document.createElement('button')
      cameraButton.className = 'button button-secondary camera-verify-button'
      cameraButton.type = 'button'
      cameraButton.dataset.action = 'open-camera'
      cameraButton.innerHTML = `${icon('camera-video')}<span>Verify face</span>`
      resumePanel.append(cameraButton)
    }
  }
  if (activeView === 'Match studio') {
    const matchingCandidates = candidates.filter((person) => person.role === 'Frontend Developer')
    matchSceneController = mountMatchScene({
      container: document.querySelector('#match-scene-canvas'),
      candidates: matchingCandidates,
      selectedId: selectedMatchCandidateId,
      theme: activeTheme,
      onSelect: selectMatchCandidate,
    })
  }
  void loadRemoteView(activeView)
}

async function uploadResume(file) {
  if (!file) return
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  const allowedExtension = /\.(pdf|doc|docx)$/i.test(file.name)
  if (!allowedTypes.includes(file.type) && !allowedExtension) return showToast('Choose a PDF or Word document.')
  if (file.size > 10 * 1024 * 1024) return showToast('Resume files must be 10 MB or smaller.')
  uploadedResumeName = file.name
  if (authSession.demo) {
    showToast('Resume selected for this demo. Connect Flask to upload it.')
    return
  }
  const formData = new FormData()
  formData.append('resume', file)
  try {
    const response = await apiRequest('/resumes', { method: 'POST', body: formData })
    const result = response?.data || response
    uploadedResumeId = result.resume_id ?? result.id ?? null
    showToast(result.message || 'Resume uploaded successfully.')
  } catch (error) {
    uploadedResumeName = ''
    showToast(error.message || 'Resume upload failed.', 'error')
  }
}

async function openCameraModal() {
  const modal = document.createElement('div')
  modal.className = 'modal-scrim'
  modal.dataset.action = 'close-camera'
  modal.innerHTML = `<section class="detail-modal camera-modal" role="dialog" aria-modal="true" aria-labelledby="camera-title"><button class="icon-button modal-close" type="button" aria-label="Close camera" data-action="close-camera">${icon('x-lg')}</button><span class="eyebrow">IDENTITY CHECK</span><h2 id="camera-title">Face verification</h2><p class="modal-description">Position your face in the frame, then capture an image for the verification service.</p><div class="camera-preview"><video id="camera-video" autoplay playsinline muted></video><div class="camera-frame" aria-hidden="true"></div></div><p class="camera-error" id="camera-error" role="alert" hidden></p><div class="modal-footer-actions"><button class="button button-secondary" type="button" data-action="close-camera">Cancel</button><button class="button button-primary" type="button" data-action="capture-face" disabled>${icon('camera')} Capture</button></div><p class="camera-disclaimer">Camera access requires your permission. Face matching is performed by the backend, not this screen.</p></section>`
  document.body.append(modal)
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is not available in this browser.')
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    const video = modal.querySelector('#camera-video')
    video.srcObject = cameraStream
    await video.play()
    modal.querySelector('[data-action="capture-face"]').disabled = false
  } catch (error) {
    const message = error.name === 'NotAllowedError' ? 'Camera permission was denied. Allow camera access in your browser settings and try again.' : error.message || 'Could not start the camera.'
    const cameraError = modal.querySelector('#camera-error')
    cameraError.textContent = message
    cameraError.hidden = false
  }
}

function closeCameraModal() {
  cameraStream?.getTracks().forEach((track) => track.stop())
  cameraStream = null
  document.querySelector('.camera-modal')?.closest('.modal-scrim')?.remove()
}

async function captureFace() {
  const video = document.querySelector('#camera-video')
  if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return showToast('Wait for the camera preview, then capture again.')
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d').drawImage(video, 0, 0)
  const image = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88))
  if (!image) return showToast('Could not capture an image from the camera.')
  if (authSession.demo) {
    closeCameraModal()
    showToast('Camera captured locally. Connect Flask to verify your face.')
    return
  }
  const formData = new FormData()
  formData.append('image', image, 'face-check.jpg')
  try {
    const response = await apiRequest('/verification/face', { method: 'POST', body: formData })
    const result = response?.data || response
    closeCameraModal()
    showToast(result.verified ? 'Face verification successful.' : result.message || 'Face verification did not match.')
  } catch (error) {
    showToast(error.message || 'Face verification failed.', 'error')
  }
}

async function applyToJob(jobTitle, button) {
  const job = jobs.find((item) => item.title === jobTitle)
  if (!job) return
  button.disabled = true
  button.setAttribute('aria-busy', 'true')
  const originalLabel = button.innerHTML
  button.textContent = 'Applying...'
  try {
    let response = null
    if (!authSession.demo) {
      response = await apiRequest('/applications', { method: 'POST', body: { job_id: job.id, resume_id: uploadedResumeId } })
    }
    const date = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date())
    candidateApplications.unshift({ title: job.title, department: job.department, applied: date, status: 'Review', resume: uploadedResumeName || 'No resume attached' })
    job.applicants += 1
    if (!candidates.some((person) => person.name === authSession.name && person.role === job.title)) {
      candidates.unshift({ id: Math.max(...candidates.map((person) => person.id)) + 1, name: authSession.name, initials: initials(authSession.name), role: job.title, email: authSession.email, applied: 'Just now', score: 0, status: 'Review', skills: uploadedResumeName ? ['Resume received'] : [], color: 'peach' })
    }
    remoteLoadedViews.delete('My applications')
    activeView = 'My applications'
    render()
    showToast(response?.message || (authSession.demo ? 'Application saved in the demo.' : 'Application submitted successfully.'))
  } catch (error) {
    button.disabled = false
    button.removeAttribute('aria-busy')
    button.innerHTML = originalLabel
    showToast(error.message || 'Could not submit your application.', 'error')
  }
}

function setFormLoading(form, label, loading) {
  const button = form.querySelector('button[type="submit"]')
  if (!button) return
  if (loading) {
    button.dataset.originalLabel = button.innerHTML
    button.disabled = true
    button.setAttribute('aria-busy', 'true')
    button.innerHTML = `${icon('arrow-repeat')} ${label}`
  } else {
    button.disabled = false
    button.removeAttribute('aria-busy')
    if (button.dataset.originalLabel) button.innerHTML = button.dataset.originalLabel
  }
}

function showFormError(message) {
  const error = document.querySelector('#login-error')
  if (!error) return
  error.textContent = message
  error.hidden = !message
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function enterSession(session) {
  authSession = session
  remoteLoadedViews.clear()
  lastNotificationId = null
  activeRole = session.role
  activeView = roleNavigation[activeRole]?.[0]?.label || 'Overview'
  authMode = 'login'
  forceDemoLogin = false
  render()
}

async function submitLogin(form) {
  const values = new FormData(form)
  const email = String(values.get('email') || '').trim().toLowerCase()
  const password = String(values.get('password') || '')
  if (!isEmailValid(email)) return showFormError('Enter a valid email address.')
  if (password.length < 1) return showFormError('Enter your password.')

  showFormError('')
  setFormLoading(form, 'Loading...', true)
  try {
    if (forceDemoLogin) {
      enterSession(signIn(email, password))
      return
    }
    try {
      const { accessToken, user } = await apiLogin(email, password)
      enterSession(saveSession(user, accessToken))
    } catch (error) {
      if (error.message.startsWith('Cannot reach the backend') && demoAccounts.some((account) => account.email === email) && password === demoPassword) {
        enterSession(signIn(email, password))
        showToast('Demo sign-in. Flask is not connected.')
        return
      }
      throw error
    }
  } catch (error) {
    showFormError(error.message || 'Sign in failed. Please try again.')
    setFormLoading(form, '', false)
  }
}

async function submitRegistration(form) {
  const values = new FormData(form)
  const name = String(values.get('name') || '').trim()
  const email = String(values.get('email') || '').trim().toLowerCase()
  const role = String(values.get('role') || '')
  const password = String(values.get('password') || '')
  const confirmation = String(values.get('confirm') || '')
  if (name.length < 2) return showFormError('Enter your full name.')
  if (!isEmailValid(email)) return showFormError('Enter a valid email address.')
  if (password.length < 8) return showFormError('Use a password with at least 8 characters.')
  if (password !== confirmation) return showFormError('Passwords do not match.')
  if (!['Candidate', 'Employee'].includes(role)) return showFormError('Choose Candidate or Employee.')

  showFormError('')
  setFormLoading(form, 'Creating account...', true)
  try {
    let response
    try {
      response = await apiRegister({ name, email, password, role })
    } catch (error) {
      if (!error.message.startsWith('Cannot reach the backend')) throw error
      enterSession(registerDemo({ name, email, role }))
      showToast('Demo account created in this tab. Connect Flask to register permanently.')
      return
    }
    const accessToken = response?.access_token || response?.token
    const user = response?.user || response?.data?.user
    if (accessToken && user) {
      enterSession(saveSession(user, accessToken))
      showToast('Your account is ready.')
    } else {
      authMode = 'login'
      render()
      const emailInput = document.querySelector('#login-email')
      if (emailInput) emailInput.value = email
      showToast('Registration complete. Sign in with your new account.')
    }
  } catch (error) {
    showFormError(error.message || 'Registration failed. Please try again.')
    setFormLoading(form, '', false)
  }
}

function selectMatchCandidate(id) {
  const matchingCandidates = candidates.filter((person) => person.role === 'Frontend Developer')
  const selected = matchingCandidates.find((person) => person.id === Number(id))
  if (!selected) return
  selectedMatchCandidateId = selected.id
  document.querySelectorAll('[data-match-candidate]').forEach((button) => button.classList.toggle('selected', Number(button.dataset.matchCandidate) === selected.id))
  const details = document.querySelector('#match-selection-details')
  if (details) details.innerHTML = matchSelectionDetails(selected)
  matchSceneController?.select(selected.id)
}

app.addEventListener('click', (event) => {
  const control = event.target.closest('[data-view], [data-action], [data-filter], [data-role], [data-match-candidate], [data-auth-mode]')
  if (!control) return

  if (control.dataset.authMode) {
    authMode = control.dataset.authMode
    forceDemoLogin = false
    loginView()
    return
  }

  if (control.dataset.matchCandidate) {
    selectMatchCandidate(control.dataset.matchCandidate)
    return
  }

  if (control.dataset.role) {
    if (authSession?.role !== 'Administrator') return
    activeRole = control.dataset.role
    activeView = roleNavigation[activeRole][0].label
    candidateFilter = 'All applicants'
    candidateSearch = ''
    document.querySelector('#sidebar')?.classList.remove('is-open')
    render()
    showToast(`Previewing the ${activeRole} interface. This does not sign you in.`)
    return
  }

  if (control.dataset.view) {
    const allowedViews = roleNavigation[activeRole]?.map((item) => item.label) || []
    if (!allowedViews.includes(control.dataset.view) && authSession?.role !== 'Administrator') return
    activeView = control.dataset.view
    document.querySelector('#sidebar')?.classList.remove('is-open')
    render()
    return
  }

  if (control.dataset.filter) {
    candidateFilter = control.dataset.filter
    document.querySelectorAll('.filter-tab').forEach((tab) => tab.classList.toggle('selected', tab.dataset.filter === candidateFilter))
    const results = document.querySelector('#candidate-results')
    if (results) results.innerHTML = candidateRows()
    return
  }

  const { action, id } = control.dataset
  if (action === 'theme-toggle') {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark'
    localStorage.setItem(themeStorageKey, activeTheme)
    applyTheme()
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      const label = activeTheme === 'dark' ? 'Switch to light theme' : 'Switch to black theme'
      button.setAttribute('aria-label', label)
      button.title = label
      button.innerHTML = icon(activeTheme === 'dark' ? 'sun' : 'moon-stars')
    })
    matchSceneController?.setTheme(activeTheme)
  }
  if (action === 'configure-api') {
    const value = window.prompt('Enter your Flask API base URL', getApiBaseUrl())
    if (value === null) return
    try {
      setApiBaseUrl(value)
      remoteLoadedViews.clear()
      showToast('Backend URL saved. Reloading the workspace.')
      window.setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      showToast(error.message || 'The API URL is invalid.', 'error')
    }
  }
  if (action === 'demo-account') {
    const account = demoAccounts.find((item) => item.email === control.dataset.email)
    const emailInput = document.querySelector('#login-email')
    const passwordInput = document.querySelector('#login-password')
    const error = document.querySelector('#login-error')
    if (account && emailInput && passwordInput) {
      forceDemoLogin = true
      emailInput.value = account.email
      passwordInput.value = demoPassword
      if (error) error.hidden = true
      document.querySelector('#login-email')?.focus()
    }
  }
  if (action === 'toggle-password') {
    const passwordInput = document.querySelector('#login-password')
    if (passwordInput) {
      const showPassword = passwordInput.type === 'password'
      passwordInput.type = showPassword ? 'text' : 'password'
      control.setAttribute('aria-label', showPassword ? 'Hide password' : 'Show password')
      control.title = showPassword ? 'Hide password' : 'Show password'
      control.innerHTML = icon(showPassword ? 'eye-slash' : 'eye')
    }
  }
  if (action === 'sign-out') {
    stopRealtimeUpdates()
    signOut()
    window.location.reload()
    return
  }
  if (action === 'toggle-menu') document.querySelector('#sidebar')?.classList.toggle('is-open')
  if (action === 'close-menu') document.querySelector('#sidebar')?.classList.remove('is-open')
  if (action === 'new-job') openJobModal()
  if (action === 'view-candidate') openCandidate(id)
  if (action === 'close-modal') control.closest('.modal-scrim')?.remove()
  if (action === 'open-camera') void openCameraModal()
  if (action === 'close-camera') closeCameraModal()
  if (action === 'capture-face') void captureFace()
  if (action === 'scene-toggle') {
    const playing = matchSceneController?.toggle()
    control.innerHTML = `${icon(playing ? 'pause-fill' : 'play-fill')}<span>${playing ? 'Pause motion' : 'Resume motion'}</span>`
  }
  if (action === 'scene-reset') matchSceneController?.reset()
  if (action === 'profile-menu') {
    const menu = document.querySelector('#role-menu')
    if (menu) menu.hidden = !menu.hidden
  }
  if (action === 'notifications') showToast('You are all caught up.')
  if (action === 'chart-period') showToast('Showing application activity for the last 7 days.')
  if (action === 'pipeline-info') showToast('Pipeline totals are sample dashboard data.')
  if (action === 'apply-job') {
    if (!candidateApplications.some((application) => application.title === control.dataset.title)) void applyToJob(control.dataset.title, control)
  }
  if (action === 'job-applicants') {
    activeView = 'Candidates'
    candidateSearch = control.dataset.title
    candidateFilter = 'All applicants'
    render()
    showToast(`Showing candidate matches for ${control.dataset.title}.`)
  }
  if (action === 'shortlist') {
    const person = candidates.find((candidate) => candidate.id === Number(id))
    if (person) person.status = 'Shortlisted'
    control.closest('.modal-scrim')?.remove()
    render()
    showToast('Candidate added to the shortlist.')
  }
  if (action === 'leave-decision') {
    const request = leaveRequests[Number(control.dataset.index)]
    if (request) {
      request.status = control.dataset.status
      render()
      showToast(`${request.name}'s request ${request.status.toLowerCase()}.`)
    }
  }
  if (action === 'employee-info') showToast(`${control.dataset.name}'s profile is sample data.`)
}
)

app.addEventListener('input', (event) => {
  if (event.target.id === 'login-email' || event.target.id === 'login-password') forceDemoLogin = false
  if (event.target.id === 'candidate-search') {
    candidateSearch = event.target.value
    const results = document.querySelector('#candidate-results')
    if (results) results.innerHTML = candidateRows()
  }
  if (event.target.id === 'employee-search') {
    const results = document.querySelector('#employee-results')
    if (results) results.innerHTML = employeeRows(event.target.value)
  }
  if (event.target.id === 'job-search') {
    jobSearch = event.target.value
    renderJobResults()
  }
})

app.addEventListener('change', async (event) => {
  if (event.target.id === 'job-department-filter') {
    jobDepartment = event.target.value
    renderJobResults()
    return
  }
  if (event.target.id === 'job-sort') {
    jobSort = event.target.value
    renderJobResults()
    return
  }
  if (event.target.id !== 'resume-upload') return
  const file = event.target.files?.[0]
  if (!file) return
  const buttonLabel = document.querySelector('.upload-button span')
  if (buttonLabel) buttonLabel.textContent = authSession.demo ? 'Checking file...' : 'Uploading...'
  await uploadResume(file)
  const description = document.querySelector('#resume-description')
  if (description) description.textContent = uploadedResumeName ? `Ready to attach: ${uploadedResumeName}` : 'Add a PDF or Word document to include with your applications.'
  if (buttonLabel) buttonLabel.textContent = uploadedResumeName ? 'Replace resume' : 'Upload resume'
})

document.addEventListener('submit', async (event) => {
  if (event.target.id === 'login-form') {
    event.preventDefault()
    void submitLogin(event.target)
    return
  }
  if (event.target.id === 'registration-form') {
    event.preventDefault()
    void submitRegistration(event.target)
    return
  }
  if (event.target.id === 'employee-leave-form') {
    event.preventDefault()
    const values = new FormData(event.target)
    const start = String(values.get('start'))
    const end = String(values.get('end'))
    document.querySelector('#leave-end')?.setCustomValidity('')
    if (!start || !end || end < start) {
      document.querySelector('#leave-end')?.setCustomValidity('End date must be on or after the start date.')
      document.querySelector('#leave-end')?.reportValidity()
      return
    }
    const startDate = new Date(`${start}T00:00:00`)
    const endDate = new Date(`${end}T00:00:00`)
    const dayCount = Math.round((endDate - startDate) / 86400000) + 1
    const type = String(values.get('type'))
    const reason = String(values.get('reason')).trim()
    const submitButton = event.target.querySelector('button[type="submit"]')
    if (!authSession.demo) {
      submitButton.disabled = true
      submitButton.textContent = 'Submitting...'
      try {
        await apiRequest('/leave-requests', { method: 'POST', body: { leave_type: type, start_date: start, end_date: end, reason } })
        remoteLoadedViews.delete('Attendance & leave')
        remoteLoadedViews.delete('Leave requests')
      } catch (error) {
        submitButton.disabled = false
        submitButton.innerHTML = `${icon('send')} Submit request`
        showToast(error.message || 'Leave request could not be submitted.', 'error')
        return
      }
    }
    const dateLabel = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit' })
    const employeeName = authSession.name || 'Rohan Deshmukh'
    leaveRequests.unshift({ name: employeeName, initials: initials(employeeName), department: authSession.department || 'Engineering', dates: `${dateLabel.format(startDate)} - ${dateLabel.format(endDate)}`, days: `${dayCount} ${dayCount === 1 ? 'day' : 'days'}`, type, reason, status: 'Pending', color: 'blue' })
    render()
    showToast(authSession.demo ? 'Leave request added to the demo for manager review.' : 'Leave request submitted to your manager.')
    return
  }
  if (event.target.id !== 'job-form') return
  event.preventDefault()
  const values = new FormData(event.target)
  const title = String(values.get('title')).trim()
  const department = String(values.get('department')).trim()
  const location = String(values.get('location')).trim()
  if (!title || !department || !location) return
  const type = String(values.get('type'))
  const submitButton = event.target.querySelector('button[type="submit"]')
  if (!authSession.demo) {
    submitButton.disabled = true
    submitButton.textContent = 'Publishing...'
    try {
      const response = await apiRequest('/jobs', { method: 'POST', body: { title, department, location, employment_type: type } })
      const result = response?.data || response
      jobs.unshift(mapApiJob({ ...result, id: result.id ?? result.job_id, title, department, location, employment_type: type, status: result.status || 'Active', applicants: 0 }, 0))
      remoteLoadedViews.delete('Job openings')
    } catch (error) {
      submitButton.disabled = false
      submitButton.innerHTML = `${icon('plus-lg')} Add opening`
      showToast(error.message || 'Job opening could not be published.', 'error')
      return
    }
  } else {
    jobs.unshift({ id: Date.now(), title, department, type, location, applicants: 0, status: 'Active', icon: 'briefcase', color: 'green' })
  }
  event.target.closest('.modal-scrim').remove()
  activeView = 'Job openings'
  render()
  showToast(authSession.demo ? `${title} added to sample job openings.` : `${title} published successfully.`)
})

document.addEventListener('click', (event) => {
  const control = event.target.closest('.modal-scrim[data-action="close-modal"], .modal-scrim[data-action="close-camera"], button[data-action="close-modal"], button[data-action="close-camera"], button[data-action="capture-face"]')
  if (!control || app.contains(control)) return
  if (control.classList.contains('modal-scrim') && event.target !== control) return
  if (control.dataset.action === 'close-camera') closeCameraModal()
  if (control.dataset.action === 'close-modal') control.closest('.modal-scrim')?.remove()
  if (control.dataset.action === 'capture-face') void captureFace()
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelector('.modal-scrim')?.remove()
    if (cameraStream) closeCameraModal()
    document.querySelector('#sidebar')?.classList.remove('is-open')
  }
})

render()
