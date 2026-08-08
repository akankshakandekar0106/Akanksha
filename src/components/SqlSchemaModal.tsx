/**
 * KUMBH SARTHI - Supabase PostgreSQL Schema & DDL Viewer / Exporter
 */

import React, { useState } from 'react';
import { Database, Copy, Check, X, ShieldCheck, FileText } from 'lucide-react';
import { SUPABASE_SCHEMA_SQL } from '../lib/sqlExport';

interface SqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlSchemaModal: React.FC<SqlSchemaModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Supabase PostgreSQL Database Schema & DDL Script
              </h3>
              <p className="text-xs text-slate-400">
                Ready-to-run DDL with RLS Policies, Automatic Triggers, Indexes & Kumbh Seed Records
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL Script</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-950 font-mono text-xs text-emerald-300 leading-relaxed">
          <pre>
            <code>{SUPABASE_SCHEMA_SQL}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Includes Row Level Security (RLS) & Triggers</span>
          </span>
          <span className="font-mono text-slate-500">KUMBH SARTHI • E&TC / IoT PROJECT</span>
        </div>
      </div>
    </div>
  );
};
