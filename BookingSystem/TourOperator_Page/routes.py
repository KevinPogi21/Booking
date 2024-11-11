from flask import render_template, redirect, url_for, flash, request, session, current_app

from flask_login import login_required, current_user, logout_user
from . import touroperator  
from werkzeug.security import generate_password_hash, check_password_hash
from BookingSystem import bcrypt, db 
from BookingSystem.TourOperator_Page.form import UserTourGuideForm, TourPackageForm
from BookingSystem.models import User, TourOperator, TourGuide, TourPackage, EstimatedPrice, Inclusion, Exclusion, Itinerary
from werkzeug.utils import secure_filename
import os
from flask import jsonify


@touroperator.route('/create_tour_package', methods=['GET', 'POST'])
@login_required
def create_tour_package():
    package_form = TourPackageForm()
    guide_form = UserTourGuideForm()  # Instantiate the form for the dashboard
    tour_guides = TourGuide.query.filter_by(toperator_id=current_user.tour_operator.id).all()
    operator = TourOperator.query.filter_by(user_id=current_user.id).first()
    packages = TourPackage.query.filter_by(toperator_id=current_user.tour_operator.id).all()

    if package_form.validate_on_submit():
        # Handle file upload
        file = package_form.package_img.data  # Access the uploaded file
        filename = None

        if file:
            # Secure the filename to avoid any path injection
            filename = secure_filename(file.filename)
            # Save the file to the configured upload folder
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

        # Create the main TourPackage instance
        tour_package = TourPackage(
            toperator_id=current_user.tour_operator.id,
            name=package_form.name.data,
            description=package_form.description.data,
            package_img=filename
        )
        db.session.add(tour_package)
        db.session.flush()  # Flush to get the tour_package ID
        
        # Process Estimated Price entries
        estimated_price_descriptions = request.form.getlist('estimated_price_description[]')
        estimated_price_values = request.form.getlist('estimated_price_value[]')
        for desc, price in zip(estimated_price_descriptions, estimated_price_values):
            if desc and price:  # Validate presence
                estimated_price = EstimatedPrice(
                    package_id=tour_package.id,
                    description=desc,
                    estimated_price=price
                )
                db.session.add(estimated_price)

        # Process Inclusions
        inclusions = request.form.getlist('inclusions[]')
        for inclusion_text in inclusions:
            if inclusion_text:
                inclusion = Inclusion(
                    package_id=tour_package.id,
                    inclusion=inclusion_text
                )
                db.session.add(inclusion)

        # Process Exclusions
        exclusions = request.form.getlist('exclusions[]')
        for exclusion_text in exclusions:
            if exclusion_text:
                exclusion = Exclusion(
                    package_id=tour_package.id,
                    exclusion=exclusion_text
                )
                db.session.add(exclusion)

        # Process Itinerary
        itinerary_titles = request.form.getlist('itinerary_title[]')
        itinerary_subtitles = request.form.getlist('itinerary_subtitle[]')
        for title, subtitle in zip(itinerary_titles, itinerary_subtitles):
            if title and subtitle:
                itinerary = Itinerary(
                    package_id=tour_package.id,
                    title=title,
                    subtitle=subtitle
                )
                db.session.add(itinerary)

        db.session.commit()  # Commit all changes
        flash("Tour package created successfully!", "success")
        return redirect(url_for('touroperator.touroperator_dashboard'))
    
    # Render the tour operator dashboard with the form
    return render_template('touroperator_dashboard.html', guide_form=guide_form, package_form=package_form,
                           tour_guides=tour_guides, operator=operator, packages=packages)
    
@touroperator.route('/get_tour_package/<int:package_id>')
@login_required
def get_tour_package(package_id):
    # Query the database for the package details
    package = TourPackage.query.get_or_404(package_id)

    # Format the data for JSON response
    package_data = {
        "name": package.name,
        "description": package.description,
        # "location": package.location,  # Ensure this field exists in your TourPackage model
        "package_img": package.package_img,  # Ensure this field exists and contains the image filename
        "estimated_prices": [{"description": ep.description, "estimated_price": str(ep.estimated_price)} for ep in package.estimated_prices],
        "inclusions": [{"inclusion": inclusion.inclusion} for inclusion in package.inclusions],
        "exclusions": [{"exclusion": exclusion.exclusion} for exclusion in package.exclusions],
        "itineraries": [{"title": itinerary.title, "subtitle": itinerary.subtitle} for itinerary in package.itineraries]
    }
    return jsonify(package_data)



@touroperator.route('/create_tourguide', methods=['GET', 'POST'])
@login_required
def create_tourguide():
    guide_form = UserTourGuideForm()  # Instantiate the form for the dashboard
    package_form = TourPackageForm()
    tour_guides = TourGuide.query.filter_by(toperator_id=current_user.tour_operator.id).all()
    packages = TourPackage.query.filter_by(toperator_id=current_user.tour_operator.id).all()
    operator = TourOperator.query.filter_by(user_id=current_user.id).first()

    if guide_form.validate_on_submit():
        # Create a new User instance for the tour guide
        new_tourguide_user = User(
            first_name=guide_form.fname.data,
            last_name=guide_form.lname.data,
            email=guide_form.email.data,
            role='tourguide'
        )
        new_tourguide_user.set_password(guide_form.password.data)  # Use the set_password method to hash the password

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
                contact_num=guide_form.contact_number.data,
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

    # Render the tour operator dashboard with the form
    return render_template('touroperator_dashboard.html', guide_form=guide_form, package_form=package_form,
                           tour_guides=tour_guides, operator=operator, packages=packages)
                           



@touroperator.route('/dashboard')
@login_required
def touroperator_dashboard():
    # Ensure only tour operators can access this page
    if current_user.role != 'touroperator':
        flash('You do not have permission to access this page.', 'danger')
        return redirect(url_for('main.home'))
    
    guide_form = UserTourGuideForm()  # Instantiate the form for the dashboard
    package_form = TourPackageForm()
    tour_guides = TourGuide.query.filter_by(toperator_id=current_user.tour_operator.id).all()
    packages = TourPackage.query.filter_by(toperator_id=current_user.tour_operator.id).all()
    operator = TourOperator.query.filter_by(user_id=current_user.id).first()
    
    return render_template('touroperator_dashboard.html', title='TourOperator Dashboard', guide_form=guide_form, 
                           tour_guides=tour_guides, operator=operator, package_form=package_form, packages=packages)


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




