from flask import Blueprint
from BookingSystem.Admin_Page.forms import UserTourOperatorForm 


# Define the admin blueprint
admin = Blueprint('admin', __name__, template_folder='templates')

# Import the routes to register them with the blueprint
from . import routes
