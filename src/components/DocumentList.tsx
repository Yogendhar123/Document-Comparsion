import React from 'react';
import { DocumentComparison } from '../types';
import { FileText, Calendar, TrendingUp, Eye } from 'lucide-react';

interface DocumentListProps {
  documents: DocumentComparison[];
  selectedDocument: DocumentComparison | null;
  onSelectDocument: (document: DocumentComparison) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  selectedDocument, 
  onSelectDocument 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Document Comparisons</h2>
      
      {documents.map((document) => (
        <div
          key={document.id}
          onClick={() => onSelectDocument(document)}
          className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedDocument?.id === document.id
              ? 'border-blue-300 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{document.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(document.createdDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{document.totalChanges} changes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{document.pages.length} pages</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                  {document.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            {selectedDocument?.id === document.id && (
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};