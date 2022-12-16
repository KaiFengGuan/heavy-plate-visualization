import TooltipClass from '@/components/Tooltip';
import { randomString } from '@/utils';

let tooltipIns = null;
export function initGlobalTooltip() {
  if (tooltipIns) return tooltipIns;

  const ele = document.body;
  const globalTooltipIns = new TooltipClass(
    { width: 0, height: 0 },
    ele,
    `globalTooltip_${randomString()}`
  );
  return globalTooltipIns;
}

tooltipIns = initGlobalTooltip();

export default tooltipIns;
