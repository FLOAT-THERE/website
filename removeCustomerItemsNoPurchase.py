#!/usr/bin/python

import sys
import requests
from requests.exceptions import HTTPError
from datetime import datetime, timedelta

def getNewCustomerClosets(lastDate):
    newCustomerClosetURL = "https://www.floatthere.com/_functions/newCustomersWithClosets/" + str(lastDate);
    print(newCustomerClosetURL)
    try:
        response = requests.get(newCustomerClosetURL)
        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        rdict = response.json()
        customers = rdict["users"]
        print(customers)
        return (customers)
    except HTTPError as http_err:
        print('HTTP error occurred')
        return None
    except Exception as err:
        print('Other error occurred')
        return None
    else:
        print('Success, but empty response')
        return ([])

def getCustomerBoxSelectionByDate(lastDate):
    customerBoxSelectionURL = 'https://www.floatthere.com/_functions/customerBoxSelectionByDate/' + str(lastDate);
    print(customerBoxSelectionURL)
    try:
        response = requests.get(customerBoxSelectionURL)
        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        rdict = response.json()
        customers = {}
        for row in rdict['items']: #for each row of customer boxes
            customers[row['customerId']] = 1
        print(customers)
        return (customers)
    except HTTPError as http_err:
        print('HTTP error occurred')
        return None
    except Exception as err:
        print('Other error occurred')
        return None
    else:
        print('Success, but empty response')
        return ({})

def removeClosetNoCustomerBox(newCustomers, newBoxes, debug=True):
    customersToRemove = set(newCustomers) - set(newBoxes.keys()) #Customers with closets but without boxes
    print("REMOVING CUSTOMER CLOSETS:")
    print(customersToRemove)
    if debug: return None
    for customer in newCustomers:
        if customer not in newBoxes: #Customer has not selected items for box purchase
            closet = getCustomerStyles(customer)
            stylesToUpdate = closet.keys()
            stylesURL = 'https://www.floatthere.com/_functions/stylesOfUser/'
            for styleName in stylesToUpdate: #For each style in closet, update Styles table and remove from user's closet
                URL = stylesURL + customer + '/' + closet[styleName]
                print(URL)
                try:
                    response = requests.put(URL)
                    response.raise_for_status()
                except HTTPError as http_err:
                    print('HTTP error occurred')
                except Exception as err:
                    print('Other error occurred')
                else:
                    print('Success, updated customer style')
            #Set user flag closetItemRemovedNoPurchase = true to notify user closet availability has changed
            customerId = getCustomerId(customer)
            if (customerId is not None):
                closetItemRemovedNoPurchaseURL = 'https://www.floatthere.com/_functions/userClosetItemRemovedNoPurchase/' + customerId;
                print(closetItemRemovedNoPurchaseURL)
                try:
                    response = requests.put(closetItemRemovedNoPurchaseURL)
                    print(response)
                    response.raise_for_status()
                except HTTPError as http_err:
                    print('HTTP error occurred')
                except Exception as err:
                    print('Other error occurred')
                else:
                    print('Success, set closetItemRemovedNoPurchase flag to true')
    return None

def getCustomerStyles(customerEmail):
    customerClosetURL = 'https://www.floatthere.com/_functions/stylesOfUser/'
    URL = customerClosetURL + customerEmail
    print(URL)
    try:
        response = requests.get(URL)
        response.raise_for_status()
        rdict = response.json()
        stylesToUpdate = {}
        for row in rdict['items']: #for each styles row
            stylesToUpdate[row['itemName']] = row['_id']
        print(stylesToUpdate)
        return(stylesToUpdate)
    except HTTPError as http_err:
        print('HTTP error occurred')
        return None
    except Exception as err:
        print('Other error occurred')
        return None
    else:
        print('Success, but empty response')
        return ({})

def getCustomerId(customerEmail):
    customerClosetURL = 'https://www.floatthere.com/_functions/styleProfileId/'
    URL = customerClosetURL + customerEmail
    print(URL)
    try:
        response = requests.get(URL)
        response.raise_for_status()
        rdict = response.json()
        customerId = ''
        if len(rdict['items']) > 1:
            print("Warning: More than 1 user style profiles with the same email found. Using the first style profile returned.")
        for row in rdict['items']:
            customerId = row['_id']
            break #Use only the first row
        print(customerId)
        return(customerId)
    except HTTPError as http_err:
        print('HTTP error occurred')
        return None
    except Exception as err:
        print('Other error occurred')
        return None
    else:
        print('Success, but empty response')
        return ("")

def main():
    # print command line arguments
    for arg in sys.argv[1:]:
        print arg
    if (sys.argv[1] == 'date'):
        day90 = datetime.strftime(datetime.now() - timedelta(180), '%Y-%m-%d') #180 days ago.
        day4 = datetime.strftime(datetime.now() - timedelta(4), '%Y-%m-%d') #2 days ago
        day0 = datetime.strftime(datetime.now() + timedelta(1), '%Y-%m-%d') #current day - script runs at 7AM EST (12PM GMT)
        customersWithBoxes = getCustomerBoxSelectionByDate(day90) #All boxes since 90 days ago.
        customers4 = getNewCustomerClosets(day4) #All customer style changes since 4 days ago
        customers0 = getNewCustomerClosets(day0) #All customer style changes since today
        if (customers0 is not None):
            customersToCheck = set(customers4) - set(customers0) #Check customers who joined before today only
        else:
            customersToCheck = set(customers4)
        customersToCheck = customersToCheck - set(["SOLD"])
        print("CHECKING CUSTOMERS:")
        print(customersToCheck)
        if (len(sys.argv) > 2 and sys.argv[2] == 'debug'):
            removeClosetNoCustomerBox(customersToCheck, customersWithBoxes, debug=True)
        else:
            removeClosetNoCustomerBox(customersToCheck, customersWithBoxes, debug=False)

if __name__ == "__main__":
    main()
