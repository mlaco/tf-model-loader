# tf-model-loader

Tensorflow model loader for Webpack

## Installation

This package hasn't been added to npm yet.

```
// Download the package
git clone https://github.com/mlaco/tf-model-loader.git

cd <your-project-path>

// Link the package
(cd <path to tf-model-loader>; npm link)
npm link tf-model-loader
```

## Setup

Place your Tensorflow model in the root of your project

```
your-project
  model
    model.json
    group1-shard1ofn
    ...
```

Then run the loader

```
npx webpack
```
