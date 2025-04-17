const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors()); // Enabled CORS for all origins
app.use(express.json());

// Serving client.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.html'));
});

//I am using In-memory data as mentioned in the Docs
let patients = [];
let beingTreated = [];
let staffCount = 5;

// Priority comparison: lower triage = higher priority
const triageOrder = [1, 2, 3, 4, 5];

// Add new patient
app.post('/patients', (req, res) => {
  const { name, triageLevel } = req.body;
  if (!name || !triageLevel || triageLevel < 1 || triageLevel > 5) {
    return res.status(400).json({ error: 'Invalid patient data' });
  }

  const patient = {
    id: Date.now().toString(),
    name,
    triageLevel,
    arrivalTime: Date.now(),
    status: 'waiting'
  };

  patients.push(patient);
  sortQueue();

  // Send notifications
  if (triageLevel === 1) {
    io.emit('critical-alert', patient);
  }

  checkStaffing();

  res.status(201).json(patient);
});

// Get current queue based on triage level
app.get('/patients', (req, res) => {
  res.json({ queue: patients });
});

// Move to treatment
app.post('/patients/:id/treat', (req, res) => {
  const id = req.params.id;
  const patientIndex = patients.findIndex(p => p.id === id);
  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Patient not found in queue' });
  }

  const patient = patients.splice(patientIndex, 1)[0];
  patient.status = 'being treated';
  beingTreated.push(patient);

  checkStaffing();
  res.json(patient);
});

// Discharge a patient
app.post('/patients/:id/discharge', (req, res) => {
  const id = req.params.id;
  const index = beingTreated.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found in treatment' });
  }

  const patient = beingTreated.splice(index, 1)[0];
  patient.status = 'discharged';
  checkStaffing();
  res.json(patient);
});

// Sort patients by triage then arrival
function sortQueue() {
  patients.sort((a, b) => {
    if (a.triageLevel !== b.triageLevel) {
      return a.triageLevel - b.triageLevel;
    }
    return a.arrivalTime - b.arrivalTime;
  });

  // Send updated wait time estimates
  patients.forEach((patient, index) => {
    io.emit('wait-time-estimate', {
      patientId: patient.id,
      waitTime: index * 5 // Assuming here 5 mins per patient ahead
    });
  });
}

// Staffing alert (as it were mentioned in docs to include)
function checkStaffing() {
  const totalPatients = patients.length + beingTreated.length;
  const ratio = totalPatients / staffCount;

  if (ratio > 3) {
    io.emit('staff-overload', {
      message: `⚠️ Staff overload: ${totalPatients} patients for ${staffCount} staff`
    });
  }
}

// starting Socket connection
io.on('connection', (socket) => {
  console.log('🟢 Client connected');
  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

// Start server
server.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
