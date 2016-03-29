
# lotus-lab v1.0.0 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

```sh
npm install -g aleclarson/lotus-lab#1.0.0
```

&nbsp;

## usage

In your `$LOTUS_PATH/lotus-config.coffee` file:

```CoffeeScript
module.exports =
  plugins:
    lab: "lotus-lab"
```

From your terminal:

```sh
# Start a REPL.
lotus lab

# Debug 'my-module/lab/index.coffee'.
lotus lab my-module

# Debug any source file.
lotus lab sandbox/some-test.coffee
```

&nbsp;
