# Importe os módulos necessários
from flask import Flask, request, jsonify
import sqlite3

# Inicialize o aplicativo Flask
app = Flask(__name__)

# Defina a rota para inserir dados
@app.route('/insert', methods=['POST'])
def insert():
    data = request.get_json()
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("INSERT INTO table_name (column1, column2) VALUES (?, ?)", (data['value1'], data['value2']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Data inserted successfully'}), 201

# Defina a rota para listar todos os dados
@app.route('/list', methods=['GET'])
def list():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM table_name")
    data = c.fetchall()
    conn.close()
    return jsonify(data), 200

# Defina a rota para procurar por id
@app.route('/search/<int:id>', methods=['GET'])
def search(id):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM table_name WHERE id=?", (id,))
    data = c.fetchone()
    conn.close()
    return jsonify(data), 200 if data else 404

# Defina a rota para alterar dados por id
@app.route('/update/<int:id>', methods=['PUT'])
def update(id):
    data = request.get_json()
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("UPDATE table_name SET column1=?, column2=? WHERE id=?", (data['value1'], data['value2'], id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Data updated successfully'}), 200

# Defina a rota para apagar dados por id
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete(id):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("DELETE FROM table_name WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Data deleted successfully'}), 200

# Execute o aplicativo Flask
if __name__ == '__main__':
    app.run(debug=True)
