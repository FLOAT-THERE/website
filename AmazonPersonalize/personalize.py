#Solution version ARN: arn:aws:personalize:us-east-1:214537708097:solution/ft_solution2/214d2000
#Name: ft_campaign ARN: arn:aws:personalize:us-east-1:214537708097:campaign/ft_campaign

import boto3

#personalize = boto3.client('personalize')
personalizeRt = boto3.client('personalize-runtime')

print ('Creating solution')
response = personalize.create_solution(
    name = "ft_solution2",
    datasetGroupArn = "arn:aws:personalize:us-east-1:214537708097:dataset-group/InteractionDatasetGroup",
    performAutoML = False,
    performHPO = True,
    recipeArn = 'arn:aws:personalize:::recipe/aws-hrnn',
    )

# Get the solution ARN.
solution_arn = response['solutionArn']
print('Solution ARN: ' + solution_arn)

# Use the solution ARN to get the solution status.
solution_description = personalize.describe_solution(solutionArn = solution_arn)['solution']
print('Solution status: ' + solution_description['status'])

# Use the solution ARN to create a solution version.
print ('Creating solution version')
response = personalize.create_solution_version(solutionArn = solution_arn)
solution_version_arn = response['solutionVersionArn']
print('Solution version ARN: ' + solution_version_arn)

# Use the solution version ARN to get the solution version status.
solution_version_description = personalize.describe_solution_version(
    solutionVersionArn = solution_version_arn)['solutionVersion']
print('Solution version status: ' + solution_version_description['status'])



response = personalize.get_solution_metrics(
    solutionVersionArn = 'arn:aws:personalize:us-east-1:214537708097:solution/ft_solution2')

print(response['metrics'])



response = personalize.create_campaign(
    name = 'ft_campaign',
    solutionVersionArn = 'arn:aws:personalize:us-east-1:214537708097:solution/ft_solution2/214d2000',
    minProvisionedTPS = 1)

arn = response['campaignArn']

description = personalize.describe_campaign(campaignArn = arn)['campaign']
print('Name: ' + description['name'])
print('ARN: ' + description['campaignArn'])
print('Status: ' + description['status'])


response = personalizeRt.get_recommendations(
    campaignArn = 'arn:aws:personalize:us-east-1:214537708097:campaign/ft_campaign',
    userId = 'c64d7167-5730-4a1f-9896-91ab5902c4b8')

print("Recommended items")
for item in response['itemList']:
    print (item['itemId'])









