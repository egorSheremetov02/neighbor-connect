import grpc
from concurrent import futures
import incident_pb2_grpc

from incidents import IncidentService


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    incident_pb2_grpc.add_MapIncidentsServicer_to_server(IncidentService(db=None), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
