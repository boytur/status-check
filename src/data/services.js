module.exports = [
  {
    name: 'Generate Retrospective',
    url: 'https://retro.bsospace.com',
    database: null,
    web: 'gen-retro',
    dbmanagement: null,
    api: null
  },
  {
    name: 'BSO Landing page',
    url: 'https://bsospace.com',
    database: null,
    web: 'bsospace-landing-page',
    dbmanagement: null,
    api: null
  },
  {
    name: 'BSO Blog',
    url: 'https://blog.bsospace.com',
    database: 'posyayee-pg-db',
    web: 'bso-blog-production',
    dbmanagement: 'posyayee-pgadmin4-container',
    api: null
  },
  {
    name: 'Sharebill',
    url: 'https://sharebill.bsospace.com',
    database: 'share-bill-mongo',
    web: 'share-bill-frontend-1',
    api: null,
    dbmanagement: null
  },
  {
    name: 'SOS System',
    url: null,
    database: 'SOS_mysql',
    web: 'sos-web',
    dbmanagement: 'SOS_MYADMIN',
    api: null
  },
  {
    name: 'EQS System',
    url: null,
    database: 'equipment-back-database-1',
    web: 'equipment-front_web_1',
    api: 'equipment-back-app-1',
    dbmanagement: 'equipment-back-phpmyadmin-1'
  },
  {
    name: 'PRAMERN',
    url: null,
    database: 'bso-mongo',
    web: 'pramern-frontend',
    api: 'pramern-back-pramern-backend-1',
    dbmanagement: null
  }
]
