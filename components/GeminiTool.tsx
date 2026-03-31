import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { SiteInfo } from '../types';

interface GeminiToolProps {
  buttonText: string;
  prompt: string;
  model: 'gemini-2.5-pro' | 'gemini-2.5-flash';
  pluginName?: string;
  pluginDocs?: Record<string, string>;
  siteInfo?: SiteInfo;
}

const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2L14.39 8.36L21 10.07L16.31 15.15L17.64 22L12 18.36L6.36 22L7.69 15.15L3 10.07L9.61 8.36L12 2z"></path></svg>
);

const GeminiTool: React.FC<GeminiToolProps> = ({ buttonText, prompt, model, pluginName, pluginDocs, siteInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const callGemini = useCallback(async () => {
    setIsLoading(true);
    setResult('');
    setError('');
    setIsExpanded(true);

    try {
      // Fix: Remove manual API key check per coding guidelines, which state to assume the key is always present.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      let context = '';
      if(siteInfo) {
        context += `Here is some information about the website I'm building:\n` +
                   `Site Name: ${siteInfo.siteName}\n` +
                   `Tagline: ${siteInfo.tagline}\n` +
                   `Address: ${siteInfo.address}\n` +
                   `Phone: ${siteInfo.phone}\n` +
                   `Email: ${siteInfo.email}\n` +
                   `Socials: ${JSON.stringify(siteInfo.socialProfiles)}\n\n`;
      }

      if (pluginName && pluginDocs && pluginDocs[pluginName]) {
        const doc = pluginDocs[pluginName];
        context += `Using the following documentation for "${pluginName}" as a reference:\n\n---\n${doc}\n---\n\n`;
      }
      
      const finalPrompt = `${context}Now, please perform the following task:\n${prompt}`;
      
      const response = await ai.models.generateContent({
        model: model,
        contents: finalPrompt
      });
      setResult(response.text);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error(e);
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, model, pluginName, pluginDocs, siteInfo]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    // You can add a toast notification here for better UX
  };

  return (
    <div>
      <button
        onClick={callGemini}
        disabled={isLoading}
        className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
      >
        <SparklesIcon className="w-4 h-4 mr-2" />
        {isLoading ? 'Generating...' : buttonText}
      </button>

      {isExpanded && (
        <div className="mt-4">
          {isLoading && <div className="text-sm text-slate-400">Thinking...</div>}
          {error && <div className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}
          {result && (
            <div className="relative bg-slate-900/70 border border-slate-700 rounded-lg">
              <div className="p-4">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Generated Result</h4>
                <pre className="text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto">
                  <code>{result}</code>
                </pre>
              </div>
               <button 
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-1.5 text-slate-400 bg-slate-700 rounded-md hover:bg-slate-600 hover:text-white transition-colors"
                title="Copy to clipboard"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeminiTool;
