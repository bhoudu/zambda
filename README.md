# Zambda: zipping things for  AWS Lambda

Zambda is a basic CLI to package files in a zip based on JSON file.

## Usage

Installation


    yarn install zambda


Configuration example file

    {
        "workDir": "zambda-dist",
        "zip": {
            "name": "my_lambda.zip",
        "folders": [
            "config"
        ],
        "files": [
            {
                "source": "webpack-build/lambda_handler.js",
                "destination": "handler.js"
            },
            {
                "source": "webpack-build/lambda.handler.js.map",
                "destination": "handler.js.map"
            },
            {
                "source": "resources/myfile.splash"
            }
        ]
    }

Example of command

    zambda lambda_handler.zambda.json

This will procuce a zip file `my_lambda.zip` in `zambda-dist` folder.