import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from textwrap import dedent

def send_reset_code_to_email(to_address, name, reset_code):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "nconnectnoreply@gmail.com"
    sender_password = "lywr iigp itmh kfbg" 

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_address
        msg['Subject'] = "NeighbourhoodConnect password reset"

        msg.attach(MIMEText(
          dedent(f"""\
          Dear {name}, You are receiving this e-mail because you have requested to have your password reset for your account at Neighbourhood Connect. 
          
          Please use the following code to access you account: {reset_code}. Please note, that this code will only be valid for the next hour.
          
          Thank you for your attention.

          Neighbourhood Connect
          """), 'plain'))

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls() 
            server.login(sender_email, sender_password) 
            server.send_message(msg) 
    except Exception as e:
        print(f"Failed to send email. Error: {str(e)}")