# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: common/proto/Incident.proto
# Protobuf Python Version: 4.25.1
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x1b\x63ommon/proto/Incident.proto\x12\x08incident\"2\n\x0bGeoLocation\x12\x10\n\x08latitude\x18\x01 \x01(\x01\x12\x11\n\tlongitude\x18\x02 \x01(\x01\"\xc2\x01\n\x08Incident\x12\n\n\x02id\x18\x01 \x01(\t\x12\r\n\x05title\x18\x02 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x03 \x01(\t\x12$\n\x04type\x18\x04 \x01(\x0e\x32\x16.incident.IncidentType\x12$\n\x08severity\x18\x05 \x01(\x0e\x32\x12.incident.Severity\x12\'\n\x08location\x18\x06 \x01(\x0b\x32\x15.incident.GeoLocation\x12\x11\n\ttimestamp\x18\x07 \x01(\x03\"\x0e\n\x0cOfferRequest\"!\n\rOfferResponse\x12\x10\n\x08offerIds\x18\x01 \x03(\t\"\r\n\x0b\x43hatRequest\"\x1f\n\x0c\x43hatResponse\x12\x0f\n\x07\x63hatIds\x18\x01 \x03(\t\"%\n\x11\x43hatSearchRequest\x12\x10\n\x08\x63hatName\x18\x01 \x01(\t\"\x11\n\x0fIncidentRequest\"\'\n\x10IncidentResponse\x12\x13\n\x0bincidentIds\x18\x01 \x03(\t\"J\n\x12\x41\x64\x64IncidentRequest\x12\x0e\n\x06userId\x18\x01 \x01(\t\x12$\n\x08incident\x18\x02 \x01(\x0b\x32\x12.incident.Incident\")\n\x13\x41\x64\x64IncidentResponse\x12\x12\n\nincidentId\x18\x01 \x01(\t\"=\n\x17IncidentReactionRequest\x12\x0e\n\x06userId\x18\x01 \x01(\t\x12\x12\n\nreactionId\x18\x02 \x01(\x05\";\n\x18IncidentReactionResponse\x12\x0e\n\x06status\x18\x01 \x01(\t\x12\x0f\n\x07message\x18\x02 \x01(\t*H\n\x0cIncidentType\x12\x08\n\x04\x46IRE\x10\x00\x12\t\n\x05\x43RIME\x10\x01\x12\x0b\n\x07MEDICAL\x10\x02\x12\x0b\n\x07TRAFFIC\x10\x03\x12\t\n\x05OTHER\x10\x63*7\n\x08Severity\x12\x07\n\x03LOW\x10\x00\x12\n\n\x06MEDIUM\x10\x01\x12\x08\n\x04HIGH\x10\x02\x12\x0c\n\x08\x43RITICAL\x10\x03\x32M\n\x06Offers\x12\x43\n\x0egetLocalOffers\x12\x16.incident.OfferRequest\x1a\x17.incident.OfferResponse\"\x00\x32\x93\x03\n\x0cMapIncidents\x12@\n\rgetLocalChats\x12\x15.incident.ChatRequest\x1a\x16.incident.ChatResponse\"\x00\x12\x44\n\x0bsearchChats\x12\x1b.incident.ChatSearchRequest\x1a\x16.incident.ChatResponse\"\x00\x12L\n\x11getLocalIncidents\x12\x19.incident.IncidentRequest\x1a\x1a.incident.IncidentResponse\"\x00\x12L\n\x0b\x61\x64\x64Incident\x12\x1c.incident.AddIncidentRequest\x1a\x1d.incident.AddIncidentResponse\"\x00\x12_\n\x14sendIncidentReaction\x12!.incident.IncidentReactionRequest\x1a\".incident.IncidentReactionResponse\"\x00\x62\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'common.proto.Incident_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_INCIDENTTYPE']._serialized_start=731
  _globals['_INCIDENTTYPE']._serialized_end=803
  _globals['_SEVERITY']._serialized_start=805
  _globals['_SEVERITY']._serialized_end=860
  _globals['_GEOLOCATION']._serialized_start=41
  _globals['_GEOLOCATION']._serialized_end=91
  _globals['_INCIDENT']._serialized_start=94
  _globals['_INCIDENT']._serialized_end=288
  _globals['_OFFERREQUEST']._serialized_start=290
  _globals['_OFFERREQUEST']._serialized_end=304
  _globals['_OFFERRESPONSE']._serialized_start=306
  _globals['_OFFERRESPONSE']._serialized_end=339
  _globals['_CHATREQUEST']._serialized_start=341
  _globals['_CHATREQUEST']._serialized_end=354
  _globals['_CHATRESPONSE']._serialized_start=356
  _globals['_CHATRESPONSE']._serialized_end=387
  _globals['_CHATSEARCHREQUEST']._serialized_start=389
  _globals['_CHATSEARCHREQUEST']._serialized_end=426
  _globals['_INCIDENTREQUEST']._serialized_start=428
  _globals['_INCIDENTREQUEST']._serialized_end=445
  _globals['_INCIDENTRESPONSE']._serialized_start=447
  _globals['_INCIDENTRESPONSE']._serialized_end=486
  _globals['_ADDINCIDENTREQUEST']._serialized_start=488
  _globals['_ADDINCIDENTREQUEST']._serialized_end=562
  _globals['_ADDINCIDENTRESPONSE']._serialized_start=564
  _globals['_ADDINCIDENTRESPONSE']._serialized_end=605
  _globals['_INCIDENTREACTIONREQUEST']._serialized_start=607
  _globals['_INCIDENTREACTIONREQUEST']._serialized_end=668
  _globals['_INCIDENTREACTIONRESPONSE']._serialized_start=670
  _globals['_INCIDENTREACTIONRESPONSE']._serialized_end=729
  _globals['_OFFERS']._serialized_start=862
  _globals['_OFFERS']._serialized_end=939
  _globals['_MAPINCIDENTS']._serialized_start=942
  _globals['_MAPINCIDENTS']._serialized_end=1345
# @@protoc_insertion_point(module_scope)