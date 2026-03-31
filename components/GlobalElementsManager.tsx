import React from 'react';
import type { PageStructureSection } from '../types';

interface GlobalElementsManagerProps {
  headerSection?: PageStructureSection;
  footerSection?: PageStructureSection;
}

const LayersIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
);

const GlobalSectionCard: React.FC<{section: PageStructureSection}> = ({section}) => (
     <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h3 className="font-bold text-lg text-emerald-300">{section.title}</h3>
        <p className="text-sm text-slate-400 mt-1">{section.description}</p>
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Elementor Tip:</span> {section.elementorTip}
          </p>
        </div>
    </div>
);

const GlobalElementsManager: React.FC<GlobalElementsManagerProps> = ({ headerSection, footerSection }) => {
  return (
    <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center">
            <LayersIcon className="mr-3 text-emerald-400" /> Global Elements
        </h2>
        <p className="text-slate-400 mb-4">
            These elements are defined once and appear across your entire site. You can manage their structure here.
        </p>
        <div className="space-y-4">
            {headerSection ? <GlobalSectionCard section={headerSection} /> : <p className="text-slate-500">No Header section defined in constants.</p>}
            {footerSection ? <GlobalSectionCard section={footerSection} /> : <p className="text-slate-500">No Footer section defined in constants.</p>}
        </div>
    </section>
  );
};

export default GlobalElementsManager;
