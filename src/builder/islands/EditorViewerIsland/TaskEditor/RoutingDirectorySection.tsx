import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Check, Table, X } from 'lucide-react';
import type { TaskCardData } from '@/types/builder-node.types';
import type { SelectOption } from '@/ui/forms/selects';
import { RegistryDirectoryModal, getIconComponent } from '@/builder/ui/forms/channel';
import { EffectLayer } from '@/ui/motion/EffectLayer';
import { useToggle } from '@/hooks/useToggle';

interface RoutingDirectorySectionProps {
  draftData: TaskCardData;
  updateDraftField: (field: string, value: unknown) => void;
}

let customSegments: SelectOption[] = [
  { value: 'MARKETING_SYS', label: 'Marketing Core', description: 'Primary System Gateway', icon: 'server' },
  { value: 'BILLING_GATEWAY', label: 'Billing System', description: 'Financial gateway provider', icon: 'shield' },
  { value: 'CRM_CLIENT', label: 'CRM Sync Tool', description: 'Staff client-care utility', icon: 'user' },
  { value: 'CUSTOMER_MOBILE', label: 'Mobile App Tiers', description: 'Registered active push list', icon: 'smartphone' },
  { value: 'SUBSCRIBER_EMAIL', label: 'Bulk Email list', description: 'Subscribers publication database', icon: 'mail' },
  { value: 'GLOBAL_AUDIENCE', label: 'All Registered Audiences', description: 'Anonymous & standard visitors', icon: 'users' },
];

export function RoutingDirectorySection({ draftData, updateDraftField }: RoutingDirectorySectionProps) {
  const [segments, setSegments] = useState<SelectOption[]>(customSegments);
  const [activeType, setActiveType] = useState<'sender' | 'receiver' | null>(null);
  const [showDirectory, , openDirectory, closeDirectory] = useToggle();
  const [quickKey, setQuickKey] = useState('');
  const [quickLabel, setQuickLabel] = useState('');
  const [quickIcon, setQuickIcon] = useState('server');

  const selectedId = activeType === 'sender' ? draftData.senderId : draftData.receiverId;
  const selectSegment = (value: string) => {
    updateDraftField(activeType === 'sender' ? 'senderId' : 'receiverId', value);
    setActiveType(null);
  };

  const saveSegment = () => {
    if (!activeType || !quickKey || !quickLabel) return;
    const option: SelectOption = {
      value: quickKey.toUpperCase().replace(/\s+/g, '_'),
      label: quickLabel,
      description: activeType === 'sender' ? 'Custom added gateway' : 'Custom added segment',
      icon: quickIcon,
    };
    customSegments = [...segments, option];
    setSegments(customSegments);
    selectSegment(option.value);
    setQuickKey('');
    setQuickLabel('');
  };

  const renderEndpoint = (type: 'sender' | 'receiver') => {
    const isSender = type === 'sender';
    const id = isSender ? draftData.senderId : draftData.receiverId;
    const option = segments.find((segment) => segment.value === id);
    const active = activeType === type;
    const Icon = isSender ? ArrowUpRight : ArrowDownLeft;

    return (
      <div>
        <div className="flex items-center gap-1 mb-1" title={isSender ? 'Sender Source Gateway' : 'Receiver Audience Group'}>
          <Icon className={`w-4 h-4 opacity-60 ${isSender ? 'text-sky-400' : 'text-emerald-400'}`} />
        </div>
        <button
          type="button"
          onClick={() => {
            setQuickIcon(isSender ? 'server' : 'users');
            setActiveType(active ? null : type);
          }}
          className={`w-full text-left p-3 rounded-xl border flex items-center justify-between group ${
            active ? 'bg-[var(--theme-accent)]/5 border-[var(--theme-accent)]/30' : 'bg-black/40 border-white/[0.06] hover:border-white/15'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 ${isSender ? 'text-sky-400' : 'text-emerald-400'}`}>
              {getIconComponent(option?.icon || (isSender ? 'server' : 'users'))}
            </div>
            <div className="min-w-0">
              <p className="text-dcx-sm font-bold text-neutral-100 truncate">{option?.label || `Select ${isSender ? 'Sender' : 'Receiver'}`}</p>
              <p className="text-dcx-3xs-plus font-mono text-neutral-500 truncate">{option?.value || (isSender ? 'Routing gateway' : 'Target segment')}</p>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 text-dcx-3xs font-mono">Change</span>
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <span className="text-dcx-2xs uppercase tracking-wider text-white/40 font-mono">Routing & Endpoint Directory</span>
          <button type="button" onClick={openDirectory} className="flex items-center gap-1 text-dcx-2xs font-mono text-neutral-400 hover:text-[var(--theme-accent)] uppercase">
            <Table className="w-3 h-3" />
            Registry Directory
          </button>
        </div>

        {/* CC-3: single-column so sender/receiver fields get full editor width (382px) and don't truncate */}
        <div className="grid grid-cols-1 gap-3 pb-1">
          {renderEndpoint('sender')}
          {renderEndpoint('receiver')}
        </div>

        {activeType && (
          <EffectLayer effect="expandCollapse" active>
            <div className="bg-neutral-950/60 border border-white/10 p-3 rounded-xl space-y-3 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-dcx-2xs-plus uppercase font-mono text-[var(--theme-accent)]">
                  {activeType === 'sender' ? 'Select Sender Gateway' : 'Select Recipient Group'}
                </span>
                <button type="button" aria-label="Close endpoint selector" onClick={() => setActiveType(null)}>
                  <X className="w-3.5 h-3.5 text-neutral-400 hover:text-white" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 max-h-[150px] overflow-y-auto pr-1">
                {segments.map((segment) => (
                  <button
                    key={segment.value}
                    type="button"
                    onClick={() => selectSegment(segment.value)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-1.5 ${
                      selectedId === segment.value
                        ? 'bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/30 text-[var(--theme-accent)]'
                        : 'bg-black/25 border-white/5 text-neutral-300 hover:border-white/10'
                    }`}
                  >
                    {getIconComponent(segment.icon)}
                    <span className="min-w-0">
                      <span className="text-dcx-xs font-bold truncate block">{segment.label}</span>
                      <span className="text-dcx-3xs opacity-40 truncate block">{segment.description}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="border-t border-white/5 pt-2.5 space-y-2">
                <span className="text-dcx-3xs uppercase font-mono text-neutral-500">Create a custom audience segment</span>
                <div className="grid grid-cols-2 gap-2">
                  <input value={quickKey} onChange={(event) => setQuickKey(event.target.value)} placeholder="Key" className="bg-black/40 border border-white/10 text-dcx-xs px-2 h-7 rounded font-mono" />
                  <input value={quickLabel} onChange={(event) => setQuickLabel(event.target.value)} placeholder="Label name" className="bg-black/40 border border-white/10 text-dcx-xs px-2 h-7 rounded font-mono" />
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex gap-1">
                    {['server', 'shield', 'user', 'smartphone', 'mail', 'users'].map((icon) => (
                      <button key={icon} type="button" aria-label={`Use ${icon} icon`} onClick={() => setQuickIcon(icon)} className={`p-1 rounded ${quickIcon === icon ? 'bg-white/15' : ''}`}>
                        {getIconComponent(icon)}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={saveSegment} className="flex items-center gap-1 bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded text-dcx-2xs font-mono font-bold">
                    <Check className="w-2.5 h-2.5" />
                    Save Segment
                  </button>
                </div>
              </div>
            </div>
          </EffectLayer>
        )}
      </div>

      <RegistryDirectoryModal isOpen={showDirectory} onClose={closeDirectory} segmentsList={segments} />
    </>
  );
}
