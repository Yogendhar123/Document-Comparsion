export interface Difference {
  Original: string;
  Revised: string;
  type?: 'modified' | 'added' | 'removed';
  category?: string;
}

export interface DocumentPage {
  PageNo: number;
  Differences: Difference[];
  documentTitle?: string;
  documentType?: string;
  lastModified?: string;
}

export interface DocumentComparison {
  id: string;
  title: string;
  pages: DocumentPage[];
  status: 'active' | 'archived' | 'draft';
  createdDate: string;
  totalChanges: number;
}