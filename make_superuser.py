import sys
from sqlalchemy import text
import database
import models

def make_superuser(email_arg=None):
    db = database.SessionLocal()
    try:
        # Asegurar columna is_superuser
        try:
            db.execute(text("ALTER TABLE users ADD COLUMN is_superuser BOOLEAN DEFAULT FALSE"))
            db.commit()
        except Exception:
            db.rollback()

        if not email_arg:
            users = db.query(models.User).all()
            if not users:
                print("No hay usuarios registrados en la base de datos.")
                return
            print("\nUsuarios registrados en el sistema:")
            for u in users:
                su_flag = " [SUPERUSUARIO 👑]" if getattr(u, 'is_superuser', False) else ""
                print(f" - ID: {u.id} | Email: {u.email} | Rol real: {u.role}{su_flag}")
            
            target_email = input("\nIngresa el correo del usuario al que deseas darle rol de Superusuario: ").strip()
        else:
            target_email = email_arg.strip()

        user = db.query(models.User).filter(models.User.email == target_email).first()
        if not user:
            print(f"❌ Error: No se encontró ningún usuario con el correo '{target_email}'")
            return

        user.is_superuser = True
        db.commit()
        print(f"✅ ¡Éxito! El usuario '{user.email}' (Nombre: {user.full_name}) ahora es SUPERUSUARIO 👑.")
        print("Ahora podrás cambiar de rol (Admin, Manager, Empleado) dinámicamente desde el menú lateral.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error inesperado: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else None
    make_superuser(email)
