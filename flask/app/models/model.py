from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import declarative_base
from flask_sqlalchemy import SQLAlchemy

Base = declarative_base()
db = SQLAlchemy()

class MedicalReport(db.Model):
    __tablename__ = "medical-report"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    patientId = Column(Integer, nullable=False)
    caretakerId = Column(Integer, nullable=False)
    doctorId = Column(Integer, nullable=False)
    symptoms = Column(String(500), nullable=False)
    detailedAnalysis = Column(Text, nullable=False)
    precautions = Column(Text, nullable=False)
    typeOfDoctor = Column(String(100), nullable=False)
    predictions = Column(Text, nullable=False)
    verified = Column(Boolean, default=False, nullable=False)
    createdAt = Column(DateTime, default=func.now(), nullable=False)
