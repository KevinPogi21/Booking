from BookingSystem import create_app, db, bcrypt
from BookingSystem.models import User  # Import the admin model

def create_touroperator():
    hashed_password = bcrypt.generate_password_hash('touroperator2').decode('utf-8')
    touroperator = User(
        email='touroperator2@example.com',
        password=hashed_password,
        role='touroperator',
        # confirmed=True  # Ensure 'confirmed' is an attribute in your UserAdmin model
    )
    
    try:
        db.session.add(touroperator)
        db.session.commit()
        print("TourOperator user created successfully!")
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        create_admin()
