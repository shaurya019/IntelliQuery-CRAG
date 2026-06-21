import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

from app.core.config import settings

boto_config = Config(
    retries={
        "max_attempts": 3,
        "mode": "standard"
    },
    connect_timeout=5,
    read_timeout=10
)


def get_dynamodb_resources():
    """
    Creates DynamoDB resource client.
    In production, prefer IAM Role instead of AWS keys.
    """
    
    if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
        return boto3.resource(
            "dynamodb",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=boto_config
        )
        
    return boto3.resource(
        "dynamodb",
        region_name=settings.AWS_REGION,
        config=boto_config
    )
    

dynamodb = get_dynamodb_resources()
client = dynamodb.meta.client


def get_users_table():
    return dynamodb.Table(settings.DYNAMODB_USERS_TABLE)


def get_documents_table():
    return dynamodb.Table(settings.DYNAMODB_DOCUMENTS_TABLE)


def get_chats_table():
    return dynamodb.Table(settings.DYNAMODB_CHATS_TABLE)


def ensure_users_table() -> None:
    table_name = settings.DYNAMODB_USERS_TABLE

    try:
        client.describe_table(TableName=table_name)
        return
    except ClientError as exc:
        error_code = exc.response.get("Error", {}).get("Code")
        if error_code != "ResourceNotFoundException":
            raise

    client.create_table(
        TableName=table_name,
        AttributeDefinitions=[
            {"AttributeName": "email", "AttributeType": "S"},
        ],
        KeySchema=[
            {"AttributeName": "email", "KeyType": "HASH"},
        ],
        BillingMode="PAY_PER_REQUEST",
    )

    waiter = client.get_waiter("table_exists")
    waiter.wait(TableName=table_name)
