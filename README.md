# helm-tools

CLI tool to interact with Helm Charts

## Installation

Install the CLI tool as a dev dependency:

    yarn add --dev helm-tools

## Usage

Bump a Helm Chart based on the version of an NPM package:

    helm-tools bump .helm

Pack a Helm Chart into an archive:

    helm-tools pack .helm
