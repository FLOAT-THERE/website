#Schema ARN:arn:aws:personalize:us-east-1:214537708097:schema/InteractionSchema
#Name: InteractionDatasetGroup
#Dataset Group ARN: arn:aws:personalize:us-east-1:214537708097:dataset-group/InteractionDatasetGroup
#Dataset Arn: arn:aws:personalize:us-east-1:214537708097:dataset/InteractionDatasetGroup/INTERACTIONS
#Dataset Import Job arn: arn:aws:personalize:us-east-1:214537708097:dataset-import-job/InteractionImportJob
#Name: InteractionImportJob
#ARN: arn:aws:personalize:us-east-1:214537708097:dataset-import-job/InteractionImportJob
#eventTracker: arn:aws:personalize:us-east-1:214537708097:event-tracker/34f45b2e
#trackingID: e0ddaab5-8659-43bf-a55b-a225af5354b0


#Warning: each sections are meant to be executed separately, since some of the functions need some time to execute on the aws end. 

import boto3

personalize = boto3.client('personalize')


with open('interaction_schema.json') as f:
    createSchemaResponse = personalize.create_schema(
        name = 'InteractionSchema',
        schema = f.read()
    )

schema_arn = createSchemaResponse['schemaArn']

print('Schema ARN:' + schema_arn )


########################################

response = personalize.create_dataset_group(name = 'InteractionDatasetGroup')
dsg_arn = response['datasetGroupArn']
description = personalize.describe_dataset_group(datasetGroupArn = dsg_arn)['datasetGroup']

print('Name: ' + description['name'])
print('ARN: ' + description['datasetGroupArn'])
print('Status: ' + description['status']) #Pending for a while

#######################################
schema_arn = 'arn:aws:personalize:us-east-1:214537708097:schema/InteractionSchema'
dsg_arn = 'arn:aws:personalize:us-east-1:214537708097:dataset-group/InteractionDatasetGroup'
response = personalize.create_dataset(
    name = 'YourDataset',
    schemaArn = schema_arn,
    datasetGroupArn = dsg_arn,
    datasetType = 'Interactions')

ds_arn = response['datasetArn']
print ('Dataset Arn: ' + response['datasetArn'])

########################################

response = personalize.create_dataset_import_job(
    jobName = 'InteractionImportJob',
    datasetArn = 'arn:aws:personalize:us-east-1:214537708097:dataset/InteractionDatasetGroup/INTERACTIONS',
    dataSource = {'dataLocation':'s3://personalize-linda/ft-interactions.csv'},
    roleArn = 'arn:aws:iam::214537708097:role/PersonalizeRole')

dsij_arn = response['datasetImportJobArn']

print ('Dataset Import Job arn: ' + dsij_arn)

description = personalize.describe_dataset_import_job(
    datasetImportJobArn = dsij_arn)['datasetImportJob']

print('Name: ' + description['jobName'])
print('ARN: ' + description['datasetImportJobArn'])
print('Status: ' + description['status'])

########################################

response = personalize.create_event_tracker(
    name = 'InteractionTracker',
    datasetGroupArn = 'arn:aws:personalize:us-east-1:214537708097:dataset-group/InteractionDatasetGroup'
)
print(response['eventTrackerArn'])
print(response['trackingId'])

