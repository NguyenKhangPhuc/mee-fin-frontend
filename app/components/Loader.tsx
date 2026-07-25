/**
 * PURPOSE:
 * Renders a global fullscreen loading overlay during async actions.
 * Redesigned using design tokens for visual consistency across MEE-FINS.
 *
 * CONTEXT/PARENT FILE:
 * Mounted globally in root layout wrappers.
 *
 * INPUTS / PARAMETERS:
 * None (reads global state via useLoader context hook).
 */

'use client';

import { useLoader } from "../context/LoaderContext";
import { designTokens } from "../constants/design-tokens";

const Loader = () => {
  const { isOpenLoader } = useLoader();

  if (!isOpenLoader) return null;

  return (
    <div className={`fixed inset-0 z-[110] ${designTokens.loader.overlay} flex items-center justify-center p-4 transition-all duration-200 animate-in fade-in`}>
      <div className={`${designTokens.loader.card} p-6 ${designTokens.radii.card} flex flex-col items-center justify-center gap-3 min-w-[160px]`}>
        {/* Animated Spinner */}
        <div className={`w-9 h-9 border-3 ${designTokens.loader.spinner} rounded-full animate-spin`} />
        <span className="text-xs font-semibold tracking-wide text-neutral-600">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loader;
