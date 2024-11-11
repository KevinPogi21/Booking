# BookingSystem/Admin_Page/forms.py

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, ValidationError, Length
from BookingSystem.models import User  # Assuming UserTraveler is the model for your users

class UserTourOperatorForm(FlaskForm):
    name= StringField('Name', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(),Length(min=6, message="Password must be at least 6 characters long.")])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message="Passwords must match.")])
    contact_number = StringField('Contact Number', validators=[DataRequired()])
    municipal = StringField('Municipal', validators=[DataRequired()])
    submit = SubmitField('Create Account')
    
    def validate_email(self, email):
        traveler = User.query.filter_by(email=email.data).first()
        if traveler:
            raise ValidationError('That email is already in use. Please choose a different one.')
