import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * SuccessIcon - Green checkmark circle used in all success popups/modals.
 * Matches the Figma design: outlined circle with a checkmark stroke in #81D66A.
 */
export const SuccessIcon: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <div
    style={{ width: size, height: size }}
    className="flex items-center justify-center"
  >
    <svg
      viewBox="0 0 104.667 104.667"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483"
        stroke="#81D66A"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/**
 * DeleteSuccessIcon - Red trash bin used in all delete success/confirmation popups/modals.
 * Matches the Figma design: red trash bin icon inside a red-bordered circle background.
 */
export const DeleteSuccessIcon: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full border-[6px] border-[#ef4444] flex items-center justify-center shrink-0"
  >
    <Trash2 size={size * 0.5} className="text-[#ef4444]" />
  </div>
);
