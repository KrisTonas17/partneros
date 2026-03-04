'use client';
import { useState } from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div style={{
      background: '#1a1a26',
      border: '1px solid #2a2a3d',
      borderRadius: '12px',
      padding: '24px',
    }} className={className}>
      {children}
    </div>
  );
}

export function Badge({ children, color = 'default' }: { children: React.ReactNode; color?: 'default' | 'green' | 'yellow' | 'red' | 'purple' }) {
  const colors = {
    default: { bg: 'rgba(99,102,241,0.1)', text: '#a5b4fc', border: 'rgba(99,102,241,0.2)' },
    green: { bg: 'rgba(34,197,94,0.1)', text: '#86efac', border: 'rgba(34,197,94,0.2)' },
    yellow: { bg: 'rgba(245,158,11,0.1)', text: '#fcd34d', border: 'rgba(245,158,11,0.2)' },
    red: { bg: 'rgba(239,68,68,0.1)', text: '#fca5a5', border: 'rgba(239,68,68,0.2)' },
    purple: { bg: 'rgba(168,85,247,0.1)', text: '#d8b4fe', border: 'rgba(168,85,247,0.2)' },
  };
  const c = colors[color];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em',
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
}

export function Button({ children, onClick, variant = 'primary', disabled = false, type = 'button', size = 'md' }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variants = {
    primary: { bg: '#6366f1', color: '#fff', border: '#6366f1', hover: '#4f46e5' },
    secondary: { bg: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: 'rgba(99,102,241,0.3)', hover: 'rgba(99,102,241,0.2)' },
    ghost: { bg: 'transparent', color: '#9ca3af', border: 'transparent', hover: 'rgba(255,255,255,0.05)' },
    danger: { bg: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: 'rgba(239,68,68,0.2)', hover: 'rgba(239,68,68,0.2)' },
  };
  const sizes = { sm: '7px 14px', md: '10px 20px', lg: '13px 28px' };
  const fontSizes = { sm: '12px', md: '13.5px', lg: '15px' };
  const v = variants[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: sizes[size],
        borderRadius: '8px',
        border: `1px solid ${v.border}`,
        background: v.bg,
        color: v.color,
        fontSize: fontSizes[size],
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, name, value, onChange, placeholder, type = 'text', required = false }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: '#f87171', marginLeft: '3px' }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          padding: '10px 14px',
          background: '#12121a',
          border: '1px solid #2a2a3d',
          borderRadius: '8px',
          color: '#e2e2f0',
          fontSize: '14px',
          fontFamily: 'var(--font-sans)',
          outline: 'none',
          transition: 'border-color 0.15s',
          width: '100%',
        }}
      />
    </div>
  );
}

export function Select({ label, name, value, onChange, options, required = false }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: '#f87171', marginLeft: '3px' }}>*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          padding: '10px 14px',
          background: '#12121a',
          border: '1px solid #2a2a3d',
          borderRadius: '8px',
          color: value ? '#e2e2f0' : '#6b7280',
          fontSize: '14px',
          fontFamily: 'var(--font-sans)',
          outline: 'none',
          width: '100%',
          cursor: 'pointer',
        }}
      >
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Textarea({ label, name, value, onChange, placeholder, rows = 3 }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{
          padding: '10px 14px',
          background: '#12121a',
          border: '1px solid #2a2a3d',
          borderRadius: '8px',
          color: '#e2e2f0',
          fontSize: '14px',
          fontFamily: 'var(--font-sans)',
          outline: 'none',
          resize: 'vertical',
          width: '100%',
        }}
      />
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      style={{
        padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 500,
        background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(99,102,241,0.1)',
        color: copied ? '#86efac' : '#a5b4fc',
        border: copied ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(99,102,241,0.2)',
        cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-sans)',
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function ScoreBar({ value, max = 5 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 70 ? '#86efac' : pct >= 50 ? '#fcd34d' : '#fca5a5';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '6px', background: '#2a2a3d', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 600, color, minWidth: '24px', textAlign: 'right' }}>{value.toFixed(1)}</span>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#e2e2f0', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ marginTop: '8px', color: '#9ca3af', fontSize: '14px', margin: '8px 0 0' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

export function Divider() {
  return <div style={{ height: '1px', background: '#2a2a3d', margin: '20px 0' }} />;
}

export function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
      <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>◈</div>
      <p style={{ margin: '0 0 16px', fontSize: '14px' }}>{message}</p>
      {action}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
      {children}
    </div>
  );
}
