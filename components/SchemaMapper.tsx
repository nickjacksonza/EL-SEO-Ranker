import React, { useState } from 'react';
import type { PageData, SchemaMapping } from '../types';

interface SchemaCardProps {
    mapping: SchemaMapping;
    onMappingChange: (action: { type: 'TOGGLE'; id: string } | { type: 'CLONE'; id: string } | { type: 'DELETE'; id: string } | { type: 'UPDATE_PROP'; mappingId: string; propId: string; value: string }) => void;
}

const CopyIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>);
const TrashIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>);
const GitMergeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 1 9 9"></path></svg>
);

const ToggleSwitch: React.FC<{ checked: boolean, onChange: () => void }> = ({ checked, onChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`${checked ? 'bg-emerald-600' : 'bg-slate-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800`}
    >
        <span
            aria-hidden="true"
            className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);


const SchemaCard: React.FC<SchemaCardProps> = ({ mapping, onMappingChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => onMappingChange({ type: 'TOGGLE', id: mapping.id });
    const handleClone = () => onMappingChange({ type: 'CLONE', id: mapping.id });
    const handleDelete = () => onMappingChange({ type: 'DELETE', id: mapping.id });
    const handlePropChange = (propId: string, value: string) => {
        onMappingChange({ type: 'UPDATE_PROP', mappingId: mapping.id, propId, value });
    };
    
    return (
        <div className={`bg-slate-900/50 border border-slate-700 rounded-lg transition-all ${mapping.isEnabled ? 'opacity-100' : 'opacity-50'}`}>
            <div className="flex items-center p-3">
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-200 truncate">{mapping.schemaType}</h4>
                    <p className="text-xs text-slate-400 truncate">{mapping.description}</p>
                </div>
                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <ToggleSwitch checked={mapping.isEnabled} onChange={handleToggle} />
                    <button onClick={() => setIsExpanded(!isExpanded)} className={`p-1.5 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`} title="Edit Properties">
                        <ChevronDownIcon />
                    </button>
                    <button onClick={handleClone} className="p-1.5 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white" title="Clone Schema"><CopyIcon /></button>
                    <button onClick={handleDelete} className="p-1.5 rounded-md text-red-400/70 hover:bg-red-500/20 hover:text-red-400" title="Delete Schema"><TrashIcon /></button>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-slate-700 p-4 space-y-3">
                    <h5 className="text-sm font-bold text-slate-300">Properties</h5>
                    {mapping.properties.map(prop => (
                        <div key={prop.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start">
                           <div className="md:col-span-2">
                             <label className="block text-xs font-medium text-slate-400 truncate" title={prop.key}>{prop.key}</label>
                             <p className="text-xs text-slate-500">{prop.description}</p>
                           </div>
                           <div className="md:col-span-3">
                            <textarea
                                value={prop.value}
                                onChange={(e) => handlePropChange(prop.id, e.target.value)}
                                rows={prop.value.length > 50 ? 3 : 1}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-2 py-1 text-sm text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                placeholder="Enter value..."
                            />
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface SchemaMapperProps {
  pages: PageData[];
  mappings: SchemaMapping[];
  onMappingChange: (action: any) => void;
}

const AccordionItem: React.FC<{ title: string, children: React.ReactNode, startOpen?: boolean }> = ({ title, children, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-emerald-300 transition-colors hover:bg-slate-700/50"
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && <div className="p-4 border-t border-slate-700 space-y-4">{children}</div>}
        </div>
    );
};

const SchemaMapper: React.FC<SchemaMapperProps> = ({ pages, mappings, onMappingChange }) => {
  const globalMappings = mappings.filter(m => m.pageId === 'all');
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-emerald-400">Schema Mapper</h1>
        <p className="mt-2 text-slate-400">
          Plan which schema types apply to different pages. Enabled schemas will be recommended in the page-specific guidance. You can edit, clone, or disable the default recommendations below.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center">
            <GitMergeIcon className="mr-3 text-emerald-400" /> Schema Plan
        </h2>
        <div className="space-y-4">
            <AccordionItem title="Global Schemas (Sitewide)" startOpen={true}>
                {globalMappings.length > 0 ? (
                    globalMappings.map(mapping => <SchemaCard key={mapping.id} mapping={mapping} onMappingChange={onMappingChange} />)
                ) : <p className="text-slate-500 text-sm">No global schemas defined.</p>}
            </AccordionItem>
            
            {pages.map(page => {
                const pageMappings = mappings.filter(m => m.pageId === page.id);
                if (pageMappings.length === 0) return null;

                return (
                    <AccordionItem key={page.id} title={`${page.title} Page Schemas`}>
                        {pageMappings.map(mapping => <SchemaCard key={mapping.id} mapping={mapping} onMappingChange={onMappingChange} />)}
                    </AccordionItem>
                )
            })}
        </div>
      </section>
    </div>
  );
};

export default SchemaMapper;
