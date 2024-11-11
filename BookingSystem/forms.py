from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from flask_login import current_user
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from BookingSystem.models import User
from wtforms import ValidationError
from BookingSystem import db


#  VALIDATORS FOR STRONG PASSWORD
def UppercaseValidator(form, field):
    """Validates that the field contains at least one uppercase letter."""
    if not any(char.isupper() for char in field.data):
        raise ValidationError('Password must contain at least one uppercase letter.')

def LowercaseValidator(form, field):
    """Validates that the field contains at least one lowercase letter."""
    if not any(char.islower() for char in field.data):
        raise ValidationError('Password must contain at least one lowercase letter.')

def DigitalValidator(form, field):
    """Validates that the field contains at least one digit."""
    if not any(char.isdigit() for char in field.data):
        raise ValidationError('Password must contain at least one digit.')

def SpecialCharacterValidator(form, field):
    """Validates that the field contains at least one special character."""
    if not any(char in "!@#$%^&*()_+-=[]{}|;':,.<>?/" for char in field.data):
        raise ValidationError('Password must contain at least one special character.')


# REGISTRATION AND LOGIN FORM FOR TRAVELER
class TravelerRegistrationForm(FlaskForm):
    
    first_name= StringField('Username', validators=[DataRequired()])
    last_name = StringField('Username', validators=[DataRequired()])
    nationality = StringField('Nationality', validators=[DataRequired()])
    email_address = StringField('Email Address', validators=[DataRequired(), Length(min=6, max=300)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8, message='Password must be at least 8 characters long.'),
        UppercaseValidator,
        LowercaseValidator,
        DigitalValidator,
        SpecialCharacterValidator])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message='Passwords must match')])    
    submit = SubmitField('Sign Up')     
                                            
                                                         
    def validate_email_address(self, email_address):
        traveler = User.query.filter_by(email = email_address.data).first()
        if traveler:
            raise ValidationError('That Email is taken. Please Choose a different one.')

class TravelerLoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')
    
 
    
   #TRAVELER RESET PASSWORD FORM 
class TravelerRequestResetForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Request Password Reset')
    
    def validate_email(self, email):
        traveler = User.query.filter_by(email = email.data).first()
        if traveler is None:
            raise ValidationError('There is no account with email. You must register first.')
        
class TravelerResetPasswordForm(FlaskForm):
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message='Passwords must match')])
    submit = SubmitField('Reset Password')
    

class UpdateAccountForm(FlaskForm):

    username = StringField('Username', validators=[DataRequired()])
   #sex = SelectField('Sex', choices=[('male', 'Male'), ('female', 'Female')], validators=[DataRequired()])
    nationality = SelectField('Nationality', choices=[        ('Philippines', 'Philippines'),
        ('United States', 'United States'),
        ('Japan', 'Japan'),
        ('Canada', 'Canada')], validators=[DataRequired()])
    picture = FileField('Update Profile Picture', validators=[FileAllowed(['jpg','png'])])
    submit = SubmitField('Update')
    
    def validate_username(self, username):
        if username.data != current_user.username:
            traveler = User.query.filter_by(username = username.data).first()
            if traveler:
                raise ValidationError('That username is taken. Please Choose a different one.')
        
