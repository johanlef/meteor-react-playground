# Meteor email to AWS SES

## Installation

Put `email` (not `lef:awsses`!) in your meteor package file. This will overwrite meteor's own email package.

## Usage

In production correctly set the `ses` settings. In development the email will be outputted to the terminal when no settings are present.

```JSON
{
  "ses": {
    "sendingRate": 12,
    "accesskey": "accesskey",
    "secret": "secret",
    "region": "eu-west-1"
  }
}
```
