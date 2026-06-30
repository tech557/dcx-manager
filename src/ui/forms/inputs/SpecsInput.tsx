import { HelpCircle } from 'lucide-react';
import { Input } from '@/ui/atoms/Input';

interface SpecsInputProps {
  id: string;
  metricLabel: string;
  metricValue: string;
  onLabelChange: (label: string) => void;
  onValueChange: (value: string) => void;
  placeholderLabel?: string;
  placeholderValue?: string;
  title?: string;
}

export function SpecsInput({
  id,
  metricLabel,
  metricValue,
  onLabelChange,
  onValueChange,
  placeholderLabel = 'e.g. Dimensions',
  placeholderValue = 'e.g. 1080x1920',
  title = 'Specification Metric',
}: SpecsInputProps) {
  return (
    <div className="flex flex-col gap-1 w-full bg-white/[0.01] border border-white/5 p-2 rounded-lg" id={`specs-input-panel-${id}`}>
      <div className="flex items-center justify-between gap-1 select-none">
        <span className="text-dcx-2xs font-light uppercase tracking-[0.08em] text-neutral-400 font-mono">
          {title}
        </span>
        <span title="Key-value pair defining layout asset strict boundaries.">
          <HelpCircle className="w-3 h-3 text-neutral-500" />
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
            id={`specs-input-label-${id}`}
            type="text"
            value={metricLabel}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder={placeholderLabel}
            label="Label"
            className="bg-neutral-900"
          />
        </div>

        <div>
          <Input
            id={`specs-input-value-${id}`}
            type="text"
            value={metricValue}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={placeholderValue}
            label="Value"
            className="bg-neutral-900"
          />
        </div>
      </div>
    </div>
  );
}
