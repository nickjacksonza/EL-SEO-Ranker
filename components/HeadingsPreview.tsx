import React from 'react';
import type { PageStructureSection, BrandSettings } from '../types';

interface HeadingsPreviewProps {
  sections: PageStructureSection[];
  brandSettings: BrandSettings;
  headerSection?: PageStructureSection;
  footerSection?: PageStructureSection;
}

const TextIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18.1H3"/></svg>
);

const HeadingsPreview: React.FC<HeadingsPreviewProps> = ({ sections, brandSettings, headerSection, footerSection }) => {
  const { colors, fonts } = brandSettings;

  const h1Style: React.CSSProperties = {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: '1.875rem',
    fontWeight: 'bold',
    lineHeight: '2.25rem'
  };

  const h2Style: React.CSSProperties = {
    color: colors.secondary,
    fontFamily: fonts.heading,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    lineHeight: '2rem',
    marginTop: '1.5rem'
  };
  
  const h3Style: React.CSSProperties = {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: '1.25rem',
    fontWeight: 'bold',
    lineHeight: '1.75rem',
    marginTop: '1rem',
    marginLeft: '1rem'
  };

  const globalSectionStyle: React.CSSProperties = {
      color: colors.body,
      fontFamily: fonts.heading,
      fontSize: '1.25rem',
      fontWeight: 'bold',
      opacity: 0.6,
      borderBottom: `1px solid ${colors.body}20`,
      paddingBottom: '0.5rem',
  };


  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center">
          <TextIcon className="mr-3 text-emerald-400" /> Live Headings Preview
      </h2>
      <div 
        className="border border-slate-700 rounded-lg p-6 space-y-2"
        style={{ backgroundColor: colors.background, color: colors.body, fontFamily: fonts.body }}
      >
        {headerSection && <h3 style={globalSectionStyle}>{headerSection.title} (from Global Header)</h3>}
        
        {sections.map((section) => (
            <React.Fragment key={section.id}>
                {section.h1 && <h1 style={h1Style}>{section.h1}</h1>}
                {section.h2 && <h2 style={h2Style}>{section.h2}</h2>}
                {section.h3s?.map((h3, index) => (
                    h3 && <h3 key={index} style={h3Style}>{h3}</h3>
                ))}
            </React.Fragment>
        ))}

        {footerSection && <h3 style={{...globalSectionStyle, marginTop: '1.5rem'}}>{footerSection.title} (from Global Footer)</h3>}
      </div>
    </section>
  )
};

export default HeadingsPreview;