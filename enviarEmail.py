import sys
import smtplib
from email.mime.text import MIMEText

def send_email(subject, body, to_email):
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user = 'projetobeabaenzo@gmail.com'
    smtp_password = 'xgcs lhmr jspz igei'

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = to_email

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, to_email, msg.as_string())
        print('Email enviado com sucesso')
    except Exception as e:
        print(f'Erro ao enviar e-mail: {e}', file=sys.stderr)

if __name__ == '__main__':
    if len(sys.argv) != 4:
        print('Uso: python enviarEmail.py <assunto> <corpo> <email_destino>', file=sys.stderr)
        sys.exit(1)

    subject = sys.argv[1]
    body = sys.argv[2]
    to_email = sys.argv[3]

    send_email(subject, body, to_email)
