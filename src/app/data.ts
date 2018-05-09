export const TSROUTES = {
    DASHBOARD: [],
    TRAININGS: [],
    PEOPLE: [],   
    CERTIFICATES: [],
    REPORTS: [
      /* {name: 'ACTIVITY_REPORTS', link: '/reports/activity'},
      {name: 'FACILITY', link: ''},
      {name: 'PARTICIPANT', link: ''},
      {name: 'TRAINER', link: ''}, */
      {name: 'TRAINING', link: '/reports/training'},
      /* {name: null, link: null},
      {name: 'DATA_DOWNLOADS', link: ''} */
    ],
    /* TIMELINE: [], */
    SETTINGS: [
      /* {name: 'COUNTRY_SETUP', link: ''}, 
      {name: 'TRAINING_SETTINGS', link: ''},
      {name: 'PEOPLE_SETTINGS', link: ''}, */
      {name: 'FACILITY_SETTINGS', link: '/admin/facility'},
      {name: 'USER_SETTINGS', link: '/admin/user'},
      {name: null, link: null},
      {name: 'LOG_OUT', link: ''}
    ],
};

