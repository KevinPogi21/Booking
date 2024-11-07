import secrets
import os
from flask import current_app, session
from flask import Blueprint, render_template, url_for, flash, redirect, request
from BookingSystem import db, bcrypt, mail
from BookingSystem.forms import TravelerLoginForm, TravelerRegistrationForm, TravelerRequestResetForm, TravelerResetPasswordForm, UpdateAccountForm
from BookingSystem.models import User, TourOperator , send_confirmation_email
from flask_login import login_user, current_user, logout_user, login_required 


#from flask_mail import Message

from flask_dance.contrib.google import make_google_blueprint, google
from flask_dance.contrib.facebook import make_facebook_blueprint, facebook



main = Blueprint('main', __name__)  # Ensure the 'main' blueprint is set


facebook_bp = make_facebook_blueprint(client_id='your-facebook-client-id',
                                      client_secret='your-facebook-client-secret',
                                      redirect_to='main.home')

google_bp = make_google_blueprint(client_id='your-client-id', client_secret='your-client-secret', redirect_to='main.home')
main.register_blueprint(google_bp, url_prefix='/google_login')
main.register_blueprint(facebook_bp, url_prefix='/facebook_login')


@main.route('/google_login')
def google_login():
    if not google.authorized:
        return redirect(url_for('main.google_login'))
    resp = google.get("/plus/v1/people/me")
    assert resp.ok, resp.text
    # Process Google login data here
    
    
@main.route('/facebook_login')
def facebook_login():
    if not facebook.authorized:
        return redirect(url_for('main.facebook.login'))
    resp = facebook.get("/me?fields=id,name,email")
    assert resp.ok, resp.text
    # Process Facebook login data here
    return render_template('home.html')




@main.route('/')
@main.route('/home')
def home():
    return render_template('home.html')

@main.route('/register')
def register():
    return render_template('register.html')


# TRAVELER LOGIN

@main.route('/traveler_login', methods=['GET', 'POST'])
def traveler_login():
    # If someone is already logged in, log them out to avoid session conflicts
    if current_user.is_authenticated:
        logout_user()
        print(f"Previous user logged out. Current user (should be anonymous): {current_user}")

    # form = TravelerLoginForm()
    # if form.validate_on_submit():
    #     user = (
    #         UserAdmin.query.filter_by(email=form.email.data).first() or
    #         UserTourOperator.query.filter_by(email=form.email.data).first() or
    #         UserTraveler.query.filter_by(email=form.email.data).first() or
    #         UserTourGuide.query.filter_by(email=form.email.data).first()
    #     )
        
    form = TravelerLoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            if user.role == 'Admin':
            # Process as Admin
                pass  # Replace with actual logic
            elif user.role == 'TourOperator':
            # Process as Tour Operator
                pass  # Replace with actual logic
            elif user.role == 'Traveler':
            # Process as Traveler
                pass  # Replace with actual logic
            elif user.role == 'TourGuide':
            # Process as Tour Guide
                pass  # Replace with actual logic
        

        if user:
            print(f"User found: {user.email}, Role: {user.role}")

            if bcrypt.check_password_hash(user.password, form.password.data):
                # Log out any previous session
                logout_user()
                print(f"Logged out previous user. Current user: {current_user}")
                
                # Log in the current user
                login_user(user)
                print(f"Logged in user: {user.email}, Role: {user.role}, Session: {session}")

                # Handle role-based redirection
                role_redirects = {
                    'admin': 'admin.admin_dashboard',
                    'touroperator': 'touroperator.touroperator_dashboard',
                    'traveler': 'main.traveler_dashboard',
                    'tourguide': 'tourguide.tourguide_dashboard',
                }

                redirect_url = url_for(role_redirects.get(user.role, 'main.home'))
                print(f"Redirecting to: {redirect_url}") 
                return redirect(redirect_url)
                
            else:
                flash('Invalid password. Please try again.', 'danger')
        else:
            flash('No account found with that email.', 'danger')

    return render_template('traveler_login.html', title='Traveler Login', form=form)

















# TRAVELER REGISTER 
@main.route('/traveler_register', methods=['GET', 'POST'])
def traveler_register():
    if current_user.is_authenticated:
        return redirect(url_for('main.home'))
    form = TravelerRegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        new_traveler = User(
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            nationality=form.nationality.data,
            email=form.email_address.data,
            password=hashed_password,
            profile_img='default.jpg',
            role='traveler',
             
        )
        db.session.add(new_traveler)
        db.session.commit()
        send_confirmation_email(new_traveler)
        flash('Registration successful! Please confirm your email to complete the process.', 'info')
        return redirect(url_for('main.pending_confirmation'))
    else:
        print(form.errors)
    return render_template('traveler_register.html', title='Traveler Register', form=form)


@main.route('/pending_confirmation')
def pending_confirmation():
    return render_template('pending_confirmation.html') 







#CONFIRMATION EMAIL FOR TRAVELER
@main.route('/confirm_email/<token>')
def confirm_email(token):
    user = User.verify_confirmation_token(token)
    if not user:
        user = User.verify_confirmation_token(token)
    if user is None:
        flash('The confirmation link is invalid or has expired.', 'warning')
        return redirect(url_for('main.home'))
    user.confirmed = True
    db.session.commit()
    flash('Your email has been confirmed! You can now log in.', 'success')
    if isinstance(user, User):
        return redirect(url_for('main.traveler_login'))
    else:
        return redirect(url_for('main.tourguide_login'))
    

    


# RESET PASSWORD FOR TRAVELER
@main.route('/traveler_reset_password', methods=['GET', 'POST'])
def traveler_reset_request():
    form = TravelerRequestResetForm()
    
    if form.validate_on_submit():
        traveler = User.query.filter_by(email=form.email.data).first()
        if traveler:
            traveler.send_reset_email()
            flash('An email has been sent with instructions to reset your password.', 'info')
            return redirect(url_for('main.traveler_login'))
        else:
            flash('There is no account with that email. Please register first.', 'warning')
            return redirect(url_for('main.traveler_register'))
    
    return render_template('traveler_reset_request.html', title='Reset Password', form=form)



@main.route('/traveler_reset_password/<token>', methods=['GET', 'POST'])
def traveler_reset_token(token):
    traveler = User.verify_reset_token(token)  # Verify the token first
    if traveler is None:
        flash('That is an invalid or expired token', 'warning')
        return redirect(url_for('main.traveler_reset_request')) 

    form = TravelerResetPasswordForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        traveler.password = hashed_password
        db.session.commit()
        flash('Your password has been updated! You are able to log in now.', 'success')
        return redirect(url_for('main.traveler_login'))
    return render_template('traveler_reset_token.html', title='Reset Password', form=form)






# TRAVELER PROFILE
def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(current_app.root_path, 'static/profile_pics', picture_fn)
    form_picture.save(picture_path)
    print(f"Picture saved to: {picture_path}")  # Debugging print statement
    return picture_fn

@main.route('/logout')
@login_required
def logout():
    logout_user()
    # Clear all session data
    session.clear()
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('main.home'))



    
@main.route('/account', methods=['GET', 'POST'])
@login_required
def account():
    form = UpdateAccountForm()
    if form.picture.data:
        profile_img = save_picture(form.picture.data)
        current_user.profile_img = profile_img
        db.session.commit()  # Save the new image file name to the database
    
    # Use a default image if no image file is set
    profile_img_name = current_user.profile_img if current_user.profile_img else 'default.jpg'
    print(f"Current image file: {profile_img_name}")  # Debugging print statement
    profile_img = url_for('static', filename='profile_pics/' + profile_img_name)
    
    return render_template('account.html', title='Account', profile_img=profile_img, form=form)



@main.route('/booking')
def booking():
    return render_template('booking.html')

@main.route('/tourguide_form')
def tourguideform():
    return render_template('tourguide_form.html')

@main.route('/traveler_dashboard')
def traveler_dashboard():
    return render_template('traveler_dashboard.html')




    

    
    
 






