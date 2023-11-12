from flask import Flask, render_template, request, jsonify
import numpy as np
from openai import OpenAI
import requests
import json
from PIL import Image
from io import BytesIO
import os
from dotenv import load_dotenv
import ast
from instagrapi import Client
from instagrapi.types import Usertag, Location
from pathlib import Path
import requests



app = Flask(__name__)
load_dotenv()

@app.route('/health-check', methods = ['GET'])
def health_check_request(): 
    if request.method == "OPTIONS" or request.method == 'HEAD': 
        return json.dumps({"Message": "METHOD NOT ALLOWED"}), 405

    return json.dumps({"Status": "OK"}), 200


@app.route('/', methods = ['GET', 'POST'])
def home():
    return render_template('index.html')



@app.route('/generate', methods = ['GET', 'POST'])
def generate():
    return render_template('result.html')



@app.route('/instagram', methods = ['GET', 'POST'])
def instagram():
    if request.method == 'POST':
        print("I am here")
        username = os.getenv("user")
        password = os.getenv("password")

        data = request.json
        image_name = data.get('imageName')

        print(image_name)
        response = requests.get(image_name)

        if response.status_code == 200:
            with open('./static/downloaded_image.jpg', 'wb') as f:
                f.write(response.content)

        image = Image.open("./static/downloaded_image.jpg")
        image = image.convert("RGB")
        new_image = image.resize((1080, 1080))
        new_image.save("./static/downloaded_image.jpg")
        cl= Client()

        #Uncomment next line after sucessfully logging in for first time
        #cl.load_settings('./static/dump.json')
        cl.login(username, password)
        #cl.dump_settings("./static/dump.json")
        print("Logged in successfully")
        #user = cl.user_info_by_username(username)

        cl.photo_upload(
            path="./static/downloaded_image.jpg",
            caption = "Join us for an enchanting night of music, laughter, and festivities as we deck the halls with joy! Indulge in delicious treats, dance to your heart's content, and embrace the spirit of the holidays with loved ones. Don't miss out on this glamorous event! #ChristmasParty #CelebrateInStyle #MerryAndBright #WinterWonderland #JingleAllTheWay",
            location = Location(name="Canada", lat=44.631048, long=-63.579750),
            extra_data={
                "custom_accessibility_caption" : "alt text example",
            }
        )

        return 'Received image info successfully!'


if __name__ == '__main__':
    app.run(debug=True)