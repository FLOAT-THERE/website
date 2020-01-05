interactionTypes = c(
    "liked" #Yes Match - window shop during onboarding, value = 1
    , "disliked" #No Match - window shop during onboarding, value = -1
    , "rented" #Rented item, value = 2
    , "styled" #Styled in closet by human stylist, value = 0.1
    , "autostyled" #Styled in closet by ML, value = 0
    , "requested" #Requested to order box after seeing closet, value = 0.75
    )

userFile = "Downloads/StyleProfile-4.csv"
itemFile = "Downloads/Styles-10.csv"
boxesFile = "Downloads/CustomerBoxes.csv"

udf = read.csv(userFile, stringsAsFactor=F)
idf = read.csv(itemFile, stringsAsFactor=F)
bdf = read.csv(boxesFile, stringsAsFactor=F)

library(plyr)
library(dplyr)
library(abind)

liked = ldply(1:nrow(udf), function(rowIdx) {
    itemIDs = strsplit(udf[rowIdx, "Liked.Item.IDs"], ";")[[1]]
    if (length(itemIDs) >= 1)
        data.frame(user_id = udf[rowIdx, "Owner"], item_id = itemIDs, timestamp=udf[rowIdx, "Updated.Date"], event_type='positive', event_value=1)
} )
liked$timestamp = as.numeric(as.POSIXct(liked$timestamp, format="%Y-%m-%dT%H:%M:%SZ"))
write.csv(liked, "Downloads/ft-liked.csv", row.names=F)

disliked = ldply(1:nrow(udf), function(rowIdx) {
    itemIDs = strsplit(udf[rowIdx, "Disliked.Item.IDs"], ";")[[1]]
    if (length(itemIDs) >= 1)
        data.frame(user_id = udf[rowIdx, "Owner"], item_id = itemIDs, timestamp=udf[rowIdx, "Updated.Date"], event_type='negative', event_value=-1)
} )
disliked$timestamp = as.numeric(as.POSIXct(disliked$timestamp, format="%Y-%m-%dT%H:%M:%SZ"))
write.csv(disliked, "Downloads/ft-disliked.csv", row.names=F)

rented = ldply(1:nrow(bdf), function(rowIdx) {
    itemNames = bdf[rowIdx, 8:19]
    #Get itemIDs of item itemNames
    itemIDs = unlist(lapply(itemNames, function(name) {
        itemID = unique(subset(idf, Item.Name==name)$Item.ID)
        if( length(itemID) > 1) print(name)
        itemID
    }))
    if (length(itemIDs) >= 1)
        data.frame(user_id = bdf[rowIdx, "Owner"], item_id = itemIDs, timestamp=bdf[rowIdx, "Updated.Date"], event_type='positive', event_value=2)
})
rented$timestamp = as.numeric(as.POSIXct(rented$timestamp, format="%Y-%m-%dT%H:%M:%SZ"))
write.csv(rented, "Downloads/ft-rented.csv", row.names=F)

styled = ldply(1:nrow(idf), function(rowIdx) {
    inUseCustomer = idf[rowIdx, "In.Use.Customer"]
    #Get userIDs of inUseCustomer customerEmail
    userID = subset(udf, Email == inUseCustomer)$Owner
    userID = userID[ userID != ""]
    if (length(userID) >= 1)
        data.frame(user_id = userID, item_id = idf[rowIdx, "Item.ID"], timestamp=idf[rowIdx, "Updated.Date"], event_type='positive', event_value=0.2)
})
styled$timestamp = as.numeric(as.POSIXct(styled$timestamp, format="%Y-%m-%dT%H:%M:%SZ"))
write.csv(styled, "Downloads/ft-styled.csv", row.names=F)

autostyled = ldply(1:nrow(udf), function(rowIdx) {
    closetIDs = strsplit(udf[rowIdx, "Closet.IDs"], ";")[[1]]
    itemIDs = unlist(lapply(closetIDs, function(cid) {
        itemID = unique(subset(idf, ID == cid)$Item.ID)
        itemID
    }))
    if (length(itemIDs) >= 1)
        data.frame(user_id = udf[rowIdx, "Owner"], item_id = itemIDs, timestamp=udf[rowIdx, "Updated.Date"], event_type='positive', event_value=0.1)
})
autostyled$timestamp = as.numeric(as.POSIXct(autostyled$timestamp, format="%Y-%m-%dT%H:%M:%SZ"))
write.csv(autostyled, "Downloads/ft-autostyled.csv", row.names=F)

requested = ldply(1:nrow(udf), function(rowIdx) {
    if (udf[rowIdx, "Box.Request"] != "") {
        closetIDs = strsplit(udf[rowIdx, "Closet.IDs"], ";")[[1]]
        itemIDs = unlist(lapply(closetIDs, function(cid) {
            itemID = unique(subset(idf, ID == cid)$Item.ID)
            itemID
        }))
        if (length(itemIDs) >= 1)
            data.frame(user_id = udf[rowIdx, "Owner"], item_id = itemIDs, timestamp=udf[rowIdx, "Updated.Date"], event_type='positive', event_value=0.75)
    }
})
requested$timestamp = as.numeric(as.POSIXct(requested$timestamp, format="%Y-%m-%dT%H:%M:%SZ"))
write.csv(requested, "Downloads/ft-requested.csv", row.names=F)

interactions = rbind(liked, disliked, rented, requested, styled, autostyled)
interactions = unique(interactions)
write.csv(interactions, "Downloads/ft-interactions.csv", row.names=F)
