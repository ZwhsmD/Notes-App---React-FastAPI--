from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from database import SessionLocal, engine
from sqlalchemy.orm import Session
import models
from typing_extensions import Annotated, List
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)
react_build_dir = os.path.join(os.path.dirname(__file__), "React", "notes-app", "build")

app.mount("/static", StaticFiles(directory=os.path.join(react_build_dir, "static")), name="static")

models.Base.metadata.create_all(bind=engine)

#Base for what the user sends in a method request
class NoteBase(BaseModel):
    title: str
    content: str

#Adding to the Model what the user is not inputting.DB is generating it
class NoteModel(NoteBase):
    id: int

    class Config:
        orm_mode = True  # allows returning ORM objects directly

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


@app.get("/")
async def read_transactions(db: db_dependency, skip: int=0, limit: int=100):
    notes = db.query(models.Note).offset(skip).limit(limit).all()
    return notes

@app.post("/notes/", response_model=NoteModel)
def create_note(note: NoteBase, db : Session = Depends(get_db)):
    db_note = models.Note(**note.model_dump())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/notes/{note_id}/", response_model=NoteModel)
def delete_note(note_id: int, db:Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(db_note)
    db.commit()
    return db_note

@app.put("/notes/{note_id}/", response_model=NoteModel)
def update_note(note_id: int, note: NoteModel, db : Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")

    db_note.title = note.title
    db_note.content = note.content

    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse(os.path.join("build", "index.html"))
