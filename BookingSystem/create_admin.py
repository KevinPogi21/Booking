from BookingSystem import create_app, db, bcrypt
from BookingSystem.models import User  # Import the admin model

def create_admin():
    hashed_password = bcrypt.generate_password_hash('kevs').decode('utf-8')
    admin = User(
        email='admin3@example.com',
        password=hashed_password,
        role='admin',
        # confirmed=True  # Ensure 'confirmed' is an attribute in your UserAdmin model
    )
    
    try:
        db.session.add(admin)
        db.session.commit()
        print("Admin user created successfully!")
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        create_admin()
