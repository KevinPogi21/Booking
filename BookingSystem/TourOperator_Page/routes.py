from flask import render_template, redirect, url_for, flash, request, session
from flask_login import login_required, current_user, logout_user
from . import touroperator  
from werkzeug.security import generate_password_hash, check_password_hash
from BookingSystem import bcrypt, db 
from BookingSystem.TourOperator_Page.form import UserTourGuideForm
from BookingSystem.models import User, TourOperator, TourGuide

@touroperator.route('/create_tourguide', methods=['GET', 'POST'])
@login_required
def create_tourguide():
    form = UserTourGuideForm()

    if form.validate_on_submit():
        # Create a new User instance for the tour guide
        new_tourguide_user = User(
            first_name=form.fname.data,
            last_name=form.lname.data,
            email=form.email.data,
            role='tourguide'
        )
        new_tourguide_user.set_password(form.password.data)  # Use the set_password method to hash the password

        try:
            # Add the new tour guide user to the database
            db.session.add(new_tourguide_user)
            db.session.flush()  # Flush to generate the new user's ID without committing yet

            # Retrieve the TourOperator associated with the current user
            tour_operator = TourOperator.query.filter_by(user_id=current_user.id).first()
            if not tour_operator:
                flash("Error: Current user is not a valid tour operator.", 'danger')
                db.session.rollback()  # Rollback any pending changes
                return redirect(url_for('touroperator.touroperator_dashboard'))

            # Debugging: Check if the tour operator is retrieved correctly
            print(f"Tour Operator ID: {tour_operator.id}")

            # Create the TourGuide entry associated with the new User and TourOperator
            new_tourguide_record = TourGuide(
                user_id=new_tourguide_user.id,
                toperator_id=tour_operator.id,
                contact_num=form.contact_number.data,
            )
            db.session.add(new_tourguide_record)
            db.session.commit()  # Commit both the User and TourGuide entries

            # Success message and redirect
            flash('Tour Guide account created successfully!', 'success')
            return redirect(url_for('touroperator.touroperator_dashboard'))

        except Exception as e:
            # Rollback in case of error and log for debugging
            db.session.rollback()
            flash('An error occurred while creating the account. Please try again.', 'danger')
            print(f"Database error: {e}")  # Debugging information
            
            
    # tour_guides = TourGuide.query.filter_by(toperator_id=current_user.tour_operator.id).all()
    
    # Render the tour operator dashboard with the form
    return render_template('touroperator_dashboard.html', title='TourOperator Dashboard', form=form) #, tour_guides=tour_guides
    







@touroperator.route('/dashboard')
@login_required
def touroperator_dashboard():
    # Ensure only tour operators can access this page
    if current_user.role != 'touroperator':
        flash('You do not have permission to access this page.', 'danger')
        return redirect(url_for('main.home'))
    
    form = UserTourGuideForm()  # Instantiate the form for the dashboard
    
    tour_guides = TourGuide.query.filter_by(toperator_id=current_user.tour_operator.id).all()
    
    return render_template('touroperator_dashboard.html', title='TourOperator Dashboard', form=form, tour_guides=tour_guides)



@touroperator.route('/logout')
@login_required
def logout():
    logout_user()
    session.clear()
    flash('Logged out successfully.', 'success')
    return redirect(url_for('main.home'))


@touroperator.route('/tourguide_profile/<int:guide_id>', methods=['GET'])
@login_required
def tourguide_profile(guide_id):
    # Retrieve the tour guide by ID
    tourguide = User.query.get_or_404(guide_id)
    
    # Pass the tour guide data to the profile template
    return render_template('tourguide_profile.html', tourguide=tourguide)

