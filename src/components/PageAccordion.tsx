import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, FileText, Calendar, TrendingUp, Eye, Search } from 'lucide-react';
import { DocumentPage } from '../types';
import { PaginatedDifferences } from './PaginatedDifferences';

interface PageAccordionProps {
  pages: DocumentPage[];
  searchQuery: string;
}

export const PageAccordion: React.FC<PageAccordionProps> = ({ pages, searchQuery }) => {
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set([1])); // First page expanded by default
  const [visiblePages, setVisiblePages] = useState(50); // Initial load of 50 pages

  const filteredPages = useMemo(() => {
    if (!searchQuery) return pages;
    
    return pages.filter(page => 
      page.Differences.some(diff => 
        diff.Original.toLowerCase().includes(searchQuery.toLowerCase()) ||
        diff.Revised.toLowerCase().includes(searchQuery.toLowerCase())
      ) || 
      page.documentTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.documentType?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pages, searchQuery]);

  const togglePage = (pageNo: number) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageNo)) {
      newExpanded.delete(pageNo);
    } else {
      newExpanded.add(pageNo);
    }
    setExpandedPages(newExpanded);
  };

  const loadMorePages = () => {
    setVisiblePages(prev => Math.min(prev + 50, filteredPages.length));
  };

  const expandAll = () => {
    setExpandedPages(new Set(filteredPages.slice(0, visiblePages).map(page => page.PageNo)));
  };

  const collapseAll = () => {
    setExpandedPages(new Set());
  };

  const displayedPages = filteredPages.slice(0, visiblePages);

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="font-medium">
              Showing {displayedPages.length} of {filteredPages.length} pages
            </span>
            {searchQuery && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Filtered by: "{searchQuery}"
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Pages Accordion */}
      <div className="space-y-3">
        {displayedPages.map((page) => {
          const isExpanded = expandedPages.has(page.PageNo);
          const filteredDifferences = page.Differences.filter(diff => 
            !searchQuery || 
            diff.Original.toLowerCase().includes(searchQuery.toLowerCase()) ||
            diff.Revised.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <div
              key={page.PageNo}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Page Header */}
              <div
                onClick={() => togglePage(page.PageNo)}
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Page {page.PageNo}
                        </h3>
                        {page.documentTitle && (
                          <span className="text-sm text-gray-600">
                            • {page.documentTitle}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{page.Differences.length} changes</span>
                        </div>
                        
                        {page.documentType && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{page.documentType}</span>
                          </div>
                        )}
                        
                        {page.lastModified && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(page.lastModified).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {filteredDifferences.length} changes
                      </span>
                      {page.documentType && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {page.documentType}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Content with Pagination */}
              {isExpanded && (
                <div className="border-t border-gray-100">
                  <div className="p-6 bg-gray-50">
                    {filteredDifferences.length > 0 ? (
                      <PaginatedDifferences
                        differences={filteredDifferences}
                        searchQuery={searchQuery}
                        pageNo={page.PageNo}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No differences match your search criteria</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load More Pages Button */}
      {visiblePages < filteredPages.length && (
        <div className="text-center py-6">
          <button
            onClick={loadMorePages}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Load More Pages ({filteredPages.length - visiblePages} remaining)
          </button>
        </div>
      )}

      {/* No Results */}
      {filteredPages.length === 0 && searchQuery && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};