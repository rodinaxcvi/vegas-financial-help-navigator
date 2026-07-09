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
  "legal aid referrals",
  "volunteer/community groups",
  "faith/community support",
  "therapy/mental health services"
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
  "legal aid referrals": ["Photo ID if available", "All notices, letters, or court papers", "Lease or agreement", "Timeline of events", "Names of agencies already contacted", "Proof of income if requested"],
  "volunteer/community groups": ["ZIP code or preferred service area", "Availability and transportation details", "Skills, interests, or group size", "Email address for signup", "Any screening or background-check items requested by the host organization"],
  "faith/community support": ["Photo ID if available", "Proof of address if requested", "Household size and income information if requested", "Program-specific notices, referral documents, or appointment information", "For volunteer roles, availability and screening information", "Sensitive identity information should only be provided directly to the provider if required, not entered into this app"],
  "therapy/mental health services": ["Basic contact information for provider intake", "Insurance, Medicaid, no-insurance status, or payment information if requested", "Current concern in general terms", "Preferred language, online/in-person preference, and accessibility needs", "Emergency status: if there is immediate danger, call 911; for crisis support call, text, or chat 988"]
};

const fallbackResources = [
  {
    "organization": "Nevada 211",
    "resourceType": "Verified navigation hub",
    "category": "benefits navigation",
    "address": "Statewide phone, text, chat, and online resource navigation",
    "phone": "211",
    "alternatePhone": "1-866-535-5654",
    "text": "Text your ZIP code to 898211",
    "officialSiteNote": "Use Nevada 211 to find current local referrals.",
    "website": "https://www.nevada211.org/",
    "hours": "Call center: Monday-Friday, 9:00 AM-9:00 PM Pacific. Online search remains available outside call-center hours.",
    "eligibility": "Nevada residents seeking referrals for housing, food, utilities, employment, transportation, benefits, legal aid, health care, and other local services.",
    "documents": ["ZIP code or neighborhood", "Basic description of the need", "Household information if requested by a referred agency"],
    "access": "Phone, text, chat, and online search",
    "busAccessible": false,
    "physicalAddress": false,
    "lastVerified": "July 6, 2026",
    "verifiedDate": "July 6, 2026",
    "sourceUrl": "https://www.nevada211.org/",
    "neighborhoods": ["Las Vegas", "Clark County", "Nevada"],
    "householdTypes": ["Any household"],
    "urgency": ["Today", "This week", "This month"]
  },
  {
    "organization": "Three Square Food Bank",
    "resourceType": "Verified navigation hub",
    "category": "food",
    "address": "Use the Food Finder map to locate nearby food pantries, meal sites, and distributions.",
    "phone": "702-644-3663",
    "officialSiteNote": "Use the official Food Finder to search nearby food sites.",
    "website": "https://www.threesquare.org/find-food",
    "hours": "Food-distribution times and locations vary. Use Food Finder or call before traveling.",
    "eligibility": "Food assistance availability and site requirements vary by location.",
    "documents": ["ZIP code or neighborhood", "Household size", "Any documents requested by the specific food-distribution site"],
    "access": "Online Food Finder and phone support",
    "busAccessible": true,
    "physicalAddress": false,
    "lastVerified": "July 6, 2026",
    "verifiedDate": "July 6, 2026",
    "sourceUrl": "https://www.threesquare.org/find-food",
    "neighborhoods": ["Las Vegas", "Clark County", "Southern Nevada"],
    "householdTypes": ["Any household"],
    "urgency": ["Today", "This week", "This month"]
  },
  {
    "organization": "Legal Aid Center of Southern Nevada",
    "resourceType": "Verified direct provider",
    "category": "legal aid referrals",
    "address": "725 E. Charleston Blvd., Las Vegas, NV 89104",
    "phone": "702-386-1070",
    "website": "https://www.lacsn.org/",
    "hours": "Check the website or call for current intake, self-help, class, and appointment information.",
    "eligibility": "Services and representation depend on the legal issue, available programs, and intake screening. Civil legal information, self-help resources, or screening may include tenant rights, debt collection, foreclosure, vehicle-related legal issues, bankruptcy information, and other civil legal matters depending on intake.",
    "documents": ["Relevant notices or court papers", "Lease or agreement if applicable", "Timeline of events", "Income information if requested"],
    "access": "Phone and website",
    "busAccessible": true,
    "physicalAddress": true,
    "lastVerified": "July 6, 2026",
    "verifiedDate": "July 6, 2026",
    "sourceUrl": "https://www.lacsn.org/",
    "neighborhoods": ["Las Vegas", "Clark County"],
    "householdTypes": ["Any household"],
    "urgency": ["Today", "This week", "This month"]
  },
  {
    "organization": "Nevada Department of Health and Human Services",
    "resourceType": "Verified navigation hub",
    "category": "benefits navigation",
    "address": "Statewide online benefits and public-assistance information",
    "phone": "Call Nevada 211 for local navigation help",
    "website": "https://www.dss.nv.gov/",
    "hours": "Check the official website for program and office details.",
    "eligibility": "Program rules vary by benefit, household, income, immigration status, age, disability status, and other factors.",
    "documents": ["Identity and household information if requested", "Income information", "Housing and utility costs", "Program-specific documents"],
    "access": "Website and Nevada 211 referral support",
    "busAccessible": false,
    "physicalAddress": false,
    "lastVerified": "July 6, 2026",
    "verifiedDate": "July 6, 2026",
    "sourceUrl": "https://www.dss.nv.gov/",
    "neighborhoods": ["Las Vegas", "Clark County", "Nevada"],
    "householdTypes": ["Any household"],
    "urgency": ["This week", "This month"]
  },
  {
    "organization": "Nevada Energy Assistance Program",
    "resourceType": "Verified navigation hub",
    "category": "utility help",
    "address": "Statewide online program information and application guidance",
    "phone": "Call Nevada 211 for local navigation help",
    "officialSiteNote": "Review current application instructions and eligibility on the official program website.",
    "website": "https://www.dss.nv.gov/programs/energy/",
    "hours": "Check the official website for current application and program details.",
    "eligibility": "The Energy Assistance Program provides a supplement for qualifying low-income Nevadans with home-energy costs. Applications are evaluated year-round or until funding is exhausted.",
    "documents": ["Current utility bill", "Proof of address", "Household income information", "Household member information", "Any shutoff or past-due notice"],
    "access": "Official website and Nevada 211 referral support",
    "busAccessible": false,
    "physicalAddress": false,
    "lastVerified": "July 6, 2026",
    "verifiedDate": "July 6, 2026",
    "sourceUrl": "https://www.dss.nv.gov/programs/energy/",
    "neighborhoods": ["Las Vegas", "Clark County", "Nevada"],
    "householdTypes": ["Any household"],
    "urgency": ["Today", "This week", "This month"]
  },
  {
    "organization": "RTC Southern Nevada",
    "resourceType": "Verified navigation hub",
    "category": "transportation",
    "address": "Southern Nevada transit fares, reduced-fare information, route tools, and paratransit information",
    "phone": "Check RTC official contact information or call Nevada 211 for local transportation-referral help",
    "officialSiteNote": "Use RTC's official tools for routes, fares, and transit options.",
    "website": "https://www.rtcsnv.com/ways-to-travel/fares-passes/",
    "hours": "Check the official RTC website for current fare, route, and service details.",
    "eligibility": "RTC lists reduced fares for active duty and veterans, youth, K-12 students, seniors age 60 and over, people with disabilities, Medicare-eligible people, and Mobility Trained customers. Confirm current eligibility and application requirements directly with RTC.",
    "documents": ["Photo ID if available", "Proof of reduced-fare eligibility if applicable", "Transit route or destination details", "Appointment, work, school, or medical location information if relevant"],
    "access": "Website, rideRTC app, transit centers, and Nevada 211 referral support",
    "busAccessible": false,
    "physicalAddress": false,
    "lastVerified": "July 6, 2026",
    "verifiedDate": "July 6, 2026",
    "sourceUrl": "https://www.rtcsnv.com/ways-to-travel/fares-passes/",
    "neighborhoods": ["Las Vegas", "Clark County", "Southern Nevada"],
    "householdTypes": ["Any household", "Senior", "Veteran", "Disabled household member"],
    "urgency": ["Today", "This week", "This month"]
  },
  {
    "organization": "IRS VITA and TCE Locator",
    "resourceType": "Verified navigation hub",
    "category": "free tax help",
    "address": "Use the official locator to find nearby VITA or TCE tax-preparation sites",
    "phone": "800-906-9887",
    "officialSiteNote": "Use the official locator to find current free tax-preparation sites.",
    "website": "https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers",
    "hours": "Tax-site availability is seasonal. Use the locator or call before traveling.",
    "eligibility": "VITA offers free basic tax-return preparation to qualifying taxpayers, including people who generally make $69,000 or less, people with disabilities, and limited-English-speaking taxpayers. TCE focuses particularly on people age 60 and older. Services vary by site.",
    "documents": ["Photo ID", "Social Security or ITIN documents for tax preparation", "W-2s and 1099s", "Prior-year tax return if available", "Other tax documents requested by the site"],
    "access": "Official IRS locator and phone support",
    "busAccessible": false,
    "physicalAddress": false,
    "lastVerified": "July 6, 2026",
    "verifiedDate": "July 6, 2026",
    "sourceUrl": "https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers",
    "neighborhoods": ["Las Vegas", "Clark County", "Nevada"],
    "householdTypes": ["Any household", "Senior"],
    "urgency": ["This month"]
  },
  {
    "organization": "GreenPath Financial Wellness",
    "resourceType": "Verified navigation hub",
    "category": "credit counseling/financial coaching",
    "address": "National phone and online financial-counseling service",
    "phone": "800-550-1961",
    "alternatePhone": "866-648-8117",
    "website": "https://www.greenpath.com/",
    "hours": "Check the official website for current counseling availability.",
    "eligibility": "GreenPath states it offers free financial counseling, including budgeting and debt-related counseling. Confirm services, fees for any optional programs, and appointment details directly with GreenPath.",
    "documents": ["Income and expense list", "Debt statement summaries without full account numbers", "Budget goals", "Questions you want answered"],
    "access": "Phone, online request, and website",
    "busAccessible": false,
    "physicalAddress": false,
    "lastVerified": "July 6, 2026",
    "verifiedDate": "July 6, 2026",
    "sourceUrl": "https://www.greenpath.com/",
    "neighborhoods": ["Las Vegas", "Clark County", "Nevada", "Online"],
    "householdTypes": ["Any household"],
    "urgency": ["This week", "This month"]
  },
  {
    "organization": "United Way of Southern Nevada Volunteer Connect",
    "resourceType": "Verified navigation hub",
    "category": "volunteer/community groups",
    "address": "5830 W. Flamingo Road, Las Vegas, NV 89103; online volunteer matching for Southern Nevada nonprofits",
    "phone": "702-892-2300",
    "officialSiteNote": "Use Volunteer Connect for current individual, team, in-person, virtual, and skill-based volunteer opportunities.",
    "website": "https://uwsn.org/volunteer/",
    "hours": "Volunteer opportunities and nonprofit requirements vary. Use the official website for current openings and instructions.",
    "eligibility": "People, families, groups, and teams looking for volunteer opportunities with Southern Nevada nonprofits. Requirements vary by host organization and opportunity.",
    "documents": ["Email address for volunteer signup", "Preferred ZIP code or service area", "Availability and transportation details", "Skills, interests, or group size", "Any background check or screening items requested by the host nonprofit"],
    "access": "Online volunteer platform, individual and team opportunities, in-person, virtual, and skill-based options may be listed",
    "busAccessible": false,
    "physicalAddress": true,
    "lastVerified": "July 7, 2026",
    "verifiedDate": "July 7, 2026",
    "sourceUrl": "https://uwsn.org/volunteer/",
    "neighborhoods": ["Las Vegas", "Clark County", "Southern Nevada", "Online"],
    "householdTypes": ["Any household"],
    "urgency": ["This week", "This month"]
  },
  {
    "organization": "Idealist / VolunteerMatch",
    "resourceType": "Verified navigation hub",
    "category": "volunteer/community groups",
    "address": "National online volunteer-opportunity search with local and virtual listings",
    "phone": "Use the official website help resources",
    "officialSiteNote": "VolunteerMatch is now part of Idealist. Search local and virtual opportunities, then confirm requirements directly with the host organization.",
    "website": "https://www.volunteermatch.org/",
    "hours": "Online search is available anytime. Opportunity timing and requirements vary by organization.",
    "eligibility": "People looking for volunteer opportunities. Age, training, background check, transportation, and schedule requirements vary by host organization.",
    "documents": ["ZIP code or preferred service area", "Availability", "Skills or interests", "Email address for signup", "Any screening items requested by the host organization"],
    "access": "Online volunteer search with local and virtual options",
    "busAccessible": false,
    "physicalAddress": false,
    "lastVerified": "July 7, 2026",
    "verifiedDate": "July 7, 2026",
    "sourceUrl": "https://www.volunteermatch.org/",
    "neighborhoods": ["Las Vegas", "Clark County", "Nevada", "Online"],
    "householdTypes": ["Any household"],
    "urgency": ["This week", "This month"]
  },
  {
    "organization": "Catholic Charities of Southern Nevada",
    "resourceType": "Verified direct provider",
    "category": "faith/community support",
    "address": "1501 Las Vegas Blvd North, Las Vegas, NV 89101",
    "phone": "702-385-2662",
    "officialSiteNote": "Check the official website for current food, shelter, family-service, immigration and migration, senior-service, WIC, housing, and volunteer information.",
    "website": "https://www.catholiccharities.com/",
    "hours": "Program hours and intake rules vary. Check the official website or call before traveling.",
    "eligibility": "Provides food, shelter, family support, immigration and migration, WIC, senior meal support, housing navigation, and related services. Availability and eligibility vary by program. Catholic Charities states that it serves people in need regardless of race, religion, or creed.",
    "documents": ["Photo ID if available", "Proof of address if requested", "Household size and income information if requested", "Program-specific notices, referral documents, or appointment information", "For volunteer roles, availability and screening information"],
    "access": "Website, phone, in-person program sites, and volunteer portal",
    "busAccessible": false,
    "physicalAddress": true,
    "lastVerified": "July 7, 2026",
    "verifiedDate": "July 7, 2026",
    "sourceUrl": "https://www.catholiccharities.com/",
    "neighborhoods": ["Las Vegas", "Clark County", "Southern Nevada"],
    "householdTypes": ["Any household", "Family with children", "Senior", "Unhoused or at risk"],
    "urgency": ["Today", "This week", "This month"]
  },
  {
    "organization": "The Salvation Army Southern Nevada",
    "resourceType": "Verified direct provider",
    "category": "faith/community support",
    "address": "2900 Palomino Lane, Las Vegas, NV 89107",
    "phone": "702-870-4430",
    "officialSiteNote": "Use the official Southern Nevada website to confirm current program availability, office hours, intake rules, and volunteer opportunities.",
    "website": "https://www.salvationarmysouthernnevada.org/",
    "hours": "Office hours are listed on the website, but program hours and intake rules vary. Check the website or call before traveling.",
    "eligibility": "Programs listed by the Southern Nevada chapter include family services, homeless services, emergency disaster services, extreme heat relief, after-school support, adult rehabilitation, transitional housing, human-trafficking victim services, veteran services, vocational services, and volunteer opportunities. Eligibility and availability vary by program.",
    "documents": ["Photo ID if available", "Proof of address if requested", "Proof of income or hardship if requested", "Eviction, utility, shelter, referral, or other crisis documents if applicable", "For volunteer roles, availability and screening information"],
    "access": "Website, phone, in-person office, program-specific intake, and volunteer portal",
    "busAccessible": false,
    "physicalAddress": true,
    "lastVerified": "July 7, 2026",
    "verifiedDate": "July 7, 2026",
    "sourceUrl": "https://www.salvationarmysouthernnevada.org/",
    "neighborhoods": ["Las Vegas", "Clark County", "Southern Nevada"],
    "householdTypes": ["Any household", "Family with children", "Veteran", "Unhoused or at risk"],
    "urgency": ["Today", "This week", "This month"]
  },
  {
    "organization": "Lutheran Social Services of Nevada",
    "resourceType": "Verified direct provider",
    "category": "faith/community support",
    "address": "4323 Boulder Highway, Las Vegas, NV 89121",
    "phone": "702-833-9580",
    "officialSiteNote": "Confirm current pantry, senior meal, mobile market, hygiene, housing-assessment, and assistance availability directly with LSSN before visiting.",
    "website": "https://www.lssnv.org/",
    "hours": "Hours can change. Check the official website, social media updates, or call before traveling.",
    "eligibility": "Serves Clark County and the Las Vegas metro area, including Henderson and North Las Vegas. Programs listed include senior meals, food pantry, mobile markets, hygiene support, and homeless-prevention or rapid-rehousing assistance when funding is available. LSSN is listed as a coordinated-entry access point for families with children under 18.",
    "documents": ["Photo ID if available", "Proof of address if requested", "Proof of income if requested", "Housing, eviction, or referral documents if applicable", "Only provide sensitive identity information directly to the provider if required; do not enter it into this app"],
    "access": "Website, phone, in-person office, pantry programs, and program-specific screening",
    "busAccessible": false,
    "physicalAddress": true,
    "lastVerified": "July 7, 2026",
    "verifiedDate": "July 7, 2026",
    "sourceUrl": "https://www.lssnv.org/",
    "neighborhoods": ["Las Vegas", "North Las Vegas", "Henderson", "Clark County", "Southern Nevada"],
    "householdTypes": ["Any household", "Family with children", "Senior", "Unhoused or at risk"],
    "urgency": ["Today", "This week", "This month"]
  },
  {
    "organization": "Jewish Family Service Agency Las Vegas",
    "resourceType": "Verified direct provider",
    "category": "therapy/mental health services",
    "address": "Use the official website or call for current service locations and intake information",
    "phone": "702-732-0304",
    "officialSiteNote": "JFSA lists behavioral services, emergency services, Nevada Care Connection, senior services, food pantry, emergency housing assistance, and counseling-related services. Confirm current intake requirements directly with JFSA.",
    "website": "https://www.jfsalv.org/",
    "hours": "Check the official website or call for current intake, appointment, and program availability.",
    "eligibility": "Services vary by program and screening. JFSA lists clinical counseling or behavioral services, emergency assistance, food pantry, housing-related support, senior services, and care navigation.",
    "documents": ["Photo ID if available", "Insurance, Medicaid, or payment information if requested for counseling", "Income and household information if requested", "Emergency, housing, or food-assistance documents if applicable", "Questions or symptoms you want to discuss with intake staff"],
    "access": "Website, phone, program intake, counseling or behavioral-service screening",
    "busAccessible": false,
    "physicalAddress": false,
    "lastVerified": "July 7, 2026",
    "verifiedDate": "July 7, 2026",
    "sourceUrl": "https://www.jfsalv.org/",
    "neighborhoods": ["Las Vegas", "Clark County", "Southern Nevada"],
    "householdTypes": ["Any household", "Family with children", "Senior"],
    "urgency": ["This week", "This month"]
  },
  {
    "organization": "UNLV PRACTICE",
    "resourceType": "Verified direct provider",
    "category": "therapy/mental health services",
    "address": "UNLV community mental and behavioral health clinic, Las Vegas, NV",
    "phone": "Use the official website contact information",
    "officialSiteNote": "UNLV PRACTICE provides affordable, research-informed mental and behavioral health care. Confirm current services, fees, appointments, and eligibility directly with UNLV PRACTICE.",
    "website": "https://www.unlv.edu/thepractice",
    "hours": "Check the official website for current clinic hours, appointment availability, and service details.",
    "eligibility": "Provides mental and behavioral health services for children, couples, families, adults, and older adults, including therapy and psychological assessment. Fees, services, and availability should be confirmed directly with the clinic.",
    "documents": ["Basic contact information for intake", "Insurance or payment information if requested", "Referral information if applicable", "Medication or treatment history if relevant", "Questions or goals for therapy or assessment"],
    "access": "Official website and clinic intake process",
    "busAccessible": false,
    "physicalAddress": true,
    "lastVerified": "July 7, 2026",
    "verifiedDate": "July 7, 2026",
    "sourceUrl": "https://www.unlv.edu/thepractice",
    "neighborhoods": ["Las Vegas", "Clark County", "Southern Nevada"],
    "householdTypes": ["Any household", "Family with children", "Senior"],
    "urgency": ["This week", "This month"]
  },
  {
    "organization": "988 Suicide & Crisis Lifeline",
    "resourceType": "Verified navigation hub",
    "category": "therapy/mental health services",
    "address": "National 24/7 phone, text, chat, and Deaf/Hard of Hearing crisis support",
    "phone": "988",
    "text": "Text 988",
    "officialSiteNote": "Use 988 for immediate emotional distress, mental-health crisis support, substance-use crisis support, or concern about someone else. Call 911 for immediate physical danger.",
    "website": "https://988lifeline.org/",
    "hours": "Free, confidential support available 24/7/365.",
    "eligibility": "Anyone in the United States experiencing mental health struggles, emotional distress, suicide crisis, substance-use concerns, or concern about a loved one.",
    "documents": ["No documents required", "Current location if emergency help is needed", "Basic description of what is happening", "Whether there is immediate danger"],
    "access": "Call, text, chat, videophone for ASL users, and Deaf/Hard of Hearing options",
    "busAccessible": false,
    "physicalAddress": false,
    "lastVerified": "July 7, 2026",
    "verifiedDate": "July 7, 2026",
    "sourceUrl": "https://988lifeline.org/",
    "neighborhoods": ["Las Vegas", "Clark County", "Nevada", "United States", "Online"],
    "householdTypes": ["Any household"],
    "urgency": ["Today"]
  },
  {
    "organization": "SAMHSA National Helpline and FindTreatment.gov",
    "resourceType": "Verified navigation hub",
    "category": "therapy/mental health services",
    "address": "National phone, text, and online treatment-referral service with local treatment locator",
    "phone": "1-800-662-4357",
    "alternatePhone": "TTY: 1-800-487-4889",
    "text": "Text your ZIP code to 435748 (HELP4U)",
    "officialSiteNote": "SAMHSA's helpline does not provide counseling; it provides treatment referrals and information for mental and substance-use disorders.",
    "website": "https://www.samhsa.gov/find-help/helplines/national-helpline",
    "hours": "Free, confidential treatment-referral and information service available 24/7/365 in English and Spanish by phone.",
    "eligibility": "Individuals and families facing mental and/or substance-use disorders who need treatment referral, support groups, community-based organizations, or local treatment facilities.",
    "documents": ["ZIP code", "Basic description of the concern", "Insurance status if relevant", "Preferred language", "Any treatment preferences or accessibility needs"],
    "access": "Phone, TTY, text ZIP code service, and FindTreatment.gov locator",
    "busAccessible": false,
    "physicalAddress": false,
    "lastVerified": "July 7, 2026",
    "verifiedDate": "July 7, 2026",
    "sourceUrl": "https://www.samhsa.gov/find-help/helplines/national-helpline",
    "neighborhoods": ["Las Vegas", "Clark County", "Nevada", "United States", "Online"],
    "householdTypes": ["Any household"],
    "urgency": ["Today", "This week", "This month"]
  },
  {
    "organization": "Open Path Psychotherapy Collective",
    "resourceType": "Verified navigation hub",
    "category": "therapy/mental health services",
    "address": "National online directory for affordable online and in-person therapy",
    "phone": "Use the official website directory and help resources",
    "officialSiteNote": "Search for therapists serving Las Vegas, Clark County, Nevada, or online. Confirm licensing, fit, availability, fees, and appointment details directly with the therapist.",
    "website": "https://openpathcollective.org/",
    "hours": "Online therapist search is available anytime. Therapist availability varies.",
    "eligibility": "Open Path says it serves people who lack insurance, are underinsured, or cannot afford market-rate therapy. Therapists in the network list reduced session fees; membership and fee details should be confirmed directly on the official website.",
    "documents": ["ZIP code or preference for online therapy", "Budget range", "Insurance or no-insurance status", "Therapy goals or concerns", "Preferred language, specialty, or appointment format"],
    "access": "Online therapist directory with affordable in-person and online options",
    "busAccessible": false,
    "physicalAddress": false,
    "lastVerified": "July 7, 2026",
    "verifiedDate": "July 7, 2026",
    "sourceUrl": "https://openpathcollective.org/",
    "neighborhoods": ["Las Vegas", "Clark County", "Nevada", "Online"],
    "householdTypes": ["Any household", "Family with children"],
    "urgency": ["This week", "This month"]
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
    && resourceMatchesUrgency(resource, urgency);
}

function resourceMatchesTransport(resource, transport) {
  if (transport === "Phone or online only preferred") return !hasPhysicalAddress(resource);
  if (transport === "Bus preferred") return resource.busAccessible || !hasPhysicalAddress(resource);
  return true;
}

function resourceMatchesUrgency(resource, urgency) {
  if (urgency === "Any" || (resource.urgency || []).includes(urgency)) return true;
  return !hasPhysicalAddress(resource);
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
