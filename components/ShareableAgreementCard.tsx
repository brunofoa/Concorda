import React, { forwardRef } from 'react';
import { Agreement } from '../types';

interface ShareableAgreementCardProps {
    agreement: Agreement;
}

const ShareableAgreementCard = forwardRef<HTMLDivElement, ShareableAgreementCardProps>(({ agreement }, ref) => {
    return (
        <div
            ref={ref}
            style={{
                width: '1080px',
                height: '1920px', // Instagram Story size
                backgroundColor: '#F8F9FA', // Light bg
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                padding: '80px',
                boxSizing: 'border-box',
                fontFamily: "'Inter', sans-serif" // Ensure font matches
            }}
            className="bg-slate-50"
        >
            {/* Decorative Border */}
            <div className="absolute inset-10 border-[12px] border-black rounded-[60px] pointer-events-none"></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-16 relative z-10">
                <span className="text-4xl font-black uppercase tracking-widest bg-black text-white px-8 py-3 rounded-full">
                    {agreement.category || 'ACORDO'}
                </span>
                <span className="text-3xl font-bold text-gray-500 uppercase tracking-widest">
                    {new Date(agreement.created_at).toLocaleDateString()}
                </span>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center relative z-10">
                <h1 className="text-[100px] leading-[0.9] font-black text-black uppercase mb-16 break-words tracking-tighter">
                    {agreement.title}
                </h1>

                <div className="bg-white border-[8px] border-black rounded-[50px] p-12 mb-16 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-3xl font-black uppercase text-gray-400 mb-6 tracking-widest">O Compromisso</h3>
                    <p className="text-5xl font-bold text-gray-900 leading-tight">
                        "{agreement.description}"
                    </p>
                </div>

                <div className="flex gap-6 flex-wrap">
                    {agreement.agreement_participants?.map((p: any) => (
                        <div key={p.id} className="bg-black text-white text-3xl font-black px-8 py-4 rounded-full border-[4px] border-transparent">
                            {p.name.split(' ')[0]}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto relative z-10 text-center border-t-[6px] border-black pt-10">
                <p className="text-4xl font-black uppercase tracking-widest mb-4">
                    Selado no <span className="text-emerald-500">App Concorda</span> 🤝
                </p>
                <p className="text-2xl text-gray-500 font-bold">concorda.app</p>
            </div>

            {/* Background decoration */}
            <div className="absolute top-1/2 right-[-100px] w-[600px] h-[600px] bg-emerald-300 rounded-full blur-[150px] opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-300 rounded-full blur-[150px] opacity-30 pointer-events-none"></div>
        </div>
    );
});

ShareableAgreementCard.displayName = 'ShareableAgreementCard';

export default ShareableAgreementCard;
