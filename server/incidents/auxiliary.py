import incident_pb2
import incident_pb2_grpc


class AuxiliaryService(incident_pb2_grpc.AuxiliaryServicer):
    def getImage(self, request, context):
        # Stream image data in chunks
        with open(request.fileName, "rb") as img_file:
            while True:
                data = img_file.read(1024)  # read in chunks
                if not data:
                    break
                yield incident_pb2.DataChunk(data=data, size=len(data))

    def getProfileInfo(self, request, context):
        # Fetch user profile info
        return incident_pb2.ProfileInfoResponse(userName="user1", email="user1@example.com")
