from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

class Database:
    def __init__(self, url):
        self.engine = create_engine(url)
        self.Session = sessionmaker(bind=self.engine)
    
    def add_user(self, username, email, password, phone_number, bio=None):
        session = self.Session()
        new_user = User(username=username, email=email,
                        password=password, phone_number=phone_number,
                        bio=bio)
        session.add(new_user)
        session.commit()
    
    def delete_user(self, user_id):
        session = self.Session()
        user = session.query(User).filter_by(id=user_id).first()
        session.delete(user)
        session.commit()
    
    def report_incident(self, user_id, title, date, location):
        session = self.Session()
        incident = Incident(user_id=user_id, title=title,
                            date=date, location=location)
        session.add(incident)
        session.commit()
    
    def get_incidents(self, user_id=None):
        session = self.Session()
        if user_id:
            incidents = session.query(Incident).filter_by(user_id=user_id).all()
        else:
            incidents = session.query(Incident).all()
        return incidents