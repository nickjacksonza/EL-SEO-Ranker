import React from 'react';
import type { PageData, SiteInfo } from '../types';
import GeminiTool from './GeminiTool';

interface SchemaHelperProps {
  pageData: PageData;
  pluginDocs: Record<string, string>;
  siteInfo: SiteInfo;
}

const CodeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);


const SchemaHelper: React.FC<SchemaHelperProps> = ({ pageData, pluginDocs, siteInfo }) => {
  const { schemaInfo } = pageData;

  const generateConsolidatedPrompt = () => {
    const structureText = pageData.structure
      .map(s => {
        let txt = `Section: ${s.title}\n`;
        if (s.h1) txt += `  H1: ${s.h1}\n`;
        if (s.h2) txt += `  H2: ${s.h2}\n`;
        if (s.h3s && s.h3s.some(h3 => h3)) {
          txt += s.h3s
            .filter(h3 => h3)
            .map(h3 => `    H3: ${h3}`)
            .join('\n');
          txt += '\n';
        }
        return txt;
      })
      .join('---\n');
  
    return `Based on the following page structure for a page titled "${pageData.title}", generate a comprehensive and valid JSON-LD schema script. Use an "@graph" array to combine multiple schema types if necessary (e.g., WebPage, FAQPage, Article, etc.). Ensure the output is a single, clean JSON-LD code block ready to be copied.\n\nPage Structure:\n${structureText}`;
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center"><CodeIcon className="mr-3 text-emerald-400" /> Schema Guidance</h2>
      <div className="space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="font-bold text-lg text-emerald-300">Consolidated Schema Generator</h3>
            <p className="text-sm text-slate-400 mt-1">Generate a single schema script for the entire page based on its current structure.</p>
            <div className="mt-4">
                <GeminiTool 
                    buttonText="Generate Consolidated Schema"
                    prompt={generateConsolidatedPrompt()}
                    model="gemini-2.5-pro"
                    siteInfo={siteInfo}
                />
            </div>
        </div>

        {schemaInfo.map((info, index) => (
          <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-4 opacity-70">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-emerald-300">{info.title} (Single)</h3>
                <span className="text-xs bg-purple-500/20 text-purple-300 font-medium px-2 py-1 rounded-full">{info.plugin}</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{info.description}</p>
            <div className="mt-4">
                <GeminiTool 
                    buttonText={`Generate ${info.title} Example`}
                    prompt={info.geminiPrompt}
                    model={info.geminiModel}
                    pluginName={info.plugin}
                    pluginDocs={pluginDocs}
                    siteInfo={siteInfo}
                />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SchemaHelper;
