import pymysql

try:
    connection = pymysql.connect(
        host='medingen-mysql-db-new.czes2c8i214u.ap-south-1.rds.amazonaws.com',
        user='admin',
        password='Medingen#2025!',
        db='medingen_db',
        cursorclass=pymysql.cursors.DictCursor
    )
    print("Database connection successful!")
    
    with connection.cursor() as cursor:
        cursor.execute("SELECT customer_id, customer_name, email, phonenumber FROM Customers LIMIT 10")
        rows = cursor.fetchall()
        print("\nCustomers:")
        for r in rows:
            print(r)
            
    connection.close()
except Exception as e:
    print("Error:", e)
