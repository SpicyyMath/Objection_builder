import React, { useState } from 'react';
import type { ObjectionResult, RiskLevel } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ReplyIcon } from './icons/ReplyIcon';
import { useTranslations } from '../hooks/useTranslations';

interface ResultCardProps {
  result: ObjectionResult;
  onReply: (responseText: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReply }) => {
  const [copied, setCopied] = useState(false);
  const t = useTranslations();

  const handleCopy = () => {
    navigator.clipboard.writeText(result.responseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const riskStyles: { [key in RiskLevel]: { bg: string; text: string; border: string } } = {
    Low: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', border: 'border-green-300 dark:border-green-600/50' },
    Medium: { bg: 'bg-yellow-50 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-300', border: 'border-yellow-300 dark:border-yellow-600/50' },
    High: { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', border: 'border-red-300 dark:border-red-600/50' },
  };

  const currentRisk = riskStyles[result.riskLevel] || riskStyles.Medium;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-lg">
      <div className="p-6">
        <div className="relative">
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed pr-14">
              {result.responseText}
            </p>
            <div className="absolute top-0 right-0 flex flex-col items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label={t.results.copy}
                title={t.results.copy}
              >
                {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => onReply(result.responseText)}
                className="p-2 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label={t.results.reply}
                title={t.results.reply}
              >
                <ReplyIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 space-y-4">
        {/* Risk Analysis */}
        <div className={`p-4 rounded-lg border ${currentRisk.bg} ${currentRisk.border}`}>
          <div className="flex items-start gap-3">
            <WarningIcon className={`w-5 h-5 mt-0.5 shrink-0 ${currentRisk.text}`} />
            <div>
              <h4 className={`text-sm font-semibold ${currentRisk.text}`}>
                {t.results.riskTitle}: {result.riskLevel}
              </h4>
              <p className={`text-sm mt-1 ${currentRisk.text} opacity-90`}>{result.riskReasoning}</p>
            </div>
          </div>
        </div>

        {/* Logical Fallacies */}
        {result.fallacies.length > 0 && (
          <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600/50">
            <div className="flex items-start gap-3">
              <LightbulbIcon className="w-5 h-5 mt-0.5 shrink-0 text-blue-800 dark:text-blue-300" />
              <div>
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                  {t.results.fallacyTitle}
                </h4>
                {result.fallacies.map((fallacy, index) => (
                    <div key={index} className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <strong className="font-medium">{fallacy.name}:</strong>
                      <p className="opacity-90 italic mt-1">"{fallacy.suggestion}"</p>
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;