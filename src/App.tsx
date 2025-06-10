import React, { useState } from 'react';
import { DocumentHeader } from './components/DocumentHeader';
import { DocumentList } from './components/DocumentList';
import { SearchAndFilter } from './components/SearchAndFilter';
import { PageAccordion } from './components/PageAccordion';
import { mockDocumentComparisons } from './data/mockData';
import { DocumentComparison } from './types';
import { GitCompare as FileCompare, BarChart3, Settings, Bell } from 'lucide-react';

function App() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentComparison | null>(
    mockDocumentComparisons[0]
  );
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filters: any) => {
    // Implement filtering logic
    console.log('Filters applied:', filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileCompare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Document Comparison Tool</h1>
                <p className="text-sm text-gray-600">Professional Document Analysis System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DocumentList
              documents={mockDocumentComparisons}
              selectedDocument={selectedDocument}
              onSelectDocument={setSelectedDocument}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedDocument ? (
              <>
                <DocumentHeader document={selectedDocument} />
                
                <SearchAndFilter 
                  onSearch={handleSearch}
                  onFilter={handleFilter}
                />

                {/* Pages with Accordion */}
                <PageAccordion 
                  pages={selectedDocument.pages} 
                  searchQuery={searchQuery}
                />

                {/* Summary Stats */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedDocument.totalChanges}
                      </div>
                      <div className="text-sm text-blue-800">Total Changes</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedDocument.pages.reduce((acc, page) => 
                          acc + page.Differences.filter(d => d.type === 'added').length, 0
                        )}
                      </div>
                      <div className="text-sm text-green-800">Added</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedDocument.pages.reduce((acc, page) => 
                          acc + page.Differences.filter(d => d.type === 'modified').length, 0
                        )}
                      </div>
                      <div className="text-sm text-yellow-800">Modified</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {selectedDocument.pages.reduce((acc, page) => 
                          acc + page.Differences.filter(d => d.type === 'removed').length, 0
                        )}
                      </div>
                      <div className="text-sm text-red-800">Removed</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <FileCompare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Selected</h3>
                <p className="text-gray-600">Select a document from the list to view comparisons</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;