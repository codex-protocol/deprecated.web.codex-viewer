module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    // disable max line length
    'max-len': 'off',

    // allow console.logs, base airbnb warns
    'no-console': 'off',

    // allow padded blocks
    'padded-blocks': 'off',

    // dissallow semi colons
    semi: ['error', 'never'],

    // allow variables that begin with _
    'no-underscore-dangle': 'off',

    // auto-add semi colons in front of lines that could cause problems (e.g.
    //  open parens)
    'semi-style': ['error', 'first'],

    // this is actually redundant, already in base airbnb... will leave in case
    //  they change it
    'no-mixed-spaces-and-tabs': 'error',

    // always requires parens around arrow function params
    'arrow-parens': ['error', 'always'],

    // always requires arrow function bodies {}
    'arrow-body-style': ['error', 'always'],

    // this could be removed I suppose. it allows you to write shorter while()
    //  loops and such, which never really happens much anyway
    'no-cond-assign': ['error', 'except-parens'],

    // this is actually redundant, already in base airbnb... will leave in case
    //  they change it
    'comma-dangle': ['error', 'always-multiline'],

    // allows unused vars in arguments, (e.g.
    //  `new Promise((resolve, reject) => {} )` but you never use the reject)
    //
    // this is useful because it lets you know that an argument is available and
    //  what it is even if you're not using it right now
    'no-unused-vars': ['error', { args: 'none' }],

    // they actually changed the base airbnb to be this exact rule, but they
    //  haven't published it to npm yet?
    'function-paren-newline': ['error', 'consistent'],

    // this require you to write multiline comments with // like these comments
    'multiline-comment-style': ['error', 'separate-lines'],

    // allow i++ in for loops, base airbnb has this error for every use of ++
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],

    // do not force array destructuring so you don't have to do
    //  const [yeah] = response.result
    //
    //  instead of
    //
    //  const yeah = response.result[0]
    //
    // this also becomes a pain in the ass when you want the value at index 1
    //  instead of 0
    'prefer-destructuring': ['error', { array: false, object: true }],

    // I think this basically allows you to write a single-line object with more
    //  than 4 keys. airbnb default is this, but forces you to line break if
    //  there are more than 4 keys
    'object-curly-newline': ['error', { ObjectExpression: { multiline: true, consistent: true } }],

    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never',
    }],

    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'currentState', // for vuex state
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
      ],
    }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
