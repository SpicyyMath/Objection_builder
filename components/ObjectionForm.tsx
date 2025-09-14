import React from 'react';
import { FormData } from '../types';
import { AUDIENCE_OPTIONS, OBJECTION_STYLE_OPTIONS, EMOTIONAL_STYLE_OPTIONS } from '../constants';
import Tooltip from './Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { GenerateIcon } from './icons/GenerateIcon';
import { NewChatIcon } from './icons/NewChatIcon';
import { useTranslations } from '../hooks/useTranslations';

interface ObjectionFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  isReplying: boolean;
  onClearConversation: () => void;
}

const ObjectionForm: React.FC<ObjectionFormProps> = ({ formData, setFormData, onSubmit, isLoading, isReplying, onClearConversation }) => {
  const t = useTranslations();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'toneIntensity' ? parseInt(value, 10) : value }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.mainArgument.trim()) {
        alert(isReplying ? t.form.errorResponse : t.form.errorStatement);
        return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {isReplying ? t.form.titleReply : t.form.titleStart}
        </h2>
        {isReplying && (
          <button
            type="button"
            onClick={onClearConversation}
            className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline focus:outline-none"
          >
            <NewChatIcon className="w-5 h-5" />
            {t.form.newConversation}
          </button>
        )}
      </div>

      {/* Main Argument & Context */}
      <div className="space-y-6">
        <div>
          <label htmlFor="mainArgument" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isReplying ? t.form.statementLabelReply : t.form.statementLabelStart}
          </label>
          <textarea
            id="mainArgument"
            name="mainArgument"
            rows={3}
            className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder={isReplying ? t.form.statementPlaceholderReply : t.form.statementPlaceholderStart}
            value={formData.mainArgument}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="context" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.form.contextLabel}
          </label>
          <textarea
            id="context"
            name="context"
            rows={2}
            className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder={t.form.contextPlaceholder}
            value={formData.context}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Audience */}
        <div>
          <label htmlFor="targetAudience" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.form.audienceLabel}
            <Tooltip text={t.form.audienceTooltip}>
                <InfoIcon className="w-4 h-4 ml-1 text-gray-400" />
            </Tooltip>
          </label>
          <select
            id="targetAudience"
            name="targetAudience"
            className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={formData.targetAudience}
            onChange={handleChange}
          >
            {AUDIENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{t.audienceOptions[opt].label}</option>)}
          </select>
        </div>

        {/* Objection Style */}
        <div>
          <label htmlFor="objectionStyle" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.form.frameworkLabel}
            <Tooltip text={t.form.frameworkTooltip}>
                <InfoIcon className="w-4 h-4 ml-1 text-gray-400" />
            </Tooltip>
          </label>
          <select
            id="objectionStyle"
            name="objectionStyle"
            className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={formData.objectionStyle}
            onChange={handleChange}
          >
            {OBJECTION_STYLE_OPTIONS.map(opt => <option key={opt} value={opt}>{t.objectionStyleOptions[opt].label}</option>)}
          </select>
        </div>

        {/* Emotional Style */}
        <div>
          <label htmlFor="emotionalStyle" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.form.emotionLabel}
            <Tooltip text={t.form.emotionTooltip}>
                <InfoIcon className="w-4 h-4 ml-1 text-gray-400" />
            </Tooltip>
          </label>
          <select
            id="emotionalStyle"
            name="emotionalStyle"
            className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={formData.emotionalStyle}
            onChange={handleChange}
          >
            {EMOTIONAL_STYLE_OPTIONS.map(opt => <option key={opt} value={opt}>{t.emotionalStyleOptions[opt].label}</option>)}
          </select>
        </div>
        
        {/* Tone Intensity */}
        <div className="md:col-span-1">
          <label htmlFor="toneIntensity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.form.intensityLabel} <span className="font-bold text-primary-600 dark:text-primary-400">{formData.toneIntensity}</span>
          </label>
          <input
            id="toneIntensity"
            name="toneIntensity"
            type="range"
            min="1"
            max="5"
            step="1"
            value={formData.toneIntensity}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t.form.generatingButton}
            </>
          ) : (
            <>
              <GenerateIcon className="w-5 h-5" />
              {t.form.generateButton}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ObjectionForm;