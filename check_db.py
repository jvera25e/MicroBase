import database
import models

db = next(database.get_db())

print("--- BUSINESSES ---")
businesses = db.query(models.Business).all()
for b in businesses:
    print(f"ID: {b.id}, Name: {b.name}, Code: {b.code}")

print("\n--- USERS ---")
users = db.query(models.User).all()
for u in users:
    print(f"ID: {u.id}, Email: {u.email}, Name: {u.full_name}, Role: {u.role}, Status: {u.status}, Business ID: {u.business_id}")
