import pymysql

conn = pymysql.connect(
    host='medingen-mysql-db-new.czes2c8i214u.ap-south-1.rds.amazonaws.com',
    user='admin',
    password='Medingen#2025!',
    db='medingen_db',
    cursorclass=pymysql.cursors.DictCursor
)

try:
    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT p.name, p.product_name_url, p.composition, c.description_url, c.product_description 
            FROM Products p 
            LEFT JOIN composition_code c ON p.composition_code = c.composition_code 
            WHERE p.product_name_url = 'daparest-10mg'
        """)
        r = cursor.fetchone()
        if r:
            print(f"Name: {r['name']}")
            print(f"URL: {r['product_name_url']}")
            print(f"Composition: {r['composition']}")
            print(f"Description URL: {r['description_url']}")
            print(f"Product Description: {r['product_description']}")
        else:
            print("Product not found.")
finally:
    conn.close()
