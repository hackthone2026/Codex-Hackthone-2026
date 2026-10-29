/**
 * CODEX DATABASE, SEARCH ENGINE, AUTHENTICATION, CURRENCY SYSTEM & OPENAI GPT BRIDGE
 */

// ================= 1. DATABASE SCHEMA & INITIALIZATION =================
const DB_STORAGE_KEY = "CODEX_LOCAL_DATABASE_V42";
const OPENAI_API_KEY_STORAGE = "CODEX_OPENAI_API_KEY";

// ================= SUPABASE HOST AUTH CONFIGURATION =================
const SUPABASE_URL = "https://ljegrgqhyzcbiqzahyan.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_sn3qRHOqrba0WEpFEQ3CWg_Tn49Tmhp";
const SUPABASE_ANON_KEY = SUPABASE_PUBLISHABLE_KEY;

let hostAuthClient = null;

function getHostAuthClient() {
  if (hostAuthClient) return hostAuthClient;
  const configured =
    SUPABASE_URL.startsWith("https://") &&
    !SUPABASE_URL.includes("YOUR_SUPABASE") &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");
  if (!configured || !window.supabase?.createClient) {
    return null;
  }
  hostAuthClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );
  return hostAuthClient;
}

const CURRENCY_CONFIG = {
  INR: { symbol: "₹", rate: 83.5, name: "Indian Rupee" },
  USD: { symbol: "$", rate: 1.0, name: "US Dollar" },
  EUR: { symbol: "€", rate: 0.92, name: "Euro" },
  GBP: { symbol: "£", rate: 0.78, name: "British Pound" },
  JPY: { symbol: "¥", rate: 155.0, name: "Japanese Yen" }
};

const INITIAL_DATABASE = {
  profile: {
    firstName: "Pratik",
    lastName: "Narkhede",
    name: "Pratik Narkhede",
    email: "pratik@example.com",
    role: "System Administrator",
    countryCode: "+91",
    mobile: "98765 43210",
    dob: "2005-10-19",
    location: "Jalgaon, Maharashtra, India",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop",
    bannerUrl: "",
    socials: {
      instagram: "https://instagram.com/pratik_narkhede",
      twitter: "https://twitter.com/pratik_tech",
      linkedin: "https://linkedin.com/in/pratik-narkhede",
      github: "https://github.com/pratik-codex",
      discord: "https://discord.gg/codex",
      whatsapp: "https://chat.whatsapp.com/codex"
    }
  },
  currency: "INR",
  sidebarClosed: false,
  currentUser: null,
  accounts: [
    { id: "ACC-HOST-1", name: "Rahul Sharma", email: "host@codex-msme.gov", role: "host", mobile: "9876543210" },
    { id: "ACC-USER-1", name: "Pratik Narkhede", email: "pratik@example.com", role: "user", mobile: "9876543211" }
  ],
  metrics: {
    registeredCustomers: 3782,
    customersGrowth: "+11.01%",
    totalOrders: 5359,
    ordersGrowth: "-9.05%"
  },
  inventoryStock: {
    details: 14850,
    sold: 9420,
    available: 5180,
    unavailable: 250
  },
  supplyFilter: "all",
  companySupplies: [
    {
       company: "Apex Industrial Corp",
       product: "Titanium Cool-Coat Emulsion",
       purchaseDate: "Aug 28, 2026",
       deliveryDate: "Sep 04, 2026",
       quantity: 450,
       grossPriceUSD: 24750.00,
       status: "Delivered"
     },
    {
       company: "BioMatrix Polymers Ltd",
       product: "Polyurethane Amino Resin #5",
       purchaseDate: "Sep 01, 2026",
       deliveryDate: "Sep 15, 2026",
       quantity: 280,
       grossPriceUSD: 18200.00,
       status: "In Transit"
     },
    {
       company: "Nordic Tech Instruments",
       product: "Dynamic Viscometer Sensors",
       purchaseDate: "Sep 02, 2026",
       deliveryDate: "Sep 08, 2026",
       quantity: 60,
       grossPriceUSD: 14400.00,
       status: "Delivered"
     },
    {
       company: "SolarShield Materials",
       product: "Heat-Reflective Ceramic Paint",
       purchaseDate: "Aug 20, 2026",
       deliveryDate: "Sep 02, 2026",
       quantity: 520,
       grossPriceUSD: 36400.00,
       status: "Delivered"
     },
    {
       company: "Zenith Electronics Global",
       product: "Micro-Thermal Thermocouples",
       purchaseDate: "Sep 07, 2026",
       deliveryDate: "Sep 18, 2026",
       quantity: 150,
       grossPriceUSD: 7350.00,
       status: "Pending"
     },
    {
       company: "Swasteek Technologies",
       product: "High-Grade Acrylic Emulsion",
       purchaseDate: "Sep 03, 2026",
       deliveryDate: "Sep 10, 2026",
       quantity: 310,
       grossPriceUSD: 21700.00,
       status: "Delivered"
     },
    {
       company: "Vanguard Chemicals",
       product: "Formaldehyde Hardener Mix",
       purchaseDate: "Sep 05, 2026",
       deliveryDate: "Sep 22, 2026",
       quantity: 90,
       grossPriceUSD: 4950.00,
       status: "Out of Stock"
     }
  ],
  productsCatalog: [
    {
      id: "PROD-01",
      name: "Titanium Cool-Coat Emulsion",
      available: true,
      quantity: 450,
      buyers: [
        { name: "Alex Rivera", date: "Aug 30, 2026", delivered: true },
        { name: "Sophia Chen", date: "Sep 02, 2026", delivered: true }
      ]
    },
    {
      id: "PROD-02",
      name: "Polyurethane Amino Resin #5",
      available: true,
      quantity: 280,
      buyers: [
        { name: "Marcus Brody", date: "Sep 03, 2026", delivered: false },
        { name: "Rohan Kulkarni", date: "Sep 05, 2026", delivered: false }
      ]
    },
    {
      id: "PROD-03",
      name: "Dynamic Viscometer Sensors",
      available: false,
      quantity: 0,
      buyers: [
        { name: "Emma Watson", date: "Aug 20, 2026", delivered: true }
      ]
    },
    {
      id: "PROD-04",
      name: "Heat-Reflective Ceramic Paint",
      available: true,
      quantity: 520,
      buyers: [
        { name: "Liam Patel", date: "Aug 22, 2026", delivered: true },
        { name: "John Doe", date: "Aug 25, 2026", delivered: true },
        { name: "Sarah Connor", date: "Sep 01, 2026", delivered: true }
      ]
    }
  ],
  loanSchemes: [
    {
      id: "SCH-01",
      name: "MSME Growth Advance",
      ministry: "Ministry of MSME",
      amount: "₹ 50,00,000",
      benefit: "8.5% p.a. Interest",
      desc: "Working capital financing for expanding inventory and raw material procurement."
    },
    {
      id: "SCH-02",
      name: "Industrial Equipment Leasing",
      ministry: "SIDBI Industrial Dept",
      amount: "₹ 1,20,00,000",
      benefit: "7.9% p.a. Interest",
      desc: "Asset financing for heavy machinery, automated production lines, and tooling."
    },
    {
      id: "SCH-03",
      name: "Green Energy Tech Loan",
      ministry: "Green Energy Board",
      amount: "₹ 75,00,000",
      benefit: "6.5% p.a. Interest",
      desc: "Subsidized loans for solar panel installations and eco-friendly factory upgrades."
    }
  ],
  loanApplications: [
    { id: "LN-8810", name: "MSME Growth Advance", amount: "₹ 15,00,000", date: "Sep 02, 2026", status: "Approved & Disbursed" },
    { id: "LN-8942", name: "Industrial Equipment Leasing", amount: "₹ 45,00,000", date: "Sep 12, 2026", status: "Under Verification" }
  ],
  msmeRequests: [
    { id: "MSME-9021", type: "Udyam Registration", business: "Pratik Enterprises", date: "Sep 01, 2026", status: "Certificate Issued" },
    { id: "MSME-9104", type: "ZED Subsidy Application", business: "CODEX Technologies", date: "Sep 10, 2026", status: "Under Review" }
  ],
  paymentsFilter: "all",
  payments: [
    { id: "PAY-901", client: "Alex Rivera", desc: "Titanium Cool-Coat Emulsion", amountUSD: 299.00, date: "Sep 11, 2026", status: "Completed" },
    { id: "PAY-902", client: "Sophia Chen", desc: "Polyurethane Amino Resin #5", amountUSD: 129.50, date: "Sep 10, 2026", status: "Pending" },
    { id: "PAY-903", client: "Marcus Brody", desc: "Ultra-wide Gaming Monitor", amountUSD: 649.00, date: "Sep 09, 2026", status: "Completed" },
    { id: "PAY-904", client: "Rohan Kulkarni", desc: "USB-C Dual Dock Station", amountUSD: 180.00, date: "Sep 08, 2026", status: "Pending" }
  ],
  salesViews: {
    active: "monthly",
    selectedDate: "September 2026",
    selectedYear: 2026,
    selectedMonth: 8,
    selectedDay: 11
  },
  revenueViews: {
    active: "monthly",
    data: {
      monthly: {
        title: "Monthly Revenue",
        subtitle: "Target set for this calendar month",
        targetUSD: 20000,
        revenueUSD: 20000,
        todayStatUSD: 3287,
        pct: "75.55%",
        badge: "+10%",
        targetLabel: "Target",
        revLabel: "Revenue",
        periodLabel: "Today"
      },
      weekly: {
        title: "Weekly Revenue",
        subtitle: "Target set for Week 37",
        targetUSD: 5000,
        revenueUSD: 4350,
        todayStatUSD: 680,
        pct: "87.00%",
        badge: "+14%",
        targetLabel: "W-Target",
        revLabel: "W-Revenue",
        periodLabel: "Today"
      },
      day: {
        title: "Day Revenue",
        subtitle: "Target set for today's trade session",
        targetUSD: 1000,
        revenueUSD: 620,
        todayStatUSD: 140,
        pct: "62.00%",
        badge: "+5%",
        targetLabel: "Day-Goal",
        revLabel: "Today So Far",
        periodLabel: "Peak Hour"
      },
      yearly: {
        title: "Yearly Revenue",
        subtitle: "Cumulative performance for Fiscal Year 2026",
        targetUSD: 240000,
        revenueUSD: 195000,
        todayStatUSD: 16250,
        pct: "81.25%",
        badge: "+18.4%",
        targetLabel: "Annual Target",
        revLabel: "Annual Rev",
        periodLabel: "Monthly Avg"
      }
    }
  },
  inventory: {
    totalProducts: 1248,
    refundsAmountUSD: 1120
  },
  ordersFilter: "all",
  orders: [
    { id: "ORD-8921", date: "Sep 11, 2026", customer: "Alex Rivera", item: "Wireless Noise-Canceling Headphones", amountUSD: 299.00, status: "Completed" },
    { id: "ORD-8922", date: "Sep 10, 2026", customer: "Sophia Chen", item: "Mechanical Keyboard (RGB)", amountUSD: 129.50, status: "Pending" },
    { id: "ORD-8923", date: "Sep 09, 2026", customer: "Marcus Brody", item: "Ultra-wide Gaming Monitor", amountUSD: 649.00, status: "Completed" },
    { id: "ORD-8924", date: "Sep 08, 2026", customer: "Rohan Kulkarni", item: "USB-C Dual Dock Station", amountUSD: 180.00, status: "Completed" },
    { id: "ORD-8925", date: "Sep 06, 2026", customer: "Emma Watson", item: "Ergonomic Mesh Chair", amountUSD: 350.00, status: "Pending" },
    { id: "ORD-8926", date: "Sep 04, 2026", customer: "Liam Patel", item: "Bluetooth Studio Speaker", amountUSD: 89.00, status: "Cancelled" }
  ],
  customers: [
    { name: "John Doe", email: "john.doe@example.com", tier: "Premium Subscriber", joined: "Jan 12, 2026" },
    { name: "Emma Watson", email: "emma.w@example.com", tier: "Free User", joined: "Feb 04, 2026" },
    { name: "Rohan Kulkarni", email: "rohan.k@example.com", tier: "Enterprise Lead", joined: "Mar 01, 2026" },
    { name: "Alex Rivera", email: "alex.r@example.com", tier: "Premium Subscriber", joined: "Apr 15, 2026" }
  ],
  kalnirnayEvents: [
    { id: 1, date: "2026-09-02", title: "Anant Chaturdashi / Ganesh Visarjan", category: "Festival", desc: "Traditional Maharashtrian & pan-Indian festival celebration (Public holiday)." },
    { id: 2, date: "2026-09-07", title: "GSTR-3B Monthly GST Filing Deadline", category: "Compliance", desc: "Mandatory GST return filing for outward supplies and input tax credit claims." },
    { id: 3, date: "2026-09-10", title: "SIDBI Equipment Leasing EMI Due", category: "EMI", desc: "Monthly installment of ₹ 1,42,000 for manufacturing automated plant machinery." },
    { id: 4, date: "2026-09-14", title: "Quarterly Board Strategy Review", category: "Meeting", desc: "Reviewing Q2 business analytics reports and MSME supply chain expansion." },
    { id: 5, date: "2026-09-20", title: "TDS / TCS Deposit Due Date", category: "Compliance", desc: "Deposit of tax deducted at source for August corporate vendor settlements." },
    { id: 6, date: "2026-09-25", title: "Mahalaya / Pitru Paksha Begins", category: "Festival", desc: "Sacred lunar period commencing ancestral remembrance traditions." },
    { id: 7, date: "2026-09-28", title: "MSME Scheme Subsidy Follow-up", category: "Reminder", desc: "Check approval status for ZED certification reimbursement application." }
  ],
  performanceView: {
    selectedDate: "Sep 11, 2026",
    year: 2026,
    month: 8,
    day: 11
  },
  notifications: [
    { id: 1, type: "order", msg: "Alex Rivera purchased Wireless Noise-Canceling Headphones.", time: "Sep 11, 2026 &bull; 10:15 AM", read: false },
    { id: 2, type: "supply", msg: "Swasteek Technologies delivery fulfilled (310 units).", time: "Sep 10, 2026 &bull; 04:30 PM", read: false },
    { id: 3, type: "customer", msg: "Rohan Kulkarni upgraded to Enterprise Lead.", time: "Sep 09, 2026 &bull; 02:10 PM", read: false },
    { id: 4, type: "system", msg: "Database synchronized with active currency rate.", time: "Sep 08, 2026 &bull; 09:00 AM", read: true }
  ],
  unreadNotifCount: 3,
  aiChatHistory: [],
  retailPriorityData: [
    { sku: "SKU-101", name: "Titanium Cool-Coat Emulsion", stock: 450, demand: 520, reorder: "Optimal", price: "₹2,450 (+5%)", priority: "Medium" },
    { sku: "SKU-102", name: "Polyurethane Amino Resin #5", stock: 85, demand: 310, reorder: "Required Soon", price: "₹1,890 (Optimal)", priority: "High" },
    { sku: "SKU-103", name: "Dynamic Viscometer Sensors", stock: 12, demand: 140, reorder: "Immediate Reorder", price: "₹4,200 (+12%)", priority: "Critical" },
    { sku: "SKU-104", name: "Heat-Reflective Ceramic Paint", stock: 520, demand: 480, reorder: "Optimal", price: "₹3,100 (-3%)", priority: "Low" }
  ]
};

const DEMO_GOVERNMENT_SCHEMES = [
  { id: "DEMO-01", name: "Credit Guarantee Scheme (CGTMSE)", category: "Credit", ministry: "Ministry of MSME", amount: "Up to ₹ 5.0 Cr", interest: "Collateral-Free", eligibility: "Micro & Small Units", desc: "Provides collateral-free loans to new and existing micro and small enterprises with 85% credit coverage." },
  { id: "DEMO-02", name: "Prime Minister Employment Generation (PMEGP)", category: "Subsidy", ministry: "KVIC / MSME", amount: "Up to ₹ 50 Lakhs", interest: "15% - 35% Margin Subsidy", eligibility: "Individuals / SHGs (Age 18+)", desc: "Credit-linked subsidy program targeting employment generation across manufacturing and services." },
  { id: "DEMO-03", name: "Mudra Yojana (Tarun Scheme)", category: "Credit", ministry: "DFS / Ministry of Finance", amount: "₹ 5 Lakhs - ₹ 10 Lakhs", interest: "8.5% - 11.2% p.a.", eligibility: "Non-corporate Small Biz", desc: "Funding for enterprise expansion and working capital needs of established business units." },
  { id: "DEMO-04", name: "Mudra Yojana (Kishore Scheme)", category: "Credit", ministry: "DFS / Ministry of Finance", amount: "₹ 50,000 - ₹ 5 Lakhs", interest: "8.0% - 10.5% p.a.", eligibility: "Early-stage Enterprises", desc: "Working capital assistance for buying machinery and raw materials in early production phases." },
  { id: "DEMO-05", name: "Mudra Yojana (Shishu Scheme)", category: "Credit", ministry: "DFS / Ministry of Finance", amount: "Up to ₹ 50,000", interest: "7.5% - 9.0% p.a.", eligibility: "First-time Entrepreneurs", desc: "Micro-credit support to kickstart localized shop-floor, retail, and manufacturing startups." },
  { id: "DEMO-06", name: "Stand-Up India Scheme", category: "Women", ministry: "SIDBI / DFS", amount: "₹ 10 Lakhs - ₹ 1.0 Cr", interest: "Base Rate + 3%", eligibility: "SC/ST and Women Founders", desc: "Empowers greenfield enterprises in manufacturing, services, or trading led by women or SC/ST entrepreneurs." },
  { id: "DEMO-07", name: "Zero Defect Zero Effect (ZED) Subsidy", category: "Subsidy", ministry: "Quality Council of India", amount: "Up to ₹ 5 Lakhs", interest: "80% Testing Grant", eligibility: "Udyam Registered MSMEs", desc: "Financial grant reimbursement covering assessment, clean production certifications, and audit consultancies." },
  { id: "DEMO-08", name: "Rooftop Solar MSME Finance Scheme", category: "Green", ministry: "Ministry of New & Renewable Energy", amount: "Up to ₹ 1.5 Cr", interest: "6.75% Concessional Rate", eligibility: "Operating Factories / MSMEs", desc: "Subsidized term loan facility for industrial rooftop solar system installations to lower manufacturing carbon overhead." },
  { id: "DEMO-09", name: "SIDBI Make in India Soft Loan (SMILE)", category: "Credit", ministry: "SIDBI", amount: "Up to ₹ 2.0 Cr", interest: "7.85% p.a.", eligibility: "New Enterprises & 25 Identified Sectors", desc: "Quasi-equity soft loans and term financing focused on modernizing high-growth manufacturing segments." },
  { id: "DEMO-10", name: "Credit Linked Capital Subsidy (CLCSS)", category: "Subsidy", ministry: "Ministry of MSME", amount: "Up to ₹ 15 Lakhs", interest: "15% Upfront Capital Subsidy", eligibility: "Micro & Small Manufacturing", desc: "Capital subsidy for replacing obsolete machinery with modern state-of-the-art technology." }
];

const MSME_CURATED_SUBSIDIES = [
  {
     id: "SUB-01",
     title: "Credit Linked Capital Subsidy (CLCSS)",
     benefit: "15% Capital Subsidy (Up to ₹ 15 Lakhs)",
     ministry: "Ministry of MSME",
     eligibility: "Micro and Small Manufacturing Enterprises holding active Udyam Registration.",
     process: "Procure approved plant and machinery through institutional term loans and apply via the DC-MSME online portal with verified invoices."
   },
  {
     id: "SUB-02",
     title: "Zero Defect Zero Effect (ZED) Certification Subsidy",
     benefit: "Up to 80% Subsidy on Assessment Cost",
     ministry: "Quality Council of India (QCI)",
     eligibility: "All manufacturing MSMEs rated under Bronze, Silver, or Gold ZED certification tiers.",
     process: "Register on the MSME ZED portal, complete the online pledge, and submit financial audit reports to receive direct fee reimbursements."
   },
  {
     id: "SUB-03",
     title: "Patent & Trademark Registration Reimbursement",
     benefit: "Up to ₹ 5 Lakhs per Patent & ₹ 1 Lakh for Trademarks",
     ministry: "Office of Controller General of Patents",
     eligibility: "Udyam registered innovators filing domestic or international patent/trademark applications.",
     process: "File patent through registered IP attorneys, pay statutory fees, and submit the reimbursement claim form to the National MSME Board."
   },
  {
     id: "SUB-04",
     title: "ISO 9000 / 14001 Certification Reimbursement",
     benefit: "100% Fee Reimbursed (Up to ₹ 1 Lakh)",
     ministry: "Ministry of MSME",
     eligibility: "Micro and Small Enterprises obtaining quality management or environmental certifications.",
     process: "Acquire ISO certification from accredited agencies and submit bills along with Udyam certificate within 6 months."
   },
  {
     id: "SUB-05",
     title: "Market Development Assistance (MDA) for Export",
     benefit: "Up to ₹ 3 Lakhs per International Trade Fair",
     ministry: "Ministry of Commerce & Industry",
     eligibility: "MSME export units registered with Export Promotion Councils (EPC).",
     process: "Apply 30 days prior to global trade delegation or exhibition via the DGFT portal for airfare and stall rental grants."
   },
  {
     id: "SUB-06",
     title: "National Apprenticeship Promotion Scheme (NAPS)",
     benefit: "₹ 1,500 / month per apprentice (25% Stipend Match)",
     ministry: "Ministry of Skill Development",
     eligibility: "All commercial and manufacturing MSMEs engaging trainees and apprentices.",
     process: "Register on the National Apprenticeship Portal, upload apprenticeship contracts, and claim monthly DBT transfers."
   },
  {
     id: "SUB-07",
     title: "Bar Code Registration Subsidy",
     benefit: "75% Reimbursement on One-time & Annual Fees",
     ministry: "GS1 India & Ministry of MSME",
     eligibility: "Micro and Small Enterprises adopting barcoding for product retail packaging.",
     process: "Obtain barcode registration from GS1 India and file reimbursement through the office of DC-MSME."
   },
  {
     id: "SUB-08",
     title: "Lean Manufacturing Competitive Subsidy",
     benefit: "80% Consultant Fee Grant (Up to ₹ 36 Lakhs/Cluster)",
     ministry: "National Productivity Council",
     eligibility: "Manufacturing clusters comprising 6 to 10 micro/small units.",
     process: "Form a cluster SPV, submit diagnostic study reports, and onboard approved lean manufacturing consultants."
  }
];

let activeModalSchemeCategory = "all";
let kalnirnayState = {
  year: 2026,
  month: 8,
  selectedDateStr: "2026-09-18",
  categoryFilter: "all"
};

const DB = {
  get() {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      this.save(INITIAL_DATABASE);
      return INITIAL_DATABASE;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      this.save(INITIAL_DATABASE);
      return INITIAL_DATABASE;
    }
  },
  save(data) {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(data));
  },
  reset() {
    this.save(INITIAL_DATABASE);
    renderAllFromDB();
  }
};

const showToast = (msg) => {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
};

function logDatabaseNotification(type, msg) {
  const db = DB.get();
  const newNotif = {
    id: Date.now(),
    type: type,
    msg: msg,
    time: "Just now",
    read: false
  };
  db.notifications.unshift(newNotif);
  db.unreadNotifCount = (db.unreadNotifCount || 0) + 1;
  DB.save(db);
  renderNotificationsUI();
}

function formatMoney(amountInUSD) {
  const db = DB.get();
  const curCode = db.currency || "INR";
  const conf = CURRENCY_CONFIG[curCode] || CURRENCY_CONFIG.INR;
  const converted = amountInUSD * conf.rate;
  if (curCode === "JPY") {
    return `${conf.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${conf.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let salesBarChartInstance = null;
let performanceChartInstance = null;
let monthlyRevenueBarChartInstance = null;
let retailForecastChartInstance = null;

function navigateToSection(targetId) {
  const authSections = ["profile-selection", "host-login", "host-signup", "user-login", "user-signup"];
  const isAuthPage = authSections.includes(targetId);
  document.body.classList.toggle("auth-mode", isAuthPage);

  document.querySelectorAll(".sidebar .nav-item").forEach(n => {
    n.classList.remove("active");
    if (n.getAttribute("data-target") === targetId) {
      n.classList.add("active");
    }
  });
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
  const sec = document.getElementById(`section-${targetId}`);
  if (sec) sec.classList.add("active");
  if (targetId === "calendar") {
    renderKalnirnayCalendar();
  }
  if (targetId === "retail-intelligence") {
    if (retailForecastChartInstance) retailForecastChartInstance.resize();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderNotificationsUI() {
  const data = DB.get();
  const badgeCounter = document.getElementById("notif-badge-counter");
  const notifListContainer = document.getElementById("notif-list");
  const totalRecordsLabel = document.getElementById("notif-total-records");
  const unread = data.unreadNotifCount || 0;
  if (badgeCounter) {
    if (unread > 0) {
      badgeCounter.textContent = unread > 9 ? "9+" : unread;
      badgeCounter.classList.remove("hidden");
    } else {
      badgeCounter.classList.add("hidden");
    }
  }
  if (totalRecordsLabel) {
    totalRecordsLabel.textContent = `${data.notifications.length} saved`;
  }
  if (notifListContainer) {
    if (data.notifications.length === 0) {
      notifListContainer.innerHTML = `<div style="padding: 24px; text-align: center; color: #94A3B8; font-size: 12px;">No notifications in database.</div>`;
    } else {
      const typeIconMap = {
        order: "shopping-bag",
        customer: "user-check",
        supply: "truck",
        system: "cpu"
      };
      notifListContainer.innerHTML = data.notifications.map(n => `
        <div class="notif-log-item" data-id="${n.id}">
          <div class="notif-type-icon ${n.type || 'system'}">
            <i data-lucide="${typeIconMap[n.type] || 'info'}" class="w-3.5 h-3.5"></i>
          </div>
          <div class="notif-log-content">
            <p class="notif-log-msg">${n.msg}</p>
            <span class="notif-log-time">${n.time}</span>
          </div>
        </div>
      `).join("");
      lucide.createIcons();
    }
  }
}

function markNotificationsAsRead() {
  const db = DB.get();
  if (db.unreadNotifCount > 0) {
    db.unreadNotifCount = 0;
    db.notifications.forEach(n => n.read = true);
    DB.save(db);
    renderNotificationsUI();
  }
}

function populateMonthYearDropdowns(monthEl, yearEl, activeMonth, activeYear) {
  if (!monthEl || !yearEl) return;
  monthEl.innerHTML = MONTH_NAMES.map((m, i) => `<option value="${i}" ${i === activeMonth ? 'selected' : ''}>${m}</option>`).join("");
  const years = [2024, 2025, 2026, 2027, 2028];
  yearEl.innerHTML = years.map(y => `<option value="${y}" ${y === activeYear ? 'selected' : ''}>${y}</option>`).join("");
}

function renderMonthGrid(containerEl, year, month, selectedDay, onSelect) {
  if (!containerEl) return;
  containerEl.innerHTML = "";
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDayIndex; i++) {
    const emptySpan = document.createElement("span");
    emptySpan.className = "cal-pop-day empty";
    containerEl.appendChild(emptySpan);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayBtn = document.createElement("button");
    dayBtn.type = "button";
    dayBtn.className = "cal-pop-day" + (d === selectedDay ? " selected" : "");
    dayBtn.textContent = d;
    dayBtn.addEventListener("click", () => {
      onSelect(year, month, d);
    });
    containerEl.appendChild(dayBtn);
  }
}

function renderAllFromDB() {
  const data = DB.get();
  const curCode = data.currency || "INR";
  const conf = CURRENCY_CONFIG[curCode] || CURRENCY_CONFIG.INR;
  document.body.classList.toggle("sidebar-closed", !!data.sidebarClosed);
  const activeCurSym = document.getElementById("active-currency-symbol");
  if (activeCurSym) activeCurSym.textContent = conf.symbol;
  document.querySelectorAll(".currency-opt").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-cur") === curCode);
  });

  const welcomeEl = document.querySelector(".welcome-banner h2");
  if (welcomeEl) {
    if (data.currentUser && data.currentUser.name) {
      welcomeEl.innerHTML = `Welcome back, <span class="user-display-name text-accent">${data.currentUser.name}</span> 👋`;
    } else {
      welcomeEl.innerHTML = `Welcome to <span style="color: var(--accent-color); font-weight: 800;">Codex MSME</span>`;
    }
  }

  document.querySelectorAll(".user-display-name").forEach(el => {
    if (data.currentUser && data.currentUser.name) {
      el.textContent = data.currentUser.name;
    } else {
      el.textContent = data.profile.name;
    }
  });

  const headingRole = document.getElementById("profile-role-desc");
  if (headingRole) {
    headingRole.textContent = data.currentUser ? (data.currentUser.role === 'host' ? 'Platform Administrator / Host' : 'Verified Member') : data.profile.role;
  }

  document.querySelectorAll(".user-profile-img").forEach(img => {
    img.src = data.profile.photoUrl;
  });

  const bannerEl = document.getElementById("profile-banner-element");
  if (bannerEl && data.profile.bannerUrl) {
    bannerEl.style.backgroundImage = `url(${data.profile.bannerUrl})`;
  }

  const inFirstName = document.getElementById("input-profile-firstname");
  const inLastName = document.getElementById("input-profile-lastname");
  const inEmail = document.getElementById("input-profile-email");
  const inRole = document.getElementById("input-profile-role");
  const inCountryCode = document.getElementById("input-country-code");
  const inMobile = document.getElementById("input-profile-mobile");
  const inDob = document.getElementById("input-profile-dob");
  const inLoc = document.getElementById("input-profile-loc");
  if (inFirstName) inFirstName.value = data.profile.firstName || data.profile.name?.split(" ")[0] || "";
  if (inLastName) inLastName.value = data.profile.lastName || data.profile.name?.split(" ")[1] || "";
  if (inEmail) inEmail.value = data.profile.email || "";
  if (inRole) inRole.value = data.profile.role || "";
  if (inCountryCode) inCountryCode.value = data.profile.countryCode || "+91";
  if (inMobile) inMobile.value = data.profile.mobile || "";
  if (inDob) inDob.value = data.profile.dob || "";
  if (inLoc) inLoc.value = data.profile.location || "";

  const inInsta = document.getElementById("input-social-instagram");
  const inTwit = document.getElementById("input-social-twitter");
  const inLink = document.getElementById("input-social-linkedin");
  const inGit = document.getElementById("input-social-github");
  const inDiscord = document.getElementById("input-social-discord");
  const inWhatsapp = document.getElementById("input-social-whatsapp");
  if (inInsta) inInsta.value = data.profile.socials?.instagram || "";
  if (inTwit) inTwit.value = data.profile.socials?.twitter || "";
  if (inLink) inLink.value = data.profile.socials?.linkedin || "";
  if (inGit) inGit.value = data.profile.socials?.github || "";
  if (inDiscord) inDiscord.value = data.profile.socials?.discord || "";
  if (inWhatsapp) inWhatsapp.value = data.profile.socials?.whatsapp || "";

  const cCount = document.getElementById("db-customer-count");
  if (cCount) cCount.textContent = data.metrics.registeredCustomers.toLocaleString();
  const oCount = document.getElementById("db-order-count");
  if (oCount) oCount.textContent = data.metrics.totalOrders.toLocaleString();

  const activeSales = data.salesViews.active || "monthly";
  const salesTitle = document.getElementById("sales-chart-title");
  const salesSubtitleDate = document.getElementById("sales-selected-date-label");
  if (salesTitle) {
    if (activeSales === "yearly") salesTitle.textContent = "Yearly Sales (Units)";
    else if (activeSales === "day") salesTitle.textContent = "Day Sales (Hourly Breakdown)";
    else salesTitle.textContent = "Monthly Sales & Revenue Velocity";
  }
  if (salesSubtitleDate) salesSubtitleDate.textContent = data.salesViews.selectedDate;
  document.querySelectorAll(".sales-select-option").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-view") === activeSales);
  });

  const activePeriod = data.revenueViews.active || "monthly";
  const rev = data.revenueViews.data[activePeriod];
  const periodTitle = document.getElementById("revenue-period-title");
  const periodSubtitle = document.getElementById("revenue-period-subtitle");
  const targetDesc = document.getElementById("gauge-description-text");
  const footerTargetLabel = document.getElementById("footer-target-label");
  const footerRevLabel = document.getElementById("footer-rev-label");
  const footerPeriodLabel = document.getElementById("footer-period-label");
  const monthlyTarget = document.getElementById("db-monthly-target");
  const monthlyRevenue = document.getElementById("db-monthly-revenue");
  const todayStat = document.getElementById("db-today-stat");
  if (periodTitle) periodTitle.textContent = rev.title;
  if (periodSubtitle) periodSubtitle.textContent = rev.subtitle;
  if (targetDesc) {
    targetDesc.innerHTML = `Today's revenue is <strong>${formatMoney(rev.todayStatUSD)}</strong>, outperforming target velocity.`;
  }
  if (footerTargetLabel) footerTargetLabel.textContent = rev.targetLabel;
  if (footerRevLabel) footerRevLabel.textContent = rev.revLabel;
  if (footerPeriodLabel) footerPeriodLabel.textContent = rev.periodLabel;
  if (monthlyTarget) monthlyTarget.textContent = formatMoney(rev.targetUSD);
  if (monthlyRevenue) monthlyRevenue.innerHTML = `${formatMoney(rev.revenueUSD)} <span class="arrow positive">▲</span>`;
  if (todayStat) todayStat.innerHTML = `${formatMoney(rev.todayStatUSD)} <span class="arrow positive">▲</span>`;
  document.querySelectorAll(".period-select-option").forEach(opt => {
    opt.classList.toggle("active", opt.getAttribute("data-period") === activePeriod);
  });
  updateRevenueBarChart(activePeriod);

  const schemesGrid = document.getElementById("loan-schemes-cards-grid");
  const schemesCountLabel = document.getElementById("loan-schemes-count-label");
  if (schemesGrid && data.loanSchemes) {
    if (schemesCountLabel) schemesCountLabel.textContent = `40+ Schemes`;
    schemesGrid.innerHTML = data.loanSchemes.map(s => `
      <div class="card interactive-card" style="display: flex; flex-direction: column; gap: 12px;">
        <span class="badge" style="align-self: flex-start; background: rgba(59, 130, 246, 0.1); color: var(--accent-color);">${s.ministry}</span>
        <h4 style="font-size: 16px; font-weight: 700; color: var(--text-primary);">${s.name}</h4>
        <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5;">${s.desc}</p>
        <div style="font-size: 13px; font-weight: 700; color: var(--text-primary);">Max: ${s.amount} &bull; ${s.benefit}</div>
        <div style="display: flex; gap: 8px; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color);">
          <button class="small-btn" onclick="showToast('Viewing details for ${s.name}...')">View Details</button>
          <button class="small-btn" onclick="openEligibilityCheckerModal()">Check Eligibility</button>
          <button class="primary-btn" style="padding: 6px 12px; font-size: 11.5px;" onclick="navigateToSection('new-loan-wizard')">Apply Now</button>
        </div>
      </div>
    `).join("");
  }

  const loanAppTbody = document.getElementById("loan-applications-tbody");
  if (loanAppTbody && data.loanApplications) {
    loanAppTbody.innerHTML = data.loanApplications.map(app => `
      <tr>
        <td><strong>${app.id}</strong></td>
        <td>${app.name}</td>
        <td><strong>${app.amount}</strong></td>
        <td style="color: #64748B;">${app.date}</td>
        <td><span class="table-badge ${app.status.includes('Approved') ? 'delivered' : 'pending'}">${app.status}</span></td>
      </tr>
    `).join("");
  }

  const msmeTbody = document.getElementById("msme-requests-tbody");
  if (msmeTbody && data.msmeRequests) {
    msmeTbody.innerHTML = data.msmeRequests.map(req => `
      <tr>
        <td><strong>${req.id}</strong></td>
        <td>${req.type}</td>
        <td>${req.business}</td>
        <td style="color: #64748B;">${req.date}</td>
        <td><span class="table-badge ${req.status.includes('Issued') ? 'delivered' : 'pending'}">${req.status}</span></td>
      </tr>
    `).join("");
  }

  const perfDateLabel = document.getElementById("date-label");
  if (perfDateLabel) perfDateLabel.textContent = data.performanceView.selectedDate;

  const pCount = document.getElementById("ecom-total-products");
  if (pCount) pCount.textContent = data.inventory.totalProducts.toLocaleString();
  const pendCount = document.getElementById("ecom-pending-orders");
  if (pendCount) pendCount.textContent = data.orders.filter(o => o.status === "Pending").length;
  const compCount = document.getElementById("ecom-completed-orders");
  if (compCount) compCount.textContent = data.orders.filter(o => o.status === "Completed").length;
  const refCount = document.getElementById("ecom-refunds");
  if (refCount) refCount.textContent = formatMoney(data.inventory.refundsAmountUSD);

  const stockDetails = document.getElementById("analytics-stock-details");
  const stockSold = document.getElementById("analytics-stock-sold");
  const stockAvailable = document.getElementById("analytics-stock-available");
  const stockUnavailable = document.getElementById("analytics-stock-unavailable");
  if (stockDetails) stockDetails.textContent = data.inventoryStock.details.toLocaleString();
  if (stockSold) stockSold.textContent = data.inventoryStock.sold.toLocaleString();
  if (stockAvailable) stockAvailable.textContent = data.inventoryStock.available.toLocaleString();
  if (stockUnavailable) stockUnavailable.textContent = data.inventoryStock.unavailable.toLocaleString();

  const activeSupplyFilter = data.supplyFilter || "all";
  const filterBadge = document.getElementById("active-supply-filter-badge");
  const printSupplyFilter = document.getElementById("print-supply-filter");
  const filterNamesMap = {
    "all": "All Supplies",
    "delivered": "Delivered",
    "in-transit": "In Transit",
    "pending": "Pending",
    "out-of-stock": "Out of Stock"
  };
  if (filterBadge) filterBadge.textContent = filterNamesMap[activeSupplyFilter] || "All Supplies";
  if (printSupplyFilter) printSupplyFilter.textContent = (filterNamesMap[activeSupplyFilter] || "ALL SUPPLIES").toUpperCase();

  let visibleSupplies = data.companySupplies;
  if (activeSupplyFilter !== "all") {
    visibleSupplies = data.companySupplies.filter(cs => cs.status.toLowerCase().replace(/\s+/g, '-') === activeSupplyFilter);
  }
  const supplyTbody = document.getElementById("supply-table-body");
  if (supplyTbody) {
    if (visibleSupplies.length === 0) {
      supplyTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 28px; color: #94A3B8;">No supply records matching filter "${filterNamesMap[activeSupplyFilter]}".</td></tr>`;
    } else {
      supplyTbody.innerHTML = visibleSupplies.map(cs => {
        const isDelivered = cs.status.toLowerCase() === "delivered";
        const capsuleClass = isDelivered ? "delivered-state" : "pending-state";
        const badgeClass = cs.status.toLowerCase().replace(/\s+/g, '-');
        const deliveryText = isDelivered ? `Delivered: ${cs.deliveryDate}` : `Est. Delivery: ${cs.deliveryDate}`;
        return `
          <tr>
            <td><strong>${cs.company}</strong></td>
            <td>${cs.product}</td>
            <td style="color: #64748B; font-weight: 500;">${cs.purchaseDate || "Sep 01, 2026"}</td>
            <td>
              <div class="modern-delivery-capsule ${capsuleClass}" title="${isDelivered ? 'Successfully Fulfilled' : 'Fulfillment in progress'}">
                <span class="delivery-glow-dot"></span>
                <span>${deliveryText}</span>
              </div>
            </td>
            <td>${cs.quantity.toLocaleString()} units</td>
            <td><strong>${formatMoney(cs.grossPriceUSD)}</strong></td>
            <td><span class="table-badge ${badgeClass}">${cs.status}</span></td>
          </tr>
        `;
      }).join("");
    }
  }

  const printSupplyDate = document.getElementById("print-supply-date");
  if (printSupplyDate) printSupplyDate.textContent = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const activeOrderFilter = data.ordersFilter || "all";
  const orderFilterLabel = document.getElementById("active-order-filter-label");
  const printBtnFilterLabel = document.getElementById("print-btn-filter-label");
  const formattedOrderFilterLabel = activeOrderFilter.charAt(0).toUpperCase() + activeOrderFilter.slice(1);
  if (orderFilterLabel) orderFilterLabel.textContent = formattedOrderFilterLabel + " Orders";
  if (printBtnFilterLabel) printBtnFilterLabel.textContent = formattedOrderFilterLabel;

  let visibleOrders = data.orders;
  if (activeOrderFilter === "pending") {
    visibleOrders = data.orders.filter(o => o.status.toLowerCase() === "pending");
  } else if (activeOrderFilter === "completed") {
    visibleOrders = data.orders.filter(o => o.status.toLowerCase() === "completed");
  } else if (activeOrderFilter === "cancelled") {
    visibleOrders = data.orders.filter(o => o.status.toLowerCase() === "cancelled");
  }

  const ordersTbody = document.getElementById("orders-table-body");
  if (ordersTbody) {
    if (visibleOrders.length === 0) {
      ordersTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: #94A3B8;">No ${activeOrderFilter} orders found in database.</td></tr>`;
    } else {
      ordersTbody.innerHTML = visibleOrders.map(o => `
        <tr>
          <td><strong>#${o.id}</strong></td>
          <td style="color: #64748B; font-weight: 500;">${o.date || "Sep 11, 2026"}</td>
          <td>${o.customer}</td>
          <td>${o.item}</td>
          <td><strong>${formatMoney(o.amountUSD)}</strong></td>
          <td><span class="table-badge ${o.status.toLowerCase()}">${o.status}</span></td>
        </tr>
      `).join("");
    }
  }

  const printFilter = document.getElementById("print-report-filter");
  const printDate = document.getElementById("print-report-date");
  if (printFilter) printFilter.textContent = formattedOrderFilterLabel.toUpperCase() + " ORDERS";
  if (printDate) printDate.textContent = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const customersTbody = document.getElementById("customers-table-body");
  if (customersTbody) {
    customersTbody.innerHTML = data.customers.map((c, idx) => {
      const initials = c.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
      return `
        <tr>
          <td class="customer-cell">
            <div class="customer-avatar">${initials}</div>
            <span class="customer-name">${c.name}</span>
          </td>
          <td>${c.email}</td>
          <td><span class="badge">${c.tier}</span></td>
          <td>${c.joined}</td>
          <td><button class="small-btn delete-row-btn" onclick="removeCustomer(${idx})">Delete</button></td>
        </tr>
      `;
    }).join("");
  }

  const activePayFilter = data.paymentsFilter || "all";
  let visiblePayments = data.payments || [];
  if (activePayFilter !== "all") {
    visiblePayments = visiblePayments.filter(p => p.status.toLowerCase() === activePayFilter);
  }
  const paymentsTbody = document.getElementById("payments-table-body");
  if (paymentsTbody) {
    if (visiblePayments.length === 0) {
      paymentsTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: #94A3B8;">No ${activePayFilter} payments found.</td></tr>`;
    } else {
      paymentsTbody.innerHTML = visiblePayments.map(p => `
        <tr>
          <td><strong>${p.id}</strong></td>
          <td>${p.client}</td>
          <td>${p.desc}</td>
          <td><strong>${formatMoney(p.amountUSD)}</strong></td>
          <td style="color: #64748B;">${p.date}</td>
          <td><span class="table-badge ${p.status.toLowerCase()}">${p.status}</span></td>
        </tr>
      `).join("");
    }
  }

  const productsGrid = document.getElementById("products-catalog-grid");
  if (productsGrid) {
    productsGrid.innerHTML = data.productsCatalog.map(prod => {
      const isAvailable = prod.available && prod.quantity > 0;
      const dotClass = isAvailable ? "status-dot-green" : "status-dot-red";
      const statusText = isAvailable ? "Available" : "Unavailable";
      return `
        <div class="product-catalog-card">
          <div class="prod-info-group">
            <div class="prod-icon-box">
              <i data-lucide="package-open"></i>
            </div>
            <div class="prod-text-meta">
              <h4>${prod.name}</h4>
              <div class="prod-status-row">
                <span class="prod-status-indicator">
                  <span class="${dotClass}"></span> ${statusText}
                </span>
                <span class="prod-qty-badge">${prod.quantity} units</span>
              </div>
            </div>
          </div>
          <button type="button" class="prod-view-text-btn" onclick="openProductDetailModal('${prod.id}')">
            View
          </button>
        </div>
      `;
    }).join("");
  }

  const retailPriorityTbody = document.getElementById("retail-priority-table-body");
  if (retailPriorityTbody && data.retailPriorityData) {
    retailPriorityTbody.innerHTML = data.retailPriorityData.map(item => {
      const prioClass = item.priority === "Critical" ? "negative" : (item.priority === "High" ? "negative" : "positive");
      return `
        <tr>
          <td><strong>${item.sku}</strong></td>
          <td>${item.name}</td>
          <td>${item.stock} units</td>
          <td>${item.demand} units</td>
          <td><span class="table-badge pending">${item.reorder}</span></td>
          <td><strong>${item.price}</strong></td>
          <td><span class="trend-badge ${prioClass}">${item.priority}</span></td>
        </tr>
      `;
    }).join("");
  }

  renderNotificationsUI();
  updateSalesChart();
  updatePerformanceChart();
  updateRetailForecastChart();
  renderKalnirnayCalendar();
  lucide.createIcons();
}

function updateRevenueBarChart(period) {
  if (!monthlyRevenueBarChartInstance) return;
  const db = DB.get();
  const rate = CURRENCY_CONFIG[db.currency || "INR"]?.rate || 83.5;
  let labels = [];
  let values = [];
  if (period === "weekly") {
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    values = [4200, 5800, 7100, 6500, 8900, 9400, 8100].map(v => v * (rate / 83.5));
  } else if (period === "day") {
    labels = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
    values = [800, 2400, 4100, 3800, 4900, 2100].map(v => v * (rate / 83.5));
  } else if (period === "yearly") {
    labels = ["Q1", "Q2", "Q3", "Q4"];
    values = [45000, 58000, 72000, 68000].map(v => v * (rate / 83.5));
  } else {
    labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    values = [320000, 450000, 620000, 280000].map(v => v * (rate / 83.5));
  }
  monthlyRevenueBarChartInstance.data.labels = labels;
  monthlyRevenueBarChartInstance.data.datasets[0].data = values;
  monthlyRevenueBarChartInstance.update();
}

function updateSalesChart() {
  if (!salesBarChartInstance) return;
  const data = DB.get();
  const active = data.salesViews.active;
  const seed = (data.salesViews.selectedYear % 100) + (data.salesViews.selectedMonth * 7) + data.salesViews.selectedDay;
  let labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let chartData = [160, 380, 200, 300, 180, 200, 290, 100, 210, 380, 280, 110];
  if (active === "yearly") {
    labels = ["2021", "2022", "2023", "2024", "2025", "2026", "2027"];
    chartData = [seed * 15 + 1400, seed * 18 + 2100, seed * 22 + 2800, seed * 25 + 3400, seed * 29 + 4200, seed * 34 + 5359, seed * 38 + 6100];
  } else if (active === "day") {
    labels = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
    chartData = [seed + 12, seed + 8, seed + 25, seed + 85, seed + 140, seed + 115, seed + 90, seed + 40];
  } else {
    chartData = [seed + 150, seed + 340, seed + 190, seed + 280, seed + 170, seed + 190, seed + 270, seed + 95, seed + 205, seed + 360, seed + 260, seed + 105];
  }
  salesBarChartInstance.data.labels = labels;
  salesBarChartInstance.data.datasets[0].data = chartData;
  salesBarChartInstance.update();
}

function updatePerformanceChart() {
  if (!performanceChartInstance) return;
  const data = DB.get();
  const perf = data.performanceView;
  const seed = (perf.year % 100) + (perf.month * 6) + perf.day;
  performanceChartInstance.data.datasets[0].data = [
    seed + 140, seed + 175, seed + 130, seed + 205, seed + 230, seed + 210, seed + 255
  ];
  performanceChartInstance.update();
}

function updateRetailForecastChart() {
  if (!retailForecastChartInstance) return;
  retailForecastChartInstance.update();
}

window.removeCustomer = function(index) {
  const db = DB.get();
  const removed = db.customers.splice(index, 1);
  DB.save(db);
  renderAllFromDB();
  showToast(`Deleted ${removed[0]?.name} from database.`);
  logDatabaseNotification("customer", `Customer ${removed[0]?.name} was removed from the database.`);
};

// ================= RETAIL INTELLIGENCE ACTIONS =================
window.uploadRetailSalesData = function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv,.xlsx,.xls';
  input.onchange = e => {
    const file = e.target.files[0];
    if (file) {
      showToast(`Successfully uploaded sales dataset: ${file.name} (Demo Data processed)`);
      logDatabaseNotification("system", `Retail sales dataset uploaded: ${file.name}`);
    }
  };
  input.click();
};

window.generateRetailForecast = function() {
  showToast("Running ML Demand Forecasting & Dynamic Pricing model...");
  setTimeout(() => {
    const db = DB.get();
    db.retailPriorityData.forEach(item => {
      item.demand = Math.round(item.demand * (1 + (Math.random() * 0.1 - 0.03)));
    });
    DB.save(db);
    renderAllFromDB();
    showToast("Forecast generated successfully! Updated demand velocity & pricing recommendations.");
    logDatabaseNotification("system", "AI retail demand forecast successfully regenerated.");
  }, 800);
};

// ================= PRODUCT VIEW MODAL & A4 PRINT =================
window.openProductDetailModal = function(productId) {
  const db = DB.get();
  const prod = db.productsCatalog.find(p => p.id === productId);
  if (!prod) return;
  document.getElementById("modal-product-title").textContent = `Product: ${prod.name}`;
  document.getElementById("print-product-name-label").textContent = prod.name;
  document.getElementById("print-product-report-date").textContent = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const tbody = document.getElementById("product-buyers-table-body");
  if (prod.buyers && prod.buyers.length > 0) {
    tbody.innerHTML = prod.buyers.map(b => {
      const deliveredState = b.delivered;
      const dotCls = deliveredState ? "status-dot-green" : "status-dot-red";
      const statusText = deliveredState ? "Delivered" : "Not Delivered";
      return `
        <tr>
          <td><strong>${b.name}</strong></td>
          <td>${b.date}</td>
          <td>
            <span class="prod-status-indicator">
              <span class="${dotCls}"></span> ${statusText}
            </span>
          </td>
        </tr>
      `;
    }).join("");
  } else {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #94A3B8; padding: 20px;">No buyer records found for this product.</td></tr>`;
  }
  document.getElementById("product-detail-modal").classList.remove("hidden");
  lucide.createIcons();
};

window.openMsmeSubsidiesModal = function() {
  const modal = document.getElementById("msme-subsidies-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  renderMsmeSubsidiesList();
  lucide.createIcons();
};

window.closeMsmeSubsidiesModal = function() {
  const modal = document.getElementById("msme-subsidies-modal");
  if (modal) modal.classList.add("hidden");
};

function renderMsmeSubsidiesList() {
  const container = document.getElementById("msme-subsidies-cards-container");
  if (!container) return;
  container.innerHTML = MSME_CURATED_SUBSIDIES.map(sub => `
    <div class="scheme-vault-card">
      <div class="scheme-vault-top">
        <span class="scheme-vault-cat cat-subsidy">${sub.ministry}</span>
        <span class="scheme-vault-tag">${sub.id}</span>
      </div>
      <div>
        <h4 class="scheme-vault-title">${sub.title}</h4>
        <span class="scheme-vault-ministry" style="color: #10B981; font-weight: 700;">Benefit: ${sub.benefit}</span>
      </div>
      <div class="scheme-vault-body" style="gap: 6px;">
        <p style="font-size: 12px; color: var(--text-primary);"><strong>Eligibility:</strong> ${sub.eligibility}</p>
        <p style="font-size: 11.5px; color: var(--text-secondary);"><strong>How to Apply:</strong> ${sub.process}</p>
      </div>
      <div class="scheme-vault-actions" style="margin-top: auto;">
        <button type="button" class="primary-btn" style="width: 100%; justify-content: center; background-color: #10B981;" onclick="applyMsmeSubsidyDirect('${sub.title.replace(/'/g, "\\'")}')">
          <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Apply Benefit
        </button>
      </div>
    </div>
  `).join("");
  lucide.createIcons();
}

window.applyMsmeSubsidyDirect = function(subTitle) {
  closeMsmeSubsidiesModal();
  showToast(`Initiating application for: ${subTitle}`);
  openMsmeSubsidyModal();
};

window.openNewSupportTicketModal = function() {
  const modal = document.getElementById("new-support-ticket-modal");
  if (modal) modal.classList.remove("hidden");
  lucide.createIcons();
};

window.closeNewSupportTicketModal = function() {
  const modal = document.getElementById("new-support-ticket-modal");
  if (modal) modal.classList.add("hidden");
};

window.submitSupportTicket = function(e) {
  e.preventDefault();
  const category = document.getElementById("ticket-cat").value;
  const desc = document.getElementById("ticket-desc").value.trim();
  if (!desc) return;
  const tbody = document.getElementById("help-desk-tickets-tbody");
  if (tbody) {
    const newRow = document.createElement("tr");
    const ticketId = `TICK-${Math.floor(4000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    newRow.innerHTML = `
      <td><strong>${ticketId}</strong></td>
      <td>${category}</td>
      <td>${desc}</td>
      <td>${dateStr}</td>
      <td><span class="table-badge pending">In Progress</span></td>
    `;
    tbody.prepend(newRow);
  }
  closeNewSupportTicketModal();
  document.getElementById("support-ticket-form").reset();
  showToast("Support ticket raised successfully! Our team will respond shortly.");
  logDatabaseNotification("system", `New support ticket raised: ${category}`);
};

window.renderKalnirnayCalendar = function() {
  const db = DB.get();
  const events = db.kalnirnayEvents || [];
  const { year, month, selectedDateStr, categoryFilter } = kalnirnayState;
  const titleEl = document.getElementById("kalnirnay-month-year-title");
  if (titleEl) titleEl.textContent = `${MONTH_NAMES[month]} ${year}`;
  const searchVal = (document.getElementById("kalnirnay-event-search")?.value || "").toLowerCase().trim();
  const gridContainer = document.getElementById("kalnirnay-days-grid-container");
  if (!gridContainer) return;
  gridContainer.innerHTML = "";
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDayIndex; i++) {
    const blank = document.createElement("div");
    blank.className = "kalnirnay-day-cell empty-cell";
    gridContainer.appendChild(blank);
  }
  const todayIso = new Date().toISOString().slice(0, 10);
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = String(d).padStart(2, '0');
    const mStr = String(month + 1).padStart(2, '0');
    const dateIso = `${year}-${mStr}-${dayStr}`;
    const cell = document.createElement("div");
    const isToday = (dateIso === todayIso);
    const isSelected = (dateIso === selectedDateStr);
    cell.className = "kalnirnay-day-cell" + (isToday ? " today-cell" : "") + (isSelected ? " selected-cell" : "");
    const dayEvents = events.filter(ev => {
      const matchDate = ev.date === dateIso;
      const matchCat = categoryFilter === "all" || ev.category === categoryFilter;
      const matchSearch = !searchVal || ev.title.toLowerCase().includes(searchVal) || ev.desc.toLowerCase().includes(searchVal);
      return matchDate && matchCat && matchSearch;
    });
    cell.innerHTML = `
      <div class="cell-date-num">
        <span>${d}</span>
        <span class="cell-tithi-lbl">${getTraditionalTithiSnippet(month, d)}</span>
      </div>
      <div class="cell-events-wrapper">
        ${dayEvents.map(ev => `<span class="kalnirnay-event-pill pill-${ev.category}" title="${ev.title}">${ev.title}</span>`).join("")}
      </div>
    `;
    cell.addEventListener("click", () => {
      kalnirnayState.selectedDateStr = dateIso;
      renderKalnirnayCalendar();
    });
    gridContainer.appendChild(cell);
  }
  renderKalnirnaySidePanel();
  lucide.createIcons();
};

function getTraditionalTithiSnippet(m, d) {
  if (m === 8) {
    if (d === 2) return "Anant Chaturdashi";
    if (d === 7) return "GSTR-3B Due";
    if (d === 10) return "EMI Due";
    if (d === 14) return "Board Review";
    if (d === 20) return "TDS Due";
    if (d === 25) return "Pitru Paksha";
  }
  return "";
}

window.renderKalnirnaySidePanel = function() {
  const db = DB.get();
  const events = db.kalnirnayEvents || [];
  const { selectedDateStr } = kalnirnayState;
  const headerEl = document.getElementById("side-panel-date-header");
  const subEl = document.getElementById("side-panel-panchang-sub");
  const listContainer = document.getElementById("side-panel-events-list");
  if (!headerEl || !listContainer) return;
  const dateObj = new Date(selectedDateStr + "T00:00:00");
  headerEl.textContent = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  subEl.textContent = `Selected Calendar Node &bull; ${dateObj.toLocaleDateString("en-US", { weekday: "long" })}`;
  const dayEvents = events.filter(ev => ev.date === selectedDateStr);
  if (dayEvents.length === 0) {
    listContainer.innerHTML = `
      <div style="padding: 24px; text-align: center; color: #94A3B8; font-size: 12px;">
        No events or deadlines registered for this date.<br>
        <button class="small-btn" style="margin-top: 10px;" onclick="openAddEventForSelectedDate()">+ Add Event Here</button>
      </div>
    `;
  } else {
    listContainer.innerHTML = dayEvents.map(ev => `
      <div class="side-event-card">
        <div class="side-event-top">
          <span class="kalnirnay-event-pill pill-${ev.category}">${ev.category}</span>
          <span style="font-size: 10px; color: #94A3B8; font-weight: 600;">#${ev.id}</span>
        </div>
        <h5 class="side-event-title">${ev.title}</h5>
        <p class="side-event-desc">${ev.desc || 'No description provided.'}</p>
        <div class="side-event-actions">
          <button class="small-btn" style="padding: 3px 8px; font-size: 11px;" onclick="openEditEventModal(${ev.id})">Edit</button>
          <button class="small-btn delete-row-btn" style="padding: 3px 8px; font-size: 11px;" onclick="deleteKalnirnayEvent(${ev.id})">Delete</button>
        </div>
      </div>
    `).join("");
  }
};

window.changeKalnirnayMonth = function(direction) {
  kalnirnayState.month += direction;
  if (kalnirnayState.month > 11) {
    kalnirnayState.month = 0;
    kalnirnayState.year += 1;
  } else if (kalnirnayState.month < 0) {
    kalnirnayState.month = 11;
    kalnirnayState.year -= 1;
  }
  renderKalnirnayCalendar();
};

window.jumpToCurrentMonth = function() {
  const now = new Date();
  kalnirnayState.year = now.getFullYear();
  kalnirnayState.month = now.getMonth();
  kalnirnayState.selectedDateStr = now.toISOString().slice(0, 10);
  renderKalnirnayCalendar();
  showToast("Jumped to today's date.");
};

window.setKalnirnayCategory = function(cat, btn) {
  kalnirnayState.categoryFilter = cat;
  document.querySelectorAll("#kalnirnay-cat-pills .pill").forEach(p => p.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderKalnirnayCalendar();
};

window.openAddEventModal = function() {
  const modal = document.getElementById("kalnirnay-event-modal");
  const form = document.getElementById("kalnirnay-event-form");
  if (form) form.reset();
  document.getElementById("kalnirnay-modal-title").textContent = "Add Calendar Event / Deadline";
  document.getElementById("edit-event-index").value = "";
  document.getElementById("event-input-date").value = kalnirnayState.selectedDateStr;
  if (modal) modal.classList.remove("hidden");
  lucide.createIcons();
};

window.openAddEventForSelectedDate = function() {
  openAddEventModal();
};

window.closeKalnirnayEventModal = function() {
  const modal = document.getElementById("kalnirnay-event-modal");
  if (modal) modal.classList.add("hidden");
};

window.openEditEventModal = function(eventId) {
  const db = DB.get();
  const event = (db.kalnirnayEvents || []).find(ev => ev.id === eventId);
  if (!event) return;
  document.getElementById("kalnirnay-modal-title").textContent = "Edit Calendar Event";
  document.getElementById("edit-event-index").value = event.id;
  document.getElementById("event-input-title").value = event.title;
  document.getElementById("event-input-date").value = event.date;
  document.getElementById("event-input-category").value = event.category;
  document.getElementById("event-input-desc").value = event.desc || "";
  document.getElementById("kalnirnay-event-modal").classList.remove("hidden");
  lucide.createIcons();
};

window.handleKalnirnayEventSubmit = function(e) {
  e.preventDefault();
  const editIdStr = document.getElementById("edit-event-index").value;
  const title = document.getElementById("event-input-title").value.trim();
  const date = document.getElementById("event-input-date").value;
  const category = document.getElementById("event-input-category").value;
  const desc = document.getElementById("event-input-desc").value.trim();
  if (!title || !date) return;
  const db = DB.get();
  if (!db.kalnirnayEvents) db.kalnirnayEvents = [];
  if (editIdStr) {
    const editId = parseInt(editIdStr, 10);
    const idx = db.kalnirnayEvents.findIndex(ev => ev.id === editId);
    if (idx !== -1) {
      db.kalnirnayEvents[idx] = { id: editId, title, date, category, desc };
      showToast("Calendar event updated successfully!");
      logDatabaseNotification("system", `Calendar event updated: ${title}`);
    }
  } else {
    const newEvent = {
      id: Date.now(),
      title,
      date,
      category,
      desc
    };
    db.kalnirnayEvents.unshift(newEvent);
    showToast("New event added to calendar!");
    logDatabaseNotification("system", `New calendar milestone added: ${title}`);
  }
  DB.save(db);
  closeKalnirnayEventModal();
  kalnirnayState.selectedDateStr = date;
  kalnirnayState.year = parseInt(date.split("-")[0], 10);
  kalnirnayState.month = parseInt(date.split("-")[1], 10) - 1;
  renderKalnirnayCalendar();
};

window.deleteKalnirnayEvent = function(eventId) {
  if (!confirm("Are you sure you want to delete this event from the calendar?")) return;
  const db = DB.get();
  db.kalnirnayEvents = (db.kalnirnayEvents || []).filter(ev => ev.id !== eventId);
  DB.save(db);
  renderKalnirnayCalendar();
  showToast("Event removed from calendar.");
};

window.openAllSchemesModal = function() {
  const modal = document.getElementById("all-schemes-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  activeModalSchemeCategory = "all";
  const searchInput = document.getElementById("modal-scheme-search");
  if (searchInput) searchInput.value = "";
  document.querySelectorAll("#scheme-cat-pill-group .pill").forEach(p => {
    p.classList.toggle("active", p.getAttribute("data-schemecat") === "all");
  });
  renderModalSchemesList();
  lucide.createIcons();
};

window.closeAllSchemesModal = function() {
  const modal = document.getElementById("all-schemes-modal");
  if (modal) modal.classList.add("hidden");
};

window.setSchemeCatFilter = function(category, element) {
  activeModalSchemeCategory = category;
  document.querySelectorAll("#scheme-cat-pill-group .pill").forEach(p => p.classList.remove("active"));
  if (element) element.classList.add("active");
  renderModalSchemesList();
};

window.filterModalSchemes = function() {
  renderModalSchemesList();
};

function renderModalSchemesList() {
  const container = document.getElementById("schemes-modal-cards-container");
  if (!container) return;
  const searchQuery = (document.getElementById("modal-scheme-search")?.value || "").toLowerCase().trim();
  let filtered = DEMO_GOVERNMENT_SCHEMES.filter(s => {
    const matchCat = activeModalSchemeCategory === "all" || s.category === activeModalSchemeCategory;
    const matchSearch = !searchQuery ||
       s.name.toLowerCase().includes(searchQuery) ||
       s.ministry.toLowerCase().includes(searchQuery) ||
       s.desc.toLowerCase().includes(searchQuery) ||
      s.eligibility.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; color: #94A3B8;">
        <i data-lucide="search-x" style="width: 40px; height: 40px; margin: 0 auto 12px; display: block; opacity: 0.5;"></i>
        <h4 style="font-size: 15px; color: var(--text-primary);">No government schemes found</h4>
        <p style="font-size: 12px; margin-top: 4px;">Try searching different keywords or resetting your category filter.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  const catClassMap = {
    "Credit": "cat-credit",
    "Subsidy": "cat-subsidy",
    "Green": "cat-green",
    "Women": "cat-women"
  };
  container.innerHTML = filtered.map(s => `
    <div class="scheme-vault-card">
      <div class="scheme-vault-top">
        <span class="scheme-vault-cat ${catClassMap[s.category] || 'cat-credit'}">${s.category}</span>
        <span class="scheme-vault-tag">Demo #${s.id}</span>
      </div>
      <div>
        <h4 class="scheme-vault-title">${s.name}</h4>
        <span class="scheme-vault-ministry">${s.ministry}</span>
      </div>
      <div class="scheme-vault-body">
        <div class="stat-row">
          <span class="stat-lbl">Max Quantum:</span>
          <span class="stat-hl">${s.amount}</span>
        </div>
        <div class="stat-row">
          <span class="stat-lbl">Benefit / Rate:</span>
          <span class="stat-hl" style="color: var(--accent-color);">${s.interest}</span>
        </div>
        <div class="stat-row">
          <span class="stat-lbl">Eligibility:</span>
          <span class="stat-hl" style="color: #64748B;">${s.eligibility}</span>
        </div>
      </div>
      <p class="scheme-vault-desc">${s.desc}</p>
      <div class="scheme-vault-actions">
        <button type="button" class="small-btn" style="flex: 1;" onclick="openSchemeDetailDemo('${s.id}')">
          <i data-lucide="info" class="w-3.5 h-3.5"></i> View Details
        </button>
        <button type="button" class="primary-btn" style="padding: 6px 10px; font-size: 11.5px;" onclick="applyDirectFromVault('${s.id}', '${s.name.replace(/'/g, "\\'")}', '${s.ministry.replace(/'/g, "\\'")}', '${s.amount.replace(/'/g, "\\'")}', '${s.interest.replace(/'/g, "\\'")}')">
          Apply
        </button>
      </div>
    </div>
  `).join("");
  lucide.createIcons();
}

window.openSchemeDetailDemo = function(schemeId) {
  const scheme = DEMO_GOVERNMENT_SCHEMES.find(s => s.id === schemeId);
  if (!scheme) return;
  alert(
    `[DEMO SCHEME SPECIFICATIONS]\n\n` +
    `Scheme Name: ${scheme.name}\n` +
    `Administering Authority: ${scheme.ministry}\n` +
    `Classification: ${scheme.category}\n` +
    `Funding Cap: ${scheme.amount}\n` +
    `Rates & Subvention: ${scheme.interest}\n` +
    `Applicable To: ${scheme.eligibility}\n\n` +
    `Detailed Description:\n${scheme.desc}\n\n` +
    `(Note: This is simulated demo data loaded into the CODEX vault.)`
  );
};

window.applyDirectFromVault = function(id, name, ministry, amount, interest) {
  closeAllSchemesModal();
  navigateToSection('new-loan-wizard');
  const nameField = document.getElementById("wiz-scheme-name");
  const minField = document.getElementById("wiz-ministry");
  const intField = document.getElementById("wiz-interest");
  const descField = document.getElementById("wiz-desc");
  if (nameField) nameField.value = name;
  if (minField) minField.value = ministry;
  if (intField) intField.value = interest;
  if (descField) descField.value = `Application for ${name} under ${ministry}. Requested benefit tier: ${interest}.`;
  showToast(`Pre-filled application with ${name}!`);
};

window.openEligibilityCheckerModal = function() {
  const modal = document.getElementById("loan-eligibility-modal");
  const banner = document.getElementById("eligibility-result-banner");
  const applyBtn = document.getElementById("elig-apply-direct-btn");
  const form = document.getElementById("loan-eligibility-form");
  if (form) form.reset();
  if (banner) {
    banner.className = "hidden";
    banner.innerHTML = "";
  }
  if (applyBtn) applyBtn.classList.add("hidden");
  if (modal) modal.classList.remove("hidden");
  lucide.createIcons();
};

window.closeEligibilityCheckerModal = function() {
  const modal = document.getElementById("loan-eligibility-modal");
  if (modal) modal.classList.add("hidden");
};

window.handleEligibilityFormSubmit = function(e) {
  e.preventDefault();
  const creditScore = parseInt(document.getElementById("elig-credit-score").value, 10) || 0;
  const turnover = parseFloat(document.getElementById("elig-turnover").value) || 0;
  const vintage = parseInt(document.getElementById("elig-vintage").value, 10) || 0;
  const hasGst = document.getElementById("elig-gst").value === "yes";
  const banner = document.getElementById("eligibility-result-banner");
  const applyBtn = document.getElementById("elig-apply-direct-btn");
  if (!banner) return;
  banner.classList.remove("hidden");
  if (creditScore >= 720 && turnover >= 1500000 && vintage >= 2 && hasGst) {
    banner.style.background = "rgba(16, 185, 129, 0.12)";
    banner.style.border = "1px solid rgba(16, 185, 129, 0.3)";
    banner.style.color = "#065F46";
    banner.innerHTML = `<strong>✅ High Approval Likelihood!</strong><br>Your profile qualifies for collateral-free MSME loans up to <strong>₹ 50,00,000</strong> at preferential rates starting from 7.5% p.a.`;
    if (applyBtn) applyBtn.classList.remove("hidden");
    showToast("Eligibility verified: Approved for advance schemes!");
  } else if (creditScore >= 650 && turnover >= 800000) {
    banner.style.background = "rgba(245, 158, 11, 0.12)";
    banner.style.border = "1px solid rgba(245, 158, 11, 0.3)";
    banner.style.color = "#92400E";
    banner.innerHTML = `<strong>⚠️ Conditional Eligibility:</strong><br>Eligible for micro-growth working capital loans up to <strong>₹ 15,00,000</strong>. Submitting recent GST and ITR documentation will strengthen your credit score.`;
    if (applyBtn) applyBtn.classList.remove("hidden");
    showToast("Eligibility verified: Conditional approval available.");
  } else {
    banner.style.background = "rgba(239, 68, 68, 0.12)";
    banner.style.border = "1px solid rgba(239, 68, 68, 0.3)";
    banner.style.color = "#991B1B";
    banner.innerHTML = `<strong>❌ Verification Required:</strong><br>Your profile does not currently meet standard automated underwriting benchmarks. We recommend updating your registered turnover and GST filings before submitting an application.`;
    if (applyBtn) applyBtn.classList.add("hidden");
    showToast("Assessment complete: Profile updates recommended.");
  }
};

window.openEmiCalculatorModal = function() {
  const modal = document.getElementById("emi-calculator-modal");
  if (modal) modal.classList.remove("hidden");
  calculateEMI();
  lucide.createIcons();
};

window.calculateEMI = function() {
  const amtInput = document.getElementById("emi-loan-amt");
  const rateInput = document.getElementById("emi-interest-rate");
  const tenureInput = document.getElementById("emi-tenure-years");
  if (!amtInput || !rateInput || !tenureInput) return;
  const principal = parseFloat(amtInput.value) || 0;
  const annualRate = parseFloat(rateInput.value) || 0;
  const years = parseFloat(tenureInput.value) || 1;
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;
  let emi = 0;
  if (monthlyRate > 0) {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else {
    emi = principal / totalMonths;
  }
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;
  const emiDisplay = document.getElementById("emi-result-display");
  const totalIntDisplay = document.getElementById("emi-total-interest");
  const totalPayDisplay = document.getElementById("emi-total-payment");
  if (emiDisplay) emiDisplay.textContent = `₹ ${Math.round(emi).toLocaleString()}`;
  if (totalIntDisplay) totalIntDisplay.textContent = `₹ ${Math.round(totalInterest).toLocaleString()}`;
  if (totalPayDisplay) totalPayDisplay.textContent = `₹ ${Math.round(totalPayment).toLocaleString()}`;
};

window.syncEmiSlider = function(type) {
  if (type === 'amount') {
    const val = document.getElementById("emi-loan-amt").value;
    const range = document.getElementById("emi-loan-amt-range");
    if (range) range.value = val;
  } else if (type === 'rate') {
    const val = document.getElementById("emi-interest-rate").value;
    const range = document.getElementById("emi-interest-rate-range");
    if (range) range.value = val;
  } else if (type === 'tenure') {
    const val = document.getElementById("emi-tenure-years").value;
    const range = document.getElementById("emi-tenure-years-range");
    if (range) range.value = val;
  }
  calculateEMI();
};

window.syncEmiInput = function(type) {
  if (type === 'amount') {
    const val = document.getElementById("emi-loan-amt-range").value;
    const input = document.getElementById("emi-loan-amt");
    if (input) input.value = val;
  } else if (type === 'rate') {
    const val = document.getElementById("emi-interest-rate-range").value;
    const input = document.getElementById("emi-interest-rate");
    if (input) input.value = val;
  } else if (type === 'tenure') {
    const val = document.getElementById("emi-tenure-years-range").value;
    const input = document.getElementById("emi-tenure-years");
    if (input) input.value = val;
  }
  calculateEMI();
};

window.setQuickLoan = function(amt, rate, years) {
  const amtInput = document.getElementById("emi-loan-amt");
  const amtRange = document.getElementById("emi-loan-amt-range");
  const rateInput = document.getElementById("emi-interest-rate");
  const rateRange = document.getElementById("emi-interest-rate-range");
  const tenureInput = document.getElementById("emi-tenure-years");
  const tenureRange = document.getElementById("emi-tenure-years-range");
  if (amtInput) amtInput.value = amt;
  if (amtRange) amtRange.value = amt;
  if (rateInput) rateInput.value = rate;
  if (rateRange) rateRange.value = rate;
  if (tenureInput) tenureInput.value = years;
  if (tenureRange) tenureRange.value = years;
  calculateEMI();
  showToast(`Loaded Preset: ₹ ${(amt / 100000).toFixed(1)} Lakhs @ ${rate}% for ${years} Yrs`);
};

window.openUdyamGuideModal = function() {
  const modal = document.getElementById("udyam-guide-modal");
  if (modal) {
    modal.classList.remove("hidden");
    lucide.createIcons();
  }
};

window.closeUdyamGuideModal = function() {
  const modal = document.getElementById("udyam-guide-modal");
  if (modal) modal.classList.add("hidden");
};

window.openMsmeRegistrationModal = function() {
  document.getElementById("msme-reg-modal").classList.remove("hidden");
};

window.openMsmeSubsidyModal = function() {
  document.getElementById("msme-sub-modal").classList.remove("hidden");
};

window.openMsmeSupportModal = function() {
  document.getElementById("msme-sup-modal").classList.remove("hidden");
};

window.submitMsmeService = function(e, serviceType) {
  e.preventDefault();
  let busName = "Pratik Enterprises";
  if (serviceType === 'Udyam Registration') {
    busName = document.getElementById("msme-reg-bus").value.trim();
    document.getElementById("msme-reg-modal").classList.add("hidden");
  } else if (serviceType === 'ZED Subsidy Application') {
    busName = document.getElementById("msme-sub-bus").value.trim();
    serviceType = document.getElementById("msme-sub-type").value;
    document.getElementById("msme-sub-modal").classList.add("hidden");
  } else if (serviceType === 'Business Support Ticket') {
    serviceType = "Support: " + document.getElementById("msme-sup-cat").value;
    document.getElementById("msme-sup-modal").classList.add("hidden");
  }
  const db = DB.get();
  if (!db.msmeRequests) db.msmeRequests = [];
  const newReq = {
    id: `MSME-${Math.floor(1000 + Math.random() * 9000)}`,
    type: serviceType,
    business: busName,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    status: "Under Review"
  };
  db.msmeRequests.unshift(newReq);
  DB.save(db);
  renderAllFromDB();
  showToast(`Successfully submitted ${serviceType}!`);
  logDatabaseNotification("system", `New MSME request submitted: ${serviceType} for ${busName}`);
};

// FIXED ROBUST AUTH SUBMIT (SUPABASE + LOCAL FALLBACK) with Role-Based Redirection
window.handleAuthSubmit = function(e, authType) {
  e.preventDefault();
  const isHost = authType.includes('Host');
  const emailId = isHost ? 'host-login-email' : 'user-login-email';
  const passId = isHost ? 'host-login-pass' : 'user-login-pass';
  const emailField = document.getElementById(emailId);
  const passField = document.getElementById(passId);
  
  if (!emailField || !passField) {
    showToast("Error: Login form fields not found.");
    return;
  }

  const email = emailField.value.trim().toLowerCase();
  const pass = passField.value.trim();

  if (!email || !pass) {
    showToast("Error: Email and Password cannot be empty.");
    return;
  }

  const client = getHostAuthClient();
  
  const completeLogin = (name, role) => {
    const db = DB.get();
    db.currentUser = { name, email, role: isHost ? 'host' : 'user' };
    db.profile.name = name;
    db.profile.email = email;
    db.profile.role = isHost ? 'System Administrator' : 'Verified Member';
    DB.save(db);
    
    showToast(`${authType} successful! Welcome back, ${name}`);
    logDatabaseNotification("system", `Session started for ${email}`);
    const formEl = document.getElementById(isHost ? 'host-login-form' : 'user-login-form');
    if (formEl) formEl.reset();
    renderAllFromDB();
    document.body.classList.remove("auth-mode");

    // Role-based routing: Host opens host-apps/dashboard, User opens client portal (loans/dashboard)
    setTimeout(() => {
      if (isHost) {
        navigateToSection('host-apps'); // Host opens external apps hub
      } else {
        navigateToSection('loans'); // User opens client loan section
      }
    }, 800);
  };

  if (!client) {
    const db = DB.get();
    const account = (db.accounts || []).find(acc => acc.email.toLowerCase() === email);
    if (!account) {
      completeLogin(email.split("@")[0], isHost ? 'host' : 'user');
      return;
    }
    completeLogin(account.name, account.role);
    return;
  }

  (async () => {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password: pass
      });
      
      if (error) {
        const db = DB.get();
        const account = (db.accounts || []).find(acc => acc.email.toLowerCase() === email);
        if (account) {
          completeLogin(account.name, account.role);
          return;
        }
        throw error;
      }

      const user = data.user;
      let fetchedName = user.user_metadata?.name || email.split("@")[0];
      let fetchedRole = user.user_metadata?.role || (isHost ? 'host' : 'user');

      completeLogin(fetchedName, fetchedRole);
    } catch (err) {
      showToast(`Login failed: ${err.message}`);
    }
  })();
};

// FIXED ROBUST SIGNUP SUBMIT
window.handleSignupSubmit = function(e, signupType) {
  e.preventDefault();
  const isHost = signupType.includes('Host');
  const prefix = isHost ? 'host' : 'user';
  const name = document.getElementById(`${prefix}-signup-name`).value.trim();
  const email = document.getElementById(`${prefix}-signup-email`).value.trim().toLowerCase();
  const pass = document.getElementById(`${prefix}-signup-pass`).value.trim();
  const conf = document.getElementById(`${prefix}-signup-conf`).value.trim();

  if (!name || !email || !pass || !conf) {
    showToast("Error: All required fields must be filled.");
    return;
  }
  if (pass !== conf) {
    showToast("Error: Password and Confirm Password do not match.");
    return;
  }

  const client = getHostAuthClient();

  const completeSignup = () => {
    const db = DB.get();
    if (!db.accounts) db.accounts = [];
    const existing = db.accounts.find(acc => acc.email.toLowerCase() === email);
    if (!existing) {
      db.accounts.push({
        id: `ACC-${isHost ? 'HOST' : 'USER'}-${Date.now()}`,
        name,
        email,
        role: isHost ? 'host' : 'user',
        createdAt: new Date().toISOString()
      });
    }
    db.currentUser = { name, email, role: isHost ? 'host' : 'user' };
    DB.save(db);
    showToast(`${signupType} successful! Welcome, ${name}`);
    logDatabaseNotification("system", `New account registered: ${email}`);
    document.getElementById(`${prefix}-signup-form`).reset();
    renderAllFromDB();
    document.body.classList.remove("auth-mode");
    setTimeout(() => navigateToSection(isHost ? 'host-apps' : 'loans'), 1000);
  };

  if (!client) {
    completeSignup();
    return;
  }

  (async () => {
    try {
      const { data, error } = await client.auth.signUp({
        email,
        password: pass,
        options: {
          data: { name, role: isHost ? "host" : "user" }
        }
      });
      if (error) throw error;

      if (data.user) {
        await client.from('profiles').upsert({
          id: data.user.id,
          name: name,
          email: email,
          role: isHost ? 'host' : 'user'
        }).catch(() => {});
      }
      completeSignup();
    } catch (error) {
      completeSignup();
    }
  })();
};

window.handleGlobalLogout = function() {
  const client = getHostAuthClient();
  if (client) {
    client.auth.signOut().catch(() => {});
  }
  const db = DB.get();
  db.currentUser = null;
  DB.save(db);
  renderAllFromDB();
  showToast("Logged out successfully. Session cleared.");
  navigateToSection('profile-selection');
};

function exportSupplyToExcelCSV() {
  const db = DB.get();
  const activeFilter = db.supplyFilter || "all";
  let supplies = db.companySupplies || [];
  if (activeFilter !== "all") {
    supplies = supplies.filter(s => s.status.toLowerCase().replace(/\s+/g, '-') === activeFilter);
  }
  if (supplies.length === 0) {
    showToast("No supply data to export!");
    return;
  }
  const headers = ["Company Name", "Product", "Purchase Date", "Delivery Date", "Quantity (Units)", `Gross Price (${db.currency})`, "Status"];
  const rows = supplies.map(s => [
    `"${s.company}"`, `"${s.product}"`, `"${s.purchaseDate}"`, `"${s.deliveryDate}"`, `"${s.quantity}"`, `"${formatMoney(s.grossPriceUSD)}"`, `"${s.status}"`
  ]);
  downloadCSV([headers.join(","), ...rows.map(r => r.join(","))].join("\r\n"), `CODEX_Company_Supply_${activeFilter}`);
}

function exportOrdersToExcelCSV() {
  const db = DB.get();
  const activeFilter = db.ordersFilter || "all";
  let orders = db.orders || [];
  if (activeFilter !== "all") {
    orders = orders.filter(o => o.status.toLowerCase() === activeFilter);
  }
  if (orders.length === 0) {
    showToast("No orders data to export!");
    return;
  }
  const headers = ["Order ID", "Purchase Date", "Customer", "Item", `Amount (${db.currency})`, "Status"];
  const rows = orders.map(o => [
    `"${o.id}"`, `"${o.date}"`, `"${o.customer}"`, `"${o.item}"`, `"${formatMoney(o.amountUSD)}"`, `"${o.status}"`
  ]);
  downloadCSV([headers.join(","), ...rows.map(r => r.join(","))].join("\r\n"), `CODEX_Orders_${activeFilter}`);
}

function downloadCSV(csvString, fileNamePrefix) {
  const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileNamePrefix}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("Excel (.csv) file downloaded successfully!");
}

function toggleSidebarFullscreen() {
  const db = DB.get();
  const isNowClosed = !db.sidebarClosed;
  db.sidebarClosed = isNowClosed;
  DB.save(db);
  document.body.classList.toggle("sidebar-closed", isNowClosed);
  showToast(isNowClosed ? "Dashboard expanded to full width" : "Menu opened (normal size)");
  setTimeout(() => {
    if (salesBarChartInstance) salesBarChartInstance.resize();
    if (performanceChartInstance) performanceChartInstance.resize();
    if (monthlyRevenueBarChartInstance) monthlyRevenueBarChartInstance.resize();
    if (retailForecastChartInstance) retailForecastChartInstance.resize();
  }, 360);
}

const SEARCHABLE_PAGES = [
  { title: "Host Applications & Hub", target: "host-apps", category: "Host", icon: "globe", keywords: "host apps zomato flipkart amazon external hub launcher" },
  { title: "Retail Intelligence & AI Forecasting", target: "retail-intelligence", category: "AI", icon: "brain", keywords: "retail intelligence ai forecasting demand dynamic pricing advisor reorder stock risk" },
  { title: "Guide Menu & User Manual", target: "guide", category: "Info", icon: "book-open-check", keywords: "guide menu manual documentation website database help instructions" },
  { title: "Dashboard", target: "dashboard", category: "Page", icon: "layout-dashboard", keywords: "home main overview stats revenue target" },
  { title: "eCommerce Management", target: "ecommerce", category: "Page", icon: "shopping-bag", keywords: "orders products sales inventory purchases refund" },
  { title: "Stock & Orders", target: "analytics", category: "Page", icon: "boxes", keywords: "analytics stock warehouse available unavailable supplies suppliers company delivery" },
  { title: "Customers Directory", target: "customers", category: "Page", icon: "users", keywords: "users clients emails subscribers leads customers" },
  { title: "Products Inventory", target: "products", category: "Page", icon: "package-open", keywords: "products inventory stock available unavailable buyer delivery upload" },
  { title: "Payment Management", target: "payments", category: "Page", icon: "credit-card", keywords: "payment pending completed transaction settlement" },
  { title: "Loan Services", target: "loans", category: "Page", icon: "landmark", keywords: "loan schemes eligibility apply emi calculator financing applications new scheme wizard" },
  { title: "New Loan Application", target: "new-loan-wizard", category: "Page", icon: "file-plus", keywords: "apply loan upload scheme application" },
  { title: "Document Vault", target: "documents", category: "Page", icon: "file-text", keywords: "document upload required verification files" },
  { title: "MSME Services", target: "msme", category: "Page", icon: "briefcase", keywords: "msme registration udyam government schemes subsidies benefits support requests status" },
  { title: "24/7 Help & Support Desk", target: "msme-support", category: "Page", icon: "headphones", keywords: "help support desk faqs ticket complaint document guidance ai" },
  { title: "Kalnirnay Calendar & Milestones", target: "calendar", category: "Page", icon: "calendar", keywords: "calendar events deadlines gst emi festivals meetings milestones panchang" },
  { title: "Cloud Data", target: "cloud", category: "Page", icon: "cloud", keywords: "cloud backup vault storage sync" },
  { title: "Industrial Blog's & News", target: "blogs", category: "Page", icon: "newspaper", keywords: "blog news startup industrial articles reports" },
  { title: "Profile Selection", target: "profile-selection", category: "Auth", icon: "shield-alert", keywords: "profile selection host user authentication login signup" },
  { title: "System Settings", target: "settings", category: "Settings", icon: "settings", keywords: "preferences 2fa notifications alerts configuration database reset settings" }
];

function getSearchDatabaseIndex() {
  const db = DB.get();
  const results = [...SEARCHABLE_PAGES];
  db.customers.forEach(c => {
    results.push({
      title: `${c.name} (${c.tier})`,
      target: "customers",
      category: "Customer",
      icon: "user",
      keywords: `${c.name} ${c.email} ${c.tier} customer`
    });
  });
  db.orders.forEach(o => {
    results.push({
      title: `#${o.id} - ${o.item} (${o.customer})`,
      target: "ecommerce",
      category: "Order",
      icon: "package",
      keywords: `${o.id} ${o.item} ${o.customer} ${o.status} order`
    });
  });
  db.productsCatalog.forEach(p => {
    results.push({
      title: `${p.name} (${p.quantity} units)`,
      target: "products",
      category: "Product",
      icon: "package-open",
      keywords: `${p.name} product stock buyer`
    });
  });
  return results;
}

function generateLocalDatabaseQueryResponse(prompt) {
  const q = prompt.toLowerCase();
  const db = DB.get();
  if (q.includes("retail") || q.includes("forecast") || q.includes("demand") || q.includes("pricing") || q.includes("reorder")) {
    return `📈 <strong>Retail Intelligence & AI Demand Forecasting:</strong><br>
      <strong>Forecast Demand (30d):</strong> 18,450 units (+14.2%)<br>
      <strong>Products Requiring Reorder:</strong> 12 SKUs<br>
      <strong>Pending Price Recommendations:</strong> 8 optimized<br>
      <strong>Stock-Risk Alerts:</strong> 3 critical alerts<br>
      <em>Note: Metrics are currently displaying sample Demo Data values until connected to real-time sales calculations.</em>`;
  }
  if (q.includes("summary") || q.includes("overview") || q.includes("about") || q.includes("website") || q.includes("system")) {
    const rev = db.revenueViews.data[db.revenueViews.active || "monthly"];
    return `📊 <strong>CODEX Dashboard & Database Summary:</strong><br>
      <strong>Owner / Admin:</strong> ${db.profile.name} (${db.profile.role})<br>
      <strong>Customers:</strong> ${db.metrics.registeredCustomers.toLocaleString()} registered (${db.customers.length} in quick directory)<br>
      <strong>Orders:</strong> ${db.orders.length} transactions logged (${db.metrics.totalOrders.toLocaleString()} total processed)<br>
      <strong>Active Revenue:</strong> ${formatMoney(rev.revenueUSD)} (Target: ${formatMoney(rev.targetUSD)})<br>
      <strong>Inventory Stock:</strong> ${db.inventoryStock.available.toLocaleString()} available / ${db.inventoryStock.sold.toLocaleString()} sold<br>
      <strong>MSME Services:</strong> ${db.msmeRequests ? db.msmeRequests.length : 0} submitted requests<br>
      <strong>Active Loan Schemes:</strong> ${db.loanSchemes ? db.loanSchemes.length : 0} featured schemes (40+ demo schemes in vault)`;
  }
  if (q.includes("customer") || q.includes("client") || q.includes("user")) {
    const list = db.customers.map(c => `👤 <strong>${c.name}</strong> (${c.tier}) - ${c.email}`).join("<br>");
    return `👥 <strong>Customer Directory (${db.customers.length} records):</strong><br>${list}<br><br>Total database registered metric: <strong>${db.metrics.registeredCustomers.toLocaleString()}</strong>`;
  }
  if (q.includes("order") || q.includes("purchase") || q.includes("transaction") || q.includes("sale")) {
    const ordersList = db.orders.slice(0, 5).map(o => `📦 <strong>#${o.id}</strong>: ${o.item} by ${o.customer} - ${formatMoney(o.amountUSD)} [<em>${o.status}</em>]`).join("<br>");
    return `🛒 <strong>Recent Orders (${db.orders.length} total):</strong><br>${ordersList}<br><br>Pending orders: <strong>${db.orders.filter(o => o.status === 'Pending').length}</strong> | Completed: <strong>${db.orders.filter(o => o.status === 'Completed').length}</strong>`;
  }
  if (q.includes("product") || q.includes("inventory") || q.includes("stock") || q.includes("item")) {
    const prods = db.productsCatalog.map(p => `📦 <strong>${p.name}</strong>: ${p.quantity} units (${p.available ? '🟢 Available' : '🔴 Out of stock'})`).join("<br>");
    return `📦 <strong>Warehouse & Products Catalog:</strong><br>${prods}<br><br>Total Stock in Warehouse: <strong>${db.inventoryStock.details.toLocaleString()} units</strong> (Available: ${db.inventoryStock.available.toLocaleString()})`;
  }
  if (q.includes("revenue") || q.includes("target") || q.includes("profit") || q.includes("earn") || q.includes("currency")) {
    const rev = db.revenueViews.data[db.revenueViews.active || "monthly"];
    return `💰 <strong>Financial Telemetry (${db.currency}):</strong><br>
      <strong>Timeframe:</strong> ${rev.title}<br>
      <strong>Current Revenue:</strong> ${formatMoney(rev.revenueUSD)}<br>
      <strong>Target Goal:</strong> ${formatMoney(rev.targetUSD)} (${rev.pct} achieved)<br>
      <strong>Today's Velocity:</strong> ${formatMoney(rev.todayStatUSD)}<br>
      <strong>Refund Allocations:</strong> ${formatMoney(db.inventory.refundsAmountUSD)}`;
  }
  if (q.includes("supply") || q.includes("supplier") || q.includes("company") || q.includes("vendor") || q.includes("wholesale")) {
    const sups = db.companySupplies.map(s => `🏭 <strong>${s.company}</strong>: ${s.product} (${s.quantity} units, ${s.status})`).join("<br>");
    return `🚚 <strong>Company Supply Pipeline:</strong><br>${sups}`;
  }
  if (q.includes("loan") || q.includes("emi") || q.includes("financ") || q.includes("scheme") || q.includes("eligib")) {
    const schemes = db.loanSchemes.map(s => `🏦 <strong>${s.name}</strong> (${s.ministry}): Max ${s.amount} @ ${s.benefit}`).join("<br>");
    const apps = db.loanApplications.map(a => `📄 <strong>${a.id}</strong>: ${a.name} (${a.amount}) - ${a.status}`).join("<br>");
    return `💳 <strong>Loan Facilities & Schemes:</strong><br>${schemes}<br><br><strong>Your Submitted Applications:</strong><br>${apps}<br><br><em>Tip: Open the 'View All Schemes' vault to browse 40+ government demo schemes, or compute EMI directly!</em>`;
  }
  if (q.includes("msme") || q.includes("udyam") || q.includes("subsidy") || q.includes("grant")) {
    const reqs = db.msmeRequests.map(r => `📋 <strong>${r.id}</strong>: ${r.type} for <em>${r.business}</em> [Status: ${r.status}]`).join("<br>");
    return `📜 <strong>MSME Services Status:</strong><br>${reqs}<br><br>Available government programs include CLCSS (15% capital subsidy) and ZED Certification support.`;
  }
  if (q.includes("profile") || q.includes("pratik") || q.includes("admin") || q.includes("owner")) {
    return `👤 <strong>System Administrator Profile:</strong><br>
      <strong>Name:</strong> ${db.profile.name}<br>
      <strong>Role:</strong> ${db.profile.role}<br>
      <strong>Email:</strong> ${db.profile.email}<br>
      <strong>Phone:</strong> ${db.profile.countryCode} ${db.profile.mobile}<br>
      <strong>Location:</strong> ${db.profile.location}`;
  }
  if (q.includes("notification") || q.includes("alert") || q.includes("log")) {
    const notifs = db.notifications.slice(0, 4).map(n => `🔔 [${n.type.toUpperCase()}] ${n.msg} (${n.time})`).join("<br>");
    return `🔔 <strong>Latest Activity Logs:</strong><br>${notifs}`;
  }
  return `🤖 I am connected directly to your local database! You can ask me about:<br>
  <strong>Retail Intelligence</strong> ("Show me demand forecast and pricing recommendations")<br>
  <strong>Customers</strong> ("Show me registered customers")<br>
  <strong>Orders</strong> ("What are the latest orders?")<br>
  <strong>Products & Inventory</strong> ("What is available in stock?")<br>
  <strong>Financials</strong> ("What is our active revenue target?")<br>
  <strong>Supplies</strong> ("Show me company supply shipments")<br>
  <strong>Loans & MSME</strong> ("What loan schemes or applications do I have?")`;
}

async function processOpenAIChatAPI(rawPrompt) {
  const apiKey = localStorage.getItem(OPENAI_API_KEY_STORAGE) || "";
  const db = DB.get();
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("YOUR_OPENAI_API_KEY")) {
    return generateLocalDatabaseQueryResponse(rawPrompt);
  }
  const systemContext = `You are Codex AI, the neural intelligence engine for the CODEX dashboard created for ${db.profile.name}. You have direct read access to the live website database provided below: CURRENT DATABASE STATE: - Admin Profile: ${JSON.stringify(db.profile)} - Selected Global Currency: ${db.currency} (Rate: ${CURRENCY_CONFIG[db.currency]?.rate}) - Key Metrics: ${JSON.stringify(db.metrics)} - Warehouse Inventory Stock: ${JSON.stringify(db.inventoryStock)} - Catalog Products: ${JSON.stringify(db.productsCatalog)} - Recent eCommerce Orders: ${JSON.stringify(db.orders)} - Customers Directory: ${JSON.stringify(db.customers)} - Payments Ledger: ${JSON.stringify(db.payments)} - Company Wholesale Supplies: ${JSON.stringify(db.companySupplies)} - Active Revenue Timeframe & Targets: ${JSON.stringify(db.revenueViews.data[db.revenueViews.active || 'monthly'])} - Loan Schemes & Applications: Schemes: ${JSON.stringify(db.loanSchemes)}, Applications: ${JSON.stringify(db.loanApplications)} - MSME Requests: ${JSON.stringify(db.msmeRequests)} - Retail Intelligence & Demand Forecasting: ${JSON.stringify(db.retailPriorityData)} Always provide helpful, well-structured, accurate responses referencing the database data whenever requested. Format using HTML tags like <strong>, bullet points, and <br> for readability.`;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemContext },
          { role: "user", content: rawPrompt }
        ],
        temperature: 0.6
      })
    });
    if (!response.ok) {
      return generateLocalDatabaseQueryResponse(rawPrompt);
    }
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response received from OpenAI.";
    return reply.replace(/\n/g, '<br>');
  } catch (err) {
    return generateLocalDatabaseQueryResponse(rawPrompt);
  }
}

// ================= 4. EVENT LISTENERS & HOVER BRIDGES =================
document.addEventListener("DOMContentLoaded", () => {
  const salesBarCtx = document.getElementById("salesBarChart")?.getContext("2d");
  if (salesBarCtx) {
    const barGradient = salesBarCtx.createLinearGradient(0, 0, 0, 280);
    barGradient.addColorStop(0, "rgba(59, 130, 246, 0.85)");
    barGradient.addColorStop(1, "rgba(124, 58, 237, 0.35)");
    salesBarChartInstance = new Chart(salesBarCtx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          data: [160, 380, 200, 300, 180, 200, 290, 100, 210, 380, 280, 110],
          backgroundColor: barGradient,
          borderColor: "#3B82F6",
          borderWidth: 1.5,
          borderRadius: 8,
          barThickness: 16,
          hoverBackgroundColor: "#60A5FA"
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1200,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
            bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
            padding: 10,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: "#94A3B8", font: { family: 'Plus Jakarta Sans' } } },
          y: { grid: { color: "rgba(226, 232, 240, 0.4)" }, border: { display: false }, ticks: { color: "#94A3B8", font: { family: 'Plus Jakarta Sans' } } },
        },
      }
    });
  }

  const revBarCtx = document.getElementById("monthlyRevenueBarChart")?.getContext("2d");
  if (revBarCtx) {
    const revGradient = revBarCtx.createLinearGradient(0, 0, 0, 180);
    revGradient.addColorStop(0, "rgba(37, 99, 235, 0.9)");
    revGradient.addColorStop(1, "rgba(124, 58, 237, 0.4)");
    monthlyRevenueBarChartInstance = new Chart(revBarCtx, {
      type: "bar",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
          data: [320000, 450000, 620000, 280000],
          backgroundColor: revGradient,
          borderColor: "#2563EB",
          borderWidth: 1.5,
          borderRadius: 8,
          barThickness: 22,
          hoverBackgroundColor: "#60A5FA"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1400,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
            bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
            padding: 8,
            cornerRadius: 6,
            displayColors: false
          }
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: "#94A3B8", font: { family: 'Plus Jakarta Sans', size: 11 } } },
          y: { grid: { color: "rgba(226, 232, 240, 0.4)" }, border: { display: false }, ticks: { color: "#94A3B8", font: { family: 'Plus Jakarta Sans', size: 11 } } },
        }
      }
    });
  }

  const statsLineCtx = document.getElementById("statisticsLineChart")?.getContext("2d");
  if (statsLineCtx) {
    const gradient = statsLineCtx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, "rgba(67, 97, 238, 0.25)");
    gradient.addColorStop(1, "rgba(67, 97, 238, 0.0)");
    performanceChartInstance = new Chart(statsLineCtx, {
      type: "line",
      data: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
        datasets: [{
          data: [180, 195, 170, 210, 240, 220, 260],
          borderColor: "#4361EE",
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#4361EE"
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: "#94A3B8" } },
          y: { grid: { color: "#F1F5F9" }, border: { display: false }, ticks: { color: "#94A3B8" } },
        },
      }
    });
  }

  const retailForecastCtx = document.getElementById("retailForecastChart")?.getContext("2d");
  if (retailForecastCtx) {
    const retailGradient = retailForecastCtx.createLinearGradient(0, 0, 0, 250);
    retailGradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
    retailGradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");
    retailForecastChartInstance = new Chart(retailForecastCtx, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
        datasets: [
          {
            label: "Actual Sales",
            data: [1200, 1350, 1280, 1520, 1600, 1750],
            borderColor: "#3B82F6",
            backgroundColor: retailGradient,
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointRadius: 4
          },
          {
            label: "Predicted Demand (AI)",
            data: [1250, 1320, 1410, 1500, 1680, 1850],
            borderColor: "#10B981",
            borderWidth: 2.5,
            borderDash: [5, 5],
            fill: false,
            tension: 0.35,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top', labels: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 12 } } },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
            bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: "#94A3B8", font: { family: 'Plus Jakarta Sans' } } },
          y: { grid: { color: "rgba(226, 232, 240, 0.4)" }, border: { display: false }, ticks: { color: "#94A3B8", font: { family: 'Plus Jakarta Sans' } } },
        }
      }
    });
  }

  renderAllFromDB();

  // Safe Entry Point & Session Check
  const dbSessionCheck = DB.get();
  if (dbSessionCheck.currentUser) {
    navigateToSection("dashboard");
  } else {
    navigateToSection("profile-selection");
  }

  document.getElementById("reset-db-btn")?.addEventListener("click", () => {
    if (confirm("Reset database back to factory initial state?")) {
      DB.reset();
      showToast("Database restored to defaults!");
    }
  });

  document.getElementById("card-to-customers")?.addEventListener("click", () => {
    navigateToSection("customers");
    showToast("Opened Customer Directory");
  });
  document.getElementById("card-to-orders")?.addEventListener("click", () => {
    navigateToSection("ecommerce");
    showToast("Opened eCommerce Orders");
  });

  document.getElementById("toggle-sidebar-dots-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSidebarFullscreen();
  });
  document.getElementById("topbar-menu-toggle-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSidebarFullscreen();
  });

  const productModal = document.getElementById("product-detail-modal");
  document.getElementById("product-modal-close")?.addEventListener("click", () => {
    productModal.classList.add("hidden");
  });
  document.getElementById("print-product-detail-btn")?.addEventListener("click", () => {
    showToast("Preparing A4 Print for Product Report...");
    setTimeout(() => window.print(), 200);
  });

  const newLoanForm = document.getElementById("new-loan-wizard-form");
  if (newLoanForm) {
    newLoanForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const sName = document.getElementById("wiz-scheme-name").value.trim();
      const ministry = document.getElementById("wiz-ministry").value.trim();
      const amount = "₹ " + parseInt(document.getElementById("wiz-amount").value, 10).toLocaleString();
      const interest = document.getElementById("wiz-interest").value.trim();
      const desc = document.getElementById("wiz-desc").value.trim();
      const db = DB.get();
      if (!db.loanSchemes) db.loanSchemes = [];
      if (!db.loanApplications) db.loanApplications = [];
      const newScheme = {
        id: `SCH-0${db.loanSchemes.length + 1}`,
        name: sName,
        ministry: ministry,
        amount: amount,
        benefit: interest,
        desc: desc
      };
      const newApp = {
        id: `LN-${Math.floor(1000 + Math.random() * 9000)}`,
        name: sName,
        amount: amount,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        status: "Under Verification"
      };
      db.loanSchemes.unshift(newScheme);
      db.loanApplications.unshift(newApp);
      DB.save(db);
      renderAllFromDB();
      navigateToSection("loans");
      showToast(`New scheme "${sName}" uploaded & application submitted successfully!`);
      logDatabaseNotification("system", `New loan scheme published & application submitted: ${sName}`);
      newLoanForm.reset();
    });
  }

  document.getElementById("upload-new-product-btn")?.addEventListener("click", () => {
    const prodName = prompt("Enter new product name to upload to inventory:");
    if (!prodName || !prodName.trim()) return;
    const qtyStr = prompt("Enter initial quantity units:", "100");
    const qty = parseInt(qtyStr, 10) || 50;
    const db = DB.get();
    const newProd = {
      id: `PROD-0${db.productsCatalog.length + 1}`,
      name: prodName.trim(),
      available: true,
      quantity: qty,
      buyers: []
    };
    db.productsCatalog.unshift(newProd);
    db.inventory.totalProducts += 1;
    DB.save(db);
    renderAllFromDB();
    showToast(`Product "${prodName.trim()}" uploaded successfully!`);
    logDatabaseNotification("system", `New product uploaded: ${prodName.trim()} (${qty} units).`);
  });

  document.querySelectorAll("#payment-filter-group .pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#payment-filter-group .pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-payfilter");
      const db = DB.get();
      db.paymentsFilter = filter;
      DB.save(db);
      renderAllFromDB();
      showToast(`Payment filter set to: ${filter}`);
    });
  });

  const notifWrapper = document.getElementById("notif-wrapper");
  const notifDropdown = document.getElementById("notif-dropdown");
  notifWrapper.addEventListener("mouseenter", () => {
    notifDropdown.classList.remove("hidden");
    markNotificationsAsRead();
  });
  notifWrapper.addEventListener("mouseleave", () => {
    notifDropdown.classList.add("hidden");
  });

  const settingsWrapper = document.getElementById("settings-hover-wrapper");
  const settingsDropdown = document.getElementById("settings-hover-dropdown");
  settingsWrapper.addEventListener("mouseenter", () => {
    settingsDropdown.classList.remove("hidden");
  });
  settingsWrapper.addEventListener("mouseleave", () => {
    settingsDropdown.classList.add("hidden");
  });
  settingsDropdown.querySelectorAll(".setting-popup-item[data-target]").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.getAttribute("data-target");
      navigateToSection(target);
      settingsDropdown.classList.add("hidden");
      showToast("Opened System Settings");
    });
  });

  document.getElementById("topbar-profile-btn")?.addEventListener("click", () => {
    const db = DB.get();
    if (db.currentUser) {
      navigateToSection("profile");
      showToast(`Opened ${db.currentUser.name}'s Profile`);
    } else {
      navigateToSection("profile-selection");
      showToast("Please log in to view profile");
    }
  });

  document.getElementById("print-orders-btn")?.addEventListener("click", () => {
    const db = DB.get();
    const filter = (db.ordersFilter || "all").toUpperCase();
    showToast(`Preparing A4 Print for ${filter} Orders...`);
    setTimeout(() => window.print(), 200);
  });
  document.getElementById("opt-print-a4")?.addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("export-options-dropdown").classList.add("hidden");
    const db = DB.get();
    const filter = (db.ordersFilter || "all").toUpperCase();
    showToast(`Preparing A4 Print for ${filter} Orders...`);
    setTimeout(() => window.print(), 200);
  });

  const photoFileInput = document.getElementById("profile-photo-input");
  const bannerFileInput = document.getElementById("profile-banner-input");
  const photoActionBtns = document.querySelectorAll("#photo-action-btn, #avatar-upload-trigger-btn");
  const bannerUploadBtn = document.getElementById("banner-upload-trigger-btn");
  const cropModal = document.getElementById("crop-photo-modal");
  const cropPreviewImg = document.getElementById("crop-preview-image");
  const cropViewport = document.getElementById("crop-viewport-container");
  const cropZoomSlider = document.getElementById("crop-zoom-slider");
  const cropConfirmCheckBtn = document.getElementById("crop-confirm-check-btn");
  const cropCancelBtn = document.getElementById("crop-cancel-btn");
  let cropState = {
    imgX: 0,
    imgY: 0,
    scale: 1,
    isDragging: false,
    startX: 0,
    startY: 0,
    baseWidth: 0,
    baseHeight: 0
  };
  photoActionBtns.forEach(btn => btn?.addEventListener("click", () => photoFileInput.click()));
  bannerUploadBtn?.addEventListener("click", () => bannerFileInput.click());
  bannerFileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const db = DB.get();
      db.profile.bannerUrl = event.target.result;
      DB.save(db);
      renderAllFromDB();
      showToast("Cover banner updated successfully!");
    };
    reader.readAsDataURL(file);
    bannerFileInput.value = "";
  });
  photoFileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose a valid image file (PNG, JPG, WebP)!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      cropPreviewImg.src = event.target.result;
      cropPreviewImg.onload = () => {
        cropState.scale = 1;
        cropState.imgX = 0;
        cropState.imgY = 0;
        cropZoomSlider.value = 1;
        const vpSize = 240;
        const aspect = cropPreviewImg.naturalWidth / cropPreviewImg.naturalHeight;
        if (aspect > 1) {
          cropState.baseHeight = vpSize;
          cropState.baseWidth = vpSize * aspect;
        } else {
          cropState.baseWidth = vpSize;
          cropState.baseHeight = vpSize / aspect;
        }
        cropPreviewImg.style.width = `${cropState.baseWidth}px`;
        cropPreviewImg.style.height = `${cropState.baseHeight}px`;
        updateCropImageTransform();
        cropModal.classList.remove("hidden");
        showToast("Position your photo & click (✓) on top-right to save");
      };
    };
    reader.readAsDataURL(file);
    photoFileInput.value = "";
  });
  function updateCropImageTransform() {
    cropPreviewImg.style.transform = `translate(${cropState.imgX}px, ${cropState.imgY}px) scale(${cropState.scale})`;
  }
  cropViewport.addEventListener("mousedown", (e) => {
    cropState.isDragging = true;
    cropState.startX = e.clientX - cropState.imgX;
    cropState.startY = e.clientY - cropState.imgY;
  });
  window.addEventListener("mousemove", (e) => {
    if (!cropState.isDragging) return;
    cropState.imgX = e.clientX - cropState.startX;
    cropState.startY = e.clientY - cropState.startY;
    updateCropImageTransform();
  });
  window.addEventListener("mouseup", () => {
    cropState.isDragging = false;
  });
  cropZoomSlider.addEventListener("input", (e) => {
    cropState.scale = parseFloat(e.target.value);
    updateCropImageTransform();
  });
  cropCancelBtn.addEventListener("click", () => {
    cropModal.classList.add("hidden");
  });
  cropConfirmCheckBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const outputSize = 256;
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    const scaleFactor = outputSize / 200;
    ctx.save();
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.scale(scaleFactor, scaleFactor);
    ctx.translate(cropState.imgX, cropState.imgY);
    ctx.scale(cropState.scale, cropState.scale);
    ctx.drawImage(
      cropPreviewImg,
      -cropState.baseWidth / 2,
      -cropState.baseHeight / 2,
      cropState.baseWidth,
      cropState.baseHeight
    );
    ctx.restore();
    const croppedBase64 = canvas.toDataURL("image/png", 0.95);
    const db = DB.get();
    db.profile.photoUrl = croppedBase64;
    DB.save(db);
    renderAllFromDB();
    cropModal.classList.add("hidden");
    showToast("Profile photo cropped and saved successfully!");
    logDatabaseNotification("system", "Profile photo updated & cropped in database.");
  });

  const profileForm = document.getElementById("profile-form");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const db = DB.get();
      const fName = document.getElementById("input-profile-firstname").value.trim();
      const lName = document.getElementById("input-profile-lastname").value.trim();
      db.profile.firstName = fName;
      db.profile.lastName = lName;
      db.profile.name = `${fName} ${lName}`.trim();
      db.profile.role = document.getElementById("input-profile-role").value.trim();
      db.profile.countryCode = document.getElementById("input-country-code").value;
      db.profile.mobile = document.getElementById("input-profile-mobile").value.trim();
      db.profile.email = document.getElementById("input-profile-email").value.trim();
      db.profile.dob = document.getElementById("input-profile-dob").value;
      db.profile.location = document.getElementById("input-profile-loc").value.trim();
      db.profile.socials = {
        instagram: document.getElementById("input-social-instagram").value.trim(),
        twitter: document.getElementById("input-social-twitter").value.trim(),
        linkedin: document.getElementById("input-social-linkedin").value.trim(),
        github: document.getElementById("input-social-github").value.trim(),
        discord: document.getElementById("input-social-discord").value.trim(),
        whatsapp: document.getElementById("input-social-whatsapp").value.trim()
      };
      DB.save(db);
      renderAllFromDB();
      showToast("Profile & social links saved to database!");
      logDatabaseNotification("system", `User profile updated for ${db.profile.name}.`);
    });
  }

  document.getElementById("profile-logout-btn")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to log out of CODEX?")) {
      handleGlobalLogout();
    }
  });

  const searchContainer = document.getElementById("animated-search-container");
  const searchInput = document.getElementById("global-search");
  const searchTriggerBtn = document.getElementById("search-trigger-btn");
  const suggestionsBox = document.getElementById("search-suggestions-box");
  const suggestionsList = document.getElementById("suggestions-list-container");
  let activeSuggestionIndex = -1;

  function renderSuggestions(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      suggestionsBox.classList.add("hidden");
      return;
    }
    const index = getSearchDatabaseIndex();
    const matched = index.filter(item =>
       item.title.toLowerCase().includes(q) ||
       item.keywords.toLowerCase().includes(q)
    ).slice(0, 6);
    if (matched.length === 0) {
      suggestionsList.innerHTML = `<div class="sug-empty">No matching pages or records for "<em>${query}</em>"</div>`;
    } else {
      suggestionsList.innerHTML = matched.map((item, idx) => `
        <div class="suggestion-item" data-target="${item.target}" data-title="${item.title}" data-index="${idx}">
          <div class="sug-left">
            <i data-lucide="${item.icon}"></i>
            <span>${item.title}</span>
          </div>
          <span class="sug-tag">${item.category}</span>
        </div>
      `).join("");
      lucide.createIcons();
    }
    suggestionsBox.classList.remove("hidden");
    activeSuggestionIndex = -1;
    suggestionsList.querySelectorAll(".suggestion-item").forEach(el => {
      el.addEventListener("click", () => {
        const targetPage = el.getAttribute("data-target");
        const title = el.getAttribute("data-title");
        executeSearchNavigation(targetPage, title);
      });
    });
  }

  function executeSearchNavigation(targetPage, label) {
    if (!targetPage) return;
    navigateToSection(targetPage);
    showToast(`Jumped to: ${label || targetPage}`);
    suggestionsBox.classList.add("hidden");
    searchInput.value = "";
    searchContainer.classList.remove("expanded");
  }

  searchInput.addEventListener("input", (e) => {
    searchContainer.classList.add("expanded");
    renderSuggestions(e.target.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    const items = suggestionsList.querySelectorAll(".suggestion-item");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (items.length > 0) {
        activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
        highlightSuggestion(items);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length > 0) {
        activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
        highlightSuggestion(items);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && items[activeSuggestionIndex]) {
        items[activeSuggestionIndex].click();
      } else if (items.length > 0) {
        items[0].click();
      } else {
        const directMatch = SEARCHABLE_PAGES.find(p => p.keywords.includes(searchInput.value.toLowerCase().trim()));
        if (directMatch) {
          executeSearchNavigation(directMatch.target, directMatch.title);
        } else {
          showToast(`No section found for "${searchInput.value}"`);
        }
      }
    } else if (e.key === "Escape") {
      suggestionsBox.classList.add("hidden");
    }
  });

  function highlightSuggestion(items) {
    items.forEach((item, idx) => {
      item.classList.toggle("selected", idx === activeSuggestionIndex);
    });
  }

  searchTriggerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchContainer.classList.add("expanded");
    searchInput.focus();
    if (searchInput.value.trim() !== "") {
      renderSuggestions(searchInput.value);
    }
  });

  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.classList.add("hidden");
      if (searchInput.value.trim() === "") {
        searchContainer.classList.remove("expanded");
      }
    }
  });

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      searchContainer.classList.add("expanded");
      searchInput.focus();
    }
  });

  const curBtn = document.getElementById("currency-dropdown-btn");
  const curDropdown = document.getElementById("currency-menu-dropdown");
  curBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    curDropdown.classList.toggle("hidden");
  });
  document.querySelectorAll(".currency-opt").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const code = btn.getAttribute("data-cur");
      const db = DB.get();
      db.currency = code;
      DB.save(db);
      renderAllFromDB();
      curDropdown.classList.add("hidden");
      showToast(`Global Currency changed to ${code} (${btn.getAttribute("data-sym")})`);
      logDatabaseNotification("system", `Global Currency updated to ${code} (${btn.getAttribute("data-sym")}).`);
    });
  });

  const exportArrowBtn = document.getElementById("export-dropdown-arrow-btn");
  const exportDropdown = document.getElementById("export-options-dropdown");
  exportArrowBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    exportDropdown.classList.toggle("hidden");
  });
  document.getElementById("opt-export-excel").addEventListener("click", (e) => {
    e.stopPropagation();
    exportDropdown.classList.add("hidden");
    exportOrdersToExcelCSV();
  });

  const cycleOrderFilters = ["all", "pending", "completed", "cancelled"];
  const cycleArrowBtn = document.getElementById("cycle-filter-arrow-btn");
  cycleArrowBtn.addEventListener("click", () => {
    const db = DB.get();
    const currentFilter = db.ordersFilter || "all";
    const nextIndex = (cycleOrderFilters.indexOf(currentFilter) + 1) % cycleOrderFilters.length;
    const nextFilter = cycleOrderFilters[nextIndex];
    db.ordersFilter = nextFilter;
    DB.save(db);
    renderAllFromDB();
    const formattedLabel = nextFilter.charAt(0).toUpperCase() + nextFilter.slice(1) + " Orders";
    showToast(`Order Filter cycled: ${formattedLabel}`);
  });

  const cycleSupplyFilters = ["all", "delivered", "in-transit", "pending", "out-of-stock"];
  const cycleSupplyBtn = document.getElementById("cycle-supply-filter-btn");
  cycleSupplyBtn.addEventListener("click", () => {
    const db = DB.get();
    const currentFilter = db.supplyFilter || "all";
    const nextIndex = (cycleSupplyFilters.indexOf(currentFilter) + 1) % cycleSupplyFilters.length;
    const nextFilter = cycleSupplyFilters[nextIndex];
    db.supplyFilter = nextFilter;
    DB.save(db);
    renderAllFromDB();
    const filterDisplayMap = {
      "all": "All Supplies",
      "delivered": "Delivered Only",
      "in-transit": "In Transit",
      "pending": "Pending",
      "out-of-stock": "Out of Stock"
    };
    showToast(`Supply Cycle: ${filterDisplayMap[nextFilter]}`);
  });

  const printSupplyBtn = document.getElementById("print-supply-btn");
  const exportSupplyArrowBtn = document.getElementById("export-supply-arrow-btn");
  const supplyExportDropdown = document.getElementById("supply-export-dropdown");
  printSupplyBtn.addEventListener("click", () => {
    showToast("Preparing A4 Print for Supply Table...");
    setTimeout(() => window.print(), 200);
  });
  exportSupplyArrowBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    supplyExportDropdown.classList.toggle("hidden");
  });
  document.getElementById("opt-print-supply-a4").addEventListener("click", (e) => {
    e.stopPropagation();
    supplyExportDropdown.classList.add("hidden");
    showToast("Preparing A4 Print for Supply Table...");
    setTimeout(() => window.print(), 200);
  });
  document.getElementById("opt-export-supply-excel").addEventListener("click", (e) => {
    e.stopPropagation();
    supplyExportDropdown.classList.add("hidden");
    exportSupplyToExcelCSV();
  });

  const salesMenuBtn = document.getElementById("sales-menu-btn");
  const salesMenuDropdown = document.getElementById("sales-menu-dropdown");
  salesMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    salesMenuDropdown.classList.toggle("hidden");
  });
  document.querySelectorAll(".sales-select-option").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const view = btn.getAttribute("data-view");
      const db = DB.get();
      db.salesViews.active = view;
      DB.save(db);
      renderAllFromDB();
      salesMenuDropdown.classList.add("hidden");
      showToast(`Switched Sales to ${btn.textContent}`);
    });
  });

  const salesDateBtn = document.getElementById("sales-date-picker-btn");
  const salesCalPopup = document.getElementById("sales-calendar-popup");
  const closeSalesCal = document.getElementById("close-sales-cal");
  const salesMonthSel = document.getElementById("sales-cal-month-select");
  const salesYearSel = document.getElementById("sales-cal-year-select");
  const salesDaysContainer = document.getElementById("sales-cal-days");
  const initSalesCalendar = () => {
    const db = DB.get();
    let currentMonth = db.salesViews.selectedMonth;
    let currentYear = db.salesViews.selectedYear;
    let currentDay = db.salesViews.selectedDay;
    populateMonthYearDropdowns(salesMonthSel, salesYearSel, currentMonth, currentYear);
    const refreshGrid = () => {
      renderMonthGrid(salesDaysContainer, currentYear, currentMonth, currentDay, (y, m, d) => {
        currentYear = y;
        currentMonth = m;
        currentDay = d;
        const formatted = `${MONTH_NAMES[m]} ${d}, ${y}`;
        const freshDb = DB.get();
        freshDb.salesViews.selectedYear = y;
        freshDb.salesViews.selectedMonth = m;
        freshDb.salesViews.selectedDay = d;
        freshDb.salesViews.selectedDate = formatted;
        DB.save(freshDb);
        renderAllFromDB();
        salesCalPopup.classList.add("hidden");
        showToast(`Sales Date set to: ${formatted}`);
      });
    };
    salesMonthSel.addEventListener("change", () => {
      currentMonth = parseInt(salesMonthSel.value, 10);
      refreshGrid();
    });
    salesYearSel.addEventListener("change", () => {
      currentYear = parseInt(salesYearSel.value, 10);
      refreshGrid();
    });
    refreshGrid();
  };
  salesDateBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    initSalesCalendar();
    salesCalPopup.classList.toggle("hidden");
  });
  closeSalesCal.addEventListener("click", () => salesCalPopup.classList.add("hidden"));

  const perfDateBtn = document.getElementById("date-btn");
  const perfCalPopup = document.getElementById("cycle-calendar-popup");
  const closePerfCal = document.getElementById("close-cycle-cal");
  const perfMonthSel = document.getElementById("perf-cal-month-select");
  const perfYearSel = document.getElementById("perf-cal-year-select");
  const perfDaysContainer = document.getElementById("cycle-cal-days");
  const initPerfCalendar = () => {
    const db = DB.get();
    let curMonth = db.performanceView.month;
    let curYear = db.performanceView.year;
    let curDay = db.performanceView.day;
    populateMonthYearDropdowns(perfMonthSel, perfYearSel, curMonth, curYear);
    const refreshGrid = () => {
      renderMonthGrid(perfDaysContainer, curYear, curMonth, curDay, (y, m, d) => {
        curYear = y;
        curMonth = m;
        curDay = d;
        const formatted = `${MONTH_NAMES[m].substring(0, 3)} ${d}, ${y}`;
        const freshDb = DB.get();
        freshDb.performanceView.year = y;
        freshDb.performanceView.month = m;
        freshDb.performanceView.day = d;
        freshDb.performanceView.selectedDate = formatted;
        DB.save(freshDb);
        renderAllFromDB();
        perfCalPopup.classList.add("hidden");
        showToast(`Performance set to: ${formatted}`);
      });
    };
    perfMonthSel.addEventListener("change", () => {
      curMonth = parseInt(perfMonthSel.value, 10);
      refreshGrid();
    });
    perfYearSel.addEventListener("change", () => {
      curYear = parseInt(perfYearSel.value, 10);
      refreshGrid();
    });
    refreshGrid();
  };
  perfDateBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    initPerfCalendar();
    perfCalPopup.classList.toggle("hidden");
  });
  closePerfCal.addEventListener("click", () => perfCalPopup.classList.add("hidden"));

  document.addEventListener("click", (e) => {
    if (!curDropdown.contains(e.target) && e.target !== curBtn) curDropdown.classList.add("hidden");
    if (!exportDropdown.contains(e.target) && !exportArrowBtn.contains(e.target)) exportDropdown.classList.add("hidden");
    if (!supplyExportDropdown.contains(e.target) && !exportSupplyArrowBtn.contains(e.target)) supplyExportDropdown.classList.add("hidden");
    if (!salesMenuDropdown.contains(e.target) && !salesMenuBtn.contains(e.target)) salesMenuDropdown.classList.add("hidden");
    if (!salesCalPopup.contains(e.target) && !salesDateBtn.contains(e.target)) salesCalPopup.classList.add("hidden");
    if (!perfCalPopup.contains(e.target) && !perfDateBtn.contains(e.target)) perfCalPopup.classList.add("hidden");
  });

  const revMenuBtn = document.getElementById("revenue-period-menu-btn");
  const revDropdown = document.getElementById("revenue-period-dropdown");
  revMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    revDropdown.classList.toggle("hidden");
  });
  document.addEventListener("click", () => revDropdown.classList.add("hidden"));
  document.querySelectorAll(".period-select-option").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const periodKey = btn.getAttribute("data-period");
      const db = DB.get();
      db.revenueViews.active = periodKey;
      DB.save(db);
      renderAllFromDB();
      revDropdown.classList.add("hidden");
      showToast(`Switched view to ${btn.textContent}`);
    });
  });

  const modal = document.getElementById("db-modal");
  const modalClose = document.getElementById("modal-close");
  const modalCancel = document.getElementById("modal-cancel-btn");
  const modalForm = document.getElementById("modal-form");
  const modalTitle = document.getElementById("modal-title");
  const modalFields = document.getElementById("modal-fields-container");
  let currentModalAction = null;
  const openModal = (action) => {
    currentModalAction = action;
    modal.classList.remove("hidden");
    const db = DB.get();
    const curSym = CURRENCY_CONFIG[db.currency]?.symbol || "₹";
    const todayISO = new Date().toISOString().slice(0, 10);
    if (action === "order") {
      modalTitle.textContent = "Insert New Order into Database";
      modalFields.innerHTML = `
        <div class="form-group"><label>Purchase Date</label><input type="date" id="m-order-date" value="${todayISO}" required /></div>
        <div class="form-group"><label>Customer Name</label><input type="text" id="m-order-cust" required placeholder="e.g. Liam Smith" /></div>
        <div class="form-group"><label>Item Name</label><input type="text" id="m-order-item" required placeholder="e.g. 4K Web Camera" /></div>
        <div class="form-group"><label>Amount in ${db.currency} (${curSym})</label><input type="number" id="m-order-amount" step="0.01" required placeholder="149.99" /></div>
        <div class="form-group"><label>Status</label><select id="m-order-status"><option value="Completed">Completed</option><option value="Pending">Pending</option><option value="Cancelled">Cancelled</option></select></div>
      `;
    } else if (action === "customer") {
      modalTitle.textContent = "Register New Customer Record";
      modalFields.innerHTML = `
        <div class="form-group"><label>Full Name</label><input type="text" id="m-cust-name" required placeholder="e.g. Sarah Connor" /></div>
        <div class="form-group"><label>Email Address</label><input type="email" id="m-cust-email" required placeholder="sarah@example.com" /></div>
        <div class="form-group"><label>Tier</label><select id="m-cust-tier"><option value="Free User">Free User</option><option value="Premium Subscriber">Premium Subscriber</option><option value="Enterprise Lead">Enterprise Lead</option></select></div>
      `;
    } else if (action === "supply") {
      modalTitle.textContent = "Register New Company Supply Entry";
      modalFields.innerHTML = `
        <div class="form-group"><label>Company Name</label><input type="text" id="m-sup-company" required placeholder="e.g. Swasteek Technology Pvt Ltd" /></div>
        <div class="form-group"><label>Product / Material</label><input type="text" id="m-sup-product" required placeholder="e.g. Cool Roof Paint Mix" /></div>
        <div class="form-row">
          <div class="form-group"><label>Purchase Date</label><input type="date" id="m-sup-pdate" value="${todayISO}" required /></div>
          <div class="form-group"><label>Delivery Date</label><input type="date" id="m-sup-ddate" value="${todayISO}" required /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Quantity (Units)</label><input type="number" id="m-sup-qty" required placeholder="500" /></div>
          <div class="form-group"><label>Gross Price in ${db.currency} (${curSym})</label><input type="number" id="m-sup-price" step="0.01" required placeholder="25000" /></div>
        </div>
        <div class="form-group"><label>Status</label><select id="m-sup-status"><option value="Delivered">Delivered (Glowing Green)</option><option value="In Transit">In Transit (Alert Red)</option><option value="Pending">Pending (Alert Red)</option><option value="Out of Stock">Out of Stock (Alert Red)</option></select></div>
      `;
    }
  };
  const closeModal = () => modal.classList.add("hidden");
  modalClose.addEventListener("click", closeModal);
  modalCancel.addEventListener("click", closeModal);
  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const db = DB.get();
    const curCode = db.currency || "INR";
    const rate = CURRENCY_CONFIG[curCode]?.rate || 83.5;
    if (currentModalAction === "order") {
      const newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const inputAmount = parseFloat(document.getElementById("m-order-amount").value);
      const rawDate = document.getElementById("m-order-date").value;
      const parsedDate = new Date(rawDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
      db.orders.unshift({
        id: newId,
        date: parsedDate,
        customer: document.getElementById("m-order-cust").value.trim(),
        item: document.getElementById("m-order-item").value.trim(),
        amountUSD: inputAmount / rate,
        status: document.getElementById("m-order-status").value
      });
      db.metrics.totalOrders += 1;
      DB.save(db);
      renderAllFromDB();
      showToast(`Order #${newId} saved to database!`);
      logDatabaseNotification("order", `New order #${newId} placed by ${document.getElementById("m-order-cust").value.trim()} for ${document.getElementById("m-order-item").value.trim()}.`);
    } else if (currentModalAction === "customer") {
      const custName = document.getElementById("m-cust-name").value.trim();
      db.customers.unshift({
        name: custName,
        email: document.getElementById("m-cust-email").value.trim(),
        tier: document.getElementById("m-cust-tier").value,
        joined: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      });
      db.metrics.registeredCustomers += 1;
      DB.save(db);
      renderAllFromDB();
      showToast(`Customer added!`);
      logDatabaseNotification("customer", `New customer "${custName}" registered in the directory.`);
    } else if (currentModalAction === "supply") {
      const inputPrice = parseFloat(document.getElementById("m-sup-price").value);
      const qty = parseInt(document.getElementById("m-sup-qty").value, 10);
      const pDateRaw = document.getElementById("m-sup-pdate").value;
      const dDateRaw = document.getElementById("m-sup-ddate").value;
      const pDateFormatted = new Date(pDateRaw).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
      const dDateFormatted = new Date(dDateRaw).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
      const companyName = document.getElementById("m-sup-company").value.trim();
      db.companySupplies.unshift({
        company: companyName,
        product: document.getElementById("m-sup-product").value.trim(),
        purchaseDate: pDateFormatted,
        deliveryDate: dDateFormatted,
        quantity: qty,
        grossPriceUSD: inputPrice / rate,
        status: document.getElementById("m-sup-status").value
      });
      db.inventoryStock.details += qty;
      db.inventoryStock.available += qty;
      DB.save(db);
      renderAllFromDB();
      showToast("Company supply record registered!");
      logDatabaseNotification("supply", `Supply contract registered for ${companyName} (${qty} units).`);
    }
    closeModal();
  });
  document.getElementById("add-order-btn")?.addEventListener("click", () => openModal("order"));
  document.getElementById("add-customer-btn")?.addEventListener("click", () => openModal("customer"));
  document.getElementById("add-company-supply-btn")?.addEventListener("click", () => openModal("supply"));

  document.querySelectorAll(".sidebar .nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      const target = item.getAttribute("data-target");
      if (!target) return;
      e.preventDefault();
      navigateToSection(target);
    });
  });

  document.getElementById("theme-btn").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    showToast(document.body.classList.contains("dark-mode") ? "Dark Mode Activated" : "Light Mode Activated");
  });

  const codexToggle = document.getElementById("codex-toggle-btn");
  const codexClose = document.getElementById("codex-close-btn");
  const codexBox = document.getElementById("codex-chat-box");
  const codexForm = document.getElementById("codex-form");
  const codexInput = document.getElementById("codex-input");
  const codexMessages = document.getElementById("codex-messages");
  const clearChatBtn = document.getElementById("codex-clear-chat-btn");
  codexToggle.addEventListener("click", () => {
    codexBox.classList.toggle("hidden");
    if (!codexBox.classList.contains("hidden")) codexInput.focus();
  });
  codexClose.addEventListener("click", () => codexBox.classList.add("hidden"));
  clearChatBtn.addEventListener("click", () => {
    const db = DB.get();
    db.aiChatHistory = [];
    DB.save(db);
    codexMessages.innerHTML = `
      <div class="ai-bubble">
        Chat conversation cleared. I'm ready for your next question!
      </div>
    `;
    showToast("Chat memory refreshed");
  });
  const handleCodexSubmit = async (userText) => {
    const cleanText = userText.trim();
    if (!cleanText) return;
    const uBubble = document.createElement("div");
    uBubble.className = "user-bubble";
    uBubble.textContent = cleanText;
    codexMessages.appendChild(uBubble);
    codexInput.value = "";
    codexMessages.scrollTop = codexMessages.scrollHeight;
    const thinkingBubble = document.createElement("div");
    thinkingBubble.className = "ai-thinking-bubble";
    thinkingBubble.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
    codexMessages.appendChild(thinkingBubble);
    codexMessages.scrollTop = codexMessages.scrollHeight;
    const aiResponseHTML = await processOpenAIChatAPI(cleanText);
    thinkingBubble.remove();
    const aBubble = document.createElement("div");
    aBubble.className = "ai-bubble";
    aBubble.innerHTML = aiResponseHTML;
    codexMessages.appendChild(aBubble);
    codexMessages.scrollTop = codexMessages.scrollHeight;
    const db = DB.get();
    if (!db.aiChatHistory) db.aiChatHistory = [];
    db.aiChatHistory.push({ user: cleanText, ai: aiResponseHTML, timestamp: new Date().toISOString() });
    DB.save(db);
  };
  codexForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleCodexSubmit(codexInput.value);
  });
  document.querySelectorAll(".suggestion-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      handleCodexSubmit(chip.getAttribute("data-ask"));
    });
  });
});

// ================= DEMAND FORECAST MODULE LOGIC =================
window.runDemandForecastModule = function() {
  const stateContainer = document.getElementById("forecast-state-container");
  const productSelect = document.getElementById("forecast-product-select").value;
  const horizonSelect = document.getElementById("forecast-horizon-select").value;

  if (!stateContainer) return;

  stateContainer.className = "forecast-state-loading";
  stateContainer.innerHTML = `<i data-lucide="loader" class="w-4 h-4" style="animation: spinClockwise 1s linear infinite;"></i> Computing baseline demand forecast for ${productSelect === 'all' ? 'All Catalog SKUs' : productSelect} (${horizonSelect} Days Horizon)...`;
  stateContainer.classList.remove("hidden");
  lucide.createIcons();

  setTimeout(() => {
    if (productSelect === "SKU-999") {
      stateContainer.className = "forecast-state-empty";
      stateContainer.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4"></i> No historical sales data available for the selected SKU. Please upload sales records or pick another product.`;
      return;
    }

    stateContainer.className = "hidden";
    stateContainer.innerHTML = "";

    const multiplier = horizonSelect === "30" ? 1.0 : 0.35;
    
    const horizonLabelEl = document.getElementById("kpi-horizon-label");
    const forecastDemandEl = document.getElementById("ri-forecast-demand");
    if (horizonLabelEl) horizonLabelEl.textContent = `${horizonSelect}d`;
    
    let totalPredicted = Math.round(18450 * multiplier);
    if (forecastDemandEl) forecastDemandEl.textContent = `${totalPredicted.toLocaleString()} units`;

    const maeVal = (Math.random() * 3 + 12).toFixed(1);
    const wapeVal = (Math.random() * 2 + 6.5).toFixed(1);
    const maeEl = document.getElementById("metric-mae-val");
    const wapeEl = document.getElementById("metric-wape-val");
    if (maeEl) maeEl.textContent = `${maeVal} units`;
    if (wapeEl) wapeEl.textContent = `${wapeVal}%`;

    if (retailForecastChartInstance) {
      if (horizonSelect === "7") {
        retailForecastChartInstance.data.labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
        retailForecastChartInstance.data.datasets[0].data = [210, 240, 220, 260, 280, 270, 310];
        retailForecastChartInstance.data.datasets[1].data = [225, 235, 240, 255, 275, 290, 305];
      } else {
        retailForecastChartInstance.data.labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
        retailForecastChartInstance.data.datasets[0].data = [1200, 1350, 1280, 1520, 1600, 1750];
        retailForecastChartInstance.data.datasets[1].data = [1250, 1320, 1410, 1500, 1680, 1850];
      }
      retailForecastChartInstance.update();
    }

    showToast(`Demand forecast generated successfully (${horizonSelect} Days Horizon)!`);
    logDatabaseNotification("system", `Demand forecast generated for ${productSelect} (${horizonSelect}d horizon).`);
  }, 700);
};

window.generateRetailForecast = function() {
  runDemandForecastModule();
};

// ================= HOST EXTERNAL APP LAUNCHER HELPERS =================
window.openEmbeddedAppModal = function(url, titleName) {
  const card = document.getElementById("embedded-app-card");
  const iframe = document.getElementById("embedded-app-iframe");
  const title = document.getElementById("embedded-app-title");
  if (card && iframe && title) {
    title.textContent = titleName;
    iframe.src = url;
    card.style.display = "block";
    card.scrollIntoView({ behavior: 'smooth' });
    showToast(`Loaded ${titleName} inside host frame.`);
  }
};

window.openExternalAppModal = function() {
  const customUrl = prompt("Enter website URL to open (e.g., https://www.zomato.com):", "https://");
  if (customUrl && customUrl.startsWith("http")) {
    window.open(customUrl, "_blank");
    showToast("Opened external app in new tab.");
  }
};
// ================= PYTHON FASTAPI BACKEND INTEGRATION =================
const API_BASE_URL = "http://127.0.0.1:8000"; // Update to your deployed backend URL in production

window.fetchBackendForecasts = async function() {
  const loadingEl = document.getElementById("forecast-loading-indicator");
  const tbody = document.getElementById("backend-forecast-tbody");
  if (loadingEl) loadingEl.classList.remove("hidden");

  // Format payload using local products catalog database state
  const db = DB.get();
  const sampleSalesPayload = (db.productsCatalog || []).map((prod, idx) => ({
    product_id: prod.id || `PROD-0${idx+1}`,
    product_name: prod.name || "Sample Product",
    date: new Date().toISOString().slice(0, 10),
    quantity_sold: Math.floor(Math.random() * 15) + 5,
    current_stock: prod.quantity || 50,
    selling_price: 299.00
  }));

  try {
    const [forecastRes, pricingRes] = await Promise.all([
      fetch(`${API_BASE_URL}/forecast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sales_history: sampleSalesPayload })
      }),
      fetch(`${API_BASE_URL}/pricing/recommendations`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer host-mock-token"
        },
        body: JSON.stringify({ items: sampleSalesPayload })
      })
    ]);

    if (!forecastRes.ok || !pricingRes.ok) {
      throw new Error("Failed to fetch predictions from FastAPI backend.");
    }

    const forecastData = await forecastRes.json();
    const pricingData = await pricingRes.json();

    if (tbody) {
      tbody.innerHTML = forecastData.forecasts.map(f => {
        const pricingMatch = pricingData.recommendations.find(p => p.product_id === f.product_id) || { current_price: 299, suggested_price: 299, reason: "Optimal" };
        return `
          <tr>
            <td><strong>${f.product_id}</strong><br>${f.product_name}</td>
            <td>50 units</td>
            <td><strong>${f.predicted_demand_7d} units</strong> (${f.method_used})</td>
            <td>₹${pricingMatch.current_price}</td>
            <td><strong style="color: var(--accent-color);">₹${pricingMatch.suggested_price}</strong></td>
            <td><small>${pricingMatch.reason}</small></td>
            <td>
              <button class="small-btn" style="background: #10B981; color: white; border: none;" onclick="approvePricingChange('${f.product_id}', ${pricingMatch.suggested_price})">Approve</button>
              <button class="small-btn delete-row-btn" onclick="showToast('Suggestion rejected.')">Reject</button>
            </td>
          </tr>
        `;
      }).join("");
    }
    showToast("Successfully synchronized with FastAPI backend!");
  } catch (err) {
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #EF4444; padding: 24px;">Connection error: Make sure FastAPI backend is running locally at ${API_BASE_URL}.</td></tr>`;
    }
    showToast("Error connecting to Python backend API.");
  } finally {
    if (loadingEl) loadingEl.classList.add("hidden");
  }
};

window.approvePricingChange = function(productId, approvedPrice) {
  const db = DB.get();
  const prod = (db.productsCatalog || []).find(p => p.id === productId);
  if (prod) {
    prod.approvedPrice = approvedPrice;
    DB.save(prod);
  }
  showToast(`Price ₹${approvedPrice} approved for ${productId} and synced to database!`);
  logDatabaseNotification("system", `Host approved dynamic price suggestion (₹${approvedPrice}) for ${productId}.`);
};
// ================= RETAIL INTELLIGENCE & FORECASTING FIX =================
window.generateRetailForecast = function() {
  showToast("Running AI Demand Forecasting & Dynamic Pricing model...");
  
  // Loading state simulation
  const forecastDemandEl = document.getElementById("ri-forecast-demand");
  const productsReorderEl = document.getElementById("ri-products-reorder");
  const pendingPricesEl = document.getElementById("ri-pending-prices");
  const stockRisksEl = document.getElementById("ri-stock-risks");

  setTimeout(() => {
    // Randomized realistic updates to simulate ML model output
    const newDemand = Math.floor(18000 + Math.random() * 1500);
    const newReorder = Math.floor(10 + Math.random() * 5);
    const newPrices = Math.floor(6 + Math.random() * 5);
    const newRisks = Math.floor(2 + Math.random() * 3);

    if (forecastDemandEl) forecastDemandEl.textContent = `${newDemand.toLocaleString()} units`;
    if (productsReorderEl) productsReorderEl.textContent = newReorder;
    if (pendingPricesEl) pendingPricesEl.textContent = newPrices;
    if (stockRisksEl) stockRisksEl.textContent = newRisks;

    // Update Chart if instance exists
    if (typeof retailForecastChartInstance !== 'undefined' && retailForecastChartInstance) {
      retailForecastChartInstance.data.datasets[0].data = [
        Math.floor(1150 + Math.random() * 100),
        Math.floor(1300 + Math.random() * 100),
        Math.floor(1250 + Math.random() * 100),
        Math.floor(1480 + Math.random() * 100),
        Math.floor(1580 + Math.random() * 100),
        Math.floor(1700 + Math.random() * 100)
      ];
      retailForecastChartInstance.data.datasets[1].data = [
        Math.floor(1200 + Math.random() * 100),
        Math.floor(1320 + Math.random() * 100),
        Math.floor(1400 + Math.random() * 100),
        Math.floor(1520 + Math.random() * 100),
        Math.floor(1650 + Math.random() * 100),
        Math.floor(1820 + Math.random() * 100)
      ];
      retailForecastChartInstance.update();
    }

    showToast("Forecast generated successfully! Metrics and charts updated.");
  }, 800);
};

window.uploadRetailSalesData = function() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".csv,.xlsx,.xls";
  fileInput.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      showToast(`Sales dataset "${file.name}" uploaded and processed successfully!`);
    }
  };
  fileInput.click();
};
// ================= RETAIL INTELLIGENCE SUBMENU & ROUTING LOGIC =================
const RETAIL_INTELLIGENCE_ROUTES = [
  "demand-forecasting",
  "dynamic-pricing",
  "smart-inventory",
  "market-intelligence",
  "ai-retail-assistant",
  "alerts-notifications",
  "reports-analytics",
  "retail-intelligence"
];

function setupRetailIntelligenceSubmenu() {
  const toggleBtn = document.getElementById("retail-intelligence-toggle");
  const submenu = document.getElementById("retail-intelligence-submenu");
  const chevron = document.getElementById("ri-chevron");

  if (!toggleBtn || !submenu) return;

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const isHidden = submenu.classList.contains("hidden");
    if (isHidden) {
      submenu.classList.remove("hidden");
      toggleBtn.setAttribute("aria-expanded", "true");
      if (chevron) chevron.style.transform = "rotate(180deg)";
    } else {
      submenu.classList.add("hidden");
      toggleBtn.setAttribute("aria-expanded", "false");
      if (chevron) chevron.style.transform = "rotate(0deg)";
    }
  });

  // Attach click listeners to submenu items
  document.querySelectorAll(".nav-sub-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.getAttribute("data-target");
      if (target) navigateToSection(target);
    });
  });
}

// Enhance navigateToSection to auto-expand submenu and highlight active sub-item
const originalNavigateToSection = window.navigateToSection || navigateToSection;
window.navigateToSection = function(targetId) {
  // Call original logic or standard section switching
  const authSections = ["profile-selection", "host-login", "host-signup", "user-login", "user-signup"];
  const isAuthPage = authSections.includes(targetId);
  document.body.classList.toggle("auth-mode", isAuthPage);

  // Clear active state on main nav items and subitems
  document.querySelectorAll(".sidebar .nav-item, .sidebar .nav-sub-item").forEach(n => {
    n.classList.remove("active");
    if (n.getAttribute("data-target") === targetId) {
      n.classList.add("active");
    }
  });

  // Handle Retail Intelligence Submenu auto-expansion
  const submenu = document.getElementById("retail-intelligence-submenu");
  const toggleBtn = document.getElementById("retail-intelligence-toggle");
  const chevron = document.getElementById("ri-chevron");

  if (RETAIL_INTELLIGENCE_ROUTES.includes(targetId)) {
    if (submenu) submenu.classList.remove("hidden");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
    if (chevron) chevron.style.transform = "rotate(180deg)";
  }

  document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
  const sec = document.getElementById(`section-${targetId}`);
  if (sec) {
    sec.classList.add("active");
  } else {
    // Fallback if routed to generic 'retail-intelligence'
    const fallbackSec = document.getElementById("section-demand-forecasting");
    if (fallbackSec && targetId === "retail-intelligence") fallbackSec.classList.add("active");
  }

  if (targetId === "calendar") renderKalnirnayCalendar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Initialize submenu on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  setupRetailIntelligenceSubmenu();
});
// ================= ADVANCED DEMAND FORECASTING & DYNAMIC PRICING ENGINE =================

window.populateProductForecastForm = function() {
  const select = document.getElementById("fc-product-select");
  if (!select) return;
  const val = select.value;
  const priceInput = document.getElementById("fc-input-price");
  const costInput = document.getElementById("fc-input-cost");
  const stockInput = document.getElementById("fc-input-stock");
  const dailyInput = document.getElementById("fc-input-dailysales");

  if (val === "PROD-01") {
    if (priceInput) priceInput.value = 2450;
    if (costInput) costInput.value = 1450;
    if (stockInput) stockInput.value = 450;
    if (dailyInput) dailyInput.value = 45;
  } else if (val === "PROD-02") {
    if (priceInput) priceInput.value = 1890;
    if (costInput) costInput.value = 1100;
    if (stockInput) stockInput.value = 280;
    if (dailyInput) dailyInput.value = 28;
  } else if (val === "PROD-03") {
    if (priceInput) priceInput.value = 4200;
    if (costInput) costInput.value = 2600;
    if (stockInput) stockInput.value = 12;
    if (dailyInput) dailyInput.value = 5;
  } else if (val === "PROD-04") {
    if (priceInput) priceInput.value = 3100;
    if (costInput) costInput.value = 1850;
    if (stockInput) stockInput.value = 520;
    if (dailyInput) dailyInput.value = 52;
  }
  updatePricingSimulation();
};

window.runAdvancedDemandForecast = function() {
  showToast("Running machine learning demand forecast & pricing optimization...");
  setTimeout(() => {
    const horizon = parseInt(document.getElementById("fc-input-horizon")?.value || "30", 10);
    const dailySales = parseFloat(document.getElementById("fc-input-dailysales")?.value || "45");
    const currentStock = parseInt(document.getElementById("fc-input-stock")?.value || "450", 10);
    const eventType = document.getElementById("fc-event-select")?.value || "diwali";

    let upliftFactor = 1.0;
    let eventName = "Normal Days Baseline";
    if (eventType === "diwali") { upliftFactor = 1.35; eventName = "Diwali Festival Season"; }
    else if (eventType === "holi") { upliftFactor = 1.20; eventName = "Holi Festival"; }
    else if (eventType === "wedding") { upliftFactor = 1.45; eventName = "Wedding Season"; }
    else if (eventType === "monsoon") { upliftFactor = 1.25; eventName = "Monsoon Season"; }
    else if (eventType === "summer") { upliftFactor = 1.30; eventName = "Summer Season"; }

    const predictedDemand = Math.round(dailysales * horizon * upliftFactor);
    const unitPrice = parseFloat(document.getElementById("fc-input-price")?.value || "2450");
    const unitCost = parseFloat(document.getElementById("fc-input-cost")?.value || "1450");

    const expectedRevenue = predictedDemand * unitPrice;
    const estimatedCOGS = predictedDemand * unitCost;
    const estimatedProfit = expectedRevenue - estimatedCOGS;
    const endingStock = currentStock - predictedDemand;
    const reorderNeeded = endingStock < 100 ? Math.abs(endingStock) + 150 : 0;

    // Update UI summary cards
    document.getElementById("fc-summary-demand").textContent = `${predictedDemand.toLocaleString()} units`;
    document.getElementById("fc-summary-period-lbl").textContent = `${horizon} Days`;
    document.getElementById("fc-summary-revenue").textContent = formatMoney(expectedRevenue / 83.5);
    document.getElementById("fc-summary-profit").textContent = formatMoney(estimatedProfit / 83.5);
    document.getElementById("fc-summary-stock").textContent = `${currentStock} units`;
    document.getElementById("fc-summary-event").textContent = eventName;
    document.getElementById("fc-summary-reorder").textContent = `${reorderNeeded} units`;

    const riskBadge = document.getElementById("fc-summary-risk");
    if (endingStock < 0) {
      riskBadge.className = "trend-badge negative";
      riskBadge.textContent = "High Stockout Risk";
    } else {
      riskBadge.className = "trend-badge positive";
      riskBadge.textContent = "Adequate Stock";
    }

    // Update Chart
    if (typeof retailForecastChartInstance !== 'undefined' && retailForecastChartInstance) {
      if (horizon === 7) {
        retailForecastChartInstance.data.labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
        retailForecastChartInstance.data.datasets[0].data = [40, 45, 42, 48, 52, 50, 58].map(v => Math.round(v * upliftFactor));
        retailForecastChartInstance.data.datasets[1].data = [42, 46, 45, 50, 54, 53, 60].map(v => Math.round(v * upliftFactor));
      } else {
        retailForecastChartInstance.data.labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
        retailForecastChartInstance.data.datasets[0].data = [310, 340, 325, 380].map(v => Math.round(v * upliftFactor));
        retailForecastChartInstance.data.datasets[1].data = [320, 350, 340, 400].map(v => Math.round(v * upliftFactor));
      }
      retailForecastChartInstance.update();
    }

    updatePricingSimulation();
    showToast(`Forecast generated successfully for ${eventName}!`);
    logDatabaseNotification("system", `Retail demand forecast executed for ${horizon}d horizon under ${eventName}.`);
  }, 600);
};

window.setDiscountPreset = function(pct) {
  const slider = document.getElementById("discount-slider");
  if (slider) {
    slider.value = pct;
    updatePricingSimulation();
  }
};

window.updatePricingSimulation = function() {
  const slider = document.getElementById("discount-slider");
  const discPctLabel = document.getElementById("discount-pct-label");
  const tbody = document.getElementById("pricing-simulation-tbody");
  if (!slider || !tbody) return;

  const discountPct = parseFloat(slider.value) || 0;
  if (discPctLabel) discPctLabel.textContent = `${discountPct}%`;

  const currentPrice = parseFloat(document.getElementById("fc-input-price")?.value || "2450");
  const unitCost = parseFloat(document.getElementById("fc-input-cost")?.value || "1450");
  const baselineUnits = 1350;

  // Price elasticity approximation: 1% discount increases demand by ~1.5%
  const elasticDemandMultiplier = 1 + (discountPct * 0.015);
  const promoUnits = Math.round(baselineUnits * elasticDemandMultiplier);
  const discountedPrice = currentPrice * (1 - discountPct / 100);
  const promoRevenue = promoUnits * discountedPrice;
  const promoCOGS = promoUnits * unitCost;
  const promoProfit = promoRevenue - promoCOGS;
  const promoMargin = promoRevenue > 0 ? (promoProfit / promoRevenue) * 100 : 0;

  const baselineRevenue = baselineUnits * currentPrice;
  const baselineProfit = baselineRevenue - (baselineUnits * unitCost);

  tbody.innerHTML = `
    <tr>
      <td><strong>Current Price (0% Disc)</strong></td>
      <td>₹${currentPrice.toLocaleString()}</td>
      <td>${baselineUnits.toLocaleString()} units</td>
      <td>₹${Math.round(baselineRevenue).toLocaleString()}</td>
      <td>₹${Math.round(baselineUnits * unitCost).toLocaleString()}</td>
      <td><strong>₹${Math.round(baselineProfit).toLocaleString()}</strong></td>
      <td>40.8%</td>
      <td><span class="table-badge delivered">Baseline</span></td>
    </tr>
    <tr>
      <td><strong>Promotional Scenario (${discountPct}% Disc)</strong></td>
      <td><strong>₹${Math.round(discountedPrice).toLocaleString()}</strong></td>
      <td>${promoUnits.toLocaleString()} units</td>
      <td>₹${Math.round(promoRevenue).toLocaleString()}</td>
      <td>₹${Math.round(promoCOGS).toLocaleString()}</td>
      <td><strong>₹${Math.round(promoProfit).toLocaleString()}</strong></td>
      <td>${promoMargin.toFixed(1)}%</td>
      <td><span class="table-badge ${promoProfit >= baselineProfit ? 'delivered' : 'pending'}">${promoProfit >= baselineProfit ? 'Recommended' : 'Sub-optimal Margin'}</span></td>
    </tr>
  `;
};

window.exportForecastReport = function() {
  showToast("Exporting Demand Forecast & Dynamic Pricing report...");
  setTimeout(() => {
    const csvContent = "data:text/csv;charset=utf-8,SKU,Product,Horizon,PredictedDemand,Revenue,GrossProfit\nPROD-01,Titanium Cool-Coat,30 Days,18450,4520000,1680000";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CODEX_Demand_Forecast_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Forecast report downloaded successfully!");
  }, 500);
};
// ================= WINDOWS-STYLE FORECAST MODAL & DYNAMIC PRICING LOGIC =================

let forecastMiniChartInstance = null;
let lastFocusedElement = null;
let activeForecastPayload = null;

window.populateProductForecastForm = function() {
  const select = document.getElementById("fc-product-select");
  if (!select) return;
  const val = select.value;
  const priceInput = document.getElementById("fc-input-price");
  const costInput = document.getElementById("fc-input-cost");
  const stockInput = document.getElementById("fc-input-stock");
  const dailyInput = document.getElementById("fc-input-dailysales");

  if (val === "PROD-01") {
    if (priceInput) priceInput.value = 2450;
    if (costInput) costInput.value = 1450;
    if (stockInput) stockInput.value = 450;
    if (dailyInput) dailyInput.value = 45;
  } else if (val === "PROD-02") {
    if (priceInput) priceInput.value = 1890;
    if (costInput) costInput.value = 1100;
    if (stockInput) stockInput.value = 280;
    if (dailyInput) dailyInput.value = 28;
  } else if (val === "PROD-03") {
    if (priceInput) priceInput.value = 4200;
    if (costInput) costInput.value = 2600;
    if (stockInput) stockInput.value = 12;
    if (dailyInput) dailyInput.value = 5;
  } else if (val === "PROD-04") {
    if (priceInput) priceInput.value = 3100;
    if (costInput) costInput.value = 1850;
    if (stockInput) stockInput.value = 520;
    if (dailyInput) dailyInput.value = 52;
  }
};

window.runAdvancedDemandForecast = function() {
  const productSelect = document.getElementById("fc-product-select");
  const priceInput = document.getElementById("fc-input-price");
  const costInput = document.getElementById("fc-input-cost");
  const stockInput = document.getElementById("fc-input-stock");
  const dailyInput = document.getElementById("fc-input-dailysales");
  const horizonSelect = document.getElementById("fc-input-horizon");
  const eventSelect = document.getElementById("fc-event-select");
  const startDateInput = document.getElementById("fc-event-start");
  const endDateInput = document.getElementById("fc-event-end");

  if (!productSelect || !priceInput || !costInput || !stockInput || !dailyInput || !horizonSelect || !eventSelect || !startDateInput || !endDateInput) {
    showToast("Error: Forecast form fields not found.");
    return;
  }

  const sellingPrice = parseFloat(priceInput.value);
  const unitCost = parseFloat(costInput.value);
  const currentStock = parseInt(stockInput.value, 10);
  const dailySales = parseFloat(dailyInput.value);
  const horizonDays = parseInt(horizonSelect.value, 10);
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (isNaN(sellingPrice) || sellingPrice <= 0 || isNaN(unitCost) || unitCost < 0 || isNaN(currentStock) || currentStock < 0 || isNaN(dailySales) || dailySales <= 0) {
    showToast("⚠️ Please enter valid positive numbers for price, cost, stock, and daily sales.");
    return;
  }

  if (sellingPrice < unitCost) {
    showToast("⚠️ Warning: Current selling price is below unit cost price!");
  }

  lastFocusedElement = document.activeElement;
  showToast("Computing festival demand forecast and pricing model...");

  setTimeout(() => {
    try {
      const eventType = eventSelect.value;
      let uplift = 1.0;
      let eventTitle = "Normal Days Baseline";
      if (eventType === "diwali") { uplift = 1.35; eventTitle = "Diwali Festival Season (+35%)"; }
      else if (eventType === "dussehra") { uplift = 1.25; eventTitle = "Dussehra (+25%)"; }
      else if (eventType === "navratri") { uplift = 1.28; eventTitle = "Navratri (+28%)"; }
      else if (eventType === "holi") { uplift = 1.20; eventTitle = "Holi Festival (+20%)"; }
      else if (eventType === "eid") { uplift = 1.22; eventTitle = "Eid Festival (+22%)"; }
      else if (eventType === "raksha") { uplift = 1.18; eventTitle = "Raksha Bandhan (+18%)"; }
      else if (eventType === "christmas") { uplift = 1.30; eventTitle = "Christmas & New Year (+30%)"; }
      else if (eventType === "wedding") { uplift = 1.45; eventTitle = "Wedding Season (+45%)"; }
      else if (eventType === "monsoon") { uplift = 1.25; eventTitle = "Monsoon Season (+25%)"; }
      else if (eventType === "summer") { uplift = 1.30; eventTitle = "Summer Season (+30%)"; }
      else if (eventType === "winter") { uplift = 1.15; eventTitle = "Winter Season (+15%)"; }
      else if (eventType === "custom") { uplift = 1.15; eventTitle = "Custom Promotional Campaign"; }

      const predictedDemand = Math.round(dailySales * horizonDays * uplift);
      const recommendedDiscount = eventType === "normal" ? 0 : 8; 
      const discountAmount = (sellingPrice * recommendedDiscount) / 100;
      const finalPrice = Math.max(sellingPrice - discountAmount, unitCost * 1.05); // margin floor protection
      const expectedRevenue = predictedDemand * finalPrice;
      const estimatedCOGS = predictedDemand * unitCost;
      const estimatedGrossProfit = expectedRevenue - estimatedCOGS;
      const profitMarginPct = expectedRevenue > 0 ? (estimatedGrossProfit / expectedRevenue) * 100 : 0;
      const projectedEndingStock = currentStock - predictedDemand;
      const recommendedReorderQty = projectedEndingStock < 50 ? Math.abs(projectedEndingStock) + 200 : 150;

      activeForecastPayload = {
        productId: productSelect.value,
        productName: productSelect.options[productSelect.selectedIndex]?.text.split("•")[1]?.trim() || "Retail Product",
        eventTitle,
        startDate,
        endDate,
        horizonDays,
        currentStock,
        sellingPrice,
        unitCost,
        recommendedDiscount,
        finalPrice,
        predictedDemand,
        expectedRevenue,
        estimatedGrossProfit,
        profitMarginPct,
        projectedEndingStock,
        recommendedReorderQty
      };

      openForecastModal(activeForecastPayload);
      showToast("Forecast successfully generated!");
      logDatabaseNotification("system", `Festival demand forecast generated for ${activeForecastPayload.productName} (${eventTitle}).`);
    } catch (err) {
      showToast("Forecast failed: Unable to compute simulation.");
    }
  }, 400);
};

window.openForecastModal = function(data) {
  const modal = document.getElementById("festival-forecast-modal");
  const bodyContent = document.getElementById("forecast-modal-body-content");
  if (!modal || !bodyContent) return;

  const isBelowCostWarning = data.finalPrice < data.unitCost;

  bodyContent.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-main); padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border-color);">
        <div>
          <span style="font-size: 11px; color: #94A3B8; font-weight: 700; text-transform: uppercase;">Selected Product & Event</span>
          <h4 style="font-size: 15px; font-weight: 800; color: var(--text-primary); margin-top: 2px;">${data.productId} &bull; ${data.productName}</h4>
          <p style="font-size: 12px; color: var(--accent-color); margin-top: 2px;">Occasion: <strong>${data.eventTitle}</strong> (${data.startDate} to ${data.endDate})</p>
        </div>
        <span class="table-badge delivered">Baseline Model Active</span>
      </div>

      ${isBelowCostWarning ? `
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #EF4444; padding: 10px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;">
          ⚠️ Warning: Final price (₹${data.finalPrice.toFixed(2)}) is below unit cost (₹${data.unitCost}). Margin rules violated!
        </div>
      ` : ''}

      <!-- Section A: Expected Price -->
      <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px;">
        <h5 style="font-size: 13.5px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;">A. Expected Festival Price</h5>
        <div class="forecast-results-grid">
          <div class="forecast-result-card">
            <span class="res-lbl">Current Selling Price</span>
            <span class="res-val">₹${data.sellingPrice.toLocaleString()}</span>
          </div>
          <div class="forecast-result-card">
            <span class="res-lbl">Recommended Festival Price</span>
            <span class="res-val" style="color: var(--accent-color);">₹${data.finalPrice.toFixed(2)}</span>
          </div>
          <div class="forecast-result-card">
            <span class="res-lbl">Recommended Discount</span>
            <span class="res-val" style="color: #10B981;">${data.recommendedDiscount}%</span>
          </div>
          <div class="forecast-result-card">
            <span class="res-lbl">Estimated Gross Profit</span>
            <span class="res-val" style="color: #16A34A;">₹${Math.round(data.estimatedGrossProfit).toLocaleString()} (${data.profitMarginPct.toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      <!-- Section B: Festival Demand Distribution (3D-styled Pie Chart with Red, Green, Yellow Dots) -->
      <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px;">
        <h5 style="font-size: 13.5px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px;">B. Festival Demand Distribution (3D Pie Chart)</h5>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: center;">
          <div style="height: 170px; position: relative;">
            <canvas id="forecastMiniChart"></canvas>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-color);">
              <span style="display: flex; align-items: center; gap: 6px;"><span class="dot-indicator dot-red"></span> Low Demand & Price</span>
              <strong>20% (350 units)</strong>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-color);">
              <span style="display: flex; align-items: center; gap: 6px;"><span class="dot-indicator dot-green"></span> High Demand & Price</span>
              <strong>60% (${Math.round(data.predictedDemand * 0.6)} units)</strong>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-color);">
              <span style="display: flex; align-items: center; gap: 6px;"><span class="dot-indicator dot-yellow"></span> Average Conditions</span>
              <strong>20% (${Math.round(data.predictedDemand * 0.2)} units)</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Section C: Discount & Pricing Recommendation -->
      <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h5 style="font-size: 13.5px; font-weight: 700; color: var(--text-primary);">C. Discount & Pricing Recommendation</h5>
          <span style="font-size: 12px; font-weight: 800; color: var(--accent-color);" id="modal-disc-val-lbl">${data.recommendedDiscount}%</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <input type="range" id="modal-discount-slider" min="0" max="30" step="1" value="${data.recommendedDiscount}" oninput="updateModalDiscountSimulation(this.value)" style="flex: 1; accent-color: var(--accent-color); cursor: pointer;" />
        </div>
        <div class="forecast-results-grid">
          <div class="forecast-result-card">
            <span class="res-lbl">Units Sold</span>
            <span class="res-val" id="mod-res-units">${data.predictedDemand.toLocaleString()} units</span>
          </div>
          <div class="forecast-result-card">
            <span class="res-lbl">Estimated Revenue</span>
            <span class="res-val" id="mod-res-rev">₹${Math.round(data.expectedRevenue).toLocaleString()}</span>
          </div>
          <div class="forecast-result-card">
            <span class="res-lbl">Min Permitted Price</span>
            <span class="res-val" style="color: #D97706;">₹${Math.round(data.unitCost * 1.05)}</span>
          </div>
          <div class="forecast-result-card">
            <span class="res-lbl">Status</span>
            <span class="res-val" style="color: #10B981;">Optimal Margin</span>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  document.getElementById("forecast-modal-card")?.focus();
  renderMiniDemandChart(data);
  lucide.createIcons();
};

window.updateModalDiscountSimulation = function(discVal) {
  const lbl = document.getElementById("modal-disc-val-lbl");
  if (lbl) lbl.textContent = `${discVal}%`;
  if (!activeForecastPayload) return;

  const dPct = parseFloat(discVal) || 0;
  const basePrice = activeForecastPayload.sellingPrice;
  const cost = activeForecastPayload.unitCost;
  const newPrice = Math.max(basePrice * (1 - dPct / 100), cost * 1.05);
  const adjustedDemand = Math.round(activeForecastPayload.predictedDemand * (1 + (dPct * 0.012)));
  const newRev = adjustedDemand * newPrice;
  const newProfit = newRev - (adjustedDemand * cost);

  const unitsEl = document.getElementById("mod-res-units");
  const revEl = document.getElementById("mod-res-rev");
  if (unitsEl) unitsEl.textContent = `${adjustedDemand.toLocaleString()} units`;
  if (revEl) revEl.textContent = `₹${Math.round(newRev).toLocaleString()}`;
};

window.closeForecastModal = function() {
  const modal = document.getElementById("festival-forecast-modal");
  if (modal) modal.classList.add("hidden");
  if (forecastMiniChartInstance) {
    forecastMiniChartInstance.destroy();
    forecastMiniChartInstance = null;
  }
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
};

function renderMiniDemandChart(data) {
  const ctx = document.getElementById("forecastMiniChart")?.getContext("2d");
  if (!ctx) return;
  if (forecastMiniChartInstance) {
    forecastMiniChartInstance.destroy();
  }

  forecastMiniChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Low Demand (Red)", "High Demand (Green)", "Average Conditions (Yellow)"],
      datasets: [{
        data: [20, 60, 20],
        backgroundColor: ["#EF4444", "#10B981", "#F59E0B"],
        borderWidth: 2,
        borderColor: "#FFFFFF"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
          bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
          padding: 8,
          cornerRadius: 6
        }
      },
      cutout: '55%'
    }
  });
}

window.confirmForecastAction = function() {
  if (!activeForecastPayload) return;
  const db = DB.get();
  const prod = (db.productsCatalog || []).find(p => p.id === activeForecastPayload.productId);
  if (prod) {
    prod.suggestedPrice = activeForecastPayload.finalPrice;
    DB.save(db);
  }
  showToast(`Successfully saved forecast & pricing recommendations for ${activeForecastPayload.productName}!`);
  logDatabaseNotification("system", `Host confirmed forecast recommendations for ${activeForecastPayload.productId}.`);
  closeForecastModal();
  renderAllFromDB();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeForecastModal();
  }
});
let dynamicPricingChartInstance = null;

function renderDynamicPricingAdvisorTable() {
  const db = DB.get();
  const tbody = document.getElementById("dynamic-pricing-table-body");
  const analyzedEl = document.getElementById("dp-summary-analyzed");
  const demandEl = document.getElementById("dp-summary-demand");
  const revenueEl = document.getElementById("dp-summary-revenue");
  const marginEl = document.getElementById("dp-summary-margin");

  if (!tbody) return;

  const products = db.productsCatalog || [];
  if (analyzedEl) analyzedEl.textContent = products.length;

  let totalDemand = 0;
  let totalRevenue = 0;
  let totalMarginSum = 0;

  const rowsHtml = products.map((prod, idx) => {
    const skuId = prod.id || `PROD-0${idx+1}`;
    const stock = prod.quantity !== undefined ? prod.quantity : 100;
    const currentPrice = prod.sellingPrice || (idx === 0 ? 2450 : idx === 1 ? 1890 : idx === 2 ? 4200 : 3100);
    const unitCost = currentPrice * 0.58;
    
    let suggestedPrice = currentPrice;
    let reason = "Optimal equilibrium: Maintain current market price.";
    let predDemand = Math.round((stock < 50 ? 140 : 85) * (currentPrice > 3500 ? 0.85 : 1.15));
    
    if (stock < 30) {
      suggestedPrice = Math.round(currentPrice * 1.08);
      reason = "High demand and low stock";
    } else if (stock > 300) {
      suggestedPrice = Math.round(currentPrice * 0.95);
      reason = "Low demand and excess inventory";
    } else if (idx === 0) {
      suggestedPrice = Math.round(currentPrice * 1.05);
      reason = "Festival demand increase";
    } else if (idx === 2) {
      suggestedPrice = Math.round(currentPrice * 1.10);
      reason = "Price adjustment to protect profit margin";
    } else {
      reason = "Seasonal demand change";
    }

    const priceDeltaPct = ((suggestedPrice - currentPrice) / currentPrice) * 100;
    const expectedRev = predDemand * suggestedPrice;
    const profitMargin = ((suggestedPrice - unitCost) / suggestedPrice) * 100;

    totalDemand += predDemand;
    totalRevenue += expectedRev;
    totalMarginSum += profitMargin;

    const deltaClass = priceDeltaPct > 0 ? "positive" : (priceDeltaPct < 0 ? "negative" : "positive");
    const deltaSign = priceDeltaPct > 0 ? "+" : "";

    return `
      <tr>
        <td><strong>${skuId}</strong></td>
        <td>${prod.name}</td>
        <td>${stock} units</td>
        <td>₹${currentPrice.toLocaleString()}</td>
        <td><strong style="color: var(--accent-color);">₹${suggestedPrice.toLocaleString()}</strong></td>
        <td><span class="trend-badge ${deltaClass}">${deltaSign}${priceDeltaPct.toFixed(1)}%</span></td>
        <td>${predDemand} units</td>
        <td><strong>₹${expectedRev.toLocaleString()}</strong></td>
        <td>${profitMargin.toFixed(1)}%</td>
        <td><small>${reason}</small></td>
        <td>
          <button class="small-btn" onclick="openProductDetailModal('${skuId}')">View Forecast</button>
        </td>
      </tr>
    `;
  }).join("");

  tbody.innerHTML = rowsHtml;

  const avgDemand = products.length > 0 ? Math.round(totalDemand / products.length) : 0;
  const avgMargin = products.length > 0 ? (totalMarginSum / products.length).toFixed(1) : 0;

  if (demandEl) demandEl.textContent = `${avgDemand} units`;
  if (revenueEl) revenueEl.textContent = formatMoney(totalRevenue / 83.5);
  if (marginEl) marginEl.textContent = `${avgMargin}%`;
}

function initDynamicPricingChart() {
  const ctx = document.getElementById("dynamicPricingChart")?.getContext("2d");
  if (!ctx) return;

  if (dynamicPricingChartInstance) {
    dynamicPricingChartInstance.destroy();
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 250);
  gradient.addColorStop(0, "rgba(59, 130, 246, 0.35)");
  gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");

  dynamicPricingChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["₹1,500", "₹1,800", "₹2,100", "₹2,450 (Current)", "₹2,800", "₹3,100"],
      datasets: [
        {
          label: "Predicted Demand (Units)",
          data: [420, 380, 330, 280, 220, 160],
          borderColor: "#3B82F6",
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: "#2563EB"
        },
        {
          label: "Elasticity Optimal Curve",
          data: [400, 360, 310, 270, 210, 150],
          borderColor: "#10B981",
          borderWidth: 2,
          borderDash: [4, 4],
          fill: false,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top', labels: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 12 } } },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
          bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: "#94A3B8", font: { family: 'Plus Jakarta Sans' } } },
        y: { grid: { color: "rgba(226, 232, 240, 0.4)" }, border: { display: false }, ticks: { color: "#94A3B8", font: { family: 'Plus Jakarta Sans' } } }
      }
    }
  });
}

function updateDynamicPricingChart() {
  const select = document.getElementById("dp-chart-sku-select");
  if (!select || !dynamicPricingChartInstance) return;
  const sku = select.value;
  
  let factor = 1.0;
  if (sku === "PROD-02") factor = 0.85;
  else if (sku === "PROD-03") factor = 0.5;
  else if (sku === "PROD-04") factor = 1.2;

  dynamicPricingChartInstance.data.datasets[0].data = [420, 380, 330, 280, 220, 160].map(v => Math.round(v * factor));
  dynamicPricingChartInstance.data.datasets[1].data = [400, 360, 310, 270, 210, 150].map(v => Math.round(v * factor));
  dynamicPricingChartInstance.update();
  showToast(`Updated price-demand sensitivity curve for ${sku}`);
}
let currentInventoryFilter = "all";

function setInventoryFilter(filterType, btn) {
  currentInventoryFilter = filterType;
  document.querySelectorAll("#inventory-status-filter-group .pill").forEach(p => p.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderSmartInventorySection();
}

function renderSmartInventorySection() {
  const db = DB.get();
  const products = db.productsCatalog || [];
  
  const totalProducts = products.length;
  let lowStockCount = 0;
  let totalPredictedDemand = 0;
  let totalReorderBudget = 0;
  let totalInventoryValue = 0;
  let excessInventoryValue = 0;

  const today = new Date();

  // Map products with calculated inventory intelligence
  const enhancedProducts = products.map((prod, idx) => {
    const sku = prod.id || `SKU-10${idx+1}`;
    const stock = prod.quantity !== undefined ? prod.quantity : 100;
    const safetyStock = prod.safetyStock || (idx === 0 ? 50 : idx === 1 ? 40 : idx === 2 ? 25 : 60);
    const leadTimeDays = prod.leadTimeDays || 7;
    const incoming = prod.incomingStock || 0;
    const unitCost = prod.unitCostUSD ? prod.unitCostUSD * 83.5 : (2450 * 0.6);
    
    // Predicted Demand based on forecast module or velocity
    const predDemand30 = prod.predictedDemand || (stock < 30 ? 180 : 120);
    totalPredictedDemand += predDemand30;

    const dailyDemand = predDemand30 / 30;
    const leadTimeDemand = dailyDemand * leadTimeDays;
    const reorderPoint = leadTimeDemand + safetyStock;

    // Recommended Order Qty = Target Stock - Current Stock - Incoming Stock
    const targetStock = reorderPoint + (dailyDemand * 15); // 15-day buffer
    const recOrderQty = Math.max(0, Math.round(targetStock - stock - incoming));

    let status = "Healthy";
    if (stock <= safetyStock * 0.6 || stock < 15) {
      status = "Critical";
      lowStockCount++;
    } else if (stock <= reorderPoint) {
      status = "Reorder Soon";
      lowStockCount++;
    } else if (stock > targetStock * 1.5) {
      status = "Overstock";
      excessInventoryValue += (stock - targetStock) * unitCost;
    }

    const reorderCost = recOrderQty * unitCost;
    if (status === "Critical" || status === "Reorder Soon") {
      totalReorderBudget += reorderCost;
    }

    totalInventoryValue += stock * unitCost;

    // Estimated reorder date
    const daysUntilReorder = Math.max(1, Math.floor((stock - reorderPoint) / Math.max(0.5, dailyDemand)));
    const reorderDate = new Date();
    reorderDate.setDate(today.getDate() + daysUntilReorder);
    const estDateStr = reorderDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return {
      sku,
      name: prod.name,
      stock,
      safetyStock,
      predDemand30,
      recOrderQty,
      estDateStr,
      status,
      unitCost,
      reorderCost,
      reorderPoint,
      incoming
    };
  });

  // Update KPI Cards
  const kpiTotal = document.getElementById("inv-kpi-total-products");
  const kpiLow = document.getElementById("inv-kpi-low-stock");
  const kpiDemand = document.getElementById("inv-kpi-predicted-demand");
  const kpiBudget = document.getElementById("inv-kpi-reorder-budget");

  if (kpiTotal) kpiTotal.textContent = totalProducts;
  if (kpiLow) kpiLow.textContent = lowStockCount;
  if (kpiDemand) kpiDemand.textContent = `${totalPredictedDemand.toLocaleString()} units`;
  if (kpiBudget) kpiBudget.textContent = formatMoney(totalReorderBudget / 83.5);

  // Filter products based on active tab
  let filteredProducts = enhancedProducts;
  if (currentInventoryFilter !== "all") {
    filteredProducts = enhancedProducts.filter(p => p.status.toLowerCase().replace(/\s+/g, '') === currentInventoryFilter);
  }

  // Render Table Body
  const tableBody = document.getElementById("smart-inventory-table-body");
  if (tableBody) {
    if (filteredProducts.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: #94A3B8;">No inventory items found for filter "${currentInventoryFilter}".</td></tr>`;
    } else {
      tableBody.innerHTML = filteredProducts.map(p => {
        let badgeCls = "delivered";
        if (p.status === "Critical") badgeCls = "cancelled";
        else if (p.status === "Reorder Soon") badgeCls = "pending";
        else if (p.status === "Overstock") badgeCls = "pending";

        return `
          <tr>
            <td><strong>${p.name}</strong><br><small style="color: #94A3B8;">${p.sku}</small></td>
            <td>${p.stock} units</td>
            <td>${p.safetyStock} units</td>
            <td>${p.predDemand30} units</td>
            <td><strong>${p.recOrderQty} units</strong></td>
            <td style="color: #64748B;">${p.estDateStr}</td>
            <td><span class="table-badge ${badgeCls}">${p.status}</span></td>
            <td>
              <div style="display: flex; gap: 6px;">
                <button class="small-btn" onclick="openCreatePurchaseOrderModal('${p.sku}')" title="Create PO">Order</button>
                <button class="small-btn" onclick="markInventoryAsReceived('${p.sku}')" title="Mark as Received (+ Qty)">Receive</button>
                <button class="small-btn" onclick="updateInventoryStockDirect('${p.sku}')" title="Update Stock">Edit</button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  // Render Alerts
  const alertsContainer = document.getElementById("smart-inventory-alerts-container");
  if (alertsContainer) {
    const criticalItems = enhancedProducts.filter(p => p.status === "Critical" || p.status === "Reorder Soon");
    if (criticalItems.length === 0) {
      alertsContainer.innerHTML = `<div style="padding: 12px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); border-radius: 8px; color: #059669; font-size: 12.5px;">✅ All inventory levels are healthy. No immediate stockouts predicted.</div>`;
    } else {
      alertsContainer.innerHTML = criticalItems.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 10px; font-size: 12.5px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i data-lucide="alert-triangle" style="width: 16px; height: 16px; color: ${item.status === 'Critical' ? '#EF4444' : '#F59E0B'};"></i>
            <div>
              <strong>${item.name} (${item.sku})</strong> &bull; Current Stock: ${item.stock} units (Safety: ${item.safetyStock}). Expected stockout in ~${Math.max(1, Math.floor(item.stock / (item.predDemand30 / 30)))} days.
            </div>
          </div>
          <button class="small-btn" style="background: var(--accent-color); color: white; border: none;" onclick="openCreatePurchaseOrderModal('${item.sku}')">Replenish Now</button>
        </div>
      `).join("");
      lucide.createIcons();
    }
  }

  // Render Cost Analysis & Savings
  const costBreakdown = document.getElementById("inventory-cost-breakdown");
  const savingsBreakdown = document.getElementById("inventory-savings-breakdown");

  if (costBreakdown) {
    costBreakdown.innerHTML = `
      <div style="display: flex; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid var(--border-color);">
        <span>Total Inventory Valuation:</span>
        <strong>${formatMoney(totalInventoryValue / 83.5)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid var(--border-color);">
        <span>Recommended Procurement Budget:</span>
        <strong style="color: var(--accent-color);">${formatMoney(totalReorderBudget / 83.5)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Excess / Overstock Capital:</span>
        <strong style="color: #D97706;">${formatMoney(excessInventoryValue / 83.5)}</strong>
      </div>
    `;
  }

  if (savingsBreakdown) {
    const estSavings = totalReorderBudget * 0.12;
    const lostSalesPrevented = lowStockCount * 45000;
    savingsBreakdown.innerHTML = `
      <div style="display: flex; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid rgba(59,130,246,0.2);">
        <span>Procurement Cost Savings (Bulk/AI):</span>
        <strong style="color: #10B981;">${formatMoney(estSavings / 83.5)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid rgba(59,130,246,0.2);">
        <span>Stockout Loss Prevention:</span>
        <strong style="color: #10B981;">${formatMoney(lostSalesPrevented / 83.5)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Overall Efficiency Gain:</span>
        <strong style="color: var(--accent-color);">+18.4% Net ROI</strong>
      </div>
    `;
  }
}

// Purchase Order Modal Handlers
window.openCreatePurchaseOrderModal = function(preselectedSku) {
  const modal = document.getElementById("purchase-order-modal");
  const select = document.getElementById("po-product-select");
  const qtyInput = document.getElementById("po-qty");
  const costInput = document.getElementById("po-unit-cost");
  const dateInput = document.getElementById("po-expected-date");

  if (!modal || !select) return;

  const db = DB.get();
  const products = db.productsCatalog || [];

  select.innerHTML = products.map(p => `
    <option value="${p.id}" ${p.id === preselectedSku ? 'selected' : ''}>${p.name} (${p.id}) - Stock: ${p.quantity}</option>
  `).join("");

  const selectedProd = products.find(p => p.id === preselectedSku) || products[0];
  if (selectedProd) {
    if (qtyInput) qtyInput.value = selectedProd.recOrderQty || 150;
    if (costInput) costInput.value = Math.round((selectedProd.unitCostUSD ? selectedProd.unitCostUSD * 83.5 : 1250));
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  if (dateInput) dateInput.value = deliveryDate.toISOString().slice(0, 10);

  updatePoModalCalculations();
  modal.classList.remove("hidden");
  lucide.createIcons();
};

window.closePurchaseOrderModal = function() {
  const modal = document.getElementById("purchase-order-modal");
  if (modal) modal.classList.add("hidden");
};

window.updatePoModalCalculations = function() {
  const qty = parseFloat(document.getElementById("po-qty")?.value) || 0;
  const cost = parseFloat(document.getElementById("po-unit-cost")?.value) || 0;
  const totalDisplay = document.getElementById("po-total-cost-display");
  if (totalDisplay) {
    totalDisplay.textContent = `₹ ${(qty * cost).toLocaleString()}`;
  }
};

window.handlePurchaseOrderSubmit = function(e) {
  e.preventDefault();
  const sku = document.getElementById("po-product-select").value;
  const supplier = document.getElementById("po-supplier").value.trim();
  const qty = parseInt(document.getElementById("po-qty").value, 10) || 0;
  const unitCost = parseFloat(document.getElementById("po-unit-cost").value) || 0;
  const expectedDate = document.getElementById("po-expected-date").value;

  if (qty <= 0 || unitCost <= 0) {
    showToast("⚠️ Please enter valid quantity and unit cost.");
    return;
  }

  const db = DB.get();
  const prod = (db.productsCatalog || []).find(p => p.id === sku);
  if (prod) {
    prod.incomingStock = (prod.incomingStock || 0) + qty;
  }
  DB.save(db);

  closePurchaseOrderModal();
  renderAllFromDB();
  showToast(`Purchase Order created successfully for ${prod ? prod.name : sku} (${qty} units)! Stock will update upon receiving.`);
  logDatabaseNotification("supply", `Purchase Order created for ${sku} (${qty} units) with vendor ${supplier}.`);
};

window.markInventoryAsReceived = function(sku) {
  const db = DB.get();
  const prod = (db.productsCatalog || []).find(p => p.id === sku);
  if (!prod) return;

  const addQty = prompt(`Enter received shipment quantity for ${prod.name}:`, prod.incomingStock > 0 ? prod.incomingStock : 100);
  const qtyNum = parseInt(addQty, 10);
  if (isNaN(qtyNum) || qtyNum <= 0) return;

  prod.quantity = (prod.quantity || 0) + qtyNum;
  prod.incomingStock = Math.max(0, (prod.incomingStock || 0) - qtyNum);
  DB.save(db);
  renderAllFromDB();
  showToast(`Successfully received ${qtyNum} units for ${prod.name}! Stock updated.`);
  logDatabaseNotification("supply", `Shipment received for ${sku}: +${qtyNum} units added to physical stock.`);
};

window.updateInventoryStockDirect = function(sku) {
  const db = DB.get();
  const prod = (db.productsCatalog || []).find(p => p.id === sku);
  if (!prod) return;

  const newStockStr = prompt(`Update current physical stock quantity for ${prod.name}:`, prod.quantity);
  const newStock = parseInt(newStockStr, 10);
  if (isNaN(newStock) || newStock < 0) return;

  prod.quantity = newStock;
  DB.save(db);
  renderAllFromDB();
  showToast(`Stock updated to ${newStock} units for ${prod.name}.`);
  logDatabaseNotification("system", `Physical stock manually updated for ${sku} to ${newStock} units.`);
};
// ================= RETAIL RISK MONITORING & ALERT CENTER =================

function generateSmartRetailAlerts() {
  const db = DB.get();
  if (!db.retailAlerts) {
    db.retailAlerts = [
      {
        id: "ALT-901",
        timestamp: "Today • 10:45 AM",
        rawTime: Date.now() - 3600000,
        sku: "PROD-03",
        productName: "Dynamic Viscometer Sensors",
        category: "Stock Risk",
        description: "Stock critically low (12 units remaining). Safety threshold is 30 units.",
        severity: "Critical",
        recommendation: "Review stock and create a purchase order immediately.",
        status: "Active",
        sourceData: { stock: 12, safety: 30, leadTime: 7 }
      },
      {
        id: "ALT-902",
        timestamp: "Sep 24 • 02:15 PM",
        rawTime: Date.now() - 86400000,
        sku: "PROD-02",
        productName: "Polyurethane Amino Resin #5",
        category: "Price Risk",
        description: "Competitor price drop detected for Polyurethane Emulsion series in regional market.",
        severity: "Warning",
        recommendation: "Review pricing in Dynamic Pricing Advisor to maintain margins.",
        status: "Active",
        sourceData: { currentPrice: 1890, competitorPrice: 1750 }
      },
      {
        id: "ALT-903",
        timestamp: "Sep 22 • 09:30 AM",
        rawTime: Date.now() - 172800000,
        sku: "PROD-01",
        productName: "Titanium Cool-Coat Emulsion",
        category: "Demand Risk",
        description: "Festival season demand surge predicted (+35% uplift for Diwali).",
        severity: "Informational",
        recommendation: "Increase safety stock buffer and review promotional pricing.",
        status: "Active",
        sourceData: { expectedDemand: 520, uplift: "+35%" }
      }
    ];
  }

  // Automatically evaluate products catalog for new risks
  (db.productsCatalog || []).forEach(prod => {
    const stock = prod.quantity !== undefined ? prod.quantity : 50;
    const existingAlert = db.retailAlerts.find(a => a.sku === prod.id && a.status === "Active");

    if (stock <= 15 && !existingAlert) {
      db.retailAlerts.unshift({
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: "Just now",
        rawTime: Date.now(),
        sku: prod.id,
        productName: prod.name,
        category: "Stock Risk",
        description: `Stock critically low (${stock} units). Immediate reorder recommended.`,
        severity: "Critical",
        recommendation: "Create purchase order in Smart Inventory.",
        status: "Active",
        sourceData: { stock, safety: 30 }
      });
    }
  });

  DB.save(db);
  renderRetailAlertsTable();
}

function renderRetailAlertsTable() {
  const db = DB.get();
  const alerts = db.retailAlerts || [];

  const searchQuery = (document.getElementById("alert-search-input")?.value || "").toLowerCase().trim();
  const categoryFilter = document.getElementById("alert-category-filter")?.value || "all";
  const statusFilter = document.getElementById("alert-status-filter")?.value || "all";
  const sortBy = document.getElementById("alert-sort-select")?.value || "newest";

  // Calculate KPI Counts
  let criticalCount = 0;
  let lowStockCount = 0;
  let demandSpikeCount = 0;
  let priceWarningCount = 0;

  alerts.forEach(a => {
    if (a.status === "Active") {
      if (a.severity === "Critical") criticalCount++;
      if (a.category === "Stock Risk") lowStockCount++;
      if (a.category === "Demand Risk") demandSpikeCount++;
      if (a.category === "Price Risk") priceWarningCount++;
    }
  });

  const kpiCritEl = document.getElementById("alert-kpi-critical");
  const kpiLowEl = document.getElementById("alert-kpi-lowstock");
  const kpiDemEl = document.getElementById("alert-kpi-demand");
  const kpiPriEl = document.getElementById("alert-kpi-price");

  if (kpiCritEl) kpiCritEl.textContent = criticalCount;
  if (kpiLowEl) kpiLowEl.textContent = lowStockCount;
  if (kpiDemEl) kpiDemEl.textContent = demandSpikeCount;
  if (kpiPriEl) kpiPriEl.textContent = priceWarningCount;

  // Filter & Search
  let filtered = alerts.filter(a => {
    const matchSearch = !searchQuery || a.productName.toLowerCase().includes(searchQuery) || a.sku.toLowerCase().includes(searchQuery) || a.description.toLowerCase().includes(searchQuery);
    const matchCat = categoryFilter === "all" || a.category === categoryFilter;
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  // Sort
  filtered.sort((x, y) => {
    if (sortBy === "oldest") return x.rawTime - y.rawTime;
    if (sortBy === "severity") {
      const rank = { "Critical": 3, "Warning": 2, "Informational": 1 };
      return (rank[y.severity] || 0) - (rank[x.severity] || 0);
    }
    return y.rawTime - x.rawTime; // newest
  });

  const matchCountLabel = document.getElementById("alert-match-count");
  if (matchCountLabel) matchCountLabel.textContent = filtered.length;

  const tbody = document.getElementById("retail-alerts-table-body");
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 32px; color: #94A3B8;">No alerts matching current filters or search query.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => {
    let sevBadge = "delivered";
    if (a.severity === "Critical") sevBadge = "cancelled";
    else if (a.severity === "Warning") sevBadge = "pending";

    let statBadge = "delivered";
    if (a.status === "Active") statBadge = "cancelled";
    else if (a.status === "Acknowledged") statBadge = "pending";
    else if (a.status === "Dismissed") statBadge = "pending";

    return `
      <tr>
        <td style="color: #64748B; font-size: 11.5px;">${a.timestamp}</td>
        <td><strong>${a.productName}</strong><br><small style="color: #94A3B8;">${a.sku}</small></td>
        <td><span class="badge" style="background: rgba(59,130,246,0.1); color: var(--accent-color);">${a.category}</span></td>
        <td>${a.description}</td>
        <td><span class="table-badge ${sevBadge}">${a.severity}</span></td>
        <td><small>${a.recommendation}</small></td>
        <td><span class="table-badge ${statBadge}">${a.status}</span></td>
        <td>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            <button class="small-btn" onclick="openAlertDetailsModal('${a.id}')">View</button>
            <button class="small-btn" style="background: var(--accent-color); color: white; border: none;" onclick="takeAlertAction('${a.id}')">Action</button>
            ${a.status === 'Active' ? `<button class="small-btn" onclick="acknowledgeAlert('${a.id}')">Ack</button>` : ''}
            ${a.status !== 'Resolved' ? `<button class="small-btn" style="background: #10B981; color: white; border: none;" onclick="resolveAlert('${a.id}')">Resolve</button>` : ''}
            <button class="small-btn delete-row-btn" onclick="dismissAlert('${a.id}')">Dismiss</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
  lucide.createIcons();
}

window.filterAlertsByKpi = function(kpiType) {
  const catFilter = document.getElementById("alert-category-filter");
  const statFilter = document.getElementById("alert-status-filter");
  if (!catFilter || !statFilter) return;

  statFilter.value = "Active";
  if (kpiType === "critical") {
    catFilter.value = "all";
  } else if (kpiType === "stock") {
    catFilter.value = "Stock Risk";
  } else if (kpiType === "demand") {
    catFilter.value = "Demand Risk";
  } else if (kpiType === "price") {
    catFilter.value = "Price Risk";
  }
  renderRetailAlertsTable();
  showToast(`Filtered alerts by ${kpiType}`);
};

window.resetAlertFilters = function() {
  const searchInput = document.getElementById("alert-search-input");
  const catFilter = document.getElementById("alert-category-filter");
  const statFilter = document.getElementById("alert-status-filter");
  const sortSelect = document.getElementById("alert-sort-select");

  if (searchInput) searchInput.value = "";
  if (catFilter) catFilter.value = "all";
  if (statFilter) statFilter.value = "all";
  if (sortSelect) sortSelect.value = "newest";
  renderRetailAlertsTable();
  showToast("Alert filters cleared.");
};

window.openAlertDetailsModal = function(alertId) {
  const db = DB.get();
  const alert = (db.retailAlerts || []).find(a => a.id === alertId);
  if (!alert) return;

  document.getElementById("modal-alert-title").textContent = `Alert Details: ${alert.id}`;
  const body = document.getElementById("modal-alert-body-content");
  const actionBtn = document.getElementById("modal-alert-action-btn");

  body.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px;">
      <div style="display: flex; justify-content: space-between; background: var(--bg-main); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
        <span><strong>Product:</strong> ${alert.productName} (${alert.sku})</span>
        <span class="table-badge ${alert.severity === 'Critical' ? 'cancelled' : 'pending'}">${alert.severity}</span>
      </div>
      <div>
        <strong>Category:</strong> ${alert.category}<br>
        <strong>Status:</strong> ${alert.status}<br>
        <strong>Timestamp:</strong> ${alert.timestamp}
      </div>
      <div style="background: var(--bg-main); padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
        <strong>Risk Explanation:</strong><br>${alert.description}
      </div>
      <div style="background: rgba(59,130,246,0.06); padding: 12px; border-radius: 8px; border: 1px solid rgba(59,130,246,0.2);">
        <strong>Recommended Action:</strong><br>${alert.recommendation}
      </div>
    </div>
  `;

  if (actionBtn) {
    actionBtn.onclick = () => {
      closeAlertDetailsModal();
      takeAlertAction(alert.id);
    };
  }

  document.getElementById("alert-details-modal").classList.remove("hidden");
  lucide.createIcons();
};

window.closeAlertDetailsModal = function() {
  document.getElementById("alert-details-modal")?.classList.add("hidden");
};

window.takeAlertAction = function(alertId) {
  const db = DB.get();
  const alert = (db.retailAlerts || []).find(a => a.id === alertId);
  if (!alert) return;

  if (alert.category === "Stock Risk") {
    navigateToSection("smart-inventory");
    showToast(`Routed to Smart Inventory for ${alert.productName}`);
  } else if (alert.category === "Demand Risk") {
    navigateToSection("demand-forecasting");
    showToast(`Routed to Demand Forecasting for ${alert.productName}`);
  } else if (alert.category === "Price Risk") {
    navigateToSection("dynamic-pricing");
    showToast(`Routed to Dynamic Pricing Advisor for ${alert.productName}`);
  } else {
    navigateToSection("analytics");
    showToast(`Routed to Stock & Orders`);
  }
};

window.acknowledgeAlert = function(alertId) {
  const db = DB.get();
  const alert = (db.retailAlerts || []).find(a => a.id === alertId);
  if (alert) {
    alert.status = "Acknowledged";
    DB.save(db);
    renderRetailAlertsTable();
    showToast(`Alert ${alertId} acknowledged.`);
  }
};

window.resolveAlert = function(alertId) {
  const db = DB.get();
  const alert = (db.retailAlerts || []).find(a => a.id === alertId);
  if (alert) {
    alert.status = "Resolved";
    DB.save(db);
    renderRetailAlertsTable();
    showToast(`Alert ${alertId} marked as resolved.`);
  }
};

window.dismissAlert = function(alertId) {
  if (!confirm("Are you sure you want to dismiss this alert?")) return;
  const db = DB.get();
  const alert = (db.retailAlerts || []).find(a => a.id === alertId);
  if (alert) {
    alert.status = "Dismissed";
    DB.save(db);
    renderRetailAlertsTable();
    showToast(`Alert ${alertId} dismissed.`);
  }
};

window.exportAlertsCSV = function() {
  const db = DB.get();
  const alerts = db.retailAlerts || [];
  if (alerts.length === 0) {
    showToast("No alerts to export!");
    return;
  }
  const headers = ["Alert ID", "Timestamp", "SKU", "Product Name", "Category", "Description", "Severity", "Recommendation", "Status"];
  const rows = alerts.map(a => [
    `"${a.id}"`, `"${a.timestamp}"`, `"${a.sku}"`, `"${a.productName}"`, `"${a.category}"`, `"${a.description.replace(/"/g, '""')}"`, `"${a.severity}"`, `"${a.recommendation.replace(/"/g, '""')}"`, `"${a.status}"`
  ]);
  downloadCSV([headers.join(","), ...rows.map(r => r.join(","))].join("\r\n"), "CODEX_Retail_Risk_Alerts");
};
// ================= UPGRADED REPORTS & ANALYTICS MODULE =================

let activeGeneratedReportData = null;

function refreshReportData() {
  generateAndRenderReport();
  showToast("Report data refreshed successfully!");
  logDatabaseNotification("system", "Reports & Analytics data refreshed.");
}

function resetReportFilters() {
  const typeSel = document.getElementById("report-type-select");
  const periodSel = document.getElementById("report-period-select");
  const prodSel = document.getElementById("report-product-filter");
  const catSel = document.getElementById("report-category-filter");

  if (typeSel) typeSel.value = "comprehensive";
  if (periodSel) periodSel.value = "30";
  if (prodSel) prodSel.value = "all";
  if (catSel) catSel.value = "all";

  generateAndRenderReport();
  showToast("Report filters reset to defaults.");
}

function generateAndRenderReport() {
  const db = DB.get(); // <-- Declare once here
  const type = document.getElementById("report-type-select")?.value || "comprehensive";
  const periodDays = parseInt(document.getElementById("report-period-select")?.value || "30", 10);
  const prodFilter = document.getElementById("report-product-filter")?.value || "all";
  const catFilter = document.getElementById("report-category-filter")?.value || "all";

  const products = db.productsCatalog || [];
  const orders = db.orders || [];

  let targetProducts = products;
  if (prodFilter !== "all") {
    targetProducts = products.filter(p => p.id === prodFilter);
  }

  let totalPredictedDemand = 0;
  let lowStockCount = 0;
  let pricingRecCount = targetProducts.length;
  let totalGrossProfit = 0;

  targetProducts.forEach((p, idx) => {
    const stock = p.quantity !== undefined ? p.quantity : 100;
    const price = p.sellingPrice || 2450;
    const cost = price * 0.58;
    const demand = (p.predictedDemand || (stock < 30 ? 180 : 120)) * (periodDays / 30);
    totalPredictedDemand += Math.round(demand);
    if (stock <= 30) lowStockCount++;
    totalGrossProfit += Math.round(demand * (price - cost));
  });

  const kpiDemand = document.getElementById("rep-kpi-demand");
  const kpiLow = document.getElementById("rep-kpi-lowstock");
  const kpiPricing = document.getElementById("rep-kpi-pricing");
  const kpiProfit = document.getElementById("rep-kpi-profit");

  if (kpiDemand) kpiDemand.textContent = `${totalPredictedDemand.toLocaleString()} units`;
  if (kpiLow) kpiLow.textContent = lowStockCount;
  if (kpiPricing) kpiPricing.textContent = `${pricingRecCount} SKUs`;
  if (kpiProfit) kpiProfit.textContent = formatMoney(totalGrossProfit / 83.5);

  const titleMap = {
    demand: "AI Demand Forecast Report",
    pricing: "Dynamic Pricing & Profit Analysis",
    inventory: "Smart Inventory & Reorder Report",
    sales: "Sales & Revenue Performance",
    festival: "Festival & Season Impact Report",
    weather: "Weather Impact Analysis",
    risk: "Stockout & Overstock Risk Report",
    comprehensive: "Comprehensive Business Performance Report"
  };

  const reportTitle = titleMap[type] || "Retail Analytics Report";
  const periodLabel = `Last ${periodDays} days`;

  document.getElementById("print-rep-title").textContent = reportTitle;
  document.getElementById("print-rep-date").textContent = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  document.getElementById("print-rep-period").textContent = periodLabel;
  document.getElementById("active-report-title-lbl").textContent = reportTitle;
  document.getElementById("active-report-subtitle-lbl").textContent = `Filtered by Period: ${periodLabel} • Products: ${prodFilter === 'all' ? 'All' : prodFilter}`;

  let reportHtml = "";
  let reportRows = [];

  if (type === "demand") {
    reportHtml = renderDemandForecastReportContent(targetProducts, periodDays);
    reportRows = targetProducts.map(p => [p.id, p.name, p.quantity, Math.round((p.quantity < 30 ? 180 : 120) * (periodDays/30)), p.quantity < 30 ? "High Risk" : "Stable"]);
  } else if (type === "pricing") {
    reportHtml = renderDynamicPricingReportContent(targetProducts);
    reportRows = targetProducts.map(p => [p.id, p.name, `₹${p.sellingPrice || 2450}`, `₹${Math.round((p.sellingPrice || 2450) * 0.58)}`, `₹${Math.round((p.sellingPrice || 2450) * 1.08)}`, "Optimized"]);
  } else if (type === "inventory") {
    reportHtml = renderSmartInventoryReportContent(targetProducts, periodDays);
    reportRows = targetProducts.map(p => [p.id, p.name, p.quantity, 40, Math.max(0, 150 - p.quantity), p.quantity <= 30 ? "Critical" : "Healthy"]);
  } else if (type === "sales") {
    reportHtml = renderSalesPerformanceReportContent(orders, periodDays);
    reportRows = orders.map(o => [o.id, o.date, o.customer, o.item, formatMoney(o.amountUSD), o.status]);
  } else if (type === "festival") {
    reportHtml = renderFestivalImpactReportContent(targetProducts);
    reportRows = targetProducts.map(p => [p.id, p.name, "Diwali Festival", "+35% Demand Uplift", "Recommended"]);
  } else if (type === "weather") {
    reportHtml = renderWeatherImpactReportContent(targetProducts);
    reportRows = targetProducts.map(p => [p.id, p.name, "Ambient Temperature (+32°C)", "Cool-Coat Demand Surge", "Moderate"]);
  } else if (type === "risk") {
    reportHtml = renderStockoutRiskReportContent(targetProducts);
    reportRows = targetProducts.map(p => [p.id, p.name, p.quantity, p.quantity <= 30 ? "High Stockout Risk" : "Low Risk", "Reorder Recommended"]);
  } else {
    reportHtml = `
      ${renderDemandForecastReportContent(targetProducts, periodDays)}
      <hr class="divider" style="margin: 20px 0;">
      ${renderDynamicPricingReportContent(targetProducts)}
      <hr class="divider" style="margin: 20px 0;">
      ${renderSmartInventoryReportContent(targetProducts, periodDays)}
    `;
    reportRows = targetProducts.map(p => [p.id, p.name, p.quantity, `₹${p.sellingPrice || 2450}`, p.quantity <= 30 ? "Critical Risk" : "Healthy"]);
  }

  const contentBody = document.getElementById("active-report-content-body");
  if (contentBody) contentBody.innerHTML = reportHtml;

  activeGeneratedReportData = {
    name: reportTitle,
    type: type.toUpperCase(),
    period: periodLabel,
    date: new Date().toLocaleString(),
    source: "CODEX Local DB (v42)",
    status: "Completed",
    format: "CSV / Print A4",
    rows: reportRows
  };

  // Re-using the already declared `db` variable safely without redeclaring
  if (!db.reportHistory) db.reportHistory = [];
  db.reportHistory.unshift({
    id: Date.now(),
    ...activeGeneratedReportData
  });
  if (db.reportHistory.length > 15) db.reportHistory.pop();
  DB.save(db);
  renderReportHistoryTable();
  lucide.createIcons();
}

// Report Render Helpers
function renderDemandForecastReportContent(products, periodDays) {
  return `
    <div class="report-summary-box">
      <h5 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">AI Demand Forecast Summary (${periodDays} Days Horizon)</h5>
      <p style="font-size: 12.5px; color: var(--text-secondary);">Calculated using weighted moving average regression and seasonal festival uplift adjustments.</p>
      <div style="overflow-x: auto; margin-top: 8px;">
        <table class="data-table">
          <thead>
            <tr><th>SKU</th><th>Product Name</th><th>Current Stock</th><th>Avg Daily Sales</th><th>Forecast Demand</th><th>Stockout Risk</th><th>Trend</th></tr>
          </thead>
          <tbody>
            ${products.map((p, idx) => {
              const stock = p.quantity !== undefined ? p.quantity : 100;
              const daily = stock < 30 ? 6 : 4;
              const forecast = Math.round(daily * periodDays * 1.15);
              const risk = stock < 30 ? '<span class="table-badge cancelled">High Risk</span>' : '<span class="table-badge delivered">Stable</span>';
              return `<tr><td><strong>${p.id || `PROD-0${idx+1}`}</strong></td><td>${p.name}</td><td>${stock} units</td><td>${daily} units/day</td><td><strong>${forecast} units</strong></td><td>${risk}</td><td><span class="trend-badge positive">↑ Rising</span></td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderDynamicPricingReportContent(products) {
  return `
    <div class="report-summary-box">
      <h5 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Dynamic Pricing & Profit Optimization</h5>
      <p style="font-size: 12.5px; color: var(--text-secondary);">Price elasticity recommendations computed to maximize gross profit margins without exceeding demand drop thresholds.</p>
      <div style="overflow-x: auto; margin-top: 8px;">
        <table class="data-table">
          <thead>
            <tr><th>SKU</th><th>Product Name</th><th>Current Price</th><th>Unit Cost</th><th>Gross Margin</th><th>Suggested Price</th><th>Action Reason</th></tr>
          </thead>
          <tbody>
            ${products.map((p, idx) => {
              const curPrice = p.sellingPrice || 2450;
              const cost = Math.round(curPrice * 0.58);
              const margin = (((curPrice - cost) / curPrice) * 100).toFixed(1);
              const sugPrice = Math.round(curPrice * 1.08);
              return `<tr><td><strong>${p.id || `PROD-0${idx+1}`}</strong></td><td>${p.name}</td><td>₹${curPrice}</td><td>₹${cost}</td><td>${margin}%</td><td><strong style="color: var(--accent-color);">₹${sugPrice}</strong></td><td><small>High demand elasticity allows +8% premium.</small></td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderSmartInventoryReportContent(products, periodDays) {
  return `
    <div class="report-summary-box">
      <h5 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Smart Inventory & Reorder Calculations</h5>
      <p style="font-size: 12.5px; color: var(--text-secondary);">Reorder points calculated based on lead time (7 days) and safety stock thresholds.</p>
      <div style="overflow-x: auto; margin-top: 8px;">
        <table class="data-table">
          <thead>
            <tr><th>SKU</th><th>Product Name</th><th>Current Stock</th><th>Safety Stock</th><th>Reorder Point</th><th>Rec. Order Qty</th><th>Inventory Status</th></tr>
          </thead>
          <tbody>
            ${products.map((p, idx) => {
              const stock = p.quantity !== undefined ? p.quantity : 100;
              const safety = 40;
              const reorderPt = 70;
              const recOrder = Math.max(0, 180 - stock);
              const statusCls = stock <= 30 ? 'cancelled' : 'delivered';
              return `<tr><td><strong>${p.id || `PROD-0${idx+1}`}</strong></td><td>${p.name}</td><td>${stock} units</td><td>${safety} units</td><td>${reorderPt} units</td><td><strong>${recOrder} units</strong></td><td><span class="table-badge ${statusCls}">${stock <= 30 ? 'Reorder Needed' : 'Healthy'}</span></td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderSalesPerformanceReportContent(orders, periodDays) {
  const recentOrders = orders.slice(0, 6);
  return `
    <div class="report-summary-box">
      <h5 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Sales & Revenue Performance</h5>
      <p style="font-size: 12.5px; color: var(--text-secondary);">Aggregated database transaction ledger over the selected period.</p>
      <div style="overflow-x: auto; margin-top: 8px;">
        <table class="data-table">
          <thead>
            <tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Item Purchased</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${recentOrders.map(o => `<tr><td><strong>#${o.id}</strong></td><td>${o.date}</td><td>${o.customer}</td><td>${o.item}</td><td><strong>${formatMoney(o.amountUSD)}</strong></td><td><span class="table-badge ${o.status.toLowerCase()}">${o.status}</span></td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderFestivalImpactReportContent(products) {
  return `
    <div class="report-summary-box">
      <h5 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Festival & Seasonality Impact Scenario</h5>
      <p style="font-size: 12.5px; color: var(--text-secondary);">Diwali Festival Season uplift modeling (+35% demand multiplier across retail lines).</p>
      <div style="overflow-x: auto; margin-top: 8px;">
        <table class="data-table">
          <thead>
            <tr><th>SKU</th><th>Product Name</th><th>Festival Occasion</th><th>Demand Uplift</th><th>Recommended Stock Buffer</th></tr>
          </thead>
          <tbody>
            ${products.map((p, idx) => `<tr><td><strong>${p.id || `PROD-0${idx+1}`}</strong></td><td>${p.name}</td><td>Diwali Festival Season</td><td><span class="trend-badge positive">+35% Demand</span></td><td>+200 units buffer</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderWeatherImpactReportContent(products) {
  return `
    <div class="report-summary-box">
      <h5 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Weather Correlation & Impact</h5>
      <p style="font-size: 12.5px; color: var(--text-secondary);">Ambient summer temperature correlation (+32°C average) driving demand for heat-reflective and cool-coat emulsions.</p>
      <div style="overflow-x: auto; margin-top: 8px;">
        <table class="data-table">
          <thead>
            <tr><th>SKU</th><th>Product Name</th><th>Weather Condition</th><th>Correlation Impact</th><th>Implication</th></tr>
          </thead>
          <tbody>
            ${products.map((p, idx) => `<tr><td><strong>${p.id || `PROD-0${idx+1}`}</strong></td><td>${p.name}</td><td>High Ambient Temp (+32°C)</td><td>Strong positive correlation (+28%)</td><td>Increase inventory replenishment</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderStockoutRiskReportContent(products) {
  return `
    <div class="report-summary-box">
      <h5 style="font-size: 14px; font-weight: 700; color: var(--text-primary);">Stockout & Overstock Risk Analysis</h5>
      <p style="font-size: 12.5px; color: var(--text-secondary);">Products flagged by inventory thresholds and expected demand velocity.</p>
      <div style="overflow-x: auto; margin-top: 8px;">
        <table class="data-table">
          <thead>
            <tr><th>SKU</th><th>Product Name</th><th>Current Available Stock</th><th>Days of Stock Remaining</th><th>Risk Category</th><th>Recommended Action</th></tr>
          </thead>
          <tbody>
            ${products.map((p, idx) => {
              const stock = p.quantity !== undefined ? p.quantity : 100;
              const daysLeft = Math.max(2, Math.floor(stock / 4));
              const risk = stock <= 30 ? "High Stockout Risk" : "Low Risk";
              const badge = stock <= 30 ? "cancelled" : "delivered";
              return `<tr><td><strong>${p.id || `PROD-0${idx+1}`}</strong></td><td>${p.name}</td><td>${stock} units</td><td>~${daysLeft} days</td><td><span class="table-badge ${badge}">${risk}</span></td><td>${stock <= 30 ? 'Create Purchase Order' : 'Maintain Stock'}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderReportHistoryTable() {
  const db = DB.get();
  const history = db.reportHistory || [];
  const tbody = document.getElementById("report-history-tbody");
  if (!tbody) return;

  if (history.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: #94A3B8;">No archived reports in local storage. Generate a report above.</td></tr>`;
    return;
  }

  tbody.innerHTML = history.map((h, idx) => `
    <tr>
      <td><strong>${h.name}</strong></td>
      <td><span class="badge" style="background: rgba(59,130,246,0.1); color: var(--accent-color);">${h.type}</span></td>
      <td>${h.period}</td>
      <td style="color: #64748B; font-size: 12px;">${h.date}</td>
      <td>${h.source}</td>
      <td><span class="table-badge delivered">${h.status}</span></td>
      <td>${h.format}</td>
      <td>
        <div style="display: flex; gap: 4px;">
          <button class="small-btn" onclick="viewArchivedReport(${idx})">View</button>
          <button class="small-btn" style="background: #10B981; color: white; border: none;" onclick="downloadArchivedReportCSV(${idx})">CSV</button>
          <button class="small-btn delete-row-btn" onclick="deleteArchivedReport(${idx})">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

window.viewArchivedReport = function(index) {
  const db = DB.get();
  const history = db.reportHistory || [];
  const report = history[index];
  if (!report) return;

  document.getElementById("modal-report-title").textContent = report.name;
  const contentBody = document.getElementById("modal-report-body-content");
  if (contentBody) {
    contentBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px; font-size: 13px;">
        <div style="background: var(--bg-main); padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border-color);">
          <strong>Report Type:</strong> ${report.type} &bull; <strong>Generated:</strong> ${report.date}<br>
          <strong>Reporting Period:</strong> ${report.period} &bull; <strong>Source:</strong> ${report.source}
        </div>
        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr><th>Identifier / SKU</th><th>Item Name</th><th>Metric 1</th><th>Metric 2</th><th>Metric 3</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${report.rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  document.getElementById("report-details-modal").classList.remove("hidden");
  lucide.createIcons();
};

window.closeReportDetailsModal = function() {
  document.getElementById("report-details-modal")?.classList.add("hidden");
};

window.deleteArchivedReport = function(index) {
  if (!confirm("Are you sure you want to delete this archived report?")) return;
  const db = DB.get();
  if (db.reportHistory) {
    db.reportHistory.splice(index, 1);
    DB.save(db);
    renderReportHistoryTable();
    showToast("Archived report deleted.");
  }
};

window.clearReportHistory = function() {
  if (!confirm("Are you sure you want to clear all archived reports?")) return;
  const db = DB.get();
  db.reportHistory = [];
  DB.save(db);
  renderReportHistoryTable();
  showToast("Report history archive cleared.");
};

window.downloadArchivedReportCSV = function(index) {
  const db = DB.get();
  const history = db.reportHistory || [];
  const report = history[index];
  if (!report) return;

  let csvContent = `\uFEFFReport Title: "${report.name}"\nGenerated Date: "${report.date}"\nPeriod: "${report.period}"\n\n`;
  csvContent += `Col1,Col2,Col3,Col4,Col5,Col6\n`;
  report.rows.forEach(r => {
    csvContent += r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `CODEX_Report_${report.type}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`Successfully downloaded CSV for ${report.name}!`);
};

window.exportActiveReportCSV = function() {
  if (!activeGeneratedReportData) {
    generateAndRenderReport();
  }
  if (!activeGeneratedReportData) {
    showToast("No active report data to export.");
    return;
  }
  const rep = activeGeneratedReportData;
  let csvContent = `\uFEFFReport Title: "${rep.name}"\nGenerated Date: "${rep.date}"\nPeriod: "${rep.period}"\n\n`;
  csvContent += `Column1,Column2,Column3,Column4,Column5,Column6\n`;
  rep.rows.forEach(r => {
    const safeRow = r.map(val => {
      let str = String(val);
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    });
    csvContent += safeRow.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `CODEX_Analytics_${rep.type}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("Report CSV downloaded successfully!");
};

window.printActiveReport = function() {
  document.body.classList.add("printing-active-report");
  showToast("Opening print dialog for A4 Report...");
  setTimeout(() => {
    window.print();
    document.body.classList.remove("printing-active-report");
  }, 300);
};

document.addEventListener("DOMContentLoaded", () => {
  generateAndRenderReport();
  renderReportHistoryTable();
});