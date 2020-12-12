import os
from tensorflow import keras
from flask import Flask, jsonify
from gevent.pywsgi import WSGIServer
import urllib.request

app = Flask(__name__)

@app.route("/")
def hello1():
	return jsonify({"Label":"Hello1"})

@app.route("/<urlImg>")
def hello(urlImg):
	# keras.backend.clear_session()
	model = keras.models.load_model('models/DenseNet201_160x160.h5')
	return jsonify({"Label":1})

if __name__ == '__main__':
	#app.run(debug=True)
    # Serve the app with gevent
    http_server = WSGIServer(('0.0.0.0', 5000), app)
    http_server.serve_forever()
