from flask import Blueprint


# Define the admin blueprint
touroperator = Blueprint('touroperator', __name__, template_folder='templates')

# Import the routes to register them with the blueprint
from . import routes
