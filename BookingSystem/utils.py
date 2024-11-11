# BookingSystem/utils.py

from flask import url_for
from flask_mail import Message
from BookingSystem import mail  # Ensure mail is initialized properly

def send_confirmation_traveler_email(user):
    token = user.get_confirmation_token()  # Ensure this method exists in your User model
    msg = Message('Confirm Your Account',
                  recipients=[user.email])  # Use 'email' instead of 'email_address' if that is the property name
    msg.body = f'''To confirm your account, visit the following link:
{url_for('main.confirm_email', token=token, _external=True)}
'''
    mail.send(msg)

def send_confirmation_tourguide_email(user):
    token = user.get_confirmation_token()  # Ensure this method is implemented
    msg = Message('Confirm Your Account',
                  recipients=[user.email])  # Same here, ensure 'email' is the correct property
    msg.body = f'''To confirm your account, visit the following link:
{url_for('main.confirm_tourguide_email', token=token, _external=True)}  # Correct the endpoint name for tour guides
'''
    mail.send(msg)
