from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import hashlib


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: Optional[str] = None
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    high_score: int = 0
    total_coins: int = 0
    levels_completed: int = 0

class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: Optional[str] = None
    high_score: int
    total_coins: int
    levels_completed: int
    created_at: datetime

class Score(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    username: str
    score: int
    level_reached: int
    coins_collected: int
    game_duration: int  # in seconds
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ScoreCreate(BaseModel):
    user_id: str
    username: str
    score: int
    level_reached: int
    coins_collected: int
    game_duration: int

class GameProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    current_level: int
    lives_remaining: int
    score: int
    coins: int
    power_ups: List[str] = []
    last_checkpoint: dict = {}
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class GameProgressCreate(BaseModel):
    user_id: str
    current_level: int
    lives_remaining: int
    score: int
    coins: int
    power_ups: List[str] = []
    last_checkpoint: dict = {}

class GameSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    is_active: bool = True

# Helper functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

async def get_user_by_id(user_id: str) -> Optional[User]:
    user_data = await db.users.find_one({"id": user_id})
    if user_data:
        return User(**user_data)
    return None

async def get_user_by_username(username: str) -> Optional[User]:
    user_data = await db.users.find_one({"username": username})
    if user_data:
        return User(**user_data)
    return None

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Mario Bros Game API"}

# User Authentication Routes
@api_router.post("/users", response_model=UserResponse)
async def create_user(user_data: UserCreate):
    # Check if username already exists
    existing_user = await get_user_by_username(user_data.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create new user
    user_dict = user_data.dict()
    user_dict["password_hash"] = hash_password(user_dict.pop("password"))
    user_obj = User(**user_dict)
    
    # Insert to database
    await db.users.insert_one(user_obj.dict())
    
    return UserResponse(**user_obj.dict())

@api_router.post("/auth/login")
async def login_user(login_data: UserLogin):
    user = await get_user_by_username(login_data.username)
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session token
    session_token = str(uuid.uuid4())
    expires_at = datetime.utcnow().replace(hour=23, minute=59, second=59)
    
    session = GameSession(
        user_id=user.id,
        session_token=session_token,
        expires_at=expires_at
    )
    
    await db.game_sessions.insert_one(session.dict())
    
    return {
        "message": "Login successful",
        "user": UserResponse(**user.dict()),
        "session_token": session_token
    }

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**user.dict())

# Score Management Routes
@api_router.post("/scores", response_model=Score)
async def create_score(score_data: ScoreCreate):
    # Verify user exists
    user = await get_user_by_id(score_data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create score record
    score_obj = Score(**score_data.dict())
    await db.scores.insert_one(score_obj.dict())
    
    # Update user's high score and stats
    update_data = {}
    if score_data.score > user.high_score:
        update_data["high_score"] = score_data.score
    
    update_data["total_coins"] = user.total_coins + score_data.coins_collected
    if score_data.level_reached > user.levels_completed:
        update_data["levels_completed"] = score_data.level_reached
    
    if update_data:
        await db.users.update_one(
            {"id": score_data.user_id},
            {"$set": update_data}
        )
    
    return score_obj

@api_router.get("/scores", response_model=List[Score])
async def get_leaderboard(limit: int = 10):
    scores = await db.scores.find().sort("score", -1).limit(limit).to_list(limit)
    return [Score(**score) for score in scores]

@api_router.get("/scores/user/{user_id}", response_model=List[Score])
async def get_user_scores(user_id: str, limit: int = 10):
    scores = await db.scores.find({"user_id": user_id}).sort("score", -1).limit(limit).to_list(limit)
    return [Score(**score) for score in scores]

# Game Progress Routes
@api_router.post("/progress", response_model=GameProgress)
async def save_game_progress(progress_data: GameProgressCreate):
    # Verify user exists
    user = await get_user_by_id(progress_data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if progress already exists
    existing_progress = await db.game_progress.find_one({"user_id": progress_data.user_id})
    
    if existing_progress:
        # Update existing progress
        progress_dict = progress_data.dict()
        progress_dict["updated_at"] = datetime.utcnow()
        await db.game_progress.update_one(
            {"user_id": progress_data.user_id},
            {"$set": progress_dict}
        )
        progress_obj = GameProgress(**{**existing_progress, **progress_dict})
    else:
        # Create new progress
        progress_obj = GameProgress(**progress_data.dict())
        await db.game_progress.insert_one(progress_obj.dict())
    
    return progress_obj

@api_router.get("/progress/{user_id}", response_model=GameProgress)
async def get_game_progress(user_id: str):
    progress_data = await db.game_progress.find_one({"user_id": user_id})
    if not progress_data:
        raise HTTPException(status_code=404, detail="No progress found for user")
    return GameProgress(**progress_data)

@api_router.delete("/progress/{user_id}")
async def delete_game_progress(user_id: str):
    result = await db.game_progress.delete_one({"user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No progress found for user")
    return {"message": "Progress deleted successfully"}

# Game Statistics Routes
@api_router.get("/stats/global")
async def get_global_stats():
    # Get total users
    total_users = await db.users.count_documents({})
    
    # Get total games played
    total_games = await db.scores.count_documents({})
    
    # Get highest score
    highest_score_doc = await db.scores.find_one({}, sort=[("score", -1)])
    highest_score = highest_score_doc["score"] if highest_score_doc else 0
    
    # Get most active player
    pipeline = [
        {"$group": {"_id": "$user_id", "games_played": {"$sum": 1}}},
        {"$sort": {"games_played": -1}},
        {"$limit": 1}
    ]
    most_active = await db.scores.aggregate(pipeline).to_list(1)
    
    most_active_user = None
    if most_active:
        user_id = most_active[0]["_id"]
        user = await get_user_by_id(user_id)
        if user:
            most_active_user = {
                "username": user.username,
                "games_played": most_active[0]["games_played"]
            }
    
    return {
        "total_users": total_users,
        "total_games": total_games,
        "highest_score": highest_score,
        "most_active_user": most_active_user
    }

# Health check route
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
