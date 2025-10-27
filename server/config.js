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
        host: process.env.MYSQLHOST || 'mysql.railway.internal',
        port: process.env.MYSQLPORT || 3306,
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE || 'pizzaria',
        timezone: process.env.DBTIMEZONE || '-03:00',
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
