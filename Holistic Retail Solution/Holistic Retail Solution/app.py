from flask import Flask, render_template, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask_dance.contrib.google import make_google_blueprint, google
import os

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///holistic_retail.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- Google OAuth Setup ---
# 1. Go to https://console.cloud.google.com/apis/credentials
# 2. Create OAuth 2.0 Client ID (Web application)
# 3. Set Authorized redirect URI to: http://localhost:5000/login/google/authorized
# 4. Set client_id and client_secret as environment variables:

google_bp = make_google_blueprint(
    client_id=os.environ.get('GOOGLE_OAUTH_CLIENT_ID'),
    client_secret=os.environ.get('GOOGLE_OAUTH_CLIENT_SECRET'),
    scope=["profile", "email"],
    redirect_url="/login/google/authorized"
)
app.register_blueprint(google_bp, url_prefix="/login")

# --- User Model ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True)
    name = db.Column(db.String(255))

# Models
class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    contact_info = db.Column(db.String(200))
    products = db.relationship('Inventory', backref='supplier', lazy=True)

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.Integer, default=0)
    price = db.Column(db.Float, nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'))

class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(80))
    contact_info = db.Column(db.String(200))

class Merchandising(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'))
    staff = db.relationship('Staff', backref='orders')
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'))
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    inventory = db.relationship('Inventory')

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    total = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime)
    order = db.relationship('Order')

class Accounting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200))
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime)
    type = db.Column(db.String(50))  # e.g., 'expense', 'income'

# --- Auth Helpers ---
def is_logged_in():
    return "google_oauth_token" in session

def get_current_user():
    if not is_logged_in():
        return None
    resp = google.get("/oauth2/v2/userinfo")
    if not resp.ok:
        return None
    info = resp.json()
    user = User.query.filter_by(google_id=info["id"]).first()
    if not user:
        user = User(google_id=info["id"], email=info["email"], name=info.get("name"))
        db.session.add(user)
        db.session.commit()
    return user

@app.route('/')
def home():
    if not is_logged_in():
        return redirect(url_for('google.login'))
    user = get_current_user()
    return render_template('home.html', user=user)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

if __name__ == '__main__':
    if not os.path.exists('holistic_retail.db'):
        with app.app_context():
            db.create_all()
    app.run(debug=True)
