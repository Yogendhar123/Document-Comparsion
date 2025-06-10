import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { DocumentPage } from '../types';
import { PageAccordion } from './PageAccordion';

interface VirtualizedPageListProps {
  pages: DocumentPage[];
  searchQuery: string;
  height?: number;
}

interface PageItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    pages: DocumentPage[];
    searchQuery: string;
    expandedPages: Set<number>;
    togglePage: (pageNo: number) => void;
  };
}

const PageItem: React.FC<PageItemProps> = ({ index, style, data }) => {
  const { pages, searchQuery, expandedPages, togglePage } = data;
  const page = pages[index];
  
  if (!page) return null;

  return (
    <div style={style} className="px-2">
      <PageAccordion 
        pages={[page]} 
        searchQuery={searchQuery}
      />
    </div>
  );
};

export const VirtualizedPageList: React.FC<VirtualizedPageListProps> = ({ 
  pages, 
  searchQuery, 
  height = 600 
}) => {
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set([1]));

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

  const togglePage = useCallback((pageNo: number) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageNo)) {
        newSet.delete(pageNo);
      } else {
        newSet.add(pageNo);
      }
      return newSet;
    });
  }, []);

  const itemData = useMemo(() => ({
    pages: filteredPages,
    searchQuery,
    expandedPages,
    togglePage
  }), [filteredPages, searchQuery, expandedPages, togglePage]);

  // For smaller datasets, use regular accordion
  if (filteredPages.length <= 100) {
    return <PageAccordion pages={filteredPages} searchQuery={searchQuery} />;
  }

  // For large datasets, use virtualization
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            {filteredPages.length} pages (virtualized view)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setExpandedPages(new Set(filteredPages.map(p => p.PageNo)))}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpandedPages(new Set())}
              className="px-3 py-1 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>
      
      <List
        height={height}
        itemCount={filteredPages.length}
        itemSize={120} // Base height, will expand when opened
        itemData={itemData}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {PageItem}
      </List>
    </div>
  );
};