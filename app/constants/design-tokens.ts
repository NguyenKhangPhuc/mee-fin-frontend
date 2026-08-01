export const designTokens = {
  colors: {
    bg: {
      page: 'bg-[#f4ebe4]',
      card: 'bg-[#fcf7f3]',
      input: 'bg-[#fffdfb]',
      sidebar: 'bg-[#ede0d7]',
      buttonPrimary: 'bg-[#82301c] hover:bg-[#6c2716]',
      buttonSecondary: 'bg-[#fcf7f3] hover:bg-[#ebdcd3] text-[#291e1b] border border-[#dfccc1]',
      buttonDanger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
      navActive: 'bg-[#82301c] text-white shadow-sm shadow-[#82301c]/20',
      navInactive: 'text-[#61514d] hover:text-[#82301c] hover:bg-[#ebdcd3]',
    },
    text: {
      primary: 'text-[#82301c]',
      secondary: 'text-[#61514d]',
      muted: 'text-[#9c8c87]',
      buttonPrimary: 'text-white',
      buttonSecondary: 'text-[#82301c]',
      error: 'text-red-500',
    },
    border: {
      default: 'border-[#dfccc1]',
      focus: 'focus-within:border-[#82301c]',
      error: 'border-red-500',
    },
  },
  shadows: {
    card: 'shadow-xl shadow-[#82301c]/5',
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
      bg: 'bg-[#fcf7f3]',
      border: 'border-emerald-200',
      accent: 'bg-emerald-500',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      text: 'text-[#291e1b]',
      badge: 'text-emerald-600',
    },
    error: {
      bg: 'bg-[#fcf7f3]',
      border: 'border-red-200',
      accent: 'bg-red-500',
      iconBg: 'bg-red-50 text-red-600 border-red-100',
      text: 'text-[#291e1b]',
      badge: 'text-red-600',
    },
    info: {
      bg: 'bg-[#82301c]',
      border: 'border-[#6c2716]',
      accent: 'bg-[#f1cfc6]',
      iconBg: 'bg-[#6c2716] text-white border-[#561f11]',
      text: 'text-white',
      badge: 'text-[#f1cfc6]',
    },
  },
  loader: {
    overlay: 'bg-[#291e1b]/40 backdrop-blur-xs',
    card: 'bg-[#fcf7f3] border-[#dfccc1] text-[#291e1b] shadow-2xl',
    spinner: 'border-[#dfccc1] border-t-[#82301c]',
  },
} as const;

export default designTokens;
