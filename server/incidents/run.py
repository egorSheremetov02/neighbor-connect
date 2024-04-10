import grpc
from concurrent import futures
import incident_pb2_grpc

from offers import OffersService
from map_incidents import MapIncidentsService
from profile_service import ProfileService
from auxiliary import AuxiliaryService


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    incident_pb2_grpc.add_OffersServicer_to_server(OffersService(), server)
    incident_pb2_grpc.add_MapIncidentsServicer_to_server(MapIncidentsService(), server)
    incident_pb2_grpc.add_ProfileServicer_to_server(ProfileService(), server)
    incident_pb2_grpc.add_AuxiliaryServicer_to_server(AuxiliaryService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
