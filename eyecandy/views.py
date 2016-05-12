from eyecandy import app
from redis import Redis
import os
from flask import request, session, g, redirect, url_for, \
     abort, render_template, flash

redis = Redis(host='redis', port=6379)


@app.route('/')
def hello():
    # redis.incr('hits')
    return render_template('index.html.j2')


@app.route('/v0.1/stimulus')
def stimulus():
    return app.send_static_file('eyecandy.html') 

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
