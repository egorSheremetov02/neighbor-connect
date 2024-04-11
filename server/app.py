from db.tables import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.requests import Database
import grpc
from concurrent import futures
from incidents import incident_pb2_grpc
from incidents.incidents import IncidentService

if __name__ == '__main__':
    print('Starting server.')
    conn_url = 'postgresql+psycopg2://postgres:1234@nc_db/neighbourhood_db'
    db = Database(conn_url)
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    incident_pb2_grpc.add_MapIncidentsServicer_to_server(IncidentService(db=db), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()
    print('Server started.')