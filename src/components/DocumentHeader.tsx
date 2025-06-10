import React from 'react';
import { FileText, Calendar, User, Download, Printer, Share2, Eye } from 'lucide-react';
import { DocumentComparison } from '../types';

interface DocumentHeaderProps {
  document: DocumentComparison;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({ document }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{document.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(document.createdDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>System Administrator</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{document.totalChanges} changes detected</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(document.status)}`}>
            {document.status.toUpperCase()}
          </span>
          
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Printer className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};