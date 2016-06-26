from flask import Flask, jsonify, render_template, send_from_directory, request
from py2neo import Graph, Path

graph = Graph()

app = Flask(__name__, static_url_path='')


@app.route('/public/<path:path>')
def send_js(path):
    return send_from_directory('public', path)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/diagnose')
def get_likely_diagnose():
    symptoms = request.args.get('symptoms')
    print symptoms
    return jsonify({'code': 0, 'message': 'Success', 'results': [{'name': 'Malaria'}]})

@app.route('/api/diagnose', methods=['POST'])
def create_diagnose():
    data = request.get_json()
    graph.run("CREATE (d:Diagnose {name:'%s'}), %s " % (data.get('diagnose'), ','.join(["(s%d:Symptom{description:'%s'}), s%d-[r%d:IS_SYMPTOM_OF]->d" % (i, s, i, i) for i, s in enumerate(data.get('symptoms'), 1)])))
    return jsonify({'code': 0, 'message': 'Success', 'results': {}})


@app.route('/api/ping')
def ping():
    return jsonify({'code': 0, 'message': 'pong', 'results': {}})


if __name__ == '__main__':
    app.run()