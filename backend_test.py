import requests
import json
import time
import random
from datetime import datetime
import uuid

# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1].strip('"\'')
            break

API_URL = f"{BACKEND_URL}/api"
print(f"Testing API at: {API_URL}")

# Test data
test_users = [
    {
        "username": f"mario_{int(time.time())}",
        "email": f"mario_{int(time.time())}@mushroom.kingdom",
        "password": "SuperMario123!"
    },
    {
        "username": f"luigi_{int(time.time())}",
        "email": f"luigi_{int(time.time())}@mushroom.kingdom",
        "password": "LuigiRules456!"
    }
]

# Test results
test_results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(name, passed, details=None):
    """Log test results"""
    status = "PASSED" if passed else "FAILED"
    print(f"[{status}] {name}")
    if details and not passed:
        print(f"  Details: {details}")
    
    test_results["tests"].append({
        "name": name,
        "passed": passed,
        "details": details
    })
    
    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{API_URL}/health")
        if response.status_code == 200 and response.json().get("status") == "healthy":
            log_test("Health Check", True, response.json())
            return True
        else:
            log_test("Health Check", False, f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("Health Check", False, f"Exception: {str(e)}")
        return False

def test_create_user(user_data):
    """Test user creation"""
    try:
        response = requests.post(f"{API_URL}/users", json=user_data)
        if response.status_code == 200:
            user = response.json()
            log_test(f"Create User - {user_data['username']}", True, user)
            return user
        else:
            log_test(f"Create User - {user_data['username']}", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test(f"Create User - {user_data['username']}", False, f"Exception: {str(e)}")
        return None

def test_duplicate_user(user_data):
    """Test creating a duplicate user (should fail)"""
    try:
        response = requests.post(f"{API_URL}/users", json=user_data)
        if response.status_code == 400 and "already exists" in response.text.lower():
            log_test(f"Duplicate User Check - {user_data['username']}", True, response.json())
            return True
        else:
            log_test(f"Duplicate User Check - {user_data['username']}", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test(f"Duplicate User Check - {user_data['username']}", False, f"Exception: {str(e)}")
        return False

def test_login(login_data):
    """Test user login"""
    try:
        response = requests.post(f"{API_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            login_response = response.json()
            log_test(f"Login User - {login_data['username']}", True, login_response)
            return login_response
        else:
            log_test(f"Login User - {login_data['username']}", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test(f"Login User - {login_data['username']}", False, f"Exception: {str(e)}")
        return None

def test_invalid_login(login_data):
    """Test invalid login credentials"""
    try:
        response = requests.post(f"{API_URL}/auth/login", json=login_data)
        if response.status_code == 401:
            log_test(f"Invalid Login Check - {login_data['username']}", True, response.json())
            return True
        else:
            log_test(f"Invalid Login Check - {login_data['username']}", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test(f"Invalid Login Check - {login_data['username']}", False, f"Exception: {str(e)}")
        return False

def test_get_user(user_id):
    """Test getting user details"""
    try:
        response = requests.get(f"{API_URL}/users/{user_id}")
        if response.status_code == 200:
            user = response.json()
            log_test(f"Get User - {user_id}", True, user)
            return user
        else:
            log_test(f"Get User - {user_id}", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test(f"Get User - {user_id}", False, f"Exception: {str(e)}")
        return None

def test_get_nonexistent_user():
    """Test getting a non-existent user"""
    fake_id = str(uuid.uuid4())
    try:
        response = requests.get(f"{API_URL}/users/{fake_id}")
        if response.status_code == 404:
            log_test("Get Non-existent User", True, response.json())
            return True
        else:
            log_test("Get Non-existent User", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("Get Non-existent User", False, f"Exception: {str(e)}")
        return False

def test_save_score(user_id, username):
    """Test saving a score"""
    score_data = {
        "user_id": user_id,
        "username": username,
        "score": random.randint(1000, 10000),
        "level_reached": random.randint(1, 8),
        "coins_collected": random.randint(10, 100),
        "game_duration": random.randint(60, 600)
    }
    
    try:
        response = requests.post(f"{API_URL}/scores", json=score_data)
        if response.status_code == 200:
            score = response.json()
            log_test(f"Save Score - {username}", True, score)
            return score
        else:
            log_test(f"Save Score - {username}", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test(f"Save Score - {username}", False, f"Exception: {str(e)}")
        return None

def test_save_score_invalid_user():
    """Test saving a score for an invalid user"""
    fake_id = str(uuid.uuid4())
    score_data = {
        "user_id": fake_id,
        "username": "fake_user",
        "score": 5000,
        "level_reached": 3,
        "coins_collected": 50,
        "game_duration": 300
    }
    
    try:
        response = requests.post(f"{API_URL}/scores", json=score_data)
        if response.status_code == 404:
            log_test("Save Score - Invalid User", True, response.json())
            return True
        else:
            log_test("Save Score - Invalid User", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("Save Score - Invalid User", False, f"Exception: {str(e)}")
        return False

def test_get_leaderboard():
    """Test getting the leaderboard"""
    try:
        response = requests.get(f"{API_URL}/scores")
        if response.status_code == 200:
            leaderboard = response.json()
            log_test("Get Leaderboard", True, leaderboard)
            return leaderboard
        else:
            log_test("Get Leaderboard", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test("Get Leaderboard", False, f"Exception: {str(e)}")
        return None

def test_get_user_scores(user_id, username):
    """Test getting scores for a specific user"""
    try:
        response = requests.get(f"{API_URL}/scores/user/{user_id}")
        if response.status_code == 200:
            scores = response.json()
            log_test(f"Get User Scores - {username}", True, scores)
            return scores
        else:
            log_test(f"Get User Scores - {username}", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test(f"Get User Scores - {username}", False, f"Exception: {str(e)}")
        return None

def test_save_progress(user_id, username):
    """Test saving game progress"""
    progress_data = {
        "user_id": user_id,
        "current_level": random.randint(1, 8),
        "lives_remaining": random.randint(1, 5),
        "score": random.randint(1000, 10000),
        "coins": random.randint(10, 100),
        "power_ups": ["mushroom", "fire_flower"] if random.random() > 0.5 else ["star"],
        "last_checkpoint": {"x": 100, "y": 200, "level": 2}
    }
    
    try:
        response = requests.post(f"{API_URL}/progress", json=progress_data)
        if response.status_code == 200:
            progress = response.json()
            log_test(f"Save Progress - {username}", True, progress)
            return progress
        else:
            log_test(f"Save Progress - {username}", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test(f"Save Progress - {username}", False, f"Exception: {str(e)}")
        return None

def test_get_progress(user_id, username):
    """Test getting game progress"""
    try:
        response = requests.get(f"{API_URL}/progress/{user_id}")
        if response.status_code == 200:
            progress = response.json()
            log_test(f"Get Progress - {username}", True, progress)
            return progress
        else:
            log_test(f"Get Progress - {username}", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test(f"Get Progress - {username}", False, f"Exception: {str(e)}")
        return None

def test_delete_progress(user_id, username):
    """Test deleting game progress"""
    try:
        response = requests.delete(f"{API_URL}/progress/{user_id}")
        if response.status_code == 200:
            result = response.json()
            log_test(f"Delete Progress - {username}", True, result)
            return result
        else:
            log_test(f"Delete Progress - {username}", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test(f"Delete Progress - {username}", False, f"Exception: {str(e)}")
        return None

def test_delete_nonexistent_progress():
    """Test deleting non-existent progress"""
    fake_id = str(uuid.uuid4())
    try:
        response = requests.delete(f"{API_URL}/progress/{fake_id}")
        if response.status_code == 404:
            log_test("Delete Non-existent Progress", True, response.json())
            return True
        else:
            log_test("Delete Non-existent Progress", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        log_test("Delete Non-existent Progress", False, f"Exception: {str(e)}")
        return False

def test_get_global_stats():
    """Test getting global stats"""
    try:
        response = requests.get(f"{API_URL}/stats/global")
        if response.status_code == 200:
            stats = response.json()
            log_test("Get Global Stats", True, stats)
            return stats
        else:
            log_test("Get Global Stats", False, 
                    f"Status code: {response.status_code}, Response: {response.text}")
            return None
    except Exception as e:
        log_test("Get Global Stats", False, f"Exception: {str(e)}")
        return None

def run_all_tests():
    """Run all tests in sequence"""
    print("\n===== STARTING MARIO BROS GAME API TESTS =====\n")
    
    # Test health check
    if not test_health_check():
        print("Health check failed. Aborting tests.")
        return
    
    # Test user creation and authentication
    user1 = test_create_user(test_users[0])
    if not user1:
        print("Failed to create first test user. Aborting tests.")
        return
    
    user2 = test_create_user(test_users[1])
    if not user2:
        print("Failed to create second test user. Continuing with one user.")
    
    # Test duplicate user
    test_duplicate_user(test_users[0])
    
    # Test login
    login1 = test_login({"username": test_users[0]["username"], "password": test_users[0]["password"]})
    if not login1:
        print("Failed to login first test user. Aborting tests.")
        return
    
    # Test invalid login
    test_invalid_login({"username": test_users[0]["username"], "password": "wrong_password"})
    
    # Test get user
    retrieved_user = test_get_user(user1["id"])
    if not retrieved_user:
        print("Failed to retrieve user. Aborting tests.")
        return
    
    # Test get non-existent user
    test_get_nonexistent_user()
    
    # Test save score
    score1 = test_save_score(user1["id"], user1["username"])
    if not score1:
        print("Failed to save score. Aborting tests.")
        return
    
    # Save another score for the same user
    score2 = test_save_score(user1["id"], user1["username"])
    
    # If we have a second user, save a score for them too
    if user2:
        score3 = test_save_score(user2["id"], user2["username"])
    
    # Test save score with invalid user
    test_save_score_invalid_user()
    
    # Test get leaderboard
    leaderboard = test_get_leaderboard()
    
    # Test get user scores
    user_scores = test_get_user_scores(user1["id"], user1["username"])
    
    # Test save progress
    progress = test_save_progress(user1["id"], user1["username"])
    if not progress:
        print("Failed to save progress. Aborting tests.")
        return
    
    # Test get progress
    retrieved_progress = test_get_progress(user1["id"], user1["username"])
    
    # Test global stats
    global_stats = test_get_global_stats()
    
    # Test delete progress
    delete_result = test_delete_progress(user1["id"], user1["username"])
    
    # Test delete non-existent progress
    test_delete_nonexistent_progress()
    
    # Print summary
    print("\n===== TEST SUMMARY =====")
    print(f"Total tests: {test_results['passed'] + test_results['failed']}")
    print(f"Passed: {test_results['passed']}")
    print(f"Failed: {test_results['failed']}")
    print("========================\n")

if __name__ == "__main__":
    run_all_tests()