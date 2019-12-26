#!/usr/bin/python

import sys
import requests
from requests.exceptions import HTTPError

def getCustomerBoxOrder(lastOrderNum):
    customerBoxOrderURL = 'https://www.floatthere.com/_functions/customerBoxOrder/' + str(lastOrderNum);
    print(customerBoxOrderURL)
    try:
        response = requests.get(customerBoxOrderURL)
        # If the response was successful, no Exception will be raised
        response.raise_for_status()
        rdict = response.json()
        customersToUpdate = []
        for row in rdict['items']: #for each row of customer boxes
            customer = {}
            customer['stylesInBox'] = {row['items'], row['item2'], row['item3'], row['item4'], row['item5'], row['item6'], row['item7'], row['item8'], row['item9'], row['item10'], row['item11'], row['item12']}
            customer['userEmail'] = row['customerId']
            customer['orderNum'] = row['orderNumber']
            customersToUpdate.append(customer)
        print(customersToUpdate)
        return (customersToUpdate)
    except HTTPError as http_err:
        print('HTTP error occurred')  # Python 3.6
        return None
    except Exception as err:
        print('Other error occurred')  # Python 3.6
        return None
    else:
        print('Success, but empty response')
        return ([])

def getCustomerStyles(customerEmail):
    pass

def updateCustomerCloset(customers):
    pass

def main():
    # print command line arguments
    for arg in sys.argv[1:]:
        print arg
    lastOrderNum = sys.argv[1]
    customersOrdered = getCustomerBoxOrder(lastOrderNum)
    updateCustomerCloset(customersOrdered)

if __name__ == "__main__":
    main()
