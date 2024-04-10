import incident_pb2
import incident_pb2_grpc


class OffersService(incident_pb2_grpc.OffersServicer):
    def getLocalOffers(self, request, context):
        # Logic to get local offers
        offers = ['offer1', 'offer2']  # example offer IDs
        return incident_pb2.OfferResponse(offerIds=offers)
