#!/usr/bin/python

import sys
import requests
from requests.exceptions import HTTPError
from datetime import datetime, timedelta

def getCustomerBoxOrderByDate(lastDate):
    customerBoxOrderURL = 'https://www.floatthere.com/_functions/customerBoxOrderByDate/' + str(lastDate);
    print(customerBoxOrderURL)
    try:
        response = requests.get(customerBoxOrderURL)
        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        rdict = response.json()
        customers = {}
        for row in rdict['items']: #for each row of customer boxes
            customers[row['customerId']] = {row['items'], row['item2'], row['item3'], row['item4'], row['item5'], row['item6'], row['item7'], row['item8'], row['item9'], row['item10'], row['item11'], row['item12']}
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

def getCustomerBoxOrder(lastOrderNum):
    customerBoxOrderURL = 'https://www.floatthere.com/_functions/customerBoxOrder/' + str(lastOrderNum);
    print(customerBoxOrderURL)
    try:
        response = requests.get(customerBoxOrderURL)
        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        rdict = response.json()
        customers = {}
        for row in rdict['items']: #for each row of customer boxes
            customers[row['customerId']] = {row['items'], row['item2'], row['item3'], row['item4'], row['item5'], row['item6'], row['item7'], row['item8'], row['item9'], row['item10'], row['item11'], row['item12']}
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

def updateCustomerCloset(customers):
    stylesURL = 'https://www.floatthere.com/_functions/stylesOfUser/'
    for (customer,box) in customers.items(): #for each customer
        closet = getCustomerStyles(customer)
        boxItemsNotInCloset = box - set(closet.keys())
        print(boxItemsNotInCloset)
        if (len(boxItemsNotInCloset) == 0 or (len(boxItemsNotInCloset) == 1 and '' in boxItemsNotInCloset)): #All box items are in customer's closet, this is the correct customer order
            stylesToUpdate = set(closet.keys()) - box #Items in closet but not in customer box
            for styleName in stylesToUpdate: #For each style in closet but not in box, update Styles table
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
                return None

def main():
    # print command line arguments
    for arg in sys.argv[1:]:
        print arg
    if (sys.argv[1] == 'order'):
        lastOrderNum = sys.argv[2]
        customersOrdered = getCustomerBoxOrder(lastOrderNum)
        updateCustomerCloset(customersOrdered)
    elif (sys.argv[1] == 'date'):
        if (len(sys.argv) > 2):
            lastDate = sys.argv[2]
        else:
            lastDate = datetime.strftime(datetime.now() - timedelta(1), '%Y-%m-%d')
        customersOrdered = getCustomerBoxOrderByDate(lastDate)
        updateCustomerCloset(customersOrdered)

if __name__ == "__main__":
    main()
