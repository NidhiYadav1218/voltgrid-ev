const fs = require('fs');
const path = require('path');

// Pure Node.js Standard PDF 1.4 Generator
function createResumePDF(outputPath) {
  const objects = [];
  const pageStreams = [];
  const annotations = [];

  function addStreamText(text, x, y, font = '/F1', size = 10, r = 0.1, g = 0.1, b = 0.1) {
    const escaped = text
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
    pageStreams.push(`${r} ${g} ${b} rg`);
    pageStreams.push(`BT ${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escaped}) Tj ET`);
  }

  function addStreamLine(x1, y1, x2, y2, width = 0.75, r = 0.2, g = 0.2, b = 0.2) {
    pageStreams.push(`${r} ${g} ${b} RG`);
    pageStreams.push(`${width} w`);
    pageStreams.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  }

  function addStreamLink(x1, y1, x2, y2, url) {
    annotations.push({ x1, y1, x2, y2, url });
  }

  // Page Dimensions: A4 = 595.28 x 841.89 points
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const leftMargin = 45;
  const rightMargin = 550;
  const contentWidth = rightMargin - leftMargin;

  let curY = pageHeight - 45; // Start near top

  // 1. HEADER
  addStreamText('NIDHI YADAV', pageWidth / 2 - 80, curY, '/F2', 20, 0.06, 0.09, 0.16); // Bold 20pt
  curY -= 18;

  // Contact Info Line
  const contactText1 = '9328703345  |  nidhiyadav1218@gmail.com  |  linkedin.com/in/nidhiyadav1218';
  addStreamText(contactText1, leftMargin + 30, curY, '/F1', 8.5, 0.25, 0.32, 0.42);
  curY -= 12;

  const contactText2 = 'github.com/NidhiYadav1218  |  Gokuldham Residency, Chanod, Vapi, Gujarat';
  addStreamText(contactText2, leftMargin + 45, curY, '/F1', 8.5, 0.25, 0.32, 0.42);
  curY -= 12;

  // Header separator
  addStreamLine(leftMargin, curY, rightMargin, curY, 1.2, 0.06, 0.09, 0.16);
  curY -= 16;

  function renderSectionHeader(title) {
    addStreamText(title.toUpperCase(), leftMargin, curY, '/F2', 10, 0.06, 0.09, 0.16);
    curY -= 4;
    addStreamLine(leftMargin, curY, rightMargin, curY, 0.6, 0.7, 0.75, 0.8);
    curY -= 12;
  }

  // 2. PROFILE SUMMARY
  renderSectionHeader('Profile Summary');
  const summaryLines = [
    'Full-Stack Web Developer skilled in the MERN Stack (MongoDB, Express.js, React.js, Node.js), JavaScript (ES6+),',
    'and modern cloud infrastructure. Hands-on experience architecting scalable distributed web platforms with real-time',
    'multi-device cloud synchronization (MongoDB Atlas), serverless RESTful APIs, and hardware-grade security protocols.',
    'Passionate about creating responsive, high-performance web products with intuitive UI/UX design.'
  ];
  summaryLines.forEach(line => {
    addStreamText(line, leftMargin, curY, '/F1', 8.8, 0.2, 0.25, 0.33);
    curY -= 11.5;
  });
  curY -= 4;

  // 3. TECHNICAL SKILLS
  renderSectionHeader('Technical Skills');
  const skills = [
    { label: 'Full-Stack & MERN:', val: 'MongoDB Atlas, Express.js, React.js, Node.js, RESTful APIs, Serverless Functions' },
    { label: 'Web Technologies:', val: 'HTML5, CSS3, JavaScript (ES6+), Tailwind CSS, Bootstrap, Responsive Design' },
    { label: 'Databases & Backend:', val: 'MongoDB (NoSQL), MySQL, PHP, Database Schema Design & Optimization' },
    { label: 'Languages:', val: 'JavaScript, Java (incl. Android), SQL, HTML/CSS, Kotlin (Basics)' },
    { label: 'Developer Tools:', val: 'Git, GitHub, Vercel, Figma (UI/UX), Postman, Android Studio, VS Code' }
  ];
  skills.forEach(s => {
    addStreamText(s.label, leftMargin, curY, '/F2', 8.8, 0.06, 0.09, 0.16);
    addStreamText(s.val, leftMargin + 115, curY, '/F1', 8.8, 0.2, 0.25, 0.33);
    curY -= 12;
  });
  curY -= 4;

  // 4. PROJECTS
  renderSectionHeader('Projects');

  // Project 1: VoltGrid
  addStreamText('VoltGrid — Smart EV Fast Charging & Slot Reservation Platform', leftMargin, curY, '/F2', 9.5, 0.06, 0.09, 0.16);
  addStreamText('2026', rightMargin - 28, curY, '/F2', 9, 0.35, 0.42, 0.52);
  curY -= 11;

  addStreamText('Tech Stack: MongoDB Atlas, Express/Node.js Serverless APIs, React/JS, Tailwind CSS, Vercel', leftMargin, curY, '/F3', 8.2, 0.01, 0.45, 0.65);
  curY -= 10;
  addStreamText('Live: voltgrid-ev-five.vercel.app  |  GitHub: github.com/NidhiYadav1218/voltgrid-ev', leftMargin, curY, '/F1', 8.2, 0.3, 0.4, 0.5);
  curY -= 11;

  const voltGridBullets = [
    'Architected a real-time full-stack EV charging reservation platform featuring live multi-device bay telemetry.',
    'Engineered serverless cloud persistence via MongoDB Atlas with REST endpoints (/api/bookings, /api/stations, /api/users).',
    'Implemented cryptographically verified 4-digit PIN security lock with session-bound ownership scoping.',
    'Developed dynamic 15-minute slot hold countdown engine with automated charger release & simulated refund mechanism.',
    'Built an interactive Operator Command Center tracking charging wattage draw, carbon offset, and business ROI analytics.'
  ];
  voltGridBullets.forEach(b => {
    addStreamText('•', leftMargin + 8, curY, '/F1', 8.5, 0.01, 0.45, 0.65);
    addStreamText(b, leftMargin + 18, curY, '/F1', 8.5, 0.2, 0.25, 0.33);
    curY -= 11;
  });
  curY -= 4;

  // Project 2: A Soulful Journey
  addStreamText('A Soulful Journey — Responsive Web Experience', leftMargin, curY, '/F2', 9.5, 0.06, 0.09, 0.16);
  addStreamText('Web Designing', rightMargin - 70, curY, '/F3', 8.5, 0.35, 0.42, 0.52);
  curY -= 11;
  addStreamText('Tech Stack: HTML5, CSS3, JavaScript, Responsive UI/UX', leftMargin, curY, '/F3', 8.2, 0.01, 0.45, 0.65);
  curY -= 11;

  const soulfulBullets = [
    'Designed and developed a responsive, visually appealing website focused on clean layout and visual storytelling.',
    'Implemented mobile-first responsive design principles ensuring cross-browser compatibility and consistent performance.'
  ];
  soulfulBullets.forEach(b => {
    addStreamText('•', leftMargin + 8, curY, '/F1', 8.5, 0.01, 0.45, 0.65);
    addStreamText(b, leftMargin + 18, curY, '/F1', 8.5, 0.2, 0.25, 0.33);
    curY -= 11;
  });
  curY -= 4;

  // 5. WORK EXPERIENCE
  renderSectionHeader('Work Experience');
  addStreamText('Web Development Intern', leftMargin, curY, '/F2', 9.5, 0.06, 0.09, 0.16);
  addStreamText('— Dreamers Technologies, Vapi', leftMargin + 130, curY, '/F3', 9, 0.3, 0.35, 0.45);
  addStreamText('May 2024 – Jul 2024', rightMargin - 95, curY, '/F1', 8.5, 0.35, 0.42, 0.52);
  curY -= 12;

  const expBullets = [
    'Collaborated on building responsive web interfaces using HTML, CSS, and JavaScript with cross-device compatibility.',
    'Assisted in database management, backend query execution with MySQL, and UI/UX component prototyping in Figma.'
  ];
  expBullets.forEach(b => {
    addStreamText('•', leftMargin + 8, curY, '/F1', 8.5, 0.01, 0.45, 0.65);
    addStreamText(b, leftMargin + 18, curY, '/F1', 8.5, 0.2, 0.25, 0.33);
    curY -= 11;
  });
  curY -= 4;

  // 6. EDUCATION
  renderSectionHeader('Education');
  
  // MCA
  addStreamText('Master of Computer Application (MCA) — Pursuing', leftMargin, curY, '/F2', 9, 0.06, 0.09, 0.16);
  addStreamText('2025 – 2027', rightMargin - 52, curY, '/F1', 8.5, 0.35, 0.42, 0.52);
  curY -= 10.5;
  addStreamText('G.H. Patel Computer Science Department, Sardar Patel University', leftMargin, curY, '/F3', 8.2, 0.3, 0.35, 0.45);
  curY -= 12;

  // BCA
  addStreamText('Bachelor of Computer Application (BCA)', leftMargin, curY, '/F2', 9, 0.06, 0.09, 0.16);
  addStreamText('2022 – 2025', rightMargin - 52, curY, '/F1', 8.5, 0.35, 0.42, 0.52);
  curY -= 10.5;
  addStreamText('K.B.S. Commerce & NATARAJ Professional Sciences College  |  SGPA: 8.61 (6th sem)  |  CGPA: 7.38', leftMargin, curY, '/F3', 8.2, 0.3, 0.35, 0.45);
  curY -= 12;

  // HSC & SSC in 1 clean line
  addStreamText('HSC Commerce: St. Joseph English Higher Secondary School (2021–2022) | 64%', leftMargin, curY, '/F1', 8.2, 0.2, 0.25, 0.33);
  curY -= 11;
  addStreamText('SSC: St. Joseph English Higher Secondary School (2019–2020) | 62%', leftMargin, curY, '/F1', 8.2, 0.2, 0.25, 0.33);
  curY -= 13;

  // 7. PERSONAL DETAILS
  renderSectionHeader('Personal Details');
  addStreamText('Date of Birth: 15-05-2004   •   Gender: Female   •   Languages: English, Hindi, Gujarati', leftMargin, curY, '/F1', 8.5, 0.2, 0.25, 0.33);

  // BUILD THE RAW PDF BUFFER
  const contentStream = pageStreams.join('\n');
  const streamBytes = Buffer.from(contentStream, 'utf8');

  // Object list:
  // 1: Catalog
  // 2: Pages
  // 3: Font Helvetica
  // 4: Font Helvetica-Bold
  // 5: Font Helvetica-Oblique
  // 6: Page
  // 7: Contents
  const pdfParts = [];
  const xref = [];
  let currentOffset = 0;

  function appendChunk(chunk) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, 'utf8');
    pdfParts.push(buf);
    currentOffset += buf.length;
  }

  function appendObj(objId, body) {
    xref[objId] = currentOffset;
    appendChunk(`${objId} 0 obj\n${body}\nendobj\n`);
  }

  // Header
  appendChunk('%PDF-1.4\n%âãÏÓ\n');

  // 1: Catalog
  appendObj(1, '<< /Type /Catalog /Pages 2 0 R >>');

  // 2: Pages
  appendObj(2, '<< /Type /Pages /Kids [6 0 R] /Count 1 >>');

  // 3: Font F1 (Helvetica)
  appendObj(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');

  // 4: Font F2 (Helvetica-Bold)
  appendObj(4, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

  // 5: Font F3 (Helvetica-Oblique)
  appendObj(5, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>');

  // 6: Page
  appendObj(6, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
    `/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> ` +
    `/Contents 7 0 R >>`);

  // 7: Contents
  const streamHeader = `<< /Length ${streamBytes.length} >>\nstream\n`;
  const streamFooter = '\nendstream';
  xref[7] = currentOffset;
  appendChunk(`7 0 obj\n${streamHeader}`);
  appendChunk(streamBytes);
  appendChunk(`${streamFooter}\nendobj\n`);

  // Xref
  const startxref = currentOffset;
  appendChunk(`xref\n0 8\n0000000000 65535 f \n`);
  for (let i = 1; i <= 7; i++) {
    const offsetStr = String(xref[i]).padStart(10, '0');
    appendChunk(`${offsetStr} 00000 n \n`);
  }

  // Trailer
  appendChunk(`trailer\n<< /Size 8 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`);

  const finalPdfBuffer = Buffer.concat(pdfParts);
  fs.writeFileSync(outputPath, finalPdfBuffer);
  console.log(`✅ Success! Valid PDF generated at: ${outputPath} (${finalPdfBuffer.length} bytes)`);
}

createResumePDF(path.join(__dirname, 'Nidhi_Yadav_Resume.pdf'));
