library(ggplot2)
library(plyr)
library(dplyr)
library(tm)

styleProfs = read.csv("Downloads/styleProfile_clean.csv")
vacations = read.csv("Downloads/vacations_clean.csv")

### Age
styleProfs$Est.Age = NA

for (index in c(1:nrow(styleProfs))) {
  year = styleProfs$Birth.Year[index]
  bdate = styleProfs$Birthdate[index]
  if (is.na(year) && !is.na(bdate)) {
    year = format(as.POSIXct(as.character(bdate), format="%Y-%m-%dT%H:%M:%SZ"), "%Y")
  }
  styleProfs$Birth.Year[index] = year
  if (!is.na(year)) {
    estimatedAge = 2020 - as.numeric(year)
    styleProfs$Est.Age[index] = estimatedAge
  }
}

print(c("N: " , sum(!is.na(styleProfs$Est.Age))))
ggplot(styleProfs, aes(Est.Age, fill = cut(Est.Age, 5))) + geom_histogram(show.legend = T, bins = 20) + ggtitle("Estimated Ages, N=154")
summary(styleProfs$Est.Age)

### Instagram
print(c("N Instagram: ", sum(styleProfs$Instagram.Handle != "")))
print(c("% Shared Instagram: ", round(100 * (sum(styleProfs$Instagram.Handle != "")/nrow(styleProfs)), 2)))

### Height & Weight
heightdf = subset(styleProfs, Height != "")
ggplot(heightdf, aes(Height)) + geom_histogram(stat="count") + ggtitle("Height, N=154")
sum(!is.na(styleProfs$Weight.Lbs))
ggplot(styleProfs, aes(Weight.Lbs, fill = cut(Weight.Lbs, 100))) + geom_histogram(show.legend = F) + ggtitle("Weight, N=153")

### Dress Size
sum(!is.na(styleProfs$Dress.Size))
ggplot(styleProfs, aes(Dress.Size, fill = cut(Dress.Size, 100))) + geom_histogram(show.legend = F) + ggtitle("Dress Size, N=157") + scale_x_continuous(breaks=seq(0,16, by=2))

### Spending
spenddf = subset(styleProfs, Casual.Dress.Spend != "")
nrow(spenddf)
ggplot(spenddf, aes(x=Casual.Dress.Spend, fill=Casual.Dress.Spend)) + geom_bar(stat="count") + ggtitle("Dress Spend, N=157")
ggplot(spenddf, aes(x=Casual.Top.Spend, fill=Casual.Top.Spend)) + geom_bar(stat="count") + ggtitle("Top Spend, N=157")
ggplot(spenddf, aes(x=Casual.Bottom.Spend, fill=Casual.Bottom.Spend)) + geom_bar(stat="count") + ggtitle("Bottom Spend, N=157")

### Brands
brandsFaved = c()
for (index in c(1:nrow(styleProfs))) {
  brands = gsub("\"", "", as.character(styleProfs$Favorite.Brands[index]))
  brands = substr(brands, 2, nchar(brands)-1)
  favoriteBrands = strsplit(brands, ",")[[1]]
  print(favoriteBrands)
  brandsFaved = c(brandsFaved, favoriteBrands)
}
allBrands = data.frame(table(brandsFaved))
colnames(allBrands) = c("Brand", "Frequency")
sum(styleProfs$Favorite.Brands != "")
allBrands$Frequency[ which(allBrands$Brand == "Lilly Pulitzer") ] = allBrands$Frequency[ which(allBrands$Brand == "Lilly Pulitzer") ] + allBrands$Frequency[ which(allBrands$Brand == "Lily Pulitzer") ]
allBrands = subset(allBrands, Brand != "Lily Pulitzer")
allBrands$Frequency[ which(allBrands$Brand == "LOFT") ] = allBrands$Frequency[ which(allBrands$Brand == "LOFT") ] + allBrands$Frequency[ which(allBrands$Brand == "Loft") ]
allBrands = subset(allBrands, Brand != "Loft")
allBrands$Frequency[ which(allBrands$Brand == "J. Crew") ] = allBrands$Frequency[ which(allBrands$Brand == "J. Crew") ] + allBrands$Frequency[ which(allBrands$Brand == "J.Crew") ]
allBrands = subset(allBrands, Brand != "J.Crew")
allBrands$Pct.Favorited = round( 100 * (allBrands$Frequency / sum(styleProfs$Favorite.Brands != "")), 1)
ggplot(allBrands, aes(x=Brand, y=Pct.Favorited, fill=Brand)) + geom_bar(stat="identity", show.legend=T) + scale_y_continuous(breaks=seq(0,100,by=10)) + scale_x_discrete(labels=abbreviate) + ggtitle("% Customers Favorited Brand, N=157")

addBrands = subset(styleProfs, Additional.Brands != "")
nrow(addBrands)

### Influencers
influencers = subset(styleProfs, Favorite.Influencers != "")
influencers = subset(influencers, !Favorite.Influencers %in% c("no", "No", "NO", "not really", "none", "Nope"))
nrow(influencers) #55 follow
influencers = subset(influencers, !Favorite.Influencers %in% c("Yes", "yes", "YES"))
influencers = influencers$Favorite.Influencers
influencers = gsub("\n", ",", influencers)
influencers = gsub(" ", "", influencers)
influencers = gsub("@", "", influencers)
influencers = tolower(influencers)
influencers[24]
# [1] "https://instagram.com/avreyovard?igshid=vte67jh5a3eo,https://instagram.com/best.dressed?igshid=w2lwikjsvxvg"
influencers[24] = "avreyovard,best.dressed"
influencers[26]
# [1] "https://instagram.com/iamhearte?igshid=d4d811revyh;https://instagram.com/valerialipovetsky?igshid=1i2sdsv9tgr4g,"
influencers[26] = "iamhearte,valerialipovetsky"
allInfluencers = c()
for (inf in influencers) {
  allInfluencers = c(allInfluencers, strsplit(inf, ",")[[1]])
}
allInfluencers = allInfluencers[ allInfluencers != ""]
table(allInfluencers) #All different

pinterest = subset(styleProfs, Pinterest.Boards != "")
nrow(pinterest) #20, but only 16 have pinterest boards

### Vacations
### Destination, N = 242
dests = tolower(vacations$Destination)
dests = gsub(" ", "", dests)
cities = c()
for (dest in dests) {
  index = gregexpr(pattern=",", dest)[[1]][1]
  if (index != -1) {
    city = substr(dest, 1, index - 1)
    cities = c(cities, city)
  } else cities = c(cities, dest)
}
cities = cities[ cities != "jk"]
for (i in c(1:length(cities))) {
  for (cc2 in cities) {
    if (grepl(cities[i], cc2)) { cities[i] = cc2 }
  }
}
allCities = data.frame(table(cities))
colnames(allCities) = c("City", "Frequency")
sum(vacations$Destination != "")
allCitiesEst = subset(allCities, Frequency >= 3)
allCitiesEst = rbind(allCitiesEst, data.frame(City="Other", Frequency = nrow(subset(allCities, Frequency < 3))))
allCities = allCitiesEst
allCities$Pct = round( 100 * (allCities$Frequency / sum(vacations$Destination != "")), 1)
allCities = subset(allCities, City != "Other")
  # Compute the position of labels
  allCities <- allCities %>%
    arrange(desc(City)) %>%
    mutate(prop = Frequency / sum(allCities$Frequency) *100) %>%
    mutate(ypos = cumsum(prop)- 0.5*prop )

  # Basic piechart
  ggplot(allCities, aes(x="", y=prop, fill=City)) +
    geom_bar(stat="identity", width=1, color="white", show.legend=T) +
    coord_polar("y", start=0) +
    theme_void() +
    theme(legend.position="none") +
    geom_text(aes(y = ypos, label = City), color = "white", size=3)
ggplot(allCities, aes(x=City, y=Frequency, fill=City)) + geom_bar(stat="identity", show.legend=T) + scale_y_continuous(breaks=seq(0,20,by=2)) + scale_x_discrete(labels=abbreviate) + ggtitle("Number Visited City, N=242")

### Accommodations
data = data.frame(table(vacations$Accommodation.Type))
colnames(data) = c("Type", "Frequency")
data <- data %>%
  arrange(desc(Type)) %>%
  mutate(prop = Frequency / sum(data$Frequency) *100) %>%
  mutate(ypos = cumsum(prop)- 0.5*prop )

ggplot(data, aes(x="", y=prop, fill=Type)) +
  geom_bar(stat="identity", width=1, color="white") +
  coord_polar("y", start=0) +
  theme_void() +
  theme(legend.position="none") +

  geom_text(aes(y = ypos, label = Type), color = "white", size=4) +
  scale_fill_brewer(palette="Set1") +
  ggtitle("Accomodation Types, N = 242")
data$prop = round(data$prop, 1)
colnames(data) = c("Type", "Frequency", "Pct", "YPos")

### Length of Trip
tripDays = c()
for (i in c(1:nrow(vacations))) {
  startDate = as.character(vacations$Start.date[i])
  endDate = as.character(vacations$End.date[i])
  # Check format of date
  formattable = T
  if (!is.na( as.POSIXct(startDate, format="%d-%b-%y") )) {
    startDate = as.POSIXct(startDate, format="%d-%b-%y")
    endDate = as.POSIXct(endDate, format="%d-%b-%y")
  } else if (!is.na( as.POSIXct(startDate, format="%Y-%m-%dT%H:%M:%SZ") )) {
    startDate = as.POSIXct(startDate, format="%Y-%m-%dT%H:%M:%SZ")
    endDate = as.POSIXct(endDate, format="%Y-%m-%dT%H:%M:%SZ")
  } else if (!is.na( as.POSIXct(startDate, format="%m/%d/%y") )) {
    startDate = as.POSIXct(startDate, format="%m/%d/%y")
    endDate = as.POSIXct(endDate, format="%m/%d/%y")
  } else {
    formattable = F
  }
  if (formattable) {
    days = round(difftime(endDate, startDate, unit="days"),0)
    if (days >= 0) {
      tripDays = c(tripDays, days)
    }
  }
}
tripDays = tripDays[ tripDays <= 60]
tripDays = data.frame(tripDays)
ggplot(tripDays, aes(tripDays)) + geom_histogram(stat="count") + ggtitle("Length of Trip in Days, N=223") + scale_x_continuous(breaks=seq(0,60,by=5))

### Start of Trip
startMonths = vacations$Start.date
months = c()
for (mm in startMonths) {
  mos = strsplit(mm, "-")[[1]]
  if (length(mos) >= 2) {
    mos = mos[2]
  } else {
    mos = strsplit(mm, "/")[[1]][1]
  }
  months = c(months, mos)
}
months = data.frame(table(months))
colnames(months) = c("Month", "Frequency")
months[which(months$Month == "Jan"),"Frequency"] = months[which(months$Month == "Jan"),"Frequency"] + months[which(months$Month == "1"),"Frequency"]
months[which(months$Month == "Feb"),"Frequency"] = months[which(months$Month == "Feb"),"Frequency"] + months[which(months$Month == "2"),"Frequency"]
months[which(months$Month == "Mar"),"Frequency"] = months[which(months$Month == "Mar"),"Frequency"] + months[which(months$Month == "3"),"Frequency"]
months[which(months$Month == "Apr"),"Frequency"] = months[which(months$Month == "Apr"),"Frequency"] + months[which(months$Month == "4"),"Frequency"]
months[which(months$Month == "May"),"Frequency"] = months[which(months$Month == "May"),"Frequency"] + months[which(months$Month == "5"),"Frequency"]
months[which(months$Month == "Jun"),"Frequency"] = months[which(months$Month == "Jun"),"Frequency"] + months[which(months$Month == "6"),"Frequency"]
months[which(months$Month == "Jul"),"Frequency"] = months[which(months$Month == "Jul"),"Frequency"] + months[which(months$Month == "07"),"Frequency"] + months[which(months$Month == "7"),"Frequency"]
months[which(months$Month == "Aug"),"Frequency"] = months[which(months$Month == "Aug"),"Frequency"] + months[which(months$Month == "08"),"Frequency"] + months[which(months$Month == "8"),"Frequency"]
months[which(months$Month == "Sep"),"Frequency"] = months[which(months$Month == "Sep"),"Frequency"] + months[which(months$Month == "09"),"Frequency"] + months[which(months$Month == "9"),"Frequency"]
months[which(months$Month == "Oct"),"Frequency"] = months[which(months$Month == "Oct"),"Frequency"] + months[which(months$Month == "10"),"Frequency"]
months[which(months$Month == "Nov"),"Frequency"] = months[which(months$Month == "Nov"),"Frequency"] + months[which(months$Month == "11"),"Frequency"]
months[which(months$Month == "Dec"),"Frequency"] = months[which(months$Month == "Dec"),"Frequency"] + months[which(months$Month == "12"),"Frequency"]
months = subset(months, Month %in% c("Jan","Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"))
months$MonthN = c(4,8,12,2,1,7,6,3,5,11,19,9)
months = months[order(months$MonthN),]
months$MonthN = as.factor(months$MonthN)
ggplot(months, aes(MonthN, y=Frequency, fill = MonthN)) + geom_histogram(stat="identity", show.legend = F) + ggtitle("Month of Travel, N=241") + scale_x_discrete(labels=months$Month)

### Activities
vacays = subset(vacations, Activities != "")
activities = c()
for (i in c(1:nrow(vacays))) {
  act = as.character(vacays$Activities[i])
  act = tolower(act)
  act = gsub(", ", ";", act)
  act = gsub("/", ";", act)
  act = gsub("\\n", ";", act)
  act = gsub("!", ";", act)
  act = gsub("\\.", ";", act)
  act = gsub(" ", ";", act)
  act = gsub("\\(", ";", act)
  act = gsub("\\)", ";", act)
  act = gsub(",", ";", act)
  act = gsub(":", ";", act)
  act = strsplit(act, ";")[[1]]
  activities = c(activities, act)
}
activities = activities[ !(activities %in% stopwords(kind = "en")) ]
activities = activities[ activities != ""]
activitiesCombined = c()
for (act1 in activities) {
  repeated = F
  for (act2 in activities) {
    if (grepl(act1, act2) && act1 != act2) {
      repeated = T
      activitiesCombined = c(activitiesCombined, act2)
      print(act1)
      print(act2)
      break
    }
  }
  if (!repeated) activitiesCombined = c(activitiesCombined, act1)
}
activities = activitiesCombined
allActs = data.frame(table(activities))
colnames(allActs) = c("Activity", "Frequency")
allActs = allActs[ order(allActs$Frequency, decreasing=T), ]
commonActs = subset(allActs, Frequency > 10)
nrow(subset(vacations, Activities != ""))
commonActs$Pct = round( 100 * (commonActs$Frequency / nrow(subset(vacations, Activities != "")) ), 1)
colnames(commonActs) = c("Activity", "Frequency", "Pct")
ggplot(commonActs, aes(x=Activity, y=Frequency, fill=Activity)) + geom_bar(stat="identity", show.legend=T) + scale_y_continuous(breaks=seq(0,100,by=10)) + scale_x_discrete(labels=abbreviate) + ggtitle("Number Mentioned Activity (min. 10), N=241")
