import React, { forwardRef } from 'react';
import { Agreement } from '../types';

interface ShareableAgreementCardProps {
    agreement: Agreement;
}

const ShareableAgreementCard = forwardRef<HTMLDivElement, ShareableAgreementCardProps>(({ agreement }, ref) => {
    const participants = agreement.agreement_participants || [];
    const rules = agreement.agreement_rules || [];

    return (
        <div
            ref={ref}
            style={{
                width: '1080px',
                height: '1920px',
                background: 'linear-gradient(135deg, #92FFAD 0%, #5CDFF0 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
                boxSizing: 'border-box',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}
        >
            {/* Central White Card - Neo Brutalist */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    border: '4px solid #000000',
                    boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
                    borderRadius: '48px',
                    padding: '64px',
                    width: '100%',
                    maxWidth: '900px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px',
                    position: 'relative',
                    boxSizing: 'border-box'
                }}
            >
                {/* Header: Title */}
                <div style={{ textAlign: 'center' }}>
                    <h1
                        style={{
                            fontSize: '72px',
                            fontWeight: '900',
                            color: '#000000',
                            lineHeight: '1.1',
                            margin: '0',
                            wordBreak: 'break-word',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        {agreement.title}
                    </h1>
                </div>

                {/* Participants with Handshake */}
                {participants.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '24px',
                            flexWrap: 'wrap'
                        }}
                    >
                        {participants.map((p: any, index: number) => (
                            <React.Fragment key={p.id || index}>
                                <div
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        border: '3px solid #000000',
                                        borderRadius: '9999px',
                                        padding: '16px 32px',
                                        fontSize: '28px',
                                        fontWeight: '700',
                                        color: '#000000'
                                    }}
                                >
                                    {p.name}
                                </div>
                                {index === 0 && participants.length > 1 && (
                                    <div style={{ fontSize: '48px' }}>🤝</div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                {/* O Compromisso */}
                <div style={{ textAlign: 'center' }}>
                    <h3
                        style={{
                            fontSize: '20px',
                            fontWeight: '900',
                            color: '#92FFAD',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            margin: '0 0 16px 0'
                        }}
                    >
                        O Compromisso
                    </h3>
                    <p
                        style={{
                            fontSize: '36px',
                            fontWeight: '600',
                            color: '#1F2937',
                            lineHeight: '1.4',
                            margin: '0',
                            fontStyle: 'italic',
                            wordBreak: 'break-word'
                        }}
                    >
                        "{agreement.description}"
                    </p>
                </div>

                {/* Regras */}
                {rules.length > 0 && (
                    <div>
                        <h3
                            style={{
                                fontSize: '20px',
                                fontWeight: '900',
                                color: '#92FFAD',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                margin: '0 0 20px 0',
                                textAlign: 'center'
                            }}
                        >
                            Regras Estipuladas
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {rules.map((rule: any, index: number) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '16px'
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: '28px',
                                            fontWeight: '900',
                                            color: '#92FFAD',
                                            minWidth: '40px'
                                        }}
                                    >
                                        {index + 1}.
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '28px',
                                            fontWeight: '600',
                                            color: '#374151',
                                            lineHeight: '1.4',
                                            wordBreak: 'break-word',
                                            flex: 1
                                        }}
                                    >
                                        {rule.text || rule}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* A Multa */}
                {agreement.penalty && (
                    <div
                        style={{
                            backgroundColor: '#FEE2E2',
                            border: '3px solid #000000',
                            borderRadius: '24px',
                            padding: '24px',
                            textAlign: 'center'
                        }}
                    >
                        <h3
                            style={{
                                fontSize: '20px',
                                fontWeight: '900',
                                color: '#DC2626',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                margin: '0 0 12px 0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <span style={{ fontSize: '24px' }}>⚠️</span>
                            A Multa
                        </h3>
                        <p
                            style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                color: '#DC2626',
                                margin: '0',
                                lineHeight: '1.3',
                                wordBreak: 'break-word'
                            }}
                        >
                            {agreement.penalty}
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div
                    style={{
                        marginTop: 'auto',
                        paddingTop: '32px',
                        borderTop: '2px solid #E5E7EB',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px'
                    }}
                >
                    <img
                        src="/logo.png"
                        alt="Concorda"
                        style={{
                            height: '60px',
                            width: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                    <p
                        style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#6B7280',
                            margin: '0',
                            letterSpacing: '0.05em'
                        }}
                    >
                        Selado no app Concorda
                    </p>
                </div>
            </div>

            {/* Decorative Elements */}
            <div
                style={{
                    position: 'absolute',
                    top: '10%',
                    right: '-5%',
                    width: '400px',
                    height: '400px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    pointerEvents: 'none'
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '-5%',
                    width: '350px',
                    height: '350px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
});

ShareableAgreementCard.displayName = 'ShareableAgreementCard';

export default ShareableAgreementCard;
