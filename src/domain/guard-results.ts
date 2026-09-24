export interface GuardFile {
  typeName: string;
  fileName: string;
  content: string;
}

export interface PreviewResult {
  guards: GuardFile[];
}

export interface ApplyResult {
  written: string[];
}

export interface AuditIssue {
  typeName: string;
  sourceFile: string;
  guardFile: string;
  status: 'missing' | 'stale';
}

export interface AuditResult {
  checked: number;
  issues: AuditIssue[];
}

export interface TypeExplanation {
  typeName: string;
  sourceFile: string;
  kind: 'interface' | 'type';
  members: string[];
  limitations: string[];
  guard: GuardFile | null;
}

export class GuardRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GuardRequestError';
  }
}
