export interface OsintResult {
  phoneNumber: string;
  carrier: string;
  location: string;
  lineType: 'Mobile' | 'VoIP' | 'Satellite' | 'IoT' | 'Landline';
  riskScore: number;
  isVoip: boolean;
  leakCount: number;
  lastLeakSource: string;
  linkedAccounts: number;
  tags: string[];
  techStack: string[];
}

export type ScanStatus = 'idle' | 'scanning' | 'complete';

export interface LogEntry {
  id: number;
  text: string;
  type: 'info' | 'warning' | 'success' | 'danger';
}