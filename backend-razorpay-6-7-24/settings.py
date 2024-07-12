from flask import Flask,request,jsonify,make_response
from flask_cors import CORS,cross_origin

from datetime import datetime, timedelta
# from message91 import generate_otp
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSONB
from flask import Flask,json,Request,jsonify,request
from flask_cors import CORS
import random
import requests
import pytz
from sqlalchemy.sql import func
from dotenv import load_dotenv
import os
import logging
import razorpay
import uuid
from sqlalchemy import update
import time
print(int(time.time()))

load_dotenv()

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app,supports_credentials=True, origins=['*'])
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = True
app.config['CORS_HEADERS'] = 'Content-Type'
# config for file upload


app.config['UPLOAD_FOLDER'] = "uploads"
db = SQLAlchemy()


db.init_app(app)
with app.app_context():
    db.create_all()




