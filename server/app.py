from db.tables import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.requests import Database

if __name__ == '__main__':
    print('Starting server.')
    conn_url = 'postgresql+psycopg2://postgres:1234@nc_db/neighbourhood_db'
    db = Database(conn_url)
    print(db.get_users())
    print('Server started.')