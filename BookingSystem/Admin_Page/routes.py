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
        new_user = User(
            first_name=form.name.data,
            email=form.email.data,
            password=hashed_password,
            role='touroperator',  # Set role as tour operator
        )

        try:
            db.session.add(new_user)
            db.session.commit()
            
            # Create a TourOperator entry linked to the new user
            new_operator = TourOperator(
                user_id=new_user.id,
                contact_num=form.contact_number.data,
                municipal=form.municipal.data,
            )
            db.session.add(new_operator)
            db.session.commit()

            flash('Tour Operator account created successfully!', 'success')
            return redirect(url_for('admin.tour_operator_profile', operator_id=new_user.id))  # Redirect to the tour operator profile
        except Exception as e:
            db.session.rollback()  # Rollback if there's an error
            flash('An error occurred while creating the account. Please try again.', 'danger')
            print(f"Database error: {e}")  # For debugging, remove in production

    return render_template('admin_dashboard.html', form=form)  # Render the admin dashboard template

# @admin.route('/tour_operator_profile/<int:operator_id>', methods=['GET'])
# @login_required
# def tour_operator_profile(operator_id):
#     # Fetch the user and tour operator details based on operator_id
#     operator = User.query.get_or_404(operator_id)
#     tour_operator = TourOperator.query.filter_by(user_id=operator_id).first_or_404()

#     return render_template('touroperator_dashboard.html',form=form, operator=operator, tour_operator=tour_operator)

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
