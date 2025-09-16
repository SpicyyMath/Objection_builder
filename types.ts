
export enum TargetAudience {
  ELDER = 'elder',
  TEACHER = 'teacher',
  LEADER = 'leader',
  COLLEAGUE = 'colleague',
  CLASSMATE = 'classmate',
  CHILD = 'child',
  PARTNER = 'partner',
  STRANGER = 'stranger',
  BITTER_ENEMY = 'bitter_enemy'//新增了仇人选项
}

export enum ObjectionStyle {
  EVIDENCE_BASED = 'evidence_based',
  NVC = 'nvc',
  DESC = 'desc',
  SBI = 'sbi',
  FALLACY_HINT = 'fallacy_hint',
}

export enum EmotionalStyle {
  RATIONAL = 'rational',
  SKEPTICAL = 'skeptical',
  ASSERTIVE = 'assertive',
  FRUSTRATED = 'frustrated',
  SARCASTIC = 'sarcastic',
}

export interface FormData {
  mainArgument: string;
  context: string;
  targetAudience: TargetAudience;
  objectionStyle: ObjectionStyle;
  emotionalStyle: EmotionalStyle;
  toneIntensity: number;
}

export interface Citation {
  title: string;
  source: string;
  url: string;
  snippet: string;
}

export interface Fallacy {
  name: string;
  explanation: string;
  suggestion: string;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface ObjectionResult {
  responseText: string;
  riskLevel: RiskLevel;
  riskReasoning: string;
  fallacies: Fallacy[];
  citations: Citation[];
}

export interface ConversationTurn {
  role: 'You' | 'Them';
  text: string;
}
