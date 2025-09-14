import React, { useState, useCallback, useRef, useContext } from 'react';
import type { FormData, ObjectionResult, ConversationTurn } from './types';
import { generateObjection } from './services/geminiService';
import Header from './components/Header';
import ObjectionForm from './components/ObjectionForm';
import ResultCard from './components/ResultCard';
import Spinner from './components/Spinner';
import ConversationHistory from './components/ConversationHistory';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ErrorIcon } from './components/icons/ErrorIcon';
import { TargetAudience, ObjectionStyle, EmotionalStyle } from './types';
import { LanguageContext } from './contexts/LanguageContext';
import { useTranslations } from './hooks/useTranslations';

const initialFormData: FormData = {
  mainArgument: '',
  context: '',
  targetAudience: TargetAudience.COLLEAGUE,
  objectionStyle: ObjectionStyle.EVIDENCE_BASED,
  emotionalStyle: EmotionalStyle.RATIONAL,
  toneIntensity: 3,
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
  const [results, setResults] = useState<ObjectionResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const { language } = useContext(LanguageContext)!;
  const t = useTranslations();

  const handleReply = useCallback((objectionText: string) => {
    setConversationHistory(prev => [...prev, { role: 'You', text: objectionText }]);
    setFormData(prev => ({ ...prev, mainArgument: '' }));
    setResults([]);
    setError(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleFormSubmit = useCallback(async (submittedFormData: FormData) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    
    const historyForPrompt = conversationHistory;

    try {
      const generatedResults = await generateObjection(submittedFormData, historyForPrompt, language);
      setResults(generatedResults);

      if (historyForPrompt.length > 0) {
        const lastTurn = historyForPrompt[historyForPrompt.length - 1];
        if (lastTurn?.role === 'You') {
          setConversationHistory(prev => [...prev, { role: 'Them', text: submittedFormData.mainArgument }]);
        }
      }

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : t.unknownError);
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory, language, t]);
  
  const handleClearConversation = useCallback(() => {
    setConversationHistory([]);
    setResults([]);
    setFormData(initialFormData);
    setError(null);
  }, []);

  const isReplying = conversationHistory.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg">
          {t.appDescription}
        </p>

        <div ref={formRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <ObjectionForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            isReplying={isReplying}
            onClearConversation={handleClearConversation}
          />
        </div>

        {isReplying && conversationHistory.length > 0 && (
            <ConversationHistory history={conversationHistory} />
        )}

        <div className="mt-12">
          {isLoading && <Spinner />}
          
          {error && (
            <div className="flex flex-col items-center text-center p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg">
              <ErrorIcon className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">{t.generationFailed}</h3>
              <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2">
                <SparklesIcon className="w-6 h-6 text-primary-500" />
                {t.generatedResponses}
              </h2>
              {results.map((result, index) => (
                <ResultCard key={index} result={result} onReply={handleReply} />
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Objection Builder. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;