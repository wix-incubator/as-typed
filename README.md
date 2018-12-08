# as-typed
Ambient mapping from JSON schema to typescript, without transpilation.
Use JSON schemas as a first-class citizen in Typescript.

## Overview
There are many tools that convert between Typescript and JSON schema. Howewever, all of them do that with a transpilation step.
Ambison uses the deep inference options in typescript 3 to infer the types directly from the JSON schema.

This is not a runtime library - it contains only a single generic type, AsTyped.
AsTyped can take any Json schema and AsTypeds it to a typescript type.


## Example Usage
As-typed is ambient only. To use, simply use the JSON schema as a **type** passed to the `AsTyped` generic type instead of as a value.
For example:
`AsTyped<{type: 'string'}>` will resolve to the typescript type `string`, and `AsTyped<{type: 'object' properties: {foo: {type: 'string'}}}>` will resolve to `{foo: string}` in typescript.


## Conversion Details
Every JSON schema type casts to a particular typescript type, as far as possible by language limitations.
The following is a table of how JSON schema types translate to Typescript types with asTyped

### Primitive types
* `AsTyped<{type: 'string'}>` === `string`
* `AsTyped<{type: 'number'}>` === `number`
* `AsTyped<{type: 'boolean'}>` === `boolean`
* `AsTyped<{type: 'null'}>` === `null`
* `AsTyped<{type: 'undefined'}>` === `undefined`

#### Limitations
* Patterns are not supported. 
  There is no regex validation in typescript
  [Typescript issue 6579][https://github.com/Microsoft/TypeScript/issues/6579]

* Value validation (min, max etc) is not supported
  Typescript is not meant for value checking (at least currently).

### Defined objects
* `AsTyped<{type: 'object', properties: {foo: {type: 'number'}}>` === `{foo?: number}`

#### with required properties
* `AsTyped<{type: 'object', properties: {foo: {type: 'number'}, bar: {type: 'string}, required: ['foo']}>` === `{foo: number, bar?: string}`

#### objects with a specific value type
`AsTyped<{type: 'array', items: [{type: 'number'}, {type: 'string'}], additionalItems: {type: 'boolean'}}>` === `[number, string, ...boolean[]]`

### Recursive objects and arrays
* `AsTyped<{type: 'array', items: {type: 'array', items: {type: 'string'}}}>` === `string[][]`
* `AsTyped<{type: 'object', properties: {arr: {type: 'array', items: {type: 'object', additionalProperties: {type: 'string'}}}}}` === `{arr: {[name: string]: string}[]}`

### Simple array
* `AsTyped<{type: 'array', items: {type: 'string`}}>` === `string[]`

### Tuple
* `AsTyped<{type: 'array', items: [{type: 'string'}, {type: 'number'}]}>` === `[string, number]`

#### Limitations
Due to typescript's missing variadic features, the max number of items in a tuple needs to be hardcoded, currently to 10.
[Typescript issue 5453](https://github.com/Microsoft/TypeScript/issues/5453)

### Tuple with additional items
* `AsTyped<{type: 'array', items: [{type: 'string'}, {type: 'number'}], additionalItems: {type: 'string'}}}>` === `[string, number, ...string[]]`

### Recursive reference by $id
#### Simple references:
* `AsTyped<{definitions: {foo: {$id: 'foo', type: 'number'}}, $ref: 'foo'}>` === `number`

#### Deep references:
* `AsTyped<{definitions: {str1: {$id: 'str1', $ref: 'str2'}, str2: {$id: 'str2', type: 'string'}}, $ref: 'str1'}>` === `string`

#### Limitations
Reference by URL ('#/definitions/foo', 'other.json/foo') are not supported.
Typescript doesn't allow inference by partial strings
[Typescript Issue 12754](https://github.com/Microsoft/TypeScript/issues/12754)

### not
`Not` works mainly on primitive types, e.g. `AsTyped<{not: {type: 'string'}}>` will resolve to `number | object | any[] | boolean`

### oneOf
`AsTyped<{oneOf: [{type: 'string'}, {type: 'number'}]}>` === `string | number`

### allOf
`AsTyped<{allOf: [{type: 'object', properties: {a: {type: 'number'}}}, {type: 'object', properties: {b: {type: 'string'}}}]}>` === `{a?: number, b?: string}`

### anyOf
`AsTyped<{allOf: [{type: 'object', properties: {a: {type: 'number'}}}, {type: 'object', properties: {b: {type: 'string'}}, required: ['b']}]}>` === `{a?: number, b: string} | {a?: number} | {b: string}`

#### Limitations
`anyOf` creates all the possible allOf/oneOf combinations of its items. For n items, it will have 2ⁿ - 1 possible typescript types. 
`anyOf` works great for 2-3 items, but for e.g. 8 items it will create 255 different type combinations. In this case, it's better to use `allOf`/`oneOf` and better craft the schema.
Due to typescript limitations in variadic features, the limitation of `anyOf` items is hard-coded, currently to 6.
[Typescript issue 5453](https://github.com/Microsoft/TypeScript/issues/5453)

### If/Then/Else
`AsTyped<{If: {type: 'object', properties: {a: {type: 'number'}}}, Then: {type: 'object', properties: {b: {type: 'string'}}}, Else: {type: 'object', properties: {c: {type: 'array', items: {type: 'string'}}}}}>`
 === `{a?: string, b?: string} | {c: string[]}`

 #### Limitations/Comments
`If/Then/Else` acts exactly like `{oneOf: [{allOf: [If, Then]}, Else]}`. It's strange to have this sugar in the schema which doesn't reduce the verbosity.
