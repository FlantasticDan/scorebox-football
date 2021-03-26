from flask import Flask, render_template, request, send_file
from flask_socketio import SocketIO, emit

from images import Logos
from manager import FootballManager
from bundle import bundle

VERSION = 'v2.0.0 (03262021)'
LOGOS = Logos()
MANAGER = None # type: FootballManager

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet', logger=False, engineio_logger=False)

@app.route('/setup')
def setup():
    return render_template('setup.html', version=VERSION)

@app.route('/init', methods=['POST'])
def initialize():
    global LOGOS
    global MANAGER
    setup = request.form
    MANAGER = FootballManager(**setup)
    files = request.files
    LOGOS.set_home(files['home_logo'].read(), files['home_logo'].filename)
    LOGOS.set_visitor(files['visitor_logo'].read(), files['visitor_logo'].filename)
    return 'OK'

@app.route('/home')
def home():
    global LOGOS
    output, mimetype = LOGOS.home()
    return send_file(output, mimetype=mimetype, as_attachment=False)

@app.route('/visitor')
def visitor():
    global LOGOS
    output, mimetype = LOGOS.visitor()
    return send_file(output, mimetype=mimetype, as_attachment=False)

@app.route('/overlay')
def overlay():
    global MANAGER
    if MANAGER:
        return render_template('overlay.html', **MANAGER.overlay_export())

@socketio.on('update')
def update(payload):
    return emit('update', payload, broadcast=True)

@app.route('/admin')
def admin():
    global MANAGER
    return render_template("admin.html", version=VERSION, **MANAGER.overlay_export())

@socketio.on('touchdown')
def touchdown(data):
    return emit('touchdown', data, broadcast=True)

@socketio.on('status-request')
def status_request(data):
    global MANAGER
    return emit('status', MANAGER.status_export())

@socketio.on('flag-status')
def flag_status(data):
    global MANAGER
    MANAGER.set_flag_status(data)
    return emit('status', MANAGER.status_export(), broadcast=True)

@socketio.on('flag-alert')
def flag_alert(payload):
    global MANAGER
    MANAGER.set_alert_visibility('off')
    socketio.emit('status', MANAGER.status_export(), broadcast=True)
    return emit('flag-alert', payload, broadcast=True)

@socketio.on('alert-mode-status')
def alert_mode_status(data):
    global MANAGER
    MANAGER.set_alert_mode(data)
    return emit('status', MANAGER.status_export(), broadcast=True)

@socketio.on('alert-visibility-status')
def alert_mode_status(data):
    global MANAGER
    MANAGER.set_alert_visibility(data)
    return emit('status', MANAGER.status_export(), broadcast=True)

@socketio.on('alert-text-status')
def alert_mode_status(data):
    global MANAGER
    MANAGER.set_alert_text(data)
    return emit('status', MANAGER.status_export(), broadcast=True)

@socketio.on('display-mode-status')
def display_mode(data):
    global MANAGER
    MANAGER.set_display_mode(data)
    return emit('status', MANAGER.status_export(), broadcast=True)

if __name__ == '__main__':
    bundle(app)
    socketio.run(app, port=5000)