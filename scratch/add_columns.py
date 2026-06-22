import pymysql

# Database configuration from app.py
MYSQL_HOST = 'medingen-mysql-db-new.czes2c8i214u.ap-south-1.rds.amazonaws.com'
MYSQL_USER = 'admin'
MYSQL_PASSWORD = 'Medingen#2025!'
MYSQL_DB = 'medingen_db'

def get_mysql_connection():
    return pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        db=MYSQL_DB,
        cursorclass=pymysql.cursors.DictCursor
    )

def add_columns():
    connection = get_mysql_connection()
    try:
        with connection.cursor() as cursor:
            print("Checking if columns exist...")
            cursor.execute("SHOW COLUMNS FROM Customers LIKE 'gender'")
            if not cursor.fetchone():
                print("Adding gender column...")
                cursor.execute("ALTER TABLE Customers ADD COLUMN gender VARCHAR(20) DEFAULT NULL")
            else:
                print("gender column already exists.")

            cursor.execute("SHOW COLUMNS FROM Customers LIKE 'blood_group'")
            if not cursor.fetchone():
                print("Adding blood_group column...")
                cursor.execute("ALTER TABLE Customers ADD COLUMN blood_group VARCHAR(20) DEFAULT NULL")
            else:
                print("blood_group column already exists.")

            connection.commit()
            print("Columns added successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        connection.close()

if __name__ == "__main__":
    add_columns()
