import {AsTyped} from './index'

// should be valid
const myNumber: AsTyped<{type: 'number'}> = 1 // number
const myString: AsTyped<{type: 'string'}> = 'hello' // string
const myBool: AsTyped<{type: 'boolean'}> = true // boolean
const myNull: AsTyped<{type: 'null'}> = null // null
const undef: AsTyped<{type: 'undefined'}> = undefined // undefined
const directRef: AsTyped<{definitions: {num: {$id: 'def', type: 'number'}}, $ref: 'def'}> = 1 // number
const recursiveRef: AsTyped<{definitions: {str1: {$id: 'def', $ref: 'def2'}, str2: {$id: 'def2', type: 'string'}}, $ref: 'def'}> = '1' // string
const arrayOfNumbers: AsTyped<{type: 'array', items: {type: 'number'}}> = [1, 2, 3] // number[]
const arrayOfStrings: AsTyped<{type: 'array', items: {type: 'string'}}> = ['1', '2', '3'] // string[]
const arrayOfBool: AsTyped<{type: 'array', items: {type: 'boolean'}}> = [true, false] // boolean[]
const arrayOfArraysOfStrings: AsTyped<{type: 'array', items: {type: 'array', items: {type: 'string'}}}> = [['1', '2']] // string[][]
const objectOfBool: AsTyped<{type: 'object', properties: {b: {type: 'boolean'}}}> = {b: true} // {b?: boolean}
const objectWithNumberAndString: AsTyped<{type: 'object', properties: {a: {type: 'number'}, b: {type: 'string'}}}> = {a: 3, b: '1'} // {a?: number, b?: string}
const objectOfAnyNumbers: AsTyped<{type: 'object', additionalProperties: {type: 'number'}}> = {xfg: 3, dhi: 1} // {[name: string]: number}
const reqProps: AsTyped<{type: 'object', properties: {a: {type: 'number'}, b: {type: 'string'}}, required: ['a']}> = {a: 3, b: '5'} // {a: number, b?: string}
const not: AsTyped<{not: {type: 'number'}}> = '1'
const not2: AsTyped<{not: {type: 'string'}}> = {a: '1'}
const oneOf: AsTyped<{oneOf: [{type: 'string'}, {type: 'number'}]}> = 1 // string | number
const oneOfObject: AsTyped<{oneOf: [{type: 'string'}, {type: 'object', properties: {a: {type: 'number'}}}]}> = {a: 1} // string | {a: number}
const allOf: AsTyped<{allOf: [{type: 'object', properties: {a: {type: 'number'}}}, {type: 'object', properties: {b: {type: 'string'}}}]}> = {a: 1, b: 'str'} // {a: number} & {b: string}
const tuple: AsTyped<{type: 'array', items: [{type: 'number'}, {type: 'string'}]}> = [1, '123'] // [number, string]
const tupleWithAdditional: AsTyped<{type: 'array', items: [{type: 'number'}, {type: 'string'}], additionalItems: {type: 'string'}}> = [1, '123', 'abc'] // [number, string, ...string[]]
const tupleWithAdditionalObject: AsTyped<{type: 'array', items: [{type: 'number'}, {type: 'string'}], additionalItems: {type: 'object', properties: {bla: {type: 'string'}}}}> = [1, '123', {bla: 'abc'}] // [number, string, ...{bla: string}[]]
const recursiveObject: AsTyped<{type: 'object', properties: {arr: {type: 'array', items: {type: 'object', additionalProperties: {type: 'string'}}}}}> = {arr: [{somthing: '1'}]} // {arr: {[name: string]: string}[]}
const IfThenElse1: AsTyped<{If: {type: 'object', properties: {a: {type: 'number'}}}, Then: {type: 'object', properties: {b: {type: 'string'}}}, Else: {type: 'object', properties: {c: {type: 'array', items: {type: 'string'}}}}}> = {a: '1', b: '2'}
const WithConst: AsTyped<{type: 'object', properties: {a: {type: 'string', const: '123'}}}> = {a: '123'}
const withEnum: AsTyped<{type: 'string', enum: ['123', '456']}> = '123'

// should be invalid
const numberAndString: AsTyped<{type: 'number'}> = '123' // number
const stringAndNumber: AsTyped<{type: 'string'}> = 123 // string
const propsAndAdditional: AsTyped<{type: 'object', properties: {a: {type: 'number'}}}> = {a: 1, b: '123', c: 3} // {a?: number}
const MissingReqProps: AsTyped<{type: 'object', properties: {a: {type: 'number'}, b: {type: 'string'}}, required: ['a']}> = {b: '3'} // {a: number, b?: string}
const notBad: AsTyped<{not: {type: 'number'}}> = 1 // anything but number
const oneOfBad: AsTyped<{oneOf: [{type: 'string'}, {type: 'number'}]}> = {} // string|number
const oneOfObjectBad: AsTyped<{oneOf: [{type: 'string'}, {type: 'object', properties: {a: {type: 'number'}}}]}> = {a: '123'} // string | {a: number}
const withEnumBad: AsTyped<{type: 'string', enum: ['123', '456']}> = '789'
const withConstBad: AsTyped<{type: 'string', const: '123'}> = '789'

// TODO: Should be invalid but currently pass
const oneOfWithAllOf: AsTyped<{oneOf: [{type: 'object', properties: {a: {type: 'string'}}}, {type: 'object', properties: {b: {type: 'number'}}}]}> = {a: '123', b: 3} // string|number
const IfThenElseBad: AsTyped<{If: {type: 'object', properties: {a: {type: 'number'}}}, Then: {type: 'object', properties: {b: {type: 'string'}}}, Else: {type: 'object', properties: {c: {type: 'array', items: {type: 'string'}}}}}> = {a: '1', b: '2', c:['3']}
