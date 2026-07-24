export const designTokens = {
  colors: {
    bg: {
      page: 'bg-neutral-50',
      card: 'bg-white',
      input: 'bg-white',
      buttonPrimary: 'bg-neutral-900 hover:bg-neutral-800',
      buttonSecondary: 'bg-white hover:bg-neutral-50',
    },
    text: {
      primary: 'text-neutral-900',
      secondary: 'text-neutral-600',
      muted: 'text-neutral-400',
      buttonPrimary: 'text-white',
      buttonSecondary: 'text-neutral-800',
      error: 'text-red-500',
    },
    border: {
      default: 'border-neutral-200',
      focus: 'focus-within:border-neutral-900',
      error: 'border-red-500',
    },
  },
  shadows: {
    card: 'shadow-xl shadow-neutral-200/60',
    button: 'shadow-sm',
  },
  radii: {
    card: 'rounded-2xl',
    input: 'rounded-xl',
    button: 'rounded-xl',
  },
} as const;

export default designTokens;
