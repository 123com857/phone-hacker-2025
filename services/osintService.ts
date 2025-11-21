import { OsintResult } from '../types';

// Fake databases for simulation
const LEAK_SOURCES = [
  "Facebook_2019_Dump", "Shanghai_Police_DB_2022", "JD_Logistics_Leak", 
  "Weibo_User_Table_V3", "Telegram_CN_Group_Export", "LinkedIn_Scrape_2023",
  "Hotel_CheckIn_Records_2024", "DarkWeb_Credit_Alpha", "Unknown_Botnet_Log"
];

const TECH_TAGS = ["WhatsApp", "Telegram", "WeChat", "Alipay", "Twitter", "Signal", "Tinder"];

const CITY_CODES: Record<string, string> = {
  '130': 'Beijing', '131': 'Shanghai', '132': 'Guangzhou', '133': 'Shenzhen',
  '134': 'Chengdu', '135': 'Hangzhou', '136': 'Wuhan', '137': 'Xi\'an',
  '138': 'Nanjing', '139': 'Chongqing', '150': 'Tianjin', '151': 'Suzhou',
  '186': 'Beijing', '189': 'Shanghai'
};

const HACKER_LOGS = [
  "Initializing handshake protocol...",
  "Bypassing carrier firewall...",
  "Triangulating signal towers...",
  "Accessing SS7 backbone...",
  "Querying dark web mirrors...",
  "Decryping HLR lookup response...",
  "Cross-referencing social graphs...",
  "Found 3 matches in leaked databases...",
  "Analyzing digital footprint...",
  "Report generation initiated..."
];

export const generateRandomResult = (phone: string): OsintResult => {
  // Deterministic random based on phone number length/content so the same number gets same result (mostly)
  const seed = phone.length + parseInt(phone.slice(-4) || "0");
  
  // Carrier Logic
  let carrier = "Unknown Carrier";
  let location = "Overseas / Unknown";
  
  // Basic mock logic for China numbers
  if (phone.includes("86") || phone.length === 11) {
    const prefix = phone.replace('+86', '').replace('86', '').substring(0, 3);
    if (['134','135','136','137','138','139','150','151','152','157','158','159','182','183','184','187','188'].includes(prefix)) {
      carrier = "China Mobile (CMCC)";
    } else if (['130','131','132','155','156','185','186'].includes(prefix)) {
      carrier = "China Unicom (CUCC)";
    } else if (['133','153','180','181','189'].includes(prefix)) {
      carrier = "China Telecom (CTCC)";
    } else {
      carrier = "Virtual Operator / MVNO";
    }
    
    if (CITY_CODES[prefix]) {
      location = `CN - ${CITY_CODES[prefix]}`;
    } else {
      location = "CN - Random Province";
    }
  } else {
    // International logic
    if (phone.startsWith('+1')) {
      carrier = "Verizon / AT&T";
      location = "USA / North America";
    } else if (phone.startsWith('+44')) {
      carrier = "Vodafone UK";
      location = "United Kingdom";
    }
  }

  // Risk Score Calculation
  const riskScore = Math.min(99, Math.floor(Math.random() * 60) + (seed % 40));
  
  // Leak Logic
  const leakCount = Math.floor(Math.random() * 15);
  const lastLeak = leakCount > 0 ? LEAK_SOURCES[seed % LEAK_SOURCES.length] : "None";
  
  // Linked Accounts
  const linkedAccounts = Math.floor(Math.random() * 20);
  
  // Determine Type
  const types: ('Mobile' | 'VoIP' | 'Satellite' | 'IoT')[] = ['Mobile', 'Mobile', 'Mobile', 'VoIP', 'IoT'];
  const lineType = types[seed % types.length];

  return {
    phoneNumber: phone,
    carrier,
    location,
    lineType: lineType as any,
    riskScore,
    isVoip: lineType === 'VoIP',
    leakCount,
    lastLeakSource: lastLeak,
    linkedAccounts,
    tags: TECH_TAGS.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5)),
    techStack: []
  };
};

export const getRandomLog = (): string => {
  return HACKER_LOGS[Math.floor(Math.random() * HACKER_LOGS.length)];
};