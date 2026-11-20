import eslint from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import typescript from '@typescript-eslint/eslint-plugin';
import vue from 'eslint-plugin-vue';

const style = {
    'plugins': {
        '@stylistic': stylistic,
        '@stylistic/js': stylistic,
        '@stylistic/ts': stylistic
    },
    'files': [
        '**/*.ts',
        '**/*.js',
        '**/*.mjs',
        '**/*.cjs',
        '**/*.tsx',
        '**/*.jsx'
    ],
    'rules': {
        'sort-imports': [
            'warn',
            {
                'ignoreCase': false,
                'ignoreDeclarationSort': false,
                'ignoreMemberSort': false,
                'memberSyntaxSortOrder': [
                    'none',
                    'all',
                    'multiple',
                    'single'
                ],
                'allowSeparatedGroups': false
            }
        ],
        // Formatting
        '@stylistic/array-bracket-newline': [
            'error',
            {
                'multiline': false,
                'minItems': 2
            }
        ],
        '@stylistic/array-bracket-spacing': [
            'error',
            'always'
        ],
        '@stylistic/array-element-newline': [
            'error',
            {
                'consistent': false,
                'multiline': false,
                'minItems': 2
            }
        ],
        '@stylistic/arrow-parens': [
            'error',
            'as-needed'
        ],
        '@stylistic/arrow-spacing': [
            'error',
            {
                'before': true,
                'after': true
            }
        ],
        '@stylistic/block-spacing': [
            'error',
            'always'
        ],
        '@stylistic/brace-style': [
            'error',
            '1tbs',
            {
                'allowSingleLine': false
            }
        ],
        '@stylistic/comma-dangle': [
            'error',
            'never'
        ],
        '@stylistic/comma-spacing': [
            'error',
            {
                'before': false,
                'after': true
            }
        ],
        '@stylistic/comma-style': [
            'error',
            'last'
        ],
        '@stylistic/dot-location': [
            'error',
            'property'
        ],
        '@stylistic/function-call-argument-newline': [
            'error',
            'consistent'
        ],
        '@stylistic/function-call-spacing': [
            'error',
            'never'
        ],
        '@stylistic/function-paren-newline': [
            'error',
            'multiline-arguments'
        ],
        '@stylistic/implicit-arrow-linebreak': [
            'error',
            'beside'
        ],
        '@stylistic/indent': [
            'error',
            4
        ],
        '@stylistic/indent-binary-ops': [
            'error',
            4
        ],
        '@stylistic/key-spacing': [
            'error',
            {
                'beforeColon': false,
                'afterColon': true
            }
        ],
        '@stylistic/keyword-spacing': [
            'error',
            {
                'before': true,
                'after': true
            }
        ],
        '@stylistic/lines-between-class-members': [
            'error',
            'always'
        ],
        '@stylistic/max-len': [
            'warn',
            {
                'code': 140,
                'comments': 160,
                'ignoreComments': false,
                'ignoreUrls': true,
                'ignoreStrings': true,
                'ignoreTemplateLiterals': true,
                'ignoreRegExpLiterals': true
            }
        ],
        '@stylistic/max-statements-per-line': [
            'error',
            {
                'max': 1
            }
        ],
        '@stylistic/multiline-ternary': [
            'error',
            'always-multiline'
        ],
        '@stylistic/new-parens': [
            'error',
            'always'
        ],
        '@stylistic/newline-per-chained-call': 'error',
        '@stylistic/no-confusing-arrow': 'error',
        '@stylistic/no-extra-parens': [
            'error',
            'all',
            {
                'nestedBinaryExpressions': false,
                'ternaryOperandBinaryExpressions': false,
                'ignoreJSX': 'multi-line',
                'nestedConditionalExpressions': false
            }
        ],
        '@stylistic/no-extra-semi': 'error',
        '@stylistic/no-floating-decimal': 'error',
        '@stylistic/no-mixed-operators': 'error',
        '@stylistic/no-mixed-spaces-and-tabs': 'error',
        '@stylistic/no-multi-spaces': 'error',
        '@stylistic/no-multiple-empty-lines': [
            'error',
            {
                'max': 3,
                'maxEOF': 2
            }
        ],
        '@stylistic/no-tabs': 'error',
        '@stylistic/no-trailing-spaces': 'error',
        '@stylistic/no-whitespace-before-property': 'error',
        '@stylistic/object-curly-newline': [
            'error',
            {
                'multiline': true,
                'minProperties': 1
            }
        ],
        '@stylistic/object-curly-spacing': [
            'error',
            'always'
        ],
        '@stylistic/object-property-newline': 'error',
        '@stylistic/one-var-declaration-per-line': 'error',
        '@stylistic/operator-linebreak': [
            'error',
            'before'
        ],
        '@stylistic/padded-blocks': [
            'error',
            {
                'blocks': 'never',
                'classes': 'always',
                'switches': 'never'
            }
        ],

        // Padding lines. The most in-depth part of this config
        '@stylistic/padding-line-between-statements': [
            'error',
            // Variables, Constants
            {
                'blankLine': 'never',
                'prev': 'var',
                'next': 'var'
            },
            {
                'blankLine': 'never',
                'prev': 'let',
                'next': 'let'
            },
            {
                'blankLine': 'never',
                'prev': 'const',
                'next': 'const'
            },
            {
                'blankLine': 'always',
                'prev': 'var',
                'next': [
                    'block',
                    'block-like',
                    'break',
                    'cjs-export',
                    'cjs-import',
                    'class',
                    'const',
                    'continue',
                    'debugger',
                    'directive',
                    'do',
                    'empty',
                    'export',
                    'expression',
                    'for',
                    'function',
                    'if',
                    'iife',
                    'import',
                    'let',
                    'return',
                    'switch',
                    'throw',
                    'try',
                    'var',
                    'with'
                ]
            },
            {
                'blankLine': 'always',
                'prev': 'let',
                'next': [
                    'block',
                    'block-like',
                    'break',
                    'cjs-export',
                    'cjs-import',
                    'class',
                    'const',
                    'continue',
                    'debugger',
                    'directive',
                    'do',
                    'empty',
                    'export',
                    'expression',
                    'for',
                    'function',
                    'if',
                    'iife',
                    'import',
                    'return',
                    'switch',
                    'throw',
                    'try',
                    'var',
                    'while',
                    'with'
                ]
            },
            {
                'blankLine': 'always',
                'prev': 'const',
                'next': [
                    'block',
                    'block-like',
                    'break',
                    'cjs-export',
                    'cjs-import',
                    'class',
                    'continue',
                    'debugger',
                    'directive',
                    'do',
                    'empty',
                    'export',
                    'expression',
                    'for',
                    'function',
                    'if',
                    'iife',
                    'import',
                    'let',
                    'return',
                    'switch',
                    'throw',
                    'try',
                    'var',
                    'while',
                    'with'
                ]
            },
            // Import
            {
                'blankLine': 'never',
                'prev': 'import',
                'next': 'import'
            },
            {
                'blankLine': 'never',
                'prev': 'cjs-import',
                'next': 'cjs-import'
            },
            {
                'blankLine': 'always',
                'prev': [
                    'block',
                    'block-like',
                    'break',
                    'cjs-export',
                    'class',
                    'const',
                    'continue',
                    'debugger',
                    'directive',
                    'do',
                    'empty',
                    'export',
                    'expression',
                    'for',
                    'function',
                    'if',
                    'iife',
                    'let',
                    'return',
                    'switch',
                    'throw',
                    'try',
                    'var',
                    'while',
                    'with'
                ],
                'next': 'cjs-import'
            },
            {
                'blankLine': 'always',
                'prev': 'cjs-import',
                'next': [
                    'block',
                    'block-like',
                    'break',
                    'cjs-export',
                    'class',
                    'const',
                    'continue',
                    'debugger',
                    'directive',
                    'do',
                    'empty',
                    'export',
                    'expression',
                    'for',
                    'function',
                    'if',
                    'iife',
                    'let',
                    'return',
                    'switch',
                    'throw',
                    'try',
                    'var',
                    'while',
                    'with'
                ]
            },
            {
                'blankLine': 'always',
                'prev': [
                    'block',
                    'block-like',
                    'break',
                    'cjs-export',
                    'class',
                    'const',
                    'continue',
                    'debugger',
                    'directive',
                    'do',
                    'empty',
                    'export',
                    'expression',
                    'for',
                    'function',
                    'if',
                    'iife',
                    'let',
                    'return',
                    'switch',
                    'throw',
                    'try',
                    'var',
                    'while',
                    'with'
                ],
                'next': 'import'
            },
            {
                'blankLine': 'always',
                'prev': 'import',
                'next': [
                    'block',
                    'block-like',
                    'break',
                    'cjs-export',
                    'class',
                    'const',
                    'continue',
                    'debugger',
                    'directive',
                    'do',
                    'empty',
                    'export',
                    'expression',
                    'for',
                    'function',
                    'if',
                    'iife',
                    'let',
                    'return',
                    'switch',
                    'throw',
                    'try',
                    'var',
                    'while',
                    'with'
                ]
            },
            // If
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'if'
            },
            {
                'blankLine': 'always',
                'prev': 'if',
                'next': '*'
            },
            // For
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'for'
            },
            {
                'blankLine': 'always',
                'prev': 'for',
                'next': '*'
            },
            // While
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'while'
            },
            {
                'blankLine': 'always',
                'prev': 'while',
                'next': '*'
            },
            // Functions
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'function'
            },
            {
                'blankLine': 'always',
                'prev': 'function',
                'next': '*'
            },
            // Block Statements
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'block-like'
            },
            {
                'blankLine': 'always',
                'prev': 'block-like',
                'next': '*'
            },
            // Switch
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'switch'
            },
            {
                'blankLine': 'always',
                'prev': 'switch',
                'next': '*'
            },
            // Try-Catch
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'try'
            },
            {
                'blankLine': 'always',
                'prev': 'try',
                'next': '*'
            },
            // Throw
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'throw'
            },
            {
                'blankLine': 'always',
                'prev': 'throw',
                'next': '*'
            },
            // Return
            {
                'blankLine': 'never',
                'prev': 'return',
                'next': '*'
            },
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'return'
            },
            // Export
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'export'
            },
            {
                'blankLine': 'always',
                'prev': 'export',
                'next': '*'
            },
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'cjs-export'
            },
            {
                'blankLine': 'always',
                'prev': 'cjs-export',
                'next': '*'
            },
            // Classes
            {
                'blankLine': 'always',
                'prev': '*',
                'next': 'class'
            },
            {
                'blankLine': 'always',
                'prev': 'class',
                'next': '*'
            }
        ],
        '@stylistic/quote-props': [
            'error',
            'always'
        ],
        '@stylistic/quotes': [
            'error',
            'single'
        ],
        '@stylistic/rest-spread-spacing': [
            'error',
            'never'
        ],
        '@stylistic/semi': [
            'error',
            'always'
        ],
        '@stylistic/semi-spacing': [
            'error',
            {
                'before': false,
                'after': true
            }
        ],
        '@stylistic/semi-style': [
            'error',
            'last'
        ],
        '@stylistic/space-before-blocks': [
            'error',
            'always'
        ],
        '@stylistic/space-before-function-paren': [
            'error',
            'always'
        ],
        '@stylistic/space-in-parens': [
            'error',
            'always'
        ],
        '@stylistic/space-infix-ops': [
            'error',
            {
                'int32Hint': false
            }
        ],
        '@stylistic/space-unary-ops': 'error',
        '@stylistic/spaced-comment': [
            'error',
            'always'
        ],
        '@stylistic/switch-colon-spacing': 'error',
        '@stylistic/template-curly-spacing': [
            'error',
            'always'
        ],
        '@stylistic/template-tag-spacing': [
            'error',
            'always'
        ],
        '@stylistic/type-generic-spacing': 'error',
        '@stylistic/type-named-tuple-spacing': 'error',
        '@stylistic/wrap-iife': [
            'error',
            'inside'
        ],
        '@stylistic/wrap-regex': 'error',
        '@stylistic/ts/type-annotation-spacing': 'error'
    }
};

/** @type {import('eslint').Linter.Config} */
export default tseslint.config(
    // Base JavaScript rules
    eslint.configs.recommended,
    tseslint.configs.recommended,
    style,

    // Vue support (including TS and JSX inside SFCs)
    {
        'files': [ '**/*.vue' ],
        'languageOptions': {
            'sourceType': 'module',
            'ecmaVersion': 'latest',
            'globals': globals.browser,
            'parserOptions': {
                'parser': tseslint.parser
            }
        },
        'plugins': {
            'vue': vue,
            '@stylistic': stylistic,
            '@stylistic/js': stylistic,
            '@stylistic/ts': stylistic,
            '@typescript-eslint': typescript
        },
        'extends': [
            eslint.configs.recommended,
            ...vue.configs['flat/recommended']
        ],
        'rules': {
            ...typescript.configs.recommended.rules,
            ...style.rules,

            // Vue specific rules
            '@stylistic/indent': 'off',
            'vue/html-indent': [
                'error',
                4
            ],
            'vue/html-comment-indent': [
                'error',
                4
            ],
            'vue/script-indent': [
                'error',
                4,
                {
                    'baseIndent': 1,
                    'switchCase': 1
                }
            ],
            'vue/html-self-closing': [
                'error',
                {
                    'html': {
                        'void': 'never',
                        'normal': 'never',
                        'component': 'always'
                    },
                    'svg': 'always',
                    'math': 'never'
                }
            ],
            'vue/max-attributes-per-line': [
                'error',
                {
                    'singleline': 3,
                    'multiline': 1
                }
            ]
        }
    }
);
