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
            <div className="flex justify-between items-center mb-16 relative z-10 w-full px-4">
                <span className="text-3xl font-bold text-gray-500">
                    {new Date(agreement.created_at).toLocaleDateString()}
                </span>
                <span className="text-4xl font-black bg-black text-white px-8 py-3 rounded-full">
                    {agreement.category || 'ACORDO'}
                </span>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10 px-4">
                <h1 className="text-[90px] leading-[0.9] font-black text-black mb-8 break-words tracking-tight">
                    {agreement.title}
                </h1>

                {/* Participants */}
                <div className="flex gap-4 flex-wrap mb-12">
                    {agreement.agreement_participants?.map((p: any) => (
                        <div key={p.id} className="bg-black text-white text-2xl font-bold px-6 py-3 rounded-full">
                            {p.name.split(' ')[0]}
                        </div>
                    ))}
                </div>

                {/* Sections Container */}
                <div className="space-y-10">
                    {/* Compromisso */}
                    <div className="bg-white border-[6px] border-black rounded-[40px] p-10 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-2xl font-black text-gray-400 mb-4">O Compromisso</h3>
                        <p className="text-4xl font-bold text-gray-900 leading-tight">
                            "{agreement.description}"
                        </p>
                    </div>

                    {/* Regras */}
                    {agreement.rules && agreement.rules.length > 0 && (
                        <div className="bg-white border-[6px] border-black rounded-[40px] p-10 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-2xl font-black text-gray-400 mb-4">Regras</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {agreement.rules.map((rule, index) => (
                                    <li key={index} className="text-3xl font-bold text-gray-900 leading-tight">
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Multa */}
                    {agreement.penalty && (
                        <div className="bg-white border-[6px] border-black rounded-[40px] p-10 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-2xl font-black text-gray-400 mb-4">A Multa</h3>
                            <p className="text-3xl font-bold text-red-600 leading-tight">
                                {agreement.penalty}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto relative z-10 flex flex-col items-center justify-center pt-16 pb-4">
                <img src="/logo.png" alt="Concorda" className="h-24 w-auto mb-4 object-contain" />
                <p className="text-3xl text-gray-600 font-bold tracking-wider">concorda.app.br</p>
            </div>

            {/* Background decoration */}
            <div className="absolute top-1/2 right-[-100px] w-[600px] h-[600px] bg-emerald-300 rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-300 rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        </div>
    );
});

ShareableAgreementCard.displayName = 'ShareableAgreementCard';

export default ShareableAgreementCard;
