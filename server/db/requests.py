from math import pi, cos, asin, sqrt

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from server.db.tables import User, Incident
import server.incidents.incident_pb2 as incident_pb2


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

    def get_users(self):
        session = self.Session()
        users = session.query(User).all()
        return users

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
    #     TODO: return incident.id

    def get_incidents(self, user_id=None):
        session = self.Session()
        if user_id:
            incidents = session.query(Incident).filter_by(user_id=user_id).all()
        else:
            incidents = session.query(Incident).all()
        return incidents

    def fetch_chat_ids_by_location(self, location: incident_pb2.GeoLocation):
        session = self.Session()
        earth_radius = 6371  # km

        def haversine(lat1, lon1, lat2, lon2):
            p = pi / 180
            a = 0.5 - cos((lat2 - lat1) * p) / 2 + cos(lat1 * p) * cos(lat2 * p) * (1 - cos((lon2 - lon1) * p)) / 2
            distance = 2 * earth_radius * asin(sqrt(a))
            return distance

        incidents = session.query(Incident).all()

        filtered_incidents = [incident for incident in incidents if
                              haversine(location.latitude, location.longitude, incident.latitude,
                                        incident.longitude) <= 10]

        return [incident.chat_id for incident in filtered_incidents]

    def save_reaction(self, user_id, reaction_id, incident_id):
        session = self.Session()
        incident = session.query(Incident).filter_by(id=incident_id).first()
        if reaction_id == 1:
            incident.likes += 1
        else:
            incident.dislikes += 1
        session.commit()


