const Agenda= require('agenda');
const mongoose = require('mongoose');

const agenda = new Agenda({
    db: { address: process.env.MONGO_URI, collection: 'agendaJobs' }
});


agenda.define('assignment due alert', async (job) => {
    const { assignmentId } = job.attrs.data;
});

module.exports = agenda;