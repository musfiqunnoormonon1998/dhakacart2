import express from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      store: 'DhakaCart',
      city: 'Dhaka, Bangladesh',
      currency: 'BDT (৳)',
      pythonAvailable: true
    });
  });

  // Serve python brain source code for live inspection
  app.get('/api/brain/python-source', (req, res) => {
    try {
      const brainPath = path.join(__dirname, 'brain.py');
      if (fs.existsSync(brainPath)) {
        const code = fs.readFileSync(brainPath, 'utf-8');
        res.json({ success: true, code });
      } else {
        res.status(404).json({ success: false, error: 'brain.py not found' });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Execute recommendation via Python engine directly
  app.post('/api/brain/recommend', (req, res) => {
    const { query, budget = 100000, limit = 6 } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const py = spawn('python3', [
      path.join(__dirname, 'brain.py'),
      'recommend',
      '--query',
      String(query),
      '--budget',
      String(budget),
      '--limit',
      String(limit)
    ]);

    let stdoutData = '';
    let stderrData = '';

    py.stdout.on('data', data => {
      stdoutData += data.toString();
    });

    py.stderr.on('data', data => {
      stderrData += data.toString();
    });

    py.on('close', code => {
      if (code !== 0) {
        return res.status(500).json({
          error: 'Python process failed',
          details: stderrData,
          exitCode: code
        });
      }
      try {
        const parsed = JSON.parse(stdoutData);
        res.json({ success: true, engine: 'python3_brain.py', data: parsed });
      } catch (err: any) {
        res.status(500).json({
          error: 'Failed to parse Python JSON output',
          raw: stdoutData
        });
      }
    });
  });

  // Execute similar products via Python engine directly
  app.get('/api/brain/similar/:productId', (req, res) => {
    const productId = req.params.productId;
    const limit = req.query.limit || 4;

    const py = spawn('python3', [
      path.join(__dirname, 'brain.py'),
      'similar',
      '--product-id',
      String(productId),
      '--limit',
      String(limit)
    ]);

    let stdoutData = '';
    let stderrData = '';

    py.stdout.on('data', data => {
      stdoutData += data.toString();
    });

    py.stderr.on('data', data => {
      stderrData += data.toString();
    });

    py.on('close', code => {
      if (code !== 0) {
        return res.status(500).json({
          error: 'Python process failed',
          details: stderrData,
          exitCode: code
        });
      }
      try {
        const parsed = JSON.parse(stdoutData);
        res.json({ success: true, engine: 'python3_brain.py', data: parsed });
      } catch (err: any) {
        res.status(500).json({
          error: 'Failed to parse Python output',
          raw: stdoutData
        });
      }
    });
  });

  // Execute parity test via Python engine directly
  app.get('/api/brain/test-parity', (req, res) => {
    const py = spawn('python3', [path.join(__dirname, 'brain.py'), 'test-parity']);

    let stdoutData = '';
    let stderrData = '';

    py.stdout.on('data', data => {
      stdoutData += data.toString();
    });

    py.stderr.on('data', data => {
      stderrData += data.toString();
    });

    py.on('close', code => {
      if (code !== 0) {
        return res.status(500).json({
          error: 'Parity test failed in Python process',
          details: stderrData
        });
      }
      try {
        const parsed = JSON.parse(stdoutData);
        res.json({ success: true, engine: 'python3_brain.py', data: parsed });
      } catch (err: any) {
        res.status(500).json({
          error: 'Failed to parse Python output',
          raw: stdoutData
        });
      }
    });
  });

  // Vite Integration
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DhakaCart server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
