from fastapi import FastAPI,Request
from dotenv import load_dotenv
import os
# mongoDB랑 연결시 필요한 모듈
# motor 라이브러리에서 제공하는 MongoDB 비동기 클라이언트
# 비동기 드라이버
from motor.motor_asyncio import AsyncIOMotorClient
# 그냥 HTTP상태창?
from fastapi import HTTPException
# random
import random
# cors
from fastapi.middleware.cors import CORSMiddleware
# model 불어오기
from model.model import model_open, model_close
# Json
from fastapi.responses import JSONResponse

app = FastAPI()

# 허락한 ip 주소
# origins = [
#     "http://127.0.0.1:5501"
# ]

# cors
app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# .env 파일 로드
# ('../server/.env'): .env파일의 경로
load_dotenv('./.env')

# MongoDB 연결
MONGO_URI = os.getenv("DB_HOST")
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database('BalanceGame')

# 모든 문제 다 가져오기
# http://127.0.0.1:8000/question/getAll
@app.get("/question/getAll")
async def get_all():
    try:
        # table 연결
        collection = db["question"]

        result = await collection.find({}).to_list(length = None)

        # _id는 ProjectID 형식이라 str로 전환후 불어오기 가능
        for i in result:
            i['_id'] = str(i['_id'])

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"내부 서버 오류: {str(e)}")


# random 문제 나오기: http://127.0.0.1:8000/question/random
# _id지정시 특정 질문 가져오기: http://127.0.0.1:8000/question/{_id값}
@app.get("/question/{id}")
async def get_one(id: str):
    try:
        collection = db["question"]
        all_questions = await collection.find({}).to_list(length=None)

        if id == 'random':
            result = random.choice(all_questions)
            result['_id'] = str(result['_id'])
        else:
            result = [question for question in all_questions if str(question['_id']) == id]

            for i in result:
                i['_id'] = str(i['_id'])

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"내부 서버 오류: {str(e)}")

@app.post("/chat_no")
async def get_question(request: Request):
    try:
        data = await request.json()

        collection = db["question"]
        all_questions = await collection.find({}).to_list(length=None)

        result = [question for question in all_questions if str(question['_id']) == data['questionId']]

        for i in result:
            i['_id'] = str(i['_id'])

        result = model_open(data['input'], result[0]['keywords'])

        return JSONResponse({'prediction': result}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"내부 서버 오류: {str(e)}")
    
@app.post("/chat_ok")
async def get_question(request: Request):
    try:
        data = await request.json()

        collection = db["question"]
        all_questions = await collection.find({}).to_list(length=None)

        result = [question for question in all_questions if str(question['_id']) == data['questionId']]

        for i in result:
            i['_id'] = str(i['_id'])
        text = result[0]['keywords'] + ' ' + data['input']

        result = model_close(data['input'], result[0]['keywords'])
        # 반환된 값 보내기
        return JSONResponse({'prediction': result}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"내부 서버 오류: {str(e)}")
