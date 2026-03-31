import React from 'react';
import type { PageStructureSection } from '../types';

interface PageStructurePlannerProps {
  pageId: string;
  sections: PageStructureSection[];
  headerSection?: PageStructureSection;
  footerSection?: PageStructureSection;
  onStructureChange: (pageId: string, action: { type: 'MOVE'; from: number; to: number } | { type: 'CLONE'; index: number } | { type: 'DELETE'; index: number } | { type: 'ADD' }) => void;
  onHeadingChange: (pageId: string, sectionId: string, headingType: 'h1' | 'h2' | 'h3', value: string, h3Index?: number) => void;
  onSectionUpdate: (pageId: string, sectionId: string, newTitle: string) => void;
}

const CubeIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>);
const ArrowUpIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>);
const ArrowDownIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>);
const CopyIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>);
const TrashIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
const PlusIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);

const HeadingInput: React.FC<{level: 'h1' | 'h2' | 'h3', value: string, onChange: (val: string) => void, disabled?: boolean}> = ({ level, value, onChange, disabled }) => (
    <div className="flex items-center gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase">{level}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-2 py-1 text-sm text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed"
            placeholder={`Enter ${level.toUpperCase()} text...`}
        />
    </div>
);

const SectionCard: React.FC<{section: PageStructureSection, children?: React.ReactNode, headingFields: React.ReactNode, onTitleChange: (newTitle: string) => void}> = ({section, children, headingFields, onTitleChange}) => (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 transition-all hover:border-emerald-500/50">
        <div className="flex justify-between items-start gap-4">
          <input 
            type="text"
            value={section.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="font-bold text-lg text-emerald-300 bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded -ml-1 px-1 w-full"
          />
          {section.reusable && ( <span className="text-xs bg-sky-500/20 text-sky-300 font-medium px-2 py-1 rounded-full whitespace-nowrap">Reusable Template</span> )}
        </div>
        <p className="text-sm text-slate-400 mt-1">{section.description}</p>
        
        <div className="mt-4 space-y-2">
            {headingFields}
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center">
          <p className="text-xs text-slate-400 flex-1 pr-4">
            <span className="font-semibold text-slate-300">Elementor Tip:</span> {section.elementorTip}
          </p>
          {children}
        </div>
    </div>
);

const GlobalSectionCard: React.FC<{section: PageStructureSection}> = ({section}) => (
     <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 opacity-60">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-emerald-300">{section.title}</h3>
          {section.reusable && ( <span className="text-xs bg-sky-500/20 text-sky-300 font-medium px-2 py-1 rounded-full">Global Template</span> )}
        </div>
        <p className="text-sm text-slate-400 mt-1">{section.description}</p>
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Elementor Tip:</span> {section.elementorTip}
          </p>
        </div>
    </div>
);

const PageStructurePlanner: React.FC<PageStructurePlannerProps> = ({ pageId, sections, headerSection, footerSection, onStructureChange, onHeadingChange, onSectionUpdate }) => {
  if (pageId === 'globals') {
      return (
        <section>
          <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center"><CubeIcon className="mr-3 text-emerald-400" /> Page Structure</h2>
          <div className="space-y-4">
            {sections.map((section) => ( <GlobalSectionCard key={section.id} section={section} /> ))}
          </div>
        </section>
      );
  }

  const dynamicSections = sections.slice(1);

  const moveUp = (index: number) => onStructureChange(pageId, { type: 'MOVE', from: index, to: index - 1 });
  const moveDown = (index: number) => onStructureChange(pageId, { type: 'MOVE', from: index, to: index + 1 });
  const clone = (index: number) => onStructureChange(pageId, { type: 'CLONE', index });
  const remove = (index: number) => onStructureChange(pageId, { type: 'DELETE', index });
  const addSection = () => onStructureChange(pageId, { type: 'ADD' });

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center"><CubeIcon className="mr-3 text-emerald-400" /> Page Structure</h2>
      <div className="space-y-4">
        {headerSection && <GlobalSectionCard section={headerSection} />}
        
        {sections.length > 0 && (
            <SectionCard 
                section={sections[0]}
                onTitleChange={(newTitle) => onSectionUpdate(pageId, sections[0].id, newTitle)}
                headingFields={
                    <HeadingInput level="h1" value={sections[0].h1 || ''} onChange={() => {}} disabled />
                }
            >
                {/* No controls for the fixed H1 section */}
            </SectionCard>
        )}
        
        {dynamicSections.map((section, index) => (
          <SectionCard 
            key={section.id} 
            section={section}
            onTitleChange={(newTitle) => onSectionUpdate(pageId, section.id, newTitle)}
            headingFields={
                <div className="space-y-2">
                    <HeadingInput level="h2" value={section.h2 || ''} onChange={(val) => onHeadingChange(pageId, section.id, 'h2', val)} />
                    {Array.from({ length: Math.max(3, section.h3s?.length || 0) }).map((_, h3Index) => (
                         <HeadingInput 
                             key={h3Index} 
                             level="h3" 
                             value={section.h3s?.[h3Index] || ''} 
                             onChange={(val) => onHeadingChange(pageId, section.id, 'h3', val, h3Index)} 
                         />
                    ))}
                </div>
            }
          >
             <div className="flex items-center gap-1">
                <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"><ArrowUpIcon /></button>
                <button onClick={() => moveDown(index)} disabled={index === dynamicSections.length - 1} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"><ArrowDownIcon /></button>
                <button onClick={() => clone(index)} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white"><CopyIcon /></button>
                <button onClick={() => remove(index)} className="p-1.5 rounded-md text-red-400/70 hover:bg-red-500/20 hover:text-red-400"><TrashIcon /></button>
             </div>
          </SectionCard>
        ))}

        <button 
            onClick={addSection}
            className="w-full border-2 border-dashed border-slate-600 rounded-lg py-4 text-slate-400 hover:bg-slate-700 hover:border-slate-500 hover:text-white transition-colors flex items-center justify-center"
        >
            <PlusIcon className="w-5 h-5 mr-2" /> Add Section
        </button>
        
        {footerSection && <GlobalSectionCard section={footerSection} />}
      </div>
    </section>
  );
};

export default PageStructurePlanner;
