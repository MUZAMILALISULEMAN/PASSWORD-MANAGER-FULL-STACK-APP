# import yagmail
# import random 
# import os
# from pydantic import BaseModel
# class EmailRequest(BaseModel):
#     email:str
# def generateOTP():
#     otp = ''
#     for i in range(6):
#         otp+=str(chr(49+random.randint(0,8)))
#     return otp

# class PayLoad(BaseModel):
#     email:str
#     otp_code:str
#     password:str
#     name:str
    


# from fastapi import FastAPI,Depends
# from fastapi.middleware.cors import CORSMiddleware
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# from sqlalchemy import create_engine,Select,Update,Delete,Column,Integer,String,ForeignKey,DateTime,Boolean
# from sqlalchemy.orm import sessionmaker,declarative_base,Session
# from datetime import datetime, timedelta
# from sqlalchemy.exc import SQLAlchemyError

# engine = create_engine('mysql+pymysql://root:!%40%23muzzy2006@localhost/db')
# SESSION = sessionmaker(autocommit=False,autoflush=False,bind=engine)

# def GET_DB():
#     db = SESSION()
#     try:
#         yield db
#     finally: 
#         db.close()
    
# BASE_ENTITY = declarative_base()
# class USER(BASE_ENTITY):
#     __tablename__ = "user"
#     name = Column(String(50),nullable=False)
#     id = Column(Integer,primary_key=True)
#     email = Column(String(50),nullable=False,unique=True)
#     password = Column(String(50),nullable=False)
    
# class OTPRequest(BASE_ENTITY):
#     __tablename__ = "otp_requests"

#     id = Column(Integer, primary_key=True,autoincrement=True)
#     email = Column(String(255), nullable=False)
#     otp_code = Column(String(10), nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     expires_at = Column(DateTime, nullable=False)
#     is_verified = Column(Boolean, default=False)
#     is_active = Column(Boolean,default=True)
#     def is_expired(self):
#         return datetime.utcnow() > self.expires_at
    
    
# BASE_ENTITY.metadata.create_all(bind=engine)


# @app.post("/submit")
# def submit(data:EmailRequest,db:Session = Depends(GET_DB)):
    
#     message = "Something went wrong"
#     status = "success"
#     try:
#         # Deactivate any existing OTPs
#         stmt = Update(OTPRequest).where(OTPRequest.email == data.email).values(is_active=False)
#         db.execute(stmt)
#         db.commit()

#         # Generate new OTP
#         otpCode = generateOTP()
#         expires_at = datetime.utcnow() + timedelta(minutes=5)
#         payload = OTPRequest(email=data.email, otp_code=otpCode, expires_at=expires_at)
#         db.add(payload)
#         db.commit()

#         # Send OTP email
#         try:
#             postman = yagmail.SMTP(user="muzamil.ali1099@gmail.com", password="sbjdioujwpqsdzcl")
#             postman.send(
#                 to=data.email,
#                 subject="SecureAuth OTP Verification",
#                 contents=f"Your OTP is {otpCode}"
#             )
#         except Exception as e:
#             db.rollback()
#             message = f"Failed to send email: {str(e)}"
#             status = "error"
#             return message

#         message = f"OTP sent successfully to {data.email}"

#     except SQLAlchemyError as e:
#         db.rollback()
#         message = f"Database error: {str(e)}"
#         status = "error"

#     except Exception as e:
#         db.rollback()
#         message = f"Unexpected error: {str(e)}"
#         status = "error"

#     return {"status":status,"message":message}

# @app.post("/verify")
# def verify(data:PayLoad,db:Session = Depends(GET_DB)):
    
#     try:
#         stmt = Select(OTPRequest).where(
#             OTPRequest.email == data.email,
#             OTPRequest.otp_code == data.otp_code
#         ).order_by(OTPRequest.created_at.desc())

#         entry = db.execute(stmt).first()

#         if entry is None:
#             return {"status": "error","message": "no otp found"}

#         otp_entry = entry[0]

#         if not otp_entry.is_expired() and otp_entry.is_active:
        
#             db.add(USER(name=data.name,email=data.email,password=data.password))
#             db.commit()
#             return {"status": "success","message": "verified"}
        
        
        
        
#         else:
#             if otp_entry.is_active:
#                 otp_entry.is_active = False
#                 db.commit()
#             return {"status": "error"}

#     except SQLAlchemyError as e:
#         db.rollback()
#         return {"status": "error", "message": str(e)}

#     except Exception as e:
#         db.rollback()
#         return {"status": "error", "message": str(e)}
import asyncio
import time
import asyncio

async def main():
    await func()
    await func2()

async def func():
    print("START")
    await asyncio.sleep(1)
    print("DONE AFTER 1s")

async def func2():
    await asyncio.sleep(2)
    print("DONE HERE after 2s")

asyncio.run([func(),func2()])

    