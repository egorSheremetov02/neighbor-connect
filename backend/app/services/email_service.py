import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_email_to_user(to_address, subject, email_body):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "nconnectnoreply@gmail.com"
    sender_password = "lywr iigp itmh kfbg"

    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = sender_email
        msg['To'] = to_address
        msg['Subject'] = subject

        msg.attach(MIMEText(email_body, 'html'))

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email. Error: {str(e)}")


def create_email_template(content):
    email_template = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                margin: 0;
                padding: 0;
                background-color: #f2f2f2;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }}
            .header {{
                background-color: #6c63ff;
                padding: 30px;
                text-align: center;
                color: #ffffff;
            }}
            .header h1 {{
                margin: 0;
                font-size: 32px;
            }}
            .content {{
                padding: 30px 40px;
                color: #4d4d4d;
                line-height: 1.6;
            }}
            .content h1 {{
                color: #6c63ff;
                font-size: 28px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 25px;
                margin-top: 25px;
                font-size: 16px;
                color: #ffffff;
                background-color: #6c63ff;
                text-decoration: none;
                border-radius: 5px;
            }}
            .code {{
                display: block;
                background-color: #f9f9f9;
                padding: 15px;
                margin: 25px 0;
                font-size: 22px;
                text-align: center;
                border-radius: 5px;
                color: #333333;
                font-weight: bold;
                letter-spacing: 1px;
                border: 1px dashed #6c63ff;
            }}
            .footer {{
                background-color: #f2f2f2;
                text-align: center;
                padding: 15px;
                font-size: 12px;
                color: #999999;
            }}
            a {{
                color: #6c63ff;
                text-decoration: none;
            }}
            a:hover {{
                text-decoration: underline;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Neighbourhood Connect</h1>
            </div>
            <div class="content">
                {content}
            </div>
        </div>
        <div class="footer">
            &copy; 2024 Neighbourhood Connect. All rights reserved.
        </div>
    </body>
    </html>
    """
    return email_template


def send_reset_code_to_email(to_address, name, reset_code):
    subject = "Neighbourhood Connect Password Reset"
    content = f"""
    <h1>Password Reset Requested</h1>
    <p>Dear {name},</p>
    <p>You are receiving this email because you have requested to reset your password for your account at Neighbourhood Connect.</p>
    <p>Please use the following code to reset your password:</p>
    <div class="code">{reset_code}</div>
    <p>Please note that this code will only be valid for the next hour.</p>
    <p>Thank you for your attention.</p>
    <p>Best regards,<br>Neighbourhood Connect Team</p>
    """
    email_body = create_email_template(content)
    send_email_to_user(to_address, subject, email_body)


def send_on_login_email(to_address, name):
    subject = "Neighbourhood Connect Login Detected"
    content = f"""
    <h1>Login Detected</h1>
    <p>Dear {name},</p>
    <p>You are receiving this email because a login was detected on your account at Neighbourhood Connect.</p>
    <p>If this was you, you can ignore this email. If this was not you, please contact us immediately and change your password, as your account may have been compromised.</p>
    <p>You can turn on two-factor authentication in your account settings to add an extra layer of security to your account.</p>
    <p>Thank you for your attention.</p>
    <p>Best regards,<br>Neighbourhood Connect Team</p>
    """
    email_body = create_email_template(content)
    send_email_to_user(to_address, subject, email_body)


def send_on_registration_email(to_address, name):
    subject = "Welcome to Neighbourhood Connect!"
    content = f"""
    <h1>Account Successfully Created</h1>
    <p>Dear {name},</p>
    <p>Welcome to Neighbourhood Connect! You have successfully created an account with us.</p>
    <p>If you did not create this account, please contact us immediately, as someone may have used your email address to create an account.</p>
    <p>We're excited to have you on board.</p>
    <p>Best regards,<br>Neighbourhood Connect Team</p>
    """
    email_body = create_email_template(content)
    send_email_to_user(to_address, subject, email_body)


def send_on_sensitive_data_changed(to_address, name):
    subject = "NeighbourhoodConnect sensetive data has been changed"
    content = f"""
    <h1>Sensitive Data Changed</h1>
    <p>Dear {name},</p>
    <p>You are receiving this email because some of your sensitive data has been changed.</p>
    <p>If this was you, you can ignore this email. If this was not you, please contact us immediately and change your password, as your account may have been compromised.</p>
    <p>Thank you for your attention.</p>
    <p>Best regards,<br>Neighbourhood Connect Team</p>
    """
    email_body = create_email_template(content)
    send_email_to_user(to_address, subject, email_body)