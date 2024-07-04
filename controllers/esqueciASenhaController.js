const { spawn } = require('child_process');

const sendEmail = async (req, res, next) => {
  const { subject, body, toEmail } = req.body;

  // Executar script Python para enviar o email
  const pythonProcess = spawn('python', ['enviarEmail.py', subject, body, toEmail]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Email enviado: ${data}`);
    res.json({ success: true });
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Erro ao enviar email: ${data}`);
    res.status(500).json({ success: false, message: 'Erro ao enviar email' });
  });
};

module.exports = {
  sendEmail,
};
