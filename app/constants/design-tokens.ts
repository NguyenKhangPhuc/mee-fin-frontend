export const designTokens = {
  colors: {
    bg: {
      page: 'bg-neutral-50',
      card: 'bg-white',
      input: 'bg-white',
      sidebar: 'bg-white',
      buttonPrimary: 'bg-neutral-900 hover:bg-neutral-800',
      buttonSecondary: 'bg-white hover:bg-neutral-50',
      buttonDanger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
      navActive: 'bg-neutral-900 text-white',
      navInactive: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
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
    sidebar: 'shadow-sm',
  },
  radii: {
    card: 'rounded-2xl',
    input: 'rounded-xl',
    button: 'rounded-xl',
    navItem: 'rounded-xl',
    toast: 'rounded-xl',
  },
  notification: {
    success: {
      bg: 'bg-white',
      border: 'border-emerald-200',
      accent: 'bg-emerald-500',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      text: 'text-neutral-800',
      badge: 'text-emerald-600',
    },
    error: {
      bg: 'bg-white',
      border: 'border-red-200',
      accent: 'bg-red-500',
      iconBg: 'bg-red-50 text-red-600 border-red-100',
      text: 'text-neutral-800',
      badge: 'text-red-600',
    },
    info: {
      bg: 'bg-neutral-900',
      border: 'border-neutral-800',
      accent: 'bg-neutral-400',
      iconBg: 'bg-neutral-800 text-neutral-200 border-neutral-700',
      text: 'text-neutral-100',
      badge: 'text-neutral-400',
    },
  },
  loader: {
    overlay: 'bg-neutral-900/40 backdrop-blur-xs',
    card: 'bg-white border-neutral-200 text-neutral-900 shadow-2xl',
    spinner: 'border-neutral-200 border-t-neutral-900',
  },
} as const;

export default designTokens;
