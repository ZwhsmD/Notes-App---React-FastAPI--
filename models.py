from  sqlalchemy import Column, Integer, String
from database import Base

class Note(Base):
    __tablename__ = "Notes"
    id = Column(Integer, primary_key= True, index=True)
    title = Column(String)
    content = Column(String)
