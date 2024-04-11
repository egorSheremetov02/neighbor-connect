import incident_pb2
import incident_pb2_grpc


class IncidentService(incident_pb2_grpc.MapIncidentsServicer):
    def __init__(self, db):
        self.db = db

    def get_local_incidents(self, request, context):
        # Fetch incidents from db based on geolocation
        incident_ids = self.db.fetch_incident_ids_by_location(request.location)
        return incident_pb2.IncidentResponse(incidentIds=incident_ids)

    def add_incident(self, request, context):
        # Add new incident to db.
        incident = request.incident
        incident_id = self.db.report_incident(incident.userId, incident.title, incident.timestamp, incident.latitude,
                                              incident.longitude, incident.description)
        return incident_pb2.AddIncidentResponse(incidentId=incident_id)

    def send_incident_reaction(self, request, context):
        # Save user reaction on an incident.
        status = self.db.save_reaction(request.userId, request.reactionId, request.incidentId)
        return incident_pb2.IncidentReactionResponse(status=status, message="Reaction saved.")

    def get_local_chats(self, request, context):
        pass

    def search_chats(self, request, context):
        pass
