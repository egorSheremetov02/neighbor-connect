import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from textwrap import dedent

def send_email_to_user(to_address, subject, email_body):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "nconnectnoreply@gmail.com"
    sender_password = "lywr iigp itmh kfbg" 

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_address
        msg['Subject'] = subject

        msg.attach(MIMEText(email_body, 'plain'))

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls() 
            server.login(sender_email, sender_password) 
            server.send_message(msg) 
    except Exception as e:
        print(f"Failed to send email. Error: {str(e)}")
    

def send_reset_code_to_email(to_address, name, reset_code):
    subject = "NeighbourhoodConnect password reset"
    email_body = \
    dedent(f"""\
    Dear {name}, You are receiving this e-mail because you have requested to have your password reset for your account at Neighbourhood Connect. 
    
    Please use the following code to access you account: {reset_code}. Please note, that this code will only be valid for the next hour.
    
    Thank you for your attention.

    Neighbourhood Connect
    """)

    send_email_to_user(to_address, subject, email_body)


def send_on_login_email(to_address, name):
    subject = "NeighbourhoodConnect login detected"
    email_body = \
    dedent(f"""\
    Dear {name}, You are receiving this e-mail because a login was detected on your account at Neighbourhood Connect.

    If this was you, you can ignore this e-mail. If this was not you, please contact us immediately and change your password, as your account may have been compromised.

    You can turn on two-factor authentication in your account settings to add an extra layer of security to your account.
    
    Thank you for your attention.

    Neighbourhood Connect
    """)

    send_email_to_user(to_address, subject, email_body)


def send_on_registration_email(to_address, name):
    subject = "NeighbourhoodConnect account created"
    email_body = \
    dedent(f"""\
    Dear {name}, You are receiving this e-mail because you have successfully created an account at Neighbourhood Connect.

    If you have not created this account, please contact us immediately, as someone may have used your e-mail address to create an account.
    
    Thank you for your attention.

    Neighbourhood Connect
    """)

    send_email_to_user(to_address, subject, email_body)


def send_on_sensitive_data_changed(to_address, name):
    subject = "NeighbourhoodConnect sensetive data has been changed"
    email_body = \
    dedent(f"""\
    Dear {name}, You are receiving this e-mail because some of your sensetive data has been changed.

    If this was you, you can ignore this e-mail. If this was not you, please contact us immediately and change your password, as your account may have been compromised.

    You can turn on two-factor authentication in your account settings to add an extra layer of security to your account.
    
    Thank you for your attention.

    Neighbourhood Connect
    """)

    send_email_to_user(to_address, subject, email_body)