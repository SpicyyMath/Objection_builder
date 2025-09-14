import React from 'react';
import type { ConversationTurn } from '../types';
import { UserIcon } from './icons/UserIcon';
import { UsersIcon } from './icons/UsersIcon';
import { useTranslations } from '../hooks/useTranslations';

interface ConversationHistoryProps {
  history: ConversationTurn[];
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ history }) => {
  const t = useTranslations();
  return (
    <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t.historyTitle}</h3>
      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
        {history.map((turn, index) => (
          <div key={index} className={`flex items-start gap-3 w-full`}>
            {turn.role === 'Them' && (
              <>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="p-3 rounded-lg max-w-xl bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600">
                  <p className="text-sm whitespace-pre-wrap">{turn.text}</p>
                </div>
              </>
            )}
            {turn.role === 'You' && (
              <>
                <div className="flex-grow"></div>
                <div className="p-3 rounded-lg max-w-xl bg-primary-600 text-white shadow-sm">
                  <p className="text-sm whitespace-pre-wrap">{turn.text}</p>
                </div>
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationHistory;