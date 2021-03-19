from flask import Flask, render_template, request, send_file
from flask_socketio import SocketIO, emit

from images import Logos
from manager import FootballManager
from bundle import bundle

VERSION = 'v1.0.0 (03192021)'
LOGOS = Logos()
MANAGER = None # FootballManager

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

@app.route('/bar')
def bar():
    socketio.emit('display_mode', {'mode': 'live'})
    return 'OK'

@app.route('/1')
def one():
    global MANAGER
    state = MANAGER.console.export()
    state.update({
        'mode': 'summary',
        'tag': 'End of 1st'
    })
    socketio.emit('display_mode', state)
    return 'OK'

@app.route('/2')
def two():
    global MANAGER
    state = MANAGER.console.export()
    state.update({
        'mode': 'summary',
        'tag': 'Halftime'
    })
    socketio.emit('display_mode', state)
    return 'OK'

@app.route('/3')
def three():
    global MANAGER
    state = MANAGER.console.export()
    state.update({
        'mode': 'summary',
        'tag': 'End of 3rd'
    })
    socketio.emit('display_mode', state)
    return 'OK'

@app.route('/4')
def four():
    global MANAGER
    state = MANAGER.console.export()
    state.update({
        'mode': 'summary',
        'tag': 'Final'
    })
    socketio.emit('display_mode', state)
    return 'OK'

@app.route('/0')
def zero():
    global MANAGER
    state = MANAGER.console.export()
    state.update({
        'mode': 'summary',
        'tag': 'Starting Soon'
    })
    socketio.emit('display_mode', state)
    return 'OK'

@app.route('/admin')
def admin():
    return app.send_static_file("admin.html")

if __name__ == '__main__':
    bundle(app)
    socketio.run(app, port=5000)