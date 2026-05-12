const ROOTS = {
  AUTH: '/auth',
  TIMEBOX: '/timebox',
};

export const paths = {
  faqs: '/faqs',
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
  },
  dashboard: {
    root: '/',
    uiReference: '/ui-reference',
    settings: {
      branches: '/settings/branches',
      roles: '/settings/roles',
      users: '/settings/users',
      translationOverride: '/settings/translationOverride',
    },
  },
  timebox: {
    root: `${ROOTS.TIMEBOX}`,
    inbox: `${ROOTS.TIMEBOX}/inbox`,
    today: `${ROOTS.TIMEBOX}/today`,
    upcoming: `${ROOTS.TIMEBOX}/upcoming`,
    filtersLabels: `${ROOTS.TIMEBOX}/filters-labels`,
    completed: `${ROOTS.TIMEBOX}/completed`,
    search: `${ROOTS.TIMEBOX}/search`,
    projects: `${ROOTS.TIMEBOX}/projects`,
    projectDetail: (id: string) => `${ROOTS.TIMEBOX}/project/${id}`,
    label: (id: string) => `${ROOTS.TIMEBOX}/label/${id}`,
    team: (id: string) => `${ROOTS.TIMEBOX}/team/${id}`,
  },
};
