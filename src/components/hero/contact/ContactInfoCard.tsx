import { AnimateText } from '@/components';
import type { ContactInfoItem } from '@/components/hero/contact';

type ContactInfoCardProps = {
  item: ContactInfoItem;
};

export function ContactInfoCard({ item }: ContactInfoCardProps) {
  const Icon = item.icon;
  const content =
    'valueKey' in item ? <AnimateText k={item.valueKey} /> : item.value;

  return (
    <div className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="text-primary" size={18} aria-hidden />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-medium text-muted-foreground mb-0.5">
            <AnimateText k={item.labelKey} />
          </h4>
          <p className="text-sm text-foreground font-semibold whitespace-pre-line wrap-break-word">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
