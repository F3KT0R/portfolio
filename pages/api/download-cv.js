import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'public', 'cv', 'tibor-balint-cv.pdf');

  if (fs.existsSync(filePath)) {
    const fileStream = fs.createReadStream(filePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Tibor_Balint_CV.pdf');
    fileStream.pipe(res);
  } else {
    res.status(404).json({ error: 'CV file not found' });
  }
}
