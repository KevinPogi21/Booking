from flask import render_template, redirect, url_for, flash, session
from flask_login import login_required, current_user, logout_user
from . import admin
from werkzeug.security import generate_password_hash
from BookingSystem import db, bcrypt
from BookingSystem.Admin_Page.forms import UserTourOperatorForm
from BookingSystem.models import User, TourOperator

# Create Tour Operator
@admin.route('/create_operator', methods=['GET', 'POST'])
@login_required
def create_operator():
    form = UserTourOperatorForm()  # Instantiate the form
    if form.validate_on_submit():
        # Hash the password from the form
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        
        # Create a new UserTourOperator instance
        new_operator = User(
            email=form.email.data,
            password=hashed_password,
            role='touroperator',  # Set role as tour operator
            # confirmed=True,
        )
        try:
            db.session.add(new_operator)
            db.session.commit()
            new_operator = TourOperator(user_id=new_operator.id)
            db.session.add(new_operator)
            db.session.commit()
            flash('Tour Operator account created successfully!', 'success')
            return redirect(url_for('admin.admin_dashboard'))  # Redirect to the admin dashboard
        except Exception as e:
            db.session.rollback()  # Rollback if there's an error
            flash('An error occurred while creating the account. Please try again.', 'danger')
            print(f"Database error: {e}")  # For debugging, remove in production

    return render_template('admin_dashboard.html', form=form)  # Render the admin dashboard template


@admin.route('/dashboard')
@login_required
def admin_dashboard():
    if current_user.role != 'admin':
        flash('You do not have permission to access this page.', 'danger')
        return redirect(url_for('main.home'))  # Redirect to the main home page

    form = UserTourOperatorForm()  # Create an instance of the OperatorForm
    
    tour_operators = TourOperator.query.all()
    
    return render_template('admin_dashboard.html', title='Admin Dashboard', form=form, tour_operators=tour_operators)  # Render the dashboard with the form


@admin.route('/logout')
@login_required  # Ensure user is logged in before logging out
def logout():
    logout_user()
    session.pop('user_id', None) 
    flash('You have been logged out.', 'info')  # Optional: Notify user
    return redirect(url_for('main.home'))
