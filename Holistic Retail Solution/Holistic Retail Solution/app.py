from flask import Flask, render_template, request, abort, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime, timedelta, date
import json
import sqlite3

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///holistic_retail.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your-secret-key-here'  # Required for flash messages

db = SQLAlchemy(app)

def check_and_fix_database_schema():
    """Check if database schema matches current models and fix if needed"""
    try:
        # Check if supplier table has email and phone columns
        with sqlite3.connect('instance/holistic_retail.db') as conn:
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(supplier)")
            columns = [column[1] for column in cursor.fetchall()]

            if 'email' not in columns or 'phone' not in columns:
                print("Database schema mismatch detected. Recreating database...")
                return False
        return True
    except sqlite3.OperationalError as e:
        if "database is locked" in str(e).lower():
            print("Database is currently in use. Continuing with existing database.")
            return True  # Continue with existing DB
        elif "no such table" in str(e).lower():
            print("Database table missing. Recreating database...")
            return False
        else:
            print(f"Database operational error: {e}")
            return False
    except Exception as e:
        print(f"Error checking database schema: {e}")
        return False

def recreate_database():
    """Drop all tables and recreate them with current schema"""
    try:
        with app.app_context():
            print("Dropping all existing tables...")
            db.drop_all()
            print("Creating new database with current schema...")
            db.create_all()
            return True
    except Exception as e:
        print(f"Error recreating database: {e}")
        return False

def add_missing_columns():
    """Try to add missing columns to existing tables"""
    try:
        with sqlite3.connect('instance/holistic_retail.db') as conn:
            cursor = conn.cursor()

            # Check if email column exists in supplier table
            cursor.execute("PRAGMA table_info(supplier)")
            columns = [column[1] for column in cursor.fetchall()]

            if 'email' not in columns:
                print("Adding email column to supplier table...")
                cursor.execute("ALTER TABLE supplier ADD COLUMN email VARCHAR(120)")

            if 'phone' not in columns:
                print("Adding phone column to supplier table...")
                cursor.execute("ALTER TABLE supplier ADD COLUMN phone VARCHAR(20)")

            conn.commit()
            print("Missing columns added successfully!")
            return True
    except Exception as e:
        print(f"Error adding missing columns: {e}")
        return False

# Models
class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    contact_info = db.Column(db.String(200))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    products = db.relationship('Inventory', backref='supplier', lazy=True)
    contracts = db.relationship('Contract', backref='supplier', lazy=True)

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    barcode = db.Column(db.String(50), unique=True)
    quantity = db.Column(db.Integer, default=0)
    price = db.Column(db.Float, nullable=False)
    cost_price = db.Column(db.Float, nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'))
    department = db.Column(db.String(50))
    unit_of_measure = db.Column(db.String(20))
    min_stock_level = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(200))

class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(80))
    contact_info = db.Column(db.String(200))
    pay = db.Column(db.Float)
    pay_type = db.Column(db.String(20)) # 'Salary' or 'Hourly'
    address = db.Column(db.String(200))
    dob = db.Column(db.String(20)) # Date of birth as string for simplicity
    hire_date = db.Column(db.String(20)) # Hire date as string for simplicity

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

class WorkHour(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    hours_worked = db.Column(db.Float, nullable=False)
    staff = db.relationship('Staff', backref='work_hours')

class Payroll(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    pay_date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    staff = db.relationship('Staff', backref='payrolls')

class Contract(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    contract_number = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    terms = db.Column(db.Text)
    status = db.Column(db.String(20), default='Active')  # Active, Expired, Terminated

class PriceList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    effective_date = db.Column(db.Date, nullable=False)
    supplier = db.relationship('Supplier')
    inventory = db.relationship('Inventory')

# Routes
@app.route('/')
def home():
    return render_template('home.html')

# Inventory Module
@app.route('/inventory')
def inventory():
    return render_template('inventory/index.html')

@app.route('/inventory/reports')
def inventory_reports():
    inventory_items = Inventory.query.all()
    return render_template('inventory/reports.html', inventory_items=inventory_items)

@app.route('/inventory/schedule')
def inventory_schedule():
    return render_template('inventory/schedule.html')

@app.route('/inventory/scan')
def inventory_scan():
    return render_template('inventory/scan.html')

@app.route('/api/inventory/scan', methods=['POST'])
def scan_barcode():
    data = request.get_json()
    barcode = data.get('barcode')

    # Check if item exists
    item = Inventory.query.filter_by(barcode=barcode).first()

    if item:
        return jsonify({
            'found': True,
            'item': {
                'id': item.id,
                'name': item.name,
                'supplier': item.supplier.name if item.supplier else 'Unknown',
                'quantity': item.quantity,
                'price': item.price,
                'cost_price': item.cost_price,
                'department': item.department,
                'unit_of_measure': item.unit_of_measure,
                'image_url': item.image_url
            }
        })
    else:
        return jsonify({'found': False})

@app.route('/api/inventory/add', methods=['POST'])
def add_inventory_item():
    data = request.get_json()

    # Check if barcode already exists
    existing_item = Inventory.query.filter_by(barcode=data['barcode']).first()
    if existing_item:
        return jsonify({'success': False, 'error': 'Barcode already exists'})

    # Find or create supplier
    supplier_name = data.get('supplier_id', 'Unknown Supplier')
    supplier = Supplier.query.filter_by(name=supplier_name).first()
    if not supplier:
        supplier = Supplier(name=supplier_name, contact_info=f"{supplier_name} Contact")
        db.session.add(supplier)
        db.session.flush()  # Get the ID

    new_item = Inventory(
        name=data['name'],
        barcode=data['barcode'],
        supplier_id=supplier.id,
        department=data.get('department'),
        unit_of_measure=data.get('unit_of_measure'),
        price=float(data.get('price', 0)),
        cost_price=float(data.get('cost_price', 0)),
        quantity=int(data.get('quantity', 0))
    )

    db.session.add(new_item)
    db.session.commit()

    return jsonify({'success': True, 'item_id': new_item.id})

@app.route('/api/inventory/update-quantity', methods=['POST'])
def update_inventory_quantity():
    data = request.get_json()
    item_id = data.get('item_id')
    quantity_change = data.get('quantity_change', 0)

    item = Inventory.query.get(item_id)
    if item:
        item.quantity = max(0, item.quantity + quantity_change)
        db.session.commit()
        return jsonify({'success': True, 'new_quantity': item.quantity})

    return jsonify({'success': False, 'error': 'Item not found'})

@app.route('/api/inventory/bulk-update', methods=['POST'])
def bulk_update_inventory():
    data = request.get_json()
    items = data.get('items', [])

    updated_items = []
    for item_data in items:
        item = Inventory.query.get(item_data['id'])
        if item:
            item.quantity = max(0, item.quantity + item_data.get('quantity_change', 0))
            updated_items.append({
                'id': item.id,
                'name': item.name,
                'new_quantity': item.quantity
            })

    db.session.commit()
    return jsonify({'success': True, 'updated_items': updated_items})

@app.route('/api/inventory/status')
def inventory_status():
    """Debug route to check current inventory status"""
    total_items = Inventory.query.count()
    low_stock_items = Inventory.query.filter(Inventory.quantity <= Inventory.min_stock_level).count()
    out_of_stock_items = Inventory.query.filter(Inventory.quantity == 0).count()

    sample_items = Inventory.query.limit(5).all()
    sample_data = []
    for item in sample_items:
        sample_data.append({
            'id': item.id,
            'name': item.name,
            'barcode': item.barcode,
            'quantity': item.quantity,
            'price': item.price,
            'supplier': item.supplier.name if item.supplier else 'Unknown'
        })

    return jsonify({
        'total_items': total_items,
        'low_stock_items': low_stock_items,
        'out_of_stock_items': out_of_stock_items,
        'sample_items': sample_data
    })

# Human Resources Module
@app.route('/hr')
def hr():
    return render_template('hr/index.html')

@app.route('/hr/staff')
def hr_staff():
    staff_list = Staff.query.all()
    if not staff_list:
        # Add 4 fictional staff with detailed info
        staff_data = [
            Staff(name="Alice Johnson", role="Store Manager", contact_info="alice.johnson@email.com, 555-1234", pay=65000, pay_type="Salary", address="123 Main St, Springfield", dob="1985-04-12", hire_date="2015-06-01"),
            Staff(name="Bob Smith", role="Cashier", contact_info="bob.smith@email.com, 555-5678", pay=15.50, pay_type="Hourly", address="456 Oak Ave, Springfield", dob="1992-09-23", hire_date="2019-03-15"),
            Staff(name="Clara Lee", role="Inventory Specialist", contact_info="clara.lee@email.com, 555-8765", pay=18.75, pay_type="Hourly", address="789 Pine Rd, Springfield", dob="1988-12-05", hire_date="2017-11-20"),
            Staff(name="David Kim", role="Sales Associate", contact_info="david.kim@email.com, 555-4321", pay=32000, pay_type="Salary", address="321 Maple St, Springfield", dob="1995-07-30", hire_date="2021-01-10"),
        ]
        db.session.bulk_save_objects(staff_data)
        db.session.commit()
        staff_list = Staff.query.all()
    return render_template('hr/staff.html', staff=staff_list)

@app.route('/hr/payroll')
def hr_payroll():
    payrolls = Payroll.query.order_by(Payroll.pay_date.desc()).all()
    return render_template('hr/payroll.html', payrolls=payrolls)

@app.route('/hr/timesheets')
def hr_timesheets():
    work_hours = WorkHour.query.order_by(WorkHour.date.desc()).all()
    return render_template('hr/timesheets.html', work_hours=work_hours)

@app.route('/staff/<int:staff_id>')
def staff_profile(staff_id):
    staff_member = Staff.query.get_or_404(staff_id)
    # Calculate current week (Monday-Sunday)
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)
    week_hours = WorkHour.query.filter(
        WorkHour.staff_id == staff_id,
        WorkHour.date >= start_of_week,
        WorkHour.date <= end_of_week
    ).all()
    # Get all payroll records for this staff
    payrolls = Payroll.query.filter_by(staff_id=staff_id).order_by(Payroll.pay_date.desc()).all()
    return render_template('staff_profile.html', staff=staff_member, week_hours=week_hours, start_of_week=start_of_week, end_of_week=end_of_week, payrolls=payrolls, timedelta=timedelta)

# Order Schedule Module
@app.route('/orders')
def orders():
    return render_template('orders/index.html')

@app.route('/orders/suppliers')
def order_suppliers():
    suppliers = Supplier.query.all()
    return render_template('orders/suppliers.html', suppliers=suppliers)

@app.route('/orders/prices')
def order_prices():
    price_lists = PriceList.query.all()
    return render_template('orders/prices.html', price_lists=price_lists)

@app.route('/orders/contracts')
def order_contracts():
    contracts = Contract.query.all()
    return render_template('orders/contracts.html', contracts=contracts)

# Supplier Management Module
@app.route('/suppliers')
def suppliers():
    suppliers = Supplier.query.all()
    return render_template('suppliers/index.html', suppliers=suppliers)

# Revenue Management Module
@app.route('/revenue')
def revenue():
    return render_template('revenue/index.html')

@app.route('/revenue/margin')
def revenue_margin():
    # Calculate margins for all inventory items
    inventory_items = Inventory.query.all()
    margins = []
    for item in inventory_items:
        if item.price > 0 and item.cost_price > 0:
            margin = ((item.price - item.cost_price) / item.price) * 100
            margins.append({
                'item': item,
                'margin_percentage': round(margin, 2),
                'margin_amount': round(item.price - item.cost_price, 2)
            })
    return render_template('revenue/margin.html', margins=margins)

@app.route('/revenue/reports')
def revenue_reports():
    sales = Sale.query.order_by(Sale.date.desc()).all()
    return render_template('revenue/reports.html', sales=sales)

if __name__ == '__main__':
    # Check if database exists and has correct schema
    db_exists = os.path.exists('instance/holistic_retail.db')
    schema_valid = False

    if db_exists:
        schema_valid = check_and_fix_database_schema()

    # If database doesn't exist or schema is invalid, recreate it
    if not db_exists or not schema_valid:
        db_removed = False
        if db_exists:
            print("Removing old database file...")
            try:
                os.remove('instance/holistic_retail.db')
                db_removed = True
            except PermissionError:
                print("Warning: Could not remove database file (it may be in use).")
                print("Attempting to add missing columns to existing database...")
                if add_missing_columns():
                    schema_valid = True
                else:
                    print("Please stop any running Flask instances and restart the application.")
                    print("The application will continue with the existing database.")
                    schema_valid = True  # Force it to continue with existing DB
            except Exception as e:
                print(f"Error removing database file: {e}")
                print("Attempting to add missing columns to existing database...")
                if add_missing_columns():
                    schema_valid = True
                else:
                    schema_valid = True  # Force it to continue with existing DB

        # Only create new database if we successfully removed the old one or it didn't exist
        if not db_exists or (db_removed and schema_valid == False):
            if recreate_database():
                print("Database recreated successfully!")
            else:
                print("Failed to recreate database. Continuing with existing database.")
                schema_valid = True

            # Add sample data within app context
            with app.app_context():
                # Add sample suppliers only if table is empty
                supplier_count = Supplier.query.count()
                if supplier_count == 0:
                    try:
                        suppliers_data = [
                            Supplier(name="Coca-Cola Company", contact_info="1-800-GET-COKE", email="orders@coca-cola.com", phone="1-800-438-2653", address="1 Coca-Cola Plaza, Atlanta, GA 30313"),
                            Supplier(name="PepsiCo", contact_info="1-800-433-2652", email="orders@pepsico.com", phone="1-800-433-2652", address="700 Anderson Hill Road, Purchase, NY 10577"),
                            Supplier(name="Nestlé", contact_info="1-800-387-4636", email="orders@nestle.com", phone="1-800-387-4636", address="800 N Brand Blvd, Glendale, CA 91203"),
                            Supplier(name="Kraft Heinz", contact_info="1-800-323-0768", email="orders@kraftheinz.com", phone="1-800-323-0768", address="200 E Randolph St, Chicago, IL 60601"),
                            Supplier(name="General Mills", contact_info="1-800-328-1140", email="orders@generalmills.com", phone="1-800-328-1140", address="Number One General Mills Blvd, Minneapolis, MN 55426")
                        ]
                        db.session.bulk_save_objects(suppliers_data)
                        db.session.commit()
                        print("Sample suppliers added successfully!")
                    except Exception as e:
                        print(f"Error adding sample suppliers: {e}")
                        db.session.rollback()
                else:
                    print(f"Supplier table already has {supplier_count} records. Skipping sample data.")

                # Add sample inventory items only if table is empty
                inventory_count = Inventory.query.count()
                if inventory_count == 0:
                    try:
                        inventory_data = [
                            # Soft Drinks
                            Inventory(name="Coca-Cola Classic 12oz Can", barcode="049000006000", quantity=150, price=1.99, cost_price=0.80, supplier_id=1, department="Beverages", unit_of_measure="pcs", min_stock_level=50),
                            Inventory(name="Pepsi Cola 12oz Can", barcode="012000001000", quantity=120, price=1.89, cost_price=0.75, supplier_id=2, department="Beverages", unit_of_measure="pcs", min_stock_level=40),
                            Inventory(name="Sprite 12oz Can", barcode="049000006001", quantity=80, price=1.99, cost_price=0.80, supplier_id=1, department="Beverages", unit_of_measure="pcs", min_stock_level=30),
                            Inventory(name="Mountain Dew 12oz Can", barcode="012000001001", quantity=95, price=1.89, cost_price=0.75, supplier_id=2, department="Beverages", unit_of_measure="pcs", min_stock_level=35),

                            # Tobacco Products
                            Inventory(name="Marlboro Red 20pk", barcode="012000000123", quantity=45, price=8.99, cost_price=6.50, supplier_id=3, department="Tobacco", unit_of_measure="pcs", min_stock_level=20),
                            Inventory(name="Du Maurier King Size 20pk", barcode="012000000124", quantity=38, price=9.49, cost_price=7.00, supplier_id=3, department="Tobacco", unit_of_measure="pcs", min_stock_level=15),
                            Inventory(name="Camel Blue 20pk", barcode="012000000125", quantity=52, price=8.79, cost_price=6.30, supplier_id=3, department="Tobacco", unit_of_measure="pcs", min_stock_level=25),

                            # Lottery Tickets
                            Inventory(name="OLG Lotto 6/49", barcode="012000000200", quantity=200, price=3.00, cost_price=2.10, supplier_id=4, department="Lottery", unit_of_measure="pcs", min_stock_level=100),
                            Inventory(name="OLG Lotto Max", barcode="012000000201", quantity=180, price=5.00, cost_price=3.50, supplier_id=4, department="Lottery", unit_of_measure="pcs", min_stock_level=90),
                            Inventory(name="OLG Daily Grand", barcode="012000000202", quantity=150, price=3.00, cost_price=2.10, supplier_id=4, department="Lottery", unit_of_measure="pcs", min_stock_level=75),

                            # Snacks
                            Inventory(name="Doritos Nacho Cheese 9oz", barcode="028400090000", quantity=75, price=4.49, cost_price=2.80, supplier_id=2, department="Snacks", unit_of_measure="pcs", min_stock_level=30),
                            Inventory(name="Lay's Classic Potato Chips 8oz", barcode="028400090001", quantity=60, price=4.29, cost_price=2.70, supplier_id=2, department="Snacks", unit_of_measure="pcs", min_stock_level=25),
                            Inventory(name="Cheetos Crunchy 8.5oz", barcode="028400090002", quantity=85, price=4.49, cost_price=2.80, supplier_id=2, department="Snacks", unit_of_measure="pcs", min_stock_level=35),

                            # Candy
                            Inventory(name="Snickers Bar 2.07oz", barcode="040000000000", quantity=120, price=1.49, cost_price=0.90, supplier_id=1, department="Candy", unit_of_measure="pcs", min_stock_level=50),
                            Inventory(name="M&M's Milk Chocolate 1.69oz", barcode="040000000001", quantity=95, price=1.29, cost_price=0.80, supplier_id=1, department="Candy", unit_of_measure="pcs", min_stock_level=40),
                            Inventory(name="KitKat 4-Finger Bar 1.5oz", barcode="040000000002", quantity=110, price=1.39, cost_price=0.85, supplier_id=1, department="Candy", unit_of_measure="pcs", min_stock_level=45),

                            # Low Stock Items (for testing alerts)
                            Inventory(name="Rare Energy Drink", barcode="012000000999", quantity=5, price=2.99, cost_price=1.50, supplier_id=5, department="Beverages", unit_of_measure="pcs", min_stock_level=10),
                            Inventory(name="Limited Edition Chips", barcode="012000000998", quantity=3, price=5.99, cost_price=3.00, supplier_id=5, department="Snacks", unit_of_measure="pcs", min_stock_level=15),
                        ]
                        db.session.bulk_save_objects(inventory_data)
                        db.session.commit()
                        print("Sample inventory data added successfully!")
                    except Exception as e:
                        print(f"Error adding sample inventory data: {e}")
                        db.session.rollback()
                else:
                    print(f"Inventory table already has {inventory_count} records. Skipping sample data.")

                print("Database initialization completed!")
    else:
        # Database exists and schema is valid, check if we need to add sample data
        with app.app_context():
            try:
                # Check if inventory table is empty
                inventory_count = Inventory.query.count()
                if inventory_count == 0:
                    print("Adding sample inventory data...")

                    # Check if suppliers exist, if not add them
                    supplier_count = Supplier.query.count()
                    if supplier_count == 0:
                        try:
                            suppliers_data = [
                                Supplier(name="Coca-Cola Company", contact_info="1-800-GET-COKE", email="orders@coca-cola.com", phone="1-800-438-2653", address="1 Coca-Cola Plaza, Atlanta, GA 30313"),
                                Supplier(name="PepsiCo", contact_info="1-800-433-2652", email="orders@pepsico.com", phone="1-800-433-2652", address="700 Anderson Hill Road, Purchase, NY 10577"),
                                Supplier(name="Nestlé", contact_info="1-800-387-4636", email="orders@nestle.com", phone="1-800-387-4636", address="800 N Brand Blvd, Glendale, CA 91203"),
                                Supplier(name="Kraft Heinz", contact_info="1-800-323-0768", email="orders@kraftheinz.com", phone="1-800-323-0768", address="200 E Randolph St, Chicago, IL 60601"),
                                Supplier(name="General Mills", contact_info="1-800-328-1140", email="orders@generalmills.com", phone="1-800-328-1140", address="Number One General Mills Blvd, Minneapolis, MN 55426")
                            ]
                            db.session.bulk_save_objects(suppliers_data)
                            db.session.commit()
                            print("Sample suppliers added successfully!")
                        except Exception as e:
                            print(f"Error adding sample suppliers: {e}")
                            db.session.rollback()

                    # Add sample inventory items
                    try:
                        inventory_data = [
                            # Soft Drinks
                            Inventory(name="Coca-Cola Classic 12oz Can", barcode="049000006000", quantity=150, price=1.99, cost_price=0.80, supplier_id=1, department="Beverages", unit_of_measure="pcs", min_stock_level=50),
                            Inventory(name="Pepsi Cola 12oz Can", barcode="012000001000", quantity=120, price=1.89, cost_price=0.75, supplier_id=2, department="Beverages", unit_of_measure="pcs", min_stock_level=40),
                            Inventory(name="Sprite 12oz Can", barcode="049000006001", quantity=80, price=1.99, cost_price=0.80, supplier_id=1, department="Beverages", unit_of_measure="pcs", min_stock_level=30),
                            Inventory(name="Mountain Dew 12oz Can", barcode="012000001001", quantity=95, price=1.89, cost_price=0.75, supplier_id=2, department="Beverages", unit_of_measure="pcs", min_stock_level=35),

                            # Tobacco Products
                            Inventory(name="Marlboro Red 20pk", barcode="012000000123", quantity=45, price=8.99, cost_price=6.50, supplier_id=3, department="Tobacco", unit_of_measure="pcs", min_stock_level=20),
                            Inventory(name="Du Maurier King Size 20pk", barcode="012000000124", quantity=38, price=9.49, cost_price=7.00, supplier_id=3, department="Tobacco", unit_of_measure="pcs", min_stock_level=15),
                            Inventory(name="Camel Blue 20pk", barcode="012000000125", quantity=52, price=8.79, cost_price=6.30, supplier_id=3, department="Tobacco", unit_of_measure="pcs", min_stock_level=25),

                            # Lottery Tickets
                            Inventory(name="OLG Lotto 6/49", barcode="012000000200", quantity=200, price=3.00, cost_price=2.10, supplier_id=4, department="Lottery", unit_of_measure="pcs", min_stock_level=100),
                            Inventory(name="OLG Lotto Max", barcode="012000000201", quantity=180, price=5.00, cost_price=3.50, supplier_id=4, department="Lottery", unit_of_measure="pcs", min_stock_level=90),
                            Inventory(name="OLG Daily Grand", barcode="012000000202", quantity=150, price=3.00, cost_price=2.10, supplier_id=4, department="Lottery", unit_of_measure="pcs", min_stock_level=75),

                            # Snacks
                            Inventory(name="Doritos Nacho Cheese 9oz", barcode="028400090000", quantity=75, price=4.49, cost_price=2.80, supplier_id=2, department="Snacks", unit_of_measure="pcs", min_stock_level=30),
                            Inventory(name="Lay's Classic Potato Chips 8oz", barcode="028400090001", quantity=60, price=4.29, cost_price=2.70, supplier_id=2, department="Snacks", unit_of_measure="pcs", min_stock_level=25),
                            Inventory(name="Cheetos Crunchy 8.5oz", barcode="028400090002", quantity=85, price=4.49, cost_price=2.80, supplier_id=2, department="Snacks", unit_of_measure="pcs", min_stock_level=35),

                            # Candy
                            Inventory(name="Snickers Bar 2.07oz", barcode="040000000000", quantity=120, price=1.49, cost_price=0.90, supplier_id=1, department="Candy", unit_of_measure="pcs", min_stock_level=50),
                            Inventory(name="M&M's Milk Chocolate 1.69oz", barcode="040000000001", quantity=95, price=1.29, cost_price=0.80, supplier_id=1, department="Candy", unit_of_measure="pcs", min_stock_level=40),
                            Inventory(name="KitKat 4-Finger Bar 1.5oz", barcode="040000000002", quantity=110, price=1.39, cost_price=0.85, supplier_id=1, department="Candy", unit_of_measure="pcs", min_stock_level=45),

                            # Low Stock Items (for testing alerts)
                            Inventory(name="Rare Energy Drink", barcode="012000000999", quantity=5, price=2.99, cost_price=1.50, supplier_id=5, department="Beverages", unit_of_measure="pcs", min_stock_level=10),
                            Inventory(name="Limited Edition Chips", barcode="012000000998", quantity=3, price=5.99, cost_price=3.00, supplier_id=5, department="Snacks", unit_of_measure="pcs", min_stock_level=15),
                        ]
                        db.session.bulk_save_objects(inventory_data)
                        db.session.commit()
                        print("Sample inventory data added successfully!")
                    except Exception as e:
                        print(f"Error adding sample inventory data: {e}")
                        db.session.rollback()
                else:
                    print(f"Database already contains {inventory_count} inventory items. Skipping sample data.")
            except Exception as e:
                print(f"Error checking database: {e}")

    app.run(debug=True)
