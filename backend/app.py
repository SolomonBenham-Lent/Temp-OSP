from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

@app.route("/api/users", methods=["GET"])
def get_users():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="osp-temp-db"
    )
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users")

    users = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(users)

@app.route("/api/users", methods=["POST"])
def add_users():
    try:
        data = request.json

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        print(f"Received: {name}, {password}")

        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="osp-temp-db"
        )

        cursor = connection.cursor(dictionary=True)

        check_email_sql = "SELECT * FROM users WHERE email = %s"
        cursor.execute(check_email_sql, (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            cursor.close()
            connection.close()
            return jsonify({"error": "Email already exists"}), 400

        sql = "INSERT INTO USERS (name, email, password) VALUES (%s, %s, %s) "

        cursor.execute(sql, (name, email, password))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "User added successfully"}), 201


    except Exception as e:
        print("POST Error:", e) 
        return jsonify({"error": str(e)}), 500

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.json

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        connection = mysql.connector.connect(
            host="localhost",  
            user="root",
            password="root",
            database="osp-temp-db"
        )

        cursor = connection.cursor(dictionary=True)

        sql = "SELECT * FROM users WHERE name = %s AND password = %s"
        cursor.execute(sql, (name, password))
        user = cursor.fetchone()

        cursor.close()
        connection.close()

        if user:
            return jsonify({"success": True, "user": user}), 200
        else:
            return jsonify({"success": False, "message": "Invalid email or password"}), 401
            

    except Exception as e:
        print("Login Error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/bookings", methods=["GET"])
def get_bookings():
    try:

        user_id = request.args.get("userId")

        connection = mysql.connector.connect(
            host="localhost",  
            user="root",
            password="root",
            database="osp-temp-db"
        )

        cursor = connection.cursor(dictionary=True)

        sql = "SELECT * FROM bookings WHERE userId = %s"
        cursor.execute(sql, (user_id,))
        rows = cursor.fetchall()


        bookings = []
        for i in rows:
            new_dict = {}
            for key, value in i.items():
                if isinstance(value, set):
                    # Convert the 'options' SET data type to a list e.g. {'option1', 'option2'} to "option1, option2"
                    new_dict[key] = ", ".join(value)
                elif hasattr(value, 'isoformat'): 
                    # Convert Datetime objects to a string
                    new_dict[key] = value.isoformat()
                else:
                    new_dict[key] = value
            bookings.append(new_dict)


        cursor.close()
        connection.close()

        return jsonify({"success": True, "bookings": bookings}), 200
            
    except Exception as e:
        print("booking Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/bookings", methods=["POST"])
def add_booking():
    try:
        data = request.json

        user_id = data.get("userId")
        schedule = data.get("schedule")
        option = data.get("option")  # Expecting a list of options
        message = data.get("message")
        address = data.get("address")

        connection = mysql.connector.connect(
            host="localhost",  
            user="root",
            password="root",
            database="osp-temp-db"
        )

        cursor = connection.cursor(dictionary=True)

        sql = "INSERT INTO bookings (userId, schedule, `option`, message, address) VALUES (%s, %s, %s, %s, %s)"
        option_set = []
        if option['option1']:
            option_set.append("option1")
        if option['option2']:
            option_set.append("option2")
        if option['option3']:
            option_set.append("option3")
        option_set = ",".join(option_set)
        cursor.execute(sql, (user_id, schedule, option_set, message, address))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "Booking added successfully"}), 201

    except Exception as e:
        print("Add Booking Error:", e) 
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)