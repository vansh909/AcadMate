const admin =  require('firebase-admin');
const serviceAccount = require('./firebase-key.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://acadmate-ac888.firebasestorage.app",
});

const bucket = admin.storage().bucket();
module.exports = bucket;