// const admin =  require('firebase-admin');
// const serviceAccount = require('./firebase-key.json');


// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: "gs://acadmate-ac888.firebasestorage.app",
// });

// const bucket = admin.storage().bucket();
// module.exports = bucket;



const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://acadmate-ac888.firebasestorage.app" // Make sure this matches exactly
});

const bucket = admin.storage().bucket();

const getPublicUrl = async (filename) => {
    try {
        const file = bucket.file(filename);
        
        // Make the file public (very important for direct access)
        await file.makePublic();

        // Return public URL
        return `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(filename)}`;
    } catch (error) {
        console.error('Error generating public URL:', error);
        throw error;
    }
};

module.exports = { bucket, getPublicUrl };
