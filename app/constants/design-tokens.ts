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
      bg: 'bg-[#82301c]',
      border: 'border-[#6c2716]',
      accent: 'bg-[#f1cfc6]',
      iconBg: 'bg-[#6c2716] text-white border-[#561f11]',
      text: 'text-white',
      badge: 'text-[#f1cfc6]',
      closeBtn: 'text-[#f1cfc6] hover:text-white hover:bg-white/10',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      accent: 'bg-red-600',
      iconBg: 'bg-red-600 text-white border-red-700',
      text: 'text-red-950',
      badge: 'text-red-700',
      closeBtn: 'text-red-400 hover:text-red-900 hover:bg-red-100',
    },
    info: {
      bg: 'bg-[#fcf7f3]',
      border: 'border-[#dfccc1]',
      accent: 'bg-[#82301c]',
      iconBg: 'bg-[#ede0d7] text-[#82301c] border-[#dfccc1]',
      text: 'text-[#291e1b]',
      badge: 'text-[#82301c]',
      closeBtn: 'text-[#61514d] hover:text-[#291e1b] hover:bg-[#ebdcd3]',
    },
  },
  loader: {
    overlay: 'bg-[#291e1b]/40 backdrop-blur-xs',
    card: 'bg-[#fcf7f3] border-[#dfccc1] text-[#291e1b] shadow-2xl',
    spinner: 'border-[#dfccc1] border-t-[#82301c]',
  },
} as const;

export default designTokens;
