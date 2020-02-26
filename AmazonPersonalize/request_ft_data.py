#This program has recorded ft data from 2020.1.1 to 2020.2.20

import requests
import datetime
import boto3
import json
import calendar
import time
from datetime import timedelta, date

personalize_events = boto3.client(service_name='personalize-events')

def daterange(date1, date2):
	
    for n in range(int ((date2 - date1).days)+1):

        yield date1 + timedelta(n)


#######REQUEST UPDATES FROM FT WEBSITE#########

def fetch_update(yy, mm, dd):
	
	if len(mm) == 1:
		mm = "0" + mm
	if len(dd) == 1:
		dd = "0" + dd

	URL = 'https://www.floatthere.com/_functions/newProfilesByDate/%s-%s-%s' % (yy, mm, dd)
	print(URL)

	r = requests.get(url = URL)

	if r.status_code != 404:
		print(r.json())
		return r.json()
	else:
		print("No update today.")
		return -1
#-----------------------------------------------#



#######################RECORD_EVENT FUNCTION###################
def record_event(userID, itemID, time, action, value):
	personalize_events.put_events(
	    trackingId = 'e0ddaab5-8659-43bf-a55b-a225af5354b0', #get trackingId by calling describe_event_tracker
	    userId= userID,
	    sessionId = 'session1',
	    eventList = [{
	        #'eventId': 'event1',
	        'sentAt': time, #Timestamp
	        'eventType': action,
	        'properties': json.dumps({
	            'itemId': itemID,
	            'eventValue': value
	            })
	        }]
	)
#--------------------------------------------------------------#




##########RECORD EVENTS IF THERE IS ANY NEW INTERQATIONS##########
def updateDataset(yy, mm, dd):

	data = fetch_update(yy, mm, dd)
	if data != -1:
		for i in data['items']:
			if "likedItemIDs" in i:
				itemList = i["likedItemIDs"].split(";")
				itemList.pop()
				for likedItemID in itemList:
					curr_time = i['_updatedDate']
					year = int(curr_time[0:4])
					month = int(curr_time[5:7])
					day = int(curr_time[8:10])
					hour = int(curr_time[11:13])
					minute = int(curr_time[14:16])
					sec = int(curr_time[17:19])
					time = datetime.datetime(year,month,day,hour,minute,sec).timestamp()
					print(time)
					print("ITEMID:", likedItemID)
					record_event(i["_id"], likedItemID, time, "positive", 1)
			if "dislikedItemIDs" in i:
				itemList = i["likedItemIDs"].split(";")
				itemList.pop()
				for dislikedItemID in itemList:
					curr_time = i['_updatedDate']
					year = int(curr_time[0:4])
					month = int(curr_time[5:7])
					day = int(curr_time[8:10])
					hour = int(curr_time[11:13])
					minute = int(curr_time[14:16])
					sec = int(curr_time[17:19])
					time = datetime.datetime(year,month,day,hour,minute,sec).timestamp()
					print(time)
					print("ITEMID:", dislikedItemID)
					record_event(i["_id"], dislikedItemID, time, "negative", -1)
#-----------------------------------------------------------------#

today = datetime.date.today()
startDate = date(2020, 1, 1)
for dt in daterange(startDate, today):

    print(dt.strftime("%Y-%m-%d"))
    updateDataset(dt.strftime("%Y-%m-%d")[0:4], dt.strftime("%Y-%m-%d")[5:7], dt.strftime("%Y-%m-%d")[8:])
    print(dt.strftime("%Y-%m-%d")[0:4], dt.strftime("%Y-%m-%d")[5:7], dt.strftime("%Y-%m-%d")[8:])

###############GET RECOMMENDATION ITEMS#################

personalizeRt = boto3.client('personalize-runtime')
response = personalizeRt.get_recommendations(
    campaignArn = 'arn:aws:personalize:us-east-1:214537708097:campaign/ft_campaign',
    userId = 'c64d7167-5730-4a1f-9896-91ab5902c4b8')
print("Recommended items")
for item in response['itemList']:
    print (item['itemId'])

#------------------------------------------------------#




