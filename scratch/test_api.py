import jwt
import requests

SECRET_KEY = 'skandagn-secret'
customer_id = 1

# Encode token
token = jwt.encode({'customer_id': customer_id}, SECRET_KEY, algorithm="HS256")
if isinstance(token, bytes):
    token = token.decode('utf-8')

print("Generated Token:", token)

# Call API
headers = {
    "Authorization": f"Bearer {token}"
}
url = "http://127.0.0.1:8001/api/get_profile"
try:
    response = requests.get(url, headers=headers)
    print("Status Code:", response.status_code)
    print("Response Data:", response.json())
except Exception as e:
    print("Error calling API:", e)
