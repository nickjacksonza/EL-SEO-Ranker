// Fix: Create the SiteInfoManager component.
import React from 'react';
import type { SiteInfo } from '../types';

interface SiteInfoManagerProps {
  siteInfo: SiteInfo;
  // onSiteInfoChange: (newInfo: SiteInfo) => void; // for future implementation
}

const InfoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);


const SiteInfoManager: React.FC<SiteInfoManagerProps> = ({ siteInfo }) => {
  return (
    <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center">
            <InfoIcon className="mr-3 text-emerald-400" /> Site Information
        </h2>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
            <p className="text-sm text-slate-400">
                This information is provided as context to the Gemini AI tool to help generate more relevant content.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <strong className="text-slate-300 block">Site Name:</strong>
                    <span>{siteInfo.siteName}</span>
                </div>
                 <div>
                    <strong className="text-slate-300 block">Tagline:</strong>
                    <span>{siteInfo.tagline}</span>
                </div>
                 <div>
                    <strong className="text-slate-300 block">Address:</strong>
                    <span>{siteInfo.address}</span>
                </div>
                 <div>
                    <strong className="text-slate-300 block">Phone:</strong>
                    <span>{siteInfo.phone}</span>
                </div>
                 <div>
                    <strong className="text-slate-300 block">Email:</strong>
                    <span>{siteInfo.email}</span>
                </div>
                 <div>
                    <strong className="text-slate-300 block">Socials:</strong>
                    <ul className="list-disc list-inside">
                        {Object.entries(siteInfo.socialProfiles).map(([platform, url]) => (
                            <li key={platform}><span className="capitalize">{platform}:</span> {url}</li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* Future: Add form fields here to edit site info */}
        </div>
    </section>
  );
};

export default SiteInfoManager;
