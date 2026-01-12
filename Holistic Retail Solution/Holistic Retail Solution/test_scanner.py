#!/usr/bin/env python3
"""
Test script for the Holistic Retail Solution Scanner
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_inventory_status():
    """Test the inventory status endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/inventory/status")
        if response.status_code == 200:
            data = response.json()
            print("✅ Inventory Status:")
            print(f"   Total Items: {data['total_items']}")
            print(f"   Low Stock Items: {data['low_stock_items']}")
            print(f"   Out of Stock Items: {data['out_of_stock_items']}")
            print("\n📦 Sample Items:")
            for item in data['sample_items']:
                print(f"   • {item['name']} (Barcode: {item['barcode']}) - Qty: {item['quantity']}")
            return True
        else:
            print(f"❌ Failed to get inventory status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing inventory status: {e}")
        return False

def test_barcode_scan(barcode):
    """Test scanning a specific barcode"""
    try:
        response = requests.post(
            f"{BASE_URL}/api/inventory/scan",
            json={"barcode": barcode},
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            data = response.json()
            if data['found']:
                item = data['item']
                print(f"✅ Found: {item['name']} (${item['price']}) - Qty: {item['quantity']}")
                return True
            else:
                print(f"❌ Barcode {barcode} not found in database")
                return False
        else:
            print(f"❌ Failed to scan barcode: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error scanning barcode: {e}")
        return False

def test_add_new_item():
    """Test adding a new item"""
    try:
        new_item = {
            "name": "Test Product",
            "barcode": "999999999999",
            "supplier_id": "Test Supplier",
            "unit_of_measure": "pcs",
            "department": "Test",
            "price": "9.99",
            "cost_price": "5.00",
            "quantity": "0"
        }

        response = requests.post(
            f"{BASE_URL}/api/inventory/add",
            json=new_item,
            headers={"Content-Type": "application/json"}
        )
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print(f"✅ Successfully added new item with ID: {data['item_id']}")
                return True
            else:
                print(f"❌ Failed to add item: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Failed to add item: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error adding item: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Holistic Retail Solution Scanner")
    print("=" * 50)

    # Test 1: Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Server is running")
        else:
            print(f"❌ Server returned status code: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        print("   Make sure the Flask app is running on http://localhost:5000")
        return

    print()

    # Test 2: Check inventory status
    test_inventory_status()
    print()

    # Test 3: Test sample barcodes
    print("🔍 Testing Sample Barcodes:")
    sample_barcodes = [
        "049000006000",  # Coca-Cola
        "012000001000",  # Pepsi
        "012000000123",  # Marlboro
        "028400090000",  # Doritos
        "040000000000"   # Snickers
    ]

    for barcode in sample_barcodes:
        test_barcode_scan(barcode)

    print()

    # Test 4: Test adding new item
    print("➕ Testing Add New Item:")
    test_add_new_item()

    print()
    print("🎉 Scanner testing complete!")
    print("\n📱 To test the web interface:")
    print("   1. Open http://localhost:5000 in your browser")
    print("   2. Go to Inventory → Start Scanning")
    print("   3. Try the sample barcodes above")
    print("   4. Or use the 'Test with Sample Barcode' button")

if __name__ == "__main__":
    main()
