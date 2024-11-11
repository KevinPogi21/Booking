from flask import Blueprint

# Define the admin blueprint
tourguide = Blueprint('tourguide', __name__, template_folder='templates')

# Import the routes to register them with the blueprint
from . import routes

