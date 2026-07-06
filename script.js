const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const STORAGE = {
  checkIn: "vegasNavigator.checkIn",
  tracker: "vegasNavigator.tracker",
  activeSection: "vegasNavigator.activeSection"
};

// Replace this with a Google Form URL when the public reporting form is ready.
const REPORT_OUTDATED_URL = "https://forms.gle/fH5S8uLMMfzT9BhZ8";

const categories = [
  "rent/housing help",
  "utility help",
  "food",
  "transportation",
  "employment/job training",
  "benefits navigation",
  "free tax help",
  "credit counseling/financial coaching",
  "legal aid referrals"
];

const documentLists = {
  "rent/housing help": ["Photo ID if available", "Lease or written housing agreement", "Rent ledger or late notice", "Proof of income or job loss", "Utility bill if requested", "Any court papers or notices"],
  "utility help": ["Photo ID if available", "Current utility bill", "Shutoff or past-due notice", "Proof of address", "Proof of income", "Household member information"],
  food: ["Photo ID if available", "Proof of address if requested", "Household size information", "Income estimate", "Any benefit cards or notices"],
  transportation: ["Photo ID if available", "Work, school, medical, or appointment information", "Proof of income if requested", "Transit route or destination details"],
  "employment/job training": ["Photo ID if available", "Resume or work history", "Training certificates", "Work authorization documents if applicable", "Schedule availability"],
  "benefits navigation": ["Photo ID if available", "Income information", "Household member information", "Rent and utility costs", "Current benefit notices", "Medical or disability documents if relevant"],
  "free tax help": ["Photo ID", "Social Security or ITIN cards for return preparation only", "W-2s and 1099s", "Prior-year return if available", "Health coverage forms if applicable", "Bank routing details only if you choose direct deposit with the tax preparer"],
  "credit counseling/financial coaching": ["Income and expense list", "Debt statement summaries without full account numbers", "Collection letters if relevant", "Budget goals", "Questions you want answered"],
  "legal aid referrals": ["Photo ID if available", "All notices, letters, or court papers", "Lease or agreement", "Timeline of events", "Names of agencies already contacted", "Proof of income if requested"]
};

const fallbackResources = [
  {
    organization: "Nevada 211",
    resourceType: "Verified navigation hub",
    category: "benefits navigation",
    address: "Statewide phone, text, chat, and online resource navigation",
    phone: "211",
    alternatePhone: "1-866-535-5654",
    text: "Text your ZIP code to 898211",
    officialSiteNote: "Use Nevada 211 to find current local referrals.",
    website: "https://www.nevada211.org/",
    hours: "Call center: Monday-Friday, 9:00 AM-9:00 PM Pacific. Online search remains available outside call-center hours.",
    eligibility: "Nevada residents seeking referrals for housing, food, utilities, employment, transportation, benefits, legal aid, health care, and other local services.",
    documents: ["ZIP code or neighborhood", "Basic description of the need", "Household information if requested by a referred agency"],
    access: "Phone, text, chat, and online search",
    busAccessible: false,
    physicalAddress: false,
    lastVerified: "July 6, 2026",
    verifiedDate: "July 6, 2026",
    sourceUrl: "https://www.nevada211.org/",
    neighborhoods: ["Las Vegas", "Clark County", "Nevada"],
    householdTypes: ["Any household"],
    urgency: ["Today", "This week", "This month"]
  }
];

let resources = [];

function $(id) {
  return document.getElementById(id);
}

function numberValue(id) {
  return Math.max(0, Number($(id)?.value || 0));
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function escapeAttribute(value) {
  return escapeHTML(value);
}

function populateSelect(select, values, includeAny = false) {
  select.innerHTML = "";
  if (includeAny) {
    const any = document.createElement("option");
    any.textContent = "Any";
    select.append(any);
  }
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function getCheckIn() {
  const essentials = {
    housing: numberValue("housing"),
    utilities: numberValue("utilities"),
    food: numberValue("food"),
    transportation: numberValue("transportation"),
    insurance: numberValue("insurance"),
    debt: numberValue("debt"),
    other: numberValue("other")
  };
  const income = numberValue("income");
  const essentialTotal = Object.values(essentials).reduce((sum, value) => sum + value, 0);
  const remaining = income - essentialTotal;
  const overdue = numberValue("overdue");
  const savings = numberValue("savings");
  const dueDate = $("dueDate").value;
  const householdSize = Math.max(1, Number($("householdSize").value || 1));
  const urgentNeed = $("urgentNeed").value || categories[0];
  return { income, essentials, essentialTotal, remaining, overdue, savings, dueDate, householdSize, urgentNeed };
}

function urgencyText(data) {
  const dueSoon = data.dueDate ? Math.ceil((new Date(data.dueDate) - new Date()) / 86400000) <= 7 : false;
  if (data.remaining < 0 || data.overdue > 0 || dueSoon) return "High pressure";
  if (data.remaining < Math.max(150, data.income * 0.08)) return "Watch closely";
  return "More room this month";
}

function renderCheckIn() {
  const data = getCheckIn();
  saveJSON(STORAGE.checkIn, data);
  const shortfall = Math.min(0, data.remaining);
  const status = urgencyText(data);
  const className = status === "High pressure" ? "alert" : status === "Watch closely" ? "warning" : "calm";
  $("checkInResults").innerHTML = [
    metric("Monthly essentials", money.format(data.essentialTotal), "Housing, utilities, food, transportation, insurance, minimum debt payments, and other essentials.", ""),
    metric("Remaining cash flow", money.format(data.remaining), data.remaining < 0 ? "This suggests a monthly shortfall. Focus first on essentials and verified assistance options." : "This is the amount left after listed essentials.", className),
    metric("Estimated shortfall", money.format(Math.abs(shortfall)), shortfall < 0 ? "This is an estimate only. Applications, payment plans, and benefit screening may help close the gap." : "No shortfall is showing from the numbers entered.", className),
    metric("Urgency indicator", status, `Urgent need selected: ${data.urgentNeed}. Overdue bills entered: ${money.format(data.overdue)}.`, className)
  ].join("");
  renderActionPlan();
  renderAppointmentChecklist();
  renderDocumentChecklist();
  renderPrintContent();
}

function metric(title, value, detail, tone) {
  return `<article class="metric-card ${escapeAttribute(tone)}"><h3>${escapeHTML(title)}</h3><strong>${escapeHTML(value)}</strong><span>${escapeHTML(detail)}</span></article>`;
}

function resourceMatches(resource) {
  const category = $("resourceCategory").value;
  const transport = $("transportAvailable").value;
  const householdType = $("householdType").value;
  const urgency = $("resourceUrgency").value;
  return (category === "Any" || resource.category === category)
    && resourceMatchesTransport(resource, transport)
    && (householdType === "Any household" || (resource.householdTypes || []).includes(householdType) || (resource.householdTypes || []).includes("Any household"))
    && (urgency === "Any" || (resource.urgency || []).includes(urgency));
}

function resourceMatchesTransport(resource, transport) {
  if (transport === "Phone or online only preferred") return !hasPhysicalAddress(resource);
  if (transport === "Bus preferred") return resource.busAccessible || !hasPhysicalAddress(resource);
  return true;
}

function renderResources() {
  const filtered = resources.filter(resourceMatches);
  if (filtered.length) {
    $("resourceCards").innerHTML = filtered.map(resourceCard).join("");
    return;
  }
  const fallbackCards = navigationFallback();
  $("resourceCards").innerHTML = [
    noResultsCard(),
    ...fallbackCards.map(resourceCard)
  ].join("");
}

function resourceCard(resource) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.address)}`;
  const sourceUrl = resource.sourceUrl || resource.website;
  const providerBadge = resource.resourceType || (isNavigationHub(resource) ? "Verified navigation hub" : "Verified direct provider");
  const verifiedDate = resource.verifiedDate || resource.lastVerified || "Verify directly";
  const category = escapeAttribute(resource.category);
  const actions = [
    hasPhysicalAddress(resource) ? `<a class="secondary" href="${escapeAttribute(mapsUrl)}" target="_blank" rel="noopener noreferrer">Directions</a>` : "",
    resource.website ? `<a class="secondary" href="${escapeAttribute(resource.website)}" target="_blank" rel="noopener noreferrer">Visit website</a>` : "",
    sourceUrl ? `<a class="secondary" href="${escapeAttribute(sourceUrl)}" target="_blank" rel="noopener noreferrer">Official source</a>` : ""
  ].filter(Boolean).join("");
  return `<article class="resource-card">
    <span class="verified-pill">Verified starting point</span>
    <span class="provider-pill">${escapeHTML(providerBadge)}</span>
    <span class="category-pill">${escapeHTML(resource.category)}</span>
    <h3>${escapeHTML(resource.organization)}</h3>
    <dl>
      ${field("Address", resource.address)}
      ${field("Phone", resource.phone)}
      ${resource.alternatePhone ? field("Alternate phone", resource.alternatePhone) : ""}
      ${resource.text ? field("Text", resource.text) : ""}
      ${resource.officialSiteNote ? field("Official site note", resource.officialSiteNote) : ""}
      ${field("Hours", resource.hours)}
      ${field("Eligibility notes", resource.eligibility)}
      ${field("Documents to bring", (resource.documents || []).join(", "))}
      ${field("Access", resource.access)}
      ${field("Bus accessible", resource.busAccessible ? "Yes" : "Not marked as bus accessible")}
      ${field("Last verified", verifiedDate)}
    </dl>
    <p class="card-note">Information may change; confirm before traveling.</p>
    <div class="card-actions">${actions}</div>
    <div class="prep-panel" aria-label="Preparation tools">
      <strong>Prepare before contacting</strong>
      <div class="prep-actions">
        <button type="button" data-tool-target="scriptOutput" data-tool-category="${category}">Phone script</button>
        <button type="button" data-tool-target="letterOutput" data-tool-category="${category}">Letter template</button>
        <button type="button" data-tool-target="documentChecklist" data-tool-category="${category}">Documents</button>
        <button type="button" data-tool-target="contactTracker" data-tool-category="${category}">Tracker</button>
      </div>
    </div>
  </article>`;
}

function field(label, value) {
  if (value === undefined || value === null || value === "") return "";
  return `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`;
}

function noResultsCard() {
  return `<article class="resource-card no-results-card">
    <span class="verified-pill">Verified starting point</span>
    <h3>No matching resource found</h3>
    <p>No direct match is listed yet. Nevada 211 can help identify current local referrals for housing, food, utilities, benefits, transportation, employment, legal aid, and other needs.</p>
  </article>`;
}

function isNavigationHub(resource) {
  return resource.category === "benefits navigation"
    || resource.organization === "Nevada 211"
    || resource.organization === "Nevada Department of Health and Human Services";
}

function navigationFallback() {
  const nevada211 = resources.find((resource) => resource.organization === "Nevada 211") || fallbackResources[0];
  return nevada211 ? [nevada211] : [];
}

function hasPhysicalAddress(resource) {
  if (resource.physicalAddress !== undefined) return Boolean(resource.physicalAddress);
  return !/statewide|online|phone|finder|use the/i.test(resource.address || "");
}

function planItems(data) {
  const need = data.urgentNeed || "rent/housing help";
  const duePhrase = data.dueDate ? `Note the upcoming due date: ${data.dueDate}.` : "Write down the next due dates you know.";
  return {
    "24 hours": [
      `Focus on essentials first: housing, utilities, food, transportation, and essential insurance. ${duePhrase}`,
      `Call the provider, landlord, or agency connected to ${need} and ask what options exist before the due date.`,
      "Write a one-page snapshot: income, essential expenses, overdue bills, household size, and what changed.",
      "Gather documents for the selected resource category. Keep copies of notices and confirmation numbers.",
      "If you receive a legal notice, read it carefully and seek a qualified legal aid referral promptly."
    ],
    "7 days": [
      "Submit applications only after confirming current eligibility, funding, and intake steps.",
      "Follow up on every call or application. Record the date, person or department, status, and next step.",
      "Ask about payment plans, extensions, hardship programs, or benefit screening without making promises you cannot keep.",
      "Check food and transportation support so you can protect work, school, medical, and caregiving needs.",
      "Review unsecured debt minimums after essential needs are mapped; do not ignore notices or court papers."
    ],
    "30 days": [
      "Build a simple next-month budget using confirmed income, essential bills, and realistic application timelines.",
      "Update agencies if your income, household size, address, or hardship changes.",
      "Create a folder for notices, approvals, denials, receipts, and follow-up dates.",
      "Ask a nonprofit counselor or benefits navigator to review options if the shortfall continues.",
      "Revisit the plan weekly and adjust based on verified responses, not assumptions."
    ]
  };
}

function renderActionPlan() {
  const data = getCheckIn();
  const groups = planItems(data);
  $("actionPlan").innerHTML = Object.entries(groups).map(([title, items]) => `<article class="plan-column"><h3>${escapeHTML(title)}</h3>${checklist(items, `plan-${title}`)}</article>`).join("");
}

function checklist(items, name) {
  return `<ul class="checklist">${items.map((item, index) => {
    const id = `${name}-${index}`;
    return `<li><input type="checkbox" aria-label="${escapeAttribute(item)}" id="${escapeAttribute(id)}"><label for="${escapeAttribute(id)}">${escapeHTML(item)}</label></li>`;
  }).join("")}</ul>`;
}

function renderAppointmentChecklist() {
  const data = getCheckIn();
  const items = [
    "Bring a written list of monthly income and essential expenses.",
    `Bring documents related to ${data.urgentNeed || "your urgent need"}.`,
    "Bring overdue bills, shutoff notices, late notices, or application confirmations.",
    "Prepare a short explanation of the hardship and what help you are requesting.",
    "Ask what happens next, when to follow up, and what proof to keep."
  ];
  $("appointmentChecklist").innerHTML = checklist(items, "appointment");
}

function renderDocumentChecklist() {
  const category = $("documentCategory").value || categories[0];
  $("documentChecklist").innerHTML = checklist(documentLists[category] || [], "docs");
}

function generateScript(categoryOverride) {
  const data = getCheckIn();
  const urgentNeed = typeof categoryOverride === "string" ? categoryOverride : data.urgentNeed;
  $("scriptOutput").value = `Hello, my name is [your name]. I am calling because I am dealing with a temporary financial hardship and want to understand my options before the situation gets worse.\n\nMy main request is: ${$("scriptRequest").value}.\n\nMy urgent category is ${urgentNeed}. My estimated monthly essential expenses are ${money.format(data.essentialTotal)}, and my estimated remaining cash flow is ${money.format(data.remaining)}.\n\nCan you tell me what hardship options, documents, deadlines, and follow-up steps apply? I can write down a confirmation number or the name of the program if available.`;
}

function generateLetter() {
  const recipient = $("letterRecipient").value || "[provider or landlord name]";
  const reason = $("letterReason").value || "[brief hardship explanation]";
  const data = getCheckIn();
  $("letterOutput").value = `To ${recipient},\n\nI am writing to ask about hardship options related to my account or obligation. My household is experiencing the following temporary hardship: ${reason}.\n\nI am trying to protect essential needs including housing, utilities, food, transportation, and essential insurance while I look for verified assistance options. Based on my current estimate, my monthly essential expenses are ${money.format(data.essentialTotal)} and my remaining cash flow is ${money.format(data.remaining)}.\n\nPlease let me know what options may be available, what documents you need, whether there are deadlines, and how I should follow up. I understand this letter does not change any legal rights or obligations unless confirmed by you in writing.\n\nThank you,\n[your name]\n[phone or email]`;
}

function renderTracker() {
  const rows = readJSON(STORAGE.tracker, []);
  $("contactTracker").innerHTML = rows.map((row, index) => trackerRow(row, index)).join("") || `<p class="muted">No contacts yet. Add a row for each agency, provider, or application follow-up.</p>`;
}

function trackerRow(row, index) {
  return `<div class="tracker-row" data-index="${index}">
    <input aria-label="Organization" value="${escapeAttribute(row.organization || "")}" placeholder="Organization" data-field="organization" />
    <input aria-label="Date" value="${escapeAttribute(row.date || "")}" type="date" data-field="date" />
    <select aria-label="Status" data-field="status"><option ${row.status === "To call" ? "selected" : ""}>To call</option><option ${row.status === "Called" ? "selected" : ""}>Called</option><option ${row.status === "Applied" ? "selected" : ""}>Applied</option><option ${row.status === "Follow up" ? "selected" : ""}>Follow up</option><option ${row.status === "Closed" ? "selected" : ""}>Closed</option></select>
    <textarea aria-label="Notes" placeholder="Notes and next step" data-field="notes">${escapeHTML(row.notes || "")}</textarea>
    <button type="button" aria-label="Remove contact" data-remove="${index}">X</button>
  </div>`;
}

function updateTrackerFromDOM() {
  const rows = [...document.querySelectorAll(".tracker-row")].map((row) => {
    const out = {};
    row.querySelectorAll("[data-field]").forEach((field) => out[field.dataset.field] = field.value);
    return out;
  });
  saveJSON(STORAGE.tracker, rows);
}

function restoreCheckIn() {
  const saved = readJSON(STORAGE.checkIn, null);
  if (!saved) return;
  $("income").value = saved.income || "";
  Object.entries(saved.essentials || {}).forEach(([key, value]) => {
    if ($(key)) $(key).value = value || "";
  });
  $("overdue").value = saved.overdue || "";
  $("savings").value = saved.savings || "";
  $("dueDate").value = saved.dueDate || "";
  $("householdSize").value = saved.householdSize || 1;
  $("urgentNeed").value = saved.urgentNeed || categories[0];
}

function renderPrintContent() {
  const data = getCheckIn();
  $("printContent").innerHTML = `
    <div class="print-item"><strong>Income:</strong> ${money.format(data.income)}</div>
    <div class="print-item"><strong>Essential expenses:</strong> ${money.format(data.essentialTotal)}</div>
    <div class="print-item"><strong>Remaining cash flow:</strong> ${money.format(data.remaining)}</div>
    <div class="print-item"><strong>Urgency:</strong> ${urgencyText(data)} for ${data.urgentNeed}</div>
    <div class="print-item"><strong>24-hour actions:</strong>${checklist(planItems(data)["24 hours"], "print-plan")}</div>`;
}

function showSection(sectionId) {
  const tab = document.querySelector(`[data-section="${sectionId}"]`);
  if (!tab || !$(sectionId)) return;
  document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".section").forEach((item) => item.classList.remove("active"));
  tab.classList.add("active");
  $(sectionId).classList.add("active");
  localStorage.setItem(STORAGE.activeSection, sectionId);
  tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
}

function openPreparationTool(targetId, category) {
  if (category && categories.includes(category)) {
    $("documentCategory").value = category;
    renderDocumentChecklist();
  }
  showSection("tools");
  if (targetId === "scriptOutput") generateScript(category);
  if (targetId === "letterOutput") generateLetter();
  if (targetId === "contactTracker") renderTracker();
  const target = $(targetId);
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (target && ["TEXTAREA", "INPUT", "SELECT", "BUTTON"].includes(target.tagName)) {
    target.focus({ preventScroll: true });
  }
}

async function loadResources() {
  try {
    const response = await fetch("resources.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Resource file unavailable");
    resources = await response.json();
  } catch {
    resources = fallbackResources;
  }
  renderResources();
}

function bindEvents() {
  const reportLink = $("reportOutdatedLink");
  if (reportLink) {
    reportLink.href = REPORT_OUTDATED_URL;
  }
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      showSection(tab.dataset.section);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  $("checkInForm").addEventListener("submit", (event) => {
    event.preventDefault();
    renderCheckIn();
  });
  $("clearCheckIn").addEventListener("click", () => {
    localStorage.removeItem(STORAGE.checkIn);
    $("checkInForm").reset();
    $("householdSize").value = 1;
    renderCheckIn();
  });
  ["resourceFilters", "resourceCategory", "transportAvailable", "householdType", "resourceUrgency"].forEach((id) => {
    $(id)?.addEventListener("input", renderResources);
    $(id)?.addEventListener("change", renderResources);
  });
  $("resourceCards").addEventListener("click", (event) => {
    const button = event.target.closest("[data-tool-target]");
    if (!button) return;
    openPreparationTool(button.dataset.toolTarget, button.dataset.toolCategory);
  });
  $("documentCategory").addEventListener("change", renderDocumentChecklist);
  $("generateScript").addEventListener("click", () => generateScript());
  $("generateLetter").addEventListener("click", generateLetter);
  $("addTrackerRow").addEventListener("click", () => {
    const rows = readJSON(STORAGE.tracker, []);
    rows.push({ organization: "", date: new Date().toISOString().slice(0, 10), status: "To call", notes: "" });
    saveJSON(STORAGE.tracker, rows);
    renderTracker();
  });
  $("contactTracker").addEventListener("input", updateTrackerFromDOM);
  $("contactTracker").addEventListener("change", updateTrackerFromDOM);
  $("contactTracker").addEventListener("click", (event) => {
    const remove = event.target.dataset.remove;
    if (remove === undefined) return;
    const rows = readJSON(STORAGE.tracker, []);
    rows.splice(Number(remove), 1);
    saveJSON(STORAGE.tracker, rows);
    renderTracker();
  });
  $("printSummary").addEventListener("click", () => {
    renderPrintContent();
    window.print();
  });
}

function init() {
  populateSelect($("urgentNeed"), categories);
  populateSelect($("resourceCategory"), categories, true);
  populateSelect($("documentCategory"), categories);
  restoreCheckIn();
  bindEvents();
  renderCheckIn();
  renderTracker();
  loadResources();
  const active = localStorage.getItem(STORAGE.activeSection);
  if (active && $(active)) {
    document.querySelector(`[data-section="${active}"]`)?.click();
  }
}

init();
