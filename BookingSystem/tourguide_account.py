from BookingSystem import create_app, db, bcrypt
from BookingSystem.models import User 

def create_admin():
    hashed_password = bcrypt.generate_password_hash('kevs').decode('utf-8')
    tourguide = User(
        email='admin3@example.com',
        password=hashed_password,
        role='admin',
    )
    
    try:
        db.session.add(tourguide)
        db.session.commit()
        print("Admin user created successfully!")
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        create_admin()
