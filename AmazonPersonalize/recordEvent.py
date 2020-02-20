import boto3
import json


personalize_events = boto3.client(service_name='personalize-events')



personalize_events.put_events(
    trackingId = 'f8a3412c-5ed7-4944-8c12-b3d342264898', #get trackingId by calling describe_event_tracker
    userId= '2a56ce08-e9be-45cb-89b8-c14b4cbd02d8',
    sessionId = 'session1',
    eventList = [{
        #'eventId': 'event1',
        'sentAt': '1573590419', #Timestamp
        'eventType': 'positive',
        'properties': json.dumps({
            'itemId': '16',
            'eventValue': 1
            })
        }]
)