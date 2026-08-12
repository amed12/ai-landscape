const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '../.open-next/worker.js');
const workerDestPath = path.join(__dirname, '../.open-next/_worker.js');

try {
  if (fs.existsSync(workerPath)) {
    let content = fs.readFileSync(workerPath, 'utf8');
    
    // Remove the Durable Object export lines
    content = content
      .split('\n')
      .filter(line => !line.includes('DOQueueHandler') && !line.includes('DOShardedTagCache') && !line.includes('BucketCachePurge'))
      .join('\n');
      
    fs.writeFileSync(workerPath, content, 'utf8');
    fs.writeFileSync(workerDestPath, content, 'utf8');
    console.log('Successfully cleaned Durable Object exports from worker scripts.');
  } else {
    console.error('worker.js not found at ' + workerPath);
  }
} catch (err) {
  console.error('Error cleaning worker:', err);
  process.exit(1);
}
