# Zambda: zipping things for AWS Lambda
[![npm version](https://badge.fury.io/js/zambda.svg)](https://badge.fury.io/js/zambda) [![Build Status](https://github.com/bhoudu/zambda/actions/workflows/build.yml/badge.svg?branch=develop)](https://github.com/bhoudu/zambda/actions?query=branch%3Adevelop)

Zambda is a basic CLI to package files in a zip based on JSON file.

Installation


    yarn install -g zambda


You then write a JSON zambda configuration file `lambda_handler.zambda.json` for instance.

    {
        "workDir": "zambda-dist",
        "zip": {
            "name": "my_lambda.zip",
        },
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

You run zambda with your conf file as parameter.

    zambda lambda_handler.zambda.json

This will procuce a zip file `my_lambda.zip` in `zambda-dist` folder as a result.