from fastapi.testclient import TestClient
import main
from main import app

class MockUser:
    role = "admin"
    full_name = "Admin User"
    class MockBusiness:
        code = "TEST123"
    business = MockBusiness()

def mock_get_current_user(request, db):
    return MockUser()

main.get_current_user = mock_get_current_user

client = TestClient(app)

print("--- WITH ADMIN AUTH ---")
response = client.get("/staff", follow_redirects=False)
print("Status:", response.status_code)
print("Body:", response.text)
