/* var config = {
  dev: {
    url: 'http://localhost/',
    port: 3000,
    ambiente: 'DEV',
    database: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '55662013',
      database: 'pizzaria',
      timezone: '-03:00' // ou 'Z' se preferir UTC
    },
  }
}

exports.get = function get(ambiente) {
  if (ambiente.toLowerCase() === 'dev') {
    return config.dev;
  }
}
 */

var config = {
    dev: {
        url: process.env.URL || 'http://localhost/',
        port: process.env.PORT || 3000,
        ambiente: process.env.NODE_ENV || 'DEV',
        database: {
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '55652013',
            database: process.env.DB_NAME || 'pizzaria',
            timezone: process.env.DB_TIMEZONE || '-03:00' // ou 'Z' se preferir UTC
        }
    }
};

exports.get = function get(ambiente) {
    if (ambiente.toLowerCase() === 'dev') {
        return config.dev;
    }
    // Fallback para produção
    return config.dev;
};
