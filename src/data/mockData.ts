import { DocumentComparison, Difference } from '../types';

const generateDifferences = (): Difference[] => [
  {
    Original: 'TENDER NO: IPO/CHENNAI/HR/01/2016-17',
    Revised: 'TENDER NO: IPO/CHENNAI/HR/02/2016-17',
    type: 'modified',
    category: 'Tender Information'
  },
  {
    Original: 'Date & time for sale of Document: From 05-12-2016, 10:00 A.M. up to 26-12-2016, 10:00 A.M.',
    Revised: 'Date & time for sale of Document: From 26-12-2016, 10:00 A.M. up to 13-01-2017, 10:00 A.M.',
    type: 'modified',
    category: 'Timeline'
  },
  {
    Original: 'Last date & time for receipt of Tender Document at Patent Office Chennai: up to 26-12-2016, 5:00 P.M.',
    Revised: 'Last date & time for receipt of Tender Document at Patent Office Chennai: up to 13-01-2017, 5:00 P.M.',
    type: 'modified',
    category: 'Timeline'
  },
  {
    Original: 'Date & time for opening of Tender Documents (Technical bid): 28-12-2016 at 11.00 A.M.',
    Revised: 'Date & time for opening of Tender Documents (Technical bid): 19-01-2017 at 11.00 A.M.',
    type: 'modified',
    category: 'Timeline'
  },
  {
    Original: 'Date & time for opening of Tender Documents (Financial bid): 28-12-2016 at 2.00 P.M.',
    Revised: 'Date & time for opening of Tender Documents (Financial bid): 19-01-2017 at 2.00 P.M.',
    type: 'modified',
    category: 'Timeline'
  }
];

const generateAdditionalDifferences = (): Difference[] => [
  {
    Original: 'Minimum qualification: Bachelor\'s degree in Engineering',
    Revised: 'Minimum qualification: Bachelor\'s degree in Engineering with 2 years experience',
    type: 'modified',
    category: 'Qualification'
  },
  {
    Original: 'Security deposit: Rs. 50,000/-',
    Revised: 'Security deposit: Rs. 75,000/-',
    type: 'modified',
    category: 'Financial'
  },
  {
    Original: '',
    Revised: 'Additional requirement: Valid driving license mandatory',
    type: 'added',
    category: 'Requirements'
  },
  {
    Original: 'Contract period: 1 year renewable',
    Revised: 'Contract period: 2 years with performance review',
    type: 'modified',
    category: 'Contract Terms'
  },
  {
    Original: 'Office hours: 9:00 AM to 5:00 PM',
    Revised: '',
    type: 'removed',
    category: 'Work Schedule'
  }
];

const generateRandomDifferences = (count: number): Difference[] => {
  const categories = ['Timeline', 'Financial', 'Qualification', 'Requirements', 'Contract Terms', 'Technical', 'Legal', 'Administrative'];
  const types: ('modified' | 'added' | 'removed')[] = ['modified', 'added', 'removed'];
  const differences: Difference[] = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    differences.push({
      Original: type === 'added' ? '' : `Original content for item ${i + 1} in ${category} section. This contains detailed information about the specific requirement or clause that was present in the original document.`,
      Revised: type === 'removed' ? '' : `Revised content for item ${i + 1} in ${category} section. This shows the updated information with modifications, additions, or clarifications made to improve the document.`,
      type,
      category
    });
  }

  return differences;
};

// Generate a large dataset for testing
const generateLargeDataset = (): DocumentComparison[] => {
  const documents: DocumentComparison[] = [];

  // Create multiple documents with many pages
  for (let docId = 1; docId <= 5; docId++) {
    const pages = [];
    const pageCount = docId === 1 ? 150 : Math.floor(Math.random() * 100) + 50; // First document has 150 pages for testing

    for (let pageNo = 1; pageNo <= pageCount; pageNo++) {
      const differenceCount = Math.floor(Math.random() * 10) + 1; // 1-10 differences per page
      pages.push({
        PageNo: pageNo,
        Differences: pageNo <= 3 ? 
          (pageNo === 1 ? generateDifferences() : generateAdditionalDifferences()) : 
          generateRandomDifferences(differenceCount),
        documentTitle: `Document ${docId} - Page ${pageNo} Content`,
        documentType: ['Government Tender', 'Infrastructure Tender', 'Construction Tender', 'Service Contract', 'Supply Agreement'][Math.floor(Math.random() * 5)],
        lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    const totalChanges = pages.reduce((sum, page) => sum + page.Differences.length, 0);

    documents.push({
      id: docId.toString(),
      title: `Document ${docId} - ${['IPO Chennai HR Tender', 'Mumbai Port Authority Tender', 'Delhi Metro Construction', 'Railway Infrastructure Project', 'Airport Development Tender'][docId - 1]}`,
      status: ['active', 'draft', 'archived'][Math.floor(Math.random() * 3)] as 'active' | 'draft' | 'archived',
      createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalChanges,
      pages
    });
  }

  return documents;
};

export const mockDocumentComparisons: DocumentComparison[] = generateLargeDataset();