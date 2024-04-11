import incident_pb2
import incident_pb2_grpc


class IncidentService(incident_pb2_grpc.MapIncidentsServicer):
    def __init__(self, db):
        self.db = db

    def get_local_chats(self, request, context):
        pass

    def search_chats(self, request, context):
        pass

    def get_local_incidents(self, request, context):
        pass

    def add_incident(self, request, context):
        pass

    def send_incident_reaction(self, request, context):
        pass

    def get_local_offers(self, request, context):
        pass


