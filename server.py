from flask import Flask, jsonify, request, send_from_directory, Response
from flask import render_template, json, url_for, flash, redirect, g, session
from hashlib import sha256
from os import path, stat
import sqlite3
import time

import configparser
from os import urandom
hash_func = sha256()

config = configparser.ConfigParser()
config_file = 'server_status.ini'
config.read(config_file)

app = Flask(__name__)
SESSION_TYPE = "redis"
PERMANENT_SESSION_LIFETIME = 1800

debug_login_bypass = 1

# Best if you don't do this with production code, but I am too lazy to not just put it here.
# Really, don't expose your salt like this
# If I was, like 10% less lazy I'd make this a GitHub secret.
# But I'm not.
sha_salt = "really_weak_and_exposed_secret_salt"
#What is ShaSalt?



# def check_valid_session():
#     try:
#         world_id = session['world_id']
#         print("SESSION VALID")
#         return world_id
#     except KeyError:
#         print("SESSION INVALID")
#         return None

# # Function source: https://flask.palletsprojects.com/en/2.0.x/patterns/sqlite3/
# def get_db():
#     db = getattr(g, '_database', None)
#     if db is None:
#         db = g._database = sqlite3.connect(db_file)
#     return db

# # Function source: https://flask.palletsprojects.com/en/2.0.x/patterns/sqlite3/
# @app.teardown_appcontext
# def close_connection(exception):
#     db = getattr(g, '_database', None)
#     if db is not None:
#         db.close()

# This is a stupid function because I need to speak a stupid language.
# Most browsers won't update files automatically as they're cached. Fine. 
# But I need to update my files a lot. So I need to put a v=1.1 on a file to make
# it update. Next time it needs to be v=1.2, etc. So this just adds some tiny value
# to the version of every file upon every access. This will only work a few quintillion
# times, so be gentle with it. 
def get_next_version():
    version = int(config['file_management']['curr_version'])
    version_string = str(version).rjust(15,'0')
    config.set('file_management', 'curr_version', str(version+1))
    with open(config_file, 'w') as f:    # save
        config.write(f)
    return version_string


@app.route('/assets/<path:path>')
def send_asset(path):
    return send_from_directory('static/assets', path)

@app.route('/')
def index_page():
    return render_template('index.html')

if __name__ == '__main__':
    # app.run(host='localhost', port=5000,ssl_context='adhoc')
    # app.config.update(SECRET_KEY=urandom(24))
    app.secret_key = urandom(24)

    app.jinja_env.globals.update(get_next_version=get_next_version)
    app.run(host="0.0.0.0", port=5000,debug=True)
    # Session(app)