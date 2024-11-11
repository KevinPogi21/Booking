from BookingSystem import create_app, db, bcrypt
from BookingSystem.models import User  # Import the admin model
from BookingSystem import create_admin

def create_tourguide():
    hashed_password = bcrypt.generate_password_hash('tourguide').decode('utf-8')
    tourguide = User(
        email='tourguide1@example.com',
        contact_number='099999999',
        password=hashed_password,
        role='tourguide',  # Ensure your model supports this role
        # confirmed=True  # Ensure 'confirmed' is an attribute in your UserAdmin model
    )
    
    try:
        db.session.add(tourguide)
        db.session.commit()
        print("Tourguide user created successfully!")
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        create_admin()
