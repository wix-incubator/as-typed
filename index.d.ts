declare namespace AsTypedInternal {
    type SchemaBase = {
        $id?: string
        $ref?: string
        type?: string
        const?: any
        title?: string
        description?: string
        default?: any
        exmamples?: any[]
    }
    type DefinitionsBase = {[name: string]: SchemaBase}
    type SchemaWithDefinitions<SchemaDefinitions extends DefinitionsBase> = SchemaBase & {
        definitions: SchemaDefinitions
    }

    type TypeName<T> =
        T extends null ? "null" :
        T extends string ? "string" :
        T extends any[] ? "array" :
        T extends number ? "number" :
        T extends boolean ? "boolean" :
        T extends undefined ? "undefined" :
        T extends Function ? "function" :
        "object";

    type WithID = {$id: string}

    type SchemaDeclaration<Type> = SchemaBase & {type: TypeName<Type>; $id?: string}
    type RefSchema<RefId extends string> = {$ref: RefId}
    type EnumSchema<BaseType, EnumType> = BaseType & {enum: EnumType[]}
    type UnionToIntersection<U> = 
       (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

    type UndefinedSchema = SchemaDeclaration<undefined>

    type NumberSchema = SchemaDeclaration<number>
    type StringSchema = SchemaDeclaration<string> & {
        pattern?: RegExp
        maxLength?: number
        minLength?: number
    }
    type StringEnum<PossibleValue extends string> = EnumSchema<StringSchema, PossibleValue>
    type NumberEnum<PossibleValue extends number> = EnumSchema<NumberSchema, PossibleValue> & {
        multipleOf?: number
        minimun?: number
        exclusiveMinimum?: number
        maximum?: number
        exclusiveMaximum?: number
    }
    type BoolSchema = SchemaDeclaration<boolean>
    type NullSchema = SchemaDeclaration<null>

    type ObjectSchema<Props, ReqProps, AdditionalProps extends SchemaBase|null = null> = SchemaDeclaration<{}> & {
        required?: ReqProps[]
        properties?: Props
        additionalProperties?: AdditionalProps
        maxProperties?: number
        minProperties?: number
        patternProperties?: {[name: string]: SchemaBase}
        dependencies?: {[name: string]: SchemaBase | SchemaBase[]}
        propertyNames?: StringSchema

    }

    type CombinerSchema<ValueType extends SchemaBase, Operator extends string> = {[operator in Operator] : ValueType[]}
    type OperatorSchema<ValueType extends SchemaBase, Operator extends string> = {[operator in Operator] : ValueType}

    type IfThenElseSchema<If extends SchemaBase, Then extends SchemaBase, Else extends SchemaBase> = SchemaBase & {
        If: If
        Then: Then
        Else?: Else
    }

    type AllOf<ValueType extends SchemaBase> = CombinerSchema<ValueType, 'allOf'>
    type OneOf<ValueType extends SchemaBase> = CombinerSchema<ValueType, 'oneOf'>
    type AnyOf<ValueType extends SchemaBase> = CombinerSchema<ValueType, 'anyOf'>

    type Not<ValueType extends SchemaBase> = OperatorSchema<ValueType, 'not'>
    type ArraySchemaBase = SchemaDeclaration<any[]> & {
        maxItems?: number
        minItems?: number
        uniqueItems?: boolean
        contains?: SchemaBase
    }
    type ArraySchema<ValueSchema> = ArraySchemaBase & {items: ValueSchema extends any[] ? never : ValueSchema}

    type TupleSchema<TupleAsArray extends any[], AdditionalItemsSchema = null> = ArraySchemaBase & {
        items: TupleAsArray
        additionalItems?: AdditionalItemsSchema
    }

    type ObjectSchemaToTypedObject<ObjectSchemaType extends ObjectSchema<Props, RequiredPropNames, SchemaForAdditionalProperties>, 
                                    Props,
                                    RequiredPropNames, 
                                    SchemaForAdditionalProperties extends SchemaBase> =
                                    
        (RequiredPropNames extends string ? {[name in RequiredPropNames]: name extends keyof Props ? AsTypedRecursive<Props[name]> : never} : unknown) &
        (Props extends null ? unknown : {[optKey in keyof Props]?: AsTypedRecursive<Props[optKey]>}) & 
        ((SchemaForAdditionalProperties extends null ? unknown : {[key: string]: AsTypedRecursive<SchemaForAdditionalProperties>}))
                                         

    interface ArraySchemaToTyped<ValueType> extends Array<AsTypedRecursive<ValueType>> {}
    
    type AsTypedTupleSchema<Tuple> = 
        Tuple extends [infer A, infer B] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>] : 
        Tuple extends [infer A, infer B, infer C] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>] : 
        Tuple extends [infer A, infer B, infer C, infer D] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E, infer F] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>, AsTypedRecursiveInternal<F>] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>, AsTypedRecursiveInternal<F>, AsTypedRecursiveInternal<G>] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>, AsTypedRecursiveInternal<F>, AsTypedRecursiveInternal<G>, AsTypedRecursiveInternal<H>] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H, infer I] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>, AsTypedRecursiveInternal<F>, AsTypedRecursiveInternal<G>, AsTypedRecursiveInternal<H>, AsTypedRecursiveInternal<I>] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H, infer I, infer J] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>, AsTypedRecursiveInternal<F>, AsTypedRecursiveInternal<G>, AsTypedRecursiveInternal<H>, AsTypedRecursiveInternal<I>, AsTypedRecursiveInternal<J>] : 
        never 

    type AsTypedTupleSchemaWithAdditional<Tuple, Additional> =
        Tuple extends [infer A, infer B] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, ...(AsTypedRecursiveInternal<Additional>[])] :
        Tuple extends [infer A, infer B, infer C] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, ...(AsTypedRecursiveInternal<Additional>[])] : 
        Tuple extends [infer A, infer B, infer C, infer D] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, ...(AsTypedRecursiveInternal<Additional>[])] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>, ...(AsTypedRecursiveInternal<Additional>[])] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E, infer F] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>, AsTypedRecursiveInternal<F>, ...(AsTypedRecursiveInternal<Additional>[])] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>, AsTypedRecursiveInternal<F>, AsTypedRecursiveInternal<G>, ...(AsTypedRecursiveInternal<Additional>[])] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>, AsTypedRecursiveInternal<F>, AsTypedRecursiveInternal<G>, AsTypedRecursiveInternal<H>, ...(AsTypedRecursiveInternal<Additional>[])] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H, infer I] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>, AsTypedRecursiveInternal<F>, AsTypedRecursiveInternal<G>, AsTypedRecursiveInternal<H>, AsTypedRecursiveInternal<I>, ...(AsTypedRecursiveInternal<Additional>[])] : 
        Tuple extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G, infer H, infer I, infer J] ? [AsTypedRecursiveInternal<A>, AsTypedRecursiveInternal<B>, AsTypedRecursiveInternal<C>, AsTypedRecursiveInternal<D>, AsTypedRecursiveInternal<E>, AsTypedRecursiveInternal<F>, AsTypedRecursiveInternal<G>, AsTypedRecursiveInternal<H>, AsTypedRecursiveInternal<I>, AsTypedRecursiveInternal<J>, ...(AsTypedRecursiveInternal<Additional>[])] : 
        never

    // This is very crude
    type ResolveNot<ValueType> = 
        (ValueType extends NullSchema ? never : null) | 
        (ValueType extends NumberSchema ? never : number) | 
        (ValueType extends UndefinedSchema ? never : undefined) | 
        (ValueType extends StringSchema ? never : string) | 
        (ValueType extends ObjectSchema<infer Props, infer Required, infer Additional> ? never : object) | 
        (ValueType extends ArraySchemaBase ? never : any[]) | 
        (ValueType extends BoolSchema ? never : boolean)

    type AsTypedRecursiveInternal<SchemaType> =
        SchemaType extends SchemaDeclaration<null> ? null :
        SchemaType extends StringEnum<infer PossibleValues> ? PossibleValues :
        SchemaType extends NumberEnum<infer PossibleValues> ? PossibleValues :
        SchemaType extends SchemaDeclaration<string> ? string :
        SchemaType extends SchemaDeclaration<boolean> ? boolean :
        SchemaType extends SchemaDeclaration<number> ? number :
        SchemaType extends Not<infer T> ? ResolveNot<T> :
        SchemaType extends ObjectSchema<infer Props, infer Required, infer Additional> ? ObjectSchemaToTypedObject<SchemaType, Props, Required, Additional> :
        SchemaType extends ArraySchema<infer ValueType> ? ArraySchemaToTyped<ValueType> :
        SchemaType extends SchemaDeclaration<typeof undefined> ? undefined :
        never

    type AsTypedRecursive<SchemaType> =
        SchemaType extends SchemaDeclaration<null> ? null :
        SchemaType extends CombinerSchema<infer ValueType, infer Operator> ? ResolveCombiner<ValueType, Operator>:
        SchemaType extends TupleSchema<infer TupleType, infer Additional> ? (Additional extends null ? AsTypedTupleSchema<TupleType> : AsTypedTupleSchemaWithAdditional<TupleType, Additional>) :
        SchemaType extends IfThenElseSchema<infer If, infer Then, infer Else> ? ((AsTypedRecursiveInternal<If> & AsTypedRecursiveInternal<Then>) | AsTypedRecursiveInternal<Else>) :
        AsTypedRecursiveInternal<SchemaType>


    type ResolveAnyOf2<A, B> = AsTypedRecursiveInternal<A> | AsTypedRecursiveInternal<B> | (AsTypedRecursiveInternal<A> & AsTypedRecursiveInternal<B>)
    type ResolveAnyOf3<A, B, C> = ResolveAnyOf2<A, B> | C | (ResolveAnyOf2<A, B> & C)
    type ResolveAnyOf4<A, B, C, D> = ResolveAnyOf3<A, B, C> | D | (ResolveAnyOf3<A, B, C> & C)
    type ResolveAnyOf5<A, B, C, D, E> = ResolveAnyOf4<A, B, C, D> | E | (ResolveAnyOf4<A, B, C, D> & E)
    type ResolveAnyOf6<A, B, C, D, E, F> = ResolveAnyOf5<A, B, C, D, E> | F | (ResolveAnyOf5<A, B, C, D, E> & F)

    type ResolveAnyOf<ValueType> = 
        ValueType extends [infer A, infer B] ? ResolveAnyOf2<A, B> :
        ValueType extends [infer A, infer B, infer C] ? ResolveAnyOf3<A, B, C> :
        ValueType

    type ResolveCombiner<ValueType, Operator> =
        Operator extends 'allOf' ? AsTypedRecursiveInternal<UnionToIntersection<ValueType>> :
        Operator extends 'oneOf' ? AsTypedRecursiveInternal<ValueType> :
        Operator extends 'anyOf' ? ResolveAnyOf<ValueType> :
        never


    type MapPropsToRefs<Props, Definitions extends DefinitionsBase> =    
        Definitions extends {[name: string]: SchemaBase} ? {[name in keyof Props]: ResolveRefs<Props[name], Definitions>} : never

    type ResolveIfThenElseRefs<ITEType extends IfThenElseSchema<If, Then, Else>, If extends SchemaBase, Then extends SchemaBase, Else extends SchemaBase, Definitions extends DefinitionsBase> = 
        SchemaBase & {If: ResolveRefs<If, Definitions>, Then: ResolveRefs<Then, Definitions>, Else: ResolveRefs<Else, Definitions>}

    type ResolveArrayRefs<ArrayType extends ArraySchema<ValueType>, ValueType extends SchemaBase, Definitions extends DefinitionsBase> = 
        SchemaDeclaration<any[]> & {items: ResolveRefs<ValueType, Definitions>}

    type ResolveTupleRefs<TupleType extends TupleSchema<Tuple, Additional>, Tuple extends SchemaBase[], Additional extends SchemaBase, Definitions extends DefinitionsBase> = 
        SchemaDeclaration<any[]> & {items: ResolveRefs<Tuple, Definitions>, additionalItems: ResolveRefs<Additional, Definitions>}

    type ResolveCombinerRefs<CombinerType extends CombinerSchema<ValueType, Operator>, ValueType extends SchemaBase, Operator extends string, Definitions extends DefinitionsBase> = 
        {[name in Operator]: ResolveRefs<ValueType, Definitions>[]}

    type ResolveOperatorRefs<OperatorType extends OperatorSchema<ValueType, Operator>, ValueType extends SchemaBase, Operator extends string, Definitions extends DefinitionsBase> =
        {[name in Operator]: ResolveRefs<ValueType, Definitions>}

    type ResolveDefinitions<Definitions extends DefinitionsBase> = 
        {[DefinitionName in keyof Definitions]: ResolveRefs<Definitions[DefinitionName], Definitions>}

    type ExtractDefinitionsById<Definitions extends DefinitionsBase> = {
        [key in Definitions[keyof Definitions]['$id']]: Definitions[keyof Definitions]
    }

    type ResolveRefs<SchemaToResolve, Definitions extends DefinitionsBase> =
        SchemaToResolve extends RefSchema<infer RefId> ? Definitions[RefId] :
        SchemaToResolve extends ObjectSchema<infer Props, infer Required> ? ObjectSchema<MapPropsToRefs<Props, Definitions>, Required>:
        SchemaToResolve extends TupleSchema<infer Tuple, infer Additional> ? (Tuple extends SchemaBase[] ? ResolveTupleRefs<SchemaToResolve, Tuple, Additional, Definitions> : never) :
        SchemaToResolve extends ArraySchema<infer ValueType> ? ResolveArrayRefs<SchemaToResolve, ValueType, Definitions> :
        SchemaToResolve extends CombinerSchema<infer ValueType, infer Operator> ? ResolveCombinerRefs<SchemaToResolve, ValueType, Operator, Definitions> :
        SchemaToResolve extends OperatorSchema<infer ValueType, infer Operator> ? ResolveOperatorRefs<SchemaToResolve, ValueType, Operator, Definitions> :
        SchemaToResolve extends IfThenElseSchema<infer If, infer Then, infer Else> ? ResolveIfThenElseRefs<SchemaToResolve, If, Then, Else, Definitions> :
            SchemaToResolve


    type ResolveDefinitionsForSchema<Schema> = Schema extends SchemaWithDefinitions<infer D> ? ResolveDefinitions<ExtractDefinitionsById<D>> : null
    export type AsTyped<Schema> = AsTypedRecursive<ResolveRefs<Schema, ResolveDefinitionsForSchema<Schema>>>
}

export type AsTyped<Schema> = AsTypedInternal.AsTyped<Schema>