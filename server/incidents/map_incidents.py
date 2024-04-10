import incident_pb2
import incident_pb2_grpc


class MapIncidentsService(incident_pb2_grpc.MapIncidentsServicer):
    def getLocalChats(self, request, context):
        chat_ids = ['chat1', 'chat2']  # example chat IDs
        return incident_pb2.ChatResponse(chatIds=chat_ids)

    def searchChats(self, request, context):
        # Search logic based on request.chatName
        return incident_pb2.ChatResponse(chatIds=['chat1'])

    def getLocalIncidents(self, request, context):
        incident_ids = ['incident1', 'incident2']  # example incident IDs
        return incident_pb2.IncidentResponse(incidentIds=incident_ids)

    def addIncident(self, request, context):
        # Add incident to database or storage
        return incident_pb2.AddIncidentResponse(incidentId="incident1")

    def sendIncidentReaction(self, request, context):
        # Logic to handle incident reactions
        return incident_pb2.IncidentReactionResponse(status="success", message="Reaction sent")
