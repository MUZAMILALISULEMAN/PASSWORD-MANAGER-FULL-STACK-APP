# import random
# from datetime import datetime, timedelta
# from email.message import EmailMessage
# import asyncio
# import yagmail
# import jose
# from fastapi import FastAPI, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel

# from sqlalchemy import Column, Integer, String, DateTime, Boolean, Select, Update
# from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
# from sqlalchemy.orm import declarative_base
# from sqlalchemy.exc import SQLAlchemyError

# # ----------------------------- MODELS -----------------------------------
# class EmailRequest(BaseModel):
#     email: str

# class PayLoad(BaseModel):
#     email: str
#     otp_code: str
#     password: str
#     name: str

# # ---------------------------- UTILS -------------------------------------
# def generateOTP():
#     return ''.join(str(chr(49 + random.randint(0, 8))) for _ in range(6))

# async def send_email_async(to_email: str, otp_code: str):
#     def send_sync():
#         yag = yagmail.SMTP(user="muzamil.ali1099@gmail.com", password="sbjdioujwpqsdzcl")
#         yag.send(
#             to=to_email,
#             subject="SecureAuth OTP Verification",
#             contents=f"Your OTP is {otp_code}"
#         )
#     await asyncio.to_thread(send_sync)

# # ---------------------------- DATABASE ----------------------------------

# engine = create_async_engine("mysql+aiomysql://root:%21%40%23muzzy2006@localhost/db")
# SESSION = async_sessionmaker(class_=AsyncSession, expire_on_commit=False, bind=engine)

# async def GET_DB():
#     async with SESSION() as session:
#         yield session

# BASE_ENTITY = declarative_base()

# class USER(BASE_ENTITY):
#     __tablename__ = "user"
#     id = Column(Integer, primary_key=True)
#     name = Column(String(50), nullable=False)
#     email = Column(String(50), nullable=False, unique=True)
#     password = Column(String(50), nullable=False)

# class OTPRequest(BASE_ENTITY):
#     __tablename__ = "otp_requests"

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     email = Column(String(255), nullable=False)
#     otp_code = Column(String(10), nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     expires_at = Column(DateTime, nullable=False)
#     is_verified = Column(Boolean, default=False)
#     is_active = Column(Boolean, default=True)

#     def is_expired(self):
#         return datetime.utcnow() > self.expires_at

# # ----------------------------- APP SETUP --------------------------------
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ----------------------------- ROUTES -----------------------------------
# @app.post("/submit")
# async def submit(data: EmailRequest, db: AsyncSession = Depends(GET_DB)):
#     message = "Something went wrong"
#     status = "success"
#     try:
#         stmt = Update(OTPRequest).where(OTPRequest.email == data.email).values(is_active=False)
#         await db.execute(stmt)
#         await db.commit()

#         otpCode = generateOTP()
#         expires_at = datetime.utcnow() + timedelta(minutes=5)
#         payload = OTPRequest(email=data.email, otp_code=otpCode, expires_at=expires_at)
#         db.add(payload)
#         await db.commit()

#         try:
#             await send_email_async(data.email, otpCode)
#         except Exception:
#             await db.rollback()
#             return {"status": "error", "message": f"Failed to send email"}

#         message = f"OTP sent successfully to {data.email}"

#     except SQLAlchemyError:
#         await db.rollback()
#         status = "error"
#         message = f"Database Issue"

#     except Exception:
#         await db.rollback()
#         status = "error"
#         message = f"Expected Error Occurs, Try Again"

#     return {"status": status, "message": message}

# @app.post("/verify")
# async def verify(data: PayLoad, db: AsyncSession = Depends(GET_DB)):
#     try:
#         stmt = Select(OTPRequest).where(
#             OTPRequest.email == data.email,
#             OTPRequest.otp_code == data.otp_code
#         ).order_by(OTPRequest.created_at.desc())

#         result = await db.execute(stmt)
#         entry = result.first()

#         if entry is None:
#             return {"status": "error", "message": "Wrong OTP!"}

#         otp_entry = entry[0]

#         if not otp_entry.is_expired() and otp_entry.is_active:
#             stmt = Select(USER.email).where(USER.email == data.email)
#             result = await db.execute(stmt)
#             result = result.first()
#             if result is not None:

#                 return {"status": "error", "message": "Email is already registered"}
            
#             db.add(USER(name=data.name, email=data.email, password=data.password))
#             await db.commit()
#             return {"status": "success", "message": "Verified"}
#         else:
#             if otp_entry.is_active:
#                 otp_entry.is_active = False
#                 await db.commit()
#             return {"status": "error", "message": "OTP expired or inactive"}

#     except SQLAlchemyError:
#         await db.rollback()
#         return {"status": "error", "message": "Database Issue"}

#     except Exception:
#         await db.rollback()
#         return {"status": "error", "message": "Expected Error Occurs, Try Again"}

# @app.post("/submit")
# async def submit(data: EmailRequest, db: AsyncSession = Depends(GET_DB))

try:
    print("HELLO")
    raise ValueError("ERROR")
finally:
    print("GO TO")