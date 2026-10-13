
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Empresa
 * 
 */
export type Empresa = $Result.DefaultSelection<Prisma.$EmpresaPayload>
/**
 * Model Usuario
 * 
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>
/**
 * Model Pesquisa
 * 
 */
export type Pesquisa = $Result.DefaultSelection<Prisma.$PesquisaPayload>
/**
 * Model Pergunta
 * 
 */
export type Pergunta = $Result.DefaultSelection<Prisma.$PerguntaPayload>
/**
 * Model OpcaoPergunta
 * 
 */
export type OpcaoPergunta = $Result.DefaultSelection<Prisma.$OpcaoPerguntaPayload>
/**
 * Model PontoColeta
 * 
 */
export type PontoColeta = $Result.DefaultSelection<Prisma.$PontoColetaPayload>
/**
 * Model Resposta
 * 
 */
export type Resposta = $Result.DefaultSelection<Prisma.$RespostaPayload>
/**
 * Model RespostaPergunta
 * 
 */
export type RespostaPergunta = $Result.DefaultSelection<Prisma.$RespostaPerguntaPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TipoPergunta: {
  ESTRELAS: 'ESTRELAS',
  NPS: 'NPS',
  SIM_NAO: 'SIM_NAO',
  TEXTO: 'TEXTO',
  MULTIPLA_ESCOLHA: 'MULTIPLA_ESCOLHA'
};

export type TipoPergunta = (typeof TipoPergunta)[keyof typeof TipoPergunta]


export const StatusPesquisa: {
  RASCUNHO: 'RASCUNHO',
  ATIVA: 'ATIVA',
  ENCERRADA: 'ENCERRADA'
};

export type StatusPesquisa = (typeof StatusPesquisa)[keyof typeof StatusPesquisa]

}

export type TipoPergunta = $Enums.TipoPergunta

export const TipoPergunta: typeof $Enums.TipoPergunta

export type StatusPesquisa = $Enums.StatusPesquisa

export const StatusPesquisa: typeof $Enums.StatusPesquisa

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Empresas
 * const empresas = await prisma.empresa.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Empresas
   * const empresas = await prisma.empresa.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.empresa`: Exposes CRUD operations for the **Empresa** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Empresas
    * const empresas = await prisma.empresa.findMany()
    * ```
    */
  get empresa(): Prisma.EmpresaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pesquisa`: Exposes CRUD operations for the **Pesquisa** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pesquisas
    * const pesquisas = await prisma.pesquisa.findMany()
    * ```
    */
  get pesquisa(): Prisma.PesquisaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pergunta`: Exposes CRUD operations for the **Pergunta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Perguntas
    * const perguntas = await prisma.pergunta.findMany()
    * ```
    */
  get pergunta(): Prisma.PerguntaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.opcaoPergunta`: Exposes CRUD operations for the **OpcaoPergunta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OpcaoPerguntas
    * const opcaoPerguntas = await prisma.opcaoPergunta.findMany()
    * ```
    */
  get opcaoPergunta(): Prisma.OpcaoPerguntaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pontoColeta`: Exposes CRUD operations for the **PontoColeta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PontoColetas
    * const pontoColetas = await prisma.pontoColeta.findMany()
    * ```
    */
  get pontoColeta(): Prisma.PontoColetaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resposta`: Exposes CRUD operations for the **Resposta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Respostas
    * const respostas = await prisma.resposta.findMany()
    * ```
    */
  get resposta(): Prisma.RespostaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.respostaPergunta`: Exposes CRUD operations for the **RespostaPergunta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RespostaPerguntas
    * const respostaPerguntas = await prisma.respostaPergunta.findMany()
    * ```
    */
  get respostaPergunta(): Prisma.RespostaPerguntaDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Empresa: 'Empresa',
    Usuario: 'Usuario',
    Pesquisa: 'Pesquisa',
    Pergunta: 'Pergunta',
    OpcaoPergunta: 'OpcaoPergunta',
    PontoColeta: 'PontoColeta',
    Resposta: 'Resposta',
    RespostaPergunta: 'RespostaPergunta'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "empresa" | "usuario" | "pesquisa" | "pergunta" | "opcaoPergunta" | "pontoColeta" | "resposta" | "respostaPergunta"
      txIsolationLevel: never
    }
    model: {
      Empresa: {
        payload: Prisma.$EmpresaPayload<ExtArgs>
        fields: Prisma.EmpresaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmpresaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmpresaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          findFirst: {
            args: Prisma.EmpresaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmpresaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          findMany: {
            args: Prisma.EmpresaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>[]
          }
          create: {
            args: Prisma.EmpresaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          createMany: {
            args: Prisma.EmpresaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.EmpresaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          update: {
            args: Prisma.EmpresaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          deleteMany: {
            args: Prisma.EmpresaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmpresaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EmpresaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmpresaPayload>
          }
          aggregate: {
            args: Prisma.EmpresaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmpresa>
          }
          groupBy: {
            args: Prisma.EmpresaGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmpresaGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.EmpresaFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.EmpresaAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.EmpresaCountArgs<ExtArgs>
            result: $Utils.Optional<EmpresaCountAggregateOutputType> | number
          }
        }
      }
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>
        fields: Prisma.UsuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.UsuarioFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.UsuarioAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
      Pesquisa: {
        payload: Prisma.$PesquisaPayload<ExtArgs>
        fields: Prisma.PesquisaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PesquisaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PesquisaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PesquisaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PesquisaPayload>
          }
          findFirst: {
            args: Prisma.PesquisaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PesquisaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PesquisaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PesquisaPayload>
          }
          findMany: {
            args: Prisma.PesquisaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PesquisaPayload>[]
          }
          create: {
            args: Prisma.PesquisaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PesquisaPayload>
          }
          createMany: {
            args: Prisma.PesquisaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PesquisaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PesquisaPayload>
          }
          update: {
            args: Prisma.PesquisaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PesquisaPayload>
          }
          deleteMany: {
            args: Prisma.PesquisaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PesquisaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PesquisaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PesquisaPayload>
          }
          aggregate: {
            args: Prisma.PesquisaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePesquisa>
          }
          groupBy: {
            args: Prisma.PesquisaGroupByArgs<ExtArgs>
            result: $Utils.Optional<PesquisaGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PesquisaFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PesquisaAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PesquisaCountArgs<ExtArgs>
            result: $Utils.Optional<PesquisaCountAggregateOutputType> | number
          }
        }
      }
      Pergunta: {
        payload: Prisma.$PerguntaPayload<ExtArgs>
        fields: Prisma.PerguntaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PerguntaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PerguntaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          findFirst: {
            args: Prisma.PerguntaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PerguntaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          findMany: {
            args: Prisma.PerguntaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>[]
          }
          create: {
            args: Prisma.PerguntaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          createMany: {
            args: Prisma.PerguntaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PerguntaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          update: {
            args: Prisma.PerguntaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          deleteMany: {
            args: Prisma.PerguntaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PerguntaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PerguntaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PerguntaPayload>
          }
          aggregate: {
            args: Prisma.PerguntaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePergunta>
          }
          groupBy: {
            args: Prisma.PerguntaGroupByArgs<ExtArgs>
            result: $Utils.Optional<PerguntaGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PerguntaFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PerguntaAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PerguntaCountArgs<ExtArgs>
            result: $Utils.Optional<PerguntaCountAggregateOutputType> | number
          }
        }
      }
      OpcaoPergunta: {
        payload: Prisma.$OpcaoPerguntaPayload<ExtArgs>
        fields: Prisma.OpcaoPerguntaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OpcaoPerguntaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpcaoPerguntaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OpcaoPerguntaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpcaoPerguntaPayload>
          }
          findFirst: {
            args: Prisma.OpcaoPerguntaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpcaoPerguntaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OpcaoPerguntaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpcaoPerguntaPayload>
          }
          findMany: {
            args: Prisma.OpcaoPerguntaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpcaoPerguntaPayload>[]
          }
          create: {
            args: Prisma.OpcaoPerguntaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpcaoPerguntaPayload>
          }
          createMany: {
            args: Prisma.OpcaoPerguntaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.OpcaoPerguntaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpcaoPerguntaPayload>
          }
          update: {
            args: Prisma.OpcaoPerguntaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpcaoPerguntaPayload>
          }
          deleteMany: {
            args: Prisma.OpcaoPerguntaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OpcaoPerguntaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OpcaoPerguntaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpcaoPerguntaPayload>
          }
          aggregate: {
            args: Prisma.OpcaoPerguntaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOpcaoPergunta>
          }
          groupBy: {
            args: Prisma.OpcaoPerguntaGroupByArgs<ExtArgs>
            result: $Utils.Optional<OpcaoPerguntaGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.OpcaoPerguntaFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.OpcaoPerguntaAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.OpcaoPerguntaCountArgs<ExtArgs>
            result: $Utils.Optional<OpcaoPerguntaCountAggregateOutputType> | number
          }
        }
      }
      PontoColeta: {
        payload: Prisma.$PontoColetaPayload<ExtArgs>
        fields: Prisma.PontoColetaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PontoColetaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PontoColetaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PontoColetaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PontoColetaPayload>
          }
          findFirst: {
            args: Prisma.PontoColetaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PontoColetaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PontoColetaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PontoColetaPayload>
          }
          findMany: {
            args: Prisma.PontoColetaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PontoColetaPayload>[]
          }
          create: {
            args: Prisma.PontoColetaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PontoColetaPayload>
          }
          createMany: {
            args: Prisma.PontoColetaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PontoColetaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PontoColetaPayload>
          }
          update: {
            args: Prisma.PontoColetaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PontoColetaPayload>
          }
          deleteMany: {
            args: Prisma.PontoColetaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PontoColetaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PontoColetaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PontoColetaPayload>
          }
          aggregate: {
            args: Prisma.PontoColetaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePontoColeta>
          }
          groupBy: {
            args: Prisma.PontoColetaGroupByArgs<ExtArgs>
            result: $Utils.Optional<PontoColetaGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PontoColetaFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PontoColetaAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PontoColetaCountArgs<ExtArgs>
            result: $Utils.Optional<PontoColetaCountAggregateOutputType> | number
          }
        }
      }
      Resposta: {
        payload: Prisma.$RespostaPayload<ExtArgs>
        fields: Prisma.RespostaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RespostaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RespostaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          findFirst: {
            args: Prisma.RespostaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RespostaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          findMany: {
            args: Prisma.RespostaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>[]
          }
          create: {
            args: Prisma.RespostaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          createMany: {
            args: Prisma.RespostaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RespostaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          update: {
            args: Prisma.RespostaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          deleteMany: {
            args: Prisma.RespostaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RespostaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RespostaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPayload>
          }
          aggregate: {
            args: Prisma.RespostaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResposta>
          }
          groupBy: {
            args: Prisma.RespostaGroupByArgs<ExtArgs>
            result: $Utils.Optional<RespostaGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.RespostaFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.RespostaAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.RespostaCountArgs<ExtArgs>
            result: $Utils.Optional<RespostaCountAggregateOutputType> | number
          }
        }
      }
      RespostaPergunta: {
        payload: Prisma.$RespostaPerguntaPayload<ExtArgs>
        fields: Prisma.RespostaPerguntaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RespostaPerguntaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPerguntaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RespostaPerguntaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPerguntaPayload>
          }
          findFirst: {
            args: Prisma.RespostaPerguntaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPerguntaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RespostaPerguntaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPerguntaPayload>
          }
          findMany: {
            args: Prisma.RespostaPerguntaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPerguntaPayload>[]
          }
          create: {
            args: Prisma.RespostaPerguntaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPerguntaPayload>
          }
          createMany: {
            args: Prisma.RespostaPerguntaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RespostaPerguntaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPerguntaPayload>
          }
          update: {
            args: Prisma.RespostaPerguntaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPerguntaPayload>
          }
          deleteMany: {
            args: Prisma.RespostaPerguntaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RespostaPerguntaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RespostaPerguntaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RespostaPerguntaPayload>
          }
          aggregate: {
            args: Prisma.RespostaPerguntaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRespostaPergunta>
          }
          groupBy: {
            args: Prisma.RespostaPerguntaGroupByArgs<ExtArgs>
            result: $Utils.Optional<RespostaPerguntaGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.RespostaPerguntaFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.RespostaPerguntaAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.RespostaPerguntaCountArgs<ExtArgs>
            result: $Utils.Optional<RespostaPerguntaCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    empresa?: EmpresaOmit
    usuario?: UsuarioOmit
    pesquisa?: PesquisaOmit
    pergunta?: PerguntaOmit
    opcaoPergunta?: OpcaoPerguntaOmit
    pontoColeta?: PontoColetaOmit
    resposta?: RespostaOmit
    respostaPergunta?: RespostaPerguntaOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type EmpresaCountOutputType
   */

  export type EmpresaCountOutputType = {
    usuarios: number
    pesquisas: number
  }

  export type EmpresaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | EmpresaCountOutputTypeCountUsuariosArgs
    pesquisas?: boolean | EmpresaCountOutputTypeCountPesquisasArgs
  }

  // Custom InputTypes
  /**
   * EmpresaCountOutputType without action
   */
  export type EmpresaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmpresaCountOutputType
     */
    select?: EmpresaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EmpresaCountOutputType without action
   */
  export type EmpresaCountOutputTypeCountUsuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
  }

  /**
   * EmpresaCountOutputType without action
   */
  export type EmpresaCountOutputTypeCountPesquisasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PesquisaWhereInput
  }


  /**
   * Count Type PesquisaCountOutputType
   */

  export type PesquisaCountOutputType = {
    perguntas: number
    pontosColeta: number
    respostas: number
  }

  export type PesquisaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    perguntas?: boolean | PesquisaCountOutputTypeCountPerguntasArgs
    pontosColeta?: boolean | PesquisaCountOutputTypeCountPontosColetaArgs
    respostas?: boolean | PesquisaCountOutputTypeCountRespostasArgs
  }

  // Custom InputTypes
  /**
   * PesquisaCountOutputType without action
   */
  export type PesquisaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PesquisaCountOutputType
     */
    select?: PesquisaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PesquisaCountOutputType without action
   */
  export type PesquisaCountOutputTypeCountPerguntasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PerguntaWhereInput
  }

  /**
   * PesquisaCountOutputType without action
   */
  export type PesquisaCountOutputTypeCountPontosColetaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PontoColetaWhereInput
  }

  /**
   * PesquisaCountOutputType without action
   */
  export type PesquisaCountOutputTypeCountRespostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaWhereInput
  }


  /**
   * Count Type PerguntaCountOutputType
   */

  export type PerguntaCountOutputType = {
    opcoes: number
    respostas: number
  }

  export type PerguntaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    opcoes?: boolean | PerguntaCountOutputTypeCountOpcoesArgs
    respostas?: boolean | PerguntaCountOutputTypeCountRespostasArgs
  }

  // Custom InputTypes
  /**
   * PerguntaCountOutputType without action
   */
  export type PerguntaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerguntaCountOutputType
     */
    select?: PerguntaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PerguntaCountOutputType without action
   */
  export type PerguntaCountOutputTypeCountOpcoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OpcaoPerguntaWhereInput
  }

  /**
   * PerguntaCountOutputType without action
   */
  export type PerguntaCountOutputTypeCountRespostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaPerguntaWhereInput
  }


  /**
   * Count Type OpcaoPerguntaCountOutputType
   */

  export type OpcaoPerguntaCountOutputType = {
    respostas: number
  }

  export type OpcaoPerguntaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    respostas?: boolean | OpcaoPerguntaCountOutputTypeCountRespostasArgs
  }

  // Custom InputTypes
  /**
   * OpcaoPerguntaCountOutputType without action
   */
  export type OpcaoPerguntaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPerguntaCountOutputType
     */
    select?: OpcaoPerguntaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OpcaoPerguntaCountOutputType without action
   */
  export type OpcaoPerguntaCountOutputTypeCountRespostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaPerguntaWhereInput
  }


  /**
   * Count Type PontoColetaCountOutputType
   */

  export type PontoColetaCountOutputType = {
    respostas: number
  }

  export type PontoColetaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    respostas?: boolean | PontoColetaCountOutputTypeCountRespostasArgs
  }

  // Custom InputTypes
  /**
   * PontoColetaCountOutputType without action
   */
  export type PontoColetaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColetaCountOutputType
     */
    select?: PontoColetaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PontoColetaCountOutputType without action
   */
  export type PontoColetaCountOutputTypeCountRespostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaWhereInput
  }


  /**
   * Count Type RespostaCountOutputType
   */

  export type RespostaCountOutputType = {
    perguntas: number
  }

  export type RespostaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    perguntas?: boolean | RespostaCountOutputTypeCountPerguntasArgs
  }

  // Custom InputTypes
  /**
   * RespostaCountOutputType without action
   */
  export type RespostaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaCountOutputType
     */
    select?: RespostaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RespostaCountOutputType without action
   */
  export type RespostaCountOutputTypeCountPerguntasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaPerguntaWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Empresa
   */

  export type AggregateEmpresa = {
    _count: EmpresaCountAggregateOutputType | null
    _min: EmpresaMinAggregateOutputType | null
    _max: EmpresaMaxAggregateOutputType | null
  }

  export type EmpresaMinAggregateOutputType = {
    id: string | null
    nome: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EmpresaMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EmpresaCountAggregateOutputType = {
    id: number
    nome: number
    email: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EmpresaMinAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EmpresaMaxAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EmpresaCountAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EmpresaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Empresa to aggregate.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: EmpresaOrderByWithRelationInput | EmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Empresas
    **/
    _count?: true | EmpresaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmpresaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmpresaMaxAggregateInputType
  }

  export type GetEmpresaAggregateType<T extends EmpresaAggregateArgs> = {
        [P in keyof T & keyof AggregateEmpresa]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmpresa[P]>
      : GetScalarType<T[P], AggregateEmpresa[P]>
  }




  export type EmpresaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmpresaWhereInput
    orderBy?: EmpresaOrderByWithAggregationInput | EmpresaOrderByWithAggregationInput[]
    by: EmpresaScalarFieldEnum[] | EmpresaScalarFieldEnum
    having?: EmpresaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmpresaCountAggregateInputType | true
    _min?: EmpresaMinAggregateInputType
    _max?: EmpresaMaxAggregateInputType
  }

  export type EmpresaGroupByOutputType = {
    id: string
    nome: string
    email: string
    createdAt: Date
    updatedAt: Date
    _count: EmpresaCountAggregateOutputType | null
    _min: EmpresaMinAggregateOutputType | null
    _max: EmpresaMaxAggregateOutputType | null
  }

  type GetEmpresaGroupByPayload<T extends EmpresaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmpresaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmpresaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmpresaGroupByOutputType[P]>
            : GetScalarType<T[P], EmpresaGroupByOutputType[P]>
        }
      >
    >


  export type EmpresaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    usuarios?: boolean | Empresa$usuariosArgs<ExtArgs>
    pesquisas?: boolean | Empresa$pesquisasArgs<ExtArgs>
    _count?: boolean | EmpresaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["empresa"]>



  export type EmpresaSelectScalar = {
    id?: boolean
    nome?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EmpresaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "email" | "createdAt" | "updatedAt", ExtArgs["result"]["empresa"]>
  export type EmpresaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | Empresa$usuariosArgs<ExtArgs>
    pesquisas?: boolean | Empresa$pesquisasArgs<ExtArgs>
    _count?: boolean | EmpresaCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $EmpresaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Empresa"
    objects: {
      usuarios: Prisma.$UsuarioPayload<ExtArgs>[]
      pesquisas: Prisma.$PesquisaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
      email: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["empresa"]>
    composites: {}
  }

  type EmpresaGetPayload<S extends boolean | null | undefined | EmpresaDefaultArgs> = $Result.GetResult<Prisma.$EmpresaPayload, S>

  type EmpresaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EmpresaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EmpresaCountAggregateInputType | true
    }

  export interface EmpresaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Empresa'], meta: { name: 'Empresa' } }
    /**
     * Find zero or one Empresa that matches the filter.
     * @param {EmpresaFindUniqueArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmpresaFindUniqueArgs>(args: SelectSubset<T, EmpresaFindUniqueArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Empresa that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmpresaFindUniqueOrThrowArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmpresaFindUniqueOrThrowArgs>(args: SelectSubset<T, EmpresaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Empresa that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaFindFirstArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmpresaFindFirstArgs>(args?: SelectSubset<T, EmpresaFindFirstArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Empresa that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaFindFirstOrThrowArgs} args - Arguments to find a Empresa
     * @example
     * // Get one Empresa
     * const empresa = await prisma.empresa.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmpresaFindFirstOrThrowArgs>(args?: SelectSubset<T, EmpresaFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Empresas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Empresas
     * const empresas = await prisma.empresa.findMany()
     * 
     * // Get first 10 Empresas
     * const empresas = await prisma.empresa.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const empresaWithIdOnly = await prisma.empresa.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmpresaFindManyArgs>(args?: SelectSubset<T, EmpresaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Empresa.
     * @param {EmpresaCreateArgs} args - Arguments to create a Empresa.
     * @example
     * // Create one Empresa
     * const Empresa = await prisma.empresa.create({
     *   data: {
     *     // ... data to create a Empresa
     *   }
     * })
     * 
     */
    create<T extends EmpresaCreateArgs>(args: SelectSubset<T, EmpresaCreateArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Empresas.
     * @param {EmpresaCreateManyArgs} args - Arguments to create many Empresas.
     * @example
     * // Create many Empresas
     * const empresa = await prisma.empresa.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmpresaCreateManyArgs>(args?: SelectSubset<T, EmpresaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Empresa.
     * @param {EmpresaDeleteArgs} args - Arguments to delete one Empresa.
     * @example
     * // Delete one Empresa
     * const Empresa = await prisma.empresa.delete({
     *   where: {
     *     // ... filter to delete one Empresa
     *   }
     * })
     * 
     */
    delete<T extends EmpresaDeleteArgs>(args: SelectSubset<T, EmpresaDeleteArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Empresa.
     * @param {EmpresaUpdateArgs} args - Arguments to update one Empresa.
     * @example
     * // Update one Empresa
     * const empresa = await prisma.empresa.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmpresaUpdateArgs>(args: SelectSubset<T, EmpresaUpdateArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Empresas.
     * @param {EmpresaDeleteManyArgs} args - Arguments to filter Empresas to delete.
     * @example
     * // Delete a few Empresas
     * const { count } = await prisma.empresa.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmpresaDeleteManyArgs>(args?: SelectSubset<T, EmpresaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Empresas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Empresas
     * const empresa = await prisma.empresa.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmpresaUpdateManyArgs>(args: SelectSubset<T, EmpresaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Empresa.
     * @param {EmpresaUpsertArgs} args - Arguments to update or create a Empresa.
     * @example
     * // Update or create a Empresa
     * const empresa = await prisma.empresa.upsert({
     *   create: {
     *     // ... data to create a Empresa
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Empresa we want to update
     *   }
     * })
     */
    upsert<T extends EmpresaUpsertArgs>(args: SelectSubset<T, EmpresaUpsertArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Empresas that matches the filter.
     * @param {EmpresaFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const empresa = await prisma.empresa.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: EmpresaFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Empresa.
     * @param {EmpresaAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const empresa = await prisma.empresa.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: EmpresaAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Empresas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaCountArgs} args - Arguments to filter Empresas to count.
     * @example
     * // Count the number of Empresas
     * const count = await prisma.empresa.count({
     *   where: {
     *     // ... the filter for the Empresas we want to count
     *   }
     * })
    **/
    count<T extends EmpresaCountArgs>(
      args?: Subset<T, EmpresaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmpresaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Empresa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmpresaAggregateArgs>(args: Subset<T, EmpresaAggregateArgs>): Prisma.PrismaPromise<GetEmpresaAggregateType<T>>

    /**
     * Group by Empresa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmpresaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmpresaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmpresaGroupByArgs['orderBy'] }
        : { orderBy?: EmpresaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmpresaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmpresaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Empresa model
   */
  readonly fields: EmpresaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Empresa.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmpresaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuarios<T extends Empresa$usuariosArgs<ExtArgs> = {}>(args?: Subset<T, Empresa$usuariosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pesquisas<T extends Empresa$pesquisasArgs<ExtArgs> = {}>(args?: Subset<T, Empresa$pesquisasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Empresa model
   */
  interface EmpresaFieldRefs {
    readonly id: FieldRef<"Empresa", 'String'>
    readonly nome: FieldRef<"Empresa", 'String'>
    readonly email: FieldRef<"Empresa", 'String'>
    readonly createdAt: FieldRef<"Empresa", 'DateTime'>
    readonly updatedAt: FieldRef<"Empresa", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Empresa findUnique
   */
  export type EmpresaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where: EmpresaWhereUniqueInput
  }

  /**
   * Empresa findUniqueOrThrow
   */
  export type EmpresaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where: EmpresaWhereUniqueInput
  }

  /**
   * Empresa findFirst
   */
  export type EmpresaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: EmpresaOrderByWithRelationInput | EmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Empresas.
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Empresas.
     */
    distinct?: EmpresaScalarFieldEnum | EmpresaScalarFieldEnum[]
  }

  /**
   * Empresa findFirstOrThrow
   */
  export type EmpresaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresa to fetch.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: EmpresaOrderByWithRelationInput | EmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Empresas.
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Empresas.
     */
    distinct?: EmpresaScalarFieldEnum | EmpresaScalarFieldEnum[]
  }

  /**
   * Empresa findMany
   */
  export type EmpresaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter, which Empresas to fetch.
     */
    where?: EmpresaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Empresas to fetch.
     */
    orderBy?: EmpresaOrderByWithRelationInput | EmpresaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Empresas.
     */
    cursor?: EmpresaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Empresas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Empresas.
     */
    skip?: number
    distinct?: EmpresaScalarFieldEnum | EmpresaScalarFieldEnum[]
  }

  /**
   * Empresa create
   */
  export type EmpresaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * The data needed to create a Empresa.
     */
    data: XOR<EmpresaCreateInput, EmpresaUncheckedCreateInput>
  }

  /**
   * Empresa createMany
   */
  export type EmpresaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Empresas.
     */
    data: EmpresaCreateManyInput | EmpresaCreateManyInput[]
  }

  /**
   * Empresa update
   */
  export type EmpresaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * The data needed to update a Empresa.
     */
    data: XOR<EmpresaUpdateInput, EmpresaUncheckedUpdateInput>
    /**
     * Choose, which Empresa to update.
     */
    where: EmpresaWhereUniqueInput
  }

  /**
   * Empresa updateMany
   */
  export type EmpresaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Empresas.
     */
    data: XOR<EmpresaUpdateManyMutationInput, EmpresaUncheckedUpdateManyInput>
    /**
     * Filter which Empresas to update
     */
    where?: EmpresaWhereInput
    /**
     * Limit how many Empresas to update.
     */
    limit?: number
  }

  /**
   * Empresa upsert
   */
  export type EmpresaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * The filter to search for the Empresa to update in case it exists.
     */
    where: EmpresaWhereUniqueInput
    /**
     * In case the Empresa found by the `where` argument doesn't exist, create a new Empresa with this data.
     */
    create: XOR<EmpresaCreateInput, EmpresaUncheckedCreateInput>
    /**
     * In case the Empresa was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmpresaUpdateInput, EmpresaUncheckedUpdateInput>
  }

  /**
   * Empresa delete
   */
  export type EmpresaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
    /**
     * Filter which Empresa to delete.
     */
    where: EmpresaWhereUniqueInput
  }

  /**
   * Empresa deleteMany
   */
  export type EmpresaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Empresas to delete
     */
    where?: EmpresaWhereInput
    /**
     * Limit how many Empresas to delete.
     */
    limit?: number
  }

  /**
   * Empresa findRaw
   */
  export type EmpresaFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Empresa aggregateRaw
   */
  export type EmpresaAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Empresa.usuarios
   */
  export type Empresa$usuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    cursor?: UsuarioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Empresa.pesquisas
   */
  export type Empresa$pesquisasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pesquisa
     */
    select?: PesquisaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pesquisa
     */
    omit?: PesquisaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PesquisaInclude<ExtArgs> | null
    where?: PesquisaWhereInput
    orderBy?: PesquisaOrderByWithRelationInput | PesquisaOrderByWithRelationInput[]
    cursor?: PesquisaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PesquisaScalarFieldEnum | PesquisaScalarFieldEnum[]
  }

  /**
   * Empresa without action
   */
  export type EmpresaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Empresa
     */
    select?: EmpresaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Empresa
     */
    omit?: EmpresaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmpresaInclude<ExtArgs> | null
  }


  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioMinAggregateOutputType = {
    id: string | null
    empresaId: string | null
    nome: string | null
    email: string | null
    senhaHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UsuarioMaxAggregateOutputType = {
    id: string | null
    empresaId: string | null
    nome: string | null
    email: string | null
    senhaHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UsuarioCountAggregateOutputType = {
    id: number
    empresaId: number
    nome: number
    email: number
    senhaHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UsuarioMinAggregateInputType = {
    id?: true
    empresaId?: true
    nome?: true
    email?: true
    senhaHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UsuarioMaxAggregateInputType = {
    id?: true
    empresaId?: true
    nome?: true
    email?: true
    senhaHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UsuarioCountAggregateInputType = {
    id?: true
    empresaId?: true
    nome?: true
    email?: true
    senhaHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type UsuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithAggregationInput | UsuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: UsuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    id: string
    empresaId: string
    nome: string
    email: string
    senhaHash: string
    createdAt: Date
    updatedAt: Date
    _count: UsuarioCountAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    empresaId?: boolean
    nome?: boolean
    email?: boolean
    senhaHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    empresa?: boolean | EmpresaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>



  export type UsuarioSelectScalar = {
    id?: boolean
    empresaId?: boolean
    nome?: boolean
    email?: boolean
    senhaHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UsuarioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "empresaId" | "nome" | "email" | "senhaHash" | "createdAt" | "updatedAt", ExtArgs["result"]["usuario"]>
  export type UsuarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    empresa?: boolean | EmpresaDefaultArgs<ExtArgs>
  }

  export type $UsuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Usuario"
    objects: {
      empresa: Prisma.$EmpresaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      empresaId: string
      nome: string
      email: string
      senhaHash: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = $Result.GetResult<Prisma.$UsuarioPayload, S>

  type UsuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface UsuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuarioWithIdOnly = await prisma.usuario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsuarioFindManyArgs>(args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends UsuarioCreateArgs>(args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioCreateManyArgs>(args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends UsuarioDeleteArgs>(args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioUpdateArgs>(args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioUpdateManyArgs>(args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Usuarios that matches the filter.
     * @param {UsuarioFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const usuario = await prisma.usuario.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: UsuarioFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Usuario.
     * @param {UsuarioAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const usuario = await prisma.usuario.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: UsuarioAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Usuario model
   */
  readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    empresa<T extends EmpresaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmpresaDefaultArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Usuario model
   */
  interface UsuarioFieldRefs {
    readonly id: FieldRef<"Usuario", 'String'>
    readonly empresaId: FieldRef<"Usuario", 'String'>
    readonly nome: FieldRef<"Usuario", 'String'>
    readonly email: FieldRef<"Usuario", 'String'>
    readonly senhaHash: FieldRef<"Usuario", 'String'>
    readonly createdAt: FieldRef<"Usuario", 'DateTime'>
    readonly updatedAt: FieldRef<"Usuario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
  }

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
  }

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to update.
     */
    limit?: number
  }

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
  }

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput
    /**
     * Limit how many Usuarios to delete.
     */
    limit?: number
  }

  /**
   * Usuario findRaw
   */
  export type UsuarioFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Usuario aggregateRaw
   */
  export type UsuarioAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Usuario
     */
    omit?: UsuarioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
  }


  /**
   * Model Pesquisa
   */

  export type AggregatePesquisa = {
    _count: PesquisaCountAggregateOutputType | null
    _avg: PesquisaAvgAggregateOutputType | null
    _sum: PesquisaSumAggregateOutputType | null
    _min: PesquisaMinAggregateOutputType | null
    _max: PesquisaMaxAggregateOutputType | null
  }

  export type PesquisaAvgAggregateOutputType = {
    writeVersion: number | null
  }

  export type PesquisaSumAggregateOutputType = {
    writeVersion: number | null
  }

  export type PesquisaMinAggregateOutputType = {
    id: string | null
    empresaId: string | null
    titulo: string | null
    descricao: string | null
    status: $Enums.StatusPesquisa | null
    slug: string | null
    writeVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PesquisaMaxAggregateOutputType = {
    id: string | null
    empresaId: string | null
    titulo: string | null
    descricao: string | null
    status: $Enums.StatusPesquisa | null
    slug: string | null
    writeVersion: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PesquisaCountAggregateOutputType = {
    id: number
    empresaId: number
    titulo: number
    descricao: number
    status: number
    slug: number
    writeVersion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PesquisaAvgAggregateInputType = {
    writeVersion?: true
  }

  export type PesquisaSumAggregateInputType = {
    writeVersion?: true
  }

  export type PesquisaMinAggregateInputType = {
    id?: true
    empresaId?: true
    titulo?: true
    descricao?: true
    status?: true
    slug?: true
    writeVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PesquisaMaxAggregateInputType = {
    id?: true
    empresaId?: true
    titulo?: true
    descricao?: true
    status?: true
    slug?: true
    writeVersion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PesquisaCountAggregateInputType = {
    id?: true
    empresaId?: true
    titulo?: true
    descricao?: true
    status?: true
    slug?: true
    writeVersion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PesquisaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pesquisa to aggregate.
     */
    where?: PesquisaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pesquisas to fetch.
     */
    orderBy?: PesquisaOrderByWithRelationInput | PesquisaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PesquisaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pesquisas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pesquisas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pesquisas
    **/
    _count?: true | PesquisaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PesquisaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PesquisaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PesquisaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PesquisaMaxAggregateInputType
  }

  export type GetPesquisaAggregateType<T extends PesquisaAggregateArgs> = {
        [P in keyof T & keyof AggregatePesquisa]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePesquisa[P]>
      : GetScalarType<T[P], AggregatePesquisa[P]>
  }




  export type PesquisaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PesquisaWhereInput
    orderBy?: PesquisaOrderByWithAggregationInput | PesquisaOrderByWithAggregationInput[]
    by: PesquisaScalarFieldEnum[] | PesquisaScalarFieldEnum
    having?: PesquisaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PesquisaCountAggregateInputType | true
    _avg?: PesquisaAvgAggregateInputType
    _sum?: PesquisaSumAggregateInputType
    _min?: PesquisaMinAggregateInputType
    _max?: PesquisaMaxAggregateInputType
  }

  export type PesquisaGroupByOutputType = {
    id: string
    empresaId: string
    titulo: string
    descricao: string | null
    status: $Enums.StatusPesquisa
    slug: string
    writeVersion: number
    createdAt: Date
    updatedAt: Date
    _count: PesquisaCountAggregateOutputType | null
    _avg: PesquisaAvgAggregateOutputType | null
    _sum: PesquisaSumAggregateOutputType | null
    _min: PesquisaMinAggregateOutputType | null
    _max: PesquisaMaxAggregateOutputType | null
  }

  type GetPesquisaGroupByPayload<T extends PesquisaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PesquisaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PesquisaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PesquisaGroupByOutputType[P]>
            : GetScalarType<T[P], PesquisaGroupByOutputType[P]>
        }
      >
    >


  export type PesquisaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    empresaId?: boolean
    titulo?: boolean
    descricao?: boolean
    status?: boolean
    slug?: boolean
    writeVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    empresa?: boolean | EmpresaDefaultArgs<ExtArgs>
    perguntas?: boolean | Pesquisa$perguntasArgs<ExtArgs>
    pontosColeta?: boolean | Pesquisa$pontosColetaArgs<ExtArgs>
    respostas?: boolean | Pesquisa$respostasArgs<ExtArgs>
    _count?: boolean | PesquisaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pesquisa"]>



  export type PesquisaSelectScalar = {
    id?: boolean
    empresaId?: boolean
    titulo?: boolean
    descricao?: boolean
    status?: boolean
    slug?: boolean
    writeVersion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PesquisaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "empresaId" | "titulo" | "descricao" | "status" | "slug" | "writeVersion" | "createdAt" | "updatedAt", ExtArgs["result"]["pesquisa"]>
  export type PesquisaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    empresa?: boolean | EmpresaDefaultArgs<ExtArgs>
    perguntas?: boolean | Pesquisa$perguntasArgs<ExtArgs>
    pontosColeta?: boolean | Pesquisa$pontosColetaArgs<ExtArgs>
    respostas?: boolean | Pesquisa$respostasArgs<ExtArgs>
    _count?: boolean | PesquisaCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PesquisaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pesquisa"
    objects: {
      empresa: Prisma.$EmpresaPayload<ExtArgs>
      perguntas: Prisma.$PerguntaPayload<ExtArgs>[]
      pontosColeta: Prisma.$PontoColetaPayload<ExtArgs>[]
      respostas: Prisma.$RespostaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      empresaId: string
      titulo: string
      descricao: string | null
      status: $Enums.StatusPesquisa
      slug: string
      writeVersion: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pesquisa"]>
    composites: {}
  }

  type PesquisaGetPayload<S extends boolean | null | undefined | PesquisaDefaultArgs> = $Result.GetResult<Prisma.$PesquisaPayload, S>

  type PesquisaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PesquisaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PesquisaCountAggregateInputType | true
    }

  export interface PesquisaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pesquisa'], meta: { name: 'Pesquisa' } }
    /**
     * Find zero or one Pesquisa that matches the filter.
     * @param {PesquisaFindUniqueArgs} args - Arguments to find a Pesquisa
     * @example
     * // Get one Pesquisa
     * const pesquisa = await prisma.pesquisa.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PesquisaFindUniqueArgs>(args: SelectSubset<T, PesquisaFindUniqueArgs<ExtArgs>>): Prisma__PesquisaClient<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pesquisa that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PesquisaFindUniqueOrThrowArgs} args - Arguments to find a Pesquisa
     * @example
     * // Get one Pesquisa
     * const pesquisa = await prisma.pesquisa.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PesquisaFindUniqueOrThrowArgs>(args: SelectSubset<T, PesquisaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PesquisaClient<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pesquisa that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PesquisaFindFirstArgs} args - Arguments to find a Pesquisa
     * @example
     * // Get one Pesquisa
     * const pesquisa = await prisma.pesquisa.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PesquisaFindFirstArgs>(args?: SelectSubset<T, PesquisaFindFirstArgs<ExtArgs>>): Prisma__PesquisaClient<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pesquisa that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PesquisaFindFirstOrThrowArgs} args - Arguments to find a Pesquisa
     * @example
     * // Get one Pesquisa
     * const pesquisa = await prisma.pesquisa.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PesquisaFindFirstOrThrowArgs>(args?: SelectSubset<T, PesquisaFindFirstOrThrowArgs<ExtArgs>>): Prisma__PesquisaClient<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pesquisas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PesquisaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pesquisas
     * const pesquisas = await prisma.pesquisa.findMany()
     * 
     * // Get first 10 Pesquisas
     * const pesquisas = await prisma.pesquisa.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pesquisaWithIdOnly = await prisma.pesquisa.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PesquisaFindManyArgs>(args?: SelectSubset<T, PesquisaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pesquisa.
     * @param {PesquisaCreateArgs} args - Arguments to create a Pesquisa.
     * @example
     * // Create one Pesquisa
     * const Pesquisa = await prisma.pesquisa.create({
     *   data: {
     *     // ... data to create a Pesquisa
     *   }
     * })
     * 
     */
    create<T extends PesquisaCreateArgs>(args: SelectSubset<T, PesquisaCreateArgs<ExtArgs>>): Prisma__PesquisaClient<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pesquisas.
     * @param {PesquisaCreateManyArgs} args - Arguments to create many Pesquisas.
     * @example
     * // Create many Pesquisas
     * const pesquisa = await prisma.pesquisa.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PesquisaCreateManyArgs>(args?: SelectSubset<T, PesquisaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Pesquisa.
     * @param {PesquisaDeleteArgs} args - Arguments to delete one Pesquisa.
     * @example
     * // Delete one Pesquisa
     * const Pesquisa = await prisma.pesquisa.delete({
     *   where: {
     *     // ... filter to delete one Pesquisa
     *   }
     * })
     * 
     */
    delete<T extends PesquisaDeleteArgs>(args: SelectSubset<T, PesquisaDeleteArgs<ExtArgs>>): Prisma__PesquisaClient<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pesquisa.
     * @param {PesquisaUpdateArgs} args - Arguments to update one Pesquisa.
     * @example
     * // Update one Pesquisa
     * const pesquisa = await prisma.pesquisa.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PesquisaUpdateArgs>(args: SelectSubset<T, PesquisaUpdateArgs<ExtArgs>>): Prisma__PesquisaClient<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pesquisas.
     * @param {PesquisaDeleteManyArgs} args - Arguments to filter Pesquisas to delete.
     * @example
     * // Delete a few Pesquisas
     * const { count } = await prisma.pesquisa.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PesquisaDeleteManyArgs>(args?: SelectSubset<T, PesquisaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pesquisas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PesquisaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pesquisas
     * const pesquisa = await prisma.pesquisa.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PesquisaUpdateManyArgs>(args: SelectSubset<T, PesquisaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Pesquisa.
     * @param {PesquisaUpsertArgs} args - Arguments to update or create a Pesquisa.
     * @example
     * // Update or create a Pesquisa
     * const pesquisa = await prisma.pesquisa.upsert({
     *   create: {
     *     // ... data to create a Pesquisa
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pesquisa we want to update
     *   }
     * })
     */
    upsert<T extends PesquisaUpsertArgs>(args: SelectSubset<T, PesquisaUpsertArgs<ExtArgs>>): Prisma__PesquisaClient<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pesquisas that matches the filter.
     * @param {PesquisaFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const pesquisa = await prisma.pesquisa.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PesquisaFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Pesquisa.
     * @param {PesquisaAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const pesquisa = await prisma.pesquisa.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PesquisaAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Pesquisas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PesquisaCountArgs} args - Arguments to filter Pesquisas to count.
     * @example
     * // Count the number of Pesquisas
     * const count = await prisma.pesquisa.count({
     *   where: {
     *     // ... the filter for the Pesquisas we want to count
     *   }
     * })
    **/
    count<T extends PesquisaCountArgs>(
      args?: Subset<T, PesquisaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PesquisaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pesquisa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PesquisaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PesquisaAggregateArgs>(args: Subset<T, PesquisaAggregateArgs>): Prisma.PrismaPromise<GetPesquisaAggregateType<T>>

    /**
     * Group by Pesquisa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PesquisaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PesquisaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PesquisaGroupByArgs['orderBy'] }
        : { orderBy?: PesquisaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PesquisaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPesquisaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pesquisa model
   */
  readonly fields: PesquisaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pesquisa.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PesquisaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    empresa<T extends EmpresaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EmpresaDefaultArgs<ExtArgs>>): Prisma__EmpresaClient<$Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    perguntas<T extends Pesquisa$perguntasArgs<ExtArgs> = {}>(args?: Subset<T, Pesquisa$perguntasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pontosColeta<T extends Pesquisa$pontosColetaArgs<ExtArgs> = {}>(args?: Subset<T, Pesquisa$pontosColetaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PontoColetaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    respostas<T extends Pesquisa$respostasArgs<ExtArgs> = {}>(args?: Subset<T, Pesquisa$respostasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pesquisa model
   */
  interface PesquisaFieldRefs {
    readonly id: FieldRef<"Pesquisa", 'String'>
    readonly empresaId: FieldRef<"Pesquisa", 'String'>
    readonly titulo: FieldRef<"Pesquisa", 'String'>
    readonly descricao: FieldRef<"Pesquisa", 'String'>
    readonly status: FieldRef<"Pesquisa", 'StatusPesquisa'>
    readonly slug: FieldRef<"Pesquisa", 'String'>
    readonly writeVersion: FieldRef<"Pesquisa", 'Int'>
    readonly createdAt: FieldRef<"Pesquisa", 'DateTime'>
    readonly updatedAt: FieldRef<"Pesquisa", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pesquisa findUnique
   */
  export type PesquisaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pesquisa
     */
    select?: PesquisaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pesquisa
     */
    omit?: PesquisaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PesquisaInclude<ExtArgs> | null
    /**
     * Filter, which Pesquisa to fetch.
     */
    where: PesquisaWhereUniqueInput
  }

  /**
   * Pesquisa findUniqueOrThrow
   */
  export type PesquisaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pesquisa
     */
    select?: PesquisaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pesquisa
     */
    omit?: PesquisaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PesquisaInclude<ExtArgs> | null
    /**
     * Filter, which Pesquisa to fetch.
     */
    where: PesquisaWhereUniqueInput
  }

  /**
   * Pesquisa findFirst
   */
  export type PesquisaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pesquisa
     */
    select?: PesquisaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pesquisa
     */
    omit?: PesquisaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PesquisaInclude<ExtArgs> | null
    /**
     * Filter, which Pesquisa to fetch.
     */
    where?: PesquisaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pesquisas to fetch.
     */
    orderBy?: PesquisaOrderByWithRelationInput | PesquisaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pesquisas.
     */
    cursor?: PesquisaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pesquisas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pesquisas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pesquisas.
     */
    distinct?: PesquisaScalarFieldEnum | PesquisaScalarFieldEnum[]
  }

  /**
   * Pesquisa findFirstOrThrow
   */
  export type PesquisaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pesquisa
     */
    select?: PesquisaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pesquisa
     */
    omit?: PesquisaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PesquisaInclude<ExtArgs> | null
    /**
     * Filter, which Pesquisa to fetch.
     */
    where?: PesquisaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pesquisas to fetch.
     */
    orderBy?: PesquisaOrderByWithRelationInput | PesquisaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pesquisas.
     */
    cursor?: PesquisaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pesquisas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pesquisas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pesquisas.
     */
    distinct?: PesquisaScalarFieldEnum | PesquisaScalarFieldEnum[]
  }

  /**
   * Pesquisa findMany
   */
  export type PesquisaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pesquisa
     */
    select?: PesquisaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pesquisa
     */
    omit?: PesquisaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PesquisaInclude<ExtArgs> | null
    /**
     * Filter, which Pesquisas to fetch.
     */
    where?: PesquisaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pesquisas to fetch.
     */
    orderBy?: PesquisaOrderByWithRelationInput | PesquisaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pesquisas.
     */
    cursor?: PesquisaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pesquisas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pesquisas.
     */
    skip?: number
    distinct?: PesquisaScalarFieldEnum | PesquisaScalarFieldEnum[]
  }

  /**
   * Pesquisa create
   */
  export type PesquisaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pesquisa
     */
    select?: PesquisaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pesquisa
     */
    omit?: PesquisaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PesquisaInclude<ExtArgs> | null
    /**
     * The data needed to create a Pesquisa.
     */
    data: XOR<PesquisaCreateInput, PesquisaUncheckedCreateInput>
  }

  /**
   * Pesquisa createMany
   */
  export type PesquisaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pesquisas.
     */
    data: PesquisaCreateManyInput | PesquisaCreateManyInput[]
  }

  /**
   * Pesquisa update
   */
  export type PesquisaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pesquisa
     */
    select?: PesquisaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pesquisa
     */
    omit?: PesquisaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PesquisaInclude<ExtArgs> | null
    /**
     * The data needed to update a Pesquisa.
     */
    data: XOR<PesquisaUpdateInput, PesquisaUncheckedUpdateInput>
    /**
     * Choose, which Pesquisa to update.
     */
    where: PesquisaWhereUniqueInput
  }

  /**
   * Pesquisa updateMany
   */
  export type PesquisaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pesquisas.
     */
    data: XOR<PesquisaUpdateManyMutationInput, PesquisaUncheckedUpdateManyInput>
    /**
     * Filter which Pesquisas to update
     */
    where?: PesquisaWhereInput
    /**
     * Limit how many Pesquisas to update.
     */
    limit?: number
  }

  /**
   * Pesquisa upsert
   */
  export type PesquisaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pesquisa
     */
    select?: PesquisaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pesquisa
     */
    omit?: PesquisaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PesquisaInclude<ExtArgs> | null
    /**
     * The filter to search for the Pesquisa to update in case it exists.
     */
    where: PesquisaWhereUniqueInput
    /**
     * In case the Pesquisa found by the `where` argument doesn't exist, create a new Pesquisa with this data.
     */
    create: XOR<PesquisaCreateInput, PesquisaUncheckedCreateInput>
    /**
     * In case the Pesquisa was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PesquisaUpdateInput, PesquisaUncheckedUpdateInput>
  }

  /**
   * Pesquisa delete
   */
  export type PesquisaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pesquisa
     */
    select?: PesquisaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pesquisa
     */
    omit?: PesquisaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PesquisaInclude<ExtArgs> | null
    /**
     * Filter which Pesquisa to delete.
     */
    where: PesquisaWhereUniqueInput
  }

  /**
   * Pesquisa deleteMany
   */
  export type PesquisaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pesquisas to delete
     */
    where?: PesquisaWhereInput
    /**
     * Limit how many Pesquisas to delete.
     */
    limit?: number
  }

  /**
   * Pesquisa findRaw
   */
  export type PesquisaFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Pesquisa aggregateRaw
   */
  export type PesquisaAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Pesquisa.perguntas
   */
  export type Pesquisa$perguntasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    where?: PerguntaWhereInput
    orderBy?: PerguntaOrderByWithRelationInput | PerguntaOrderByWithRelationInput[]
    cursor?: PerguntaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PerguntaScalarFieldEnum | PerguntaScalarFieldEnum[]
  }

  /**
   * Pesquisa.pontosColeta
   */
  export type Pesquisa$pontosColetaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
    where?: PontoColetaWhereInput
    orderBy?: PontoColetaOrderByWithRelationInput | PontoColetaOrderByWithRelationInput[]
    cursor?: PontoColetaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PontoColetaScalarFieldEnum | PontoColetaScalarFieldEnum[]
  }

  /**
   * Pesquisa.respostas
   */
  export type Pesquisa$respostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    where?: RespostaWhereInput
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    cursor?: RespostaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Pesquisa without action
   */
  export type PesquisaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pesquisa
     */
    select?: PesquisaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pesquisa
     */
    omit?: PesquisaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PesquisaInclude<ExtArgs> | null
  }


  /**
   * Model Pergunta
   */

  export type AggregatePergunta = {
    _count: PerguntaCountAggregateOutputType | null
    _avg: PerguntaAvgAggregateOutputType | null
    _sum: PerguntaSumAggregateOutputType | null
    _min: PerguntaMinAggregateOutputType | null
    _max: PerguntaMaxAggregateOutputType | null
  }

  export type PerguntaAvgAggregateOutputType = {
    ordem: number | null
  }

  export type PerguntaSumAggregateOutputType = {
    ordem: number | null
  }

  export type PerguntaMinAggregateOutputType = {
    id: string | null
    pesquisaId: string | null
    texto: string | null
    tipo: $Enums.TipoPergunta | null
    obrigatoria: boolean | null
    ordem: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PerguntaMaxAggregateOutputType = {
    id: string | null
    pesquisaId: string | null
    texto: string | null
    tipo: $Enums.TipoPergunta | null
    obrigatoria: boolean | null
    ordem: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PerguntaCountAggregateOutputType = {
    id: number
    pesquisaId: number
    texto: number
    tipo: number
    obrigatoria: number
    ordem: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PerguntaAvgAggregateInputType = {
    ordem?: true
  }

  export type PerguntaSumAggregateInputType = {
    ordem?: true
  }

  export type PerguntaMinAggregateInputType = {
    id?: true
    pesquisaId?: true
    texto?: true
    tipo?: true
    obrigatoria?: true
    ordem?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PerguntaMaxAggregateInputType = {
    id?: true
    pesquisaId?: true
    texto?: true
    tipo?: true
    obrigatoria?: true
    ordem?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PerguntaCountAggregateInputType = {
    id?: true
    pesquisaId?: true
    texto?: true
    tipo?: true
    obrigatoria?: true
    ordem?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PerguntaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pergunta to aggregate.
     */
    where?: PerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Perguntas to fetch.
     */
    orderBy?: PerguntaOrderByWithRelationInput | PerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Perguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Perguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Perguntas
    **/
    _count?: true | PerguntaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PerguntaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PerguntaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PerguntaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PerguntaMaxAggregateInputType
  }

  export type GetPerguntaAggregateType<T extends PerguntaAggregateArgs> = {
        [P in keyof T & keyof AggregatePergunta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePergunta[P]>
      : GetScalarType<T[P], AggregatePergunta[P]>
  }




  export type PerguntaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PerguntaWhereInput
    orderBy?: PerguntaOrderByWithAggregationInput | PerguntaOrderByWithAggregationInput[]
    by: PerguntaScalarFieldEnum[] | PerguntaScalarFieldEnum
    having?: PerguntaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PerguntaCountAggregateInputType | true
    _avg?: PerguntaAvgAggregateInputType
    _sum?: PerguntaSumAggregateInputType
    _min?: PerguntaMinAggregateInputType
    _max?: PerguntaMaxAggregateInputType
  }

  export type PerguntaGroupByOutputType = {
    id: string
    pesquisaId: string
    texto: string
    tipo: $Enums.TipoPergunta
    obrigatoria: boolean
    ordem: number
    createdAt: Date
    updatedAt: Date
    _count: PerguntaCountAggregateOutputType | null
    _avg: PerguntaAvgAggregateOutputType | null
    _sum: PerguntaSumAggregateOutputType | null
    _min: PerguntaMinAggregateOutputType | null
    _max: PerguntaMaxAggregateOutputType | null
  }

  type GetPerguntaGroupByPayload<T extends PerguntaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PerguntaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PerguntaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PerguntaGroupByOutputType[P]>
            : GetScalarType<T[P], PerguntaGroupByOutputType[P]>
        }
      >
    >


  export type PerguntaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pesquisaId?: boolean
    texto?: boolean
    tipo?: boolean
    obrigatoria?: boolean
    ordem?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pesquisa?: boolean | PesquisaDefaultArgs<ExtArgs>
    opcoes?: boolean | Pergunta$opcoesArgs<ExtArgs>
    respostas?: boolean | Pergunta$respostasArgs<ExtArgs>
    _count?: boolean | PerguntaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pergunta"]>



  export type PerguntaSelectScalar = {
    id?: boolean
    pesquisaId?: boolean
    texto?: boolean
    tipo?: boolean
    obrigatoria?: boolean
    ordem?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PerguntaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "pesquisaId" | "texto" | "tipo" | "obrigatoria" | "ordem" | "createdAt" | "updatedAt", ExtArgs["result"]["pergunta"]>
  export type PerguntaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pesquisa?: boolean | PesquisaDefaultArgs<ExtArgs>
    opcoes?: boolean | Pergunta$opcoesArgs<ExtArgs>
    respostas?: boolean | Pergunta$respostasArgs<ExtArgs>
    _count?: boolean | PerguntaCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PerguntaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pergunta"
    objects: {
      pesquisa: Prisma.$PesquisaPayload<ExtArgs>
      opcoes: Prisma.$OpcaoPerguntaPayload<ExtArgs>[]
      respostas: Prisma.$RespostaPerguntaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pesquisaId: string
      texto: string
      tipo: $Enums.TipoPergunta
      obrigatoria: boolean
      ordem: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pergunta"]>
    composites: {}
  }

  type PerguntaGetPayload<S extends boolean | null | undefined | PerguntaDefaultArgs> = $Result.GetResult<Prisma.$PerguntaPayload, S>

  type PerguntaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PerguntaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PerguntaCountAggregateInputType | true
    }

  export interface PerguntaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pergunta'], meta: { name: 'Pergunta' } }
    /**
     * Find zero or one Pergunta that matches the filter.
     * @param {PerguntaFindUniqueArgs} args - Arguments to find a Pergunta
     * @example
     * // Get one Pergunta
     * const pergunta = await prisma.pergunta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PerguntaFindUniqueArgs>(args: SelectSubset<T, PerguntaFindUniqueArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pergunta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PerguntaFindUniqueOrThrowArgs} args - Arguments to find a Pergunta
     * @example
     * // Get one Pergunta
     * const pergunta = await prisma.pergunta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PerguntaFindUniqueOrThrowArgs>(args: SelectSubset<T, PerguntaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pergunta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaFindFirstArgs} args - Arguments to find a Pergunta
     * @example
     * // Get one Pergunta
     * const pergunta = await prisma.pergunta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PerguntaFindFirstArgs>(args?: SelectSubset<T, PerguntaFindFirstArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pergunta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaFindFirstOrThrowArgs} args - Arguments to find a Pergunta
     * @example
     * // Get one Pergunta
     * const pergunta = await prisma.pergunta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PerguntaFindFirstOrThrowArgs>(args?: SelectSubset<T, PerguntaFindFirstOrThrowArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Perguntas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Perguntas
     * const perguntas = await prisma.pergunta.findMany()
     * 
     * // Get first 10 Perguntas
     * const perguntas = await prisma.pergunta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const perguntaWithIdOnly = await prisma.pergunta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PerguntaFindManyArgs>(args?: SelectSubset<T, PerguntaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pergunta.
     * @param {PerguntaCreateArgs} args - Arguments to create a Pergunta.
     * @example
     * // Create one Pergunta
     * const Pergunta = await prisma.pergunta.create({
     *   data: {
     *     // ... data to create a Pergunta
     *   }
     * })
     * 
     */
    create<T extends PerguntaCreateArgs>(args: SelectSubset<T, PerguntaCreateArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Perguntas.
     * @param {PerguntaCreateManyArgs} args - Arguments to create many Perguntas.
     * @example
     * // Create many Perguntas
     * const pergunta = await prisma.pergunta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PerguntaCreateManyArgs>(args?: SelectSubset<T, PerguntaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Pergunta.
     * @param {PerguntaDeleteArgs} args - Arguments to delete one Pergunta.
     * @example
     * // Delete one Pergunta
     * const Pergunta = await prisma.pergunta.delete({
     *   where: {
     *     // ... filter to delete one Pergunta
     *   }
     * })
     * 
     */
    delete<T extends PerguntaDeleteArgs>(args: SelectSubset<T, PerguntaDeleteArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pergunta.
     * @param {PerguntaUpdateArgs} args - Arguments to update one Pergunta.
     * @example
     * // Update one Pergunta
     * const pergunta = await prisma.pergunta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PerguntaUpdateArgs>(args: SelectSubset<T, PerguntaUpdateArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Perguntas.
     * @param {PerguntaDeleteManyArgs} args - Arguments to filter Perguntas to delete.
     * @example
     * // Delete a few Perguntas
     * const { count } = await prisma.pergunta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PerguntaDeleteManyArgs>(args?: SelectSubset<T, PerguntaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Perguntas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Perguntas
     * const pergunta = await prisma.pergunta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PerguntaUpdateManyArgs>(args: SelectSubset<T, PerguntaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Pergunta.
     * @param {PerguntaUpsertArgs} args - Arguments to update or create a Pergunta.
     * @example
     * // Update or create a Pergunta
     * const pergunta = await prisma.pergunta.upsert({
     *   create: {
     *     // ... data to create a Pergunta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pergunta we want to update
     *   }
     * })
     */
    upsert<T extends PerguntaUpsertArgs>(args: SelectSubset<T, PerguntaUpsertArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Perguntas that matches the filter.
     * @param {PerguntaFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const pergunta = await prisma.pergunta.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PerguntaFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Pergunta.
     * @param {PerguntaAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const pergunta = await prisma.pergunta.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PerguntaAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Perguntas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaCountArgs} args - Arguments to filter Perguntas to count.
     * @example
     * // Count the number of Perguntas
     * const count = await prisma.pergunta.count({
     *   where: {
     *     // ... the filter for the Perguntas we want to count
     *   }
     * })
    **/
    count<T extends PerguntaCountArgs>(
      args?: Subset<T, PerguntaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PerguntaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pergunta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PerguntaAggregateArgs>(args: Subset<T, PerguntaAggregateArgs>): Prisma.PrismaPromise<GetPerguntaAggregateType<T>>

    /**
     * Group by Pergunta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerguntaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PerguntaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PerguntaGroupByArgs['orderBy'] }
        : { orderBy?: PerguntaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PerguntaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPerguntaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pergunta model
   */
  readonly fields: PerguntaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pergunta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PerguntaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pesquisa<T extends PesquisaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PesquisaDefaultArgs<ExtArgs>>): Prisma__PesquisaClient<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    opcoes<T extends Pergunta$opcoesArgs<ExtArgs> = {}>(args?: Subset<T, Pergunta$opcoesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OpcaoPerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    respostas<T extends Pergunta$respostasArgs<ExtArgs> = {}>(args?: Subset<T, Pergunta$respostasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pergunta model
   */
  interface PerguntaFieldRefs {
    readonly id: FieldRef<"Pergunta", 'String'>
    readonly pesquisaId: FieldRef<"Pergunta", 'String'>
    readonly texto: FieldRef<"Pergunta", 'String'>
    readonly tipo: FieldRef<"Pergunta", 'TipoPergunta'>
    readonly obrigatoria: FieldRef<"Pergunta", 'Boolean'>
    readonly ordem: FieldRef<"Pergunta", 'Int'>
    readonly createdAt: FieldRef<"Pergunta", 'DateTime'>
    readonly updatedAt: FieldRef<"Pergunta", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pergunta findUnique
   */
  export type PerguntaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter, which Pergunta to fetch.
     */
    where: PerguntaWhereUniqueInput
  }

  /**
   * Pergunta findUniqueOrThrow
   */
  export type PerguntaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter, which Pergunta to fetch.
     */
    where: PerguntaWhereUniqueInput
  }

  /**
   * Pergunta findFirst
   */
  export type PerguntaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter, which Pergunta to fetch.
     */
    where?: PerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Perguntas to fetch.
     */
    orderBy?: PerguntaOrderByWithRelationInput | PerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Perguntas.
     */
    cursor?: PerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Perguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Perguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Perguntas.
     */
    distinct?: PerguntaScalarFieldEnum | PerguntaScalarFieldEnum[]
  }

  /**
   * Pergunta findFirstOrThrow
   */
  export type PerguntaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter, which Pergunta to fetch.
     */
    where?: PerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Perguntas to fetch.
     */
    orderBy?: PerguntaOrderByWithRelationInput | PerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Perguntas.
     */
    cursor?: PerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Perguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Perguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Perguntas.
     */
    distinct?: PerguntaScalarFieldEnum | PerguntaScalarFieldEnum[]
  }

  /**
   * Pergunta findMany
   */
  export type PerguntaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter, which Perguntas to fetch.
     */
    where?: PerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Perguntas to fetch.
     */
    orderBy?: PerguntaOrderByWithRelationInput | PerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Perguntas.
     */
    cursor?: PerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Perguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Perguntas.
     */
    skip?: number
    distinct?: PerguntaScalarFieldEnum | PerguntaScalarFieldEnum[]
  }

  /**
   * Pergunta create
   */
  export type PerguntaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * The data needed to create a Pergunta.
     */
    data: XOR<PerguntaCreateInput, PerguntaUncheckedCreateInput>
  }

  /**
   * Pergunta createMany
   */
  export type PerguntaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Perguntas.
     */
    data: PerguntaCreateManyInput | PerguntaCreateManyInput[]
  }

  /**
   * Pergunta update
   */
  export type PerguntaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * The data needed to update a Pergunta.
     */
    data: XOR<PerguntaUpdateInput, PerguntaUncheckedUpdateInput>
    /**
     * Choose, which Pergunta to update.
     */
    where: PerguntaWhereUniqueInput
  }

  /**
   * Pergunta updateMany
   */
  export type PerguntaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Perguntas.
     */
    data: XOR<PerguntaUpdateManyMutationInput, PerguntaUncheckedUpdateManyInput>
    /**
     * Filter which Perguntas to update
     */
    where?: PerguntaWhereInput
    /**
     * Limit how many Perguntas to update.
     */
    limit?: number
  }

  /**
   * Pergunta upsert
   */
  export type PerguntaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * The filter to search for the Pergunta to update in case it exists.
     */
    where: PerguntaWhereUniqueInput
    /**
     * In case the Pergunta found by the `where` argument doesn't exist, create a new Pergunta with this data.
     */
    create: XOR<PerguntaCreateInput, PerguntaUncheckedCreateInput>
    /**
     * In case the Pergunta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PerguntaUpdateInput, PerguntaUncheckedUpdateInput>
  }

  /**
   * Pergunta delete
   */
  export type PerguntaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
    /**
     * Filter which Pergunta to delete.
     */
    where: PerguntaWhereUniqueInput
  }

  /**
   * Pergunta deleteMany
   */
  export type PerguntaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Perguntas to delete
     */
    where?: PerguntaWhereInput
    /**
     * Limit how many Perguntas to delete.
     */
    limit?: number
  }

  /**
   * Pergunta findRaw
   */
  export type PerguntaFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Pergunta aggregateRaw
   */
  export type PerguntaAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Pergunta.opcoes
   */
  export type Pergunta$opcoesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
    where?: OpcaoPerguntaWhereInput
    orderBy?: OpcaoPerguntaOrderByWithRelationInput | OpcaoPerguntaOrderByWithRelationInput[]
    cursor?: OpcaoPerguntaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OpcaoPerguntaScalarFieldEnum | OpcaoPerguntaScalarFieldEnum[]
  }

  /**
   * Pergunta.respostas
   */
  export type Pergunta$respostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    where?: RespostaPerguntaWhereInput
    orderBy?: RespostaPerguntaOrderByWithRelationInput | RespostaPerguntaOrderByWithRelationInput[]
    cursor?: RespostaPerguntaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RespostaPerguntaScalarFieldEnum | RespostaPerguntaScalarFieldEnum[]
  }

  /**
   * Pergunta without action
   */
  export type PerguntaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pergunta
     */
    select?: PerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pergunta
     */
    omit?: PerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PerguntaInclude<ExtArgs> | null
  }


  /**
   * Model OpcaoPergunta
   */

  export type AggregateOpcaoPergunta = {
    _count: OpcaoPerguntaCountAggregateOutputType | null
    _avg: OpcaoPerguntaAvgAggregateOutputType | null
    _sum: OpcaoPerguntaSumAggregateOutputType | null
    _min: OpcaoPerguntaMinAggregateOutputType | null
    _max: OpcaoPerguntaMaxAggregateOutputType | null
  }

  export type OpcaoPerguntaAvgAggregateOutputType = {
    ordem: number | null
  }

  export type OpcaoPerguntaSumAggregateOutputType = {
    ordem: number | null
  }

  export type OpcaoPerguntaMinAggregateOutputType = {
    id: string | null
    perguntaId: string | null
    texto: string | null
    ordem: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OpcaoPerguntaMaxAggregateOutputType = {
    id: string | null
    perguntaId: string | null
    texto: string | null
    ordem: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OpcaoPerguntaCountAggregateOutputType = {
    id: number
    perguntaId: number
    texto: number
    ordem: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OpcaoPerguntaAvgAggregateInputType = {
    ordem?: true
  }

  export type OpcaoPerguntaSumAggregateInputType = {
    ordem?: true
  }

  export type OpcaoPerguntaMinAggregateInputType = {
    id?: true
    perguntaId?: true
    texto?: true
    ordem?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OpcaoPerguntaMaxAggregateInputType = {
    id?: true
    perguntaId?: true
    texto?: true
    ordem?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OpcaoPerguntaCountAggregateInputType = {
    id?: true
    perguntaId?: true
    texto?: true
    ordem?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OpcaoPerguntaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OpcaoPergunta to aggregate.
     */
    where?: OpcaoPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpcaoPerguntas to fetch.
     */
    orderBy?: OpcaoPerguntaOrderByWithRelationInput | OpcaoPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OpcaoPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpcaoPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpcaoPerguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OpcaoPerguntas
    **/
    _count?: true | OpcaoPerguntaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OpcaoPerguntaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OpcaoPerguntaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OpcaoPerguntaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OpcaoPerguntaMaxAggregateInputType
  }

  export type GetOpcaoPerguntaAggregateType<T extends OpcaoPerguntaAggregateArgs> = {
        [P in keyof T & keyof AggregateOpcaoPergunta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOpcaoPergunta[P]>
      : GetScalarType<T[P], AggregateOpcaoPergunta[P]>
  }




  export type OpcaoPerguntaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OpcaoPerguntaWhereInput
    orderBy?: OpcaoPerguntaOrderByWithAggregationInput | OpcaoPerguntaOrderByWithAggregationInput[]
    by: OpcaoPerguntaScalarFieldEnum[] | OpcaoPerguntaScalarFieldEnum
    having?: OpcaoPerguntaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OpcaoPerguntaCountAggregateInputType | true
    _avg?: OpcaoPerguntaAvgAggregateInputType
    _sum?: OpcaoPerguntaSumAggregateInputType
    _min?: OpcaoPerguntaMinAggregateInputType
    _max?: OpcaoPerguntaMaxAggregateInputType
  }

  export type OpcaoPerguntaGroupByOutputType = {
    id: string
    perguntaId: string
    texto: string
    ordem: number
    createdAt: Date
    updatedAt: Date
    _count: OpcaoPerguntaCountAggregateOutputType | null
    _avg: OpcaoPerguntaAvgAggregateOutputType | null
    _sum: OpcaoPerguntaSumAggregateOutputType | null
    _min: OpcaoPerguntaMinAggregateOutputType | null
    _max: OpcaoPerguntaMaxAggregateOutputType | null
  }

  type GetOpcaoPerguntaGroupByPayload<T extends OpcaoPerguntaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OpcaoPerguntaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OpcaoPerguntaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OpcaoPerguntaGroupByOutputType[P]>
            : GetScalarType<T[P], OpcaoPerguntaGroupByOutputType[P]>
        }
      >
    >


  export type OpcaoPerguntaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    perguntaId?: boolean
    texto?: boolean
    ordem?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
    respostas?: boolean | OpcaoPergunta$respostasArgs<ExtArgs>
    _count?: boolean | OpcaoPerguntaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["opcaoPergunta"]>



  export type OpcaoPerguntaSelectScalar = {
    id?: boolean
    perguntaId?: boolean
    texto?: boolean
    ordem?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OpcaoPerguntaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "perguntaId" | "texto" | "ordem" | "createdAt" | "updatedAt", ExtArgs["result"]["opcaoPergunta"]>
  export type OpcaoPerguntaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
    respostas?: boolean | OpcaoPergunta$respostasArgs<ExtArgs>
    _count?: boolean | OpcaoPerguntaCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $OpcaoPerguntaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OpcaoPergunta"
    objects: {
      pergunta: Prisma.$PerguntaPayload<ExtArgs>
      respostas: Prisma.$RespostaPerguntaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      perguntaId: string
      texto: string
      ordem: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["opcaoPergunta"]>
    composites: {}
  }

  type OpcaoPerguntaGetPayload<S extends boolean | null | undefined | OpcaoPerguntaDefaultArgs> = $Result.GetResult<Prisma.$OpcaoPerguntaPayload, S>

  type OpcaoPerguntaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OpcaoPerguntaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OpcaoPerguntaCountAggregateInputType | true
    }

  export interface OpcaoPerguntaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OpcaoPergunta'], meta: { name: 'OpcaoPergunta' } }
    /**
     * Find zero or one OpcaoPergunta that matches the filter.
     * @param {OpcaoPerguntaFindUniqueArgs} args - Arguments to find a OpcaoPergunta
     * @example
     * // Get one OpcaoPergunta
     * const opcaoPergunta = await prisma.opcaoPergunta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OpcaoPerguntaFindUniqueArgs>(args: SelectSubset<T, OpcaoPerguntaFindUniqueArgs<ExtArgs>>): Prisma__OpcaoPerguntaClient<$Result.GetResult<Prisma.$OpcaoPerguntaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OpcaoPergunta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OpcaoPerguntaFindUniqueOrThrowArgs} args - Arguments to find a OpcaoPergunta
     * @example
     * // Get one OpcaoPergunta
     * const opcaoPergunta = await prisma.opcaoPergunta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OpcaoPerguntaFindUniqueOrThrowArgs>(args: SelectSubset<T, OpcaoPerguntaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OpcaoPerguntaClient<$Result.GetResult<Prisma.$OpcaoPerguntaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OpcaoPergunta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpcaoPerguntaFindFirstArgs} args - Arguments to find a OpcaoPergunta
     * @example
     * // Get one OpcaoPergunta
     * const opcaoPergunta = await prisma.opcaoPergunta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OpcaoPerguntaFindFirstArgs>(args?: SelectSubset<T, OpcaoPerguntaFindFirstArgs<ExtArgs>>): Prisma__OpcaoPerguntaClient<$Result.GetResult<Prisma.$OpcaoPerguntaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OpcaoPergunta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpcaoPerguntaFindFirstOrThrowArgs} args - Arguments to find a OpcaoPergunta
     * @example
     * // Get one OpcaoPergunta
     * const opcaoPergunta = await prisma.opcaoPergunta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OpcaoPerguntaFindFirstOrThrowArgs>(args?: SelectSubset<T, OpcaoPerguntaFindFirstOrThrowArgs<ExtArgs>>): Prisma__OpcaoPerguntaClient<$Result.GetResult<Prisma.$OpcaoPerguntaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OpcaoPerguntas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpcaoPerguntaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OpcaoPerguntas
     * const opcaoPerguntas = await prisma.opcaoPergunta.findMany()
     * 
     * // Get first 10 OpcaoPerguntas
     * const opcaoPerguntas = await prisma.opcaoPergunta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const opcaoPerguntaWithIdOnly = await prisma.opcaoPergunta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OpcaoPerguntaFindManyArgs>(args?: SelectSubset<T, OpcaoPerguntaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OpcaoPerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OpcaoPergunta.
     * @param {OpcaoPerguntaCreateArgs} args - Arguments to create a OpcaoPergunta.
     * @example
     * // Create one OpcaoPergunta
     * const OpcaoPergunta = await prisma.opcaoPergunta.create({
     *   data: {
     *     // ... data to create a OpcaoPergunta
     *   }
     * })
     * 
     */
    create<T extends OpcaoPerguntaCreateArgs>(args: SelectSubset<T, OpcaoPerguntaCreateArgs<ExtArgs>>): Prisma__OpcaoPerguntaClient<$Result.GetResult<Prisma.$OpcaoPerguntaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OpcaoPerguntas.
     * @param {OpcaoPerguntaCreateManyArgs} args - Arguments to create many OpcaoPerguntas.
     * @example
     * // Create many OpcaoPerguntas
     * const opcaoPergunta = await prisma.opcaoPergunta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OpcaoPerguntaCreateManyArgs>(args?: SelectSubset<T, OpcaoPerguntaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a OpcaoPergunta.
     * @param {OpcaoPerguntaDeleteArgs} args - Arguments to delete one OpcaoPergunta.
     * @example
     * // Delete one OpcaoPergunta
     * const OpcaoPergunta = await prisma.opcaoPergunta.delete({
     *   where: {
     *     // ... filter to delete one OpcaoPergunta
     *   }
     * })
     * 
     */
    delete<T extends OpcaoPerguntaDeleteArgs>(args: SelectSubset<T, OpcaoPerguntaDeleteArgs<ExtArgs>>): Prisma__OpcaoPerguntaClient<$Result.GetResult<Prisma.$OpcaoPerguntaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OpcaoPergunta.
     * @param {OpcaoPerguntaUpdateArgs} args - Arguments to update one OpcaoPergunta.
     * @example
     * // Update one OpcaoPergunta
     * const opcaoPergunta = await prisma.opcaoPergunta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OpcaoPerguntaUpdateArgs>(args: SelectSubset<T, OpcaoPerguntaUpdateArgs<ExtArgs>>): Prisma__OpcaoPerguntaClient<$Result.GetResult<Prisma.$OpcaoPerguntaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OpcaoPerguntas.
     * @param {OpcaoPerguntaDeleteManyArgs} args - Arguments to filter OpcaoPerguntas to delete.
     * @example
     * // Delete a few OpcaoPerguntas
     * const { count } = await prisma.opcaoPergunta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OpcaoPerguntaDeleteManyArgs>(args?: SelectSubset<T, OpcaoPerguntaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OpcaoPerguntas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpcaoPerguntaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OpcaoPerguntas
     * const opcaoPergunta = await prisma.opcaoPergunta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OpcaoPerguntaUpdateManyArgs>(args: SelectSubset<T, OpcaoPerguntaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OpcaoPergunta.
     * @param {OpcaoPerguntaUpsertArgs} args - Arguments to update or create a OpcaoPergunta.
     * @example
     * // Update or create a OpcaoPergunta
     * const opcaoPergunta = await prisma.opcaoPergunta.upsert({
     *   create: {
     *     // ... data to create a OpcaoPergunta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OpcaoPergunta we want to update
     *   }
     * })
     */
    upsert<T extends OpcaoPerguntaUpsertArgs>(args: SelectSubset<T, OpcaoPerguntaUpsertArgs<ExtArgs>>): Prisma__OpcaoPerguntaClient<$Result.GetResult<Prisma.$OpcaoPerguntaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OpcaoPerguntas that matches the filter.
     * @param {OpcaoPerguntaFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const opcaoPergunta = await prisma.opcaoPergunta.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: OpcaoPerguntaFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a OpcaoPergunta.
     * @param {OpcaoPerguntaAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const opcaoPergunta = await prisma.opcaoPergunta.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: OpcaoPerguntaAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of OpcaoPerguntas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpcaoPerguntaCountArgs} args - Arguments to filter OpcaoPerguntas to count.
     * @example
     * // Count the number of OpcaoPerguntas
     * const count = await prisma.opcaoPergunta.count({
     *   where: {
     *     // ... the filter for the OpcaoPerguntas we want to count
     *   }
     * })
    **/
    count<T extends OpcaoPerguntaCountArgs>(
      args?: Subset<T, OpcaoPerguntaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OpcaoPerguntaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OpcaoPergunta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpcaoPerguntaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OpcaoPerguntaAggregateArgs>(args: Subset<T, OpcaoPerguntaAggregateArgs>): Prisma.PrismaPromise<GetOpcaoPerguntaAggregateType<T>>

    /**
     * Group by OpcaoPergunta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpcaoPerguntaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OpcaoPerguntaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OpcaoPerguntaGroupByArgs['orderBy'] }
        : { orderBy?: OpcaoPerguntaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OpcaoPerguntaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOpcaoPerguntaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OpcaoPergunta model
   */
  readonly fields: OpcaoPerguntaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OpcaoPergunta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OpcaoPerguntaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pergunta<T extends PerguntaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PerguntaDefaultArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    respostas<T extends OpcaoPergunta$respostasArgs<ExtArgs> = {}>(args?: Subset<T, OpcaoPergunta$respostasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OpcaoPergunta model
   */
  interface OpcaoPerguntaFieldRefs {
    readonly id: FieldRef<"OpcaoPergunta", 'String'>
    readonly perguntaId: FieldRef<"OpcaoPergunta", 'String'>
    readonly texto: FieldRef<"OpcaoPergunta", 'String'>
    readonly ordem: FieldRef<"OpcaoPergunta", 'Int'>
    readonly createdAt: FieldRef<"OpcaoPergunta", 'DateTime'>
    readonly updatedAt: FieldRef<"OpcaoPergunta", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OpcaoPergunta findUnique
   */
  export type OpcaoPerguntaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which OpcaoPergunta to fetch.
     */
    where: OpcaoPerguntaWhereUniqueInput
  }

  /**
   * OpcaoPergunta findUniqueOrThrow
   */
  export type OpcaoPerguntaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which OpcaoPergunta to fetch.
     */
    where: OpcaoPerguntaWhereUniqueInput
  }

  /**
   * OpcaoPergunta findFirst
   */
  export type OpcaoPerguntaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which OpcaoPergunta to fetch.
     */
    where?: OpcaoPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpcaoPerguntas to fetch.
     */
    orderBy?: OpcaoPerguntaOrderByWithRelationInput | OpcaoPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OpcaoPerguntas.
     */
    cursor?: OpcaoPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpcaoPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpcaoPerguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OpcaoPerguntas.
     */
    distinct?: OpcaoPerguntaScalarFieldEnum | OpcaoPerguntaScalarFieldEnum[]
  }

  /**
   * OpcaoPergunta findFirstOrThrow
   */
  export type OpcaoPerguntaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which OpcaoPergunta to fetch.
     */
    where?: OpcaoPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpcaoPerguntas to fetch.
     */
    orderBy?: OpcaoPerguntaOrderByWithRelationInput | OpcaoPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OpcaoPerguntas.
     */
    cursor?: OpcaoPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpcaoPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpcaoPerguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OpcaoPerguntas.
     */
    distinct?: OpcaoPerguntaScalarFieldEnum | OpcaoPerguntaScalarFieldEnum[]
  }

  /**
   * OpcaoPergunta findMany
   */
  export type OpcaoPerguntaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which OpcaoPerguntas to fetch.
     */
    where?: OpcaoPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpcaoPerguntas to fetch.
     */
    orderBy?: OpcaoPerguntaOrderByWithRelationInput | OpcaoPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OpcaoPerguntas.
     */
    cursor?: OpcaoPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpcaoPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpcaoPerguntas.
     */
    skip?: number
    distinct?: OpcaoPerguntaScalarFieldEnum | OpcaoPerguntaScalarFieldEnum[]
  }

  /**
   * OpcaoPergunta create
   */
  export type OpcaoPerguntaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
    /**
     * The data needed to create a OpcaoPergunta.
     */
    data: XOR<OpcaoPerguntaCreateInput, OpcaoPerguntaUncheckedCreateInput>
  }

  /**
   * OpcaoPergunta createMany
   */
  export type OpcaoPerguntaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OpcaoPerguntas.
     */
    data: OpcaoPerguntaCreateManyInput | OpcaoPerguntaCreateManyInput[]
  }

  /**
   * OpcaoPergunta update
   */
  export type OpcaoPerguntaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
    /**
     * The data needed to update a OpcaoPergunta.
     */
    data: XOR<OpcaoPerguntaUpdateInput, OpcaoPerguntaUncheckedUpdateInput>
    /**
     * Choose, which OpcaoPergunta to update.
     */
    where: OpcaoPerguntaWhereUniqueInput
  }

  /**
   * OpcaoPergunta updateMany
   */
  export type OpcaoPerguntaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OpcaoPerguntas.
     */
    data: XOR<OpcaoPerguntaUpdateManyMutationInput, OpcaoPerguntaUncheckedUpdateManyInput>
    /**
     * Filter which OpcaoPerguntas to update
     */
    where?: OpcaoPerguntaWhereInput
    /**
     * Limit how many OpcaoPerguntas to update.
     */
    limit?: number
  }

  /**
   * OpcaoPergunta upsert
   */
  export type OpcaoPerguntaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
    /**
     * The filter to search for the OpcaoPergunta to update in case it exists.
     */
    where: OpcaoPerguntaWhereUniqueInput
    /**
     * In case the OpcaoPergunta found by the `where` argument doesn't exist, create a new OpcaoPergunta with this data.
     */
    create: XOR<OpcaoPerguntaCreateInput, OpcaoPerguntaUncheckedCreateInput>
    /**
     * In case the OpcaoPergunta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OpcaoPerguntaUpdateInput, OpcaoPerguntaUncheckedUpdateInput>
  }

  /**
   * OpcaoPergunta delete
   */
  export type OpcaoPerguntaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
    /**
     * Filter which OpcaoPergunta to delete.
     */
    where: OpcaoPerguntaWhereUniqueInput
  }

  /**
   * OpcaoPergunta deleteMany
   */
  export type OpcaoPerguntaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OpcaoPerguntas to delete
     */
    where?: OpcaoPerguntaWhereInput
    /**
     * Limit how many OpcaoPerguntas to delete.
     */
    limit?: number
  }

  /**
   * OpcaoPergunta findRaw
   */
  export type OpcaoPerguntaFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * OpcaoPergunta aggregateRaw
   */
  export type OpcaoPerguntaAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * OpcaoPergunta.respostas
   */
  export type OpcaoPergunta$respostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    where?: RespostaPerguntaWhereInput
    orderBy?: RespostaPerguntaOrderByWithRelationInput | RespostaPerguntaOrderByWithRelationInput[]
    cursor?: RespostaPerguntaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RespostaPerguntaScalarFieldEnum | RespostaPerguntaScalarFieldEnum[]
  }

  /**
   * OpcaoPergunta without action
   */
  export type OpcaoPerguntaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
  }


  /**
   * Model PontoColeta
   */

  export type AggregatePontoColeta = {
    _count: PontoColetaCountAggregateOutputType | null
    _min: PontoColetaMinAggregateOutputType | null
    _max: PontoColetaMaxAggregateOutputType | null
  }

  export type PontoColetaMinAggregateOutputType = {
    id: string | null
    token: string | null
    pesquisaId: string | null
    nome: string | null
    ativo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PontoColetaMaxAggregateOutputType = {
    id: string | null
    token: string | null
    pesquisaId: string | null
    nome: string | null
    ativo: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PontoColetaCountAggregateOutputType = {
    id: number
    token: number
    pesquisaId: number
    nome: number
    ativo: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PontoColetaMinAggregateInputType = {
    id?: true
    token?: true
    pesquisaId?: true
    nome?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PontoColetaMaxAggregateInputType = {
    id?: true
    token?: true
    pesquisaId?: true
    nome?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PontoColetaCountAggregateInputType = {
    id?: true
    token?: true
    pesquisaId?: true
    nome?: true
    ativo?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PontoColetaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PontoColeta to aggregate.
     */
    where?: PontoColetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PontoColetas to fetch.
     */
    orderBy?: PontoColetaOrderByWithRelationInput | PontoColetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PontoColetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PontoColetas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PontoColetas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PontoColetas
    **/
    _count?: true | PontoColetaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PontoColetaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PontoColetaMaxAggregateInputType
  }

  export type GetPontoColetaAggregateType<T extends PontoColetaAggregateArgs> = {
        [P in keyof T & keyof AggregatePontoColeta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePontoColeta[P]>
      : GetScalarType<T[P], AggregatePontoColeta[P]>
  }




  export type PontoColetaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PontoColetaWhereInput
    orderBy?: PontoColetaOrderByWithAggregationInput | PontoColetaOrderByWithAggregationInput[]
    by: PontoColetaScalarFieldEnum[] | PontoColetaScalarFieldEnum
    having?: PontoColetaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PontoColetaCountAggregateInputType | true
    _min?: PontoColetaMinAggregateInputType
    _max?: PontoColetaMaxAggregateInputType
  }

  export type PontoColetaGroupByOutputType = {
    id: string
    token: string
    pesquisaId: string
    nome: string
    ativo: boolean
    createdAt: Date
    updatedAt: Date
    _count: PontoColetaCountAggregateOutputType | null
    _min: PontoColetaMinAggregateOutputType | null
    _max: PontoColetaMaxAggregateOutputType | null
  }

  type GetPontoColetaGroupByPayload<T extends PontoColetaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PontoColetaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PontoColetaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PontoColetaGroupByOutputType[P]>
            : GetScalarType<T[P], PontoColetaGroupByOutputType[P]>
        }
      >
    >


  export type PontoColetaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    pesquisaId?: boolean
    nome?: boolean
    ativo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pesquisa?: boolean | PesquisaDefaultArgs<ExtArgs>
    respostas?: boolean | PontoColeta$respostasArgs<ExtArgs>
    _count?: boolean | PontoColetaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pontoColeta"]>



  export type PontoColetaSelectScalar = {
    id?: boolean
    token?: boolean
    pesquisaId?: boolean
    nome?: boolean
    ativo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PontoColetaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "token" | "pesquisaId" | "nome" | "ativo" | "createdAt" | "updatedAt", ExtArgs["result"]["pontoColeta"]>
  export type PontoColetaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pesquisa?: boolean | PesquisaDefaultArgs<ExtArgs>
    respostas?: boolean | PontoColeta$respostasArgs<ExtArgs>
    _count?: boolean | PontoColetaCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PontoColetaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PontoColeta"
    objects: {
      pesquisa: Prisma.$PesquisaPayload<ExtArgs>
      respostas: Prisma.$RespostaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      pesquisaId: string
      nome: string
      ativo: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pontoColeta"]>
    composites: {}
  }

  type PontoColetaGetPayload<S extends boolean | null | undefined | PontoColetaDefaultArgs> = $Result.GetResult<Prisma.$PontoColetaPayload, S>

  type PontoColetaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PontoColetaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PontoColetaCountAggregateInputType | true
    }

  export interface PontoColetaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PontoColeta'], meta: { name: 'PontoColeta' } }
    /**
     * Find zero or one PontoColeta that matches the filter.
     * @param {PontoColetaFindUniqueArgs} args - Arguments to find a PontoColeta
     * @example
     * // Get one PontoColeta
     * const pontoColeta = await prisma.pontoColeta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PontoColetaFindUniqueArgs>(args: SelectSubset<T, PontoColetaFindUniqueArgs<ExtArgs>>): Prisma__PontoColetaClient<$Result.GetResult<Prisma.$PontoColetaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PontoColeta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PontoColetaFindUniqueOrThrowArgs} args - Arguments to find a PontoColeta
     * @example
     * // Get one PontoColeta
     * const pontoColeta = await prisma.pontoColeta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PontoColetaFindUniqueOrThrowArgs>(args: SelectSubset<T, PontoColetaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PontoColetaClient<$Result.GetResult<Prisma.$PontoColetaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PontoColeta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PontoColetaFindFirstArgs} args - Arguments to find a PontoColeta
     * @example
     * // Get one PontoColeta
     * const pontoColeta = await prisma.pontoColeta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PontoColetaFindFirstArgs>(args?: SelectSubset<T, PontoColetaFindFirstArgs<ExtArgs>>): Prisma__PontoColetaClient<$Result.GetResult<Prisma.$PontoColetaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PontoColeta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PontoColetaFindFirstOrThrowArgs} args - Arguments to find a PontoColeta
     * @example
     * // Get one PontoColeta
     * const pontoColeta = await prisma.pontoColeta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PontoColetaFindFirstOrThrowArgs>(args?: SelectSubset<T, PontoColetaFindFirstOrThrowArgs<ExtArgs>>): Prisma__PontoColetaClient<$Result.GetResult<Prisma.$PontoColetaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PontoColetas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PontoColetaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PontoColetas
     * const pontoColetas = await prisma.pontoColeta.findMany()
     * 
     * // Get first 10 PontoColetas
     * const pontoColetas = await prisma.pontoColeta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pontoColetaWithIdOnly = await prisma.pontoColeta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PontoColetaFindManyArgs>(args?: SelectSubset<T, PontoColetaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PontoColetaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PontoColeta.
     * @param {PontoColetaCreateArgs} args - Arguments to create a PontoColeta.
     * @example
     * // Create one PontoColeta
     * const PontoColeta = await prisma.pontoColeta.create({
     *   data: {
     *     // ... data to create a PontoColeta
     *   }
     * })
     * 
     */
    create<T extends PontoColetaCreateArgs>(args: SelectSubset<T, PontoColetaCreateArgs<ExtArgs>>): Prisma__PontoColetaClient<$Result.GetResult<Prisma.$PontoColetaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PontoColetas.
     * @param {PontoColetaCreateManyArgs} args - Arguments to create many PontoColetas.
     * @example
     * // Create many PontoColetas
     * const pontoColeta = await prisma.pontoColeta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PontoColetaCreateManyArgs>(args?: SelectSubset<T, PontoColetaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PontoColeta.
     * @param {PontoColetaDeleteArgs} args - Arguments to delete one PontoColeta.
     * @example
     * // Delete one PontoColeta
     * const PontoColeta = await prisma.pontoColeta.delete({
     *   where: {
     *     // ... filter to delete one PontoColeta
     *   }
     * })
     * 
     */
    delete<T extends PontoColetaDeleteArgs>(args: SelectSubset<T, PontoColetaDeleteArgs<ExtArgs>>): Prisma__PontoColetaClient<$Result.GetResult<Prisma.$PontoColetaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PontoColeta.
     * @param {PontoColetaUpdateArgs} args - Arguments to update one PontoColeta.
     * @example
     * // Update one PontoColeta
     * const pontoColeta = await prisma.pontoColeta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PontoColetaUpdateArgs>(args: SelectSubset<T, PontoColetaUpdateArgs<ExtArgs>>): Prisma__PontoColetaClient<$Result.GetResult<Prisma.$PontoColetaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PontoColetas.
     * @param {PontoColetaDeleteManyArgs} args - Arguments to filter PontoColetas to delete.
     * @example
     * // Delete a few PontoColetas
     * const { count } = await prisma.pontoColeta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PontoColetaDeleteManyArgs>(args?: SelectSubset<T, PontoColetaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PontoColetas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PontoColetaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PontoColetas
     * const pontoColeta = await prisma.pontoColeta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PontoColetaUpdateManyArgs>(args: SelectSubset<T, PontoColetaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PontoColeta.
     * @param {PontoColetaUpsertArgs} args - Arguments to update or create a PontoColeta.
     * @example
     * // Update or create a PontoColeta
     * const pontoColeta = await prisma.pontoColeta.upsert({
     *   create: {
     *     // ... data to create a PontoColeta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PontoColeta we want to update
     *   }
     * })
     */
    upsert<T extends PontoColetaUpsertArgs>(args: SelectSubset<T, PontoColetaUpsertArgs<ExtArgs>>): Prisma__PontoColetaClient<$Result.GetResult<Prisma.$PontoColetaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PontoColetas that matches the filter.
     * @param {PontoColetaFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const pontoColeta = await prisma.pontoColeta.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: PontoColetaFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a PontoColeta.
     * @param {PontoColetaAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const pontoColeta = await prisma.pontoColeta.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PontoColetaAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of PontoColetas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PontoColetaCountArgs} args - Arguments to filter PontoColetas to count.
     * @example
     * // Count the number of PontoColetas
     * const count = await prisma.pontoColeta.count({
     *   where: {
     *     // ... the filter for the PontoColetas we want to count
     *   }
     * })
    **/
    count<T extends PontoColetaCountArgs>(
      args?: Subset<T, PontoColetaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PontoColetaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PontoColeta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PontoColetaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PontoColetaAggregateArgs>(args: Subset<T, PontoColetaAggregateArgs>): Prisma.PrismaPromise<GetPontoColetaAggregateType<T>>

    /**
     * Group by PontoColeta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PontoColetaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PontoColetaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PontoColetaGroupByArgs['orderBy'] }
        : { orderBy?: PontoColetaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PontoColetaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPontoColetaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PontoColeta model
   */
  readonly fields: PontoColetaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PontoColeta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PontoColetaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pesquisa<T extends PesquisaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PesquisaDefaultArgs<ExtArgs>>): Prisma__PesquisaClient<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    respostas<T extends PontoColeta$respostasArgs<ExtArgs> = {}>(args?: Subset<T, PontoColeta$respostasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PontoColeta model
   */
  interface PontoColetaFieldRefs {
    readonly id: FieldRef<"PontoColeta", 'String'>
    readonly token: FieldRef<"PontoColeta", 'String'>
    readonly pesquisaId: FieldRef<"PontoColeta", 'String'>
    readonly nome: FieldRef<"PontoColeta", 'String'>
    readonly ativo: FieldRef<"PontoColeta", 'Boolean'>
    readonly createdAt: FieldRef<"PontoColeta", 'DateTime'>
    readonly updatedAt: FieldRef<"PontoColeta", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PontoColeta findUnique
   */
  export type PontoColetaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
    /**
     * Filter, which PontoColeta to fetch.
     */
    where: PontoColetaWhereUniqueInput
  }

  /**
   * PontoColeta findUniqueOrThrow
   */
  export type PontoColetaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
    /**
     * Filter, which PontoColeta to fetch.
     */
    where: PontoColetaWhereUniqueInput
  }

  /**
   * PontoColeta findFirst
   */
  export type PontoColetaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
    /**
     * Filter, which PontoColeta to fetch.
     */
    where?: PontoColetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PontoColetas to fetch.
     */
    orderBy?: PontoColetaOrderByWithRelationInput | PontoColetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PontoColetas.
     */
    cursor?: PontoColetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PontoColetas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PontoColetas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PontoColetas.
     */
    distinct?: PontoColetaScalarFieldEnum | PontoColetaScalarFieldEnum[]
  }

  /**
   * PontoColeta findFirstOrThrow
   */
  export type PontoColetaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
    /**
     * Filter, which PontoColeta to fetch.
     */
    where?: PontoColetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PontoColetas to fetch.
     */
    orderBy?: PontoColetaOrderByWithRelationInput | PontoColetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PontoColetas.
     */
    cursor?: PontoColetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PontoColetas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PontoColetas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PontoColetas.
     */
    distinct?: PontoColetaScalarFieldEnum | PontoColetaScalarFieldEnum[]
  }

  /**
   * PontoColeta findMany
   */
  export type PontoColetaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
    /**
     * Filter, which PontoColetas to fetch.
     */
    where?: PontoColetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PontoColetas to fetch.
     */
    orderBy?: PontoColetaOrderByWithRelationInput | PontoColetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PontoColetas.
     */
    cursor?: PontoColetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PontoColetas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PontoColetas.
     */
    skip?: number
    distinct?: PontoColetaScalarFieldEnum | PontoColetaScalarFieldEnum[]
  }

  /**
   * PontoColeta create
   */
  export type PontoColetaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
    /**
     * The data needed to create a PontoColeta.
     */
    data: XOR<PontoColetaCreateInput, PontoColetaUncheckedCreateInput>
  }

  /**
   * PontoColeta createMany
   */
  export type PontoColetaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PontoColetas.
     */
    data: PontoColetaCreateManyInput | PontoColetaCreateManyInput[]
  }

  /**
   * PontoColeta update
   */
  export type PontoColetaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
    /**
     * The data needed to update a PontoColeta.
     */
    data: XOR<PontoColetaUpdateInput, PontoColetaUncheckedUpdateInput>
    /**
     * Choose, which PontoColeta to update.
     */
    where: PontoColetaWhereUniqueInput
  }

  /**
   * PontoColeta updateMany
   */
  export type PontoColetaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PontoColetas.
     */
    data: XOR<PontoColetaUpdateManyMutationInput, PontoColetaUncheckedUpdateManyInput>
    /**
     * Filter which PontoColetas to update
     */
    where?: PontoColetaWhereInput
    /**
     * Limit how many PontoColetas to update.
     */
    limit?: number
  }

  /**
   * PontoColeta upsert
   */
  export type PontoColetaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
    /**
     * The filter to search for the PontoColeta to update in case it exists.
     */
    where: PontoColetaWhereUniqueInput
    /**
     * In case the PontoColeta found by the `where` argument doesn't exist, create a new PontoColeta with this data.
     */
    create: XOR<PontoColetaCreateInput, PontoColetaUncheckedCreateInput>
    /**
     * In case the PontoColeta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PontoColetaUpdateInput, PontoColetaUncheckedUpdateInput>
  }

  /**
   * PontoColeta delete
   */
  export type PontoColetaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
    /**
     * Filter which PontoColeta to delete.
     */
    where: PontoColetaWhereUniqueInput
  }

  /**
   * PontoColeta deleteMany
   */
  export type PontoColetaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PontoColetas to delete
     */
    where?: PontoColetaWhereInput
    /**
     * Limit how many PontoColetas to delete.
     */
    limit?: number
  }

  /**
   * PontoColeta findRaw
   */
  export type PontoColetaFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PontoColeta aggregateRaw
   */
  export type PontoColetaAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * PontoColeta.respostas
   */
  export type PontoColeta$respostasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    where?: RespostaWhereInput
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    cursor?: RespostaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * PontoColeta without action
   */
  export type PontoColetaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
  }


  /**
   * Model Resposta
   */

  export type AggregateResposta = {
    _count: RespostaCountAggregateOutputType | null
    _min: RespostaMinAggregateOutputType | null
    _max: RespostaMaxAggregateOutputType | null
  }

  export type RespostaMinAggregateOutputType = {
    id: string | null
    pesquisaId: string | null
    pontoColetaId: string | null
    idempotencyKey: string | null
    submissionHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RespostaMaxAggregateOutputType = {
    id: string | null
    pesquisaId: string | null
    pontoColetaId: string | null
    idempotencyKey: string | null
    submissionHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RespostaCountAggregateOutputType = {
    id: number
    pesquisaId: number
    pontoColetaId: number
    idempotencyKey: number
    submissionHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RespostaMinAggregateInputType = {
    id?: true
    pesquisaId?: true
    pontoColetaId?: true
    idempotencyKey?: true
    submissionHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RespostaMaxAggregateInputType = {
    id?: true
    pesquisaId?: true
    pontoColetaId?: true
    idempotencyKey?: true
    submissionHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RespostaCountAggregateInputType = {
    id?: true
    pesquisaId?: true
    pontoColetaId?: true
    idempotencyKey?: true
    submissionHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RespostaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resposta to aggregate.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Respostas
    **/
    _count?: true | RespostaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RespostaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RespostaMaxAggregateInputType
  }

  export type GetRespostaAggregateType<T extends RespostaAggregateArgs> = {
        [P in keyof T & keyof AggregateResposta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResposta[P]>
      : GetScalarType<T[P], AggregateResposta[P]>
  }




  export type RespostaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaWhereInput
    orderBy?: RespostaOrderByWithAggregationInput | RespostaOrderByWithAggregationInput[]
    by: RespostaScalarFieldEnum[] | RespostaScalarFieldEnum
    having?: RespostaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RespostaCountAggregateInputType | true
    _min?: RespostaMinAggregateInputType
    _max?: RespostaMaxAggregateInputType
  }

  export type RespostaGroupByOutputType = {
    id: string
    pesquisaId: string
    pontoColetaId: string | null
    idempotencyKey: string | null
    submissionHash: string | null
    createdAt: Date
    updatedAt: Date
    _count: RespostaCountAggregateOutputType | null
    _min: RespostaMinAggregateOutputType | null
    _max: RespostaMaxAggregateOutputType | null
  }

  type GetRespostaGroupByPayload<T extends RespostaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RespostaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RespostaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RespostaGroupByOutputType[P]>
            : GetScalarType<T[P], RespostaGroupByOutputType[P]>
        }
      >
    >


  export type RespostaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pesquisaId?: boolean
    pontoColetaId?: boolean
    idempotencyKey?: boolean
    submissionHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    pesquisa?: boolean | PesquisaDefaultArgs<ExtArgs>
    pontoColeta?: boolean | Resposta$pontoColetaArgs<ExtArgs>
    perguntas?: boolean | Resposta$perguntasArgs<ExtArgs>
    _count?: boolean | RespostaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resposta"]>



  export type RespostaSelectScalar = {
    id?: boolean
    pesquisaId?: boolean
    pontoColetaId?: boolean
    idempotencyKey?: boolean
    submissionHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RespostaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "pesquisaId" | "pontoColetaId" | "idempotencyKey" | "submissionHash" | "createdAt" | "updatedAt", ExtArgs["result"]["resposta"]>
  export type RespostaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pesquisa?: boolean | PesquisaDefaultArgs<ExtArgs>
    pontoColeta?: boolean | Resposta$pontoColetaArgs<ExtArgs>
    perguntas?: boolean | Resposta$perguntasArgs<ExtArgs>
    _count?: boolean | RespostaCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $RespostaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Resposta"
    objects: {
      pesquisa: Prisma.$PesquisaPayload<ExtArgs>
      pontoColeta: Prisma.$PontoColetaPayload<ExtArgs> | null
      perguntas: Prisma.$RespostaPerguntaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pesquisaId: string
      pontoColetaId: string | null
      idempotencyKey: string | null
      submissionHash: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["resposta"]>
    composites: {}
  }

  type RespostaGetPayload<S extends boolean | null | undefined | RespostaDefaultArgs> = $Result.GetResult<Prisma.$RespostaPayload, S>

  type RespostaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RespostaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RespostaCountAggregateInputType | true
    }

  export interface RespostaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Resposta'], meta: { name: 'Resposta' } }
    /**
     * Find zero or one Resposta that matches the filter.
     * @param {RespostaFindUniqueArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RespostaFindUniqueArgs>(args: SelectSubset<T, RespostaFindUniqueArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Resposta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RespostaFindUniqueOrThrowArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RespostaFindUniqueOrThrowArgs>(args: SelectSubset<T, RespostaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resposta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaFindFirstArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RespostaFindFirstArgs>(args?: SelectSubset<T, RespostaFindFirstArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resposta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaFindFirstOrThrowArgs} args - Arguments to find a Resposta
     * @example
     * // Get one Resposta
     * const resposta = await prisma.resposta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RespostaFindFirstOrThrowArgs>(args?: SelectSubset<T, RespostaFindFirstOrThrowArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Respostas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Respostas
     * const respostas = await prisma.resposta.findMany()
     * 
     * // Get first 10 Respostas
     * const respostas = await prisma.resposta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const respostaWithIdOnly = await prisma.resposta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RespostaFindManyArgs>(args?: SelectSubset<T, RespostaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Resposta.
     * @param {RespostaCreateArgs} args - Arguments to create a Resposta.
     * @example
     * // Create one Resposta
     * const Resposta = await prisma.resposta.create({
     *   data: {
     *     // ... data to create a Resposta
     *   }
     * })
     * 
     */
    create<T extends RespostaCreateArgs>(args: SelectSubset<T, RespostaCreateArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Respostas.
     * @param {RespostaCreateManyArgs} args - Arguments to create many Respostas.
     * @example
     * // Create many Respostas
     * const resposta = await prisma.resposta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RespostaCreateManyArgs>(args?: SelectSubset<T, RespostaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Resposta.
     * @param {RespostaDeleteArgs} args - Arguments to delete one Resposta.
     * @example
     * // Delete one Resposta
     * const Resposta = await prisma.resposta.delete({
     *   where: {
     *     // ... filter to delete one Resposta
     *   }
     * })
     * 
     */
    delete<T extends RespostaDeleteArgs>(args: SelectSubset<T, RespostaDeleteArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Resposta.
     * @param {RespostaUpdateArgs} args - Arguments to update one Resposta.
     * @example
     * // Update one Resposta
     * const resposta = await prisma.resposta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RespostaUpdateArgs>(args: SelectSubset<T, RespostaUpdateArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Respostas.
     * @param {RespostaDeleteManyArgs} args - Arguments to filter Respostas to delete.
     * @example
     * // Delete a few Respostas
     * const { count } = await prisma.resposta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RespostaDeleteManyArgs>(args?: SelectSubset<T, RespostaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Respostas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Respostas
     * const resposta = await prisma.resposta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RespostaUpdateManyArgs>(args: SelectSubset<T, RespostaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Resposta.
     * @param {RespostaUpsertArgs} args - Arguments to update or create a Resposta.
     * @example
     * // Update or create a Resposta
     * const resposta = await prisma.resposta.upsert({
     *   create: {
     *     // ... data to create a Resposta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resposta we want to update
     *   }
     * })
     */
    upsert<T extends RespostaUpsertArgs>(args: SelectSubset<T, RespostaUpsertArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Respostas that matches the filter.
     * @param {RespostaFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const resposta = await prisma.resposta.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: RespostaFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Resposta.
     * @param {RespostaAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const resposta = await prisma.resposta.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: RespostaAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Respostas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaCountArgs} args - Arguments to filter Respostas to count.
     * @example
     * // Count the number of Respostas
     * const count = await prisma.resposta.count({
     *   where: {
     *     // ... the filter for the Respostas we want to count
     *   }
     * })
    **/
    count<T extends RespostaCountArgs>(
      args?: Subset<T, RespostaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RespostaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resposta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RespostaAggregateArgs>(args: Subset<T, RespostaAggregateArgs>): Prisma.PrismaPromise<GetRespostaAggregateType<T>>

    /**
     * Group by Resposta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RespostaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RespostaGroupByArgs['orderBy'] }
        : { orderBy?: RespostaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RespostaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRespostaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Resposta model
   */
  readonly fields: RespostaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Resposta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RespostaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pesquisa<T extends PesquisaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PesquisaDefaultArgs<ExtArgs>>): Prisma__PesquisaClient<$Result.GetResult<Prisma.$PesquisaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    pontoColeta<T extends Resposta$pontoColetaArgs<ExtArgs> = {}>(args?: Subset<T, Resposta$pontoColetaArgs<ExtArgs>>): Prisma__PontoColetaClient<$Result.GetResult<Prisma.$PontoColetaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    perguntas<T extends Resposta$perguntasArgs<ExtArgs> = {}>(args?: Subset<T, Resposta$perguntasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Resposta model
   */
  interface RespostaFieldRefs {
    readonly id: FieldRef<"Resposta", 'String'>
    readonly pesquisaId: FieldRef<"Resposta", 'String'>
    readonly pontoColetaId: FieldRef<"Resposta", 'String'>
    readonly idempotencyKey: FieldRef<"Resposta", 'String'>
    readonly submissionHash: FieldRef<"Resposta", 'String'>
    readonly createdAt: FieldRef<"Resposta", 'DateTime'>
    readonly updatedAt: FieldRef<"Resposta", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Resposta findUnique
   */
  export type RespostaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta findUniqueOrThrow
   */
  export type RespostaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta findFirst
   */
  export type RespostaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Respostas.
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Respostas.
     */
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Resposta findFirstOrThrow
   */
  export type RespostaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Resposta to fetch.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Respostas.
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Respostas.
     */
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Resposta findMany
   */
  export type RespostaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter, which Respostas to fetch.
     */
    where?: RespostaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Respostas to fetch.
     */
    orderBy?: RespostaOrderByWithRelationInput | RespostaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Respostas.
     */
    cursor?: RespostaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Respostas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Respostas.
     */
    skip?: number
    distinct?: RespostaScalarFieldEnum | RespostaScalarFieldEnum[]
  }

  /**
   * Resposta create
   */
  export type RespostaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * The data needed to create a Resposta.
     */
    data: XOR<RespostaCreateInput, RespostaUncheckedCreateInput>
  }

  /**
   * Resposta createMany
   */
  export type RespostaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Respostas.
     */
    data: RespostaCreateManyInput | RespostaCreateManyInput[]
  }

  /**
   * Resposta update
   */
  export type RespostaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * The data needed to update a Resposta.
     */
    data: XOR<RespostaUpdateInput, RespostaUncheckedUpdateInput>
    /**
     * Choose, which Resposta to update.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta updateMany
   */
  export type RespostaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Respostas.
     */
    data: XOR<RespostaUpdateManyMutationInput, RespostaUncheckedUpdateManyInput>
    /**
     * Filter which Respostas to update
     */
    where?: RespostaWhereInput
    /**
     * Limit how many Respostas to update.
     */
    limit?: number
  }

  /**
   * Resposta upsert
   */
  export type RespostaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * The filter to search for the Resposta to update in case it exists.
     */
    where: RespostaWhereUniqueInput
    /**
     * In case the Resposta found by the `where` argument doesn't exist, create a new Resposta with this data.
     */
    create: XOR<RespostaCreateInput, RespostaUncheckedCreateInput>
    /**
     * In case the Resposta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RespostaUpdateInput, RespostaUncheckedUpdateInput>
  }

  /**
   * Resposta delete
   */
  export type RespostaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
    /**
     * Filter which Resposta to delete.
     */
    where: RespostaWhereUniqueInput
  }

  /**
   * Resposta deleteMany
   */
  export type RespostaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Respostas to delete
     */
    where?: RespostaWhereInput
    /**
     * Limit how many Respostas to delete.
     */
    limit?: number
  }

  /**
   * Resposta findRaw
   */
  export type RespostaFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Resposta aggregateRaw
   */
  export type RespostaAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Resposta.pontoColeta
   */
  export type Resposta$pontoColetaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PontoColeta
     */
    select?: PontoColetaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PontoColeta
     */
    omit?: PontoColetaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PontoColetaInclude<ExtArgs> | null
    where?: PontoColetaWhereInput
  }

  /**
   * Resposta.perguntas
   */
  export type Resposta$perguntasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    where?: RespostaPerguntaWhereInput
    orderBy?: RespostaPerguntaOrderByWithRelationInput | RespostaPerguntaOrderByWithRelationInput[]
    cursor?: RespostaPerguntaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RespostaPerguntaScalarFieldEnum | RespostaPerguntaScalarFieldEnum[]
  }

  /**
   * Resposta without action
   */
  export type RespostaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resposta
     */
    select?: RespostaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resposta
     */
    omit?: RespostaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaInclude<ExtArgs> | null
  }


  /**
   * Model RespostaPergunta
   */

  export type AggregateRespostaPergunta = {
    _count: RespostaPerguntaCountAggregateOutputType | null
    _avg: RespostaPerguntaAvgAggregateOutputType | null
    _sum: RespostaPerguntaSumAggregateOutputType | null
    _min: RespostaPerguntaMinAggregateOutputType | null
    _max: RespostaPerguntaMaxAggregateOutputType | null
  }

  export type RespostaPerguntaAvgAggregateOutputType = {
    valorEstrelas: number | null
    valorNps: number | null
  }

  export type RespostaPerguntaSumAggregateOutputType = {
    valorEstrelas: number | null
    valorNps: number | null
  }

  export type RespostaPerguntaMinAggregateOutputType = {
    id: string | null
    respostaId: string | null
    pesquisaId: string | null
    perguntaId: string | null
    tipo: $Enums.TipoPergunta | null
    valorEstrelas: number | null
    valorNps: number | null
    valorSimNao: boolean | null
    valorTexto: string | null
    opcaoPerguntaId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RespostaPerguntaMaxAggregateOutputType = {
    id: string | null
    respostaId: string | null
    pesquisaId: string | null
    perguntaId: string | null
    tipo: $Enums.TipoPergunta | null
    valorEstrelas: number | null
    valorNps: number | null
    valorSimNao: boolean | null
    valorTexto: string | null
    opcaoPerguntaId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RespostaPerguntaCountAggregateOutputType = {
    id: number
    respostaId: number
    pesquisaId: number
    perguntaId: number
    tipo: number
    valorEstrelas: number
    valorNps: number
    valorSimNao: number
    valorTexto: number
    opcaoPerguntaId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RespostaPerguntaAvgAggregateInputType = {
    valorEstrelas?: true
    valorNps?: true
  }

  export type RespostaPerguntaSumAggregateInputType = {
    valorEstrelas?: true
    valorNps?: true
  }

  export type RespostaPerguntaMinAggregateInputType = {
    id?: true
    respostaId?: true
    pesquisaId?: true
    perguntaId?: true
    tipo?: true
    valorEstrelas?: true
    valorNps?: true
    valorSimNao?: true
    valorTexto?: true
    opcaoPerguntaId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RespostaPerguntaMaxAggregateInputType = {
    id?: true
    respostaId?: true
    pesquisaId?: true
    perguntaId?: true
    tipo?: true
    valorEstrelas?: true
    valorNps?: true
    valorSimNao?: true
    valorTexto?: true
    opcaoPerguntaId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RespostaPerguntaCountAggregateInputType = {
    id?: true
    respostaId?: true
    pesquisaId?: true
    perguntaId?: true
    tipo?: true
    valorEstrelas?: true
    valorNps?: true
    valorSimNao?: true
    valorTexto?: true
    opcaoPerguntaId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RespostaPerguntaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RespostaPergunta to aggregate.
     */
    where?: RespostaPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RespostaPerguntas to fetch.
     */
    orderBy?: RespostaPerguntaOrderByWithRelationInput | RespostaPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RespostaPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RespostaPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RespostaPerguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RespostaPerguntas
    **/
    _count?: true | RespostaPerguntaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RespostaPerguntaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RespostaPerguntaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RespostaPerguntaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RespostaPerguntaMaxAggregateInputType
  }

  export type GetRespostaPerguntaAggregateType<T extends RespostaPerguntaAggregateArgs> = {
        [P in keyof T & keyof AggregateRespostaPergunta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRespostaPergunta[P]>
      : GetScalarType<T[P], AggregateRespostaPergunta[P]>
  }




  export type RespostaPerguntaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RespostaPerguntaWhereInput
    orderBy?: RespostaPerguntaOrderByWithAggregationInput | RespostaPerguntaOrderByWithAggregationInput[]
    by: RespostaPerguntaScalarFieldEnum[] | RespostaPerguntaScalarFieldEnum
    having?: RespostaPerguntaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RespostaPerguntaCountAggregateInputType | true
    _avg?: RespostaPerguntaAvgAggregateInputType
    _sum?: RespostaPerguntaSumAggregateInputType
    _min?: RespostaPerguntaMinAggregateInputType
    _max?: RespostaPerguntaMaxAggregateInputType
  }

  export type RespostaPerguntaGroupByOutputType = {
    id: string
    respostaId: string
    pesquisaId: string
    perguntaId: string
    tipo: $Enums.TipoPergunta
    valorEstrelas: number | null
    valorNps: number | null
    valorSimNao: boolean | null
    valorTexto: string | null
    opcaoPerguntaId: string | null
    createdAt: Date
    updatedAt: Date
    _count: RespostaPerguntaCountAggregateOutputType | null
    _avg: RespostaPerguntaAvgAggregateOutputType | null
    _sum: RespostaPerguntaSumAggregateOutputType | null
    _min: RespostaPerguntaMinAggregateOutputType | null
    _max: RespostaPerguntaMaxAggregateOutputType | null
  }

  type GetRespostaPerguntaGroupByPayload<T extends RespostaPerguntaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RespostaPerguntaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RespostaPerguntaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RespostaPerguntaGroupByOutputType[P]>
            : GetScalarType<T[P], RespostaPerguntaGroupByOutputType[P]>
        }
      >
    >


  export type RespostaPerguntaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    respostaId?: boolean
    pesquisaId?: boolean
    perguntaId?: boolean
    tipo?: boolean
    valorEstrelas?: boolean
    valorNps?: boolean
    valorSimNao?: boolean
    valorTexto?: boolean
    opcaoPerguntaId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resposta?: boolean | RespostaDefaultArgs<ExtArgs>
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
    opcaoPergunta?: boolean | RespostaPergunta$opcaoPerguntaArgs<ExtArgs>
  }, ExtArgs["result"]["respostaPergunta"]>



  export type RespostaPerguntaSelectScalar = {
    id?: boolean
    respostaId?: boolean
    pesquisaId?: boolean
    perguntaId?: boolean
    tipo?: boolean
    valorEstrelas?: boolean
    valorNps?: boolean
    valorSimNao?: boolean
    valorTexto?: boolean
    opcaoPerguntaId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RespostaPerguntaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "respostaId" | "pesquisaId" | "perguntaId" | "tipo" | "valorEstrelas" | "valorNps" | "valorSimNao" | "valorTexto" | "opcaoPerguntaId" | "createdAt" | "updatedAt", ExtArgs["result"]["respostaPergunta"]>
  export type RespostaPerguntaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resposta?: boolean | RespostaDefaultArgs<ExtArgs>
    pergunta?: boolean | PerguntaDefaultArgs<ExtArgs>
    opcaoPergunta?: boolean | RespostaPergunta$opcaoPerguntaArgs<ExtArgs>
  }

  export type $RespostaPerguntaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RespostaPergunta"
    objects: {
      resposta: Prisma.$RespostaPayload<ExtArgs>
      pergunta: Prisma.$PerguntaPayload<ExtArgs>
      opcaoPergunta: Prisma.$OpcaoPerguntaPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      respostaId: string
      pesquisaId: string
      perguntaId: string
      tipo: $Enums.TipoPergunta
      valorEstrelas: number | null
      valorNps: number | null
      valorSimNao: boolean | null
      valorTexto: string | null
      opcaoPerguntaId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["respostaPergunta"]>
    composites: {}
  }

  type RespostaPerguntaGetPayload<S extends boolean | null | undefined | RespostaPerguntaDefaultArgs> = $Result.GetResult<Prisma.$RespostaPerguntaPayload, S>

  type RespostaPerguntaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RespostaPerguntaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RespostaPerguntaCountAggregateInputType | true
    }

  export interface RespostaPerguntaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RespostaPergunta'], meta: { name: 'RespostaPergunta' } }
    /**
     * Find zero or one RespostaPergunta that matches the filter.
     * @param {RespostaPerguntaFindUniqueArgs} args - Arguments to find a RespostaPergunta
     * @example
     * // Get one RespostaPergunta
     * const respostaPergunta = await prisma.respostaPergunta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RespostaPerguntaFindUniqueArgs>(args: SelectSubset<T, RespostaPerguntaFindUniqueArgs<ExtArgs>>): Prisma__RespostaPerguntaClient<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RespostaPergunta that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RespostaPerguntaFindUniqueOrThrowArgs} args - Arguments to find a RespostaPergunta
     * @example
     * // Get one RespostaPergunta
     * const respostaPergunta = await prisma.respostaPergunta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RespostaPerguntaFindUniqueOrThrowArgs>(args: SelectSubset<T, RespostaPerguntaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RespostaPerguntaClient<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RespostaPergunta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaPerguntaFindFirstArgs} args - Arguments to find a RespostaPergunta
     * @example
     * // Get one RespostaPergunta
     * const respostaPergunta = await prisma.respostaPergunta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RespostaPerguntaFindFirstArgs>(args?: SelectSubset<T, RespostaPerguntaFindFirstArgs<ExtArgs>>): Prisma__RespostaPerguntaClient<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RespostaPergunta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaPerguntaFindFirstOrThrowArgs} args - Arguments to find a RespostaPergunta
     * @example
     * // Get one RespostaPergunta
     * const respostaPergunta = await prisma.respostaPergunta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RespostaPerguntaFindFirstOrThrowArgs>(args?: SelectSubset<T, RespostaPerguntaFindFirstOrThrowArgs<ExtArgs>>): Prisma__RespostaPerguntaClient<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RespostaPerguntas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaPerguntaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RespostaPerguntas
     * const respostaPerguntas = await prisma.respostaPergunta.findMany()
     * 
     * // Get first 10 RespostaPerguntas
     * const respostaPerguntas = await prisma.respostaPergunta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const respostaPerguntaWithIdOnly = await prisma.respostaPergunta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RespostaPerguntaFindManyArgs>(args?: SelectSubset<T, RespostaPerguntaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RespostaPergunta.
     * @param {RespostaPerguntaCreateArgs} args - Arguments to create a RespostaPergunta.
     * @example
     * // Create one RespostaPergunta
     * const RespostaPergunta = await prisma.respostaPergunta.create({
     *   data: {
     *     // ... data to create a RespostaPergunta
     *   }
     * })
     * 
     */
    create<T extends RespostaPerguntaCreateArgs>(args: SelectSubset<T, RespostaPerguntaCreateArgs<ExtArgs>>): Prisma__RespostaPerguntaClient<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RespostaPerguntas.
     * @param {RespostaPerguntaCreateManyArgs} args - Arguments to create many RespostaPerguntas.
     * @example
     * // Create many RespostaPerguntas
     * const respostaPergunta = await prisma.respostaPergunta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RespostaPerguntaCreateManyArgs>(args?: SelectSubset<T, RespostaPerguntaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a RespostaPergunta.
     * @param {RespostaPerguntaDeleteArgs} args - Arguments to delete one RespostaPergunta.
     * @example
     * // Delete one RespostaPergunta
     * const RespostaPergunta = await prisma.respostaPergunta.delete({
     *   where: {
     *     // ... filter to delete one RespostaPergunta
     *   }
     * })
     * 
     */
    delete<T extends RespostaPerguntaDeleteArgs>(args: SelectSubset<T, RespostaPerguntaDeleteArgs<ExtArgs>>): Prisma__RespostaPerguntaClient<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RespostaPergunta.
     * @param {RespostaPerguntaUpdateArgs} args - Arguments to update one RespostaPergunta.
     * @example
     * // Update one RespostaPergunta
     * const respostaPergunta = await prisma.respostaPergunta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RespostaPerguntaUpdateArgs>(args: SelectSubset<T, RespostaPerguntaUpdateArgs<ExtArgs>>): Prisma__RespostaPerguntaClient<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RespostaPerguntas.
     * @param {RespostaPerguntaDeleteManyArgs} args - Arguments to filter RespostaPerguntas to delete.
     * @example
     * // Delete a few RespostaPerguntas
     * const { count } = await prisma.respostaPergunta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RespostaPerguntaDeleteManyArgs>(args?: SelectSubset<T, RespostaPerguntaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RespostaPerguntas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaPerguntaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RespostaPerguntas
     * const respostaPergunta = await prisma.respostaPergunta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RespostaPerguntaUpdateManyArgs>(args: SelectSubset<T, RespostaPerguntaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RespostaPergunta.
     * @param {RespostaPerguntaUpsertArgs} args - Arguments to update or create a RespostaPergunta.
     * @example
     * // Update or create a RespostaPergunta
     * const respostaPergunta = await prisma.respostaPergunta.upsert({
     *   create: {
     *     // ... data to create a RespostaPergunta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RespostaPergunta we want to update
     *   }
     * })
     */
    upsert<T extends RespostaPerguntaUpsertArgs>(args: SelectSubset<T, RespostaPerguntaUpsertArgs<ExtArgs>>): Prisma__RespostaPerguntaClient<$Result.GetResult<Prisma.$RespostaPerguntaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RespostaPerguntas that matches the filter.
     * @param {RespostaPerguntaFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const respostaPergunta = await prisma.respostaPergunta.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: RespostaPerguntaFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a RespostaPergunta.
     * @param {RespostaPerguntaAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const respostaPergunta = await prisma.respostaPergunta.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: RespostaPerguntaAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of RespostaPerguntas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaPerguntaCountArgs} args - Arguments to filter RespostaPerguntas to count.
     * @example
     * // Count the number of RespostaPerguntas
     * const count = await prisma.respostaPergunta.count({
     *   where: {
     *     // ... the filter for the RespostaPerguntas we want to count
     *   }
     * })
    **/
    count<T extends RespostaPerguntaCountArgs>(
      args?: Subset<T, RespostaPerguntaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RespostaPerguntaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RespostaPergunta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaPerguntaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RespostaPerguntaAggregateArgs>(args: Subset<T, RespostaPerguntaAggregateArgs>): Prisma.PrismaPromise<GetRespostaPerguntaAggregateType<T>>

    /**
     * Group by RespostaPergunta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RespostaPerguntaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RespostaPerguntaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RespostaPerguntaGroupByArgs['orderBy'] }
        : { orderBy?: RespostaPerguntaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RespostaPerguntaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRespostaPerguntaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RespostaPergunta model
   */
  readonly fields: RespostaPerguntaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RespostaPergunta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RespostaPerguntaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    resposta<T extends RespostaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RespostaDefaultArgs<ExtArgs>>): Prisma__RespostaClient<$Result.GetResult<Prisma.$RespostaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    pergunta<T extends PerguntaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PerguntaDefaultArgs<ExtArgs>>): Prisma__PerguntaClient<$Result.GetResult<Prisma.$PerguntaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    opcaoPergunta<T extends RespostaPergunta$opcaoPerguntaArgs<ExtArgs> = {}>(args?: Subset<T, RespostaPergunta$opcaoPerguntaArgs<ExtArgs>>): Prisma__OpcaoPerguntaClient<$Result.GetResult<Prisma.$OpcaoPerguntaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RespostaPergunta model
   */
  interface RespostaPerguntaFieldRefs {
    readonly id: FieldRef<"RespostaPergunta", 'String'>
    readonly respostaId: FieldRef<"RespostaPergunta", 'String'>
    readonly pesquisaId: FieldRef<"RespostaPergunta", 'String'>
    readonly perguntaId: FieldRef<"RespostaPergunta", 'String'>
    readonly tipo: FieldRef<"RespostaPergunta", 'TipoPergunta'>
    readonly valorEstrelas: FieldRef<"RespostaPergunta", 'Int'>
    readonly valorNps: FieldRef<"RespostaPergunta", 'Int'>
    readonly valorSimNao: FieldRef<"RespostaPergunta", 'Boolean'>
    readonly valorTexto: FieldRef<"RespostaPergunta", 'String'>
    readonly opcaoPerguntaId: FieldRef<"RespostaPergunta", 'String'>
    readonly createdAt: FieldRef<"RespostaPergunta", 'DateTime'>
    readonly updatedAt: FieldRef<"RespostaPergunta", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RespostaPergunta findUnique
   */
  export type RespostaPerguntaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which RespostaPergunta to fetch.
     */
    where: RespostaPerguntaWhereUniqueInput
  }

  /**
   * RespostaPergunta findUniqueOrThrow
   */
  export type RespostaPerguntaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which RespostaPergunta to fetch.
     */
    where: RespostaPerguntaWhereUniqueInput
  }

  /**
   * RespostaPergunta findFirst
   */
  export type RespostaPerguntaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which RespostaPergunta to fetch.
     */
    where?: RespostaPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RespostaPerguntas to fetch.
     */
    orderBy?: RespostaPerguntaOrderByWithRelationInput | RespostaPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RespostaPerguntas.
     */
    cursor?: RespostaPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RespostaPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RespostaPerguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RespostaPerguntas.
     */
    distinct?: RespostaPerguntaScalarFieldEnum | RespostaPerguntaScalarFieldEnum[]
  }

  /**
   * RespostaPergunta findFirstOrThrow
   */
  export type RespostaPerguntaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which RespostaPergunta to fetch.
     */
    where?: RespostaPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RespostaPerguntas to fetch.
     */
    orderBy?: RespostaPerguntaOrderByWithRelationInput | RespostaPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RespostaPerguntas.
     */
    cursor?: RespostaPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RespostaPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RespostaPerguntas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RespostaPerguntas.
     */
    distinct?: RespostaPerguntaScalarFieldEnum | RespostaPerguntaScalarFieldEnum[]
  }

  /**
   * RespostaPergunta findMany
   */
  export type RespostaPerguntaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    /**
     * Filter, which RespostaPerguntas to fetch.
     */
    where?: RespostaPerguntaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RespostaPerguntas to fetch.
     */
    orderBy?: RespostaPerguntaOrderByWithRelationInput | RespostaPerguntaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RespostaPerguntas.
     */
    cursor?: RespostaPerguntaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RespostaPerguntas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RespostaPerguntas.
     */
    skip?: number
    distinct?: RespostaPerguntaScalarFieldEnum | RespostaPerguntaScalarFieldEnum[]
  }

  /**
   * RespostaPergunta create
   */
  export type RespostaPerguntaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    /**
     * The data needed to create a RespostaPergunta.
     */
    data: XOR<RespostaPerguntaCreateInput, RespostaPerguntaUncheckedCreateInput>
  }

  /**
   * RespostaPergunta createMany
   */
  export type RespostaPerguntaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RespostaPerguntas.
     */
    data: RespostaPerguntaCreateManyInput | RespostaPerguntaCreateManyInput[]
  }

  /**
   * RespostaPergunta update
   */
  export type RespostaPerguntaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    /**
     * The data needed to update a RespostaPergunta.
     */
    data: XOR<RespostaPerguntaUpdateInput, RespostaPerguntaUncheckedUpdateInput>
    /**
     * Choose, which RespostaPergunta to update.
     */
    where: RespostaPerguntaWhereUniqueInput
  }

  /**
   * RespostaPergunta updateMany
   */
  export type RespostaPerguntaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RespostaPerguntas.
     */
    data: XOR<RespostaPerguntaUpdateManyMutationInput, RespostaPerguntaUncheckedUpdateManyInput>
    /**
     * Filter which RespostaPerguntas to update
     */
    where?: RespostaPerguntaWhereInput
    /**
     * Limit how many RespostaPerguntas to update.
     */
    limit?: number
  }

  /**
   * RespostaPergunta upsert
   */
  export type RespostaPerguntaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    /**
     * The filter to search for the RespostaPergunta to update in case it exists.
     */
    where: RespostaPerguntaWhereUniqueInput
    /**
     * In case the RespostaPergunta found by the `where` argument doesn't exist, create a new RespostaPergunta with this data.
     */
    create: XOR<RespostaPerguntaCreateInput, RespostaPerguntaUncheckedCreateInput>
    /**
     * In case the RespostaPergunta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RespostaPerguntaUpdateInput, RespostaPerguntaUncheckedUpdateInput>
  }

  /**
   * RespostaPergunta delete
   */
  export type RespostaPerguntaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
    /**
     * Filter which RespostaPergunta to delete.
     */
    where: RespostaPerguntaWhereUniqueInput
  }

  /**
   * RespostaPergunta deleteMany
   */
  export type RespostaPerguntaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RespostaPerguntas to delete
     */
    where?: RespostaPerguntaWhereInput
    /**
     * Limit how many RespostaPerguntas to delete.
     */
    limit?: number
  }

  /**
   * RespostaPergunta findRaw
   */
  export type RespostaPerguntaFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * RespostaPergunta aggregateRaw
   */
  export type RespostaPerguntaAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * RespostaPergunta.opcaoPergunta
   */
  export type RespostaPergunta$opcaoPerguntaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpcaoPergunta
     */
    select?: OpcaoPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpcaoPergunta
     */
    omit?: OpcaoPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpcaoPerguntaInclude<ExtArgs> | null
    where?: OpcaoPerguntaWhereInput
  }

  /**
   * RespostaPergunta without action
   */
  export type RespostaPerguntaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RespostaPergunta
     */
    select?: RespostaPerguntaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RespostaPergunta
     */
    omit?: RespostaPerguntaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RespostaPerguntaInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const EmpresaScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    email: 'email',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EmpresaScalarFieldEnum = (typeof EmpresaScalarFieldEnum)[keyof typeof EmpresaScalarFieldEnum]


  export const UsuarioScalarFieldEnum: {
    id: 'id',
    empresaId: 'empresaId',
    nome: 'nome',
    email: 'email',
    senhaHash: 'senhaHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const PesquisaScalarFieldEnum: {
    id: 'id',
    empresaId: 'empresaId',
    titulo: 'titulo',
    descricao: 'descricao',
    status: 'status',
    slug: 'slug',
    writeVersion: 'writeVersion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PesquisaScalarFieldEnum = (typeof PesquisaScalarFieldEnum)[keyof typeof PesquisaScalarFieldEnum]


  export const PerguntaScalarFieldEnum: {
    id: 'id',
    pesquisaId: 'pesquisaId',
    texto: 'texto',
    tipo: 'tipo',
    obrigatoria: 'obrigatoria',
    ordem: 'ordem',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PerguntaScalarFieldEnum = (typeof PerguntaScalarFieldEnum)[keyof typeof PerguntaScalarFieldEnum]


  export const OpcaoPerguntaScalarFieldEnum: {
    id: 'id',
    perguntaId: 'perguntaId',
    texto: 'texto',
    ordem: 'ordem',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OpcaoPerguntaScalarFieldEnum = (typeof OpcaoPerguntaScalarFieldEnum)[keyof typeof OpcaoPerguntaScalarFieldEnum]


  export const PontoColetaScalarFieldEnum: {
    id: 'id',
    token: 'token',
    pesquisaId: 'pesquisaId',
    nome: 'nome',
    ativo: 'ativo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PontoColetaScalarFieldEnum = (typeof PontoColetaScalarFieldEnum)[keyof typeof PontoColetaScalarFieldEnum]


  export const RespostaScalarFieldEnum: {
    id: 'id',
    pesquisaId: 'pesquisaId',
    pontoColetaId: 'pontoColetaId',
    idempotencyKey: 'idempotencyKey',
    submissionHash: 'submissionHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RespostaScalarFieldEnum = (typeof RespostaScalarFieldEnum)[keyof typeof RespostaScalarFieldEnum]


  export const RespostaPerguntaScalarFieldEnum: {
    id: 'id',
    respostaId: 'respostaId',
    pesquisaId: 'pesquisaId',
    perguntaId: 'perguntaId',
    tipo: 'tipo',
    valorEstrelas: 'valorEstrelas',
    valorNps: 'valorNps',
    valorSimNao: 'valorSimNao',
    valorTexto: 'valorTexto',
    opcaoPerguntaId: 'opcaoPerguntaId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RespostaPerguntaScalarFieldEnum = (typeof RespostaPerguntaScalarFieldEnum)[keyof typeof RespostaPerguntaScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'StatusPesquisa'
   */
  export type EnumStatusPesquisaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusPesquisa'>
    


  /**
   * Reference to a field of type 'StatusPesquisa[]'
   */
  export type ListEnumStatusPesquisaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusPesquisa[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'TipoPergunta'
   */
  export type EnumTipoPerguntaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoPergunta'>
    


  /**
   * Reference to a field of type 'TipoPergunta[]'
   */
  export type ListEnumTipoPerguntaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoPergunta[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type EmpresaWhereInput = {
    AND?: EmpresaWhereInput | EmpresaWhereInput[]
    OR?: EmpresaWhereInput[]
    NOT?: EmpresaWhereInput | EmpresaWhereInput[]
    id?: StringFilter<"Empresa"> | string
    nome?: StringFilter<"Empresa"> | string
    email?: StringFilter<"Empresa"> | string
    createdAt?: DateTimeFilter<"Empresa"> | Date | string
    updatedAt?: DateTimeFilter<"Empresa"> | Date | string
    usuarios?: UsuarioListRelationFilter
    pesquisas?: PesquisaListRelationFilter
  }

  export type EmpresaOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    usuarios?: UsuarioOrderByRelationAggregateInput
    pesquisas?: PesquisaOrderByRelationAggregateInput
  }

  export type EmpresaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: EmpresaWhereInput | EmpresaWhereInput[]
    OR?: EmpresaWhereInput[]
    NOT?: EmpresaWhereInput | EmpresaWhereInput[]
    nome?: StringFilter<"Empresa"> | string
    createdAt?: DateTimeFilter<"Empresa"> | Date | string
    updatedAt?: DateTimeFilter<"Empresa"> | Date | string
    usuarios?: UsuarioListRelationFilter
    pesquisas?: PesquisaListRelationFilter
  }, "id" | "email">

  export type EmpresaOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EmpresaCountOrderByAggregateInput
    _max?: EmpresaMaxOrderByAggregateInput
    _min?: EmpresaMinOrderByAggregateInput
  }

  export type EmpresaScalarWhereWithAggregatesInput = {
    AND?: EmpresaScalarWhereWithAggregatesInput | EmpresaScalarWhereWithAggregatesInput[]
    OR?: EmpresaScalarWhereWithAggregatesInput[]
    NOT?: EmpresaScalarWhereWithAggregatesInput | EmpresaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Empresa"> | string
    nome?: StringWithAggregatesFilter<"Empresa"> | string
    email?: StringWithAggregatesFilter<"Empresa"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Empresa"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Empresa"> | Date | string
  }

  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    id?: StringFilter<"Usuario"> | string
    empresaId?: StringFilter<"Usuario"> | string
    nome?: StringFilter<"Usuario"> | string
    email?: StringFilter<"Usuario"> | string
    senhaHash?: StringFilter<"Usuario"> | string
    createdAt?: DateTimeFilter<"Usuario"> | Date | string
    updatedAt?: DateTimeFilter<"Usuario"> | Date | string
    empresa?: XOR<EmpresaScalarRelationFilter, EmpresaWhereInput>
  }

  export type UsuarioOrderByWithRelationInput = {
    id?: SortOrder
    empresaId?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhaHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    empresa?: EmpresaOrderByWithRelationInput
  }

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    empresaId?: StringFilter<"Usuario"> | string
    nome?: StringFilter<"Usuario"> | string
    senhaHash?: StringFilter<"Usuario"> | string
    createdAt?: DateTimeFilter<"Usuario"> | Date | string
    updatedAt?: DateTimeFilter<"Usuario"> | Date | string
    empresa?: XOR<EmpresaScalarRelationFilter, EmpresaWhereInput>
  }, "id" | "email">

  export type UsuarioOrderByWithAggregationInput = {
    id?: SortOrder
    empresaId?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhaHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UsuarioCountOrderByAggregateInput
    _max?: UsuarioMaxOrderByAggregateInput
    _min?: UsuarioMinOrderByAggregateInput
  }

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    OR?: UsuarioScalarWhereWithAggregatesInput[]
    NOT?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Usuario"> | string
    empresaId?: StringWithAggregatesFilter<"Usuario"> | string
    nome?: StringWithAggregatesFilter<"Usuario"> | string
    email?: StringWithAggregatesFilter<"Usuario"> | string
    senhaHash?: StringWithAggregatesFilter<"Usuario"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
  }

  export type PesquisaWhereInput = {
    AND?: PesquisaWhereInput | PesquisaWhereInput[]
    OR?: PesquisaWhereInput[]
    NOT?: PesquisaWhereInput | PesquisaWhereInput[]
    id?: StringFilter<"Pesquisa"> | string
    empresaId?: StringFilter<"Pesquisa"> | string
    titulo?: StringFilter<"Pesquisa"> | string
    descricao?: StringNullableFilter<"Pesquisa"> | string | null
    status?: EnumStatusPesquisaFilter<"Pesquisa"> | $Enums.StatusPesquisa
    slug?: StringFilter<"Pesquisa"> | string
    writeVersion?: IntFilter<"Pesquisa"> | number
    createdAt?: DateTimeFilter<"Pesquisa"> | Date | string
    updatedAt?: DateTimeFilter<"Pesquisa"> | Date | string
    empresa?: XOR<EmpresaScalarRelationFilter, EmpresaWhereInput>
    perguntas?: PerguntaListRelationFilter
    pontosColeta?: PontoColetaListRelationFilter
    respostas?: RespostaListRelationFilter
  }

  export type PesquisaOrderByWithRelationInput = {
    id?: SortOrder
    empresaId?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    status?: SortOrder
    slug?: SortOrder
    writeVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    empresa?: EmpresaOrderByWithRelationInput
    perguntas?: PerguntaOrderByRelationAggregateInput
    pontosColeta?: PontoColetaOrderByRelationAggregateInput
    respostas?: RespostaOrderByRelationAggregateInput
  }

  export type PesquisaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: PesquisaWhereInput | PesquisaWhereInput[]
    OR?: PesquisaWhereInput[]
    NOT?: PesquisaWhereInput | PesquisaWhereInput[]
    empresaId?: StringFilter<"Pesquisa"> | string
    titulo?: StringFilter<"Pesquisa"> | string
    descricao?: StringNullableFilter<"Pesquisa"> | string | null
    status?: EnumStatusPesquisaFilter<"Pesquisa"> | $Enums.StatusPesquisa
    writeVersion?: IntFilter<"Pesquisa"> | number
    createdAt?: DateTimeFilter<"Pesquisa"> | Date | string
    updatedAt?: DateTimeFilter<"Pesquisa"> | Date | string
    empresa?: XOR<EmpresaScalarRelationFilter, EmpresaWhereInput>
    perguntas?: PerguntaListRelationFilter
    pontosColeta?: PontoColetaListRelationFilter
    respostas?: RespostaListRelationFilter
  }, "id" | "slug">

  export type PesquisaOrderByWithAggregationInput = {
    id?: SortOrder
    empresaId?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    status?: SortOrder
    slug?: SortOrder
    writeVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PesquisaCountOrderByAggregateInput
    _avg?: PesquisaAvgOrderByAggregateInput
    _max?: PesquisaMaxOrderByAggregateInput
    _min?: PesquisaMinOrderByAggregateInput
    _sum?: PesquisaSumOrderByAggregateInput
  }

  export type PesquisaScalarWhereWithAggregatesInput = {
    AND?: PesquisaScalarWhereWithAggregatesInput | PesquisaScalarWhereWithAggregatesInput[]
    OR?: PesquisaScalarWhereWithAggregatesInput[]
    NOT?: PesquisaScalarWhereWithAggregatesInput | PesquisaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pesquisa"> | string
    empresaId?: StringWithAggregatesFilter<"Pesquisa"> | string
    titulo?: StringWithAggregatesFilter<"Pesquisa"> | string
    descricao?: StringNullableWithAggregatesFilter<"Pesquisa"> | string | null
    status?: EnumStatusPesquisaWithAggregatesFilter<"Pesquisa"> | $Enums.StatusPesquisa
    slug?: StringWithAggregatesFilter<"Pesquisa"> | string
    writeVersion?: IntWithAggregatesFilter<"Pesquisa"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Pesquisa"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Pesquisa"> | Date | string
  }

  export type PerguntaWhereInput = {
    AND?: PerguntaWhereInput | PerguntaWhereInput[]
    OR?: PerguntaWhereInput[]
    NOT?: PerguntaWhereInput | PerguntaWhereInput[]
    id?: StringFilter<"Pergunta"> | string
    pesquisaId?: StringFilter<"Pergunta"> | string
    texto?: StringFilter<"Pergunta"> | string
    tipo?: EnumTipoPerguntaFilter<"Pergunta"> | $Enums.TipoPergunta
    obrigatoria?: BoolFilter<"Pergunta"> | boolean
    ordem?: IntFilter<"Pergunta"> | number
    createdAt?: DateTimeFilter<"Pergunta"> | Date | string
    updatedAt?: DateTimeFilter<"Pergunta"> | Date | string
    pesquisa?: XOR<PesquisaScalarRelationFilter, PesquisaWhereInput>
    opcoes?: OpcaoPerguntaListRelationFilter
    respostas?: RespostaPerguntaListRelationFilter
  }

  export type PerguntaOrderByWithRelationInput = {
    id?: SortOrder
    pesquisaId?: SortOrder
    texto?: SortOrder
    tipo?: SortOrder
    obrigatoria?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pesquisa?: PesquisaOrderByWithRelationInput
    opcoes?: OpcaoPerguntaOrderByRelationAggregateInput
    respostas?: RespostaPerguntaOrderByRelationAggregateInput
  }

  export type PerguntaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    pesquisaId_ordem?: PerguntaPesquisaIdOrdemCompoundUniqueInput
    id_pesquisaId_tipo?: PerguntaIdPesquisaIdTipoCompoundUniqueInput
    AND?: PerguntaWhereInput | PerguntaWhereInput[]
    OR?: PerguntaWhereInput[]
    NOT?: PerguntaWhereInput | PerguntaWhereInput[]
    pesquisaId?: StringFilter<"Pergunta"> | string
    texto?: StringFilter<"Pergunta"> | string
    tipo?: EnumTipoPerguntaFilter<"Pergunta"> | $Enums.TipoPergunta
    obrigatoria?: BoolFilter<"Pergunta"> | boolean
    ordem?: IntFilter<"Pergunta"> | number
    createdAt?: DateTimeFilter<"Pergunta"> | Date | string
    updatedAt?: DateTimeFilter<"Pergunta"> | Date | string
    pesquisa?: XOR<PesquisaScalarRelationFilter, PesquisaWhereInput>
    opcoes?: OpcaoPerguntaListRelationFilter
    respostas?: RespostaPerguntaListRelationFilter
  }, "id" | "pesquisaId_ordem" | "id_pesquisaId_tipo">

  export type PerguntaOrderByWithAggregationInput = {
    id?: SortOrder
    pesquisaId?: SortOrder
    texto?: SortOrder
    tipo?: SortOrder
    obrigatoria?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PerguntaCountOrderByAggregateInput
    _avg?: PerguntaAvgOrderByAggregateInput
    _max?: PerguntaMaxOrderByAggregateInput
    _min?: PerguntaMinOrderByAggregateInput
    _sum?: PerguntaSumOrderByAggregateInput
  }

  export type PerguntaScalarWhereWithAggregatesInput = {
    AND?: PerguntaScalarWhereWithAggregatesInput | PerguntaScalarWhereWithAggregatesInput[]
    OR?: PerguntaScalarWhereWithAggregatesInput[]
    NOT?: PerguntaScalarWhereWithAggregatesInput | PerguntaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pergunta"> | string
    pesquisaId?: StringWithAggregatesFilter<"Pergunta"> | string
    texto?: StringWithAggregatesFilter<"Pergunta"> | string
    tipo?: EnumTipoPerguntaWithAggregatesFilter<"Pergunta"> | $Enums.TipoPergunta
    obrigatoria?: BoolWithAggregatesFilter<"Pergunta"> | boolean
    ordem?: IntWithAggregatesFilter<"Pergunta"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Pergunta"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Pergunta"> | Date | string
  }

  export type OpcaoPerguntaWhereInput = {
    AND?: OpcaoPerguntaWhereInput | OpcaoPerguntaWhereInput[]
    OR?: OpcaoPerguntaWhereInput[]
    NOT?: OpcaoPerguntaWhereInput | OpcaoPerguntaWhereInput[]
    id?: StringFilter<"OpcaoPergunta"> | string
    perguntaId?: StringFilter<"OpcaoPergunta"> | string
    texto?: StringFilter<"OpcaoPergunta"> | string
    ordem?: IntFilter<"OpcaoPergunta"> | number
    createdAt?: DateTimeFilter<"OpcaoPergunta"> | Date | string
    updatedAt?: DateTimeFilter<"OpcaoPergunta"> | Date | string
    pergunta?: XOR<PerguntaScalarRelationFilter, PerguntaWhereInput>
    respostas?: RespostaPerguntaListRelationFilter
  }

  export type OpcaoPerguntaOrderByWithRelationInput = {
    id?: SortOrder
    perguntaId?: SortOrder
    texto?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pergunta?: PerguntaOrderByWithRelationInput
    respostas?: RespostaPerguntaOrderByRelationAggregateInput
  }

  export type OpcaoPerguntaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    perguntaId_ordem?: OpcaoPerguntaPerguntaIdOrdemCompoundUniqueInput
    id_perguntaId?: OpcaoPerguntaIdPerguntaIdCompoundUniqueInput
    AND?: OpcaoPerguntaWhereInput | OpcaoPerguntaWhereInput[]
    OR?: OpcaoPerguntaWhereInput[]
    NOT?: OpcaoPerguntaWhereInput | OpcaoPerguntaWhereInput[]
    perguntaId?: StringFilter<"OpcaoPergunta"> | string
    texto?: StringFilter<"OpcaoPergunta"> | string
    ordem?: IntFilter<"OpcaoPergunta"> | number
    createdAt?: DateTimeFilter<"OpcaoPergunta"> | Date | string
    updatedAt?: DateTimeFilter<"OpcaoPergunta"> | Date | string
    pergunta?: XOR<PerguntaScalarRelationFilter, PerguntaWhereInput>
    respostas?: RespostaPerguntaListRelationFilter
  }, "id" | "perguntaId_ordem" | "id_perguntaId">

  export type OpcaoPerguntaOrderByWithAggregationInput = {
    id?: SortOrder
    perguntaId?: SortOrder
    texto?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OpcaoPerguntaCountOrderByAggregateInput
    _avg?: OpcaoPerguntaAvgOrderByAggregateInput
    _max?: OpcaoPerguntaMaxOrderByAggregateInput
    _min?: OpcaoPerguntaMinOrderByAggregateInput
    _sum?: OpcaoPerguntaSumOrderByAggregateInput
  }

  export type OpcaoPerguntaScalarWhereWithAggregatesInput = {
    AND?: OpcaoPerguntaScalarWhereWithAggregatesInput | OpcaoPerguntaScalarWhereWithAggregatesInput[]
    OR?: OpcaoPerguntaScalarWhereWithAggregatesInput[]
    NOT?: OpcaoPerguntaScalarWhereWithAggregatesInput | OpcaoPerguntaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OpcaoPergunta"> | string
    perguntaId?: StringWithAggregatesFilter<"OpcaoPergunta"> | string
    texto?: StringWithAggregatesFilter<"OpcaoPergunta"> | string
    ordem?: IntWithAggregatesFilter<"OpcaoPergunta"> | number
    createdAt?: DateTimeWithAggregatesFilter<"OpcaoPergunta"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OpcaoPergunta"> | Date | string
  }

  export type PontoColetaWhereInput = {
    AND?: PontoColetaWhereInput | PontoColetaWhereInput[]
    OR?: PontoColetaWhereInput[]
    NOT?: PontoColetaWhereInput | PontoColetaWhereInput[]
    id?: StringFilter<"PontoColeta"> | string
    token?: StringFilter<"PontoColeta"> | string
    pesquisaId?: StringFilter<"PontoColeta"> | string
    nome?: StringFilter<"PontoColeta"> | string
    ativo?: BoolFilter<"PontoColeta"> | boolean
    createdAt?: DateTimeFilter<"PontoColeta"> | Date | string
    updatedAt?: DateTimeFilter<"PontoColeta"> | Date | string
    pesquisa?: XOR<PesquisaScalarRelationFilter, PesquisaWhereInput>
    respostas?: RespostaListRelationFilter
  }

  export type PontoColetaOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    pesquisaId?: SortOrder
    nome?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pesquisa?: PesquisaOrderByWithRelationInput
    respostas?: RespostaOrderByRelationAggregateInput
  }

  export type PontoColetaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    id_pesquisaId?: PontoColetaIdPesquisaIdCompoundUniqueInput
    AND?: PontoColetaWhereInput | PontoColetaWhereInput[]
    OR?: PontoColetaWhereInput[]
    NOT?: PontoColetaWhereInput | PontoColetaWhereInput[]
    pesquisaId?: StringFilter<"PontoColeta"> | string
    nome?: StringFilter<"PontoColeta"> | string
    ativo?: BoolFilter<"PontoColeta"> | boolean
    createdAt?: DateTimeFilter<"PontoColeta"> | Date | string
    updatedAt?: DateTimeFilter<"PontoColeta"> | Date | string
    pesquisa?: XOR<PesquisaScalarRelationFilter, PesquisaWhereInput>
    respostas?: RespostaListRelationFilter
  }, "id" | "token" | "id_pesquisaId">

  export type PontoColetaOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    pesquisaId?: SortOrder
    nome?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PontoColetaCountOrderByAggregateInput
    _max?: PontoColetaMaxOrderByAggregateInput
    _min?: PontoColetaMinOrderByAggregateInput
  }

  export type PontoColetaScalarWhereWithAggregatesInput = {
    AND?: PontoColetaScalarWhereWithAggregatesInput | PontoColetaScalarWhereWithAggregatesInput[]
    OR?: PontoColetaScalarWhereWithAggregatesInput[]
    NOT?: PontoColetaScalarWhereWithAggregatesInput | PontoColetaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PontoColeta"> | string
    token?: StringWithAggregatesFilter<"PontoColeta"> | string
    pesquisaId?: StringWithAggregatesFilter<"PontoColeta"> | string
    nome?: StringWithAggregatesFilter<"PontoColeta"> | string
    ativo?: BoolWithAggregatesFilter<"PontoColeta"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"PontoColeta"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PontoColeta"> | Date | string
  }

  export type RespostaWhereInput = {
    AND?: RespostaWhereInput | RespostaWhereInput[]
    OR?: RespostaWhereInput[]
    NOT?: RespostaWhereInput | RespostaWhereInput[]
    id?: StringFilter<"Resposta"> | string
    pesquisaId?: StringFilter<"Resposta"> | string
    pontoColetaId?: StringNullableFilter<"Resposta"> | string | null
    idempotencyKey?: StringNullableFilter<"Resposta"> | string | null
    submissionHash?: StringNullableFilter<"Resposta"> | string | null
    createdAt?: DateTimeFilter<"Resposta"> | Date | string
    updatedAt?: DateTimeFilter<"Resposta"> | Date | string
    pesquisa?: XOR<PesquisaScalarRelationFilter, PesquisaWhereInput>
    pontoColeta?: XOR<PontoColetaNullableScalarRelationFilter, PontoColetaWhereInput> | null
    perguntas?: RespostaPerguntaListRelationFilter
  }

  export type RespostaOrderByWithRelationInput = {
    id?: SortOrder
    pesquisaId?: SortOrder
    pontoColetaId?: SortOrder
    idempotencyKey?: SortOrder
    submissionHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    pesquisa?: PesquisaOrderByWithRelationInput
    pontoColeta?: PontoColetaOrderByWithRelationInput
    perguntas?: RespostaPerguntaOrderByRelationAggregateInput
  }

  export type RespostaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    id_pesquisaId?: RespostaIdPesquisaIdCompoundUniqueInput
    AND?: RespostaWhereInput | RespostaWhereInput[]
    OR?: RespostaWhereInput[]
    NOT?: RespostaWhereInput | RespostaWhereInput[]
    pesquisaId?: StringFilter<"Resposta"> | string
    pontoColetaId?: StringNullableFilter<"Resposta"> | string | null
    idempotencyKey?: StringNullableFilter<"Resposta"> | string | null
    submissionHash?: StringNullableFilter<"Resposta"> | string | null
    createdAt?: DateTimeFilter<"Resposta"> | Date | string
    updatedAt?: DateTimeFilter<"Resposta"> | Date | string
    pesquisa?: XOR<PesquisaScalarRelationFilter, PesquisaWhereInput>
    pontoColeta?: XOR<PontoColetaNullableScalarRelationFilter, PontoColetaWhereInput> | null
    perguntas?: RespostaPerguntaListRelationFilter
  }, "id" | "id_pesquisaId">

  export type RespostaOrderByWithAggregationInput = {
    id?: SortOrder
    pesquisaId?: SortOrder
    pontoColetaId?: SortOrder
    idempotencyKey?: SortOrder
    submissionHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RespostaCountOrderByAggregateInput
    _max?: RespostaMaxOrderByAggregateInput
    _min?: RespostaMinOrderByAggregateInput
  }

  export type RespostaScalarWhereWithAggregatesInput = {
    AND?: RespostaScalarWhereWithAggregatesInput | RespostaScalarWhereWithAggregatesInput[]
    OR?: RespostaScalarWhereWithAggregatesInput[]
    NOT?: RespostaScalarWhereWithAggregatesInput | RespostaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Resposta"> | string
    pesquisaId?: StringWithAggregatesFilter<"Resposta"> | string
    pontoColetaId?: StringNullableWithAggregatesFilter<"Resposta"> | string | null
    idempotencyKey?: StringNullableWithAggregatesFilter<"Resposta"> | string | null
    submissionHash?: StringNullableWithAggregatesFilter<"Resposta"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Resposta"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Resposta"> | Date | string
  }

  export type RespostaPerguntaWhereInput = {
    AND?: RespostaPerguntaWhereInput | RespostaPerguntaWhereInput[]
    OR?: RespostaPerguntaWhereInput[]
    NOT?: RespostaPerguntaWhereInput | RespostaPerguntaWhereInput[]
    id?: StringFilter<"RespostaPergunta"> | string
    respostaId?: StringFilter<"RespostaPergunta"> | string
    pesquisaId?: StringFilter<"RespostaPergunta"> | string
    perguntaId?: StringFilter<"RespostaPergunta"> | string
    tipo?: EnumTipoPerguntaFilter<"RespostaPergunta"> | $Enums.TipoPergunta
    valorEstrelas?: IntNullableFilter<"RespostaPergunta"> | number | null
    valorNps?: IntNullableFilter<"RespostaPergunta"> | number | null
    valorSimNao?: BoolNullableFilter<"RespostaPergunta"> | boolean | null
    valorTexto?: StringNullableFilter<"RespostaPergunta"> | string | null
    opcaoPerguntaId?: StringNullableFilter<"RespostaPergunta"> | string | null
    createdAt?: DateTimeFilter<"RespostaPergunta"> | Date | string
    updatedAt?: DateTimeFilter<"RespostaPergunta"> | Date | string
    resposta?: XOR<RespostaScalarRelationFilter, RespostaWhereInput>
    pergunta?: XOR<PerguntaScalarRelationFilter, PerguntaWhereInput>
    opcaoPergunta?: XOR<OpcaoPerguntaNullableScalarRelationFilter, OpcaoPerguntaWhereInput> | null
  }

  export type RespostaPerguntaOrderByWithRelationInput = {
    id?: SortOrder
    respostaId?: SortOrder
    pesquisaId?: SortOrder
    perguntaId?: SortOrder
    tipo?: SortOrder
    valorEstrelas?: SortOrder
    valorNps?: SortOrder
    valorSimNao?: SortOrder
    valorTexto?: SortOrder
    opcaoPerguntaId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resposta?: RespostaOrderByWithRelationInput
    pergunta?: PerguntaOrderByWithRelationInput
    opcaoPergunta?: OpcaoPerguntaOrderByWithRelationInput
  }

  export type RespostaPerguntaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    respostaId_perguntaId?: RespostaPerguntaRespostaIdPerguntaIdCompoundUniqueInput
    AND?: RespostaPerguntaWhereInput | RespostaPerguntaWhereInput[]
    OR?: RespostaPerguntaWhereInput[]
    NOT?: RespostaPerguntaWhereInput | RespostaPerguntaWhereInput[]
    respostaId?: StringFilter<"RespostaPergunta"> | string
    pesquisaId?: StringFilter<"RespostaPergunta"> | string
    perguntaId?: StringFilter<"RespostaPergunta"> | string
    tipo?: EnumTipoPerguntaFilter<"RespostaPergunta"> | $Enums.TipoPergunta
    valorEstrelas?: IntNullableFilter<"RespostaPergunta"> | number | null
    valorNps?: IntNullableFilter<"RespostaPergunta"> | number | null
    valorSimNao?: BoolNullableFilter<"RespostaPergunta"> | boolean | null
    valorTexto?: StringNullableFilter<"RespostaPergunta"> | string | null
    opcaoPerguntaId?: StringNullableFilter<"RespostaPergunta"> | string | null
    createdAt?: DateTimeFilter<"RespostaPergunta"> | Date | string
    updatedAt?: DateTimeFilter<"RespostaPergunta"> | Date | string
    resposta?: XOR<RespostaScalarRelationFilter, RespostaWhereInput>
    pergunta?: XOR<PerguntaScalarRelationFilter, PerguntaWhereInput>
    opcaoPergunta?: XOR<OpcaoPerguntaNullableScalarRelationFilter, OpcaoPerguntaWhereInput> | null
  }, "id" | "respostaId_perguntaId">

  export type RespostaPerguntaOrderByWithAggregationInput = {
    id?: SortOrder
    respostaId?: SortOrder
    pesquisaId?: SortOrder
    perguntaId?: SortOrder
    tipo?: SortOrder
    valorEstrelas?: SortOrder
    valorNps?: SortOrder
    valorSimNao?: SortOrder
    valorTexto?: SortOrder
    opcaoPerguntaId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RespostaPerguntaCountOrderByAggregateInput
    _avg?: RespostaPerguntaAvgOrderByAggregateInput
    _max?: RespostaPerguntaMaxOrderByAggregateInput
    _min?: RespostaPerguntaMinOrderByAggregateInput
    _sum?: RespostaPerguntaSumOrderByAggregateInput
  }

  export type RespostaPerguntaScalarWhereWithAggregatesInput = {
    AND?: RespostaPerguntaScalarWhereWithAggregatesInput | RespostaPerguntaScalarWhereWithAggregatesInput[]
    OR?: RespostaPerguntaScalarWhereWithAggregatesInput[]
    NOT?: RespostaPerguntaScalarWhereWithAggregatesInput | RespostaPerguntaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RespostaPergunta"> | string
    respostaId?: StringWithAggregatesFilter<"RespostaPergunta"> | string
    pesquisaId?: StringWithAggregatesFilter<"RespostaPergunta"> | string
    perguntaId?: StringWithAggregatesFilter<"RespostaPergunta"> | string
    tipo?: EnumTipoPerguntaWithAggregatesFilter<"RespostaPergunta"> | $Enums.TipoPergunta
    valorEstrelas?: IntNullableWithAggregatesFilter<"RespostaPergunta"> | number | null
    valorNps?: IntNullableWithAggregatesFilter<"RespostaPergunta"> | number | null
    valorSimNao?: BoolNullableWithAggregatesFilter<"RespostaPergunta"> | boolean | null
    valorTexto?: StringNullableWithAggregatesFilter<"RespostaPergunta"> | string | null
    opcaoPerguntaId?: StringNullableWithAggregatesFilter<"RespostaPergunta"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RespostaPergunta"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RespostaPergunta"> | Date | string
  }

  export type EmpresaCreateInput = {
    id?: string
    nome: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UsuarioCreateNestedManyWithoutEmpresaInput
    pesquisas?: PesquisaCreateNestedManyWithoutEmpresaInput
  }

  export type EmpresaUncheckedCreateInput = {
    id?: string
    nome: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UsuarioUncheckedCreateNestedManyWithoutEmpresaInput
    pesquisas?: PesquisaUncheckedCreateNestedManyWithoutEmpresaInput
  }

  export type EmpresaUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioUpdateManyWithoutEmpresaNestedInput
    pesquisas?: PesquisaUpdateManyWithoutEmpresaNestedInput
  }

  export type EmpresaUncheckedUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioUncheckedUpdateManyWithoutEmpresaNestedInput
    pesquisas?: PesquisaUncheckedUpdateManyWithoutEmpresaNestedInput
  }

  export type EmpresaCreateManyInput = {
    id?: string
    nome: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EmpresaUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmpresaUncheckedUpdateManyInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioCreateInput = {
    id?: string
    nome: string
    email: string
    senhaHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
    empresa: EmpresaCreateNestedOneWithoutUsuariosInput
  }

  export type UsuarioUncheckedCreateInput = {
    id?: string
    empresaId: string
    nome: string
    email: string
    senhaHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsuarioUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    empresa?: EmpresaUpdateOneRequiredWithoutUsuariosNestedInput
  }

  export type UsuarioUncheckedUpdateInput = {
    empresaId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioCreateManyInput = {
    id?: string
    empresaId: string
    nome: string
    email: string
    senhaHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsuarioUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateManyInput = {
    empresaId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PesquisaCreateInput = {
    id?: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    empresa: EmpresaCreateNestedOneWithoutPesquisasInput
    perguntas?: PerguntaCreateNestedManyWithoutPesquisaInput
    pontosColeta?: PontoColetaCreateNestedManyWithoutPesquisaInput
    respostas?: RespostaCreateNestedManyWithoutPesquisaInput
  }

  export type PesquisaUncheckedCreateInput = {
    id?: string
    empresaId: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntas?: PerguntaUncheckedCreateNestedManyWithoutPesquisaInput
    pontosColeta?: PontoColetaUncheckedCreateNestedManyWithoutPesquisaInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutPesquisaInput
  }

  export type PesquisaUpdateInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    empresa?: EmpresaUpdateOneRequiredWithoutPesquisasNestedInput
    perguntas?: PerguntaUpdateManyWithoutPesquisaNestedInput
    pontosColeta?: PontoColetaUpdateManyWithoutPesquisaNestedInput
    respostas?: RespostaUpdateManyWithoutPesquisaNestedInput
  }

  export type PesquisaUncheckedUpdateInput = {
    empresaId?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntas?: PerguntaUncheckedUpdateManyWithoutPesquisaNestedInput
    pontosColeta?: PontoColetaUncheckedUpdateManyWithoutPesquisaNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutPesquisaNestedInput
  }

  export type PesquisaCreateManyInput = {
    id?: string
    empresaId: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PesquisaUpdateManyMutationInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PesquisaUncheckedUpdateManyInput = {
    empresaId?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerguntaCreateInput = {
    id?: string
    texto: string
    tipo: $Enums.TipoPergunta
    obrigatoria?: boolean
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pesquisa: PesquisaCreateNestedOneWithoutPerguntasInput
    opcoes?: OpcaoPerguntaCreateNestedManyWithoutPerguntaInput
    respostas?: RespostaPerguntaCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaUncheckedCreateInput = {
    id?: string
    pesquisaId: string
    texto: string
    tipo: $Enums.TipoPergunta
    obrigatoria?: boolean
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    opcoes?: OpcaoPerguntaUncheckedCreateNestedManyWithoutPerguntaInput
    respostas?: RespostaPerguntaUncheckedCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaUpdateInput = {
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pesquisa?: PesquisaUpdateOneRequiredWithoutPerguntasNestedInput
    opcoes?: OpcaoPerguntaUpdateManyWithoutPerguntaNestedInput
    respostas?: RespostaPerguntaUpdateManyWithoutPerguntaNestedInput
  }

  export type PerguntaUncheckedUpdateInput = {
    pesquisaId?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    opcoes?: OpcaoPerguntaUncheckedUpdateManyWithoutPerguntaNestedInput
    respostas?: RespostaPerguntaUncheckedUpdateManyWithoutPerguntaNestedInput
  }

  export type PerguntaCreateManyInput = {
    id?: string
    pesquisaId: string
    texto: string
    tipo: $Enums.TipoPergunta
    obrigatoria?: boolean
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PerguntaUpdateManyMutationInput = {
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerguntaUncheckedUpdateManyInput = {
    pesquisaId?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpcaoPerguntaCreateInput = {
    id?: string
    texto: string
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pergunta: PerguntaCreateNestedOneWithoutOpcoesInput
    respostas?: RespostaPerguntaCreateNestedManyWithoutOpcaoPerguntaInput
  }

  export type OpcaoPerguntaUncheckedCreateInput = {
    id?: string
    perguntaId: string
    texto: string
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaPerguntaUncheckedCreateNestedManyWithoutOpcaoPerguntaInput
  }

  export type OpcaoPerguntaUpdateInput = {
    texto?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pergunta?: PerguntaUpdateOneRequiredWithoutOpcoesNestedInput
    respostas?: RespostaPerguntaUpdateManyWithoutOpcaoPerguntaNestedInput
  }

  export type OpcaoPerguntaUncheckedUpdateInput = {
    perguntaId?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaPerguntaUncheckedUpdateManyWithoutOpcaoPerguntaNestedInput
  }

  export type OpcaoPerguntaCreateManyInput = {
    id?: string
    perguntaId: string
    texto: string
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OpcaoPerguntaUpdateManyMutationInput = {
    texto?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpcaoPerguntaUncheckedUpdateManyInput = {
    perguntaId?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PontoColetaCreateInput = {
    id?: string
    token?: string
    nome: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    pesquisa: PesquisaCreateNestedOneWithoutPontosColetaInput
    respostas?: RespostaCreateNestedManyWithoutPontoColetaInput
  }

  export type PontoColetaUncheckedCreateInput = {
    id?: string
    token?: string
    pesquisaId: string
    nome: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaUncheckedCreateNestedManyWithoutPontoColetaInput
  }

  export type PontoColetaUpdateInput = {
    token?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pesquisa?: PesquisaUpdateOneRequiredWithoutPontosColetaNestedInput
    respostas?: RespostaUpdateManyWithoutPontoColetaNestedInput
  }

  export type PontoColetaUncheckedUpdateInput = {
    token?: StringFieldUpdateOperationsInput | string
    pesquisaId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaUncheckedUpdateManyWithoutPontoColetaNestedInput
  }

  export type PontoColetaCreateManyInput = {
    id?: string
    token?: string
    pesquisaId: string
    nome: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PontoColetaUpdateManyMutationInput = {
    token?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PontoColetaUncheckedUpdateManyInput = {
    token?: StringFieldUpdateOperationsInput | string
    pesquisaId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaCreateInput = {
    id?: string
    idempotencyKey?: string | null
    submissionHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pesquisa: PesquisaCreateNestedOneWithoutRespostasInput
    pontoColeta?: PontoColetaCreateNestedOneWithoutRespostasInput
    perguntas?: RespostaPerguntaCreateNestedManyWithoutRespostaInput
  }

  export type RespostaUncheckedCreateInput = {
    id?: string
    pesquisaId: string
    pontoColetaId?: string | null
    idempotencyKey?: string | null
    submissionHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntas?: RespostaPerguntaUncheckedCreateNestedManyWithoutRespostaInput
  }

  export type RespostaUpdateInput = {
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pesquisa?: PesquisaUpdateOneRequiredWithoutRespostasNestedInput
    pontoColeta?: PontoColetaUpdateOneWithoutRespostasNestedInput
    perguntas?: RespostaPerguntaUpdateManyWithoutRespostaNestedInput
  }

  export type RespostaUncheckedUpdateInput = {
    pesquisaId?: StringFieldUpdateOperationsInput | string
    pontoColetaId?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntas?: RespostaPerguntaUncheckedUpdateManyWithoutRespostaNestedInput
  }

  export type RespostaCreateManyInput = {
    id?: string
    pesquisaId: string
    pontoColetaId?: string | null
    idempotencyKey?: string | null
    submissionHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaUpdateManyMutationInput = {
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaUncheckedUpdateManyInput = {
    pesquisaId?: StringFieldUpdateOperationsInput | string
    pontoColetaId?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaPerguntaCreateInput = {
    id?: string
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resposta: RespostaCreateNestedOneWithoutPerguntasInput
    pergunta: PerguntaCreateNestedOneWithoutRespostasInput
    opcaoPergunta?: OpcaoPerguntaCreateNestedOneWithoutRespostasInput
  }

  export type RespostaPerguntaUncheckedCreateInput = {
    id?: string
    respostaId: string
    pesquisaId: string
    perguntaId: string
    tipo: $Enums.TipoPergunta
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    opcaoPerguntaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaPerguntaUpdateInput = {
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resposta?: RespostaUpdateOneRequiredWithoutPerguntasNestedInput
    pergunta?: PerguntaUpdateOneRequiredWithoutRespostasNestedInput
    opcaoPergunta?: OpcaoPerguntaUpdateOneWithoutRespostasNestedInput
  }

  export type RespostaPerguntaUncheckedUpdateInput = {
    respostaId?: StringFieldUpdateOperationsInput | string
    pesquisaId?: StringFieldUpdateOperationsInput | string
    perguntaId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    opcaoPerguntaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaPerguntaCreateManyInput = {
    id?: string
    respostaId: string
    pesquisaId: string
    perguntaId: string
    tipo: $Enums.TipoPergunta
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    opcaoPerguntaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaPerguntaUpdateManyMutationInput = {
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaPerguntaUncheckedUpdateManyInput = {
    respostaId?: StringFieldUpdateOperationsInput | string
    pesquisaId?: StringFieldUpdateOperationsInput | string
    perguntaId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    opcaoPerguntaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UsuarioListRelationFilter = {
    every?: UsuarioWhereInput
    some?: UsuarioWhereInput
    none?: UsuarioWhereInput
  }

  export type PesquisaListRelationFilter = {
    every?: PesquisaWhereInput
    some?: PesquisaWhereInput
    none?: PesquisaWhereInput
  }

  export type UsuarioOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PesquisaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EmpresaCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmpresaMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EmpresaMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EmpresaScalarRelationFilter = {
    is?: EmpresaWhereInput
    isNot?: EmpresaWhereInput
  }

  export type UsuarioCountOrderByAggregateInput = {
    id?: SortOrder
    empresaId?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhaHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsuarioMaxOrderByAggregateInput = {
    id?: SortOrder
    empresaId?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhaHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsuarioMinOrderByAggregateInput = {
    id?: SortOrder
    empresaId?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senhaHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type EnumStatusPesquisaFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusPesquisa | EnumStatusPesquisaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusPesquisa[] | ListEnumStatusPesquisaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusPesquisa[] | ListEnumStatusPesquisaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusPesquisaFilter<$PrismaModel> | $Enums.StatusPesquisa
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type PerguntaListRelationFilter = {
    every?: PerguntaWhereInput
    some?: PerguntaWhereInput
    none?: PerguntaWhereInput
  }

  export type PontoColetaListRelationFilter = {
    every?: PontoColetaWhereInput
    some?: PontoColetaWhereInput
    none?: PontoColetaWhereInput
  }

  export type RespostaListRelationFilter = {
    every?: RespostaWhereInput
    some?: RespostaWhereInput
    none?: RespostaWhereInput
  }

  export type PerguntaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PontoColetaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RespostaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PesquisaCountOrderByAggregateInput = {
    id?: SortOrder
    empresaId?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    status?: SortOrder
    slug?: SortOrder
    writeVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PesquisaAvgOrderByAggregateInput = {
    writeVersion?: SortOrder
  }

  export type PesquisaMaxOrderByAggregateInput = {
    id?: SortOrder
    empresaId?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    status?: SortOrder
    slug?: SortOrder
    writeVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PesquisaMinOrderByAggregateInput = {
    id?: SortOrder
    empresaId?: SortOrder
    titulo?: SortOrder
    descricao?: SortOrder
    status?: SortOrder
    slug?: SortOrder
    writeVersion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PesquisaSumOrderByAggregateInput = {
    writeVersion?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type EnumStatusPesquisaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusPesquisa | EnumStatusPesquisaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusPesquisa[] | ListEnumStatusPesquisaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusPesquisa[] | ListEnumStatusPesquisaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusPesquisaWithAggregatesFilter<$PrismaModel> | $Enums.StatusPesquisa
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusPesquisaFilter<$PrismaModel>
    _max?: NestedEnumStatusPesquisaFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumTipoPerguntaFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoPergunta | EnumTipoPerguntaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoPergunta[] | ListEnumTipoPerguntaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoPergunta[] | ListEnumTipoPerguntaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoPerguntaFilter<$PrismaModel> | $Enums.TipoPergunta
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type PesquisaScalarRelationFilter = {
    is?: PesquisaWhereInput
    isNot?: PesquisaWhereInput
  }

  export type OpcaoPerguntaListRelationFilter = {
    every?: OpcaoPerguntaWhereInput
    some?: OpcaoPerguntaWhereInput
    none?: OpcaoPerguntaWhereInput
  }

  export type RespostaPerguntaListRelationFilter = {
    every?: RespostaPerguntaWhereInput
    some?: RespostaPerguntaWhereInput
    none?: RespostaPerguntaWhereInput
  }

  export type OpcaoPerguntaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RespostaPerguntaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PerguntaPesquisaIdOrdemCompoundUniqueInput = {
    pesquisaId: string
    ordem: number
  }

  export type PerguntaIdPesquisaIdTipoCompoundUniqueInput = {
    id: string
    pesquisaId: string
    tipo: $Enums.TipoPergunta
  }

  export type PerguntaCountOrderByAggregateInput = {
    id?: SortOrder
    pesquisaId?: SortOrder
    texto?: SortOrder
    tipo?: SortOrder
    obrigatoria?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PerguntaAvgOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type PerguntaMaxOrderByAggregateInput = {
    id?: SortOrder
    pesquisaId?: SortOrder
    texto?: SortOrder
    tipo?: SortOrder
    obrigatoria?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PerguntaMinOrderByAggregateInput = {
    id?: SortOrder
    pesquisaId?: SortOrder
    texto?: SortOrder
    tipo?: SortOrder
    obrigatoria?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PerguntaSumOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type EnumTipoPerguntaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoPergunta | EnumTipoPerguntaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoPergunta[] | ListEnumTipoPerguntaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoPergunta[] | ListEnumTipoPerguntaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoPerguntaWithAggregatesFilter<$PrismaModel> | $Enums.TipoPergunta
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoPerguntaFilter<$PrismaModel>
    _max?: NestedEnumTipoPerguntaFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PerguntaScalarRelationFilter = {
    is?: PerguntaWhereInput
    isNot?: PerguntaWhereInput
  }

  export type OpcaoPerguntaPerguntaIdOrdemCompoundUniqueInput = {
    perguntaId: string
    ordem: number
  }

  export type OpcaoPerguntaIdPerguntaIdCompoundUniqueInput = {
    id: string
    perguntaId: string
  }

  export type OpcaoPerguntaCountOrderByAggregateInput = {
    id?: SortOrder
    perguntaId?: SortOrder
    texto?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OpcaoPerguntaAvgOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type OpcaoPerguntaMaxOrderByAggregateInput = {
    id?: SortOrder
    perguntaId?: SortOrder
    texto?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OpcaoPerguntaMinOrderByAggregateInput = {
    id?: SortOrder
    perguntaId?: SortOrder
    texto?: SortOrder
    ordem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OpcaoPerguntaSumOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type PontoColetaIdPesquisaIdCompoundUniqueInput = {
    id: string
    pesquisaId: string
  }

  export type PontoColetaCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    pesquisaId?: SortOrder
    nome?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PontoColetaMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    pesquisaId?: SortOrder
    nome?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PontoColetaMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    pesquisaId?: SortOrder
    nome?: SortOrder
    ativo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PontoColetaNullableScalarRelationFilter = {
    is?: PontoColetaWhereInput | null
    isNot?: PontoColetaWhereInput | null
  }

  export type RespostaIdPesquisaIdCompoundUniqueInput = {
    id: string
    pesquisaId: string
  }

  export type RespostaCountOrderByAggregateInput = {
    id?: SortOrder
    pesquisaId?: SortOrder
    pontoColetaId?: SortOrder
    idempotencyKey?: SortOrder
    submissionHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RespostaMaxOrderByAggregateInput = {
    id?: SortOrder
    pesquisaId?: SortOrder
    pontoColetaId?: SortOrder
    idempotencyKey?: SortOrder
    submissionHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RespostaMinOrderByAggregateInput = {
    id?: SortOrder
    pesquisaId?: SortOrder
    pontoColetaId?: SortOrder
    idempotencyKey?: SortOrder
    submissionHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
    isSet?: boolean
  }

  export type RespostaScalarRelationFilter = {
    is?: RespostaWhereInput
    isNot?: RespostaWhereInput
  }

  export type OpcaoPerguntaNullableScalarRelationFilter = {
    is?: OpcaoPerguntaWhereInput | null
    isNot?: OpcaoPerguntaWhereInput | null
  }

  export type RespostaPerguntaRespostaIdPerguntaIdCompoundUniqueInput = {
    respostaId: string
    perguntaId: string
  }

  export type RespostaPerguntaCountOrderByAggregateInput = {
    id?: SortOrder
    respostaId?: SortOrder
    pesquisaId?: SortOrder
    perguntaId?: SortOrder
    tipo?: SortOrder
    valorEstrelas?: SortOrder
    valorNps?: SortOrder
    valorSimNao?: SortOrder
    valorTexto?: SortOrder
    opcaoPerguntaId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RespostaPerguntaAvgOrderByAggregateInput = {
    valorEstrelas?: SortOrder
    valorNps?: SortOrder
  }

  export type RespostaPerguntaMaxOrderByAggregateInput = {
    id?: SortOrder
    respostaId?: SortOrder
    pesquisaId?: SortOrder
    perguntaId?: SortOrder
    tipo?: SortOrder
    valorEstrelas?: SortOrder
    valorNps?: SortOrder
    valorSimNao?: SortOrder
    valorTexto?: SortOrder
    opcaoPerguntaId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RespostaPerguntaMinOrderByAggregateInput = {
    id?: SortOrder
    respostaId?: SortOrder
    pesquisaId?: SortOrder
    perguntaId?: SortOrder
    tipo?: SortOrder
    valorEstrelas?: SortOrder
    valorNps?: SortOrder
    valorSimNao?: SortOrder
    valorTexto?: SortOrder
    opcaoPerguntaId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RespostaPerguntaSumOrderByAggregateInput = {
    valorEstrelas?: SortOrder
    valorNps?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type UsuarioCreateNestedManyWithoutEmpresaInput = {
    create?: XOR<UsuarioCreateWithoutEmpresaInput, UsuarioUncheckedCreateWithoutEmpresaInput> | UsuarioCreateWithoutEmpresaInput[] | UsuarioUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutEmpresaInput | UsuarioCreateOrConnectWithoutEmpresaInput[]
    createMany?: UsuarioCreateManyEmpresaInputEnvelope
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
  }

  export type PesquisaCreateNestedManyWithoutEmpresaInput = {
    create?: XOR<PesquisaCreateWithoutEmpresaInput, PesquisaUncheckedCreateWithoutEmpresaInput> | PesquisaCreateWithoutEmpresaInput[] | PesquisaUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: PesquisaCreateOrConnectWithoutEmpresaInput | PesquisaCreateOrConnectWithoutEmpresaInput[]
    createMany?: PesquisaCreateManyEmpresaInputEnvelope
    connect?: PesquisaWhereUniqueInput | PesquisaWhereUniqueInput[]
  }

  export type UsuarioUncheckedCreateNestedManyWithoutEmpresaInput = {
    create?: XOR<UsuarioCreateWithoutEmpresaInput, UsuarioUncheckedCreateWithoutEmpresaInput> | UsuarioCreateWithoutEmpresaInput[] | UsuarioUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutEmpresaInput | UsuarioCreateOrConnectWithoutEmpresaInput[]
    createMany?: UsuarioCreateManyEmpresaInputEnvelope
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
  }

  export type PesquisaUncheckedCreateNestedManyWithoutEmpresaInput = {
    create?: XOR<PesquisaCreateWithoutEmpresaInput, PesquisaUncheckedCreateWithoutEmpresaInput> | PesquisaCreateWithoutEmpresaInput[] | PesquisaUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: PesquisaCreateOrConnectWithoutEmpresaInput | PesquisaCreateOrConnectWithoutEmpresaInput[]
    createMany?: PesquisaCreateManyEmpresaInputEnvelope
    connect?: PesquisaWhereUniqueInput | PesquisaWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UsuarioUpdateManyWithoutEmpresaNestedInput = {
    create?: XOR<UsuarioCreateWithoutEmpresaInput, UsuarioUncheckedCreateWithoutEmpresaInput> | UsuarioCreateWithoutEmpresaInput[] | UsuarioUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutEmpresaInput | UsuarioCreateOrConnectWithoutEmpresaInput[]
    upsert?: UsuarioUpsertWithWhereUniqueWithoutEmpresaInput | UsuarioUpsertWithWhereUniqueWithoutEmpresaInput[]
    createMany?: UsuarioCreateManyEmpresaInputEnvelope
    set?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    disconnect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    delete?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    update?: UsuarioUpdateWithWhereUniqueWithoutEmpresaInput | UsuarioUpdateWithWhereUniqueWithoutEmpresaInput[]
    updateMany?: UsuarioUpdateManyWithWhereWithoutEmpresaInput | UsuarioUpdateManyWithWhereWithoutEmpresaInput[]
    deleteMany?: UsuarioScalarWhereInput | UsuarioScalarWhereInput[]
  }

  export type PesquisaUpdateManyWithoutEmpresaNestedInput = {
    create?: XOR<PesquisaCreateWithoutEmpresaInput, PesquisaUncheckedCreateWithoutEmpresaInput> | PesquisaCreateWithoutEmpresaInput[] | PesquisaUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: PesquisaCreateOrConnectWithoutEmpresaInput | PesquisaCreateOrConnectWithoutEmpresaInput[]
    upsert?: PesquisaUpsertWithWhereUniqueWithoutEmpresaInput | PesquisaUpsertWithWhereUniqueWithoutEmpresaInput[]
    createMany?: PesquisaCreateManyEmpresaInputEnvelope
    set?: PesquisaWhereUniqueInput | PesquisaWhereUniqueInput[]
    disconnect?: PesquisaWhereUniqueInput | PesquisaWhereUniqueInput[]
    delete?: PesquisaWhereUniqueInput | PesquisaWhereUniqueInput[]
    connect?: PesquisaWhereUniqueInput | PesquisaWhereUniqueInput[]
    update?: PesquisaUpdateWithWhereUniqueWithoutEmpresaInput | PesquisaUpdateWithWhereUniqueWithoutEmpresaInput[]
    updateMany?: PesquisaUpdateManyWithWhereWithoutEmpresaInput | PesquisaUpdateManyWithWhereWithoutEmpresaInput[]
    deleteMany?: PesquisaScalarWhereInput | PesquisaScalarWhereInput[]
  }

  export type UsuarioUncheckedUpdateManyWithoutEmpresaNestedInput = {
    create?: XOR<UsuarioCreateWithoutEmpresaInput, UsuarioUncheckedCreateWithoutEmpresaInput> | UsuarioCreateWithoutEmpresaInput[] | UsuarioUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: UsuarioCreateOrConnectWithoutEmpresaInput | UsuarioCreateOrConnectWithoutEmpresaInput[]
    upsert?: UsuarioUpsertWithWhereUniqueWithoutEmpresaInput | UsuarioUpsertWithWhereUniqueWithoutEmpresaInput[]
    createMany?: UsuarioCreateManyEmpresaInputEnvelope
    set?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    disconnect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    delete?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    connect?: UsuarioWhereUniqueInput | UsuarioWhereUniqueInput[]
    update?: UsuarioUpdateWithWhereUniqueWithoutEmpresaInput | UsuarioUpdateWithWhereUniqueWithoutEmpresaInput[]
    updateMany?: UsuarioUpdateManyWithWhereWithoutEmpresaInput | UsuarioUpdateManyWithWhereWithoutEmpresaInput[]
    deleteMany?: UsuarioScalarWhereInput | UsuarioScalarWhereInput[]
  }

  export type PesquisaUncheckedUpdateManyWithoutEmpresaNestedInput = {
    create?: XOR<PesquisaCreateWithoutEmpresaInput, PesquisaUncheckedCreateWithoutEmpresaInput> | PesquisaCreateWithoutEmpresaInput[] | PesquisaUncheckedCreateWithoutEmpresaInput[]
    connectOrCreate?: PesquisaCreateOrConnectWithoutEmpresaInput | PesquisaCreateOrConnectWithoutEmpresaInput[]
    upsert?: PesquisaUpsertWithWhereUniqueWithoutEmpresaInput | PesquisaUpsertWithWhereUniqueWithoutEmpresaInput[]
    createMany?: PesquisaCreateManyEmpresaInputEnvelope
    set?: PesquisaWhereUniqueInput | PesquisaWhereUniqueInput[]
    disconnect?: PesquisaWhereUniqueInput | PesquisaWhereUniqueInput[]
    delete?: PesquisaWhereUniqueInput | PesquisaWhereUniqueInput[]
    connect?: PesquisaWhereUniqueInput | PesquisaWhereUniqueInput[]
    update?: PesquisaUpdateWithWhereUniqueWithoutEmpresaInput | PesquisaUpdateWithWhereUniqueWithoutEmpresaInput[]
    updateMany?: PesquisaUpdateManyWithWhereWithoutEmpresaInput | PesquisaUpdateManyWithWhereWithoutEmpresaInput[]
    deleteMany?: PesquisaScalarWhereInput | PesquisaScalarWhereInput[]
  }

  export type EmpresaCreateNestedOneWithoutUsuariosInput = {
    create?: XOR<EmpresaCreateWithoutUsuariosInput, EmpresaUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: EmpresaCreateOrConnectWithoutUsuariosInput
    connect?: EmpresaWhereUniqueInput
  }

  export type EmpresaUpdateOneRequiredWithoutUsuariosNestedInput = {
    create?: XOR<EmpresaCreateWithoutUsuariosInput, EmpresaUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: EmpresaCreateOrConnectWithoutUsuariosInput
    upsert?: EmpresaUpsertWithoutUsuariosInput
    connect?: EmpresaWhereUniqueInput
    update?: XOR<XOR<EmpresaUpdateToOneWithWhereWithoutUsuariosInput, EmpresaUpdateWithoutUsuariosInput>, EmpresaUncheckedUpdateWithoutUsuariosInput>
  }

  export type EmpresaCreateNestedOneWithoutPesquisasInput = {
    create?: XOR<EmpresaCreateWithoutPesquisasInput, EmpresaUncheckedCreateWithoutPesquisasInput>
    connectOrCreate?: EmpresaCreateOrConnectWithoutPesquisasInput
    connect?: EmpresaWhereUniqueInput
  }

  export type PerguntaCreateNestedManyWithoutPesquisaInput = {
    create?: XOR<PerguntaCreateWithoutPesquisaInput, PerguntaUncheckedCreateWithoutPesquisaInput> | PerguntaCreateWithoutPesquisaInput[] | PerguntaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: PerguntaCreateOrConnectWithoutPesquisaInput | PerguntaCreateOrConnectWithoutPesquisaInput[]
    createMany?: PerguntaCreateManyPesquisaInputEnvelope
    connect?: PerguntaWhereUniqueInput | PerguntaWhereUniqueInput[]
  }

  export type PontoColetaCreateNestedManyWithoutPesquisaInput = {
    create?: XOR<PontoColetaCreateWithoutPesquisaInput, PontoColetaUncheckedCreateWithoutPesquisaInput> | PontoColetaCreateWithoutPesquisaInput[] | PontoColetaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: PontoColetaCreateOrConnectWithoutPesquisaInput | PontoColetaCreateOrConnectWithoutPesquisaInput[]
    createMany?: PontoColetaCreateManyPesquisaInputEnvelope
    connect?: PontoColetaWhereUniqueInput | PontoColetaWhereUniqueInput[]
  }

  export type RespostaCreateNestedManyWithoutPesquisaInput = {
    create?: XOR<RespostaCreateWithoutPesquisaInput, RespostaUncheckedCreateWithoutPesquisaInput> | RespostaCreateWithoutPesquisaInput[] | RespostaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPesquisaInput | RespostaCreateOrConnectWithoutPesquisaInput[]
    createMany?: RespostaCreateManyPesquisaInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type PerguntaUncheckedCreateNestedManyWithoutPesquisaInput = {
    create?: XOR<PerguntaCreateWithoutPesquisaInput, PerguntaUncheckedCreateWithoutPesquisaInput> | PerguntaCreateWithoutPesquisaInput[] | PerguntaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: PerguntaCreateOrConnectWithoutPesquisaInput | PerguntaCreateOrConnectWithoutPesquisaInput[]
    createMany?: PerguntaCreateManyPesquisaInputEnvelope
    connect?: PerguntaWhereUniqueInput | PerguntaWhereUniqueInput[]
  }

  export type PontoColetaUncheckedCreateNestedManyWithoutPesquisaInput = {
    create?: XOR<PontoColetaCreateWithoutPesquisaInput, PontoColetaUncheckedCreateWithoutPesquisaInput> | PontoColetaCreateWithoutPesquisaInput[] | PontoColetaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: PontoColetaCreateOrConnectWithoutPesquisaInput | PontoColetaCreateOrConnectWithoutPesquisaInput[]
    createMany?: PontoColetaCreateManyPesquisaInputEnvelope
    connect?: PontoColetaWhereUniqueInput | PontoColetaWhereUniqueInput[]
  }

  export type RespostaUncheckedCreateNestedManyWithoutPesquisaInput = {
    create?: XOR<RespostaCreateWithoutPesquisaInput, RespostaUncheckedCreateWithoutPesquisaInput> | RespostaCreateWithoutPesquisaInput[] | RespostaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPesquisaInput | RespostaCreateOrConnectWithoutPesquisaInput[]
    createMany?: RespostaCreateManyPesquisaInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type EnumStatusPesquisaFieldUpdateOperationsInput = {
    set?: $Enums.StatusPesquisa
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EmpresaUpdateOneRequiredWithoutPesquisasNestedInput = {
    create?: XOR<EmpresaCreateWithoutPesquisasInput, EmpresaUncheckedCreateWithoutPesquisasInput>
    connectOrCreate?: EmpresaCreateOrConnectWithoutPesquisasInput
    upsert?: EmpresaUpsertWithoutPesquisasInput
    connect?: EmpresaWhereUniqueInput
    update?: XOR<XOR<EmpresaUpdateToOneWithWhereWithoutPesquisasInput, EmpresaUpdateWithoutPesquisasInput>, EmpresaUncheckedUpdateWithoutPesquisasInput>
  }

  export type PerguntaUpdateManyWithoutPesquisaNestedInput = {
    create?: XOR<PerguntaCreateWithoutPesquisaInput, PerguntaUncheckedCreateWithoutPesquisaInput> | PerguntaCreateWithoutPesquisaInput[] | PerguntaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: PerguntaCreateOrConnectWithoutPesquisaInput | PerguntaCreateOrConnectWithoutPesquisaInput[]
    upsert?: PerguntaUpsertWithWhereUniqueWithoutPesquisaInput | PerguntaUpsertWithWhereUniqueWithoutPesquisaInput[]
    createMany?: PerguntaCreateManyPesquisaInputEnvelope
    set?: PerguntaWhereUniqueInput | PerguntaWhereUniqueInput[]
    disconnect?: PerguntaWhereUniqueInput | PerguntaWhereUniqueInput[]
    delete?: PerguntaWhereUniqueInput | PerguntaWhereUniqueInput[]
    connect?: PerguntaWhereUniqueInput | PerguntaWhereUniqueInput[]
    update?: PerguntaUpdateWithWhereUniqueWithoutPesquisaInput | PerguntaUpdateWithWhereUniqueWithoutPesquisaInput[]
    updateMany?: PerguntaUpdateManyWithWhereWithoutPesquisaInput | PerguntaUpdateManyWithWhereWithoutPesquisaInput[]
    deleteMany?: PerguntaScalarWhereInput | PerguntaScalarWhereInput[]
  }

  export type PontoColetaUpdateManyWithoutPesquisaNestedInput = {
    create?: XOR<PontoColetaCreateWithoutPesquisaInput, PontoColetaUncheckedCreateWithoutPesquisaInput> | PontoColetaCreateWithoutPesquisaInput[] | PontoColetaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: PontoColetaCreateOrConnectWithoutPesquisaInput | PontoColetaCreateOrConnectWithoutPesquisaInput[]
    upsert?: PontoColetaUpsertWithWhereUniqueWithoutPesquisaInput | PontoColetaUpsertWithWhereUniqueWithoutPesquisaInput[]
    createMany?: PontoColetaCreateManyPesquisaInputEnvelope
    set?: PontoColetaWhereUniqueInput | PontoColetaWhereUniqueInput[]
    disconnect?: PontoColetaWhereUniqueInput | PontoColetaWhereUniqueInput[]
    delete?: PontoColetaWhereUniqueInput | PontoColetaWhereUniqueInput[]
    connect?: PontoColetaWhereUniqueInput | PontoColetaWhereUniqueInput[]
    update?: PontoColetaUpdateWithWhereUniqueWithoutPesquisaInput | PontoColetaUpdateWithWhereUniqueWithoutPesquisaInput[]
    updateMany?: PontoColetaUpdateManyWithWhereWithoutPesquisaInput | PontoColetaUpdateManyWithWhereWithoutPesquisaInput[]
    deleteMany?: PontoColetaScalarWhereInput | PontoColetaScalarWhereInput[]
  }

  export type RespostaUpdateManyWithoutPesquisaNestedInput = {
    create?: XOR<RespostaCreateWithoutPesquisaInput, RespostaUncheckedCreateWithoutPesquisaInput> | RespostaCreateWithoutPesquisaInput[] | RespostaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPesquisaInput | RespostaCreateOrConnectWithoutPesquisaInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutPesquisaInput | RespostaUpsertWithWhereUniqueWithoutPesquisaInput[]
    createMany?: RespostaCreateManyPesquisaInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutPesquisaInput | RespostaUpdateWithWhereUniqueWithoutPesquisaInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutPesquisaInput | RespostaUpdateManyWithWhereWithoutPesquisaInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type PerguntaUncheckedUpdateManyWithoutPesquisaNestedInput = {
    create?: XOR<PerguntaCreateWithoutPesquisaInput, PerguntaUncheckedCreateWithoutPesquisaInput> | PerguntaCreateWithoutPesquisaInput[] | PerguntaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: PerguntaCreateOrConnectWithoutPesquisaInput | PerguntaCreateOrConnectWithoutPesquisaInput[]
    upsert?: PerguntaUpsertWithWhereUniqueWithoutPesquisaInput | PerguntaUpsertWithWhereUniqueWithoutPesquisaInput[]
    createMany?: PerguntaCreateManyPesquisaInputEnvelope
    set?: PerguntaWhereUniqueInput | PerguntaWhereUniqueInput[]
    disconnect?: PerguntaWhereUniqueInput | PerguntaWhereUniqueInput[]
    delete?: PerguntaWhereUniqueInput | PerguntaWhereUniqueInput[]
    connect?: PerguntaWhereUniqueInput | PerguntaWhereUniqueInput[]
    update?: PerguntaUpdateWithWhereUniqueWithoutPesquisaInput | PerguntaUpdateWithWhereUniqueWithoutPesquisaInput[]
    updateMany?: PerguntaUpdateManyWithWhereWithoutPesquisaInput | PerguntaUpdateManyWithWhereWithoutPesquisaInput[]
    deleteMany?: PerguntaScalarWhereInput | PerguntaScalarWhereInput[]
  }

  export type PontoColetaUncheckedUpdateManyWithoutPesquisaNestedInput = {
    create?: XOR<PontoColetaCreateWithoutPesquisaInput, PontoColetaUncheckedCreateWithoutPesquisaInput> | PontoColetaCreateWithoutPesquisaInput[] | PontoColetaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: PontoColetaCreateOrConnectWithoutPesquisaInput | PontoColetaCreateOrConnectWithoutPesquisaInput[]
    upsert?: PontoColetaUpsertWithWhereUniqueWithoutPesquisaInput | PontoColetaUpsertWithWhereUniqueWithoutPesquisaInput[]
    createMany?: PontoColetaCreateManyPesquisaInputEnvelope
    set?: PontoColetaWhereUniqueInput | PontoColetaWhereUniqueInput[]
    disconnect?: PontoColetaWhereUniqueInput | PontoColetaWhereUniqueInput[]
    delete?: PontoColetaWhereUniqueInput | PontoColetaWhereUniqueInput[]
    connect?: PontoColetaWhereUniqueInput | PontoColetaWhereUniqueInput[]
    update?: PontoColetaUpdateWithWhereUniqueWithoutPesquisaInput | PontoColetaUpdateWithWhereUniqueWithoutPesquisaInput[]
    updateMany?: PontoColetaUpdateManyWithWhereWithoutPesquisaInput | PontoColetaUpdateManyWithWhereWithoutPesquisaInput[]
    deleteMany?: PontoColetaScalarWhereInput | PontoColetaScalarWhereInput[]
  }

  export type RespostaUncheckedUpdateManyWithoutPesquisaNestedInput = {
    create?: XOR<RespostaCreateWithoutPesquisaInput, RespostaUncheckedCreateWithoutPesquisaInput> | RespostaCreateWithoutPesquisaInput[] | RespostaUncheckedCreateWithoutPesquisaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPesquisaInput | RespostaCreateOrConnectWithoutPesquisaInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutPesquisaInput | RespostaUpsertWithWhereUniqueWithoutPesquisaInput[]
    createMany?: RespostaCreateManyPesquisaInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutPesquisaInput | RespostaUpdateWithWhereUniqueWithoutPesquisaInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutPesquisaInput | RespostaUpdateManyWithWhereWithoutPesquisaInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type PesquisaCreateNestedOneWithoutPerguntasInput = {
    create?: XOR<PesquisaCreateWithoutPerguntasInput, PesquisaUncheckedCreateWithoutPerguntasInput>
    connectOrCreate?: PesquisaCreateOrConnectWithoutPerguntasInput
    connect?: PesquisaWhereUniqueInput
  }

  export type OpcaoPerguntaCreateNestedManyWithoutPerguntaInput = {
    create?: XOR<OpcaoPerguntaCreateWithoutPerguntaInput, OpcaoPerguntaUncheckedCreateWithoutPerguntaInput> | OpcaoPerguntaCreateWithoutPerguntaInput[] | OpcaoPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: OpcaoPerguntaCreateOrConnectWithoutPerguntaInput | OpcaoPerguntaCreateOrConnectWithoutPerguntaInput[]
    createMany?: OpcaoPerguntaCreateManyPerguntaInputEnvelope
    connect?: OpcaoPerguntaWhereUniqueInput | OpcaoPerguntaWhereUniqueInput[]
  }

  export type RespostaPerguntaCreateNestedManyWithoutPerguntaInput = {
    create?: XOR<RespostaPerguntaCreateWithoutPerguntaInput, RespostaPerguntaUncheckedCreateWithoutPerguntaInput> | RespostaPerguntaCreateWithoutPerguntaInput[] | RespostaPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutPerguntaInput | RespostaPerguntaCreateOrConnectWithoutPerguntaInput[]
    createMany?: RespostaPerguntaCreateManyPerguntaInputEnvelope
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
  }

  export type OpcaoPerguntaUncheckedCreateNestedManyWithoutPerguntaInput = {
    create?: XOR<OpcaoPerguntaCreateWithoutPerguntaInput, OpcaoPerguntaUncheckedCreateWithoutPerguntaInput> | OpcaoPerguntaCreateWithoutPerguntaInput[] | OpcaoPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: OpcaoPerguntaCreateOrConnectWithoutPerguntaInput | OpcaoPerguntaCreateOrConnectWithoutPerguntaInput[]
    createMany?: OpcaoPerguntaCreateManyPerguntaInputEnvelope
    connect?: OpcaoPerguntaWhereUniqueInput | OpcaoPerguntaWhereUniqueInput[]
  }

  export type RespostaPerguntaUncheckedCreateNestedManyWithoutPerguntaInput = {
    create?: XOR<RespostaPerguntaCreateWithoutPerguntaInput, RespostaPerguntaUncheckedCreateWithoutPerguntaInput> | RespostaPerguntaCreateWithoutPerguntaInput[] | RespostaPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutPerguntaInput | RespostaPerguntaCreateOrConnectWithoutPerguntaInput[]
    createMany?: RespostaPerguntaCreateManyPerguntaInputEnvelope
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
  }

  export type EnumTipoPerguntaFieldUpdateOperationsInput = {
    set?: $Enums.TipoPergunta
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type PesquisaUpdateOneRequiredWithoutPerguntasNestedInput = {
    create?: XOR<PesquisaCreateWithoutPerguntasInput, PesquisaUncheckedCreateWithoutPerguntasInput>
    connectOrCreate?: PesquisaCreateOrConnectWithoutPerguntasInput
    upsert?: PesquisaUpsertWithoutPerguntasInput
    connect?: PesquisaWhereUniqueInput
    update?: XOR<XOR<PesquisaUpdateToOneWithWhereWithoutPerguntasInput, PesquisaUpdateWithoutPerguntasInput>, PesquisaUncheckedUpdateWithoutPerguntasInput>
  }

  export type OpcaoPerguntaUpdateManyWithoutPerguntaNestedInput = {
    create?: XOR<OpcaoPerguntaCreateWithoutPerguntaInput, OpcaoPerguntaUncheckedCreateWithoutPerguntaInput> | OpcaoPerguntaCreateWithoutPerguntaInput[] | OpcaoPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: OpcaoPerguntaCreateOrConnectWithoutPerguntaInput | OpcaoPerguntaCreateOrConnectWithoutPerguntaInput[]
    upsert?: OpcaoPerguntaUpsertWithWhereUniqueWithoutPerguntaInput | OpcaoPerguntaUpsertWithWhereUniqueWithoutPerguntaInput[]
    createMany?: OpcaoPerguntaCreateManyPerguntaInputEnvelope
    set?: OpcaoPerguntaWhereUniqueInput | OpcaoPerguntaWhereUniqueInput[]
    disconnect?: OpcaoPerguntaWhereUniqueInput | OpcaoPerguntaWhereUniqueInput[]
    delete?: OpcaoPerguntaWhereUniqueInput | OpcaoPerguntaWhereUniqueInput[]
    connect?: OpcaoPerguntaWhereUniqueInput | OpcaoPerguntaWhereUniqueInput[]
    update?: OpcaoPerguntaUpdateWithWhereUniqueWithoutPerguntaInput | OpcaoPerguntaUpdateWithWhereUniqueWithoutPerguntaInput[]
    updateMany?: OpcaoPerguntaUpdateManyWithWhereWithoutPerguntaInput | OpcaoPerguntaUpdateManyWithWhereWithoutPerguntaInput[]
    deleteMany?: OpcaoPerguntaScalarWhereInput | OpcaoPerguntaScalarWhereInput[]
  }

  export type RespostaPerguntaUpdateManyWithoutPerguntaNestedInput = {
    create?: XOR<RespostaPerguntaCreateWithoutPerguntaInput, RespostaPerguntaUncheckedCreateWithoutPerguntaInput> | RespostaPerguntaCreateWithoutPerguntaInput[] | RespostaPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutPerguntaInput | RespostaPerguntaCreateOrConnectWithoutPerguntaInput[]
    upsert?: RespostaPerguntaUpsertWithWhereUniqueWithoutPerguntaInput | RespostaPerguntaUpsertWithWhereUniqueWithoutPerguntaInput[]
    createMany?: RespostaPerguntaCreateManyPerguntaInputEnvelope
    set?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    disconnect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    delete?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    update?: RespostaPerguntaUpdateWithWhereUniqueWithoutPerguntaInput | RespostaPerguntaUpdateWithWhereUniqueWithoutPerguntaInput[]
    updateMany?: RespostaPerguntaUpdateManyWithWhereWithoutPerguntaInput | RespostaPerguntaUpdateManyWithWhereWithoutPerguntaInput[]
    deleteMany?: RespostaPerguntaScalarWhereInput | RespostaPerguntaScalarWhereInput[]
  }

  export type OpcaoPerguntaUncheckedUpdateManyWithoutPerguntaNestedInput = {
    create?: XOR<OpcaoPerguntaCreateWithoutPerguntaInput, OpcaoPerguntaUncheckedCreateWithoutPerguntaInput> | OpcaoPerguntaCreateWithoutPerguntaInput[] | OpcaoPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: OpcaoPerguntaCreateOrConnectWithoutPerguntaInput | OpcaoPerguntaCreateOrConnectWithoutPerguntaInput[]
    upsert?: OpcaoPerguntaUpsertWithWhereUniqueWithoutPerguntaInput | OpcaoPerguntaUpsertWithWhereUniqueWithoutPerguntaInput[]
    createMany?: OpcaoPerguntaCreateManyPerguntaInputEnvelope
    set?: OpcaoPerguntaWhereUniqueInput | OpcaoPerguntaWhereUniqueInput[]
    disconnect?: OpcaoPerguntaWhereUniqueInput | OpcaoPerguntaWhereUniqueInput[]
    delete?: OpcaoPerguntaWhereUniqueInput | OpcaoPerguntaWhereUniqueInput[]
    connect?: OpcaoPerguntaWhereUniqueInput | OpcaoPerguntaWhereUniqueInput[]
    update?: OpcaoPerguntaUpdateWithWhereUniqueWithoutPerguntaInput | OpcaoPerguntaUpdateWithWhereUniqueWithoutPerguntaInput[]
    updateMany?: OpcaoPerguntaUpdateManyWithWhereWithoutPerguntaInput | OpcaoPerguntaUpdateManyWithWhereWithoutPerguntaInput[]
    deleteMany?: OpcaoPerguntaScalarWhereInput | OpcaoPerguntaScalarWhereInput[]
  }

  export type RespostaPerguntaUncheckedUpdateManyWithoutPerguntaNestedInput = {
    create?: XOR<RespostaPerguntaCreateWithoutPerguntaInput, RespostaPerguntaUncheckedCreateWithoutPerguntaInput> | RespostaPerguntaCreateWithoutPerguntaInput[] | RespostaPerguntaUncheckedCreateWithoutPerguntaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutPerguntaInput | RespostaPerguntaCreateOrConnectWithoutPerguntaInput[]
    upsert?: RespostaPerguntaUpsertWithWhereUniqueWithoutPerguntaInput | RespostaPerguntaUpsertWithWhereUniqueWithoutPerguntaInput[]
    createMany?: RespostaPerguntaCreateManyPerguntaInputEnvelope
    set?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    disconnect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    delete?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    update?: RespostaPerguntaUpdateWithWhereUniqueWithoutPerguntaInput | RespostaPerguntaUpdateWithWhereUniqueWithoutPerguntaInput[]
    updateMany?: RespostaPerguntaUpdateManyWithWhereWithoutPerguntaInput | RespostaPerguntaUpdateManyWithWhereWithoutPerguntaInput[]
    deleteMany?: RespostaPerguntaScalarWhereInput | RespostaPerguntaScalarWhereInput[]
  }

  export type PerguntaCreateNestedOneWithoutOpcoesInput = {
    create?: XOR<PerguntaCreateWithoutOpcoesInput, PerguntaUncheckedCreateWithoutOpcoesInput>
    connectOrCreate?: PerguntaCreateOrConnectWithoutOpcoesInput
    connect?: PerguntaWhereUniqueInput
  }

  export type RespostaPerguntaCreateNestedManyWithoutOpcaoPerguntaInput = {
    create?: XOR<RespostaPerguntaCreateWithoutOpcaoPerguntaInput, RespostaPerguntaUncheckedCreateWithoutOpcaoPerguntaInput> | RespostaPerguntaCreateWithoutOpcaoPerguntaInput[] | RespostaPerguntaUncheckedCreateWithoutOpcaoPerguntaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutOpcaoPerguntaInput | RespostaPerguntaCreateOrConnectWithoutOpcaoPerguntaInput[]
    createMany?: RespostaPerguntaCreateManyOpcaoPerguntaInputEnvelope
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
  }

  export type RespostaPerguntaUncheckedCreateNestedManyWithoutOpcaoPerguntaInput = {
    create?: XOR<RespostaPerguntaCreateWithoutOpcaoPerguntaInput, RespostaPerguntaUncheckedCreateWithoutOpcaoPerguntaInput> | RespostaPerguntaCreateWithoutOpcaoPerguntaInput[] | RespostaPerguntaUncheckedCreateWithoutOpcaoPerguntaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutOpcaoPerguntaInput | RespostaPerguntaCreateOrConnectWithoutOpcaoPerguntaInput[]
    createMany?: RespostaPerguntaCreateManyOpcaoPerguntaInputEnvelope
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
  }

  export type PerguntaUpdateOneRequiredWithoutOpcoesNestedInput = {
    create?: XOR<PerguntaCreateWithoutOpcoesInput, PerguntaUncheckedCreateWithoutOpcoesInput>
    connectOrCreate?: PerguntaCreateOrConnectWithoutOpcoesInput
    upsert?: PerguntaUpsertWithoutOpcoesInput
    connect?: PerguntaWhereUniqueInput
    update?: XOR<XOR<PerguntaUpdateToOneWithWhereWithoutOpcoesInput, PerguntaUpdateWithoutOpcoesInput>, PerguntaUncheckedUpdateWithoutOpcoesInput>
  }

  export type RespostaPerguntaUpdateManyWithoutOpcaoPerguntaNestedInput = {
    create?: XOR<RespostaPerguntaCreateWithoutOpcaoPerguntaInput, RespostaPerguntaUncheckedCreateWithoutOpcaoPerguntaInput> | RespostaPerguntaCreateWithoutOpcaoPerguntaInput[] | RespostaPerguntaUncheckedCreateWithoutOpcaoPerguntaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutOpcaoPerguntaInput | RespostaPerguntaCreateOrConnectWithoutOpcaoPerguntaInput[]
    upsert?: RespostaPerguntaUpsertWithWhereUniqueWithoutOpcaoPerguntaInput | RespostaPerguntaUpsertWithWhereUniqueWithoutOpcaoPerguntaInput[]
    createMany?: RespostaPerguntaCreateManyOpcaoPerguntaInputEnvelope
    set?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    disconnect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    delete?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    update?: RespostaPerguntaUpdateWithWhereUniqueWithoutOpcaoPerguntaInput | RespostaPerguntaUpdateWithWhereUniqueWithoutOpcaoPerguntaInput[]
    updateMany?: RespostaPerguntaUpdateManyWithWhereWithoutOpcaoPerguntaInput | RespostaPerguntaUpdateManyWithWhereWithoutOpcaoPerguntaInput[]
    deleteMany?: RespostaPerguntaScalarWhereInput | RespostaPerguntaScalarWhereInput[]
  }

  export type RespostaPerguntaUncheckedUpdateManyWithoutOpcaoPerguntaNestedInput = {
    create?: XOR<RespostaPerguntaCreateWithoutOpcaoPerguntaInput, RespostaPerguntaUncheckedCreateWithoutOpcaoPerguntaInput> | RespostaPerguntaCreateWithoutOpcaoPerguntaInput[] | RespostaPerguntaUncheckedCreateWithoutOpcaoPerguntaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutOpcaoPerguntaInput | RespostaPerguntaCreateOrConnectWithoutOpcaoPerguntaInput[]
    upsert?: RespostaPerguntaUpsertWithWhereUniqueWithoutOpcaoPerguntaInput | RespostaPerguntaUpsertWithWhereUniqueWithoutOpcaoPerguntaInput[]
    createMany?: RespostaPerguntaCreateManyOpcaoPerguntaInputEnvelope
    set?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    disconnect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    delete?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    update?: RespostaPerguntaUpdateWithWhereUniqueWithoutOpcaoPerguntaInput | RespostaPerguntaUpdateWithWhereUniqueWithoutOpcaoPerguntaInput[]
    updateMany?: RespostaPerguntaUpdateManyWithWhereWithoutOpcaoPerguntaInput | RespostaPerguntaUpdateManyWithWhereWithoutOpcaoPerguntaInput[]
    deleteMany?: RespostaPerguntaScalarWhereInput | RespostaPerguntaScalarWhereInput[]
  }

  export type PesquisaCreateNestedOneWithoutPontosColetaInput = {
    create?: XOR<PesquisaCreateWithoutPontosColetaInput, PesquisaUncheckedCreateWithoutPontosColetaInput>
    connectOrCreate?: PesquisaCreateOrConnectWithoutPontosColetaInput
    connect?: PesquisaWhereUniqueInput
  }

  export type RespostaCreateNestedManyWithoutPontoColetaInput = {
    create?: XOR<RespostaCreateWithoutPontoColetaInput, RespostaUncheckedCreateWithoutPontoColetaInput> | RespostaCreateWithoutPontoColetaInput[] | RespostaUncheckedCreateWithoutPontoColetaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPontoColetaInput | RespostaCreateOrConnectWithoutPontoColetaInput[]
    createMany?: RespostaCreateManyPontoColetaInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type RespostaUncheckedCreateNestedManyWithoutPontoColetaInput = {
    create?: XOR<RespostaCreateWithoutPontoColetaInput, RespostaUncheckedCreateWithoutPontoColetaInput> | RespostaCreateWithoutPontoColetaInput[] | RespostaUncheckedCreateWithoutPontoColetaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPontoColetaInput | RespostaCreateOrConnectWithoutPontoColetaInput[]
    createMany?: RespostaCreateManyPontoColetaInputEnvelope
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
  }

  export type PesquisaUpdateOneRequiredWithoutPontosColetaNestedInput = {
    create?: XOR<PesquisaCreateWithoutPontosColetaInput, PesquisaUncheckedCreateWithoutPontosColetaInput>
    connectOrCreate?: PesquisaCreateOrConnectWithoutPontosColetaInput
    upsert?: PesquisaUpsertWithoutPontosColetaInput
    connect?: PesquisaWhereUniqueInput
    update?: XOR<XOR<PesquisaUpdateToOneWithWhereWithoutPontosColetaInput, PesquisaUpdateWithoutPontosColetaInput>, PesquisaUncheckedUpdateWithoutPontosColetaInput>
  }

  export type RespostaUpdateManyWithoutPontoColetaNestedInput = {
    create?: XOR<RespostaCreateWithoutPontoColetaInput, RespostaUncheckedCreateWithoutPontoColetaInput> | RespostaCreateWithoutPontoColetaInput[] | RespostaUncheckedCreateWithoutPontoColetaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPontoColetaInput | RespostaCreateOrConnectWithoutPontoColetaInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutPontoColetaInput | RespostaUpsertWithWhereUniqueWithoutPontoColetaInput[]
    createMany?: RespostaCreateManyPontoColetaInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutPontoColetaInput | RespostaUpdateWithWhereUniqueWithoutPontoColetaInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutPontoColetaInput | RespostaUpdateManyWithWhereWithoutPontoColetaInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type RespostaUncheckedUpdateManyWithoutPontoColetaNestedInput = {
    create?: XOR<RespostaCreateWithoutPontoColetaInput, RespostaUncheckedCreateWithoutPontoColetaInput> | RespostaCreateWithoutPontoColetaInput[] | RespostaUncheckedCreateWithoutPontoColetaInput[]
    connectOrCreate?: RespostaCreateOrConnectWithoutPontoColetaInput | RespostaCreateOrConnectWithoutPontoColetaInput[]
    upsert?: RespostaUpsertWithWhereUniqueWithoutPontoColetaInput | RespostaUpsertWithWhereUniqueWithoutPontoColetaInput[]
    createMany?: RespostaCreateManyPontoColetaInputEnvelope
    set?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    disconnect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    delete?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    connect?: RespostaWhereUniqueInput | RespostaWhereUniqueInput[]
    update?: RespostaUpdateWithWhereUniqueWithoutPontoColetaInput | RespostaUpdateWithWhereUniqueWithoutPontoColetaInput[]
    updateMany?: RespostaUpdateManyWithWhereWithoutPontoColetaInput | RespostaUpdateManyWithWhereWithoutPontoColetaInput[]
    deleteMany?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
  }

  export type PesquisaCreateNestedOneWithoutRespostasInput = {
    create?: XOR<PesquisaCreateWithoutRespostasInput, PesquisaUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: PesquisaCreateOrConnectWithoutRespostasInput
    connect?: PesquisaWhereUniqueInput
  }

  export type PontoColetaCreateNestedOneWithoutRespostasInput = {
    create?: XOR<PontoColetaCreateWithoutRespostasInput, PontoColetaUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: PontoColetaCreateOrConnectWithoutRespostasInput
    connect?: PontoColetaWhereUniqueInput
  }

  export type RespostaPerguntaCreateNestedManyWithoutRespostaInput = {
    create?: XOR<RespostaPerguntaCreateWithoutRespostaInput, RespostaPerguntaUncheckedCreateWithoutRespostaInput> | RespostaPerguntaCreateWithoutRespostaInput[] | RespostaPerguntaUncheckedCreateWithoutRespostaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutRespostaInput | RespostaPerguntaCreateOrConnectWithoutRespostaInput[]
    createMany?: RespostaPerguntaCreateManyRespostaInputEnvelope
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
  }

  export type RespostaPerguntaUncheckedCreateNestedManyWithoutRespostaInput = {
    create?: XOR<RespostaPerguntaCreateWithoutRespostaInput, RespostaPerguntaUncheckedCreateWithoutRespostaInput> | RespostaPerguntaCreateWithoutRespostaInput[] | RespostaPerguntaUncheckedCreateWithoutRespostaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutRespostaInput | RespostaPerguntaCreateOrConnectWithoutRespostaInput[]
    createMany?: RespostaPerguntaCreateManyRespostaInputEnvelope
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
  }

  export type PesquisaUpdateOneRequiredWithoutRespostasNestedInput = {
    create?: XOR<PesquisaCreateWithoutRespostasInput, PesquisaUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: PesquisaCreateOrConnectWithoutRespostasInput
    upsert?: PesquisaUpsertWithoutRespostasInput
    connect?: PesquisaWhereUniqueInput
    update?: XOR<XOR<PesquisaUpdateToOneWithWhereWithoutRespostasInput, PesquisaUpdateWithoutRespostasInput>, PesquisaUncheckedUpdateWithoutRespostasInput>
  }

  export type PontoColetaUpdateOneWithoutRespostasNestedInput = {
    create?: XOR<PontoColetaCreateWithoutRespostasInput, PontoColetaUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: PontoColetaCreateOrConnectWithoutRespostasInput
    upsert?: PontoColetaUpsertWithoutRespostasInput
    disconnect?: boolean
    delete?: PontoColetaWhereInput | boolean
    connect?: PontoColetaWhereUniqueInput
    update?: XOR<XOR<PontoColetaUpdateToOneWithWhereWithoutRespostasInput, PontoColetaUpdateWithoutRespostasInput>, PontoColetaUncheckedUpdateWithoutRespostasInput>
  }

  export type RespostaPerguntaUpdateManyWithoutRespostaNestedInput = {
    create?: XOR<RespostaPerguntaCreateWithoutRespostaInput, RespostaPerguntaUncheckedCreateWithoutRespostaInput> | RespostaPerguntaCreateWithoutRespostaInput[] | RespostaPerguntaUncheckedCreateWithoutRespostaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutRespostaInput | RespostaPerguntaCreateOrConnectWithoutRespostaInput[]
    upsert?: RespostaPerguntaUpsertWithWhereUniqueWithoutRespostaInput | RespostaPerguntaUpsertWithWhereUniqueWithoutRespostaInput[]
    createMany?: RespostaPerguntaCreateManyRespostaInputEnvelope
    set?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    disconnect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    delete?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    update?: RespostaPerguntaUpdateWithWhereUniqueWithoutRespostaInput | RespostaPerguntaUpdateWithWhereUniqueWithoutRespostaInput[]
    updateMany?: RespostaPerguntaUpdateManyWithWhereWithoutRespostaInput | RespostaPerguntaUpdateManyWithWhereWithoutRespostaInput[]
    deleteMany?: RespostaPerguntaScalarWhereInput | RespostaPerguntaScalarWhereInput[]
  }

  export type RespostaPerguntaUncheckedUpdateManyWithoutRespostaNestedInput = {
    create?: XOR<RespostaPerguntaCreateWithoutRespostaInput, RespostaPerguntaUncheckedCreateWithoutRespostaInput> | RespostaPerguntaCreateWithoutRespostaInput[] | RespostaPerguntaUncheckedCreateWithoutRespostaInput[]
    connectOrCreate?: RespostaPerguntaCreateOrConnectWithoutRespostaInput | RespostaPerguntaCreateOrConnectWithoutRespostaInput[]
    upsert?: RespostaPerguntaUpsertWithWhereUniqueWithoutRespostaInput | RespostaPerguntaUpsertWithWhereUniqueWithoutRespostaInput[]
    createMany?: RespostaPerguntaCreateManyRespostaInputEnvelope
    set?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    disconnect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    delete?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    connect?: RespostaPerguntaWhereUniqueInput | RespostaPerguntaWhereUniqueInput[]
    update?: RespostaPerguntaUpdateWithWhereUniqueWithoutRespostaInput | RespostaPerguntaUpdateWithWhereUniqueWithoutRespostaInput[]
    updateMany?: RespostaPerguntaUpdateManyWithWhereWithoutRespostaInput | RespostaPerguntaUpdateManyWithWhereWithoutRespostaInput[]
    deleteMany?: RespostaPerguntaScalarWhereInput | RespostaPerguntaScalarWhereInput[]
  }

  export type RespostaCreateNestedOneWithoutPerguntasInput = {
    create?: XOR<RespostaCreateWithoutPerguntasInput, RespostaUncheckedCreateWithoutPerguntasInput>
    connectOrCreate?: RespostaCreateOrConnectWithoutPerguntasInput
    connect?: RespostaWhereUniqueInput
  }

  export type PerguntaCreateNestedOneWithoutRespostasInput = {
    create?: XOR<PerguntaCreateWithoutRespostasInput, PerguntaUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: PerguntaCreateOrConnectWithoutRespostasInput
    connect?: PerguntaWhereUniqueInput
  }

  export type OpcaoPerguntaCreateNestedOneWithoutRespostasInput = {
    create?: XOR<OpcaoPerguntaCreateWithoutRespostasInput, OpcaoPerguntaUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: OpcaoPerguntaCreateOrConnectWithoutRespostasInput
    connect?: OpcaoPerguntaWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
    unset?: boolean
  }

  export type RespostaUpdateOneRequiredWithoutPerguntasNestedInput = {
    create?: XOR<RespostaCreateWithoutPerguntasInput, RespostaUncheckedCreateWithoutPerguntasInput>
    connectOrCreate?: RespostaCreateOrConnectWithoutPerguntasInput
    upsert?: RespostaUpsertWithoutPerguntasInput
    connect?: RespostaWhereUniqueInput
    update?: XOR<XOR<RespostaUpdateToOneWithWhereWithoutPerguntasInput, RespostaUpdateWithoutPerguntasInput>, RespostaUncheckedUpdateWithoutPerguntasInput>
  }

  export type PerguntaUpdateOneRequiredWithoutRespostasNestedInput = {
    create?: XOR<PerguntaCreateWithoutRespostasInput, PerguntaUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: PerguntaCreateOrConnectWithoutRespostasInput
    upsert?: PerguntaUpsertWithoutRespostasInput
    connect?: PerguntaWhereUniqueInput
    update?: XOR<XOR<PerguntaUpdateToOneWithWhereWithoutRespostasInput, PerguntaUpdateWithoutRespostasInput>, PerguntaUncheckedUpdateWithoutRespostasInput>
  }

  export type OpcaoPerguntaUpdateOneWithoutRespostasNestedInput = {
    create?: XOR<OpcaoPerguntaCreateWithoutRespostasInput, OpcaoPerguntaUncheckedCreateWithoutRespostasInput>
    connectOrCreate?: OpcaoPerguntaCreateOrConnectWithoutRespostasInput
    upsert?: OpcaoPerguntaUpsertWithoutRespostasInput
    disconnect?: boolean
    delete?: OpcaoPerguntaWhereInput | boolean
    connect?: OpcaoPerguntaWhereUniqueInput
    update?: XOR<XOR<OpcaoPerguntaUpdateToOneWithWhereWithoutRespostasInput, OpcaoPerguntaUpdateWithoutRespostasInput>, OpcaoPerguntaUncheckedUpdateWithoutRespostasInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type NestedEnumStatusPesquisaFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusPesquisa | EnumStatusPesquisaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusPesquisa[] | ListEnumStatusPesquisaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusPesquisa[] | ListEnumStatusPesquisaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusPesquisaFilter<$PrismaModel> | $Enums.StatusPesquisa
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedEnumStatusPesquisaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusPesquisa | EnumStatusPesquisaFieldRefInput<$PrismaModel>
    in?: $Enums.StatusPesquisa[] | ListEnumStatusPesquisaFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusPesquisa[] | ListEnumStatusPesquisaFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusPesquisaWithAggregatesFilter<$PrismaModel> | $Enums.StatusPesquisa
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusPesquisaFilter<$PrismaModel>
    _max?: NestedEnumStatusPesquisaFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumTipoPerguntaFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoPergunta | EnumTipoPerguntaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoPergunta[] | ListEnumTipoPerguntaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoPergunta[] | ListEnumTipoPerguntaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoPerguntaFilter<$PrismaModel> | $Enums.TipoPergunta
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumTipoPerguntaWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoPergunta | EnumTipoPerguntaFieldRefInput<$PrismaModel>
    in?: $Enums.TipoPergunta[] | ListEnumTipoPerguntaFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoPergunta[] | ListEnumTipoPerguntaFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoPerguntaWithAggregatesFilter<$PrismaModel> | $Enums.TipoPergunta
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoPerguntaFilter<$PrismaModel>
    _max?: NestedEnumTipoPerguntaFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
    isSet?: boolean
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type UsuarioCreateWithoutEmpresaInput = {
    id?: string
    nome: string
    email: string
    senhaHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsuarioUncheckedCreateWithoutEmpresaInput = {
    id?: string
    nome: string
    email: string
    senhaHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsuarioCreateOrConnectWithoutEmpresaInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutEmpresaInput, UsuarioUncheckedCreateWithoutEmpresaInput>
  }

  export type UsuarioCreateManyEmpresaInputEnvelope = {
    data: UsuarioCreateManyEmpresaInput | UsuarioCreateManyEmpresaInput[]
  }

  export type PesquisaCreateWithoutEmpresaInput = {
    id?: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntas?: PerguntaCreateNestedManyWithoutPesquisaInput
    pontosColeta?: PontoColetaCreateNestedManyWithoutPesquisaInput
    respostas?: RespostaCreateNestedManyWithoutPesquisaInput
  }

  export type PesquisaUncheckedCreateWithoutEmpresaInput = {
    id?: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntas?: PerguntaUncheckedCreateNestedManyWithoutPesquisaInput
    pontosColeta?: PontoColetaUncheckedCreateNestedManyWithoutPesquisaInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutPesquisaInput
  }

  export type PesquisaCreateOrConnectWithoutEmpresaInput = {
    where: PesquisaWhereUniqueInput
    create: XOR<PesquisaCreateWithoutEmpresaInput, PesquisaUncheckedCreateWithoutEmpresaInput>
  }

  export type PesquisaCreateManyEmpresaInputEnvelope = {
    data: PesquisaCreateManyEmpresaInput | PesquisaCreateManyEmpresaInput[]
  }

  export type UsuarioUpsertWithWhereUniqueWithoutEmpresaInput = {
    where: UsuarioWhereUniqueInput
    update: XOR<UsuarioUpdateWithoutEmpresaInput, UsuarioUncheckedUpdateWithoutEmpresaInput>
    create: XOR<UsuarioCreateWithoutEmpresaInput, UsuarioUncheckedCreateWithoutEmpresaInput>
  }

  export type UsuarioUpdateWithWhereUniqueWithoutEmpresaInput = {
    where: UsuarioWhereUniqueInput
    data: XOR<UsuarioUpdateWithoutEmpresaInput, UsuarioUncheckedUpdateWithoutEmpresaInput>
  }

  export type UsuarioUpdateManyWithWhereWithoutEmpresaInput = {
    where: UsuarioScalarWhereInput
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyWithoutEmpresaInput>
  }

  export type UsuarioScalarWhereInput = {
    AND?: UsuarioScalarWhereInput | UsuarioScalarWhereInput[]
    OR?: UsuarioScalarWhereInput[]
    NOT?: UsuarioScalarWhereInput | UsuarioScalarWhereInput[]
    id?: StringFilter<"Usuario"> | string
    empresaId?: StringFilter<"Usuario"> | string
    nome?: StringFilter<"Usuario"> | string
    email?: StringFilter<"Usuario"> | string
    senhaHash?: StringFilter<"Usuario"> | string
    createdAt?: DateTimeFilter<"Usuario"> | Date | string
    updatedAt?: DateTimeFilter<"Usuario"> | Date | string
  }

  export type PesquisaUpsertWithWhereUniqueWithoutEmpresaInput = {
    where: PesquisaWhereUniqueInput
    update: XOR<PesquisaUpdateWithoutEmpresaInput, PesquisaUncheckedUpdateWithoutEmpresaInput>
    create: XOR<PesquisaCreateWithoutEmpresaInput, PesquisaUncheckedCreateWithoutEmpresaInput>
  }

  export type PesquisaUpdateWithWhereUniqueWithoutEmpresaInput = {
    where: PesquisaWhereUniqueInput
    data: XOR<PesquisaUpdateWithoutEmpresaInput, PesquisaUncheckedUpdateWithoutEmpresaInput>
  }

  export type PesquisaUpdateManyWithWhereWithoutEmpresaInput = {
    where: PesquisaScalarWhereInput
    data: XOR<PesquisaUpdateManyMutationInput, PesquisaUncheckedUpdateManyWithoutEmpresaInput>
  }

  export type PesquisaScalarWhereInput = {
    AND?: PesquisaScalarWhereInput | PesquisaScalarWhereInput[]
    OR?: PesquisaScalarWhereInput[]
    NOT?: PesquisaScalarWhereInput | PesquisaScalarWhereInput[]
    id?: StringFilter<"Pesquisa"> | string
    empresaId?: StringFilter<"Pesquisa"> | string
    titulo?: StringFilter<"Pesquisa"> | string
    descricao?: StringNullableFilter<"Pesquisa"> | string | null
    status?: EnumStatusPesquisaFilter<"Pesquisa"> | $Enums.StatusPesquisa
    slug?: StringFilter<"Pesquisa"> | string
    writeVersion?: IntFilter<"Pesquisa"> | number
    createdAt?: DateTimeFilter<"Pesquisa"> | Date | string
    updatedAt?: DateTimeFilter<"Pesquisa"> | Date | string
  }

  export type EmpresaCreateWithoutUsuariosInput = {
    id?: string
    nome: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    pesquisas?: PesquisaCreateNestedManyWithoutEmpresaInput
  }

  export type EmpresaUncheckedCreateWithoutUsuariosInput = {
    id?: string
    nome: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    pesquisas?: PesquisaUncheckedCreateNestedManyWithoutEmpresaInput
  }

  export type EmpresaCreateOrConnectWithoutUsuariosInput = {
    where: EmpresaWhereUniqueInput
    create: XOR<EmpresaCreateWithoutUsuariosInput, EmpresaUncheckedCreateWithoutUsuariosInput>
  }

  export type EmpresaUpsertWithoutUsuariosInput = {
    update: XOR<EmpresaUpdateWithoutUsuariosInput, EmpresaUncheckedUpdateWithoutUsuariosInput>
    create: XOR<EmpresaCreateWithoutUsuariosInput, EmpresaUncheckedCreateWithoutUsuariosInput>
    where?: EmpresaWhereInput
  }

  export type EmpresaUpdateToOneWithWhereWithoutUsuariosInput = {
    where?: EmpresaWhereInput
    data: XOR<EmpresaUpdateWithoutUsuariosInput, EmpresaUncheckedUpdateWithoutUsuariosInput>
  }

  export type EmpresaUpdateWithoutUsuariosInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pesquisas?: PesquisaUpdateManyWithoutEmpresaNestedInput
  }

  export type EmpresaUncheckedUpdateWithoutUsuariosInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pesquisas?: PesquisaUncheckedUpdateManyWithoutEmpresaNestedInput
  }

  export type EmpresaCreateWithoutPesquisasInput = {
    id?: string
    nome: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UsuarioCreateNestedManyWithoutEmpresaInput
  }

  export type EmpresaUncheckedCreateWithoutPesquisasInput = {
    id?: string
    nome: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    usuarios?: UsuarioUncheckedCreateNestedManyWithoutEmpresaInput
  }

  export type EmpresaCreateOrConnectWithoutPesquisasInput = {
    where: EmpresaWhereUniqueInput
    create: XOR<EmpresaCreateWithoutPesquisasInput, EmpresaUncheckedCreateWithoutPesquisasInput>
  }

  export type PerguntaCreateWithoutPesquisaInput = {
    id?: string
    texto: string
    tipo: $Enums.TipoPergunta
    obrigatoria?: boolean
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    opcoes?: OpcaoPerguntaCreateNestedManyWithoutPerguntaInput
    respostas?: RespostaPerguntaCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaUncheckedCreateWithoutPesquisaInput = {
    id?: string
    texto: string
    tipo: $Enums.TipoPergunta
    obrigatoria?: boolean
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    opcoes?: OpcaoPerguntaUncheckedCreateNestedManyWithoutPerguntaInput
    respostas?: RespostaPerguntaUncheckedCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaCreateOrConnectWithoutPesquisaInput = {
    where: PerguntaWhereUniqueInput
    create: XOR<PerguntaCreateWithoutPesquisaInput, PerguntaUncheckedCreateWithoutPesquisaInput>
  }

  export type PerguntaCreateManyPesquisaInputEnvelope = {
    data: PerguntaCreateManyPesquisaInput | PerguntaCreateManyPesquisaInput[]
  }

  export type PontoColetaCreateWithoutPesquisaInput = {
    id?: string
    token?: string
    nome: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaCreateNestedManyWithoutPontoColetaInput
  }

  export type PontoColetaUncheckedCreateWithoutPesquisaInput = {
    id?: string
    token?: string
    nome: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaUncheckedCreateNestedManyWithoutPontoColetaInput
  }

  export type PontoColetaCreateOrConnectWithoutPesquisaInput = {
    where: PontoColetaWhereUniqueInput
    create: XOR<PontoColetaCreateWithoutPesquisaInput, PontoColetaUncheckedCreateWithoutPesquisaInput>
  }

  export type PontoColetaCreateManyPesquisaInputEnvelope = {
    data: PontoColetaCreateManyPesquisaInput | PontoColetaCreateManyPesquisaInput[]
  }

  export type RespostaCreateWithoutPesquisaInput = {
    id?: string
    idempotencyKey?: string | null
    submissionHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pontoColeta?: PontoColetaCreateNestedOneWithoutRespostasInput
    perguntas?: RespostaPerguntaCreateNestedManyWithoutRespostaInput
  }

  export type RespostaUncheckedCreateWithoutPesquisaInput = {
    id?: string
    pontoColetaId?: string | null
    idempotencyKey?: string | null
    submissionHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntas?: RespostaPerguntaUncheckedCreateNestedManyWithoutRespostaInput
  }

  export type RespostaCreateOrConnectWithoutPesquisaInput = {
    where: RespostaWhereUniqueInput
    create: XOR<RespostaCreateWithoutPesquisaInput, RespostaUncheckedCreateWithoutPesquisaInput>
  }

  export type RespostaCreateManyPesquisaInputEnvelope = {
    data: RespostaCreateManyPesquisaInput | RespostaCreateManyPesquisaInput[]
  }

  export type EmpresaUpsertWithoutPesquisasInput = {
    update: XOR<EmpresaUpdateWithoutPesquisasInput, EmpresaUncheckedUpdateWithoutPesquisasInput>
    create: XOR<EmpresaCreateWithoutPesquisasInput, EmpresaUncheckedCreateWithoutPesquisasInput>
    where?: EmpresaWhereInput
  }

  export type EmpresaUpdateToOneWithWhereWithoutPesquisasInput = {
    where?: EmpresaWhereInput
    data: XOR<EmpresaUpdateWithoutPesquisasInput, EmpresaUncheckedUpdateWithoutPesquisasInput>
  }

  export type EmpresaUpdateWithoutPesquisasInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioUpdateManyWithoutEmpresaNestedInput
  }

  export type EmpresaUncheckedUpdateWithoutPesquisasInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: UsuarioUncheckedUpdateManyWithoutEmpresaNestedInput
  }

  export type PerguntaUpsertWithWhereUniqueWithoutPesquisaInput = {
    where: PerguntaWhereUniqueInput
    update: XOR<PerguntaUpdateWithoutPesquisaInput, PerguntaUncheckedUpdateWithoutPesquisaInput>
    create: XOR<PerguntaCreateWithoutPesquisaInput, PerguntaUncheckedCreateWithoutPesquisaInput>
  }

  export type PerguntaUpdateWithWhereUniqueWithoutPesquisaInput = {
    where: PerguntaWhereUniqueInput
    data: XOR<PerguntaUpdateWithoutPesquisaInput, PerguntaUncheckedUpdateWithoutPesquisaInput>
  }

  export type PerguntaUpdateManyWithWhereWithoutPesquisaInput = {
    where: PerguntaScalarWhereInput
    data: XOR<PerguntaUpdateManyMutationInput, PerguntaUncheckedUpdateManyWithoutPesquisaInput>
  }

  export type PerguntaScalarWhereInput = {
    AND?: PerguntaScalarWhereInput | PerguntaScalarWhereInput[]
    OR?: PerguntaScalarWhereInput[]
    NOT?: PerguntaScalarWhereInput | PerguntaScalarWhereInput[]
    id?: StringFilter<"Pergunta"> | string
    pesquisaId?: StringFilter<"Pergunta"> | string
    texto?: StringFilter<"Pergunta"> | string
    tipo?: EnumTipoPerguntaFilter<"Pergunta"> | $Enums.TipoPergunta
    obrigatoria?: BoolFilter<"Pergunta"> | boolean
    ordem?: IntFilter<"Pergunta"> | number
    createdAt?: DateTimeFilter<"Pergunta"> | Date | string
    updatedAt?: DateTimeFilter<"Pergunta"> | Date | string
  }

  export type PontoColetaUpsertWithWhereUniqueWithoutPesquisaInput = {
    where: PontoColetaWhereUniqueInput
    update: XOR<PontoColetaUpdateWithoutPesquisaInput, PontoColetaUncheckedUpdateWithoutPesquisaInput>
    create: XOR<PontoColetaCreateWithoutPesquisaInput, PontoColetaUncheckedCreateWithoutPesquisaInput>
  }

  export type PontoColetaUpdateWithWhereUniqueWithoutPesquisaInput = {
    where: PontoColetaWhereUniqueInput
    data: XOR<PontoColetaUpdateWithoutPesquisaInput, PontoColetaUncheckedUpdateWithoutPesquisaInput>
  }

  export type PontoColetaUpdateManyWithWhereWithoutPesquisaInput = {
    where: PontoColetaScalarWhereInput
    data: XOR<PontoColetaUpdateManyMutationInput, PontoColetaUncheckedUpdateManyWithoutPesquisaInput>
  }

  export type PontoColetaScalarWhereInput = {
    AND?: PontoColetaScalarWhereInput | PontoColetaScalarWhereInput[]
    OR?: PontoColetaScalarWhereInput[]
    NOT?: PontoColetaScalarWhereInput | PontoColetaScalarWhereInput[]
    id?: StringFilter<"PontoColeta"> | string
    token?: StringFilter<"PontoColeta"> | string
    pesquisaId?: StringFilter<"PontoColeta"> | string
    nome?: StringFilter<"PontoColeta"> | string
    ativo?: BoolFilter<"PontoColeta"> | boolean
    createdAt?: DateTimeFilter<"PontoColeta"> | Date | string
    updatedAt?: DateTimeFilter<"PontoColeta"> | Date | string
  }

  export type RespostaUpsertWithWhereUniqueWithoutPesquisaInput = {
    where: RespostaWhereUniqueInput
    update: XOR<RespostaUpdateWithoutPesquisaInput, RespostaUncheckedUpdateWithoutPesquisaInput>
    create: XOR<RespostaCreateWithoutPesquisaInput, RespostaUncheckedCreateWithoutPesquisaInput>
  }

  export type RespostaUpdateWithWhereUniqueWithoutPesquisaInput = {
    where: RespostaWhereUniqueInput
    data: XOR<RespostaUpdateWithoutPesquisaInput, RespostaUncheckedUpdateWithoutPesquisaInput>
  }

  export type RespostaUpdateManyWithWhereWithoutPesquisaInput = {
    where: RespostaScalarWhereInput
    data: XOR<RespostaUpdateManyMutationInput, RespostaUncheckedUpdateManyWithoutPesquisaInput>
  }

  export type RespostaScalarWhereInput = {
    AND?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
    OR?: RespostaScalarWhereInput[]
    NOT?: RespostaScalarWhereInput | RespostaScalarWhereInput[]
    id?: StringFilter<"Resposta"> | string
    pesquisaId?: StringFilter<"Resposta"> | string
    pontoColetaId?: StringNullableFilter<"Resposta"> | string | null
    idempotencyKey?: StringNullableFilter<"Resposta"> | string | null
    submissionHash?: StringNullableFilter<"Resposta"> | string | null
    createdAt?: DateTimeFilter<"Resposta"> | Date | string
    updatedAt?: DateTimeFilter<"Resposta"> | Date | string
  }

  export type PesquisaCreateWithoutPerguntasInput = {
    id?: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    empresa: EmpresaCreateNestedOneWithoutPesquisasInput
    pontosColeta?: PontoColetaCreateNestedManyWithoutPesquisaInput
    respostas?: RespostaCreateNestedManyWithoutPesquisaInput
  }

  export type PesquisaUncheckedCreateWithoutPerguntasInput = {
    id?: string
    empresaId: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pontosColeta?: PontoColetaUncheckedCreateNestedManyWithoutPesquisaInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutPesquisaInput
  }

  export type PesquisaCreateOrConnectWithoutPerguntasInput = {
    where: PesquisaWhereUniqueInput
    create: XOR<PesquisaCreateWithoutPerguntasInput, PesquisaUncheckedCreateWithoutPerguntasInput>
  }

  export type OpcaoPerguntaCreateWithoutPerguntaInput = {
    id?: string
    texto: string
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaPerguntaCreateNestedManyWithoutOpcaoPerguntaInput
  }

  export type OpcaoPerguntaUncheckedCreateWithoutPerguntaInput = {
    id?: string
    texto: string
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaPerguntaUncheckedCreateNestedManyWithoutOpcaoPerguntaInput
  }

  export type OpcaoPerguntaCreateOrConnectWithoutPerguntaInput = {
    where: OpcaoPerguntaWhereUniqueInput
    create: XOR<OpcaoPerguntaCreateWithoutPerguntaInput, OpcaoPerguntaUncheckedCreateWithoutPerguntaInput>
  }

  export type OpcaoPerguntaCreateManyPerguntaInputEnvelope = {
    data: OpcaoPerguntaCreateManyPerguntaInput | OpcaoPerguntaCreateManyPerguntaInput[]
  }

  export type RespostaPerguntaCreateWithoutPerguntaInput = {
    id?: string
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resposta: RespostaCreateNestedOneWithoutPerguntasInput
    opcaoPergunta?: OpcaoPerguntaCreateNestedOneWithoutRespostasInput
  }

  export type RespostaPerguntaUncheckedCreateWithoutPerguntaInput = {
    id?: string
    respostaId: string
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    opcaoPerguntaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaPerguntaCreateOrConnectWithoutPerguntaInput = {
    where: RespostaPerguntaWhereUniqueInput
    create: XOR<RespostaPerguntaCreateWithoutPerguntaInput, RespostaPerguntaUncheckedCreateWithoutPerguntaInput>
  }

  export type RespostaPerguntaCreateManyPerguntaInputEnvelope = {
    data: RespostaPerguntaCreateManyPerguntaInput | RespostaPerguntaCreateManyPerguntaInput[]
  }

  export type PesquisaUpsertWithoutPerguntasInput = {
    update: XOR<PesquisaUpdateWithoutPerguntasInput, PesquisaUncheckedUpdateWithoutPerguntasInput>
    create: XOR<PesquisaCreateWithoutPerguntasInput, PesquisaUncheckedCreateWithoutPerguntasInput>
    where?: PesquisaWhereInput
  }

  export type PesquisaUpdateToOneWithWhereWithoutPerguntasInput = {
    where?: PesquisaWhereInput
    data: XOR<PesquisaUpdateWithoutPerguntasInput, PesquisaUncheckedUpdateWithoutPerguntasInput>
  }

  export type PesquisaUpdateWithoutPerguntasInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    empresa?: EmpresaUpdateOneRequiredWithoutPesquisasNestedInput
    pontosColeta?: PontoColetaUpdateManyWithoutPesquisaNestedInput
    respostas?: RespostaUpdateManyWithoutPesquisaNestedInput
  }

  export type PesquisaUncheckedUpdateWithoutPerguntasInput = {
    empresaId?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pontosColeta?: PontoColetaUncheckedUpdateManyWithoutPesquisaNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutPesquisaNestedInput
  }

  export type OpcaoPerguntaUpsertWithWhereUniqueWithoutPerguntaInput = {
    where: OpcaoPerguntaWhereUniqueInput
    update: XOR<OpcaoPerguntaUpdateWithoutPerguntaInput, OpcaoPerguntaUncheckedUpdateWithoutPerguntaInput>
    create: XOR<OpcaoPerguntaCreateWithoutPerguntaInput, OpcaoPerguntaUncheckedCreateWithoutPerguntaInput>
  }

  export type OpcaoPerguntaUpdateWithWhereUniqueWithoutPerguntaInput = {
    where: OpcaoPerguntaWhereUniqueInput
    data: XOR<OpcaoPerguntaUpdateWithoutPerguntaInput, OpcaoPerguntaUncheckedUpdateWithoutPerguntaInput>
  }

  export type OpcaoPerguntaUpdateManyWithWhereWithoutPerguntaInput = {
    where: OpcaoPerguntaScalarWhereInput
    data: XOR<OpcaoPerguntaUpdateManyMutationInput, OpcaoPerguntaUncheckedUpdateManyWithoutPerguntaInput>
  }

  export type OpcaoPerguntaScalarWhereInput = {
    AND?: OpcaoPerguntaScalarWhereInput | OpcaoPerguntaScalarWhereInput[]
    OR?: OpcaoPerguntaScalarWhereInput[]
    NOT?: OpcaoPerguntaScalarWhereInput | OpcaoPerguntaScalarWhereInput[]
    id?: StringFilter<"OpcaoPergunta"> | string
    perguntaId?: StringFilter<"OpcaoPergunta"> | string
    texto?: StringFilter<"OpcaoPergunta"> | string
    ordem?: IntFilter<"OpcaoPergunta"> | number
    createdAt?: DateTimeFilter<"OpcaoPergunta"> | Date | string
    updatedAt?: DateTimeFilter<"OpcaoPergunta"> | Date | string
  }

  export type RespostaPerguntaUpsertWithWhereUniqueWithoutPerguntaInput = {
    where: RespostaPerguntaWhereUniqueInput
    update: XOR<RespostaPerguntaUpdateWithoutPerguntaInput, RespostaPerguntaUncheckedUpdateWithoutPerguntaInput>
    create: XOR<RespostaPerguntaCreateWithoutPerguntaInput, RespostaPerguntaUncheckedCreateWithoutPerguntaInput>
  }

  export type RespostaPerguntaUpdateWithWhereUniqueWithoutPerguntaInput = {
    where: RespostaPerguntaWhereUniqueInput
    data: XOR<RespostaPerguntaUpdateWithoutPerguntaInput, RespostaPerguntaUncheckedUpdateWithoutPerguntaInput>
  }

  export type RespostaPerguntaUpdateManyWithWhereWithoutPerguntaInput = {
    where: RespostaPerguntaScalarWhereInput
    data: XOR<RespostaPerguntaUpdateManyMutationInput, RespostaPerguntaUncheckedUpdateManyWithoutPerguntaInput>
  }

  export type RespostaPerguntaScalarWhereInput = {
    AND?: RespostaPerguntaScalarWhereInput | RespostaPerguntaScalarWhereInput[]
    OR?: RespostaPerguntaScalarWhereInput[]
    NOT?: RespostaPerguntaScalarWhereInput | RespostaPerguntaScalarWhereInput[]
    id?: StringFilter<"RespostaPergunta"> | string
    respostaId?: StringFilter<"RespostaPergunta"> | string
    pesquisaId?: StringFilter<"RespostaPergunta"> | string
    perguntaId?: StringFilter<"RespostaPergunta"> | string
    tipo?: EnumTipoPerguntaFilter<"RespostaPergunta"> | $Enums.TipoPergunta
    valorEstrelas?: IntNullableFilter<"RespostaPergunta"> | number | null
    valorNps?: IntNullableFilter<"RespostaPergunta"> | number | null
    valorSimNao?: BoolNullableFilter<"RespostaPergunta"> | boolean | null
    valorTexto?: StringNullableFilter<"RespostaPergunta"> | string | null
    opcaoPerguntaId?: StringNullableFilter<"RespostaPergunta"> | string | null
    createdAt?: DateTimeFilter<"RespostaPergunta"> | Date | string
    updatedAt?: DateTimeFilter<"RespostaPergunta"> | Date | string
  }

  export type PerguntaCreateWithoutOpcoesInput = {
    id?: string
    texto: string
    tipo: $Enums.TipoPergunta
    obrigatoria?: boolean
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pesquisa: PesquisaCreateNestedOneWithoutPerguntasInput
    respostas?: RespostaPerguntaCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaUncheckedCreateWithoutOpcoesInput = {
    id?: string
    pesquisaId: string
    texto: string
    tipo: $Enums.TipoPergunta
    obrigatoria?: boolean
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    respostas?: RespostaPerguntaUncheckedCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaCreateOrConnectWithoutOpcoesInput = {
    where: PerguntaWhereUniqueInput
    create: XOR<PerguntaCreateWithoutOpcoesInput, PerguntaUncheckedCreateWithoutOpcoesInput>
  }

  export type RespostaPerguntaCreateWithoutOpcaoPerguntaInput = {
    id?: string
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resposta: RespostaCreateNestedOneWithoutPerguntasInput
    pergunta: PerguntaCreateNestedOneWithoutRespostasInput
  }

  export type RespostaPerguntaUncheckedCreateWithoutOpcaoPerguntaInput = {
    id?: string
    respostaId: string
    pesquisaId: string
    tipo: $Enums.TipoPergunta
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaPerguntaCreateOrConnectWithoutOpcaoPerguntaInput = {
    where: RespostaPerguntaWhereUniqueInput
    create: XOR<RespostaPerguntaCreateWithoutOpcaoPerguntaInput, RespostaPerguntaUncheckedCreateWithoutOpcaoPerguntaInput>
  }

  export type RespostaPerguntaCreateManyOpcaoPerguntaInputEnvelope = {
    data: RespostaPerguntaCreateManyOpcaoPerguntaInput | RespostaPerguntaCreateManyOpcaoPerguntaInput[]
  }

  export type PerguntaUpsertWithoutOpcoesInput = {
    update: XOR<PerguntaUpdateWithoutOpcoesInput, PerguntaUncheckedUpdateWithoutOpcoesInput>
    create: XOR<PerguntaCreateWithoutOpcoesInput, PerguntaUncheckedCreateWithoutOpcoesInput>
    where?: PerguntaWhereInput
  }

  export type PerguntaUpdateToOneWithWhereWithoutOpcoesInput = {
    where?: PerguntaWhereInput
    data: XOR<PerguntaUpdateWithoutOpcoesInput, PerguntaUncheckedUpdateWithoutOpcoesInput>
  }

  export type PerguntaUpdateWithoutOpcoesInput = {
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pesquisa?: PesquisaUpdateOneRequiredWithoutPerguntasNestedInput
    respostas?: RespostaPerguntaUpdateManyWithoutPerguntaNestedInput
  }

  export type PerguntaUncheckedUpdateWithoutOpcoesInput = {
    pesquisaId?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaPerguntaUncheckedUpdateManyWithoutPerguntaNestedInput
  }

  export type RespostaPerguntaUpsertWithWhereUniqueWithoutOpcaoPerguntaInput = {
    where: RespostaPerguntaWhereUniqueInput
    update: XOR<RespostaPerguntaUpdateWithoutOpcaoPerguntaInput, RespostaPerguntaUncheckedUpdateWithoutOpcaoPerguntaInput>
    create: XOR<RespostaPerguntaCreateWithoutOpcaoPerguntaInput, RespostaPerguntaUncheckedCreateWithoutOpcaoPerguntaInput>
  }

  export type RespostaPerguntaUpdateWithWhereUniqueWithoutOpcaoPerguntaInput = {
    where: RespostaPerguntaWhereUniqueInput
    data: XOR<RespostaPerguntaUpdateWithoutOpcaoPerguntaInput, RespostaPerguntaUncheckedUpdateWithoutOpcaoPerguntaInput>
  }

  export type RespostaPerguntaUpdateManyWithWhereWithoutOpcaoPerguntaInput = {
    where: RespostaPerguntaScalarWhereInput
    data: XOR<RespostaPerguntaUpdateManyMutationInput, RespostaPerguntaUncheckedUpdateManyWithoutOpcaoPerguntaInput>
  }

  export type PesquisaCreateWithoutPontosColetaInput = {
    id?: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    empresa: EmpresaCreateNestedOneWithoutPesquisasInput
    perguntas?: PerguntaCreateNestedManyWithoutPesquisaInput
    respostas?: RespostaCreateNestedManyWithoutPesquisaInput
  }

  export type PesquisaUncheckedCreateWithoutPontosColetaInput = {
    id?: string
    empresaId: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntas?: PerguntaUncheckedCreateNestedManyWithoutPesquisaInput
    respostas?: RespostaUncheckedCreateNestedManyWithoutPesquisaInput
  }

  export type PesquisaCreateOrConnectWithoutPontosColetaInput = {
    where: PesquisaWhereUniqueInput
    create: XOR<PesquisaCreateWithoutPontosColetaInput, PesquisaUncheckedCreateWithoutPontosColetaInput>
  }

  export type RespostaCreateWithoutPontoColetaInput = {
    id?: string
    idempotencyKey?: string | null
    submissionHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pesquisa: PesquisaCreateNestedOneWithoutRespostasInput
    perguntas?: RespostaPerguntaCreateNestedManyWithoutRespostaInput
  }

  export type RespostaUncheckedCreateWithoutPontoColetaInput = {
    id?: string
    idempotencyKey?: string | null
    submissionHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntas?: RespostaPerguntaUncheckedCreateNestedManyWithoutRespostaInput
  }

  export type RespostaCreateOrConnectWithoutPontoColetaInput = {
    where: RespostaWhereUniqueInput
    create: XOR<RespostaCreateWithoutPontoColetaInput, RespostaUncheckedCreateWithoutPontoColetaInput>
  }

  export type RespostaCreateManyPontoColetaInputEnvelope = {
    data: RespostaCreateManyPontoColetaInput | RespostaCreateManyPontoColetaInput[]
  }

  export type PesquisaUpsertWithoutPontosColetaInput = {
    update: XOR<PesquisaUpdateWithoutPontosColetaInput, PesquisaUncheckedUpdateWithoutPontosColetaInput>
    create: XOR<PesquisaCreateWithoutPontosColetaInput, PesquisaUncheckedCreateWithoutPontosColetaInput>
    where?: PesquisaWhereInput
  }

  export type PesquisaUpdateToOneWithWhereWithoutPontosColetaInput = {
    where?: PesquisaWhereInput
    data: XOR<PesquisaUpdateWithoutPontosColetaInput, PesquisaUncheckedUpdateWithoutPontosColetaInput>
  }

  export type PesquisaUpdateWithoutPontosColetaInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    empresa?: EmpresaUpdateOneRequiredWithoutPesquisasNestedInput
    perguntas?: PerguntaUpdateManyWithoutPesquisaNestedInput
    respostas?: RespostaUpdateManyWithoutPesquisaNestedInput
  }

  export type PesquisaUncheckedUpdateWithoutPontosColetaInput = {
    empresaId?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntas?: PerguntaUncheckedUpdateManyWithoutPesquisaNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutPesquisaNestedInput
  }

  export type RespostaUpsertWithWhereUniqueWithoutPontoColetaInput = {
    where: RespostaWhereUniqueInput
    update: XOR<RespostaUpdateWithoutPontoColetaInput, RespostaUncheckedUpdateWithoutPontoColetaInput>
    create: XOR<RespostaCreateWithoutPontoColetaInput, RespostaUncheckedCreateWithoutPontoColetaInput>
  }

  export type RespostaUpdateWithWhereUniqueWithoutPontoColetaInput = {
    where: RespostaWhereUniqueInput
    data: XOR<RespostaUpdateWithoutPontoColetaInput, RespostaUncheckedUpdateWithoutPontoColetaInput>
  }

  export type RespostaUpdateManyWithWhereWithoutPontoColetaInput = {
    where: RespostaScalarWhereInput
    data: XOR<RespostaUpdateManyMutationInput, RespostaUncheckedUpdateManyWithoutPontoColetaInput>
  }

  export type PesquisaCreateWithoutRespostasInput = {
    id?: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    empresa: EmpresaCreateNestedOneWithoutPesquisasInput
    perguntas?: PerguntaCreateNestedManyWithoutPesquisaInput
    pontosColeta?: PontoColetaCreateNestedManyWithoutPesquisaInput
  }

  export type PesquisaUncheckedCreateWithoutRespostasInput = {
    id?: string
    empresaId: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    perguntas?: PerguntaUncheckedCreateNestedManyWithoutPesquisaInput
    pontosColeta?: PontoColetaUncheckedCreateNestedManyWithoutPesquisaInput
  }

  export type PesquisaCreateOrConnectWithoutRespostasInput = {
    where: PesquisaWhereUniqueInput
    create: XOR<PesquisaCreateWithoutRespostasInput, PesquisaUncheckedCreateWithoutRespostasInput>
  }

  export type PontoColetaCreateWithoutRespostasInput = {
    id?: string
    token?: string
    nome: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    pesquisa: PesquisaCreateNestedOneWithoutPontosColetaInput
  }

  export type PontoColetaUncheckedCreateWithoutRespostasInput = {
    id?: string
    token?: string
    pesquisaId: string
    nome: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PontoColetaCreateOrConnectWithoutRespostasInput = {
    where: PontoColetaWhereUniqueInput
    create: XOR<PontoColetaCreateWithoutRespostasInput, PontoColetaUncheckedCreateWithoutRespostasInput>
  }

  export type RespostaPerguntaCreateWithoutRespostaInput = {
    id?: string
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pergunta: PerguntaCreateNestedOneWithoutRespostasInput
    opcaoPergunta?: OpcaoPerguntaCreateNestedOneWithoutRespostasInput
  }

  export type RespostaPerguntaUncheckedCreateWithoutRespostaInput = {
    id?: string
    perguntaId: string
    tipo: $Enums.TipoPergunta
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    opcaoPerguntaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaPerguntaCreateOrConnectWithoutRespostaInput = {
    where: RespostaPerguntaWhereUniqueInput
    create: XOR<RespostaPerguntaCreateWithoutRespostaInput, RespostaPerguntaUncheckedCreateWithoutRespostaInput>
  }

  export type RespostaPerguntaCreateManyRespostaInputEnvelope = {
    data: RespostaPerguntaCreateManyRespostaInput | RespostaPerguntaCreateManyRespostaInput[]
  }

  export type PesquisaUpsertWithoutRespostasInput = {
    update: XOR<PesquisaUpdateWithoutRespostasInput, PesquisaUncheckedUpdateWithoutRespostasInput>
    create: XOR<PesquisaCreateWithoutRespostasInput, PesquisaUncheckedCreateWithoutRespostasInput>
    where?: PesquisaWhereInput
  }

  export type PesquisaUpdateToOneWithWhereWithoutRespostasInput = {
    where?: PesquisaWhereInput
    data: XOR<PesquisaUpdateWithoutRespostasInput, PesquisaUncheckedUpdateWithoutRespostasInput>
  }

  export type PesquisaUpdateWithoutRespostasInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    empresa?: EmpresaUpdateOneRequiredWithoutPesquisasNestedInput
    perguntas?: PerguntaUpdateManyWithoutPesquisaNestedInput
    pontosColeta?: PontoColetaUpdateManyWithoutPesquisaNestedInput
  }

  export type PesquisaUncheckedUpdateWithoutRespostasInput = {
    empresaId?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntas?: PerguntaUncheckedUpdateManyWithoutPesquisaNestedInput
    pontosColeta?: PontoColetaUncheckedUpdateManyWithoutPesquisaNestedInput
  }

  export type PontoColetaUpsertWithoutRespostasInput = {
    update: XOR<PontoColetaUpdateWithoutRespostasInput, PontoColetaUncheckedUpdateWithoutRespostasInput>
    create: XOR<PontoColetaCreateWithoutRespostasInput, PontoColetaUncheckedCreateWithoutRespostasInput>
    where?: PontoColetaWhereInput
  }

  export type PontoColetaUpdateToOneWithWhereWithoutRespostasInput = {
    where?: PontoColetaWhereInput
    data: XOR<PontoColetaUpdateWithoutRespostasInput, PontoColetaUncheckedUpdateWithoutRespostasInput>
  }

  export type PontoColetaUpdateWithoutRespostasInput = {
    token?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pesquisa?: PesquisaUpdateOneRequiredWithoutPontosColetaNestedInput
  }

  export type PontoColetaUncheckedUpdateWithoutRespostasInput = {
    token?: StringFieldUpdateOperationsInput | string
    pesquisaId?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaPerguntaUpsertWithWhereUniqueWithoutRespostaInput = {
    where: RespostaPerguntaWhereUniqueInput
    update: XOR<RespostaPerguntaUpdateWithoutRespostaInput, RespostaPerguntaUncheckedUpdateWithoutRespostaInput>
    create: XOR<RespostaPerguntaCreateWithoutRespostaInput, RespostaPerguntaUncheckedCreateWithoutRespostaInput>
  }

  export type RespostaPerguntaUpdateWithWhereUniqueWithoutRespostaInput = {
    where: RespostaPerguntaWhereUniqueInput
    data: XOR<RespostaPerguntaUpdateWithoutRespostaInput, RespostaPerguntaUncheckedUpdateWithoutRespostaInput>
  }

  export type RespostaPerguntaUpdateManyWithWhereWithoutRespostaInput = {
    where: RespostaPerguntaScalarWhereInput
    data: XOR<RespostaPerguntaUpdateManyMutationInput, RespostaPerguntaUncheckedUpdateManyWithoutRespostaInput>
  }

  export type RespostaCreateWithoutPerguntasInput = {
    id?: string
    idempotencyKey?: string | null
    submissionHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pesquisa: PesquisaCreateNestedOneWithoutRespostasInput
    pontoColeta?: PontoColetaCreateNestedOneWithoutRespostasInput
  }

  export type RespostaUncheckedCreateWithoutPerguntasInput = {
    id?: string
    pesquisaId: string
    pontoColetaId?: string | null
    idempotencyKey?: string | null
    submissionHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaCreateOrConnectWithoutPerguntasInput = {
    where: RespostaWhereUniqueInput
    create: XOR<RespostaCreateWithoutPerguntasInput, RespostaUncheckedCreateWithoutPerguntasInput>
  }

  export type PerguntaCreateWithoutRespostasInput = {
    id?: string
    texto: string
    tipo: $Enums.TipoPergunta
    obrigatoria?: boolean
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pesquisa: PesquisaCreateNestedOneWithoutPerguntasInput
    opcoes?: OpcaoPerguntaCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaUncheckedCreateWithoutRespostasInput = {
    id?: string
    pesquisaId: string
    texto: string
    tipo: $Enums.TipoPergunta
    obrigatoria?: boolean
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    opcoes?: OpcaoPerguntaUncheckedCreateNestedManyWithoutPerguntaInput
  }

  export type PerguntaCreateOrConnectWithoutRespostasInput = {
    where: PerguntaWhereUniqueInput
    create: XOR<PerguntaCreateWithoutRespostasInput, PerguntaUncheckedCreateWithoutRespostasInput>
  }

  export type OpcaoPerguntaCreateWithoutRespostasInput = {
    id?: string
    texto: string
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
    pergunta: PerguntaCreateNestedOneWithoutOpcoesInput
  }

  export type OpcaoPerguntaUncheckedCreateWithoutRespostasInput = {
    id?: string
    perguntaId: string
    texto: string
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OpcaoPerguntaCreateOrConnectWithoutRespostasInput = {
    where: OpcaoPerguntaWhereUniqueInput
    create: XOR<OpcaoPerguntaCreateWithoutRespostasInput, OpcaoPerguntaUncheckedCreateWithoutRespostasInput>
  }

  export type RespostaUpsertWithoutPerguntasInput = {
    update: XOR<RespostaUpdateWithoutPerguntasInput, RespostaUncheckedUpdateWithoutPerguntasInput>
    create: XOR<RespostaCreateWithoutPerguntasInput, RespostaUncheckedCreateWithoutPerguntasInput>
    where?: RespostaWhereInput
  }

  export type RespostaUpdateToOneWithWhereWithoutPerguntasInput = {
    where?: RespostaWhereInput
    data: XOR<RespostaUpdateWithoutPerguntasInput, RespostaUncheckedUpdateWithoutPerguntasInput>
  }

  export type RespostaUpdateWithoutPerguntasInput = {
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pesquisa?: PesquisaUpdateOneRequiredWithoutRespostasNestedInput
    pontoColeta?: PontoColetaUpdateOneWithoutRespostasNestedInput
  }

  export type RespostaUncheckedUpdateWithoutPerguntasInput = {
    pesquisaId?: StringFieldUpdateOperationsInput | string
    pontoColetaId?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerguntaUpsertWithoutRespostasInput = {
    update: XOR<PerguntaUpdateWithoutRespostasInput, PerguntaUncheckedUpdateWithoutRespostasInput>
    create: XOR<PerguntaCreateWithoutRespostasInput, PerguntaUncheckedCreateWithoutRespostasInput>
    where?: PerguntaWhereInput
  }

  export type PerguntaUpdateToOneWithWhereWithoutRespostasInput = {
    where?: PerguntaWhereInput
    data: XOR<PerguntaUpdateWithoutRespostasInput, PerguntaUncheckedUpdateWithoutRespostasInput>
  }

  export type PerguntaUpdateWithoutRespostasInput = {
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pesquisa?: PesquisaUpdateOneRequiredWithoutPerguntasNestedInput
    opcoes?: OpcaoPerguntaUpdateManyWithoutPerguntaNestedInput
  }

  export type PerguntaUncheckedUpdateWithoutRespostasInput = {
    pesquisaId?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    opcoes?: OpcaoPerguntaUncheckedUpdateManyWithoutPerguntaNestedInput
  }

  export type OpcaoPerguntaUpsertWithoutRespostasInput = {
    update: XOR<OpcaoPerguntaUpdateWithoutRespostasInput, OpcaoPerguntaUncheckedUpdateWithoutRespostasInput>
    create: XOR<OpcaoPerguntaCreateWithoutRespostasInput, OpcaoPerguntaUncheckedCreateWithoutRespostasInput>
    where?: OpcaoPerguntaWhereInput
  }

  export type OpcaoPerguntaUpdateToOneWithWhereWithoutRespostasInput = {
    where?: OpcaoPerguntaWhereInput
    data: XOR<OpcaoPerguntaUpdateWithoutRespostasInput, OpcaoPerguntaUncheckedUpdateWithoutRespostasInput>
  }

  export type OpcaoPerguntaUpdateWithoutRespostasInput = {
    texto?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pergunta?: PerguntaUpdateOneRequiredWithoutOpcoesNestedInput
  }

  export type OpcaoPerguntaUncheckedUpdateWithoutRespostasInput = {
    perguntaId?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioCreateManyEmpresaInput = {
    id?: string
    nome: string
    email: string
    senhaHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PesquisaCreateManyEmpresaInput = {
    id?: string
    titulo: string
    descricao?: string | null
    status?: $Enums.StatusPesquisa
    slug: string
    writeVersion?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsuarioUpdateWithoutEmpresaInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateWithoutEmpresaInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateManyWithoutEmpresaInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PesquisaUpdateWithoutEmpresaInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntas?: PerguntaUpdateManyWithoutPesquisaNestedInput
    pontosColeta?: PontoColetaUpdateManyWithoutPesquisaNestedInput
    respostas?: RespostaUpdateManyWithoutPesquisaNestedInput
  }

  export type PesquisaUncheckedUpdateWithoutEmpresaInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntas?: PerguntaUncheckedUpdateManyWithoutPesquisaNestedInput
    pontosColeta?: PontoColetaUncheckedUpdateManyWithoutPesquisaNestedInput
    respostas?: RespostaUncheckedUpdateManyWithoutPesquisaNestedInput
  }

  export type PesquisaUncheckedUpdateManyWithoutEmpresaInput = {
    titulo?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusPesquisaFieldUpdateOperationsInput | $Enums.StatusPesquisa
    slug?: StringFieldUpdateOperationsInput | string
    writeVersion?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PerguntaCreateManyPesquisaInput = {
    id?: string
    texto: string
    tipo: $Enums.TipoPergunta
    obrigatoria?: boolean
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PontoColetaCreateManyPesquisaInput = {
    id?: string
    token?: string
    nome: string
    ativo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaCreateManyPesquisaInput = {
    id?: string
    pontoColetaId?: string | null
    idempotencyKey?: string | null
    submissionHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PerguntaUpdateWithoutPesquisaInput = {
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    opcoes?: OpcaoPerguntaUpdateManyWithoutPerguntaNestedInput
    respostas?: RespostaPerguntaUpdateManyWithoutPerguntaNestedInput
  }

  export type PerguntaUncheckedUpdateWithoutPesquisaInput = {
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    opcoes?: OpcaoPerguntaUncheckedUpdateManyWithoutPerguntaNestedInput
    respostas?: RespostaPerguntaUncheckedUpdateManyWithoutPerguntaNestedInput
  }

  export type PerguntaUncheckedUpdateManyWithoutPesquisaInput = {
    texto?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    obrigatoria?: BoolFieldUpdateOperationsInput | boolean
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PontoColetaUpdateWithoutPesquisaInput = {
    token?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaUpdateManyWithoutPontoColetaNestedInput
  }

  export type PontoColetaUncheckedUpdateWithoutPesquisaInput = {
    token?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaUncheckedUpdateManyWithoutPontoColetaNestedInput
  }

  export type PontoColetaUncheckedUpdateManyWithoutPesquisaInput = {
    token?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaUpdateWithoutPesquisaInput = {
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pontoColeta?: PontoColetaUpdateOneWithoutRespostasNestedInput
    perguntas?: RespostaPerguntaUpdateManyWithoutRespostaNestedInput
  }

  export type RespostaUncheckedUpdateWithoutPesquisaInput = {
    pontoColetaId?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntas?: RespostaPerguntaUncheckedUpdateManyWithoutRespostaNestedInput
  }

  export type RespostaUncheckedUpdateManyWithoutPesquisaInput = {
    pontoColetaId?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpcaoPerguntaCreateManyPerguntaInput = {
    id?: string
    texto: string
    ordem: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaPerguntaCreateManyPerguntaInput = {
    id?: string
    respostaId: string
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    opcaoPerguntaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OpcaoPerguntaUpdateWithoutPerguntaInput = {
    texto?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaPerguntaUpdateManyWithoutOpcaoPerguntaNestedInput
  }

  export type OpcaoPerguntaUncheckedUpdateWithoutPerguntaInput = {
    texto?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    respostas?: RespostaPerguntaUncheckedUpdateManyWithoutOpcaoPerguntaNestedInput
  }

  export type OpcaoPerguntaUncheckedUpdateManyWithoutPerguntaInput = {
    texto?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaPerguntaUpdateWithoutPerguntaInput = {
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resposta?: RespostaUpdateOneRequiredWithoutPerguntasNestedInput
    opcaoPergunta?: OpcaoPerguntaUpdateOneWithoutRespostasNestedInput
  }

  export type RespostaPerguntaUncheckedUpdateWithoutPerguntaInput = {
    respostaId?: StringFieldUpdateOperationsInput | string
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    opcaoPerguntaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaPerguntaUncheckedUpdateManyWithoutPerguntaInput = {
    respostaId?: StringFieldUpdateOperationsInput | string
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    opcaoPerguntaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaPerguntaCreateManyOpcaoPerguntaInput = {
    id?: string
    respostaId: string
    pesquisaId: string
    tipo: $Enums.TipoPergunta
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaPerguntaUpdateWithoutOpcaoPerguntaInput = {
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resposta?: RespostaUpdateOneRequiredWithoutPerguntasNestedInput
    pergunta?: PerguntaUpdateOneRequiredWithoutRespostasNestedInput
  }

  export type RespostaPerguntaUncheckedUpdateWithoutOpcaoPerguntaInput = {
    respostaId?: StringFieldUpdateOperationsInput | string
    pesquisaId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaPerguntaUncheckedUpdateManyWithoutOpcaoPerguntaInput = {
    respostaId?: StringFieldUpdateOperationsInput | string
    pesquisaId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaCreateManyPontoColetaInput = {
    id?: string
    idempotencyKey?: string | null
    submissionHash?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaUpdateWithoutPontoColetaInput = {
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pesquisa?: PesquisaUpdateOneRequiredWithoutRespostasNestedInput
    perguntas?: RespostaPerguntaUpdateManyWithoutRespostaNestedInput
  }

  export type RespostaUncheckedUpdateWithoutPontoColetaInput = {
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    perguntas?: RespostaPerguntaUncheckedUpdateManyWithoutRespostaNestedInput
  }

  export type RespostaUncheckedUpdateManyWithoutPontoColetaInput = {
    idempotencyKey?: NullableStringFieldUpdateOperationsInput | string | null
    submissionHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaPerguntaCreateManyRespostaInput = {
    id?: string
    perguntaId: string
    tipo: $Enums.TipoPergunta
    valorEstrelas?: number | null
    valorNps?: number | null
    valorSimNao?: boolean | null
    valorTexto?: string | null
    opcaoPerguntaId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RespostaPerguntaUpdateWithoutRespostaInput = {
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pergunta?: PerguntaUpdateOneRequiredWithoutRespostasNestedInput
    opcaoPergunta?: OpcaoPerguntaUpdateOneWithoutRespostasNestedInput
  }

  export type RespostaPerguntaUncheckedUpdateWithoutRespostaInput = {
    perguntaId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    opcaoPerguntaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RespostaPerguntaUncheckedUpdateManyWithoutRespostaInput = {
    perguntaId?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoPerguntaFieldUpdateOperationsInput | $Enums.TipoPergunta
    valorEstrelas?: NullableIntFieldUpdateOperationsInput | number | null
    valorNps?: NullableIntFieldUpdateOperationsInput | number | null
    valorSimNao?: NullableBoolFieldUpdateOperationsInput | boolean | null
    valorTexto?: NullableStringFieldUpdateOperationsInput | string | null
    opcaoPerguntaId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}