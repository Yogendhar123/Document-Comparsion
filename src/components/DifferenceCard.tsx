import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Calendar, Tag, AlertCircle, Plus, Minus, Edit3 } from 'lucide-react';
import { Difference } from '../types';

interface DifferenceCardProps {
  difference: Difference;
  index: number;
}

export const DifferenceCard: React.FC<DifferenceCardProps> = ({ difference, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'removed':
        return <Minus className="w-4 h-4 text-red-600" />;
      case 'modified':
        return <Edit3 className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 border-green-200';
      case 'removed':
        return 'bg-red-50 border-red-200';
      case 'modified':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'removed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'modified':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className={`rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${getTypeColor(difference.type || 'modified')}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getTypeIcon(difference.type || 'modified')}
            <span className="text-sm font-medium text-gray-600">Change #{index + 1}</span>
            {difference.category && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadge(difference.type || 'modified')}`}>
                {difference.category}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {difference.Original && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-700">Original</h3>
                <div className="w-3 h-3 bg-red-200 rounded-full"></div>
              </div>
              <div className="bg-white/70 p-4 rounded-lg border border-red-100">
                <p className="text-sm text-gray-800 leading-relaxed">{difference.Original}</p>
              </div>
            </div>
          )}

          {difference.Revised && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-700">Revised</h3>
                <div className="w-3 h-3 bg-green-200 rounded-full"></div>
              </div>
              <div 
                className="bg-white/70 p-4 rounded-lg border border-green-100 cursor-pointer hover:bg-white/90 transition-colors"
                onClick={() => setShowDetails(!showDetails)}
              >
                <p className="text-sm text-gray-800 leading-relaxed">{difference.Revised}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Eye className="w-3 h-3" />
                  <span>Click to view details</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Modified: 2 days ago</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Priority: Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Status: Approved</span>
              </div>
            </div>
          </div>
        )}

        {showDetails && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Additional Details</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Impact Level: {difference.type === 'modified' ? 'Medium' : difference.type === 'added' ? 'Low' : 'High'}</li>
              <li>• Approval Required: {difference.category === 'Financial' ? 'Yes' : 'No'}</li>
              <li>• Effective Date: Immediate</li>
              <li>• Stakeholder Notification: Pending</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};