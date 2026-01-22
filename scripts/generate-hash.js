const bcrypt = require('bcryptjs');

const password = 'admin123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
  } else {
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nSQL to update seed file:');
    console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE email = 'admin@sahadhospitals.com';`);
  }
});