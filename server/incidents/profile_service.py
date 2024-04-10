import incident_pb2
import incident_pb2_grpc


class ProfileService(incident_pb2_grpc.ProfileServicer):
    def updateProfileInfo(self, request, context):
        # Update user profile info
        return incident_pb2.ProfileInfoUpdateResponse(status="success", message="Profile updated")

    def getCommonGroups(self, request, context):
        group_ids = ['group1', 'group2']  # example group IDs
        return incident_pb2.CommonGroupsResponse(groupIds=group_ids)
